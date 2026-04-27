import Link from 'next/link'
import { ParallaxImage } from './ParallaxImage'
import { RevealOnScroll, HeadlineReveal } from './RevealOnScroll'

interface WWTHeroProps {
  agentId: string
  image: string
  eyebrow: string
  headline: string
  body: string
  cta1: { label: string; href: string }
  cta2?: { label: string; href: string }
}

export function WWTHero({ agentId, image, eyebrow, headline, body, cta1, cta2 }: WWTHeroProps) {
  const base = `/t2/${agentId}`

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        background: 'var(--t2-dark-bg)',
        overflow: 'hidden',
      }}
    >
      {/* Full-bleed parallax image */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <ParallaxImage
          src={image}
          aspect="auto"
          strength={0.35}
          scale
          overlay="linear-gradient(180deg, rgba(22,20,14,0.35) 0%, rgba(22,20,14,0.15) 40%, rgba(22,20,14,0.65) 100%)"
          style={{ position: 'absolute', inset: 0, height: '100%' }}
          priority
        />
      </div>

      {/* Copy */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 'clamp(32px, 8vw, 88px) clamp(24px, 6vw, 72px) clamp(72px, 11vw, 128px)',
          color: 'var(--t2-dark-text)',
          maxWidth: 1480,
          margin: '0 auto',
        }}
      >
        <RevealOnScroll variant="fade" delay={100} duration={1200}>
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

        <h1
          className="t2-heading"
          style={{
            fontFamily: 'var(--t2-font-serif)',
            fontSize: 'clamp(3rem, 7.4vw, 7rem)',
            fontWeight: 300,
            lineHeight: 1.02,
            letterSpacing: '-0.024em',
            maxWidth: '14ch',
            marginBottom: 36,
          }}
        >
          <HeadlineReveal text={headline} stagger={90} delay={200} />
        </h1>

        <RevealOnScroll variant="fade-up" delay={900} duration={900}>
          <p
            style={{
              fontFamily: 'var(--t2-font-sans)',
              fontSize: 'clamp(15px, 1.2vw, 17px)',
              lineHeight: 1.75,
              fontWeight: 300,
              maxWidth: '52ch',
              marginBottom: 48,
              opacity: 0.95,
            }}
          >
            {body}
          </p>
        </RevealOnScroll>

        <RevealOnScroll variant="fade-up" delay={1100} duration={900}>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <Link
              href={`${base}${cta1.href}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '18px 42px',
                border: '1px solid rgba(241,234,213,0.9)',
                color: 'var(--t2-dark-text)',
                textDecoration: 'none',
                fontFamily: 'var(--t2-font-sans)',
                fontSize: 12,
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
                fontWeight: 500,
                transition: 'background 260ms var(--t2-ease), color 260ms var(--t2-ease)',
              }}
              className="wwt-hero-cta"
            >
              {cta1.label}
            </Link>
            {cta2 && (
              <Link
                href={`${base}${cta2.href}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '18px 0',
                  color: 'var(--t2-dark-text)',
                  textDecoration: 'none',
                  fontFamily: 'var(--t2-font-sans)',
                  fontSize: 12,
                  letterSpacing: '0.26em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  borderBottom: '1px solid rgba(241,234,213,0.75)',
                  transition: 'opacity 260ms var(--t2-ease)',
                }}
                className="wwt-hero-cta-underline"
              >
                {cta2.label}
              </Link>
            )}
          </div>
        </RevealOnScroll>

        {/* Scroll indicator */}
        <RevealOnScroll variant="fade" delay={1600} duration={1200}>
          <div
            style={{
              position: 'absolute',
              bottom: 28,
              right: 'clamp(24px, 6vw, 72px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              opacity: 0.7,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--t2-font-sans)',
                fontSize: 10,
                letterSpacing: '0.32em',
                textTransform: 'uppercase',
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
              }}
            >
              Scroll
            </span>
            <span
              style={{
                display: 'block',
                width: 1,
                height: 48,
                background: 'currentColor',
                animation: 'wwt-scroll-line 2400ms ease-in-out infinite',
              }}
            />
          </div>
        </RevealOnScroll>
      </div>

      <style>{`
        /* Inline styles on the Link set color/border — use !important so
           the hover actually inverts (light fill + dark text). */
        .wwt-hero-cta:hover {
          background: var(--t2-dark-text) !important;
          color: var(--t2-dark-bg) !important;
          border-color: var(--t2-dark-text) !important;
        }
        .wwt-hero-cta-underline:hover {
          opacity: 0.7;
        }
        @keyframes wwt-scroll-line {
          0%, 100% { transform: scaleY(1); transform-origin: top; opacity: 0.7; }
          50%      { transform: scaleY(0.3); transform-origin: top; opacity: 0.3; }
        }
      `}</style>
    </section>
  )
}
