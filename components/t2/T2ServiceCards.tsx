import Image from 'next/image'
import Link from 'next/link'

interface ServiceCard {
  title: string
  description: string
  image: string
  cta: { label: string; href: string }
}

interface T2ServiceCardsProps {
  agentId: string
  heading: string
  subheading: string
  cards: ServiceCard[]
}

export function T2ServiceCards({ agentId, heading, subheading, cards }: T2ServiceCardsProps) {
  const base = `/t2/${agentId}`

  return (
    <section style={{ padding: 'var(--t2-section-pad) 0', background: 'var(--t2-bg)' }}>
      {/* Section header */}
      <div
        style={{
          maxWidth: 'var(--t2-content-max, 1280px)',
          margin: '0 auto',
          padding: '0 48px',
          marginBottom: 56,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 32,
        }}
      >
        <div style={{ maxWidth: 520 }}>
          <p className="t2-label" style={{ marginBottom: 16 }}>Services</p>
          <h2 className="t2-heading t2-heading-lg">{heading}</h2>
        </div>
        {subheading && (
          <p className="t2-body" style={{ maxWidth: 360, marginBottom: 0 }}>
            {subheading}
          </p>
        )}
      </div>

      {/* Cards — edge-to-edge flush grid, no gaps except for 2px seam */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 2,
          maxWidth: 'var(--t2-content-max, 1280px)',
          margin: '0 auto',
          padding: '0 48px',
        }}
        className="t2-service-grid"
      >
        {cards.map((card, i) => (
          <div
            key={i}
            style={{ position: 'relative', overflow: 'hidden' }}
            className="t2-service-card"
          >
            {/* Image fill — tall portrait */}
            <div style={{ position: 'relative', aspectRatio: '2/3', overflow: 'hidden' }}>
              <Image
                src={card.image}
                alt={card.title}
                fill
                style={{ objectFit: 'cover', transition: 'transform 0.9s ease' }}
                sizes="25vw"
                className="t2-service-img"
              />
              {/* Gradient for text legibility */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.08) 55%)',
                }}
              />
            </div>

            {/* Text overlay — bottom of card */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '24px 20px',
                zIndex: 2,
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--t2-font-serif)',
                  fontSize: 22,
                  fontWeight: 300,
                  color: '#FFFFFF',
                  marginBottom: 14,
                  lineHeight: 1.2,
                }}
              >
                {card.title}
              </h3>
              <Link
                href={`${base}${card.cta.href}`}
                style={{
                  fontFamily: 'var(--t2-font-sans)',
                  fontSize: 9,
                  fontWeight: 500,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.75)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'color 0.3s ease',
                }}
                className="t2-service-link"
              >
                {card.cta.label}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M5 12h14M15 6l6 6-6 6" />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .t2-service-card:hover .t2-service-img { transform: scale(1.05); }
        .t2-service-link:hover { color: rgba(255,255,255,1) !important; }
        @media (max-width: 900px) {
          .t2-service-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .t2-service-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
