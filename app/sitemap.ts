import type { MetadataRoute } from 'next'

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_ENV === 'production'
    ? 'https://eliteadvisorhub.com'
    : 'http://localhost:3000')

/**
 * Public sitemap.
 *
 * Only marketing + demo routes are listed. Advisor-portal and admin
 * routes are deliberately excluded because they require authentication.
 * Individual advisor sites at /frontend/[agentId] and /t2/[agentId] and
 * /t3/[agentId] are not auto-listed here — we rely on each advisor's
 * custom domain to own its own SEO footprint.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const marketing = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '#features', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '#pricing', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '#demos', priority: 0.8, changeFrequency: 'monthly' as const },
  ]

  const demos = [
    { path: '/frontend/demo-agent', priority: 0.6 },
    { path: '/t2/t2-demo', priority: 0.6 },
    { path: '/t3/t3-demo', priority: 0.6 },
    { path: '/t2/ytc-demo', priority: 0.5 },
  ]

  return [
    ...marketing.map((m) => ({
      url: `${SITE_URL}/${m.path}`.replace(/\/$/, '') + (m.path.startsWith('#') ? '' : ''),
      lastModified: now,
      changeFrequency: m.changeFrequency,
      priority: m.priority,
    })),
    ...demos.map((d) => ({
      url: `${SITE_URL}${d.path}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: d.priority,
    })),
  ]
}
