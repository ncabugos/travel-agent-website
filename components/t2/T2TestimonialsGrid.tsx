export interface T2Testimonial {
  quote: string
  author: string
  context?: string       // e.g. "Tokyo + Kyoto, 2024"
  location?: string      // optional fine-print location label
}

interface T2TestimonialsGridProps {
  eyebrow?: string
  heading?: string
  subheading?: string
  testimonials: T2Testimonial[]
  columns?: 2 | 3
}

/**
 * Testimonials section for Vista (T2). Three-column grid of pull-quotes with
 * author + context. Kept styled-quiet (no stars/rating chrome) to fit the
 * Vista editorial aesthetic.
 */
export function T2TestimonialsGrid({
  eyebrow = 'What Our Clients Say',
  heading = 'A few words from the people we travel with.',
  subheading,
  testimonials,
  columns = 3,
}: T2TestimonialsGridProps) {
  if (!testimonials.length) return null

  return (
    <section style={{ padding: 'var(--t2-section-pad) 0', background: 'var(--t2-bg-alt, #f3efe7)' }}>
      <div
        style={{
          maxWidth: 'var(--t2-content-max, 1280px)',
          margin: '0 auto',
          padding: '0 48px',
        }}
      >
        {/* Header */}
        <div style={{ maxWidth: 760, marginBottom: 56, textAlign: 'center', marginInline: 'auto' }}>
          <p className="t2-label" style={{ marginBottom: 16 }}>{eyebrow}</p>
          <h2 className="t2-heading t2-heading-lg" style={{ marginBottom: subheading ? 16 : 0 }}>
            {heading}
          </h2>
          {subheading && (
            <p className="t2-body t2-body-center" style={{ margin: 0 }}>
              {subheading}
            </p>
          )}
        </div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: 32,
          }}
          className="t2-testimonials-grid"
        >
          {testimonials.map((t, i) => (
            <figure
              key={i}
              style={{
                margin: 0,
                padding: '36px 32px',
                background: '#fff',
                border: '1px solid var(--t2-divider)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--t2-font-serif)',
                  fontSize: 48,
                  fontWeight: 400,
                  lineHeight: 1,
                  color: 'var(--t2-accent)',
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
                  fontFamily: 'var(--t2-font-serif)',
                  fontSize: 'clamp(16px, 1.2vw, 18px)',
                  lineHeight: 1.65,
                  color: 'var(--t2-text)',
                  fontStyle: 'italic',
                  flex: 1,
                }}
              >
                {t.quote}
              </blockquote>
              <figcaption
                style={{
                  marginTop: 28,
                  paddingTop: 20,
                  borderTop: '1px solid var(--t2-divider)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--t2-font-sans)',
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--t2-text)',
                    marginBottom: 4,
                  }}
                >
                  {t.author}
                </div>
                {t.context && (
                  <div
                    style={{
                      fontFamily: 'var(--t2-font-sans)',
                      fontSize: 11,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'var(--t2-text-muted)',
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
      </div>

      <style>{`
        @media (max-width: 900px) {
          .t2-testimonials-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .t2-testimonials-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
