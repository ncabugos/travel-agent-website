import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCruiseLine, getAllCruiseLineSlugs } from '@/lib/cruise-lines'

interface PageProps {
  params: Promise<{ agentId: string; cruiseSlug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllCruiseLineSlugs()
  return slugs.map((cruiseSlug) => ({ cruiseSlug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { cruiseSlug } = await params
  const line = await getCruiseLine(cruiseSlug)
  if (!line) return { title: 'Not found' }
  return { title: `${line.name} | Casa Solis`, description: line.tagline ?? undefined }
}

export default async function T4CruiseLineDetailPage({ params }: PageProps) {
  const { agentId, cruiseSlug } = await params
  const line = await getCruiseLine(cruiseSlug)
  if (!line) notFound()

  const base = `/t4/${agentId}`

  return (
    <>
      {/* Hero */}
      <section
        style={{
          position: 'relative',
          minHeight: 'clamp(560px, 78vh, 780px)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          color: '#fff',
          paddingBottom: 'clamp(80px, 10vh, 120px)',
        }}
      >
        {line.hero_image_url && (
          <Image
            src={line.hero_image_url}
            alt=""
            aria-hidden
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover' }}
            unoptimized
          />
        )}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(20,17,15,0.35) 0%, rgba(20,17,15,0.78) 100%)',
          }}
        />
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            maxWidth: 'var(--t4-content-wide)',
            margin: '0 auto',
            padding: '0 48px',
            width: '100%',
          }}
        >
          <span
            className="t4-eyebrow"
            style={{ color: 'rgba(255,255,255,0.82)', marginBottom: 24 }}
          >
            {(line.cruise_types || []).join(' · ') || 'Luxury Cruise'}
          </span>

          {line.logo_url_white ? (
            <div style={{ marginBottom: 24, maxWidth: 320 }}>
              <Image
                src={line.logo_url_white}
                alt={line.name}
                width={320}
                height={96}
                style={{ objectFit: 'contain', maxHeight: 96, width: 'auto' }}
                unoptimized
              />
            </div>
          ) : (
            <h1 className="t4-headline-xl" style={{ color: '#fff', marginBottom: 24 }}>
              {line.name}
            </h1>
          )}

          {line.tagline && (
            <p
              style={{
                fontFamily: 'var(--t4-font-display)',
                fontStyle: 'italic',
                fontSize: 'clamp(20px, 2.2vw, 28px)',
                lineHeight: 1.35,
                color: 'rgba(251, 248, 241, 0.88)',
                margin: 0,
                maxWidth: 720,
              }}
            >
              {line.tagline}
            </p>
          )}
        </div>
      </section>

      {/* Overview */}
      <section className="t4-section">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.4fr',
            gap: 96,
          }}
          className="t4-cruise-overview"
        >
          <div>
            <span className="t4-eyebrow">About the Line</span>
            <h2 className="t4-headline-xl" style={{ marginTop: 28 }}>
              {line.name}
            </h2>
          </div>
          <div>
            {line.description && <p className="t4-body t4-body-lg">{line.description}</p>}
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .t4-cruise-overview { grid-template-columns: 1fr !important; gap: 32px !important; }
          }
        `}</style>
      </section>

      {/* Highlights */}
      {line.highlights && line.highlights.length > 0 && (
        <section
          style={{
            padding: 'var(--t4-section-pad) 48px',
            background: 'var(--t4-bg-alt)',
          }}
        >
          <div style={{ maxWidth: 'var(--t4-content-wide)', margin: '0 auto' }}>
            <div style={{ maxWidth: 720, marginBottom: 72 }}>
              <span className="t4-eyebrow">Why We Book This Line</span>
              <h2 className="t4-headline-xl" style={{ marginTop: 28 }}>
                Included on every voyage.
              </h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                columnGap: 80,
                rowGap: 56,
                borderTop: '1px solid var(--t4-divider)',
                paddingTop: 56,
              }}
              className="t4-highlights-grid"
            >
              {line.highlights.map((h, i) => (
                <div key={h.title}>
                  <div
                    style={{
                      fontFamily: 'var(--t4-font-display)',
                      fontSize: 44,
                      fontWeight: 300,
                      color: 'var(--t4-accent)',
                      marginBottom: 16,
                      letterSpacing: '-0.02em',
                      lineHeight: 1,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="t4-headline-md" style={{ marginBottom: 12 }}>
                    {h.title}
                  </h3>
                  <p className="t4-body" style={{ margin: 0 }}>
                    {h.description}
                  </p>
                </div>
              ))}
            </div>

            <style>{`
              @media (max-width: 700px) {
                .t4-highlights-grid { grid-template-columns: 1fr !important; row-gap: 40px !important; }
              }
            `}</style>
          </div>
        </section>
      )}

      {/* Fleet */}
      {line.ships && line.ships.length > 0 && (
        <section className="t4-section">
          <div style={{ maxWidth: 720, marginBottom: 56 }}>
            <span className="t4-eyebrow">The Fleet</span>
            <h2 className="t4-headline-xl" style={{ marginTop: 28 }}>
              Ships we know.
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 32,
              rowGap: 48,
            }}
            className="t4-fleet-grid"
          >
            {line.ships.map((ship) => (
              <div key={ship.name}>
                {ship.image && (
                  <div
                    style={{
                      position: 'relative',
                      aspectRatio: '4 / 3',
                      overflow: 'hidden',
                      background: 'var(--t4-bg-alt)',
                      marginBottom: 20,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ship.image}
                      alt={ship.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                  </div>
                )}
                <h3 className="t4-headline-md" style={{ marginBottom: 8 }}>
                  {ship.name}
                </h3>
                {ship.description && (
                  <p className="t4-body" style={{ margin: 0, fontSize: 13.5 }}>
                    {ship.description}
                  </p>
                )}
              </div>
            ))}
          </div>

          <style>{`
            @media (max-width: 900px) {
              .t4-fleet-grid { grid-template-columns: 1fr 1fr !important; }
            }
            @media (max-width: 560px) {
              .t4-fleet-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </section>
      )}

      {/* CTA */}
      <section
        style={{
          position: 'relative',
          padding: 'var(--t4-section-pad) 48px',
          textAlign: 'center',
          overflow: 'hidden',
          color: '#fff',
        }}
      >
        {line.hero_image_url && (
          <Image
            src={line.hero_image_url}
            alt=""
            aria-hidden
            fill
            style={{ objectFit: 'cover' }}
            unoptimized
          />
        )}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(20,17,15,0.82) 0%, rgba(20,17,15,0.72) 100%)',
          }}
        />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto' }}>
          <span
            className="t4-eyebrow t4-eyebrow-center"
            style={{ color: 'rgba(255,255,255,0.82)', justifyContent: 'center' }}
          >
            Plan a Voyage
          </span>
          <h2 className="t4-headline-xl" style={{ color: '#fff', marginTop: 28, marginBottom: 24 }}>
            Sail with us.
          </h2>
          <p
            style={{
              color: 'rgba(251, 248, 241, 0.78)',
              fontFamily: 'var(--t4-font-body)',
              fontSize: 17,
              lineHeight: 1.78,
              marginBottom: 40,
              fontWeight: 300,
            }}
          >
            Tell us a region, a season, or a ship — we will return with the
            right itinerary and every benefit already attached.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={`${base}/contact`} className="t4-btn t4-btn-solid-light">
              Enquire About a Voyage
            </Link>
            <Link href={`${base}/find-cruise`} className="t4-btn t4-btn-ghost-light">
              All Cruise Partners
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
