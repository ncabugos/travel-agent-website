import Link from 'next/link'
import Image from 'next/image'
import { getAgentHotelPrograms } from '@/lib/hotel-programs'
import { T4PageHero } from '@/components/t4/T4PageHero'

interface PageProps {
  params: Promise<{ agentId: string }>
}

export const metadata = {
  title: 'Hotels | Casa Solis',
  description: 'The hotel programs Casa Solis books, and the privileges arranged on every stay.',
}

export default async function T4BookHotelIndexPage({ params }: PageProps) {
  const { agentId } = await params
  const programs = await getAgentHotelPrograms(agentId)
  const base = `/t4/${agentId}`

  return (
    <>
      <T4PageHero
        image="/media/hotel-programs/belmond-bellini-club/belmond-hero-2000.jpg"
        imageAlt="Hotel programs"
        eyebrow="Hotels"
        title="A quieter list."
        body="We do not work with every hotel. These are the programs we know — by general manager, by concierge, by turn-down attendant — and the ones we return to."
        imageCaption="Belmond · Venice"
      />

      {/* Intro band */}
      <section className="t4-section">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.3fr',
            gap: 80,
          }}
          className="t4-hotel-intro"
        >
          <div>
            <span className="t4-eyebrow">Every Stay, Arranged</span>
            <h2 className="t4-headline-xl" style={{ marginTop: 28 }}>
              What we arrange, quietly, on every booking.
            </h2>
          </div>
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 32,
              }}
              className="t4-hotel-perks"
            >
              {[
                { label: 'Room upgrade', detail: 'On arrival, when available' },
                { label: 'Daily breakfast', detail: 'For two, every morning' },
                { label: 'Property credit', detail: '$100 or more per stay' },
                { label: 'Welcome amenity', detail: 'Chosen by hand' },
                { label: 'Early & late check-in', detail: 'When the hotel allows' },
                { label: 'VIP recognition', detail: 'Noted on every reservation' },
              ].map((p) => (
                <div key={p.label}>
                  <div
                    style={{
                      fontFamily: 'var(--t4-font-body)',
                      fontSize: 10,
                      fontWeight: 500,
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: 'var(--t4-accent)',
                      marginBottom: 8,
                    }}
                  >
                    {p.label}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--t4-font-display)',
                      fontSize: 16,
                      color: 'var(--t4-text)',
                    }}
                  >
                    {p.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Programs grid */}
      <section
        style={{
          padding: 'var(--t4-section-pad) 48px',
          background: 'var(--t4-bg-alt)',
        }}
      >
        <div style={{ maxWidth: 'var(--t4-content-wide)', margin: '0 auto' }}>
          <div style={{ marginBottom: 56 }}>
            <span className="t4-eyebrow">The Collection</span>
            <h2 className="t4-headline-xl" style={{ marginTop: 28 }}>
              Exclusive Hotel Programs
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 24,
              rowGap: 48,
            }}
            className="t4-programs-index-grid"
          >
            {programs.map((program) => (
              <Link
                key={program.slug}
                href={`${base}/book-hotel/${program.slug}`}
                className="t4-program-card"
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                {program.image_url && (
                  <div
                    style={{
                      position: 'relative',
                      aspectRatio: '1 / 1',
                      overflow: 'hidden',
                      background: 'var(--t4-bg)',
                      marginBottom: 24,
                    }}
                  >
                    <Image
                      src={program.image_url}
                      alt={program.name}
                      fill
                      sizes="(max-width: 900px) 100vw, 33vw"
                      className="t4-program-card-img"
                      style={{
                        objectFit: 'cover',
                        transition: 'transform 1.1s var(--t4-ease-out)',
                      }}
                      unoptimized
                    />
                    {/* Overlay for logo legibility */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0,0,0,0.35)',
                        pointerEvents: 'none',
                      }}
                    />
                    {/* White logo centered */}
                    {program.logo_url_white && (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 2,
                          padding: 20,
                        }}
                      >
                        <Image
                          src={program.logo_url_white}
                          alt={`${program.name} logo`}
                          width={700}
                          height={200}
                          className="t4-program-logo"
                          style={{ objectFit: 'contain' }}
                          unoptimized
                        />
                      </div>
                    )}
                  </div>
                )}
                <h3 className="t4-headline-md" style={{ marginBottom: 10, fontSize: 'clamp(18px, 1.5vw, 22px)' }}>
                  {program.name}
                </h3>
                {program.tagline && (
                  <p
                    style={{
                      fontFamily: 'var(--t4-font-display)',
                      fontStyle: 'italic',
                      fontSize: 15,
                      color: 'var(--t4-text-muted)',
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    {program.tagline}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .t4-program-card:hover .t4-program-card-img { transform: scale(1.04); }
        .t4-program-logo {
          width: 360px !important;
          height: auto !important;
          max-width: 100%;
          max-height: 108px;
        }
        @media (max-width: 1200px) {
          .t4-program-logo { width: 300px !important; max-height: 92px; }
        }
        @media (max-width: 900px) {
          .t4-program-logo { width: 320px !important; max-height: 96px; }
        }
        @media (max-width: 600px) {
          .t4-program-logo { width: 280px !important; max-height: 84px; }
        }
        @media (max-width: 900px) {
          .t4-hotel-intro { grid-template-columns: 1fr !important; gap: 32px !important; }
          .t4-hotel-perks { grid-template-columns: 1fr !important; }
          .t4-programs-index-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .t4-programs-index-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
