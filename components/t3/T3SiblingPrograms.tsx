import Link from 'next/link'
import Image from 'next/image'
import type { HotelProgram } from '@/lib/hotel-programs'

interface Props {
  programs: HotelProgram[]
  base: string
  eyebrow?: string
  heading?: string
  /** Cap the number of cards (defaults to 3). */
  limit?: number
}

/**
 * Quiet 3-up strip of sibling hotel programs (typically same category) so the
 * program detail page doesn't dead-end at the CTA. Server-rendered.
 */
export function T3SiblingPrograms({
  programs,
  base,
  eyebrow = 'You might also consider',
  heading = 'Other programs we work with.',
  limit = 3,
}: Props) {
  if (!programs || programs.length === 0) return null
  const items = programs.slice(0, limit)

  return (
    <section className="t3-section">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 32,
          alignItems: 'end',
          marginBottom: 'var(--t3-gap)',
        }}
        className="t3-sib-header"
      >
        <div style={{ maxWidth: 'var(--t3-content-narrow)' }}>
          <span className="t3-eyebrow t3-eyebrow-plain">{eyebrow}</span>
          <h2 className="t3-headline-lg" style={{ marginTop: 24 }}>
            {heading}
          </h2>
        </div>
        <Link href={`${base}/book-hotel`} className="t3-link-arrow">
          All Programs
          <span className="arrow">→</span>
        </Link>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--t3-gap)',
        }}
        className="t3-sib-grid"
      >
        {items.map((p) => (
          <Link
            key={p.slug}
            href={`${base}/book-hotel/${p.slug}`}
            className="t3-sib-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              color: 'inherit',
              textDecoration: 'none',
              background: '#fff',
              border: '1px solid var(--t3-divider)',
              transition: 'border-color 0.3s var(--t3-ease)',
            }}
          >
            {p.image_url && (
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '16 / 10',
                  overflow: 'hidden',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image_url}
                  alt={p.name}
                  className="t3-sib-img"
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.9s var(--t3-ease-out)',
                  }}
                />
              </div>
            )}
            <div style={{ padding: '24px 24px 22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              {p.logo_url && (
                <div style={{ height: 36, marginBottom: 14, display: 'flex', alignItems: 'center' }}>
                  <Image
                    src={p.logo_url}
                    alt={p.name}
                    width={150}
                    height={36}
                    style={{ objectFit: 'contain', maxHeight: 36, width: 'auto' }}
                    unoptimized
                  />
                </div>
              )}
              <h3
                className="t3-headline-md"
                style={{ marginBottom: 8, fontSize: 'clamp(16px, 1.4vw, 18px)' }}
              >
                {p.name}
              </h3>
              <div
                style={{
                  marginTop: 'auto',
                  paddingTop: 14,
                  borderTop: '1px solid var(--t3-divider)',
                  fontSize: 'clamp(10px, 0.85vw, 11px)',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--t3-accent)',
                  fontWeight: 500,
                }}
              >
                View Program →
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        .t3-sib-card:hover { border-color: var(--t3-accent) !important; }
        .t3-sib-card:hover .t3-sib-img { transform: scale(1.04); }
        @media (max-width: 1024px) {
          .t3-sib-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .t3-sib-header { grid-template-columns: 1fr !important; gap: var(--t3-gap-tight) !important; align-items: start !important; }
        }
        @media (max-width: 768px) {
          .t3-sib-grid { grid-template-columns: 1fr !important; gap: var(--t3-gap-tight) !important; }
        }
      `}</style>
    </section>
  )
}
