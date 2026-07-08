'use client'

import { useState } from 'react'

// ── Studio plans ─────────────────────────────────────────────────────────────
// One flat monthly retainer per plan. Annual uses the platform's "2 months free"
// pattern: pay for 10 months, get 12. Effective monthly = annual / 12.
//
// The card feature lists are intentionally short (headline differentiators only);
// the full per-plan detail lives in the comparison matrix below, so the two never
// duplicate each other.

// Brand tokens (see app/globals.css) — the whole Studio page shares these.
// Purple = actions/emphasis, gold = editorial accents (brand/EAH_Brand_Style_Guide.html).
const GOLD = '#B49A5A'
const GOLD_D = '#9A8348'
const PURPLE = '#7C3AED'
const PURPLE_GRAD = 'linear-gradient(135deg, #7c3aed, #a78bfa)'
const INK = '#1A1715'
const BODY = '#57514A'
const MUTE = '#8A8279'
const LINE = '#E8E4DC'
const CREAM = '#FAFAF5'
const PANEL = '#F4EFE6'

type PlanSlug = 'essential' | 'professional' | 'full-service'

interface StudioPlan {
  name: string
  slug: PlanSlug
  monthly: number
  popular: boolean
  blurb: string
  features: string[]
}

const PLANS: StudioPlan[] = [
  {
    name: 'Essential',
    slug: 'essential',
    monthly: 950,
    popular: false,
    blurb: 'Stay visible without the work. For solo advisors who want a current, consistent presence handled for them.',
    features: [
      'One active request at a time',
      '~8–12 social posts + 1 journal article a month',
      'Monthly newsletter',
      'Site kept current · annual AI-visibility snapshot',
    ],
  },
  {
    name: 'Professional',
    slug: 'professional',
    monthly: 1850,
    popular: true,
    blurb: 'A real marketing engine. For established advisors who want social, content, and email working in concert.',
    features: [
      'Two active requests at a time',
      '~16–20 posts + reels · 2–4 articles a month',
      'Newsletter + campaigns',
      'Quarterly AI report · light strategy · dedicated contact',
    ],
  },
  {
    name: 'Full Service',
    slug: 'full-service',
    monthly: 3500,
    popular: false,
    blurb: 'Your outsourced creative department. For top advisors and small teams who want everything handled, end to end.',
    features: [
      'Three active requests, priority queue',
      'Full social calendar · 4+ articles a month',
      'Automated email sequences',
      'Monthly AI tracking + monthly strategy session',
    ],
  },
]

const MATRIX: { label: string; cells: [string, string, string] }[] = [
  { label: 'Active requests', cells: ['1 at a time', '2 at a time', '3 at a time, priority'] },
  { label: 'Turnaround', cells: ['2–3 business days', '1–2 business days', 'Same / next day where possible'] },
  { label: 'Social management', cells: ['1–2 platforms, ~8–12 posts/mo', '2–3 platforms, ~16–20 posts/mo, stories & reels', 'Full calendar, all platforms, stories, reels, video'] },
  { label: 'Content (GEO)', cells: ['1 journal article/mo', '2–4 journal articles/mo', '4+ articles/mo, full editorial calendar'] },
  { label: 'Email', cells: ['Monthly newsletter', 'Newsletter + campaigns', 'Newsletter + campaigns + automated sequences'] },
  { label: 'Design', cells: ['Social graphics, everyday requests', 'Graphics, light motion, proposal & pitch decks', 'Brand work + richer motion, everything in Professional'] },
  { label: 'Website upkeep', cells: ['Kept current', 'Kept current', 'Kept current, priority'] },
  { label: 'AI visibility', cells: ['Annual snapshot', 'Quarterly report', 'Monthly multi-engine tracking + accuracy'] },
  { label: 'Strategy', cells: ['—', 'Light, quarterly', 'Monthly strategy session'] },
  { label: 'Point of contact', cells: ['Studio team', 'Dedicated', 'Dedicated, direct'] },
]

type BillingCycle = 'monthly' | 'annual'

const usd = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

function selectPlan(slug: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('studio:select-plan', { detail: slug }))
  }
}

