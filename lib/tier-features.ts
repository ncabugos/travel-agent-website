/**
 * lib/tier-features.ts
 * Central tier-feature matrix. Use `tierAllows(tier, feature)` to gate
 * navigation links, home composition sections, and tier-aware page variants.
 *
 * Source of truth for the pricing tiers in app/page.tsx — keep in sync.
 */

export type Tier = 'starter' | 'growth' | 'custom' | 'agency'

export type TierFeature =
  | 'searchable-hotels'      // Growth+: searchable directory of 1,795+ properties
  | 'searchable-cruises'     // Growth+: searchable cruise directory
  | 'experiences'            // Growth+: experiences directory + home section
  | 'testimonials'           // Growth+: home testimonials section
  | 'instagram-feed'         // Growth+: home Instagram section
  | 'villas'                 // Custom+: villa catalog + nav link
  | 'advisor-directory'      // Agency only: multi-advisor directory page

const FEATURE_MIN_TIER: Record<TierFeature, Tier> = {
  'searchable-hotels':  'growth',
  'searchable-cruises': 'growth',
  'experiences':        'growth',
  'testimonials':       'growth',
  'instagram-feed':     'growth',
  'villas':             'custom',
  'advisor-directory':  'agency',
}

const TIER_RANK: Record<Tier, number> = {
  starter: 0,
  growth:  1,
  custom:  2,
  agency:  3,
}

/**
 * Returns true if a demo at `tier` has access to `feature`.
 * Unknown/null tier defaults to deny — safer than open.
 */
export function tierAllows(tier: Tier | null | undefined, feature: TierFeature): boolean {
  if (!tier) return false
  return TIER_RANK[tier] >= TIER_RANK[FEATURE_MIN_TIER[feature]]
}

/**
 * Filter a nav link array by the features its hrefs map to.
 * Used by T2Nav/T3Nav/T4Nav defaults to drop villa/experiences links
 * for tiers that don't include them.
 */
const HREF_TO_FEATURE: Record<string, TierFeature> = {
  '/book-villa':  'villas',
  '/experiences': 'experiences',
}

export function filterNavByTier<L extends { href: string }>(
  links: L[],
  tier: Tier | null | undefined,
): L[] {
  return links.filter((link) => {
    const feature = HREF_TO_FEATURE[link.href]
    if (!feature) return true
    return tierAllows(tier, feature)
  })
}
