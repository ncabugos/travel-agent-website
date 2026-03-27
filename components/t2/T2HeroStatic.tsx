import Image from 'next/image'
import Link from 'next/link'

interface T2HeroStaticProps {
  agentId: string
  image: string
  h1: string
  h2: string
  cta1: { label: string; href: string }
  cta2: { label: string; href: string }
}

export function T2HeroStatic({ agentId, image, h1, h2, cta1, cta2 }: T2HeroStaticProps) {
  const base = `/t2/${agentId}`

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: 640,
        overflow: 'hidden',
      }}
    >
      {/* Background image */}
      <Image
        src={image}
        alt="Luxury travel destination"
        fill
        priority
        style={{ objectFit: 'cover', objectPosition: 'center 35%' }}
        sizes="100vw"
      />

      {/* Gradient overlay — light top, heavier at bottom-left */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: [
            'linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.0) 35%, rgba(0,0,0,0.72) 100%)',
            'linear-gradient(to right, rgba(0,0,0,0.35) 0%, transparent 65%)',
          ].join(', '),
        }}
      />

      {/* Content — bottom left, FS style */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 2,
          padding: 'clamp(40px, 6vw, 72px) clamp(32px, 6vw, 80px)',
          maxWidth: 760,
        }}
      >
        {/* Eyebrow label */}
        <p
          style={{
            fontFamily: 'var(--t2-font-sans)',
            fontSize: 10,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.65)',
            marginBottom: 20,
          }}
        >
          Curated Luxury Travel
        </p>

        <h1
          className="t2-heading t2-heading-xl"
          style={{
            color: '#FFFFFF',
            marginBottom: 22,
            textShadow: '0 2px 24px rgba(0,0,0,0.2)',
          }}
        >
          {h1}
        </h1>

        <p
          style={{
            fontFamily: 'var(--t2-font-sans)',
            fontSize: 'clamp(14px, 1.6vw, 16px)',
            fontWeight: 300,
            lineHeight: 1.8,
            color: 'rgba(255,255,255,0.78)',
            maxWidth: 520,
            marginBottom: 40,
          }}
        >
          {h2}
        </p>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <Link href={`${base}${cta1.href}`} className="t2-btn t2-btn-accent">
            {cta1.label}
          </Link>
          <Link
            href={`${base}${cta2.href}`}
            style={{
              fontFamily: 'var(--t2-font-sans)',
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.75)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'color 0.3s ease',
            }}
            className="t2-hero-link"
          >
            {cta2.label}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M5 12h14M15 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: 32,
          right: 48,
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--t2-font-sans)',
            fontSize: 9,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.5)',
            writingMode: 'vertical-rl',
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: 1,
            height: 40,
            background: 'rgba(255,255,255,0.3)',
            animation: 't2ScrollBounce 2.2s ease-in-out infinite',
          }}
        />
      </div>

      <style>{`
        .t2-hero-link:hover { color: #ffffff !important; }
      `}</style>
    </section>
  )
}
