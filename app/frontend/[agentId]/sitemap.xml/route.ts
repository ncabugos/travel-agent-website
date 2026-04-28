import { getAgentProfile } from '@/lib/suppliers'
import { getBlogPosts } from '@/lib/blog'
import { getAgentHotelPrograms } from '@/lib/hotel-programs'
import { canonicalUrl } from '@/lib/seo'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

interface RouteContext {
  params: Promise<{ agentId: string }>
}

/**
 * Per-tenant sitemap.xml. Includes home, about, press, journal index, every
 * journal post, resources hub, every hotel program page, and contact.
 *
 * URLs are absolute and resolve via canonicalUrl() — vanity domain when set,
 * otherwise the platform host. Update Search Console with a fresh ping when
 * a tenant launches a vanity domain.
 */
export async function GET(_req: Request, { params }: RouteContext) {
  const { agentId } = await params
  const [agent, posts, programs] = await Promise.all([
    getAgentProfile(agentId),
    getBlogPosts(agentId),
    getAgentHotelPrograms(agentId),
  ])
  if (!agent) return new Response('Not Found', { status: 404 })

  const today = new Date().toISOString().slice(0, 10)
  const urls: { loc: string; lastmod?: string; changefreq?: string; priority?: number }[] = [
    { loc: canonicalUrl(agent), lastmod: today, changefreq: 'weekly', priority: 1.0 },
    { loc: canonicalUrl(agent, 'about'), changefreq: 'monthly', priority: 0.8 },
    { loc: canonicalUrl(agent, 'media'), changefreq: 'monthly', priority: 0.7 },
    { loc: canonicalUrl(agent, 'blog'), changefreq: 'weekly', priority: 0.8 },
    { loc: canonicalUrl(agent, 'resources'), changefreq: 'monthly', priority: 0.8 },
    { loc: canonicalUrl(agent, 'contact'), changefreq: 'yearly', priority: 0.6 },
  ]

  for (const p of posts) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updated = ((p as any).updated_at ?? (p as any).created_at) as string | undefined
    urls.push({
      loc: canonicalUrl(agent, `blog/${p.slug}`),
      lastmod: updated ? updated.slice(0, 10) : undefined,
      changefreq: 'monthly',
      priority: 0.6,
    })
  }
  for (const program of programs) {
    urls.push({
      loc: canonicalUrl(agent, `resources/${program.slug}`),
      changefreq: 'monthly',
      priority: 0.6,
    })
  }

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls
      .map(
        (u) =>
          `  <url><loc>${escapeXml(u.loc)}</loc>` +
          (u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : '') +
          (u.changefreq ? `<changefreq>${u.changefreq}</changefreq>` : '') +
          (u.priority !== undefined ? `<priority>${u.priority.toFixed(1)}</priority>` : '') +
          '</url>'
      )
      .join('\n') +
    '\n</urlset>\n'

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
