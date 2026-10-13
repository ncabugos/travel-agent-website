'use client'

import { Reveal } from './Reveal'
import { BODY_STYLE, CHARCOAL, CREAM, DIVIDER, GOLD, H2_STYLE, LABEL_STYLE, WARM_GRAY_DARK } from './tokens'

// ── Studio plans ─────────────────────────────────────────────────────────────
// Three plans plus an agency row, each quoted after a consultation.

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
    blurb: 'For solo advisors who want to stay visible.',
    features: [
      '8 to 12 social posts a month',
      'One blog article a month',
      'Monthly newsletter',
      'Delivered in 2 to 3 business days',
    ],
  },
  {
    name: 'Professional',
    slug: 'professional',
    recommended: true,
    blurb: 'For busy advisors who want social, blog, and email working together.',
    features: [
      '16 to 20 posts, stories, and reels a month',
      'Two to four blog articles a month',
      'Newsletter and special offer emails',
      'A dedicated contact, delivered in 1 to 2 business days',
    ],
  },
  {
    name: 'Full Service',
    slug: 'full-service',
    recommended: false,
    blurb: 'For top advisors and small teams who want all of it handled.',
    features: [
      'Every platform, a full posting calendar',
      'Four or more blog articles a month',
      'Automatic follow-up emails',
      'A monthly strategy call',
    ],
  },
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
          <h2 style={{ ...H2_STYLE, marginBottom: '20px' }}>Plans</h2>
          <p style={{ ...BODY_STYLE, maxWidth: '56ch', marginBottom: '64px' }}>
            Every plan includes changes until you are happy, and you keep every file. We quote your plan after a short consultation.
          </p>
        </Reveal>

        <div className="studio-plans-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0 48px', borderTop: `1px solid ${DIVIDER}` }}>
          {PLANS.map((plan, i) => (
            <Reveal key={plan.slug} delay={i * 60} className="studio-plan" style={{ padding: '32px 0 40px', borderTop: plan.recommended ? `1px solid ${GOLD}` : '1px solid transparent', marginTop: '-1px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', marginBottom: '14px' }}>
                <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 400, letterSpacing: '-0.02em' }}>{plan.name}</h3>
                {plan.recommended && <span style={{ ...LABEL_STYLE, color: GOLD }}>Most popular</span>}
              </div>
              <p style={{ ...BODY_STYLE, fontSize: '15px', marginBottom: '24px' }}>{plan.blurb}</p>
              <ul role="list" style={{ listStyle: 'none', margin: '0 0 28px', padding: 0, flex: 1, borderTop: `1px solid ${DIVIDER}` }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ padding: '12px 0', borderBottom: `1px solid ${DIVIDER}`, fontSize: '14px', lineHeight: 1.5, color: WARM_GRAY_DARK }}>{f}</li>
                ))}
              </ul>
              <a href="#inquire" onClick={() => selectPlan(plan.slug)} className="eah-link" style={{ fontSize: '15px', alignSelf: 'flex-start' }}>
                Schedule a consultation
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="studio-agency-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '24px 48px', flexWrap: 'wrap', padding: '28px 0', borderTop: `1px solid ${DIVIDER}`, borderBottom: `1px solid ${DIVIDER}` }}>
            <div style={{ maxWidth: '62ch' }}>
              <h3 style={{ margin: '0 0 6px', fontSize: '20px', fontWeight: 400, letterSpacing: '-0.015em' }}>Agency</h3>
              <p style={{ ...BODY_STYLE, fontSize: '15px' }}>
                One plan for your whole team of advisors, delivered under your agency brand.
              </p>
            </div>
            <a href="#inquire" onClick={() => selectPlan('agency')} className="eah-link" style={{ fontSize: '15px', whiteSpace: 'nowrap' }}>
              Schedule a consultation
            </a>
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
