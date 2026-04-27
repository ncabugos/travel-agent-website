import Image from 'next/image'
import Link from 'next/link'
import type { CruiseLine } from '@/lib/cruise-lines'

interface T2CruisePartnersGridProps {
  agentId: string
  lines: CruiseLine[]
  eyebrow?: string
  heading?: string
  subheading?: string
  columns?: 2 | 3 | 4
  limit?: number
}

/**
 * Curated cruise-partners grid for T2 — a non-searchable list of preferred
 * cruise lines. Each card links to that line's brand-detail page. Used on
 * Starter-tier homes and `/find-cruise` pages that should not surface the
 * full searchable directory.
 */
export function T2CruisePartnersGrid({
  agentId,
  lines,
  eyebrow = 'Preferred Cruise Partners',
  heading = 'The cruise lines we book.',
  subheading,
  columns = 3,
  limit,
}: T2CruisePartnersGridProps) {
  const base = `/t2/${agentId}`
  const items = typeof limit === 'number' ? lines.slice(0, limit) : lines

  return (
    <section style={{ padding: 'var(--t2-section-pad) 0', background: 'var(--t2-bg)' }}>
      <div
        style={{
          maxWidth: 'var(--t2-content-max, 1280px)',
          margin: '0 auto',
          padding: '0 48px',
        }}
      >
        {/* Header */}
        <div style={{ maxWidth: 760, marginBottom: 56 }}>
          <p className="t2-label" style={{ marginBottom: 16 }}>{eyebrow}</p>
          <h2 className="t2-heading t2-heading-lg" style={{ marginBottom: subheading ? 16 : 0 }}>
            {heading}
          </h2>
          {subheading && (
            <p className="t2-body" style={{ margin: 0 }}>
              {subheading}
            </p>
          )}
        </div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: 24,
            rowGap: 40,
          }}
          className="t2-cruise-partners-grid"
        >
          {items.map((line) => (
            <Link
              key={line.slug}
              href={`${base}/find-cruise/${line.slug}`}
              className="t2-cruise-partner-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: '#fff',
                color: 'inherit',
                textDecoration: 'none',
                border: '1px solid var(--t2-divider)',
                overflow: 'hidden',
                transition: 'border-color 0.3s ease, transform 0.3s ease',
              }}
            >
              {line.hero_image_url && (
                <div style={{ position: 'relative', aspectRatio: '16 / 10', overflow: 'hidden' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={line.hero_image_url}
                    alt={line.name}
                    className="t2-cruise-partner-img"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.9s ease',
                    }}
                  />
                </div>
              )}
              <div style={{ padding: '24px 24px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                {line.logo_url && (
                  <div style={{ height: 36, marginBottom: 14, display: 'flex', alignItems: 'center' }}>
                    <Image
                      src={line.logo_url}
                      alt={line.name}
                      width={140}
                      height={36}
                      style={{ objectFit: 'contain', maxHeight: 36, width: 'auto' }}
                      unoptimized
                    />
                  </div>
                )}
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 500,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: 'var(--t2-accent)',
                    marginBottom: 8,
                  }}
                >
                  {(line.cruise_types || []).join(' · ') || 'Luxury Cruise'}
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--t2-font-serif)',
                    fontSize: 'clamp(17px, 1.5vw, 20px)',
                    fontWeight: 400,
                    marginBottom: 8,
                    color: 'var(--t2-text)',
                  }}
                >
                  {line.name}
                </h3>
                {line.tagline && (
                  <p
                    style={{
                      fontFamily: 'var(--t2-font-sans)',
                      fontSize: 13,
                      color: 'var(--t2-text-muted)',
                      lineHeight: 1.5,
                      margin: '0 0 16px',
                    }}
                  >
                    {line.tagline}
                  </p>
                )}
                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: 12,
                    borderTop: '1px solid var(--t2-divider)',
                    fontSize: 10,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    fontWeight: 500,
                    color: 'var(--t2-accent)',
                  }}
                >
                  View Line →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .t2-cruise-partner-card:hover { border-color: var(--t2-accent) !important; }
        .t2-cruise-partner-card:hover .t2-cruise-partner-img { transform: scale(1.04); }
        @media (max-width: 1000px) {
          .t2-cruise-partners-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .t2-cruise-partners-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
