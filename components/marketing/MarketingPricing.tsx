'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CheckoutButton } from '@/components/stripe/CheckoutButton'

// ── Pricing data ─────────────────────────────────────────────────────────────
// Annual pricing uses the "2 months free" pattern: pay for 10 months, get 12.
// That's ~16.7% off — the most common discount level for prosumer SaaS, and
// the right brand-fit for EAH's premium positioning (Webflow/Squarespace go
// 25–30%, but that messaging reads commodity. "2 months free" reads premium
// and confident, and leaves headroom above Founding pricing.)
//
// Effective monthly = annual / 12 (rounded down to a whole dollar for clean
// display). The original $/mo number is what appears on monthly billing.
//
// Agency stays consultation-only on both tabs — annual terms get negotiated
// in-contract for that tier.

type Tier = 'starter' | 'growth' | 'custom' | 'agency'
type BillingCycle = 'monthly' | 'annual'

interface PricingTier {
  name: string
  tier: Tier
  monthly: number               // $/mo on the monthly plan
  annual: number | null         // total $ billed once per year (null = quote-only)
  annualEffectiveMonthly: number | null // rounded $/mo equivalent when annual
  setup: string | null
  popular: boolean
  blurb: string
  features: string[]
  cta: 'checkout' | 'consultation'
}

const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Starter',
    tier: 'starter',
    monthly: 89,
    annual: 890,
    annualEffectiveMonthly: 74,
    setup: '$499',
    popular: false,
    blurb:
      'A foothold on the platform. A custom-branded site, the full supplier catalog, your lead inbox, and a clean editor for your own journal. A portal that scales with you, for advisors building toward Growth.',
    features: [
      'Custom-branded site with your domain',
      'Journal — write & publish your own posts',
      'Advisor portal access',
      'Hotel programs — Aman, Four Seasons, Belmond, and more',
      'Preferred cruise partners overview',
      'Email support',
    ],
    cta: 'checkout',
  },
  {
    name: 'Growth',
    tier: 'growth',
    monthly: 179,
    annual: 1790,
    annualEffectiveMonthly: 149,
    setup: '$1,499',
    popular: true,
    blurb:
      'For advisors with an established book — a searchable hotel directory of 1,795+ properties, cruise partners, an Instagram feed, and a curated editorial stream that publishes to your site every week.',
    features: [
      'Everything in Starter',
      'Curated editorial stream (1 post/week)',
      'Searchable hotel directory (1,795+ properties)',
      'Searchable cruise directory',
      'Experiences directory',
      'Instagram feed integration',
      'Priority support',
    ],
    cta: 'checkout',
  },
  {
    name: 'Custom',
    tier: 'custom',
    monthly: 349,
    annual: 3490,
    annualEffectiveMonthly: 291,
    setup: '$2,999',
    popular: false,
    blurb:
      "For advisors whose brand already exists in their clients' minds. We align the platform to it — typography, palette, premium modules, the bespoke landing pages your referrals expect.",
    features: [
      'Everything in Growth',
      'Fully bespoke design built around your brand',
      'Villa catalog access',
      'Custom-branded topic requests (2 posts/week)',
      'Bespoke landing pages',
      'Dedicated design consultation',
    ],
    cta: 'checkout',
  },
  {
    name: 'Agency',
    tier: 'agency',
    monthly: 899,
    annual: null,
    annualEffectiveMonthly: null,
    setup: 'from $4,999',
    popular: false,
    blurb:
      'For boutique agencies managing multiple advisors under one brand — an agent directory of individual advisor profiles, agency-wide lead routing, unified billing, a shared content library, and co-authored editorial. Built for practices that have outgrown a single site.',
    features: [
      'Everything in Custom',
      'Agent directory — individual advisor profiles under one brand',
      'Agency-wide lead routing',
      'Unified billing',
      'Co-authored editorial (2 posts/week per advisor)',
      'Shared content library',
      'Team onboarding',
    ],
    cta: 'consultation',
  },
]

