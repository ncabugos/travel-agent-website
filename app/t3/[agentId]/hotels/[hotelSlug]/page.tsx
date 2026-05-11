import { getHotel, getHotels, type LuxuryHotel } from '@/lib/hotels'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ agentId: string; hotelSlug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { hotelSlug } = await params
  const hotel = await getHotel(hotelSlug)
  if (!hotel) return { title: 'Hotel not found' }
  return {
    title: `${hotel.name} | Meridian Travel`,
    description: hotel.description ??
      `${hotel.name} in ${[hotel.city, hotel.country].filter(Boolean).join(', ')} — book through Meridian Travel with partner-program benefits.`,
  }
}

/**
 * Individual hotel detail page — Meridian (T3) template.
 *
 * Editorial layout: full-bleed hero, 2-col body with description left + sticky
 * sidebar right, plus a "More from this brand" rail when applicable. The
 * Enquire affordance routes to /contact?hotel=<name> rather than opening a
 * modal — keeps users on-site (per user direction) and gives the contact
 * form context.
 */
export default async function T3HotelDetailPage({ params }: PageProps) {
  const { agentId, hotelSlug } = await params
  const hotel = await getHotel(hotelSlug)
  if (!hotel) notFound()

  // Related: same brand, capped 3
  let related: LuxuryHotel[] = []
  if (hotel.hotel_company) {
    const result = await getHotels({ brand: hotel.hotel_company, pageSize: 4 })
    related = result.hotels.filter(h => h.slug !== hotel.slug).slice(0, 3)
  }

  const base = `/t3/${agentId}`
  const location = [hotel.city, hotel.state_region, hotel.country].filter(Boolean).join(', ')

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          height: 'clamp(540px, 70vh, 760px)',
          overflow: 'hidden',
          background: 'var(--t3-dark-bg)',
        }}
      >
        {hotel.cover_image_url && (
          <Image
            src={hotel.cover_image_url}
            alt={hotel.name}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            unoptimized
          />
        )}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(20,17,15,0.18) 0%, rgba(20,17,15,0.72) 100%)',
        }} />

        {/* Back link */}
        <div style={{
          position: 'absolute', top: 'clamp(96px, 14vw, 140px)', left: 0, right: 0,
          padding: '0 max(24px, calc((100vw - var(--t3-content-max)) / 2))',
          zIndex: 2,
        }}>
          <Link
            href={`${base}/book-hotel#hotel-directory`}
            style={{
              fontFamily: 'var(--t3-font-sans)',
              fontSize: 11,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.82)',
              textDecoration: 'none',
            }}
          >
            ← Hotels
          </Link>
        </div>

        {/* Headline */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          display: 'flex', alignItems: 'flex-end',
          padding: '0 max(24px, calc((100vw - var(--t3-content-max)) / 2)) 64px',
        }}>
          <div style={{ width: '100%', color: '#fff' }}>
            {hotel.vibe && (
              <span
                className="t3-eyebrow t3-eyebrow-plain"
                style={{ color: 'rgba(255,255,255,0.78)', marginBottom: 24, display: 'inline-block' }}
              >
                {hotel.vibe}
              </span>
            )}
            <h1
              className="t3-headline-xl"
              style={{ color: '#fff', maxWidth: 920, marginBottom: 14 }}
            >
              {hotel.name}
            </h1>
            <p style={{
              fontFamily: 'var(--t3-font-display)',
              fontStyle: 'italic',
              fontSize: 'clamp(15px, 1.6vw, 18px)',
              color: 'rgba(247, 245, 240, 0.88)',
              margin: 0,
            }}>
              {location}
              {hotel.hotel_company && (
                <span style={{ marginLeft: 16, fontStyle: 'normal', fontFamily: 'var(--t3-font-sans)', fontSize: 'clamp(11px, 1vw, 12px)', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>
                  · {hotel.hotel_company}
                </span>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <section className="t3-section">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr',
            gap: 'var(--t3-gap-loose)',
            alignItems: 'start',
          }}
          className="t3-hotel-body"
        >
          {/* Description */}
          <div>
            <span className="t3-eyebrow t3-eyebrow-plain">About the property</span>
            <h2 className="t3-headline-lg" style={{ marginTop: 24, marginBottom: 28 }}>
              Why book {hotel.name} through us.
            </h2>
            {hotel.description ? (
              <p className="t3-body t3-body-lg" style={{ marginBottom: 32 }}>
                {hotel.description}
              </p>
            ) : (
              <p className="t3-body t3-body-lg" style={{ marginBottom: 32, fontStyle: 'italic', color: 'var(--t3-text-muted)' }}>
                A deeper property profile is on the way. In the meantime, our
                advisors can speak to rates, suite availability, and the
                partner-program benefits that apply at this property.
              </p>
            )}

            {/* Quick facts grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '28px 40px',
                paddingTop: 'var(--t3-gap)',
                borderTop: '1px solid var(--t3-divider)',
              }}
              className="t3-hotel-facts"
            >
              {hotel.hotel_type && (
                <Fact label="Property type" value={hotel.hotel_type} />
              )}
              {hotel.room_count != null && (
                <Fact label="Rooms" value={`${hotel.room_count}`} />
              )}
              {hotel.room_style && (
                <Fact label="Style" value={hotel.room_style} />
              )}
              {hotel.neighborhood && (
                <Fact label="Neighbourhood" value={hotel.neighborhood} />
              )}
              {hotel.experiences && hotel.experiences.length > 0 && (
                <Fact label="Best for" value={hotel.experiences.slice(0, 3).join(' · ')} />
              )}
            </div>
          </div>

          {/* Sticky enquire sidebar */}
          <aside
            style={{
              background: 'var(--t3-bg-alt)',
              padding: 'var(--t3-gap)',
              position: 'sticky',
              top: 100,
              alignSelf: 'start',
            }}
            className="t3-hotel-aside"
          >
            <span className="t3-eyebrow t3-eyebrow-plain">Bookable through us</span>
            <h3 className="t3-headline-md" style={{ marginTop: 18, marginBottom: 16 }}>
              Plan a stay here.
            </h3>
            <p className="t3-body" style={{ marginBottom: 24, fontSize: 'clamp(13.5px, 1vw, 14.5px)' }}>
              Tell us when you&apos;d like to go. We&apos;ll respond within one
              business day with rates, availability, and the partner-program
              benefits that apply at {hotel.name}.
            </p>
            <Link
              href={`${base}/contact?hotel=${encodeURIComponent(hotel.name)}`}
              className="t3-btn t3-btn-solid"
              style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}
            >
              Enquire About This Stay
            </Link>
            <Link
              href={`${base}/book-hotel#hotel-directory`}
              style={{
                display: 'block',
                textAlign: 'center',
                marginTop: 18,
                fontFamily: 'var(--t3-font-sans)',
                fontSize: 11,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--t3-text-muted)',
                textDecoration: 'none',
              }}
            >
              ← Back to all hotels
            </Link>
          </aside>
        </div>
      </section>

      {/* ── Related — same brand ─────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="t3-section t3-section-alt">
          <div style={{ textAlign: 'center', marginBottom: 'var(--t3-gap)' }}>
            <span className="t3-eyebrow t3-eyebrow-plain" style={{ justifyContent: 'center' }}>
              More from this brand
            </span>
            <h2 className="t3-headline-lg" style={{ marginTop: 24 }}>
              Other {hotel.hotel_company} properties.
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 'var(--t3-gap)',
            }}
            className="t3-hotel-related-grid"
          >
            {related.map(h => (
              <Link
                key={h.slug}
                href={`${base}/hotels/${h.slug}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  color: 'inherit',
                  textDecoration: 'none',
                  transition: 'transform 0.4s var(--t3-ease)',
                }}
                className="t3-hotel-related-card"
              >
                <div
                  style={{
                    position: 'relative',
                    aspectRatio: '4 / 3',
                    overflow: 'hidden',
                    background: 'var(--t3-bg)',
                    marginBottom: 18,
                  }}
                >
                  {h.cover_image_url && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={h.cover_image_url}
                      alt={h.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                  )}
                </div>
                <h3 className="t3-headline-md" style={{ marginBottom: 6, fontSize: 'clamp(17px, 1.5vw, 20px)' }}>
                  {h.name}
                </h3>
                <p style={{
                  fontFamily: 'var(--t3-font-display)',
                  fontStyle: 'italic',
                  fontSize: 'clamp(13px, 1.05vw, 14.5px)',
                  color: 'var(--t3-text-muted)',
                  margin: 0,
                }}>
                  {[h.city, h.country].filter(Boolean).join(' · ')}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <style>{`
        .t3-hotel-related-card:hover { transform: translateY(-4px); }
        @media (max-width: 1024px) {
          .t3-hotel-body { gap: var(--t3-gap) !important; }
          .t3-hotel-related-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .t3-hotel-body { grid-template-columns: 1fr !important; gap: var(--t3-gap-tight) !important; }
          .t3-hotel-aside { position: static !important; }
          .t3-hotel-facts { grid-template-columns: 1fr !important; gap: var(--t3-gap-tight) !important; }
          .t3-hotel-related-grid { grid-template-columns: 1fr !important; gap: var(--t3-gap-tight) !important; }
        }
      `}</style>
    </>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p
        style={{
          fontFamily: 'var(--t3-font-sans)',
          fontSize: 'clamp(10px, 0.85vw, 11px)',
          fontWeight: 500,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--t3-accent)',
          marginBottom: 8,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: 'var(--t3-font-display)',
          fontSize: 'clamp(16px, 1.3vw, 18px)',
          color: 'var(--t3-text)',
          margin: 0,
          lineHeight: 1.4,
        }}
      >
        {value}
      </p>
    </div>
  )
}
