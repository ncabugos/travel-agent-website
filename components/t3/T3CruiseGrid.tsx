import Link from 'next/link'
import type { CruiseLine } from '@/lib/cruise-lines'

interface T3CruiseGridProps {
  agentId: string
  cruiseLines: CruiseLine[]
}

const FALLBACK_IMAGE = '/media/cruises/regent-seven-seas/Regent-hero-Tahiti-2500.jpg'

export function T3CruiseGrid({ agentId, cruiseLines }: T3CruiseGridProps) {
  const base = `/t3/${agentId}`

  if (!cruiseLines.length) {
    return (
      <section className="t3-section">
        <p className="t3-body">No cruise lines available at this time.</p>
      </section>
    )
  }

  return (
    <section className="t3-section">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 96,
        }}
      >
        {cruiseLines.map((line, i) => (
          <CruiseRow
            key={line.id}
            line={line}
            index={i + 1}
            contactHref={`${base}/contact`}
            reverse={i % 2 === 1}
          />
        ))}
      </div>
    </section>
  )
}

function CruiseRow({
  line,
  index,
  contactHref,
  reverse,
}: {
  line: CruiseLine
  index: number
  contactHref: string
  reverse?: boolean
}) {
  const image = line.hero_image_url || line.slider_images?.[0] || FALLBACK_IMAGE

  return (
    <article
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 64,
        alignItems: 'center',
      }}
      className="t3-cruise-row"
    >
      {/* Image */}
      <div
        style={{
          position: 'relative',
          aspectRatio: '4 / 3',
          overflow: 'hidden',
          order: reverse ? 2 : 1,
        }}
        className={reverse ? 't3-cruise-image-reverse' : 't3-cruise-image'}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={line.name}
          className="t3-cruise-img"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 1s var(--t3-ease-out)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 24,
            left: 24,
            fontSize: 10,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: '#fff',
            opacity: 0.82,
            fontWeight: 500,
          }}
        >
          {String(index).padStart(2, '0')} / Voyage
        </div>
      </div>

      {/* Copy */}
      <div style={{ order: reverse ? 1 : 2, paddingLeft: reverse ? 0 : 8, paddingRight: reverse ? 8 : 0 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--t3-accent)',
            marginBottom: 16,
          }}
        >
          {(line.cruise_types || []).join(' · ') || 'Luxury Cruise'}
        </div>

        <h3 className="t3-headline-lg" style={{ marginBottom: 16 }}>
          {line.name}
        </h3>

        {line.tagline && (
          <p
            style={{
              fontFamily: 'var(--t3-font-display)',
              fontStyle: 'italic',
              fontSize: 17,
              color: 'var(--t3-accent)',
              lineHeight: 1.5,
              marginBottom: 20,
            }}
          >
            {line.tagline}
          </p>
        )}

        {line.description && (
          <p className="t3-body" style={{ marginBottom: 28 }}>
            {line.description}
          </p>
        )}

        {line.highlights && line.highlights.length > 0 && (
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: '0 0 32px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              borderTop: '1px solid var(--t3-divider)',
              paddingTop: 24,
            }}
          >
            {line.highlights.slice(0, 3).map((h, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  fontSize: 13.5,
                  color: 'var(--t3-text-muted)',
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: 'var(--t3-text)',
                  }}
                >
                  {h.title}
                </span>
                <span style={{ lineHeight: 1.6 }}>{h.description}</span>
              </li>
            ))}
          </ul>
        )}

        <Link href={contactHref} className="t3-link-arrow">
          Enquire about this voyage
          <span className="arrow">→</span>
        </Link>
      </div>

      <style>{`
        .t3-cruise-row:hover .t3-cruise-img { transform: scale(1.03); }
        @media (max-width: 900px) {
          .t3-cruise-row {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .t3-cruise-row > div { order: initial !important; padding: 0 !important; }
        }
      `}</style>
    </article>
  )
}
