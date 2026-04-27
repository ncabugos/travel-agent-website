export interface T4Testimonial {
  quote: string
  author: string
  context?: string
}

interface T4TestimonialsRowProps {
  eyebrow?: string
  heading?: string
  testimonials: T4Testimonial[]
}

/**
 * T4 testimonials row — editorial full-width single-rotating or 3-column
 * quiet grid. This implementation renders a static 3-column grid of
 * pull-quotes in extra-light italic serif.
 */
export function T4TestimonialsRow({
  eyebrow = 'In Their Words',
  heading = 'Travel, told back to us.',
  testimonials,
}: T4TestimonialsRowProps) {
  if (testimonials.length === 0) return null

  return (
    <section
      style={{
        padding: 'var(--t4-section-pad) 48px',
        background: 'var(--t4-bg-alt)',
      }}
    >
      <div style={{ maxWidth: 'var(--t4-content-wide)', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 72px' }}>
          <span
            className="t4-eyebrow t4-eyebrow-center"
            style={{ justifyContent: 'center' }}
          >
            {eyebrow}
          </span>
          <h2 className="t4-headline-xl" style={{ marginTop: 24 }}>
            {heading}
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 64,
          }}
          className="t4-testimonials-grid"
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
                  fontFamily: 'var(--t4-font-display)',
                  fontSize: 54,
                  fontWeight: 400,
                  color: 'var(--t4-accent)',
                  lineHeight: 0.8,
                  marginBottom: 24,
                }}
                aria-hidden
              >
                &ldquo;
              </div>
              <blockquote
                style={{
                  margin: 0,
                  fontFamily: 'var(--t4-font-display)',
                  fontStyle: 'italic',
                  fontSize: 'clamp(18px, 1.3vw, 22px)',
                  lineHeight: 1.55,
                  color: 'var(--t4-text)',
                  fontWeight: 300,
                  flex: 1,
                }}
              >
                {t.quote}
              </blockquote>
              <figcaption
                style={{
                  marginTop: 28,
                  paddingTop: 20,
                  borderTop: '1px solid var(--t4-divider)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--t4-font-body)',
                    fontSize: 13,
                    fontWeight: 500,
                    color: 'var(--t4-text)',
                    marginBottom: 6,
                  }}
                >
                  {t.author}
                </div>
                {t.context && (
                  <div
                    style={{
                      fontFamily: 'var(--t4-font-body)',
                      fontSize: 10,
                      letterSpacing: '0.26em',
                      textTransform: 'uppercase',
                      color: 'var(--t4-text-muted)',
                      fontWeight: 500,
                    }}
                  >
                    {t.context}
                  </div>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .t4-testimonials-grid { grid-template-columns: 1fr 1fr !important; gap: 48px !important; }
        }
        @media (max-width: 600px) {
          .t4-testimonials-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  )
}
