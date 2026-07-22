/**
 * Central display pricing — the single source of truth for every dollar figure
 * shown on marketing and portal surfaces. Stripe price IDs live in
 * lib/stripe.ts; this file is what humans see.
 *
 * Business model v2 (docs/business-model-v2.md): one base site plan with a
 * 30-day complimentary period, à-la-carte expansion modules and services in
 * the portal, Agency consultative. Growth/Custom remain internal tier gates
 * for grandfathered accounts — do not market them as public tiers.
 *
 * Voice note: in copy, the trial is "your first 30 days are with our
 * compliments" — never "free trial".
 */

export const TRIAL_DAYS = 30

/** The one public entry product. */
export const BASE_PLAN = {
  name: 'The Site',
  monthly: 59,
  setup: 0,
  blurb:
    'A custom-branded site on your own domain, the full supplier catalog kept current for you, your journal, and a private lead inbox. Everything a working advisor needs on day one.',
  features: [
    'Custom-branded site on your domain',
    'Hotel programs — Aman, Four Seasons, Belmond, and more',
    'Preferred cruise partners',
    'Journal — write & publish your own posts',
    'Lead inbox & advisor portal',
    'Email support',
  ],
} as const

/**
 * Monthly expansion modules. `legacyTier` is the internal tier whose gate
 * currently grants the module (per-module entitlements are Phase 2 —
 * activation today is handled by the operator on request).
 */
export interface ExpansionModule {
  key: string
  name: string
  monthly: number
  description: string
  legacyTier: 'growth' | 'custom'
}

export const MODULES: ExpansionModule[] = [
  {
    key: 'editorial',
    name: 'Curated editorial stream',
    monthly: 49,
    description: 'A professionally written journal post, published to your site every week.',
    legacyTier: 'growth',
  },
  {
    key: 'editorial-plus',
    name: 'Editorial+',
    monthly: 99,
    description: 'Two posts a week, with topics requested by you.',
    legacyTier: 'custom',
  },
  {
    key: 'directories',
    name: 'Hotel & cruise directories',
    monthly: 39,
    description: 'Searchable directories — 1,795+ properties and the preferred cruise lines.',
    legacyTier: 'growth',
  },
  {
    key: 'instagram',
    name: 'Instagram feed',
    monthly: 19,
    description: 'Your feed, woven into the site.',
    legacyTier: 'growth',
  },
  {
    key: 'villas',
    name: 'Villa catalog',
    monthly: 29,
    description: 'The private villa collection, for advisors who place clients in residences.',
    legacyTier: 'custom',
  },
]

/** One-time and retainer services, ordered from the portal Services page. */
export interface PortalService {
  key: string
  name: string
  price: string
  description: string
}

export const SERVICES: PortalService[] = [
  {
    key: 'new-page',
    name: 'New custom page',
    price: 'from $450',
    description: 'A destination, itinerary, or specialty page — designed and built to your brand.',
  },
  {
    key: 'design-refresh',
    name: 'Design refresh',
    price: 'from $750',
    description: 'Typography, palette, and layout realigned to where your brand is now.',
  },
  {
    key: 'landing-page',
    name: 'Bespoke landing page',
    price: 'from $750',
    description: 'A dedicated page for a campaign, event, or referral audience.',
  },
  {
    key: 'social',
    name: 'Social media management',
    price: 'from $500/mo',
    description: 'Your channels handled — planned, designed, and posted for you.',
  },
  {
    key: 'email',
    name: 'Email marketing',
    price: 'from $500/mo',
    description: 'Client newsletters written and sent under your brand.',
  },
]

/** Agency stays consultative. */
export const AGENCY_PLAN = {
  name: 'Agency',
  fromMonthly: 899,
  blurb:
    'For boutique agencies managing multiple advisors under one brand — an agent directory, agency-wide lead routing, unified billing, and a shared content library.',
} as const

/** US currency, whole dollars. */
export const usd = (n: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
