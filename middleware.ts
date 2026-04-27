import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

// ── Custom domain → agentId cache ─────────────────────────────────────────
// In-memory map refreshed every 5 minutes so we don't hit Supabase on every request.
let domainCache: Map<string, { agentId: string; template: string }> = new Map()
let domainCacheUpdatedAt = 0
const DOMAIN_CACHE_TTL = 5 * 60 * 1000 // 5 minutes

async function getDomainMap(): Promise<Map<string, { agentId: string; template: string }>> {
  if (Date.now() - domainCacheUpdatedAt < DOMAIN_CACHE_TTL && domainCache.size > 0) {
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

    const map = new Map<string, { agentId: string; template: string }>()
    for (const row of data ?? []) {
      if (row.custom_domain) {
        // Store with and without www for flexible matching
        const domain = row.custom_domain.toLowerCase().replace(/^www\./, '')
        map.set(domain, { agentId: row.id, template: row.template || 'frontend' })
        map.set(`www.${domain}`, { agentId: row.id, template: row.template || 'frontend' })
      }
    }

    domainCache = map
    domainCacheUpdatedAt = Date.now()
    return map
  } catch {
    return domainCache // return stale cache on error
  }
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
    const match = domainMap.get(host)

    if (match) {
      // Rewrite / → /frontend/{agentId}, /journal/slug → /frontend/{agentId}/journal/slug, etc.
      const basePath = `/${match.template}/${match.agentId}`
      const rewritePath = pathname === '/' ? basePath : `${basePath}${pathname}`

      const url = request.nextUrl.clone()
      url.pathname = rewritePath
      return NextResponse.rewrite(url)
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
