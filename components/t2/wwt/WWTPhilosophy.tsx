import { RevealOnScroll, HeadlineReveal } from './RevealOnScroll'
import { ParallaxImage } from './ParallaxImage'

interface WWTPhilosophyProps {
  eyebrow: string
  headline: string
  body: string[]
  signature?: string
  image: string
  imageAlt?: string
}

/**
 * Aethos-style editorial intro — asymmetric two-column layout.
 * Copy on the left, tall parallax image on the right. Headline reveals
 * word-by-word on scroll. Generous vertical rhythm.
 */
export function WWTPhilosophy({
  eyebrow,
  headline,
  body,
  signature,
  image,
  imageAlt,
}: WWTPhilosophyProps) {
  return (
    <section
      style={{
        padding: 'var(--t2-section-pad) 0',
        background: 'var(--t2-bg)',
      }}
    >
      <div
        style={{
          maxWidth: 1480,
          margin: '0 auto',
          padding: '0 clamp(24px, 6vw, 72px)',
          display: 'grid',
          gridTemplateColumns: '1.05fr 0.95fr',
          gap: 'clamp(48px, 7vw, 120px)',
          alignItems: 'start',
        }}
        className="wwt-philosophy-grid"
      >
        <div style={{ paddingTop: 'clamp(20px, 4vw, 64px)' }}>
          <RevealOnScroll variant="fade-up" duration={900}>
            <p className="t2-label" style={{ marginBottom: 40 }}>{eyebrow}</p>
          </RevealOnScroll>

          <h2
            className="t2-heading"
            style={{
              fontFamily: 'var(--t2-font-serif)',
              fontSize: 'clamp(2.2rem, 4.2vw, 4.2rem)',
              fontWeight: 300,
              lineHeight: 1.08,
              letterSpacing: '-0.022em',
              color: 'var(--t2-text)',
              marginBottom: 48,
              maxWidth: '15ch',
            }}
          >
            <HeadlineReveal text={headline} stagger={60} delay={120} />
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            {body.map((p, i) => (
              <RevealOnScroll key={i} variant="fade-up" delay={240 + i * 140} duration={900}>
                <p
                  style={{
                    fontFamily: 'var(--t2-font-sans)',
                    fontSize: 16,
                    lineHeight: 1.85,
                    color: 'var(--t2-text-muted)',
                    fontWeight: 300,
                    maxWidth: '52ch',
                  }}
                >
                  {p}
                </p>
              </RevealOnScroll>
            ))}
          </div>

          {signature && (
            <RevealOnScroll variant="fade-up" delay={720} duration={900}>
              <p
                style={{
                  marginTop: 48,
                  fontFamily: 'var(--t2-font-serif)',
                  fontStyle: 'italic',
                  fontSize: 22,
                  color: 'var(--t2-text)',
                  letterSpacing: '-0.01em',
                }}
              >
                — {signature}
              </p>
            </RevealOnScroll>
          )}
        </div>

        <RevealOnScroll variant="mask-up" duration={1400} threshold={0.2}>
          <ParallaxImage
            src={image}
            alt={imageAlt}
            aspect="4 / 5"
            strength={0.3}
            scale
          />
        </RevealOnScroll>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .wwt-philosophy-grid {
            grid-template-columns: 1fr !important;
            gap: 56px !important;
          }
        }
      `}</style>
    </section>
  )
}
