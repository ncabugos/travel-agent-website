import Link from 'next/link'

interface T3FullBleedFeatureProps {
  agentId: string
  image: string
  eyebrow?: string
  headline: string
  body: string
  ctaLabel: string
  ctaHref: string
  align?: 'left' | 'right'
}

export function T3FullBleedFeature({
  agentId,
  image,
  eyebrow = '06 — The Journey',
  headline,
  body,
  ctaLabel,
  ctaHref,
  align = 'left',
}: T3FullBleedFeatureProps) {
  const base = `/t3/${agentId}`
  const href = ctaHref.startsWith('http') ? ctaHref : `${base}${ctaHref.startsWith('/') ? ctaHref : `/${ctaHref}`}`

  return (
    <section
      style={{
        position: 'relative',
        minHeight: 'clamp(640px, 90vh, 900px)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: align === 'left' ? 'flex-start' : 'flex-end',
        padding: 'clamp(40px, 6vw, 96px)',
        overflow: 'hidden',
      }}
    >
      {/* Full-bleed image */}
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
          zIndex: 0,
        }}
      />

      {/* Soft gradient overlay for text legibility */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            align === 'left'
              ? 'linear-gradient(90deg, rgba(20,17,15,0.65) 0%, rgba(20,17,15,0.25) 45%, rgba(20,17,15,0) 70%)'
              : 'linear-gradient(270deg, rgba(20,17,15,0.65) 0%, rgba(20,17,15,0.25) 45%, rgba(20,17,15,0) 70%)',
          zIndex: 1,
        }}
      />

      {/* Offset text card */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 560,
          background: 'var(--t3-bg)',
          padding: '48px 52px',
          color: 'var(--t3-text)',
          boxShadow: '0 40px 120px rgba(20,17,15,0.35)',
        }}
        className="t3-feature-card"
      >
        <span className="t3-eyebrow">{eyebrow}</span>
        <h2 className="t3-headline-lg" style={{ marginTop: 24, marginBottom: 20 }}>
          {headline}
        </h2>
        <p className="t3-body" style={{ marginBottom: 32 }}>
          {body}
        </p>
        <Link href={href} className="t3-btn t3-btn-solid">
          {ctaLabel}
        </Link>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .t3-feature-card {
            padding: 36px 32px !important;
            width: 100% !important;
          }
        }
      `}</style>
    </section>
  )
}
