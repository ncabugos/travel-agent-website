import Image from 'next/image'
import Link from 'next/link'

interface T4Destination {
  name: string
  subtitle?: string
  image: string
  href?: string
}

interface T4DestinationGalleryProps {
  eyebrow?: string
  headline?: string
  body?: string
  destinations: T4Destination[]
}

/**
 * Editorial asymmetric destination gallery — 1 dominant lead + 4 supporting
 * frames arranged in a tall magazine-style spread.
 */
export function T4DestinationGallery({
  eyebrow = 'Destinations',
  headline = 'Where we return, year after year.',
  body,
  destinations,
}: T4DestinationGalleryProps) {
  if (!destinations.length) return null
  const [lead, ...rest] = destinations
  const grid = rest.slice(0, 4)

  return (
    <section style={{ padding: 'var(--t4-section-pad) 0', background: 'var(--t4-bg)' }}>
      <div
        style={{
          maxWidth: 'var(--t4-content-wide)',
          margin: '0 auto',
          padding: '0 48px',
        }}
      >
        {/* Header */}
        <div style={{ maxWidth: 720, marginBottom: 72 }}>
          <span className="t4-eyebrow">{eyebrow}</span>
          <h2 className="t4-headline-xl" style={{ marginTop: 28, marginBottom: body ? 24 : 0 }}>
            {headline}
          </h2>
          {body && <p className="t4-body t4-body-lg">{body}</p>}
        </div>

        {/* Asymmetric layout: 2 columns — left tall lead, right 2x2 grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.3fr 1fr',
            gap: 24,
          }}
          className="t4-destination-layout"
        >
          <DestinationCard destination={lead} variant="lead" />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 24,
            }}
            className="t4-destination-inner-grid"
          >
            {grid.map((d) => (
              <DestinationCard key={d.name} destination={d} variant="grid" />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .t4-destination-layout { grid-template-columns: 1fr !important; }
          .t4-destination-inner-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .t4-destination-inner-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

function DestinationCard({
  destination,
  variant,
}: {
  destination: T4Destination
  variant: 'lead' | 'grid'
}) {
  const aspect = variant === 'lead' ? '3 / 4' : '4 / 5'
  const card = (
    <div
      className="t4-destination-card"
      style={{
        position: 'relative',
        aspectRatio: aspect,
        overflow: 'hidden',
        display: 'block',
        background: 'var(--t4-bg-alt)',
      }}
    >
      <Image
        src={destination.image}
        alt={destination.name}
        fill
        sizes={variant === 'lead' ? '(max-width: 900px) 100vw, 40vw' : '(max-width: 900px) 50vw, 25vw'}
        style={{ objectFit: 'cover', transition: 'transform 1.1s var(--t4-ease-out)' }}
        className="t4-destination-img"
        unoptimized
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to top, rgba(20,17,15,0.62) 0%, rgba(20,17,15,0.0) 40%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 24,
          bottom: 24,
          right: 24,
          color: '#fff',
        }}
      >
        {destination.subtitle && (
          <div
            style={{
              fontFamily: 'var(--t4-font-body)',
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'rgba(251, 248, 241, 0.78)',
              marginBottom: 8,
            }}
          >
            {destination.subtitle}
          </div>
        )}
        <div
          style={{
            fontFamily: 'var(--t4-font-display)',
            fontSize: variant === 'lead' ? 'clamp(28px, 3vw, 42px)' : 'clamp(20px, 1.6vw, 26px)',
            fontWeight: 300,
            lineHeight: 1.1,
            letterSpacing: '-0.005em',
          }}
        >
          {destination.name}
        </div>
      </div>
    </div>
  )

  if (destination.href) {
    return (
      <Link
        href={destination.href}
        style={{ textDecoration: 'none', color: 'inherit' }}
        className="t4-destination-link"
      >
        {card}
        <style>{`
          .t4-destination-link:hover .t4-destination-img { transform: scale(1.04); }
        `}</style>
      </Link>
    )
  }

  return card
}