export function StudioPricing() {
  const [cycle, setCycle] = useState<BillingCycle>('monthly')

  return (
    <section id="plans" className="eah-section" style={{ padding: '104px 24px', background: CREAM, scrollMarginTop: '80px' }}>
      <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
          <span style={eyebrow}>Plans</span>
          <h2 style={{ fontSize: 'clamp(30px, 3.4vw, 40px)', fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 14px', color: INK }}>
            Three ways to work together
          </h2>
          <p style={{ fontSize: '16px', color: BODY, margin: '0 0 32px', lineHeight: 1.65 }}>
            One flat monthly rate. Submit as many requests as you like — we work a set number at a
            time, with fast turnaround and unlimited revisions. Pause or cancel anytime.
          </p>
        </div>

        <BillingToggle cycle={cycle} onChange={setCycle} />

        <div className="studio-pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginTop: '44px', alignItems: 'start' }}>
          {PLANS.map((plan) => (
            <PlanCard key={plan.slug} plan={plan} cycle={cycle} />
          ))}
        </div>

        {/* Agency / custom */}
        <div className="studio-agency-callout" style={{ marginTop: '24px', padding: '26px 30px', borderRadius: '16px', border: `1px solid ${LINE}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
          <div>
            <h3 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: 700, color: INK }}>
              Agency &amp; multi-advisor — from {usd(6000)}/mo
            </h3>
            <p style={{ margin: 0, fontSize: '14px', color: BODY, lineHeight: 1.6, maxWidth: '620px' }}>
              Multiple seats, white-label delivery, and shared brand management for agencies running
              several advisors under one roof. Priced per scope.
            </p>
          </div>
          <a href="#inquire" onClick={() => selectPlan('agency')} style={{ ...btnOutline, flexShrink: 0, whiteSpace: 'nowrap' }}>
            Request a quote
          </a>
        </div>

        {/* Full comparison — same section, so plans read as one block */}
        <div style={{ marginTop: '64px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.01em', textAlign: 'center', color: INK, margin: '0 0 22px' }}>
            Compare every plan
          </h3>
          <div style={{ overflowX: 'auto', border: `1px solid ${LINE}`, borderRadius: '14px', background: '#fff' }}>
            <table style={{ width: '100%', minWidth: '720px', borderCollapse: 'collapse', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ background: INK }}>
                  <th style={{ ...matrixTh, textAlign: 'left', color: '#fff' }}> </th>
                  <th style={{ ...matrixTh, color: '#fff' }}>Essential</th>
                  <th style={{ ...matrixTh, color: '#fff', background: 'rgba(124,58,237,0.35)' }}>Professional</th>
                  <th style={{ ...matrixTh, color: '#fff' }}>Full Service</th>
                </tr>
              </thead>
              <tbody>
                {MATRIX.map((row, i) => (
                  <tr key={row.label} style={{ background: i % 2 ? PANEL : '#fff' }}>
                    <th scope="row" style={matrixRowLabel}>{row.label}</th>
                    {row.cells.map((c, j) => (
                      <td key={j} style={{ ...matrixTd, background: j === 1 ? 'rgba(124,58,237,0.05)' : undefined, color: c === '—' ? '#c4bcae' : BODY }}>
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ textAlign: 'center', fontSize: '13px', color: MUTE, margin: '20px 0 0' }}>
            Prepay the year and get two months free. You own every source file and asset.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .studio-pricing-grid { grid-template-columns: 1fr !important; max-width: 460px; margin-left: auto !important; margin-right: auto !important; }
          .studio-agency-callout { flex-direction: column !important; align-items: flex-start !important; }
        }
        .studio-plan-card { transition: transform 0.25s, box-shadow 0.25s; }
        .studio-plan-card:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(124,58,237,0.10); }
      `}</style>
    </section>
  )
}

// ── Toggle ───────────────────────────────────────────────────────────────────

function BillingToggle({ cycle, onChange }: { cycle: BillingCycle; onChange: (c: BillingCycle) => void }) {
  return (
    <div role="tablist" aria-label="Billing cycle" style={{ display: 'inline-flex', position: 'relative', left: '50%', transform: 'translateX(-50%)', padding: '4px', backgroundColor: '#fff', border: `1px solid ${LINE}`, borderRadius: '999px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
      {(['monthly', 'annual'] as const).map((c) => {
        const active = cycle === c
        return (
          <button key={c} type="button" role="tab" aria-selected={active} onClick={() => onChange(c)} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', fontSize: '14px', fontWeight: 600, color: active ? '#fff' : BODY, backgroundColor: active ? INK : 'transparent', border: 'none', borderRadius: '999px', cursor: 'pointer', transition: 'background-color 0.15s, color 0.15s', textTransform: 'capitalize' }}>
            {c}
            {c === 'annual' && (
              <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '999px', letterSpacing: '0.02em', backgroundColor: active ? 'rgba(255,255,255,0.18)' : PANEL, color: active ? '#fff' : GOLD_D }}>
                2 months free
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

// ── Card ─────────────────────────────────────────────────────────────────────

function PlanCard({ plan, cycle }: { plan: StudioPlan; cycle: BillingCycle }) {
  const annual = plan.monthly * 10
  const showAnnual = cycle === 'annual'
  const effectiveMonthly = Math.round(annual / 12)

  return (
    <div className="studio-plan-card" style={{ padding: '34px 28px', borderRadius: '16px', backgroundColor: '#fff', border: plan.popular ? `2px solid ${PURPLE}` : `1px solid ${LINE}`, position: 'relative', boxShadow: plan.popular ? '0 8px 30px rgba(124,58,237,0.14)' : 'none', display: 'flex', flexDirection: 'column' }}>
      {plan.popular && (
        <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: PURPLE, color: '#fff', fontSize: '11px', fontWeight: 600, padding: '4px 16px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
          Most Popular
        </div>
      )}

      <h3 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 700, color: INK }}>{plan.name}</h3>

      <div style={{ marginBottom: '6px' }}>
        <span style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.03em', color: INK }}>{usd(showAnnual ? effectiveMonthly : plan.monthly)}</span>
        <span style={{ fontSize: '14px', color: MUTE }}>/month</span>
      </div>

      <p style={{ fontSize: '13px', color: MUTE, margin: '0 0 22px', minHeight: '20px', lineHeight: 1.5 }}>
        {showAnnual ? <>{usd(annual)} billed annually · <span style={{ color: GOLD_D, fontWeight: 600 }}>save {usd(plan.monthly * 2)}/yr</span></> : 'Billed monthly · pause anytime'}
      </p>

      <p style={{ fontSize: '13.5px', color: BODY, lineHeight: 1.6, margin: '0 0 22px' }}>{plan.blurb}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '11px', marginBottom: '28px', flex: 1 }}>
        {plan.features.map((f) => (
          <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', fontSize: '13px', color: BODY, lineHeight: 1.5 }}>
            <span style={{ color: GOLD, fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>✓</span> {f}
          </div>
        ))}
      </div>

      <a href="#inquire" onClick={() => selectPlan(plan.slug)} style={plan.popular ? btnPurple : btnOutline}>
        Start with {plan.name}
      </a>
    </div>
  )
}

// ── Shared button + label styles ─────────────────────────────────────────────

const eyebrow: React.CSSProperties = {
  display: 'inline-block',
  fontSize: '12px',
  fontWeight: 600,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: GOLD,
  marginBottom: '16px',
}
const btnBase: React.CSSProperties = {
  display: 'block',
  textAlign: 'center',
  padding: '13px 20px',
  borderRadius: '10px',
  fontSize: '14px',
  fontWeight: 600,
  textDecoration: 'none',
}
const btnPurple: React.CSSProperties = { ...btnBase, background: PURPLE_GRAD, color: '#fff', border: 'none', boxShadow: '0 1px 2px rgba(124,58,237,0.25)' }
const btnOutline: React.CSSProperties = { ...btnBase, background: '#fff', color: INK, border: `1px solid ${INK}` }
const matrixTh: React.CSSProperties = { padding: '15px 18px', textAlign: 'center', fontSize: '13px', fontWeight: 700, letterSpacing: '0.01em' }
const matrixRowLabel: React.CSSProperties = { padding: '13px 18px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: INK, whiteSpace: 'nowrap' }
const matrixTd: React.CSSProperties = { padding: '13px 18px', textAlign: 'center', verticalAlign: 'middle', lineHeight: 1.5 }
