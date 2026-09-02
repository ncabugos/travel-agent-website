/**
 * lib/demo-agents.ts
 * Single source of truth for demo agent slugs.
 * Demos are not rows in the `agents` table — they are rendered from mock data.
 * Broadcast targeting routes demo posts through `blog_posts.target_demo_slugs`.
 */

export interface DemoAgent {
  slug: string
  label: string
  template: 'frontend' | 't2' | 't3' | 't4'
}

export const DEMO_AGENTS: DemoAgent[] = [
  { slug: 'demo-agent', label: 'Eden — Custom (Frontend)', template: 'frontend' },
  { slug: 't2-demo',    label: 'Vista — Standard (T2)',    template: 't2' },
  { slug: 't3-demo',    label: 'Meridian Travel — Standard (T3)', template: 't3' },
  { slug: 'ytc-demo',   label: 'Your Travel Center (T2)',  template: 't2' },
  { slug: 'coast-compass-demo', label: 'Coast & Compass Travel (T2 Vista — Growth)', template: 't2' },
  { slug: 'lido-collective', label: 'The Lido Collective (T2 — Agency)', template: 't2' },
  { slug: 'casa-solis', label: 'Casa Solis — Custom (T4)', template: 't4' },
]

export const DEMO_SLUGS = new Set(DEMO_AGENTS.map(d => d.slug))

export const isDemoSlug = (id: string): boolean => DEMO_SLUGS.has(id)

/**
 * Demo slugs that are ALSO published as live, indexable sites. They render from
 * mock data but should be treated like a real tenant for SEO (indexable + their
 * own canonical). Currently empty — Wine & Wellness Travel was promoted to a
 * real tenant on wineandwellnesstravel.com and its `wwt-demo` slug now 301s
 * there (see middleware.ts RETIRED_DEMO_REDIRECTS).
 */
export const PUBLISHED_DEMO_SLUGS = new Set<string>([])

export const isPublishedDemoSlug = (id: string): boolean =>
  PUBLISHED_DEMO_SLUGS.has(id)

export function journalBasePath(slug: string): string {
  const demo = DEMO_AGENTS.find(d => d.slug === slug)
  if (!demo) return `/frontend/${slug}/blog`
  return demo.template === 'frontend'
    ? `/frontend/${slug}/blog`
    : `/${demo.template}/${slug}/journal`
}
