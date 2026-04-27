import Link from 'next/link'
import Image from 'next/image'
import { getCruiseLines } from '@/lib/cruise-lines'
import { T3PageHero } from '@/components/t3/T3PageHero'

interface PageProps {
  params: Promise<{ agentId: string }>
}

export const metadata = {
  title: 'Cruise Partners | Meridian & Company',
  description:
    'Our preferred cruise partners — advisor-only benefits on every voyage with the world\'s finest ocean, river, and expedition lines.',
}

export default async function T3FindCruisePage({ params }: PageProps) {
  const { agentId } = await params
  const lines = await getCruiseLines()
  const base = `/t3/${agentId}`

  return (
    <>
      <T3PageHero
        image="/media/cruises/regent-seven-seas/Regent-hero-Tahiti-2500.jpg"
        imageAlt="Luxury Voyages"
        eyebrow="Cruise Partners"
        title="Ocean, river, and expedition."
        body="The cruise lines we trust, the ones we have sailed personally, and the only way to see their ports with the access that comes from two decades of advisor relationships."
        imageCaption="Regent Seven Seas · Tahiti"
      />

      {/* Intro */}
      <section className="t3-section">
        <div
          style={{
            maxWidth: 900,
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <span className="t3-eyebrow" style={{ justifyContent: 'center' }}>
            Why Sail With Us
          </span>
          <h2 className="t3-headline-xl" style={{ marginTop: 28, marginBottom: 32 }}>
            Every voyage, with advisor benefits.
          </h2>
          <p className="t3-body t3-body-lg" style={{ marginLeft: 'auto', marginRight: 'auto', marginBottom: 56 }}>
            We are preferred partners with every major ultra-luxury and expedition line.
            That translates, on every booking we place, into onboard credit, included
            shore excursions, or category upgrades — frequently all three.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 48,
              borderTop: '1px solid var(--t3-divider)',
              paddingTop: 48,
            }}
            className="t3-cruise-stats"
          >
            {[
              { num: '14+', label: 'Preferred Partners' },
              { num: '$1,500+', label: 'Typical Onboard Credit' },
              { num: '100%', label: 'Personal Knowledge' },
            ].map((s) => (
              <div key={s.label}>
                <div
                  className="t3-headline-lg"
                  style={{
                    color: 'var(--t3-accent)',
                    fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
                    marginBottom: 8,
                  }}
                >
                  {s.num}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--t3-text-muted)',
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners grid */}
      <div className="t3-section-alt">
        <section className="t3-section">
          <div style={{ maxWidth: 720, marginBottom: 72 }}>
            <span className="t3-eyebrow">The Lines We Know</span>
            <h2 className="t3-headline-xl" style={{ marginTop: 28 }}>
              Preferred Cruise Partners.
            </h2>
            <p className="t3-body t3-body-lg" style={{ marginTop: 24 }}>
              Every line below is one we have sailed personally and book through our
              Virtuoso membership, which unlocks the advisor benefits that don&apos;t appear on any fare.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 32,
              rowGap: 48,
            }}
            className="t3-cruise-grid"
          >
            {lines.map((line) => (
              <Link
                key={line.slug}
                href={`${base}/find-cruise/${line.slug}`}
                className="t3-cruise-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: '#fff',
                  textDecoration: 'none',
                  color: 'inherit',
                  border: '1px solid var(--t3-divider)',
                  overflow: 'hidden',
                  transition: 'border-color 0.3s var(--t3-ease)',
                }}
              >
                {line.hero_image_url && (
                  <div
                    style={{
                      position: 'relative',
                      aspectRatio: '16 / 10',
                      overflow: 'hidden',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={line.hero_image_url}
                      alt={line.name}
                      className="t3-cruise-card-img"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.9s var(--t3-ease-out)',
                      }}
                    />
                  </div>
                )}
                <div style={{ padding: '28px 28px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {line.logo_url && (
                    <div style={{ height: 36, marginBottom: 16, display: 'flex', alignItems: 'center' }}>
                      <Image
                        src={line.logo_url}
                        alt={line.name}
                        width={150}
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
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: 'var(--t3-accent)',
                      marginBottom: 8,
                    }}
                  >
                    {(line.cruise_types || []).join(' · ') || 'Luxury Cruise'}
                  </div>
                  <h3 className="t3-headline-md" style={{ marginBottom: 10, fontSize: 'clamp(17px, 1.5vw, 20px)' }}>
                    {line.name}
                  </h3>
                  {line.tagline && (
                    <p
                      style={{
                        fontFamily: 'var(--t3-font-display)',
                        fontStyle: 'italic',
                        fontSize: 14,
                        color: 'var(--t3-text-muted)',
                        lineHeight: 1.5,
                        margin: 0,
                        marginBottom: 18,
                      }}
                    >
                      {line.tagline}
                    </p>
                  )}
                  <div
                    style={{
                      marginTop: 'auto',
                      paddingTop: 16,
                      borderTop: '1px solid var(--t3-divider)',
                      fontSize: 11,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: 'var(--t3-accent)',
                      fontWeight: 500,
                    }}
                  >
                    View Line →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* CTA */}
      <section className="t3-section" style={{ textAlign: 'center' }}>
        <span className="t3-eyebrow" style={{ justifyContent: 'center' }}>
          Begin
        </span>
        <h2 className="t3-headline-xl" style={{ marginTop: 28, maxWidth: 720, marginLeft: 'auto', marginRight: 'auto' }}>
          Planning a voyage?
        </h2>
        <p
          className="t3-body t3-body-lg"
          style={{ marginTop: 24, marginLeft: 'auto', marginRight: 'auto', marginBottom: 48 }}
        >
          Tell us which region you&apos;re thinking about — we&apos;ll come back
          with the right ship, the right itinerary, and every advisor-only benefit
          already attached to the quote.
        </p>
        <Link href={`${base}/contact`} className="t3-btn t3-btn-solid">
          Enquire About a Voyage
        </Link>
      </section>

      <style>{`
        .t3-cruise-card:hover { border-color: var(--t3-accent) !important; }
        .t3-cruise-card:hover .t3-cruise-card-img { transform: scale(1.04); }
        @media (max-width: 1000px) {
          .t3-cruise-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 640px) {
          .t3-cruise-grid { grid-template-columns: 1fr !important; }
          .t3-cruise-stats { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </>
  )
}
