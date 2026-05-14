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
