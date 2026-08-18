import Link from 'next/link'

/**
 * Homepage cross-sell for /studio — the done-for-you marketing service.
 * Sits after the platform pricing tiers: "here's the site, and here's who
 * can run the marketing on top of it." Dark charcoal ground with the same
 * purple (action) + gold (editorial) accent pairing as /studio itself, kept
 * compact and static (no animation) since it's a teaser, not the sales page.
 */

const CAPABILITIES = [
  { label: 'Social media' },
  { label: 'Blog & GEO content' },
  { label: 'AI visibility' },
  { label: 'Email marketing' },
  { label: 'Design & creative' },
]

export function MarketingStudioPromo() {
  return (
    <section
      className="eah-section"
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '100px 24px',
        background: 'radial-gradient(1000px 520px at 18% 8%, #241f18 0%, #17130f 55%, #120f0a 100%)',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(520px 280px at 88% 20%, rgba(180,154,90,0.14), transparent 70%), radial-gradient(580px 320px at 8% 90%, rgba(124,58,237,0.14), transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', maxWidth: '1080px', margin: '0 auto' }}>
        <div className="studio-promo-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '56px', alignItems: 'center' }}>
          <div>
            <span
              style={{
                display: 'inline-block',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#D8C28A',
                marginBottom: '18px',
              }}
            >
              Introducing Studio
            </span>
            <h2
              style={{
                fontSize: 'clamp(28px, 3.6vw, 42px)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.12,
                margin: '0 0 18px',
                color: '#fff',
              }}
            >
              Want it all handled —{' '}
              <span style={{ background: 'linear-gradient(135deg, #a5b4fc, #c4b5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                not just hosted?
              </span>
            </h2>
            <p style={{ fontSize: '16.5px', lineHeight: 1.7, color: 'rgba(255,255,255,0.72)', margin: '0 0 28px', maxWidth: '480px' }}>
              Your site is the foundation. Studio is the team behind it — social, content, email, and
              design, delivered every month at a flat rate, so your presence stays current without you
              lifting a finger.
            </p>
            <Link
              href="/studio"
              className="eah-studio-cta eah-focus-ring"
              style={{
                // Secondary action — outline, not purple. Purple is reserved
                // for the one primary CTA on the homepage (begin the 30 days).
                display: 'inline-block',
                padding: '14px 30px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.06)',
                color: '#fff',
                fontSize: '15px',
                fontWeight: 600,
                textDecoration: 'none',
                border: '1px solid rgba(216,194,138,0.55)',
              }}
            >
              Explore Studio
            </Link>
          </div>

          <ul role="list" className="studio-promo-chips" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {CAPABILITIES.map((c) => (
              <li
                key={c.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <span aria-hidden="true" style={{ color: '#D8C28A', fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: '14.5px', fontWeight: 500, color: 'rgba(255,255,255,0.9)' }}>{c.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style>{`
        .eah-studio-cta { transition: background-color 0.15s ease, border-color 0.15s ease; }
        .eah-studio-cta:hover { background: rgba(255,255,255,0.12) !important; border-color: #D8C28A !important; }
        @media (max-width: 820px) {
          .studio-promo-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
        }
      `}</style>
    </section>
  )
}
