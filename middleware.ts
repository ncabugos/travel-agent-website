import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

// ── Custom domain → agentId cache ─────────────────────────────────────────
// In-memory map refreshed every 5 minutes so we don't hit Supabase on every request.
type DomainCacheEntry = { agentId: string; template: string }
interface DomainMaps {
  byDomain: Map<string, DomainCacheEntry>
  byAgentId: Map<string, { domain: string; template: string }>
}
let domainCache: DomainMaps = { byDomain: new Map(), byAgentId: new Map() }
let domainCacheUpdatedAt = 0
const DOMAIN_CACHE_TTL = 5 * 60 * 1000 // 5 minutes

async function getDomainMap(): Promise<DomainMaps> {
  if (Date.now() - domainCacheUpdatedAt < DOMAIN_CACHE_TTL && domainCache.byDomain.size > 0) {
    return domainCache
  }

  try {
    const serviceClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { data } = await serviceClient
      .from('agents')
      .select('id, custom_domain, template')
      .not('custom_domain', 'is', null)

    const byDomain = new Map<string, DomainCacheEntry>()
    const byAgentId = new Map<string, { domain: string; template: string }>()
    for (const row of data ?? []) {
      if (row.custom_domain) {
        // Store with and without www for flexible matching
        const apex = row.custom_domain.toLowerCase().replace(/^www\./, '')
        const template = row.template || 'frontend'
        byDomain.set(apex, { agentId: row.id, template })
        byDomain.set(`www.${apex}`, { agentId: row.id, template })
        // Reverse lookup: agentId → canonical apex domain (no www).
        byAgentId.set(row.id, { domain: apex, template })
      }
    }

    domainCache = { byDomain, byAgentId }
    domainCacheUpdatedAt = Date.now()
    return domainCache
  } catch {
    return domainCache // return stale cache on error
  }
}

/**
 * Match `/{template}/{agentId}/{...rest}` and pull out the parts so we can
 * (a) strip the prefix on a vanity domain, or (b) redirect platform paths
 * to the agent's vanity domain. Returns null if the path isn't a tenant path.
 */
const TENANT_PATH = /^\/(frontend|t2|t3|t4)\/([0-9a-f-]{36})(\/.*)?$/i
function parseTenantPath(pathname: string): { template: string; agentId: string; rest: string } | null {
  const m = TENANT_PATH.exec(pathname)
  if (!m) return null
  return { template: m[1], agentId: m[2], rest: m[3] ?? '' }
}

// Known platform hostnames that should NOT trigger domain routing
const PLATFORM_HOSTS = new Set([
  'localhost',
  'eliteadvisorhub.com',
  'www.eliteadvisorhub.com',
])
const isPlatformHost = (host: string) =>
  PLATFORM_HOSTS.has(host) || host.endsWith('.vercel.app') || host.includes('localhost')

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── Custom domain routing ───────────────────────────────────────────────
  // If the request comes from a custom domain (not our platform host),
  // rewrite to /frontend/{agentId} or /t2/{agentId} transparently.
  const host = request.headers.get('host')?.toLowerCase().replace(/:\d+$/, '') ?? ''

  if (!isPlatformHost(host) && !pathname.startsWith('/admin') && !pathname.startsWith('/agent-portal') && !pathname.startsWith('/api')) {
    const domainMap = await getDomainMap()
    const match = domainMap.byDomain.get(host)

    if (match) {
      // ── Redirect /{template}/{agentId}/* on the vanity domain to the
      // clean path. This handles directly shared/bookmarked links that
      // include the platform prefix and prevents the rewrite below from
      // producing a /{template}/{agentId}/{template}/{agentId}/* 404.
      const tenantPath = parseTenantPath(pathname)
      if (tenantPath && tenantPath.agentId === match.agentId) {
        const url = request.nextUrl.clone()
        url.pathname = tenantPath.rest || '/'
        return NextResponse.redirect(url, 301)
      }

      // Rewrite / → /frontend/{agentId}, /journal/slug → /frontend/{agentId}/journal/slug, etc.
      const basePath = `/${match.template}/${match.agentId}`
      const rewritePath = pathname === '/' ? basePath : `${basePath}${pathname}`

      const url = request.nextUrl.clone()
      url.pathname = rewritePath
      return NextResponse.rewrite(url)
    }
  }

  // ── Platform host: redirect /{template}/{agentId}/* to the agent's
  //    vanity domain when one is configured. Consolidates SEO equity and
  //    keeps Google indexing only the canonical (vanity) URL.
  if (isPlatformHost(host)) {
    const tenantPath = parseTenantPath(pathname)
    if (tenantPath) {
      const domainMap = await getDomainMap()
      const reverse = domainMap.byAgentId.get(tenantPath.agentId)
      if (reverse) {
        const url = request.nextUrl.clone()
        url.protocol = 'https:'
        url.host = reverse.domain
        url.port = ''
        url.pathname = tenantPath.rest || '/'
        return NextResponse.redirect(url, 301)
      }
    }
  }

  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Refresh session (important for SSR)
  const { data: { session } } = await supabase.auth.getSession()

  // ── Admin routes (/admin/* except /admin/login) ──────────────────────────
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!session) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Use service role client to bypass RLS for admin check
    const serviceClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { data: agent } = await serviceClient
      .from('agents')
      .select('role')
      .eq('email', session.user.email ?? '')
      .single()

    if (!agent || agent.role !== 'super_admin') {
      // Not an admin — redirect to agent portal or login
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('error', 'unauthorized')
      return NextResponse.redirect(loginUrl)
    }
  }

  // ── Agent portal routes (/agent-portal/* except /agent-portal/login) ─────
  if (pathname.startsWith('/agent-portal') && !pathname.startsWith('/agent-portal/login')) {
    if (!session) {
      return NextResponse.redirect(new URL('/agent-portal/login', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public assets (images, media, etc.)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|media/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
}
