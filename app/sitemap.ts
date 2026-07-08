import type { MetadataRoute } from 'next'
import { getPublishedPosts, getCategories } from '@/lib/marketing-blog'

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_ENV === 'production'
    ? 'https://eliteadvisorhub.com'
    : 'http://localhost:3000')

/**
 * Public marketing sitemap for the platform host (eliteadvisorhub.com).
 *
 * Lists only real, indexable pages. In-page anchors (#features, #pricing)
 * are excluded — Google collapses URL fragments into the homepage, so they
 * are duplicate URLs, not pages. Admin and advisor-portal routes are excluded
 * (auth-gated; also blocked in robots.ts).
 *
 * Individual advisor sites under /frontend|/t2|/t3|/t4 own their SEO via each
 * tenant's custom domain + per-tenant sitemap. Showcase demos are deliberately
 * excluded — they are fixtures, not real businesses, and are noindex'd at the
 * template-layout level, so listing them here would only invite wasted crawls.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const [posts, categories] = await Promise.all([getPublishedPosts(), getCategories()])

  const marketing = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: 'templates', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: 'studio', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: 'insights', priority: 0.8, changeFrequency: 'daily' as const },
    { path: 'insights/author/nick', priority: 0.4, changeFrequency: 'monthly' as const },
    { path: 'schedule-consultation', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: 'support', priority: 0.4, changeFrequency: 'monthly' as const },
    { path: 'privacy', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: 'terms', priority: 0.3, changeFrequency: 'yearly' as const },
  ]

  return [
    ...marketing.map((m) => ({
      url: m.path ? `${SITE_URL}/${m.path}` : SITE_URL,
      lastModified: now,
      changeFrequency: m.changeFrequency,
      priority: m.priority,
    })),
    ...categories.map((c) => ({
      url: `${SITE_URL}/insights/category/${c.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })),
    ...posts.map((p) => ({
      url: `${SITE_URL}/insights/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
