import { getAgentProfile } from '@/lib/suppliers'
import { getBlogPosts } from '@/lib/blog'
import { getAgentHotelPrograms } from '@/lib/hotel-programs'
import { getCruiseLines } from '@/lib/cruise-lines'
import { getPrivateJourneys } from '@/lib/private-journeys'
import { featureAllowed, tierAllows, type Tier } from '@/lib/tier-features'
import { canonicalUrl } from '@/lib/seo'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

interface RouteContext {
  params: Promise<{ agentId: string }>
}

/**
 * Per-tenant sitemap.xml for the Vista (t2) template. Middleware rewrites
 * `https://<vanity>/sitemap.xml` → `/t2/<agentId>/sitemap.xml`, so this is
 * what search engines see for a t2 tenant on a custom domain.
 *
 * Only URLs that return 200 for a normal tenant are listed. Two surfaces are
 * entitlement-gated in their page.tsx and are gated identically here:
 *   - /experiences  → tierAllows(tier, 'experiences')            (Growth+)
 *   - /book-villa   → featureAllowed(tier, modules, 'villas')    (Custom+ or villas module)
 * Lido-only routes (/destinations, /advisors) and the shared /hotels/<slug>
 * catalog (cross-tenant duplicates) are deliberately left out.
 *
 * URLs are absolute and resolve via canonicalUrl() — vanity domain when set,
 * otherwise the platform host.
 */
export async function GET(_req: Request, { params }: RouteContext) {
  const { agentId } = await params
  const [agent, posts, programs, cruises, safaris, jets] = await Promise.all([
    getAgentProfile(agentId),
    getBlogPosts(agentId),
    getAgentHotelPrograms(agentId),
    getCruiseLines(),
    getPrivateJourneys('safari'),
    getPrivateJourneys('jet'),
  ])
  if (!agent) return new Response('Not Found', { status: 404 })

  const tier = agent.tier as Tier | null | undefined
  const modules = agent.active_modules

  const today = new Date().toISOString().slice(0, 10)
  const urls: { loc: string; lastmod?: string; changefreq?: string; priority?: number }[] = [
    { loc: canonicalUrl(agent), lastmod: today, changefreq: 'weekly', priority: 1.0 },
    { loc: canonicalUrl(agent, 'about'), changefreq: 'monthly', priority: 0.8 },
    { loc: canonicalUrl(agent, 'journal'), changefreq: 'weekly', priority: 0.8 },
    { loc: canonicalUrl(agent, 'book-hotel'), changefreq: 'monthly', priority: 0.8 },
    { loc: canonicalUrl(agent, 'find-cruise'), changefreq: 'monthly', priority: 0.8 },
    { loc: canonicalUrl(agent, 'yachts'), changefreq: 'monthly', priority: 0.7 },
    { loc: canonicalUrl(agent, 'safaris'), changefreq: 'monthly', priority: 0.7 },
    { loc: canonicalUrl(agent, 'private-jets'), changefreq: 'monthly', priority: 0.7 },
    { loc: canonicalUrl(agent, 'plan-a-trip'), changefreq: 'yearly', priority: 0.6 },
    { loc: canonicalUrl(agent, 'contact'), changefreq: 'yearly', priority: 0.6 },
  ]

  if (tierAllows(tier, 'experiences')) {
    urls.push({ loc: canonicalUrl(agent, 'experiences'), changefreq: 'monthly', priority: 0.7 })
  }
  if (featureAllowed(tier, modules, 'villas')) {
    urls.push({ loc: canonicalUrl(agent, 'book-villa'), changefreq: 'monthly', priority: 0.7 })
  }

  for (const p of posts) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updated = ((p as any).updated_at ?? (p as any).created_at) as string | undefined
    urls.push({
      loc: canonicalUrl(agent, `journal/${p.slug}`),
      lastmod: updated ? updated.slice(0, 10) : undefined,
      changefreq: 'monthly',
      priority: 0.6,
    })
  }
  for (const program of programs) {
    urls.push({
      loc: canonicalUrl(agent, `book-hotel/${program.slug}`),
      changefreq: 'monthly',
      priority: 0.6,
    })
  }
  for (const cruise of cruises) {
    urls.push({
      loc: canonicalUrl(agent, `find-cruise/${cruise.slug}`),
      changefreq: 'monthly',
      priority: 0.6,
    })
  }
  for (const journey of safaris) {
    urls.push({
      loc: canonicalUrl(agent, `safaris/${journey.slug}`),
      changefreq: 'monthly',
      priority: 0.6,
    })
  }
  for (const journey of jets) {
    urls.push({
      loc: canonicalUrl(agent, `private-jets/${journey.slug}`),
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
