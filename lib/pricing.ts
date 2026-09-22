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
  monthly: 79,
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

/**
 * Public plans (September 2026). Three tiers shown on the homepage pricing
 * section; every consultation is quoted from these. Stripe still bills the
 * BASE_PLAN above until per-tier prices exist — see docs/business-model-v2.md.
 */
export interface PublicTier {
  key: 'starter' | 'growth' | 'agency'
  name: string
  /** Omitted when the monthly rate is quoted on a consultation. */
  monthly?: number
  setup: number
  audience: string
  highlight: boolean
  includes?: string
  features: string[]
}

export const PUBLIC_TIERS: PublicTier[] = [
  {
    key: 'starter',
    name: 'Starter',
    monthly: 59,
    setup: 1499,
    audience: 'For solo advisors launching a first independent site.',
    highlight: false,
    features: [
      'Custom-branded 4-page site on your own domain',
      'Hotel program pages: Aman, Four Seasons, Belmond, and more',
      'Journal: write and publish your own posts',
      'Contact form and private lead inbox',
      'SEO, AEO, and GEO: sitemap and structured data',
      'Client testimonials',
      'Instagram feed',
      'Curated supplier media gallery',
      'One-on-one support',
      'Analytics and tracking',
    ],
  },
  {
    key: 'growth',
    name: 'Boutique Agency',
    monthly: 79,
    setup: 2500,
    audience: 'For established advisors and small teams with real volume.',
    highlight: true,
    includes: 'Everything in Starter, plus',
    features: [
      'Hotel directory: 1,795+ properties with lead routing',
      'Cruise directory',
      'Curated editorial: one written post a week',
      'YouTube integration',
      'CRM integration',
      'Team page with advisor profiles',
      'Villa catalog add-on, $29/mo',
    ],
  },
  {
    key: 'agency',
    name: 'Agency',
    setup: 4999,
    audience: 'For multi-advisor agencies under one brand and one bill.',
    highlight: false,
    includes: 'Everything in Boutique Agency, plus',
    features: [
      'Multiple advisors under one agency brand',
      'Every affiliate site managed in one place',
      'Advisor directory with a profile page per advisor',
      'Per-advisor lead routing',
      'Co-authored editorial: two posts a week per advisor',
      'White-label branding',
      'Villa catalog and bespoke design',
      'Unified billing across advisors',
    ],
  },
]
