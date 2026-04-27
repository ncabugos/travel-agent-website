import Link from 'next/link'

interface T2AdvisorProfileProps {
  agentId: string
  fullName: string
  agencyName: string
  bio?: string
  photo?: string
  photoAlt?: string
  eyebrow?: string
  contactHref?: string
  yearsAdvising?: string | number
  countries?: string | number
}

/**
 * Vista (T2) advisor profile section. Serif-led layout with a portrait photo
 * on the left, bio on the right, and optional stat chips under the name.
 * Companion component to T3AdvisorProfile — same concept, T2 styling.
 */
export function T2AdvisorProfile({
  fullName,
  agencyName,
  bio,
  photo,
  photoAlt,
  eyebrow = 'Your Advisor',
  agentId,
  contactHref,
  yearsAdvising,
  countries,
}: T2AdvisorProfileProps) {
  const href = contactHref ?? `/t2/${agentId}/contact`

  return (
    <section style={{ padding: 'var(--t2-section-pad) 0', background: 'var(--t2-bg)' }}>
      <div
        style={{
          maxWidth: 'var(--t2-content-max, 1280px)',
          margin: '0 auto',
          padding: '0 48px',
          display: 'grid',
          gridTemplateColumns: '1fr 1.5fr',
          gap: 72,
          alignItems: 'center',
        }}
        className="t2-advisor-grid"
      >
        {/* Portrait */}
        <div
          style={{
            position: 'relative',
            aspectRatio: '3 / 4',
            overflow: 'hidden',
            background: 'var(--t2-bg-alt, #f3efe7)',
          }}
        >
          {photo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={photo}
              alt={photoAlt ?? fullName}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center top',
              }}
            />
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: 'var(--t2-text-muted)',
                fontFamily: 'var(--t2-font-serif)',
                fontSize: 14,
              }}
            >
              Photo coming soon
            </div>
          )}
        </div>

        {/* Copy */}
        <div>
          <p className="t2-label" style={{ marginBottom: 14 }}>{eyebrow}</p>
          <h2 className="t2-heading t2-heading-lg" style={{ marginBottom: 8 }}>
            {fullName}
          </h2>
          <p
            style={{
              fontFamily: 'var(--t2-font-serif)',
              fontStyle: 'italic',
              fontSize: 18,
              color: 'var(--t2-accent)',
              lineHeight: 1.5,
              margin: '0 0 28px',
            }}
          >
            {agencyName}
          </p>

          {bio && (
            <p
              className="t2-body"
              style={{ marginBottom: 32, maxWidth: 620 }}
            >
              {bio}
            </p>
          )}

          {(yearsAdvising || countries) && (
            <div
              style={{
                display: 'flex',
                gap: 48,
                flexWrap: 'wrap',
                borderTop: '1px solid var(--t2-divider)',
                paddingTop: 24,
                marginBottom: 32,
              }}
            >
              {yearsAdvising !== undefined && (
                <StatBlock value={String(yearsAdvising)} label="Years Advising" />
              )}
              {countries !== undefined && (
                <StatBlock value={String(countries)} label="Countries Visited" />
              )}
            </div>
          )}

          <Link href={href} className="t2-btn t2-btn-outline">
            Book a Consultation
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .t2-advisor-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  )
}

function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div
        style={{
          fontFamily: 'var(--t2-font-serif)',
          fontSize: 'clamp(28px, 3vw, 42px)',
          fontWeight: 400,
          color: 'var(--t2-accent)',
          lineHeight: 1,
          marginBottom: 6,
          letterSpacing: '-0.02em',
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: 'var(--t2-font-sans)',
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--t2-text-muted)',
        }}
      >
        {label}
      </div>
    </div>
  )
}
