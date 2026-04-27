import Link from 'next/link'

interface T4AdvisorProfileProps {
  agentId: string
  fullName: string
  agencyName: string
  bio?: string
  photo?: string
  photoAlt?: string
  eyebrow?: string
  signatureQuote?: string
}

/**
 * T4 advisor profile — large 3:4 portrait on the left, bio + italic
 * signature quote on the right, understated "Book a consultation" link.
 */
export function T4AdvisorProfile({
  agentId,
  fullName,
  agencyName,
  bio,
  photo,
  photoAlt,
  eyebrow = 'Your Advisor',
  signatureQuote,
}: T4AdvisorProfileProps) {
  return (
    <section style={{ padding: 'var(--t4-section-pad) 48px', background: 'var(--t4-bg)' }}>
      <div
        style={{
          maxWidth: 'var(--t4-content-wide)',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1.4fr',
          gap: 96,
          alignItems: 'center',
        }}
        className="t4-advisor-grid"
      >
        {/* Portrait */}
        <div
          style={{
            position: 'relative',
            aspectRatio: '3 / 4',
            overflow: 'hidden',
            background: 'var(--t4-bg-alt)',
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
                color: 'var(--t4-text-muted)',
                fontFamily: 'var(--t4-font-display)',
                fontStyle: 'italic',
                fontSize: 18,
              }}
            >
              Portrait coming soon
            </div>
          )}
        </div>

        {/* Copy */}
        <div>
          <span className="t4-eyebrow">{eyebrow}</span>
          <h2 className="t4-headline-xl" style={{ marginTop: 28, marginBottom: 12 }}>
            {fullName}
          </h2>
          <p
            style={{
              fontFamily: 'var(--t4-font-display)',
              fontStyle: 'italic',
              fontSize: 20,
              color: 'var(--t4-accent)',
              lineHeight: 1.45,
              margin: '0 0 32px',
            }}
          >
            {agencyName}
          </p>

          {bio && (
            <p className="t4-body t4-body-lg" style={{ marginBottom: 32, maxWidth: 620 }}>
              {bio}
            </p>
          )}

          {signatureQuote && (
            <blockquote
              style={{
                margin: '0 0 40px',
                borderLeft: '1px solid var(--t4-accent)',
                paddingLeft: 24,
                fontFamily: 'var(--t4-font-display)',
                fontStyle: 'italic',
                fontSize: 22,
                color: 'var(--t4-text)',
                lineHeight: 1.55,
                fontWeight: 400,
                maxWidth: 620,
              }}
            >
              “{signatureQuote}”
            </blockquote>
          )}

          <Link
            href={`/t4/${agentId}/contact`}
            className="t4-link"
          >
            Book a Private Consultation
            <span className="t4-arrow">→</span>
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .t4-advisor-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
        }
      `}</style>
    </section>
  )
}
