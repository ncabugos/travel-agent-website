import Link from 'next/link'

interface T3PhilosophyProps {
  agentId: string
  eyebrow?: string
  headline: string
  body: string
  stats?: { value: string; label: string }[]
  ctaLabel?: string
  ctaHref?: string
}

export function T3Philosophy({
  agentId,
  eyebrow = '02 — Our Approach',
  headline,
  body,
  stats,
  ctaLabel = 'Read our story',
  ctaHref = '/about',
}: T3PhilosophyProps) {
  const base = `/t3/${agentId}`
  const href = ctaHref.startsWith('http') || ctaHref.startsWith('#') ? ctaHref : `${base}${ctaHref}`

  return (
    <section className="t3-section t3-divider-top">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.4fr',
          gap: 96,
          paddingTop: 24,
        }}
        className="t3-philosophy-grid"
      >
        <div>
          <span className="t3-eyebrow">{eyebrow}</span>
          <h2 className="t3-headline-xl" style={{ marginTop: 32 }}>
            {headline}
          </h2>
        </div>

        <div>
          <p className="t3-body t3-body-lg" style={{ marginTop: 0 }}>
            {body}
          </p>

          {ctaLabel && (
            <Link href={href} className="t3-link-arrow" style={{ marginTop: 40 }}>
              {ctaLabel}
              <span className="arrow">→</span>
            </Link>
          )}

          {stats && stats.length > 0 && (
            <div
              style={{
                marginTop: 72,
                display: 'grid',
                gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
                gap: 32,
                borderTop: '1px solid var(--t3-divider)',
                paddingTop: 40,
              }}
              className="t3-stats-grid"
            >
              {stats.map((s, i) => (
                <div key={i}>
                  <div
                    className="t3-headline-lg"
                    style={{ color: 'var(--t3-accent)', marginBottom: 8, fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: 'var(--t3-text-muted)',
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .t3-philosophy-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
          .t3-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  )
}
