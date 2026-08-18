import Link from 'next/link'
import { CheckoutButton } from '@/components/stripe/CheckoutButton'
import { BASE_PLAN, MODULES, SERVICES, AGENCY_PLAN, usd } from '@/lib/pricing'

/**
 * Pricing section — business model v2 (docs/business-model-v2.md).
 *
 * One public entry product (The Site, $59/mo, first 30 days complimentary, no
 * setup fee), an expansion menu of modules and studio services fulfilled from
 * the portal, and a consultative Agency band. Growth/Custom are no longer
 * marketed as tiers; their machinery remains for grandfathered accounts.
 *
 * Voice: "with our compliments", never "free trial". Gold carries editorial
 * accents (eyebrows, prices, ✓ marks); purple stays on actions.
 */

const GOLD = '#B49A5A'

export function MarketingPricing() {
  return (
    <section
      id="pricing"
      className="eah-section"
      style={{ padding: '100px 24px', backgroundColor: '#fafafa' }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <p
          style={{
            textAlign: 'center',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: GOLD,
            margin: '0 0 16px',
          }}
        >
          Pricing
        </p>
        <h2
          style={{
            fontSize: 'clamp(30px, 3.4vw, 42px)',
            fontWeight: 700,
            textAlign: 'center',
            letterSpacing: '-0.02em',
            margin: '0 0 12px',
          }}
        >
          One site. Then only what the practice calls for.
        </h2>
        <p
          style={{
            textAlign: 'center',
            fontSize: '16px',
            color: '#6b7280',
            margin: '0 auto 56px',
            maxWidth: '560px',
          }}
        >
          {usd(BASE_PLAN.monthly)} a month, and your first 30 days are with our compliments —
          no setup fee. Add modules and studio services from your portal as the practice grows.
          Your domain is yours, from day one.
        </p>

        {/* The Site + expansion modules */}
        <div
          className="eah-pricing-v2-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '5fr 4fr',
            gap: '24px',
            alignItems: 'start',
          }}
        >
          {/* The Site */}
          <div
            style={{
              padding: '40px 36px',
              borderRadius: '16px',
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
            }}
          >
            <h3 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: 600 }}>
              {BASE_PLAN.name}
            </h3>
            <div style={{ margin: '0 0 6px' }}>
              <span style={{ fontSize: '40px', fontWeight: 800, letterSpacing: '-0.03em' }}>
                {usd(BASE_PLAN.monthly)}
              </span>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>/month</span>
            </div>
            <p style={{ fontSize: '13px', color: GOLD, fontWeight: 600, margin: '0 0 20px' }}>
              Your first 30 days are with our compliments. No setup fee.
            </p>
            <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.6, margin: '0 0 24px' }}>
              {BASE_PLAN.blurb}
            </p>

            <ul role="list" style={{ listStyle: 'none', margin: '0 0 28px', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {BASE_PLAN.features.map((f) => (
                <li
                  key={f}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    fontSize: '14px',
                    color: '#374151',
                    lineHeight: 1.5,
                  }}
                >
                  <span aria-hidden="true" style={{ color: GOLD, fontWeight: 700, flexShrink: 0 }}>✓</span> {f}
                </li>
              ))}
            </ul>

            <CheckoutButton
              tier="starter"
              popular
              style={{ minHeight: '56px', padding: '16px', fontSize: '16px', background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', boxShadow: '0 4px 24px rgba(124,58,237,0.35)' }}
            >
              Begin my 30 days
            </CheckoutButton>
            <p style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', margin: '12px 0 0' }}>
              Card on file · first billing on day 31 · cancel anytime
            </p>
          </div>

          {/* Expansion modules */}
          <div
            style={{
              padding: '40px 36px',
              borderRadius: '16px',
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
            }}
          >
            <h3 style={{ margin: '0 0 6px', fontSize: '20px', fontWeight: 600 }}>
              Add as you grow
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.6, margin: '0 0 24px' }}>
              Each module joins the site you already have — nothing is rebuilt, nothing starts over.
            </p>

            <ul role="list" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
              {MODULES.map((m, i) => (
                <li
                  key={m.key}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    gap: '16px',
                    padding: '14px 0',
                    borderTop: i === 0 ? 'none' : '1px solid #f0ede6',
                  }}
                >
                  <div>
                    <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: 600, color: '#111' }}>
                      {m.name}
                    </p>
                    <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', lineHeight: 1.5 }}>
                      {m.description}
                    </p>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: GOLD, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                    {usd(m.monthly)}/mo
                  </span>
                </li>
              ))}
            </ul>

            <p style={{ fontSize: '12px', color: '#6b7280', margin: '20px 0 0', lineHeight: 1.5 }}>
              Modules are enabled from your portal — most within a day.
            </p>
          </div>
        </div>

        {/* Studio services */}
        <div
          style={{
            marginTop: '24px',
            padding: '40px 36px',
            borderRadius: '16px',
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
          }}
        >
          <h3 style={{ margin: '0 0 6px', fontSize: '20px', fontWeight: 600 }}>
            The studio, on call
          </h3>
          <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.6, margin: '0 0 28px', maxWidth: '620px' }}>
            Design and marketing work, ordered from your portal when you want it — no retainers
            required, no agencies to brief from zero.
          </p>
          <ul
            role="list"
            className="eah-services-grid"
            style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px 32px' }}
          >
            {SERVICES.map((s) => (
              <li key={s.key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px' }}>
                  <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: 600, color: '#111' }}>
                    {s.name}
                  </p>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: GOLD, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                    {s.price}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', lineHeight: 1.5 }}>
                  {s.description}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Agency */}
        <div
          style={{
            marginTop: '24px',
            padding: '36px',
            borderRadius: '16px',
            backgroundColor: '#131210',
            color: '#fafaf5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '32px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ maxWidth: '640px' }}>
            <h3 style={{ margin: '0 0 6px', fontSize: '20px', fontWeight: 600, color: '#fff' }}>
              {AGENCY_PLAN.name}
              <span style={{ fontSize: '14px', fontWeight: 500, color: GOLD, marginLeft: '12px' }}>
                from {usd(AGENCY_PLAN.fromMonthly)}/month
              </span>
            </h3>
            <p style={{ margin: 0, fontSize: '14px', color: 'rgba(250,250,245,0.75)', lineHeight: 1.6 }}>
              {AGENCY_PLAN.blurb}
            </p>
          </div>
          <Link
            href="/schedule-consultation?tier=agency"
            className="eah-pricing-agency-cta eah-focus-ring"
            style={{
              padding: '12px 28px',
              borderRadius: '10px',
              backgroundColor: '#fff',
              color: '#111',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Schedule a consultation
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .eah-pricing-v2-grid { grid-template-columns: 1fr !important; }
          .eah-services-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .eah-services-grid { grid-template-columns: 1fr !important; }
        }
        .eah-pricing-agency-cta { transition: background-color 0.15s ease; }
        .eah-pricing-agency-cta:hover { background-color: #f0ede6 !important; }
      `}</style>
    </section>
  )
}
