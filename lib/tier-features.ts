/**
 * lib/tier-features.ts
 * Central feature-entitlement matrix. Two layers (business model v2,
 * docs/business-model-v2.md):
 *
 *  - Legacy tiers (Growth/Custom/Agency) bundle features by rank — these are
 *    internal gates for grandfathered accounts, no longer sold publicly.
 *  - À-la-carte modules (agent_modules table, cached on agents.active_modules)
 *    grant features individually to base-plan agents.
 *
 * Use `featureAllowed(tier, modules, feature)` for gating; a feature is on if
 * EITHER the tier bundles it OR an active module grants it. `tierAllows`
 * remains for tier-only call sites.
 */

export type Tier = 'starter' | 'growth' | 'custom' | 'agency'

/** À-la-carte module keys — must match lib/pricing.ts MODULES and the
 *  agent_modules.module_key CHECK constraint (migration 053). */
export type ModuleKey =
  | 'editorial'        // curated editorial stream, 1 post/week
  | 'editorial-plus'   // 2 posts/week + topic requests
  | 'directories'      // searchable hotel + cruise directories
  | 'instagram'        // Instagram feed section
  | 'villas'           // villa catalog

export type TierFeature =
  | 'searchable-hotels'      // Growth+ or directories module
  | 'searchable-cruises'     // Growth+ or directories module
  | 'experiences'            // Growth+: experiences directory + home section
  | 'testimonials'           // Growth+: home testimonials section
  | 'instagram-feed'         // Growth+ or instagram module
  | 'villas'                 // Custom+ or villas module
  | 'advisor-directory'      // Agency only: multi-advisor directory page
  | 'curated-editorial'      // Growth+ or editorial/editorial-plus module

const FEATURE_MIN_TIER: Record<TierFeature, Tier> = {
  'searchable-hotels':  'growth',
  'searchable-cruises': 'growth',
  'experiences':        'growth',
  'testimonials':       'growth',
  'instagram-feed':     'growth',
  'villas':             'custom',
  'advisor-directory':  'agency',
  'curated-editorial':  'growth',
}

/** Which features each à-la-carte module unlocks. */
const MODULE_GRANTS: Record<ModuleKey, TierFeature[]> = {
  'editorial':      ['curated-editorial'],
  'editorial-plus': ['curated-editorial'],
  'directories':    ['searchable-hotels', 'searchable-cruises'],
  'instagram':      ['instagram-feed'],
  'villas':         ['villas'],
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
 * Full entitlement check: the tier bundles the feature OR an active
 * à-la-carte module grants it. `modules` is agents.active_modules — pass it
 * straight from the agent row (unknown strings are ignored, so a stale cache
 * value can never grant more than the registry allows).
 */
export function featureAllowed(
  tier: Tier | null | undefined,
  modules: string[] | null | undefined,
  feature: TierFeature,
): boolean {
  if (tierAllows(tier, feature)) return true
  if (!modules?.length) return false
  return modules.some((m) =>
    (MODULE_GRANTS[m as ModuleKey] ?? []).includes(feature),
  )
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
  modules?: string[] | null,
): L[] {
  return links.filter((link) => {
    const feature = HREF_TO_FEATURE[link.href]
    if (!feature) return true
    return featureAllowed(tier, modules, feature)
  })
}
