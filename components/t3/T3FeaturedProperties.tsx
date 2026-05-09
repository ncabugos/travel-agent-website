import Link from 'next/link'
import type { FeaturedHotel } from '@/lib/featured-hotels'

interface Props {
  hotels: FeaturedHotel[]
  programName: string
  base: string
  eyebrow?: string
  heading?: string
  /** Cap the number of cards (defaults to 6 — 2 rows of 3). */
  limit?: number
}

/**
 * Editorial 3-up grid of representative properties within a hotel program.
 * Server-rendered; each card links to the supplier's detail page (Virtuoso, etc).
 * Falls back silently when no hotels are curated for the program.
 */
export function T3FeaturedProperties({
  hotels,
  programName,
  base,
  eyebrow = 'Within the Collection',
  heading,
  limit = 6,
}: Props) {
  if (!hotels || hotels.length === 0) return null
  const items = hotels.slice(0, limit)
  const headingText = heading ?? `A few ${programName} properties we know.`

  return (
    <section className="t3-section t3-section-alt">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 32,
          alignItems: 'end',
          marginBottom: 'var(--t3-gap)',
        }}
        className="t3-fp-header"
      >
        <div style={{ maxWidth: 'var(--t3-content-narrow)' }}>
          <span className="t3-eyebrow t3-eyebrow-plain">{eyebrow}</span>
          <h2 className="t3-headline-xl" style={{ marginTop: 28 }}>
            {headingText}
          </h2>
        </div>
        <Link href={`${base}/contact`} className="t3-link-arrow">
          Enquire
          <span className="arrow">→</span>
        </Link>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--t3-gap)',
        }}
        className="t3-fp-grid"
      >
        {items.map((hotel) => (
          <article key={hotel.detail_url + hotel.name} className="t3-fp-card">
            <div
              style={{
                position: 'relative',
                aspectRatio: '4 / 3',
                overflow: 'hidden',
                background: 'var(--t3-bg-alt)',
                marginBottom: 20,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={hotel.image_url}
                alt={hotel.name}
                className="t3-fp-img"
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.9s var(--t3-ease-out)',
                }}
              />
            </div>
            <div
              style={{
                fontSize: 'clamp(10px, 0.85vw, 11px)',
                fontWeight: 500,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--t3-accent)',
                marginBottom: 8,
              }}
            >
              {[hotel.city, hotel.country].filter(Boolean).join(' · ')}
            </div>
            <h3 className="t3-headline-md" style={{ marginBottom: 10, fontSize: 'clamp(17px, 1.5vw, 20px)' }}>
              {hotel.name}
            </h3>
            {hotel.description && (
              <p className="t3-body" style={{ fontSize: 'clamp(13px, 1vw, 14px)', lineHeight: 1.6, margin: 0 }}>
                {hotel.description}
              </p>
            )}
          </article>
        ))}
      </div>

      <style>{`
        .t3-fp-card:hover .t3-fp-img { transform: scale(1.04); }
        @media (max-width: 1024px) {
          .t3-fp-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .t3-fp-header { grid-template-columns: 1fr !important; gap: var(--t3-gap-tight) !important; align-items: start !important; }
        }
        @media (max-width: 768px) {
          .t3-fp-grid { grid-template-columns: 1fr !important; gap: var(--t3-gap-tight) !important; }
        }
      `}</style>
    </section>
  )
}
