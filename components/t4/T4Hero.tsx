import Image from 'next/image'
import Link from 'next/link'

interface T4HeroProps {
  agentId: string
  image: string
  imageCaption?: string
  eyebrow: string
  headline: string
  body?: string
  primaryCta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
}

/**
 * T4 hero — full-bleed image with a refined serif headline positioned
 * bottom-left, eyebrow label up top, muted gradient overlay. Mirrors the
 * slow editorial feel of Cucinelli's landing pages.
 */
export function T4Hero({
  agentId,
  image,
  imageCaption,
  eyebrow,
  headline,
  body,
  primaryCta,
  secondaryCta,
}: T4HeroProps) {
  const base = `/t4/${agentId}`
  const resolve = (href: string) => (href.startsWith('http') || href.startsWith('#') ? href : `${base}${href}`)

  return (
    <section
      style={{
        position: 'relative',
        minHeight: 'clamp(640px, 100vh, 1000px)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        color: '#fff',
        paddingBottom: 'clamp(96px, 12vh, 140px)',
      }}
    >
      {/* Image */}
      <Image
        src={image}
        alt=""
        aria-hidden
        fill
        priority
        sizes="100vw"
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
          animation: 't4Fade 1.4s var(--t4-ease) both',
        }}
        unoptimized
      />
      {/* Overlay gradient */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(20,17,15,0.35) 0%, rgba(20,17,15,0.22) 40%, rgba(20,17,15,0.72) 100%)',
        }}
      />

      {/* Copy */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 'var(--t4-content-wide)',
          margin: '0 auto',
          padding: '0 48px',
          width: '100%',
          animation: 't4FadeUp 1.1s var(--t4-ease-out) 0.2s both',
        }}
      >
        <div
          className="t4-eyebrow"
          style={{ color: 'rgba(255,255,255,0.86)', marginBottom: 28 }}
        >
          {eyebrow}
        </div>
        <h1
          className="t4-headline-xl"
          style={{ color: '#fff', maxWidth: 960, marginBottom: body ? 32 : 0, fontWeight: 300 }}
        >
          {headline}
        </h1>
        {body && (
          <p
            style={{
              fontFamily: 'var(--t4-font-body)',
              fontSize: 17,
              lineHeight: 1.78,
              color: 'rgba(251, 248, 241, 0.82)',
              maxWidth: 540,
              fontWeight: 300,
              marginBottom: (primaryCta || secondaryCta) ? 44 : 0,
            }}
          >
            {body}
          </p>
        )}

        {(primaryCta || secondaryCta) && (
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {primaryCta && (
              <Link
                href={resolve(primaryCta.href)}
                className="t4-btn t4-btn-solid-light"
              >
                {primaryCta.label}
              </Link>
            )}
            {secondaryCta && (
              <Link
                href={resolve(secondaryCta.href)}
                className="t4-btn t4-btn-ghost-light"
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Caption — lower right */}
      {imageCaption && (
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            right: 48,
            zIndex: 2,
            fontFamily: 'var(--t4-font-body)',
            fontSize: 10,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.68)',
            fontWeight: 500,
          }}
          className="t4-hero-caption"
        >
          {imageCaption}
        </div>
      )}

      <style>{`
        @media (max-width: 700px) {
          .t4-hero-caption { display: none; }
        }
      `}</style>
    </section>
  )
}
