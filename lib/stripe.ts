import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set')
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { typescript: true })
  }
  return _stripe
}

/** @deprecated Use getStripe() — kept for backward compatibility */
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripe() as any)[prop]
  },
})

/**
 * Stripe price configuration for each tier.
 *
 * Each tier has:
 *   - monthly:  recurring monthly price ID
 *   - annual:   recurring annual price ID (2-months-free discount, ~16.7% off)
 *   - setup:    one-time setup fee price ID (same on monthly + annual)
 *   - product:  Stripe Product ID (kept for reference; not used at runtime)
 *
 * Annual tiers are billed once per year, in advance, on the same product as
 * the monthly tier so revenue reporting stays unified. Empty string ('') means
 * the tier is consultation-only on that billing cycle and the checkout route
 * will reject it.
 */
export const TIER_PRICES = {
  // Business model v2 (docs/business-model-v2.md): the public entry product is
  // $59/mo, no setup fee, 30-day trial (applied by the checkout route via
  // trial_period_days, not by the price).
  // Annual returns once a $590/yr price exists (old $890/yr ID retired:
  // price_1TbUbr6lYeMpqwzvdWFHIMsj; old $89/mo: price_1TYYar6lYeMpqwzvksQeEHYh;
  // old $499 setup: price_1TYYbQ6lYeMpqwzv2J7JKEeE).
  // HOTFIX 2026-07-22: price_1TvlHU6lYeMpqwzvVyDg1H42 was created with a $0.00
  // amount (live checkout showed "$0.00/month after trial") — archive it in the
  // dashboard so it can't be reused. Interim: founding-starter's verified $59/mo
  // live price. Swap in a dedicated $59 "base" price once minted correctly.
  starter: {
    monthly: 'price_1TZg2r6lYeMpqwzvoUUoY30Z',   // $59/mo (live — shared with founding-starter)
    annual:  '',                                  // no $590/yr price yet — monthly-only
    setup:   '',                                  // no setup fee on the base plan
    product: '',
  },
  growth: {
    monthly: 'price_1TYYcN6lYeMpqwzv0TceZfhu',   // $179/mo (live)
    annual:  'price_1TbUcI6lYeMpqwzvZzBIfMvO',   // $1,790/yr (live, 2-months-free)
    setup:   'price_1TYYcN6lYeMpqwzvj56LvL9W',   // $1,499 one-time (live)
    product: '',
  },
  custom: {
    monthly: 'price_1TYYdK6lYeMpqwzvZNFZGhQH',   // $349/mo (live)
    annual:  'price_1TbUdW6lYeMpqwzvFcUjXYHY',   // $3,490/yr (live, 2-months-free)
    setup:   'price_1TYYdK6lYeMpqwzvPWD6tTrb',   // $2,999 one-time (live)
    product: '',
  },
  // Agency is a consultation-only tier (custom-priced per seat). No Stripe
  // prices are configured; agency onboarding is handled off-Stripe until a
  // quote is accepted. The entries here exist so tier-lookups don't crash
  // if this value lands on an agency record accidentally.
  // TODO: populate once Agency pricing is productized.
  agency: {
    monthly: '',
    annual:  '',
    setup:   '',
    product: '',
  },
} as const

export type TierName = keyof typeof TIER_PRICES

/**
 * Founding Advisor (invitation-only beta) pricing.
 *
 * These are NEW recurring monthly prices created on the SAME existing products
 * as the standard tiers, so revenue reporting stays unified. The founding
 * discount is the price itself (not a coupon), which is why it never expires —
 * the subscription simply sits on the founding price for the life of the
 * subscription. Founding checkouts charge no setup fee and run a 30-day trial.
 * See EAH_Beta_Launch_Build_Kit.md, Part A.
 *
 * Agency has no founding price (it is consultation-only / off-Stripe).
 *
 * The price IDs below are the Stripe founding prices, created in the dashboard
 * as founding-starter $59/mo, founding-growth $119/mo, founding-custom $249/mo
 * on products prod_UL1A…, prod_UL1C…, prod_UL1D… respectively.
 *
 * NOTE: these are LIVE-MODE price IDs (confirmed). There is intentionally no
 * test-mode equivalent — the founding checkout runs against live Stripe only,
 * so it cannot be exercised in test mode or with a Stripe test clock. The
 * 30-day trial means $0 is charged at signup; a real founding subscription can
 * be cancelled before day 30 if a live end-to-end check is needed.
 */
export const FOUNDING_PRICES = {
  starter: {
    monthly: 'price_1TZg2r6lYeMpqwzvoUUoY30Z',   // $59/mo  — founding-starter
    product: 'prod_UL1AMnVvNsNdOS',
  },
  growth: {
    monthly: 'price_1TZg3M6lYeMpqwzvzHoo6I45',   // $119/mo — founding-growth
    product: 'prod_UL1CqmRyDAyIsY',
  },
  custom: {
    monthly: 'price_1TZg3o6lYeMpqwzvPO1ntigr',   // $249/mo — founding-custom
    product: 'prod_UL1Dq1k2RMpTfI',
  },
} as const

export type FoundingTierName = keyof typeof FOUNDING_PRICES

/**
 * À-la-carte module prices (business model v2, docs/business-model-v2.md).
 *
 * Each module is a recurring monthly price billed as an ADDITIONAL SUBSCRIPTION
 * ITEM on the agent's existing base subscription — one invoice, prorated on
 * add/remove. Keys must match lib/tier-features.ts ModuleKey and the
 * agent_modules.module_key CHECK (migration 053).
 *
 * Empty string = price not yet created in the Stripe dashboard. The portal
 * treats those modules as request-only (the edit_requests flow) instead of
 * self-serve.
 *
 * LIVE-MODE price IDs (created 2026-07-21, one product per module so invoice
 * line items read cleanly). Display prices live in lib/pricing.ts — keep both
 * in sync: editorial $49 · editorial-plus $99 · directories $39 ·
 * instagram $19 · villas $29.
 */
export const MODULE_PRICES: Record<
  'editorial' | 'editorial-plus' | 'directories' | 'instagram' | 'villas',
  string
> = {
  'editorial':      'price_1TvsG46lYeMpqwzv7iHtQYXM',   // Curated Editorial Stream $49/mo
  'editorial-plus': 'price_1TvsG56lYeMpqwzvAThMPnrI',   // Editorial+ $99/mo
  'directories':    'price_1TvsG56lYeMpqwzvKdRp990J',   // Hotel & Cruise Directories $39/mo
  'instagram':      'price_1TvsG66lYeMpqwzvv2sIzwV0',   // Instagram Feed $19/mo
  'villas':         'price_1TvsG76lYeMpqwzv48tYKnhR',   // Villa Catalog $29/mo
}

/** Reverse lookup: Stripe price ID → module key (empty IDs are ignored). */
export function moduleKeyForPrice(priceId: string): keyof typeof MODULE_PRICES | null {
  for (const [key, id] of Object.entries(MODULE_PRICES)) {
    if (id && id === priceId) return key as keyof typeof MODULE_PRICES
  }
  return null
}
