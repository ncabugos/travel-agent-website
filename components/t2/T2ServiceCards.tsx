import Link from 'next/link'

interface ServiceCard {
  title: string
  description: string
  /** Pass empty string to render a solid accent card instead of an image card. */
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

      {/* Cards — flush grid */}
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
        {cards.map((card, i) => {
          const href = `${base}${card.cta.href}`
          const isSolid = !card.image

          return (
            <Link
              key={i}
              href={href}
              className="t2-service-card"
              style={{
                position: 'relative',
                display: 'block',
                overflow: 'hidden',
                textDecoration: 'none',
                color: 'inherit',
                aspectRatio: '4/5',
                background: isSolid ? 'var(--t2-dark-bg, #14120E)' : 'var(--t2-bg-alt)',
                border: isSolid ? '1px solid rgba(255,255,255,0.12)' : 'none',
              }}
            >
              {/* Image or solid fill */}
              {!isSolid && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.image}
                    alt={card.title}
                    className="t2-service-img"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.9s ease',
                    }}
                  />
                  {/* Gradient for text legibility */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.08) 52%)',
                    }}
                  />
                </>
              )}

              {/* Solid card: accent top-line */}
              {isSolid && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: 'var(--t2-accent, #B8926A)',
                  }}
                />
              )}

              {/* Image card: text pinned to bottom */}
              {!isSolid && (
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
                  <span
                    className="t2-service-link"
                    style={{
                      fontFamily: 'var(--t2-font-sans)',
                      fontSize: 9,
                      fontWeight: 500,
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.75)',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {card.cta.label}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M5 12h14M15 6l6 6-6 6" />
                    </svg>
                  </span>
                </div>
              )}

              {/* Solid card: content flows top-down with CTA pushed to bottom */}
              {isSolid && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    padding: '32px 28px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    zIndex: 2,
                  }}
                >
                  <h3
                    style={{
                      fontFamily: 'var(--t2-font-serif)',
                      fontSize: 24,
                      fontWeight: 300,
                      color: '#FFFFFF',
                      marginBottom: 16,
                      lineHeight: 1.2,
                    }}
                  >
                    {card.title}
                  </h3>
                  {card.description && (
                    <p
                      style={{
                        fontFamily: 'var(--t2-font-sans)',
                        fontSize: 13,
                        color: 'rgba(255,255,255,0.58)',
                        lineHeight: 1.65,
                        fontWeight: 300,
                      }}
                    >
                      {card.description}
                    </p>
                  )}
                  <span
                    className="t2-service-link"
                    style={{
                      fontFamily: 'var(--t2-font-sans)',
                      fontSize: 9,
                      fontWeight: 500,
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: 'var(--t2-accent, #B8926A)',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      transition: 'color 0.3s ease',
                      marginTop: 24,
                    }}
                  >
                    {card.cta.label}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M5 12h14M15 6l6 6-6 6" />
                    </svg>
                  </span>
                </div>
              )}
            </Link>
          )
        })}
      </div>

      <style>{`
        .t2-service-card:hover .t2-service-img { transform: scale(1.05); }
        .t2-service-card:hover .t2-service-link { color: rgba(255,255,255,1) !important; }
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
