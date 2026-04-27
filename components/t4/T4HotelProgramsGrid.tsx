import Image from 'next/image'
import Link from 'next/link'
import type { HotelProgram } from '@/lib/hotel-programs'

interface T4HotelProgramsGridProps {
  agentId: string
  programs: HotelProgram[]
  eyebrow?: string
  heading?: string
  body?: string
  limit?: number
  ctaHref?: string
  ctaLabel?: string
}

/**
 * T4 hotel-programs section. Alternating two-column layout per program:
 * image on one side, program logo + tagline + "Discover" arrow on the
 * other. Editorial, slow-scroll feel. Limits to `limit` programs on home
 * pages; full grid on the /book-hotel index.
 */
export function T4HotelProgramsGrid({
  agentId,
  programs,
  eyebrow = 'The House',
  heading = 'Our preferred programs.',
  body,
  limit = 4,
  ctaHref,
  ctaLabel = 'All Programs',
}: T4HotelProgramsGridProps) {
  if (programs.length === 0) return null
  const base = `/t4/${agentId}`
  const items = programs.slice(0, limit)

  return (
    <section style={{ padding: 'var(--t4-section-pad) 0', background: 'var(--t4-bg-alt)' }}>
      <div
        style={{
          maxWidth: 'var(--t4-content-wide)',
          margin: '0 auto',
          padding: '0 48px',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 48,
            alignItems: 'end',
            marginBottom: 72,
          }}
          className="t4-programs-header"
        >
          <div>
            <span className="t4-eyebrow">{eyebrow}</span>
            <h2 className="t4-headline-xl" style={{ marginTop: 28 }}>
              {heading}
            </h2>
          </div>
          {body && <p className="t4-body t4-body-lg" style={{ margin: 0 }}>{body}</p>}
        </div>

        {/* Programs — alternating rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 96 }}>
          {items.map((program, i) => (
            <article
              key={program.slug}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 64,
                alignItems: 'center',
              }}
              className="t4-program-row"
            >
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '4 / 5',
                  overflow: 'hidden',
                  order: i % 2 === 0 ? 1 : 2,
                  background: 'var(--t4-bg)',
                }}
                className={i % 2 === 0 ? 't4-program-img-left' : 't4-program-img-right'}
              >
                {program.image_url && (
                  <Image
                    src={program.image_url}
                    alt={program.name}
                    fill
                    sizes="(max-width: 900px) 100vw, 50vw"
                    style={{
                      objectFit: 'cover',
                      transition: 'transform 1.2s var(--t4-ease-out)',
                    }}
                    className="t4-program-img"
                    unoptimized
                  />
                )}
              </div>

              <div style={{ order: i % 2 === 0 ? 2 : 1, padding: '0 16px' }}>
                <div
                  style={{
                    fontFamily: 'var(--t4-font-body)',
                    fontSize: 10,
                    letterSpacing: '0.32em',
                    textTransform: 'uppercase',
                    color: 'var(--t4-accent)',
                    marginBottom: 20,
                    fontWeight: 500,
                  }}
                >
                  {`No. ${String(i + 1).padStart(2, '0')}`}
                </div>

                {program.logo_url && (
                  <div style={{ height: 52, marginBottom: 24 }}>
                    <Image
                      src={program.logo_url}
                      alt={program.name}
                      width={220}
                      height={52}
                      style={{ objectFit: 'contain', maxHeight: 52, width: 'auto' }}
                      unoptimized
                    />
                  </div>
                )}

                <h3 className="t4-headline-lg" style={{ marginBottom: 16 }}>
                  {program.name}
                </h3>

                {program.tagline && (
                  <p
                    style={{
                      fontFamily: 'var(--t4-font-display)',
                      fontStyle: 'italic',
                      fontSize: 19,
                      color: 'var(--t4-accent)',
                      lineHeight: 1.5,
                      margin: '0 0 20px',
                    }}
                  >
                    {program.tagline}
                  </p>
                )}

                {program.description && (
                  <p className="t4-body" style={{ marginBottom: 32, maxWidth: 520 }}>
                    {program.description.length > 220
                      ? program.description.slice(0, 217).trimEnd() + '…'
                      : program.description}
                  </p>
                )}

                <Link
                  href={`${base}/book-hotel/${program.slug}`}
                  className="t4-link"
                >
                  Discover the Program
                  <span className="t4-arrow">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Footer CTA */}
        {programs.length > items.length && (
          <div style={{ marginTop: 72, textAlign: 'center' }}>
            <Link
              href={ctaHref ?? `${base}/book-hotel`}
              className="t4-btn"
            >
              {ctaLabel}
            </Link>
          </div>
        )}
      </div>

      <style>{`
        .t4-program-row:hover .t4-program-img { transform: scale(1.03); }
        @media (max-width: 900px) {
          .t4-programs-header { grid-template-columns: 1fr !important; gap: 24px !important; }
          .t4-program-row { grid-template-columns: 1fr !important; gap: 32px !important; }
          .t4-program-row > div { order: initial !important; padding: 0 !important; }
          .t4-program-img-left, .t4-program-img-right { order: 1 !important; }
        }
      `}</style>
    </section>
  )
}