// US currency formatter, no cents (all our prices are whole dollars).
const usd = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

export function MarketingPricing() {
  const [cycle, setCycle] = useState<BillingCycle>('monthly')

  // Deep-linkable: visit /?cycle=annual#pricing (e.g. from the consultation
  // page) and the Annual toggle is pre-selected. Read after mount to avoid
  // needing a Suspense boundary; the initial render is monthly, then we
  // flip to annual if the query param says so. Setting state inside a one-
  // shot effect runs before the user can see flicker on a typical paint.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    if (params.get('cycle') === 'annual') setCycle('annual')
  }, [])

  return (
    <section
      id="pricing"
      style={{
        padding: '100px 24px',
        backgroundColor: '#fafafa',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <h2
          style={{
            fontSize: '36px',
            fontWeight: 700,
            textAlign: 'center',
            letterSpacing: '-0.02em',
            margin: '0 0 12px',
          }}
        >
          Simple, transparent pricing
        </h2>
        <p
          style={{
            textAlign: 'center',
            fontSize: '16px',
            color: '#6b7280',
            margin: '0 0 32px',
          }}
        >
          Choose the plan that fits your business.
        </p>

        {/* Billing-cycle toggle */}
        <BillingToggle cycle={cycle} onChange={setCycle} />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
            marginTop: '48px',
          }}
          className="eah-pricing-grid"
        >
          {PRICING_TIERS.map((plan) => (
            <PricingCard key={plan.name} plan={plan} cycle={cycle} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Toggle ───────────────────────────────────────────────────────────────────

interface BillingToggleProps {
  cycle: BillingCycle
  onChange: (cycle: BillingCycle) => void
}

function BillingToggle({ cycle, onChange }: BillingToggleProps) {
  return (
    <div
      role="tablist"
      aria-label="Billing cycle"
      style={{
        display: 'inline-flex',
        margin: '0 auto',
        position: 'relative',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '4px',
        backgroundColor: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '999px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      }}
    >
      <ToggleButton
        active={cycle === 'monthly'}
        onClick={() => onChange('monthly')}
        label="Monthly"
      />
      <ToggleButton
        active={cycle === 'annual'}
        onClick={() => onChange('annual')}
        label="Annual"
        badge="2 months free"
      />
    </div>
  )
}

interface ToggleButtonProps {
  active: boolean
  onClick: () => void
  label: string
  badge?: string
}

function ToggleButton({ active, onClick, label, badge }: ToggleButtonProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 20px',
        fontSize: '14px',
        fontWeight: 600,
        color: active ? '#fff' : '#374151',
        backgroundColor: active ? '#111' : 'transparent',
        border: 'none',
        borderRadius: '999px',
        cursor: 'pointer',
        transition: 'background-color 0.15s, color 0.15s',
      }}
    >
      {label}
      {badge && (
        <span
          style={{
            fontSize: '11px',
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: '999px',
            letterSpacing: '0.02em',
            backgroundColor: active ? 'rgba(255,255,255,0.18)' : '#ecfdf5',
            color: active ? '#fff' : '#047857',
          }}
        >
          {badge}
        </span>
      )}
    </button>
  )
}

// ── Card ─────────────────────────────────────────────────────────────────────

interface PricingCardProps {
  plan: PricingTier
  cycle: BillingCycle
}

function PricingCard({ plan, cycle }: PricingCardProps) {
  const isAgency = plan.tier === 'agency'
  // Agency is quote-only on both tabs; everyone else gets annual pricing.
  const showAnnual = cycle === 'annual' && !isAgency && plan.annual != null && plan.annualEffectiveMonthly != null
  const annualSavings = plan.annual != null ? plan.monthly * 12 - plan.annual : 0

  return (
    <div
      style={{
        padding: '36px 28px',
        borderRadius: '16px',
        backgroundColor: '#fff',
        border: plan.popular ? '2px solid #7c3aed' : '1px solid #e5e7eb',
        position: 'relative',
        boxShadow: plan.popular ? '0 8px 30px rgba(0,0,0,0.08)' : 'none',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {plan.popular && (
        <div
          style={{
            position: 'absolute',
            top: '-12px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#7c3aed',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 600,
            padding: '4px 16px',
            borderRadius: '20px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Most Popular
        </div>
      )}

      <h3 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 600 }}>{plan.name}</h3>

      {/* Price block */}
      <div style={{ marginBottom: '8px' }}>
        {isAgency ? (
          <span style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.02em', color: '#111' }}>
            from {usd(plan.monthly)}
            <span style={{ fontSize: '14px', fontWeight: 400, color: '#6b7280' }}>/month</span>
          </span>
        ) : showAnnual ? (
          <>
            <span style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.03em' }}>
              {usd(plan.annualEffectiveMonthly!)}
            </span>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>/month</span>
          </>
        ) : (
          <>
            <span style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.03em' }}>
              {usd(plan.monthly)}
            </span>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>/month</span>
          </>
        )}
      </div>

      {/* Secondary price line — annual total / savings, or setup fee */}
      <p
        style={{
          fontSize: '13px',
          color: '#9ca3af',
          margin: '0 0 24px',
          minHeight: '20px',
          lineHeight: 1.5,
        }}
      >
        {showAnnual && plan.annual != null ? (
          <>
            {usd(plan.annual)} billed annually
            {annualSavings > 0 && (
              <>
                {' · '}
                <span style={{ color: '#047857', fontWeight: 600 }}>
                  Save {usd(annualSavings)}/yr
                </span>
              </>
            )}
            {plan.setup ? <><br />+ {plan.setup} one-time setup</> : null}
          </>
        ) : plan.setup ? (
          <>+ {plan.setup} one-time setup</>
        ) : (
          ' '
        )}
      </p>

      <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.55, margin: '0 0 20px' }}>
        {plan.blurb}
      </p>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          marginBottom: '28px',
          flex: 1,
        }}
      >
        {plan.features.map((f) => (
          <div
            key={f}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              fontSize: '13px',
              color: '#374151',
              lineHeight: 1.45,
            }}
          >
            <span style={{ color: '#16a34a', fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>✓</span> {f}
          </div>
        ))}
      </div>

      <PricingCta plan={plan} cycle={cycle} />
    </div>
  )
}

// ── CTA ──────────────────────────────────────────────────────────────────────
// Self-serve checkout tiers (Starter, Growth, Custom) → Stripe checkout on
// both cycles. The CheckoutButton sends billingCycle to /api/stripe/checkout,
// which picks the right recurring price ID from TIER_PRICES[tier].monthly | .annual.
// Agency stays /schedule-consultation regardless of cycle (custom-priced per seat).

function PricingCta({ plan, cycle }: PricingCardProps) {
  // Stripe checkout path — Starter, Growth, Custom on either cycle.
  if (plan.cta === 'checkout') {
    return (
      <CheckoutButton
        tier={plan.tier as 'starter' | 'growth' | 'custom'}
        popular={plan.popular}
        billingCycle={cycle}
      >
        {cycle === 'annual' ? 'Start Annual Plan' : 'Begin Setup'}
      </CheckoutButton>
    )
  }

  // Consultation route for Agency on either cycle.
  const href = `/schedule-consultation?tier=${plan.tier}${cycle === 'annual' ? '&billing=annual' : ''}`
  const ctaLabel = 'Schedule a Consultation'

  return (
    <Link
      href={href}
      style={{
        display: 'block',
        textAlign: 'center',
        padding: '12px 20px',
        borderRadius: '10px',
        backgroundColor: plan.popular ? '#111' : '#fff',
        color: plan.popular ? '#fff' : '#111',
        border: plan.popular ? '1px solid #111' : '1px solid #111',
        fontSize: '14px',
        fontWeight: 600,
        textDecoration: 'none',
        transition: 'background 0.15s, color 0.15s',
      }}
    >
      {ctaLabel}
    </Link>
  )
}
