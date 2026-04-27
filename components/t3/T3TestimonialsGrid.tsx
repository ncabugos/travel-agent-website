export interface T3Testimonial {
  quote: string
  author: string
  context?: string
  location?: string
}

interface T3TestimonialsGridProps {
  eyebrow?: string
  heading?: string
  subheading?: string
  testimonials: T3Testimonial[]
  columns?: 2 | 3
}

/**
 * Editorial testimonials section for Meridian (T3). Thin-rule grid of
 * pull-quotes with author + context. Companion to T2TestimonialsGrid —
 * same shape, different styling.
 */
export function T3TestimonialsGrid({
  eyebrow = 'In Their Words',
  heading = 'A few words from the people we travel with.',
  subheading,
  testimonials,
  columns = 3,
}: T3TestimonialsGridProps) {
  if (!testimonials.length) return null

  return (
    <section className="t3-section">
      {/* Header */}
      <div
        style={{
          maxWidth: 720,
          margin: '0 auto 72px',
          textAlign: 'center',
        }}
      >
        <span className="t3-eyebrow" style={{ justifyContent: 'center' }}>
          {eyebrow}
        </span>
        <h2 className="t3-headline-xl" style={{ marginTop: 28 }}>
          {heading}
        </h2>
        {subheading && (
          <p className="t3-body t3-body-lg" style={{ marginTop: 24 }}>
            {subheading}
          </p>
        )}
      </div>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: 56,
          rowGap: 64,
          borderTop: '1px solid var(--t3-divider)',
          paddingTop: 56,
        }}
        className="t3-testimonials-grid"
      >
        {testimonials.map((t, i) => (
          <figure
            key={i}
            style={{
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--t3-font-display)',
                fontSize: 48,
                fontWeight: 400,
                lineHeight: 1,
                color: 'var(--t3-accent)',
                marginBottom: 16,
                letterSpacing: '-0.02em',
              }}
              aria-hidden
            >
              &ldquo;
            </div>
            <blockquote
              style={{
                margin: 0,
                fontFamily: 'var(--t3-font-display)',
                fontSize: 'clamp(18px, 1.4vw, 22px)',
                lineHeight: 1.55,
                color: 'var(--t3-text)',
                fontStyle: 'italic',
                fontWeight: 400,
                flex: 1,
              }}
            >
              {t.quote}
            </blockquote>
            <figcaption
              style={{
                marginTop: 28,
                paddingTop: 20,
                borderTop: '1px solid var(--t3-divider)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--t3-font-body)',
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--t3-text)',
                  marginBottom: 4,
                }}
              >
                {t.author}
              </div>
              {t.context && (
                <div
                  style={{
                    fontFamily: 'var(--t3-font-body)',
                    fontSize: 10,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: 'var(--t3-text-muted)',
                    fontWeight: 500,
                  }}
                >
                  {t.context}
                  {t.location && <span> · {t.location}</span>}
                </div>
              )}
            </figcaption>
          </figure>
        ))}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .t3-testimonials-grid { grid-template-columns: 1fr 1fr !important; gap: 48px !important; }
        }
        @media (max-width: 600px) {
          .t3-testimonials-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  )
}
