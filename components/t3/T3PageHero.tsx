interface T3PageHeroProps {
  image: string
  imageAlt?: string
  eyebrow: string
  title: string
  body?: string
  height?: number
  align?: 'center' | 'left'
  imageCaption?: string
}

export function T3PageHero({
  image,
  imageAlt = '',
  eyebrow,
  title,
  body,
  height = 640,
  align = 'center',
  imageCaption,
}: T3PageHeroProps) {
  return (
    <section
      style={{
        position: 'relative',
        height,
        minHeight: 520,
        overflow: 'hidden',
        background: 'var(--t3-dark-bg)',
      }}
    >
      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={imageAlt}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      {/* Gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(20,17,15,0.45) 0%, rgba(20,17,15,0.25) 40%, rgba(20,17,15,0.6) 100%)',
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: align === 'center' ? 'center' : 'flex-start',
          textAlign: align === 'center' ? 'center' : 'left',
          padding: align === 'center' ? '140px 24px 80px' : '140px 80px 80px',
          maxWidth: 'var(--t3-content-wide)',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div style={{ maxWidth: 820 }}>
          <span
            className="t3-eyebrow"
            style={{
              color: 'rgba(255,255,255,0.82)',
              marginBottom: 32,
              justifyContent: align === 'center' ? 'center' : 'flex-start',
            }}
          >
            {eyebrow}
          </span>
          <h1
            className="t3-display"
            style={{
              marginTop: 28,
              marginBottom: 0,
              color: '#ffffff',
              fontSize: 'clamp(2.6rem, 6vw, 5.6rem)',
            }}
          >
            {title}
          </h1>
          {body && (
            <p
              style={{
                marginTop: 28,
                maxWidth: 640,
                fontSize: 17,
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.82)',
                marginLeft: align === 'center' ? 'auto' : 0,
                marginRight: align === 'center' ? 'auto' : 0,
              }}
            >
              {body}
            </p>
          )}
        </div>
      </div>

      {/* Image caption */}
      {imageCaption && (
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            left: 48,
            zIndex: 2,
            color: '#fff',
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            opacity: 0.8,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span style={{ display: 'inline-block', width: 22, height: 1, background: '#fff', opacity: 0.7 }} />
          {imageCaption}
        </div>
      )}
    </section>
  )
}
