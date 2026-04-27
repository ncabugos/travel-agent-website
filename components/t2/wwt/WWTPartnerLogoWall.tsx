import Image from 'next/image'
import Link from 'next/link'
import { RevealOnScroll, HeadlineReveal } from './RevealOnScroll'

export interface PartnerLogo {
  name: string
  logo: string
  /** Optional link — e.g. `/book-hotel/{slug}` */
  href?: string
  /** If true, invert-whites on hover (for logos with transparent black). */
  invertOnHover?: boolean
}

interface WWTPartnerLogoWallProps {
  eyebrow: string
  headline: string
  body?: string
  items: PartnerLogo[]
  /** Optional agent-scoped base for href resolution */
  agentId?: string
}

/**
 * Aethos-style "Preferred Partners" logo wall. 3x3 grid of muted/grayscale
 * brand logos; each tile reveals on scroll and brightens on hover. Logos
 * scale down proportionally on mobile to a 2-col / 1-col grid.
 */
export function WWTPartnerLogoWall({
  eyebrow,
  headline,
  body,
  items,
  agentId,
}: WWTPartnerLogoWallProps) {
  const base = agentId ? `/t2/${agentId}` : ''

  return (
    <section
      style={{
        padding: 'var(--t2-section-pad) 0',
        background: '#ffffff',
      }}
    >
      <div
        style={{
          maxWidth: 1480,
          margin: '0 auto',
          padding: '0 clamp(24px, 6vw, 72px)',
        }}
      >
        {/* Header — copy + body, grid layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(32px, 5vw, 80px)',
            alignItems: 'end',
            marginBottom: 'clamp(56px, 8vw, 96px)',
          }}
          className="wwt-partner-header"
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

        {/* Logo grid — borderless, responsive column count.
            5 cols on wide desktops, collapsing to 4 → 3 → 2 on smaller screens. */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            columnGap: 'clamp(20px, 2.8vw, 56px)',
            rowGap: 'clamp(24px, 3.2vw, 56px)',
          }}
          className="wwt-partner-grid"
        >
          {items.map((p, i) => {
            const tile = (
              <div className="wwt-partner-tile">
                <Image
                  src={p.logo}
                  alt={p.name}
                  width={520}
                  height={260}
                  style={{
                    objectFit: 'contain',
                    maxWidth: '100%',
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                  }}
                  unoptimized
                />
              </div>
            )

            const content = p.href ? (
              <Link
                href={`${base}${p.href}`}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                {tile}
              </Link>
            ) : (
              tile
            )

            return (
              <RevealOnScroll
                key={p.name}
                variant="fade-up"
                delay={i * 50}
                duration={900}
              >
                {content}
              </RevealOnScroll>
            )
          })}
        </div>
      </div>

      <style>{`
        /* Borderless tile. Logos ship with their own whitespace, so we only
           add a subtle grayscale/dimming treatment at rest and brighten on
           hover — Aethos-style tasteful animation. */
        .wwt-partner-tile {
          display: flex;
          align-items: center;
          justify-content: center;
          aspect-ratio: 16 / 9;
          filter: grayscale(100%);
          opacity: 0.7;
          transition: filter 360ms var(--t2-ease), opacity 360ms var(--t2-ease), transform 360ms var(--t2-ease);
          cursor: pointer;
        }
        .wwt-partner-tile:hover {
          filter: grayscale(0%);
          opacity: 1;
          transform: translateY(-2px);
        }
        /* Responsive column counts — logos need pairing for comparison,
           so we never drop below 2 columns. UX rule of thumb: ≥120px width
           per tile minimum for a logo to read at its intended weight. */
        @media (max-width: 1199px) {
          .wwt-partner-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
        @media (max-width: 899px) {
          .wwt-partner-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .wwt-partner-header { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
        @media (max-width: 599px) {
          .wwt-partner-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  )
}
