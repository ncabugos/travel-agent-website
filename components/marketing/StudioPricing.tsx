'use client'

import { Reveal } from './Reveal'
import { BODY_STYLE, CHARCOAL, CREAM, DIVIDER, GOLD, H2_STYLE, LABEL_STYLE, WARM_GRAY, WARM_GRAY_DARK } from './tokens'

// ── Studio plans ─────────────────────────────────────────────────────────────
// Three plans, quoted on a conversation. Card lists are short (headline
// differentiators); the full per-plan detail lives in the comparison table.

type PlanSlug = 'essential' | 'professional' | 'full-service'

interface StudioPlan {
  name: string
  slug: PlanSlug
  recommended: boolean
  blurb: string
  features: string[]
}

const PLANS: StudioPlan[] = [
  {
    name: 'Essential',
    slug: 'essential',
    recommended: false,
    blurb: 'Stay visible without the work. For solo advisors who want a current, consistent presence handled for them.',
    features: [
      'One active request at a time',
      '8 to 12 social posts and one journal article a month',
      'Monthly newsletter',
      'Site kept current, annual AI visibility snapshot',
    ],
  },
  {
    name: 'Professional',
    slug: 'professional',
    recommended: true,
    blurb: 'A real marketing engine. For established advisors who want social, content, and email working together.',
    features: [
      'Two active requests at a time',
      '16 to 20 posts and reels, two to four articles a month',
      'Newsletter and campaigns',
      'Quarterly AI report, light strategy, dedicated contact',
    ],
  },
  {
    name: 'Full Service',
    slug: 'full-service',
    recommended: false,
    blurb: 'Your outsourced creative department. For top advisors and small teams who want everything handled, end to end.',
    features: [
      'Three active requests, priority queue',
      'Full social calendar, four or more articles a month',
      'Automated email sequences',
      'Monthly AI tracking and a monthly strategy session',
    ],
  },
]

const MATRIX: { label: string; cells: [string, string, string] }[] = [
  { label: 'Active requests', cells: ['1 at a time', '2 at a time', '3 at a time, priority'] },
  { label: 'Turnaround', cells: ['2 to 3 business days', '1 to 2 business days', 'Same or next day where possible'] },
  { label: 'Social management', cells: ['1 to 2 platforms, 8 to 12 posts a month', '2 to 3 platforms, 16 to 20 posts a month, stories and reels', 'Full calendar, all platforms'] },
  { label: 'Content', cells: ['1 journal article a month', '2 to 4 journal articles a month', '4 or more articles a month, full editorial calendar'] },
  { label: 'Email', cells: ['Monthly newsletter', 'Newsletter and campaigns', 'Newsletter, campaigns, and automated sequences'] },
  { label: 'Design', cells: ['Social graphics, everyday requests', 'Graphics, light motion, proposal and pitch decks', 'Brand work and richer motion, everything on demand'] },
  { label: 'Website upkeep', cells: ['Kept current', 'Kept current', 'Kept current, priority'] },
  { label: 'AI visibility', cells: ['Annual snapshot', 'Quarterly report', 'Monthly multi-engine tracking and accuracy'] },
  { label: 'Strategy', cells: ['None', 'Light, quarterly', 'Monthly strategy session'] },
  { label: 'Point of contact', cells: ['Studio team', 'Dedicated', 'Dedicated, direct'] },
]

function selectPlan(slug: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('studio:select-plan', { detail: slug }))
  }
}

