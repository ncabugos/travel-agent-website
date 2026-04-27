import Link from 'next/link'
import Image from 'next/image'
import { getCruiseLines } from '@/lib/cruise-lines'
import { T4PageHero } from '@/components/t4/T4PageHero'

interface PageProps {
  params: Promise<{ agentId: string }>
}

export const metadata = {
  title: 'Voyages | Casa Solis',
  description:
    "The cruise lines we book — and what we arrange on every sailing.",
}

export default async function T4FindCruiseIndexPage({ params }: PageProps) {
  const { agentId } = await params
  const lines = await getCruiseLines()
  const base = `/t4/${agentId}`

  return (
    <>
      <T4PageHero
        image="/media/cruises/regent-seven-seas/Regent-hero-Tahiti-2500.jpg"
        imageAlt="Voyages"
        eyebrow="Voyages"
        title="Ocean, river, and expedition."
        body="The cruise lines we have sailed personally, and the ones we book for reasons every client will eventually understand."
        imageCaption="Regent Seven Seas · Tahiti"
      />

      <section
        style={{
          padding: 'var(--t4-section-pad) 48px',
          background: 'var(--t4-bg-alt)',
        }}
      >
        <div style={{ maxWidth: 'var(--t4-content-wide)', margin: '0 auto' }}>
          <div style={{ marginBottom: 56 }}>
            <span className="t4-eyebrow">The Lines</span>
            <h2 className="t4-headline-xl" style={{ marginTop: 28 }}>
              All {lines.length} partner lines.
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 24,
              rowGap: 48,
            }}
            className="t4-cruise-index-grid"
          >
            {lines.map((line) => (
              <Link
                key={line.slug}
                href={`${base}/find-cruise/${line.slug}`}
                className="t4-cruise-card"
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                {line.hero_image_url && (
                  <div
                    style={{
                      position: 'relative',
                      aspectRatio: '4 / 5',
                      overflow: 'hidden',
                      background: 'var(--t4-bg)',
                      marginBottom: 24,
                    }}
                  >
                    <Image
                      src={line.hero_image_url}
                      alt={line.name}
                      fill
                      sizes="(max-width: 900px) 100vw, 33vw"
                      className="t4-cruise-card-img"
                      style={{
                        objectFit: 'cover',
                        transition: 'transform 1.1s var(--t4-ease-out)',
                      }}
                      unoptimized
                    />
                  </div>
                )}
                <div
                  style={{
                    fontFamily: 'var(--t4-font-body)',
                    fontSize: 10,
                    fontWeight: 500,
                    letterSpacing: '0.28em',
                    textTransform: 'uppercase',
                    color: 'var(--t4-accent)',
                    marginBottom: 8,
                  }}
                >
                  {(line.cruise_types || []).join(' · ') || 'Luxury Cruise'}
                </div>
                <h3 className="t4-headline-md" style={{ marginBottom: 10, fontSize: 'clamp(17px, 1.5vw, 20px)' }}>
                  {line.name}
                </h3>
                {line.tagline && (
                  <p
                    style={{
                      fontFamily: 'var(--t4-font-display)',
                      fontStyle: 'italic',
                      fontSize: 14,
                      color: 'var(--t4-text-muted)',
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    {line.tagline}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .t4-cruise-card:hover .t4-cruise-card-img { transform: scale(1.04); }
        @media (max-width: 900px) {
          .t4-cruise-index-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .t4-cruise-index-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
