import Link from 'next/link'
import Image from 'next/image'
import { getAgentHotelPrograms } from '@/lib/hotel-programs'
import { T3PageHero } from '@/components/t3/T3PageHero'

interface PageProps {
  params: Promise<{ agentId: string }>
}

export const metadata = {
  title: 'Hotel Programs | Meridian & Company',
  description:
    'Our preferred hotel programs — preferred-partner access with amenities arranged by your advisor on every stay.',
}

export default async function T3BookHotelPage({ params }: PageProps) {
  const { agentId } = await params
  const programs = await getAgentHotelPrograms(agentId)
  const base = `/t3/${agentId}`

  return (
    <>
      <T3PageHero
        image="/media/hero images/four-seasons-CapFerrat-pool-hero.jpg"
        imageAlt="Hotels & Resorts"
        eyebrow="Hotel Programs"
        title="A quieter list."
        body="We do not work with every hotel brand. The ones below are the ones where our relationships still matter — where we can pick up the phone, ask for a favour, and have it happen."
        imageCaption="Four Seasons Grand-Hôtel du Cap-Ferrat"
      />

      {/* Intro band */}
      <section className="t3-section">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.4fr',
            gap: 96,
            paddingTop: 24,
          }}
          className="t3-hotel-intro"
        >
          <div>
            <span className="t3-eyebrow">Our Approach</span>
            <h2 className="t3-headline-xl" style={{ marginTop: 32 }}>
              What we arrange, on every stay.
            </h2>
          </div>
          <div>
            <p className="t3-body t3-body-lg" style={{ marginBottom: 32 }}>
              Booking through Meridian is not about a discount. It is about the quiet privileges that transform a good stay into a memorable one — the upgrade you didn&apos;t ask for, the hand-written note at turn-down, the sommelier who happens to stop by your table with an off-menu pairing.
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 24,
                borderTop: '1px solid var(--t3-divider)',
                paddingTop: 32,
              }}
              className="t3-hotel-perks"
            >
              {[
                { label: 'Room upgrade', detail: 'On arrival, when available' },
                { label: 'Breakfast', detail: 'Daily, for two' },
                { label: 'Property credit', detail: '$100 or more, per stay' },
                { label: 'Welcome amenity', detail: 'Often a hand-picked gesture' },
                { label: 'Check-in & check-out', detail: 'Early and late, when possible' },
                { label: 'VIP recognition', detail: 'Noted on every reservation' },
              ].map((p) => (
                <div key={p.label}>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 500,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: 'var(--t3-accent)',
                      marginBottom: 6,
                    }}
                  >
                    {p.label}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--t3-text-muted)', lineHeight: 1.5 }}>
                    {p.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Programs grid */}
      <div className="t3-section-alt">
        <section className="t3-section">
          <div style={{ maxWidth: 720, marginBottom: 72 }}>
            <span className="t3-eyebrow">The Collection</span>
            <h2 className="t3-headline-xl" style={{ marginTop: 28 }}>
              Our preferred hotel programs.
            </h2>
            <p className="t3-body t3-body-lg" style={{ marginTop: 24 }}>
              Each of the programs below is one we are on a first-name basis with.
              Every booking we place arrives with amenities — arranged by us, on your behalf.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 32,
              rowGap: 48,
            }}
            className="t3-programs-grid"
          >
            {programs.map((program) => (
              <Link
                key={program.slug}
                href={`${base}/book-hotel/${program.slug}`}
                className="t3-program-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: '#fff',
                  textDecoration: 'none',
                  color: 'inherit',
                  border: '1px solid var(--t3-divider)',
                  overflow: 'hidden',
                  transition: 'border-color 0.3s var(--t3-ease), transform 0.4s var(--t3-ease)',
                }}
              >
                {program.image_url && (
                  <div
                    style={{
                      position: 'relative',
                      aspectRatio: '16 / 10',
                      overflow: 'hidden',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={program.image_url}
                      alt={program.name}
                      className="t3-program-card-img"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.9s var(--t3-ease-out)',
                      }}
                    />
                  </div>
                )}
                <div style={{ padding: '32px 32px 28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {program.logo_url && (
                    <div style={{ height: 44, marginBottom: 18, display: 'flex', alignItems: 'center' }}>
                      <Image
                        src={program.logo_url}
                        alt={program.name}
                        width={180}
                        height={44}
                        style={{ objectFit: 'contain', maxHeight: 44, width: 'auto' }}
                        unoptimized
                      />
                    </div>
                  )}
                  <h3 className="t3-headline-md" style={{ marginBottom: 10, fontSize: 'clamp(18px, 1.6vw, 22px)' }}>
                    {program.name}
                  </h3>
                  {program.tagline && (
                    <p
                      style={{
                        fontFamily: 'var(--t3-font-display)',
                        fontStyle: 'italic',
                        fontSize: 15,
                        color: 'var(--t3-accent)',
                        lineHeight: 1.5,
                        marginBottom: 16,
                      }}
                    >
                      {program.tagline}
                    </p>
                  )}
                  <div
                    style={{
                      marginTop: 'auto',
                      paddingTop: 18,
                      borderTop: '1px solid var(--t3-divider)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: 11,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: 'var(--t3-text-muted)',
                      fontWeight: 500,
                    }}
                  >
                    <span>
                      {program.property_count
                        ? `${program.property_count}+ properties`
                        : 'Invitation only'}
                    </span>
                    <span style={{ color: 'var(--t3-accent)' }}>
                      View Program →
                    </span>
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
          Tell us where you&apos;d like to stay.
        </h2>
        <p
          className="t3-body t3-body-lg"
          style={{ marginTop: 24, marginLeft: 'auto', marginRight: 'auto', marginBottom: 48 }}
        >
          We will find the right property, negotiate the right rate, and arrange the quiet privileges that make a stay memorable.
        </p>
        <Link href={`${base}/contact`} className="t3-btn t3-btn-solid">
          Enquire Now
        </Link>
      </section>

      <style>{`
        .t3-program-card:hover { border-color: var(--t3-accent) !important; }
        .t3-program-card:hover .t3-program-card-img { transform: scale(1.04); }
        @media (max-width: 900px) {
          .t3-hotel-intro { grid-template-columns: 1fr !important; gap: 40px !important; }
          .t3-hotel-perks { grid-template-columns: 1fr !important; }
          .t3-programs-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
