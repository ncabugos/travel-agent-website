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
    monthly: 'price_1TYYar6lYeMpqwzvksQeEHYh',   // $89/mo  (live)
    setup:   'price_1TYYbQ6lYeMpqwzv2J7JKEeE',   // $499 one-time (live)
    product: '',
  },
  growth: {
    monthly: 'price_1TYYcN6lYeMpqwzv0TceZfhu',   // $179/mo (live)
    setup:   'price_1TYYcN6lYeMpqwzvj56LvL9W',   // $1,499 one-time (live)
    product: '',
  },
  custom: {
    monthly: 'price_1TYYdK6lYeMpqwzvZNFZGhQH',   // $349/mo (live)
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
    setup:   '',
    product: '',
  },
} as const

export type TierName = keyof typeof TIER_PRICES
