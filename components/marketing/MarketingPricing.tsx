import Link from 'next/link'
import { PUBLIC_TIERS, usd } from '@/lib/pricing'
import { Reveal } from './Reveal'
import {
  BODY_STYLE, CHARCOAL, CREAM, DIVIDER, DIVIDER_DARK, GOLD, H2_STYLE, LABEL_STYLE,
  NEAR_BLACK, PRIMARY_CTA_LABEL, PRIMARY_CTA_STYLE, SECONDARY_CTA_STYLE, WARM_GRAY, WARM_GRAY_DARK,
} from './tokens'

// Homepage pricing. Three cards, the middle one inverted and lifted so the
// eye lands on it first. One purple button per screen: the highlighted card.

function Check({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ flexShrink: 0, marginTop: '4px' }}>
      <path d="M2.5 7.5l3 3 6-6.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function MarketingPricing() {
  return (
    <section id="pricing" className="eah-section" style={{ padding: '120px 0', background: CREAM, color: CHARCOAL, scrollMarginTop: '80px' }}>
      <div className="eah-container">
        <Reveal>
          <p style={{ ...LABEL_STYLE, marginBottom: '20px' }}>Pricing</p>
          <h2 style={{ ...H2_STYLE, marginBottom: '20px', maxWidth: '16ch' }}>The site your CRM doesn&rsquo;t give you.</h2>
          <p style={{ ...BODY_STYLE, maxWidth: '56ch', marginBottom: '64px' }}>
            Your CRM runs the bookings. This is the branded site that brings clients to you. One setup fee, one monthly price, updates included.
          </p>
        </Reveal>

        <div className="eah-pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', alignItems: 'start' }}>
          {PUBLIC_TIERS.map((tier, i) => {
            const dark = tier.highlight
            const fg = dark ? '#fff' : CHARCOAL
            const muted = dark ? 'rgba(255,255,255,0.7)' : WARM_GRAY_DARK
            const line = dark ? DIVIDER_DARK : DIVIDER
            return (
              <Reveal
                key={tier.key}
                delay={i * 60}
                className={`eah-pricing-card${dark ? ' eah-pricing-card-highlight' : ''}`}
                style={{
                  background: dark ? NEAR_BLACK : '#fff',
                  color: fg,
                  border: dark ? `1px solid ${NEAR_BLACK}` : `1px solid ${DIVIDER}`,
                  borderRadius: '2px',
                  padding: dark ? '48px 36px' : '40px 36px',
                  marginTop: dark ? '-16px' : 0,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', marginBottom: '12px' }}>
                  <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 500, letterSpacing: '-0.02em' }}>{tier.name}</h3>
                  {dark && <span style={{ ...LABEL_STYLE, color: GOLD }}>Most popular</span>}
                </div>
                <p style={{ margin: '0 0 28px', fontSize: '15px', lineHeight: 1.5, color: muted }}>{tier.audience}</p>

                {tier.monthly !== undefined ? (
                  <>
                    <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                      <span style={{ fontSize: '48px', fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1 }}>{usd(tier.monthly)}</span>
                      <span style={{ fontSize: '15px', color: muted }}>per month</span>
                    </div>
                    <p style={{ margin: '0 0 32px', fontSize: '14px', color: muted }}>{usd(tier.setup)} one-time setup</p>
                  </>
                ) : (
                  <>
                    <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                      <span style={{ fontSize: '48px', fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1 }}>{usd(tier.setup)}</span>
                      <span style={{ fontSize: '15px', color: muted }}>setup</span>
                    </div>
                    <p style={{ margin: '0 0 32px', fontSize: '14px', color: muted }}>Monthly rate based on your number of sites</p>
                  </>
                )}

                <Link
                  href={`/schedule-consultation?tier=${tier.key}`}
                  className={dark ? 'eah-cta-primary' : 'eah-cta-secondary'}
                  style={dark ? { ...PRIMARY_CTA_STYLE, width: '100%' } : { ...SECONDARY_CTA_STYLE, width: '100%', color: CHARCOAL }}
                >
                  {PRIMARY_CTA_LABEL}
                </Link>

                {tier.includes && (
                  <p style={{ margin: '32px 0 0', fontSize: '13px', fontWeight: 500, color: fg }}>{tier.includes}</p>
                )}
                <ul role="list" style={{ listStyle: 'none', margin: tier.includes ? '12px 0 0' : '32px 0 0', padding: 0, borderTop: `1px solid ${line}` }}>
                  {tier.features.map((f) => (
                    <li key={f} style={{ display: 'flex', gap: '12px', padding: '11px 0', borderBottom: `1px solid ${line}`, fontSize: '14px', lineHeight: 1.5, color: muted }}>
                      <Check color={dark ? GOLD : CHARCOAL} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )
          })}
        </div>

        <Reveal>
          <p style={{ fontSize: '14px', lineHeight: 1.6, color: WARM_GRAY, margin: '40px 0 0', maxWidth: '64ch' }}>
            A freelance build runs $800 to $6,500 upfront, then an open-ended maintenance bill. Every plan here is a custom-branded build on your own domain, with the updates included.
          </p>
        </Reveal>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .eah-pricing-grid { grid-template-columns: 1fr !important; }
          .eah-pricing-card-highlight { margin-top: 0 !important; }
        }
        @media (max-width: 640px) {
          .eah-pricing-card { padding: 32px 24px !important; }
        }
      `}</style>
    </section>
  )
}
