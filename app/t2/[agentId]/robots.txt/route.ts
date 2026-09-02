import { getAgentProfile } from '@/lib/suppliers'
import { canonicalUrl } from '@/lib/seo'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

interface RouteContext {
  params: Promise<{ agentId: string }>
}

/**
 * Per-tenant robots.txt for the Vista (t2) template. Middleware rewrites
 * `https://<vanity>/robots.txt` → `/t2/<agentId>/robots.txt`, so a tenant on
 * a custom domain gets a robots file that points at its own sitemap.
 */
export async function GET(_req: Request, { params }: RouteContext) {
  const { agentId } = await params
  const agent = await getAgentProfile(agentId)
  if (!agent) return new Response('Not Found', { status: 404 })

  const body =
    'User-agent: *\n' +
    'Allow: /\n' +
    'Disallow: /api\n' +
    '\n' +
    `Sitemap: ${canonicalUrl(agent, 'sitemap.xml')}\n`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
