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
 * Each tier has a monthly recurring price and a one-time setup fee.
 */
export const TIER_PRICES = {
  starter: {
    monthly: 'price_1TX7jk8v2wD2qM7NPeCGVf4z',   // $89/mo
    setup:   'price_1TX7kB8v2wD2qM7Nt2qubW0a',   // $499 one-time
    product: 'prod_UL1AMnVvNsNdOS',
  },
  growth: {
    monthly: 'price_1TX7i18v2wD2qM7N56tXNpcz',   // $179/mo
    setup:   'price_1TX7im8v2wD2qM7NBzIVHzQY',   // $1,499 one-time
    product: 'prod_UL1CqmRyDAyIsY',
  },
  custom: {
    monthly: 'price_1TX7l48v2wD2qM7NlhFixCZW',   // $349/mo
    setup:   'price_1TX7lV8v2wD2qM7N753J5nyp',   // $2,999 one-time
    product: 'prod_UL1Dq1k2RMpTfI',
  },
  // Agency is a consultation-only tier (custom-priced per seat). No Stripe
  // prices are configured; agency onboarding is handled off-Stripe until a
  // quote is accepted. The entries here exist so tier-lookups don't crash
  // if this value lands on an agency record accidentally.
  // TODO: populate once Agency pricing is productized.
  agency: {
    monthly: '',
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
 * subscription. Founding checkouts charge no setup fee and run a 90-day trial.
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
 * 90-day trial means $0 is charged at signup; a real founding subscription can
 * be cancelled before day 90 if a live end-to-end check is needed.
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
