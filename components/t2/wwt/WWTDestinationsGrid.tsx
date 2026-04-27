import Link from 'next/link'
import { RevealOnScroll, HeadlineReveal } from './RevealOnScroll'

export interface WWTDestination {
  label: string
  region: string
  image: string
  href: string
}

interface WWTDestinationsGridProps {
  agentId: string
  eyebrow: string
  headline: string
  body?: string
  items: WWTDestination[]
}

/**
 * Aethos-style destination highlights — a restrained six-card grid with
 * portrait-orientation images. Each card reveals on scroll with a subtle
 * stagger. Hover zooms the image and brightens the label.
 */
export function WWTDestinationsGrid({
  agentId,
  eyebrow,
  headline,
  body,
  items,
}: WWTDestinationsGridProps) {
  const base = `/t2/${agentId}`

  return (
    <section
      style={{
        padding: 'var(--t2-section-pad) 0',
        background: 'var(--t2-bg-alt)',
      }}
    >
      <div
        style={{
          maxWidth: 1480,
          margin: '0 auto',
          padding: '0 clamp(24px, 6vw, 72px)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(32px, 5vw, 80px)',
            alignItems: 'end',
            marginBottom: 'clamp(56px, 8vw, 96px)',
          }}
          className="wwt-dest-header"
        >
          <div>
            <RevealOnScroll variant="fade-up" duration={900}>
              <p className="t2-label" style={{ marginBottom: 32 }}>{eyebrow}</p>
            </RevealOnScroll>
            <h2
              className="t2-heading"
              style={{
                fontFamily: 'var(--t2-font-serif)',
                fontSize: 'clamp(2rem, 3.8vw, 3.6rem)',
                fontWeight: 300,
                lineHeight: 1.08,
                letterSpacing: '-0.02em',
                color: 'var(--t2-text)',
                maxWidth: '16ch',
              }}
            >
              <HeadlineReveal text={headline} stagger={55} />
            </h2>
          </div>
          {body && (
            <RevealOnScroll variant="fade-up" delay={220} duration={900}>
              <p
                style={{
                  fontFamily: 'var(--t2-font-sans)',
                  fontSize: 15,
                  lineHeight: 1.85,
                  color: 'var(--t2-text-muted)',
                  fontWeight: 300,
                  maxWidth: '46ch',
                  marginLeft: 'auto',
                }}
              >
                {body}
              </p>
            </RevealOnScroll>
          )}
        </div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'clamp(16px, 2.2vw, 32px) clamp(16px, 2.2vw, 32px)',
          }}
          className="wwt-dest-grid"
        >
          {items.map((d, i) => (
            <RevealOnScroll key={d.label} variant="fade-up" delay={i * 90} duration={1000}>
              <Link href={`${base}${d.href}`} style={{ textDecoration: 'none', display: 'block' }}>
                <div className="wwt-dest-card">
                  <div className="wwt-dest-media">
                    <div
                      className="wwt-dest-img"
                      style={{ backgroundImage: `url("${encodeURI(d.image)}")` }}
                    />
                    <div className="wwt-dest-overlay" />
                  </div>
                  <div style={{ paddingTop: 20 }}>
                    <p
                      style={{
                        fontFamily: 'var(--t2-font-sans)',
                        fontSize: 10,
                        letterSpacing: '0.32em',
                        textTransform: 'uppercase',
                        color: 'var(--t2-text-muted)',
                        marginBottom: 8,
                        fontWeight: 500,
                      }}
                    >
                      {d.region}
                    </p>
                    <h3
                      style={{
                        fontFamily: 'var(--t2-font-serif)',
                        fontSize: 'clamp(1.4rem, 2vw, 1.8rem)',
                        fontWeight: 400,
                        color: 'var(--t2-text)',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {d.label}
                    </h3>
                  </div>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </div>

      <style>{`
        .wwt-dest-card { cursor: pointer; }
        .wwt-dest-media {
          position: relative;
          overflow: hidden;
          aspect-ratio: 4 / 5;
          background: var(--t2-divider);
        }
        .wwt-dest-img {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transform: scale(1.02);
          transition: transform 1400ms cubic-bezier(0.2, 0.7, 0.1, 1), filter 900ms var(--t2-ease);
        }
        .wwt-dest-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(22,20,14,0.05) 0%, rgba(22,20,14,0.28) 100%);
          transition: opacity 900ms var(--t2-ease);
        }
        .wwt-dest-card:hover .wwt-dest-img {
          transform: scale(1.10);
          filter: saturate(1.05);
        }
        .wwt-dest-card:hover .wwt-dest-overlay {
          opacity: 0.55;
        }
        @media (max-width: 960px) {
          .wwt-dest-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .wwt-dest-header { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
        @media (max-width: 560px) {
          .wwt-dest-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
