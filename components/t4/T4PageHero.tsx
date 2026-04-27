import Image from 'next/image'

interface T4PageHeroProps {
  image: string
  imageAlt?: string
  eyebrow: string
  title: string
  body?: string
  imageCaption?: string
  /** Height preset — defaults to 'standard' */
  size?: 'standard' | 'short'
}

/**
 * Subpage hero used by About, Atelier, Press, Journal, Hotel programs list,
 * Cruise partners list. Full-bleed image, center-aligned editorial text.
 */
export function T4PageHero({
  image,
  imageAlt = '',
  eyebrow,
  title,
  body,
  imageCaption,
  size = 'standard',
}: T4PageHeroProps) {
  const height =
    size === 'short'
      ? 'clamp(420px, 52vh, 540px)'
      : 'clamp(540px, 70vh, 720px)'

  return (
    <section
      style={{
        position: 'relative',
        minHeight: height,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        padding: '120px 24px 96px',
      }}
    >
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        style={{ objectFit: 'cover' }}
        unoptimized
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(20,17,15,0.4) 0%, rgba(20,17,15,0.56) 100%)',
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          maxWidth: 860,
        }}
      >
        <div
          className="t4-eyebrow t4-eyebrow-center"
          style={{ color: 'rgba(255,255,255,0.86)', justifyContent: 'center', marginBottom: 28 }}
        >
          {eyebrow}
        </div>
        <h1
          className="t4-headline-xl"
          style={{ color: '#fff', marginBottom: body ? 28 : 0, fontWeight: 300 }}
        >
          {title}
        </h1>
        {body && (
          <p
            style={{
              fontFamily: 'var(--t4-font-body)',
              fontSize: 17,
              lineHeight: 1.78,
              color: 'rgba(251, 248, 241, 0.82)',
              maxWidth: 600,
              margin: '0 auto',
              fontWeight: 300,
            }}
          >
            {body}
          </p>
        )}
      </div>
      {imageCaption && (
        <div
          style={{
            position: 'absolute',
            bottom: 28,
            right: 48,
            zIndex: 2,
            fontFamily: 'var(--t4-font-body)',
            fontSize: 10,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.68)',
            fontWeight: 500,
          }}
          className="t4-page-hero-caption"
        >
          {imageCaption}
        </div>
      )}

      <style>{`
        @media (max-width: 700px) {
          .t4-page-hero-caption { display: none; }
        }
      `}</style>
    </section>
  )
}
