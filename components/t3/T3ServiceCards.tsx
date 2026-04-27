import Link from 'next/link'

export interface T3ServiceCard {
  title: string
  description: string
  image: string
  cta: { label: string; href: string }
}

interface T3ServiceCardsProps {
  agentId: string
  eyebrow?: string
  heading: string
  subheading?: string
  cards: T3ServiceCard[]
}

/**
 * Four-card services grid for T3 (Meridian) template. Mirrors T2ServiceCards
 * but styled with T3 tokens: warm ivory background, bronze eyebrow, editorial
 * headline, portrait 2:3 image cards with subtle corner-bronze hover states.
 */
export function T3ServiceCards({
  agentId,
  eyebrow = 'Services',
  heading,
  subheading,
  cards,
}: T3ServiceCardsProps) {
  const base = `/t3/${agentId}`

  return (
    <section className="t3-section">
      {/* Header — two-column on desktop, stacked on mobile */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 64,
          alignItems: 'end',
          marginBottom: 64,
        }}
        className="t3-service-header"
      >
        <div>
          <span className="t3-eyebrow">{eyebrow}</span>
          <h2 className="t3-headline-xl" style={{ marginTop: 28 }}>
            {heading}
          </h2>
        </div>
        {subheading && (
          <p className="t3-body t3-body-lg" style={{ margin: 0 }}>
            {subheading}
          </p>
        )}
      </div>

      {/* Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(cards.length, 4)}, 1fr)`,
          gap: 24,
        }}
        className="t3-service-grid"
      >
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.cta.href.startsWith('http') ? card.cta.href : `${base}${card.cta.href}`}
            className="t3-service-card"
            style={{
              position: 'relative',
              display: 'block',
              overflow: 'hidden',
              color: 'inherit',
              textDecoration: 'none',
              aspectRatio: '2 / 3',
              background: 'var(--t3-bg-alt)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={card.image}
              alt={card.title}
              className="t3-service-img"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.9s var(--t3-ease-out)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to top, rgba(20,17,15,0.78) 0%, rgba(20,17,15,0.08) 58%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 24,
                right: 24,
                bottom: 24,
                color: '#fff',
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--t3-font-display)',
                  fontSize: 'clamp(22px, 2vw, 28px)',
                  fontWeight: 500,
                  letterSpacing: '-0.01em',
                  marginBottom: 12,
                  lineHeight: 1.15,
                }}
              >
                {card.title}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--t3-font-body)',
                  fontSize: 13.5,
                  color: 'rgba(247, 245, 240, 0.78)',
                  lineHeight: 1.55,
                  marginBottom: 20,
                }}
              >
                {card.description}
              </p>
              <span
                className="t3-service-cta"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontFamily: 'var(--t3-font-body)',
                  fontSize: 10,
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.86)',
                  transition: 'color 0.2s ease, gap 0.2s ease',
                }}
              >
                {card.cta.label}
                <span className="t3-service-arrow" style={{ transition: 'transform 0.25s ease' }}>
                  →
                </span>
              </span>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        .t3-service-card:hover .t3-service-img { transform: scale(1.04); }
        .t3-service-card:hover .t3-service-cta { color: #fff; }
        .t3-service-card:hover .t3-service-arrow { transform: translateX(4px); }
        @media (max-width: 900px) {
          .t3-service-header { grid-template-columns: 1fr !important; gap: 24px !important; }
          .t3-service-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .t3-service-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
