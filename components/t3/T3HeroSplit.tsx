import Link from 'next/link'

interface T3HeroSplitProps {
  agentId: string
  image: string
  imageCaption?: string
  eyebrow: string
  headlineLine1: string
  headlineLine2: string
  body: string
  primaryCta: { label: string; href: string }
  secondaryCta: { label: string; href: string }
}

export function T3HeroSplit({
  agentId,
  image,
  imageCaption,
  eyebrow,
  headlineLine1,
  headlineLine2,
  body,
  primaryCta,
  secondaryCta,
}: T3HeroSplitProps) {
  const base = `/t3/${agentId}`
  const resolve = (href: string) =>
    href.startsWith('http') || href.startsWith('#') ? href : `${base}${href.startsWith('/') ? href : `/${href}`}`

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '55fr 45fr',
        background: 'var(--t3-bg)',
      }}
      className="t3-hero-split"
    >
      {/* Left: full-bleed image */}
      <div
        style={{
          position: 'relative',
          minHeight: 520,
          overflow: 'hidden',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt=""
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {/* Soft gradient on mobile for nav legibility */}
        <div
          className="t3-hero-gradient"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(20,17,15,0.42) 0%, rgba(20,17,15,0) 25%, rgba(20,17,15,0) 65%, rgba(20,17,15,0.42) 100%)',
            pointerEvents: 'none',
          }}
        />
        {imageCaption && (
          <div
            style={{
              position: 'absolute',
              bottom: 32,
              left: 32,
              color: '#fff',
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              opacity: 0.85,
            }}
          >
            <span style={{ display: 'inline-block', width: 20, height: 1, background: '#fff', verticalAlign: 'middle', marginRight: 12, opacity: 0.7 }} />
            {imageCaption}
          </div>
        )}
      </div>

      {/* Right: cream panel */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '140px 80px 80px',
          background: 'var(--t3-bg)',
        }}
        className="t3-hero-panel"
      >
        <div style={{ maxWidth: 560 }}>
          <span className="t3-eyebrow" style={{ marginBottom: 32, display: 'inline-flex' }}>
            {eyebrow}
          </span>

          <h1
            className="t3-headline-xl"
            style={{
              marginTop: 24,
              marginBottom: 28,
            }}
          >
            {headlineLine1}
            <br />
            <em
              style={{
                fontStyle: 'normal',
                color: 'var(--t3-accent)',
                fontWeight: 400,
              }}
            >
              {headlineLine2}
            </em>
          </h1>

          <p className="t3-body t3-body-lg" style={{ marginBottom: 48, maxWidth: 480 }}>
            {body}
          </p>

          <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
            <Link href={resolve(primaryCta.href)} className="t3-btn t3-btn-solid">
              {primaryCta.label}
            </Link>
            <Link href={resolve(secondaryCta.href)} className="t3-link-arrow">
              {secondaryCta.label}
              <span className="arrow">→</span>
            </Link>
          </div>
        </div>

        {/* Corner section marker */}
        <div
          style={{
            position: 'absolute',
            bottom: 48,
            right: 48,
            fontFamily: 'var(--t3-font-display)',
            fontSize: 11,
            letterSpacing: '0.24em',
            color: 'var(--t3-text-soft)',
            textTransform: 'uppercase',
          }}
        >
          01 / Welcome
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .t3-hero-split {
            grid-template-columns: 1fr !important;
            min-height: auto !important;
          }
          .t3-hero-split > div:first-child {
            min-height: 60vh !important;
          }
          .t3-hero-panel {
            padding: 80px 32px 64px !important;
          }
        }
      `}</style>
    </section>
  )
}
