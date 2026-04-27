import Link from 'next/link'
import { ParallaxImage } from './ParallaxImage'
import { RevealOnScroll, HeadlineReveal } from './RevealOnScroll'

interface WWTFeatureBandProps {
  agentId: string
  eyebrow: string
  headline: string
  body: string
  cta?: { label: string; href: string }
  image: string
  /** If set, image is on the left; copy on the right. Default: image right. */
  imageLeft?: boolean
  /** Full-bleed overlay variant — headline sits on top of the image. */
  fullBleed?: boolean
}

/**
 * Two-column cinematic feature band. Alternates between:
 * - split layout (copy | image) — Aethos "Authentic spaces" analog
 * - full-bleed overlay — Aethos "Experiences to remember" analog
 */
export function WWTFeatureBand({
  agentId,
  eyebrow,
  headline,
  body,
  cta,
  image,
  imageLeft = false,
  fullBleed = false,
}: WWTFeatureBandProps) {
  const base = `/t2/${agentId}`

  if (fullBleed) {
    return (
      <section
        style={{
          position: 'relative',
          width: '100%',
          height: 'clamp(560px, 85vh, 820px)',
          overflow: 'hidden',
          background: 'var(--t2-dark-bg)',
        }}
      >
        <div style={{ position: 'absolute', inset: 0 }}>
          <ParallaxImage
            src={image}
            aspect="auto"
            strength={0.35}
            scale
            overlay="linear-gradient(100deg, rgba(22,20,14,0.72) 0%, rgba(22,20,14,0.58) 42%, rgba(22,20,14,0.28) 72%, rgba(22,20,14,0.08) 100%)"
            style={{ position: 'absolute', inset: 0, height: '100%' }}
          />
        </div>

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            height: '100%',
            maxWidth: 1480,
            margin: '0 auto',
            padding: 'clamp(48px, 8vw, 96px) clamp(24px, 6vw, 72px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            color: 'var(--t2-dark-text)',
          }}
        >
          <RevealOnScroll variant="fade" duration={1000}>
            <p
              style={{
                fontFamily: 'var(--t2-font-sans)',
                fontSize: 11,
                letterSpacing: '0.32em',
                textTransform: 'uppercase',
                marginBottom: 32,
                opacity: 0.85,
                fontWeight: 500,
              }}
            >
              {eyebrow}
            </p>
          </RevealOnScroll>

          <h2
            className="t2-heading"
            style={{
              fontFamily: 'var(--t2-font-serif)',
              fontSize: 'clamp(2.4rem, 5.4vw, 5.2rem)',
              fontWeight: 300,
              lineHeight: 1.04,
              letterSpacing: '-0.022em',
              maxWidth: '16ch',
              marginBottom: 36,
            }}
          >
            <HeadlineReveal text={headline} stagger={70} delay={120} />
          </h2>

          <RevealOnScroll variant="fade-up" delay={420} duration={900}>
            <p
              style={{
                fontFamily: 'var(--t2-font-sans)',
                fontSize: 17,
                lineHeight: 1.8,
                maxWidth: '54ch',
                fontWeight: 300,
                opacity: 0.95,
                marginBottom: cta ? 44 : 0,
              }}
            >
              {body}
            </p>
          </RevealOnScroll>

          {cta && (
            <RevealOnScroll variant="fade-up" delay={620} duration={900}>
              <Link
                href={`${base}${cta.href}`}
                style={{
                  display: 'inline-flex',
                  padding: '18px 40px',
                  border: '1px solid rgba(241,234,213,0.9)',
                  color: 'var(--t2-dark-text)',
                  textDecoration: 'none',
                  fontFamily: 'var(--t2-font-sans)',
                  fontSize: 12,
                  letterSpacing: '0.26em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  alignSelf: 'flex-start',
                  transition: 'background 260ms var(--t2-ease), color 260ms var(--t2-ease)',
                }}
                className="wwt-hero-cta"
              >
                {cta.label}
              </Link>
            </RevealOnScroll>
          )}
        </div>
      </section>
    )
  }

  // Split layout — copy + image
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
          gridTemplateColumns: imageLeft ? '0.95fr 1.05fr' : '1.05fr 0.95fr',
          gap: 'clamp(48px, 7vw, 120px)',
          alignItems: 'center',
        }}
        className="wwt-feature-grid"
      >
        {imageLeft ? (
          <>
            <RevealOnScroll variant="mask-up" duration={1400}>
              <ParallaxImage src={image} aspect="4 / 5" strength={0.25} scale />
            </RevealOnScroll>
            <FeatureCopy agentId={agentId} eyebrow={eyebrow} headline={headline} body={body} cta={cta} />
          </>
        ) : (
          <>
            <FeatureCopy agentId={agentId} eyebrow={eyebrow} headline={headline} body={body} cta={cta} />
            <RevealOnScroll variant="mask-up" duration={1400}>
              <ParallaxImage src={image} aspect="4 / 5" strength={0.25} scale />
            </RevealOnScroll>
          </>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .wwt-feature-grid {
            grid-template-columns: 1fr !important;
            gap: 56px !important;
          }
        }
      `}</style>
    </section>
  )
}

function FeatureCopy({
  agentId,
  eyebrow,
  headline,
  body,
  cta,
}: {
  agentId: string
  eyebrow: string
  headline: string
  body: string
  cta?: { label: string; href: string }
}) {
  const base = `/t2/${agentId}`
  return (
    <div>
      <RevealOnScroll variant="fade-up" duration={900}>
        <p className="t2-label" style={{ marginBottom: 32 }}>{eyebrow}</p>
      </RevealOnScroll>
      <h2
        className="t2-heading"
        style={{
          fontFamily: 'var(--t2-font-serif)',
          fontSize: 'clamp(2rem, 3.8vw, 3.6rem)',
          fontWeight: 300,
          lineHeight: 1.08,
          letterSpacing: '-0.02em',
          color: 'var(--t2-text)',
          marginBottom: 36,
          maxWidth: '16ch',
        }}
      >
        <HeadlineReveal text={headline} stagger={60} />
      </h2>
      <RevealOnScroll variant="fade-up" delay={220} duration={900}>
        <p
          style={{
            fontFamily: 'var(--t2-font-sans)',
            fontSize: 16,
            lineHeight: 1.85,
            color: 'var(--t2-text-muted)',
            fontWeight: 300,
            maxWidth: '52ch',
            marginBottom: cta ? 40 : 0,
          }}
        >
          {body}
        </p>
      </RevealOnScroll>
      {cta && (
        <RevealOnScroll variant="fade-up" delay={380} duration={900}>
          <Link href={`${base}${cta.href}`} className="wwt-link">
            {cta.label}
          </Link>
        </RevealOnScroll>
      )}
    </div>
  )
}
