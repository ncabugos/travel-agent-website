import Link from 'next/link'

interface ServiceCard {
  title: string
  description: string
  /** Optional thumbnail; if empty, the row renders without an image. */
  image: string
  cta: { label: string; href: string }
}

interface Props {
  agentId: string
  heading: string
  subheading: string
  cards: ServiceCard[]
}

// Editorial alternative to T2ServiceCards. Renders services as a numbered,
// hairline-divided index — descriptions stay visible, the 4th "no-image" card
// no longer has to live in an awkward dark tile. Used for the Coast & Compass
// Growth demo; usable for any persona that wants this layout via a slug check
// in app/t2/[agentId]/page.tsx.
export function T2ServiceCardsEditorial({ agentId, heading, subheading, cards }: Props) {
  const base = `/t2/${agentId}`

  return (
    <section style={{ padding: 'var(--t2-section-pad) 0', background: 'var(--t2-bg)' }}>
      {/* Section header — same shape as T2ServiceCards for visual continuity */}
      <div
        style={{
          maxWidth: 'var(--t2-content-max, 1280px)',
          margin: '0 auto',
          padding: '0 48px',
          marginBottom: 64,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 32,
        }}
        className="t2-ed-services-header"
      >
        <div style={{ maxWidth: 560 }}>
          <p className="t2-label" style={{ marginBottom: 16 }}>Services</p>
          <h2 className="t2-heading t2-heading-lg">{heading}</h2>
        </div>
        {subheading && (
          <p className="t2-body" style={{ maxWidth: 380, marginBottom: 0 }}>
            {subheading}
          </p>
        )}
      </div>

      {/* Editorial index */}
      <ol
        style={{
          listStyle: 'none',
          margin: 0,
          padding: '0 48px',
          maxWidth: 'var(--t2-content-max, 1280px)',
          marginLeft: 'auto',
          marginRight: 'auto',
          borderTop: '1px solid var(--t2-rule, rgba(0,0,0,0.12))',
        }}
        className="t2-ed-services-list"
      >
        {cards.map((card, i) => {
          const href = `${base}${card.cta.href}`
          const number = String(i + 1).padStart(2, '0')

          return (
            <li
              key={i}
              style={{
                borderBottom: '1px solid var(--t2-rule, rgba(0,0,0,0.12))',
              }}
            >
              <Link
                href={href}
                className="t2-ed-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr 200px 60px',
                  alignItems: 'center',
                  gap: 32,
                  padding: '36px 0',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'background-color 0.4s ease, padding 0.4s ease',
                }}
              >
                {/* Number */}
                <span
                  className="t2-ed-num"
                  style={{
                    fontFamily: 'var(--t2-font-serif)',
                    fontSize: 22,
                    fontWeight: 300,
                    color: 'var(--t2-accent, #B8926A)',
                    letterSpacing: '0.02em',
                    transition: 'color 0.3s ease, transform 0.4s ease',
                  }}
                >
                  {number}
                </span>

                {/* Title + description */}
                <div>
                  <h3
                    className="t2-ed-title"
                    style={{
                      fontFamily: 'var(--t2-font-serif)',
                      fontSize: 28,
                      fontWeight: 300,
                      lineHeight: 1.15,
                      marginBottom: 12,
                      color: 'var(--t2-text, #14120E)',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {card.title}
                  </h3>
                  <p
                    className="t2-ed-desc"
                    style={{
                      fontFamily: 'var(--t2-font-sans)',
                      fontSize: 14,
                      lineHeight: 1.65,
                      fontWeight: 300,
                      color: 'var(--t2-text-muted, rgba(20,18,14,0.62))',
                      margin: 0,
                      maxWidth: 540,
                    }}
                  >
                    {card.description}
                  </p>
                </div>

                {/* Thumbnail OR gold CTA button (when no image is provided).
                    Renders as a styled span — the whole row is already a Link,
                    so this stays semantically valid while looking like a button. */}
                <div
                  className="t2-ed-thumb-wrap"
                  style={{
                    width: 200,
                    aspectRatio: card.image ? '3/2' : 'auto',
                    overflow: 'hidden',
                    background: card.image ? 'var(--t2-bg-alt, #F4F1EB)' : 'transparent',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}
                >
                  {card.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={card.image}
                      alt={card.title}
                      className="t2-ed-thumb"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    />
                  ) : (
                    <span
                      className="t2-ed-btn"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'var(--t2-accent, #B8926A)',
                        color: '#FFFFFF',
                        fontFamily: 'var(--t2-font-sans)',
                        fontSize: 11,
                        fontWeight: 500,
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        padding: '16px 24px',
                        whiteSpace: 'nowrap',
                        transition: 'background 0.3s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    >
                      {card.cta.label}
                    </span>
                  )}
                </div>

                {/* CTA arrow */}
                <span
                  className="t2-ed-arrow"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    color: 'var(--t2-text, #14120E)',
                    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s ease',
                  }}
                  aria-label={card.cta.label}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1" strokeLinecap="round">
                    <path d="M5 12h14M15 6l6 6-6 6" />
                  </svg>
                </span>
              </Link>
            </li>
          )
        })}
      </ol>

      <style>{`
        .t2-ed-row:hover { background-color: var(--t2-bg-alt, #F4F1EB); padding-left: 16px !important; padding-right: 16px !important; }
        .t2-ed-row:hover .t2-ed-thumb { transform: scale(1.06); }
        .t2-ed-row:hover .t2-ed-arrow { transform: translateX(8px); color: var(--t2-accent, #B8926A); }
        .t2-ed-row:hover .t2-ed-num { color: var(--t2-text, #14120E); }
        .t2-ed-row:hover .t2-ed-btn { background: var(--t2-accent-hover, #D4B68C); transform: translateY(-1px); }

        @media (max-width: 900px) {
          .t2-ed-services-header { flex-direction: column !important; align-items: flex-start !important; }
          .t2-ed-row {
            grid-template-columns: 56px 1fr 48px !important;
            gap: 20px !important;
            padding: 28px 0 !important;
          }
          .t2-ed-thumb-wrap { display: none !important; }
          .t2-ed-title { font-size: 22px !important; }
          .t2-ed-num { font-size: 18px !important; }
          .t2-ed-row:hover { padding-left: 12px !important; padding-right: 12px !important; }
        }
        @media (max-width: 480px) {
          .t2-ed-services-list { padding-left: 24px !important; padding-right: 24px !important; }
        }
      `}</style>
    </section>
  )
}
