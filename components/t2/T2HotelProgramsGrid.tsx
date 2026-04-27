import Image from 'next/image'
import Link from 'next/link'
import type { HotelProgram } from '@/lib/hotel-programs'

interface T2HotelProgramsGridProps {
  agentId: string
  programs: HotelProgram[]
  eyebrow?: string
  heading?: string
  subheading?: string
  columns?: 2 | 3 | 4
  limit?: number
  ctaLabel?: string
}

/**
 * Curated hotel-programs grid for T2 (Vista) — a non-searchable list of
 * preferred programs, each card linking to its brand-detail page. Used on
 * Starter-tier T2 home pages and on the `/book-hotel` index of any T2 site
 * that should not expose the full searchable directory.
 */
export function T2HotelProgramsGrid({
  agentId,
  programs,
  eyebrow = 'Hotel Programs',
  heading = 'Our preferred hotel programs.',
  subheading,
  columns = 3,
  limit,
  ctaLabel = 'View Program',
}: T2HotelProgramsGridProps) {
  const base = `/t2/${agentId}`
  const items = typeof limit === 'number' ? programs.slice(0, limit) : programs

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
          className="t2-programs-grid"
        >
          {items.map((program) => (
            <Link
              key={program.slug}
              href={`${base}/book-hotel/${program.slug}`}
              className="t2-program-card"
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
              {program.image_url && (
                <div style={{ position: 'relative', aspectRatio: '16 / 10', overflow: 'hidden' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={program.image_url}
                    alt={program.name}
                    className="t2-program-card-img"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.9s ease',
                    }}
                  />
                </div>
              )}
              <div style={{ padding: '28px 28px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                {program.logo_url && (
                  <div style={{ height: 40, marginBottom: 16, display: 'flex', alignItems: 'center' }}>
                    <Image
                      src={program.logo_url}
                      alt={program.name}
                      width={160}
                      height={40}
                      style={{ objectFit: 'contain', maxHeight: 40, width: 'auto' }}
                      unoptimized
                    />
                  </div>
                )}
                <h3
                  style={{
                    fontFamily: 'var(--t2-font-serif)',
                    fontSize: 'clamp(18px, 1.6vw, 22px)',
                    fontWeight: 400,
                    marginBottom: 10,
                    color: 'var(--t2-text)',
                  }}
                >
                  {program.name}
                </h3>
                {program.tagline && (
                  <p
                    style={{
                      fontFamily: 'var(--t2-font-sans)',
                      fontSize: 14,
                      color: 'var(--t2-text-muted)',
                      lineHeight: 1.55,
                      marginBottom: 20,
                    }}
                  >
                    {program.tagline}
                  </p>
                )}
                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: 16,
                    borderTop: '1px solid var(--t2-divider)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: 10,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    fontWeight: 500,
                    color: 'var(--t2-text-muted)',
                  }}
                >
                  <span>
                    {program.property_count ? `${program.property_count}+ properties` : 'Invitation only'}
                  </span>
                  <span style={{ color: 'var(--t2-accent)' }}>{ctaLabel} →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .t2-program-card:hover { border-color: var(--t2-accent) !important; }
        .t2-program-card:hover .t2-program-card-img { transform: scale(1.04); }
        @media (max-width: 1000px) {
          .t2-programs-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .t2-programs-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