export function StudioPricing() {
  return (
    <section id="plans" className="eah-section" style={{ padding: '120px 0', background: CREAM, color: CHARCOAL, scrollMarginTop: '80px' }}>
      <div className="eah-container">
        <Reveal>
          <p style={{ ...LABEL_STYLE, marginBottom: '20px' }}>Plans</p>
          <h2 style={{ ...H2_STYLE, marginBottom: '20px', maxWidth: '16ch' }}>Three ways to work together.</h2>
          <p style={{ ...BODY_STYLE, maxWidth: '56ch', marginBottom: '64px' }}>
            Submit as many requests as you like. We work a set number at a time, with fast turnaround and unlimited revisions. Every plan is quoted on a conversation.
          </p>
        </Reveal>

        <div className="studio-plans-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0 48px', borderTop: `1px solid ${DIVIDER}` }}>
          {PLANS.map((plan, i) => (
            <Reveal key={plan.slug} delay={i * 60} className="studio-plan" style={{ padding: '32px 0 40px', borderTop: plan.recommended ? `1px solid ${GOLD}` : '1px solid transparent', marginTop: '-1px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', marginBottom: '14px' }}>
                <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 400, letterSpacing: '-0.02em' }}>{plan.name}</h3>
                {plan.recommended && <span style={{ ...LABEL_STYLE, color: GOLD }}>Recommended</span>}
              </div>
              <p style={{ ...BODY_STYLE, fontSize: '15px', marginBottom: '24px' }}>{plan.blurb}</p>
              <ul role="list" style={{ listStyle: 'none', margin: '0 0 28px', padding: 0, flex: 1, borderTop: `1px solid ${DIVIDER}` }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ padding: '12px 0', borderBottom: `1px solid ${DIVIDER}`, fontSize: '14px', lineHeight: 1.5, color: WARM_GRAY_DARK }}>{f}</li>
                ))}
              </ul>
              <a href="#inquire" onClick={() => selectPlan(plan.slug)} className="eah-link" style={{ fontSize: '15px', alignSelf: 'flex-start' }}>
                Request a conversation
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="studio-agency-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '24px 48px', flexWrap: 'wrap', padding: '28px 0', borderTop: `1px solid ${DIVIDER}`, borderBottom: `1px solid ${DIVIDER}` }}>
            <div style={{ maxWidth: '62ch' }}>
              <h3 style={{ margin: '0 0 6px', fontSize: '20px', fontWeight: 400, letterSpacing: '-0.015em' }}>Agency and multi-advisor</h3>
              <p style={{ ...BODY_STYLE, fontSize: '15px' }}>
                Multiple seats, white-label delivery, and shared brand management for agencies running several advisors under one roof. Scoped per agency.
              </p>
            </div>
            <a href="#inquire" onClick={() => selectPlan('agency')} className="eah-link" style={{ fontSize: '15px', whiteSpace: 'nowrap' }}>
              Request a conversation
            </a>
          </div>
        </Reveal>

        <Reveal>
          <div style={{ marginTop: '80px' }}>
            <p style={{ ...LABEL_STYLE, marginBottom: '20px' }}>Compare every plan</p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', minWidth: '720px', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${CHARCOAL}` }}>
                    <th style={{ ...th, textAlign: 'left' }}> </th>
                    <th style={th}>Essential</th>
                    <th style={th}>Professional</th>
                    <th style={th}>Full Service</th>
                  </tr>
                </thead>
                <tbody>
                  {MATRIX.map((row) => (
                    <tr key={row.label} style={{ borderBottom: `1px solid ${DIVIDER}` }}>
                      <th scope="row" style={rowLabel}>{row.label}</th>
                      {row.cells.map((c, j) => (
                        <td key={j} style={{ ...td, color: c === 'None' ? WARM_GRAY : WARM_GRAY_DARK }}>{c}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: '13px', color: WARM_GRAY, margin: '20px 0 0' }}>You own every source file and asset.</p>
          </div>
        </Reveal>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .studio-plans-grid { grid-template-columns: 1fr !important; }
          .studio-plan { border-top: 1px solid ${DIVIDER} !important; margin-top: 0 !important; }
        }
      `}</style>
    </section>
  )
}

const th: React.CSSProperties = { padding: '0 16px 14px', textAlign: 'left', fontSize: '13px', fontWeight: 500, color: CHARCOAL }
const rowLabel: React.CSSProperties = { padding: '14px 16px 14px 0', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: CHARCOAL, whiteSpace: 'nowrap', verticalAlign: 'top' }
const td: React.CSSProperties = { padding: '14px 16px', textAlign: 'left', verticalAlign: 'top', lineHeight: 1.5 }
