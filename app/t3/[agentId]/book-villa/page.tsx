import Link from 'next/link'
import { getPropertiesDestinations } from '@/lib/collections'
import { T3PageHero } from '@/components/t3/T3PageHero'

interface PageProps {
  params: Promise<{ agentId: string }>
}

export const metadata = {
  title: 'Private Villas & Residences | Meridian & Company',
  description: 'Private-island residences, countryside estates, and oceanfront villas — staffed, stocked, and shaped around you.',
}

const VILLA_TYPES = [
  { label: 'Private Islands', count: '14' },
  { label: 'Coastal Estates', count: '38' },
  { label: 'Countryside Retreats', count: '26' },
  { label: 'Ski Chalets', count: '19' },
  { label: 'Urban Residences', count: '22' },
  { label: 'Game Reserves', count: '11' },
]

export default async function T3BookVillaPage({ params }: PageProps) {
  const { agentId } = await params
  const properties = await getPropertiesDestinations()
  const base = `/t3/${agentId}`

  return (
    <>
      <T3PageHero
        image="/media/hero images/four-seasons-taormina-suite-hero.jpg"
        imageAlt="Private Villas & Residences"
        eyebrow="Villas"
        title="Yours, entirely."
        body="Private homes with full staff — from a Caribbean beachfront estate to a Tuscan farmhouse to a sand-floored private island. Every villa on our list has been personally inspected by a member of our team."
        imageCaption="Private Villa · Taormina, Sicily"
      />

      {/* Intro */}
      <section className="t3-section">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.4fr',
            gap: 96,
            alignItems: 'start',
            paddingTop: 24,
          }}
          className="t3-villa-intro"
        >
          <div>
            <span className="t3-eyebrow">The Collection</span>
            <h2 className="t3-headline-xl" style={{ marginTop: 32 }}>
              Private homes we know personally.
            </h2>
          </div>
          <div>
            <p className="t3-body t3-body-lg" style={{ marginBottom: 36 }}>
              We do not list villas from aggregator sites. Every property on our roster has been walked through, stayed in, or personally inspected by a member of our team — and every booking comes with our direct involvement on the ground, from pre-arrival provisioning to hand-over at departure.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 24,
                borderTop: '1px solid var(--t3-divider)',
                paddingTop: 32,
              }}
              className="t3-villa-types"
            >
              {VILLA_TYPES.map((v) => (
                <div
                  key={v.label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    padding: '14px 0',
                    borderBottom: '1px solid var(--t3-divider)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--t3-font-display)',
                      fontSize: 17,
                      color: 'var(--t3-text)',
                    }}
                  >
                    {v.label}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      letterSpacing: '0.16em',
                      color: 'var(--t3-accent)',
                    }}
                  >
                    {v.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Villa showcase — alternating editorial rows */}
      <section className="t3-section-alt t3-section">
        <div style={{ maxWidth: 720, marginBottom: 80 }}>
          <span className="t3-eyebrow">Featured Retreats</span>
          <h2 className="t3-headline-xl" style={{ marginTop: 28 }}>
            A small sample of what we keep on hand.
          </h2>
          <p className="t3-body t3-body-lg" style={{ marginTop: 24 }}>
            A handful of favourites from our personal list. The full collection is shared with clients directly — always tailored to dates, party size, and style of travel.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 48,
            rowGap: 72,
          }}
          className="t3-villa-grid"
        >
          {properties.slice(0, 6).map((p, i) => (
            <article
              key={p.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
              className="t3-villa-card"
            >
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '4 / 3',
                  overflow: 'hidden',
                  marginBottom: 24,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image_gallery?.[0] || '/media/hero images/four-seasons-sayan-hero.jpg'}
                  alt={p.name}
                  className="t3-villa-img"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.9s var(--t3-ease-out)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    fontSize: 10,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: '#fff',
                    opacity: 0.82,
                    fontWeight: 500,
                  }}
                >
                  {String(i + 1).padStart(2, '0')} / Retreat
                </div>
              </div>

              <div
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--t3-text-muted)',
                  marginBottom: 10,
                }}
              >
                {p.location}
              </div>
              <h3 className="t3-headline-md" style={{ marginBottom: 12 }}>
                {p.name}
              </h3>
              {p.description && (
                <p className="t3-body" style={{ fontSize: 14 }}>
                  {p.description}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="t3-section" style={{ textAlign: 'center' }}>
        <span className="t3-eyebrow" style={{ justifyContent: 'center' }}>
          Begin
        </span>
        <h2
          className="t3-headline-xl"
          style={{ marginTop: 28, maxWidth: 720, marginLeft: 'auto', marginRight: 'auto' }}
        >
          Looking for something specific?
        </h2>
        <p
          className="t3-body t3-body-lg"
          style={{ marginTop: 24, marginLeft: 'auto', marginRight: 'auto', marginBottom: 48 }}
        >
          Tell us your destination, party size, and the kind of place you&apos;re picturing. We&apos;ll come back with a short, considered list — sometimes including homes that have never been publicly listed.
        </p>
        <Link href={`${base}/contact`} className="t3-btn t3-btn-solid">
          Enquire About Villas
        </Link>
      </section>

      <style>{`
        .t3-villa-card:hover .t3-villa-img { transform: scale(1.04); }
        @media (max-width: 900px) {
          .t3-villa-intro { grid-template-columns: 1fr !important; gap: 40px !important; }
          .t3-villa-types { grid-template-columns: 1fr !important; }
          .t3-villa-grid { grid-template-columns: 1fr !important; gap: 56px !important; }
        }
      `}</style>
    </>
  )
}
