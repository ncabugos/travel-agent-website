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
    title: `${hotel.name} | Casa Solis`,
    description: hotel.description ??
      `${hotel.name} in ${[hotel.city, hotel.country].filter(Boolean).join(', ')} — booked through Casa Solis with partner-program benefits.`,
  }
}

export default async function T4HotelDetailPage({ params }: PageProps) {
  const { agentId, hotelSlug } = await params
  const hotel = await getHotel(hotelSlug)
  if (!hotel) notFound()

  let related: LuxuryHotel[] = []
  if (hotel.hotel_company) {
    const result = await getHotels({ brand: hotel.hotel_company, pageSize: 4 })
    related = result.hotels.filter(h => h.slug !== hotel.slug).slice(0, 3)
  }

  const base = `/t4/${agentId}`
  const location = [hotel.city, hotel.state_region, hotel.country].filter(Boolean).join(', ')

  return (
    <>
      {/* Hero */}
      <section style={{ position: 'relative', height: 'clamp(540px, 70vh, 760px)', overflow: 'hidden', background: 'var(--t4-bg-alt)' }}>
        {hotel.cover_image_url && (
          <Image
            src={hotel.cover_image_url}
            alt={hotel.name}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover' }}
            unoptimized
          />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.66) 100%)' }} />

        <div style={{ position: 'absolute', top: 'clamp(96px, 14vw, 140px)', left: 0, right: 0, padding: '0 48px', zIndex: 2, maxWidth: 'var(--t4-content-max, 1440px)', margin: '0 auto' }}>
          <Link
            href={`${base}/book-hotel#hotel-directory`}
            style={{ fontFamily: 'var(--t4-font-body)', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.82)', textDecoration: 'none' }}
          >
            ← Hotels
          </Link>
        </div>

        <div style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', alignItems: 'flex-end', padding: '0 48px 64px' }}>
          <div style={{ maxWidth: 'var(--t4-content-max, 1440px)', margin: '0 auto', width: '100%', color: '#fff' }}>
            {hotel.vibe && (
              <span className="t4-eyebrow" style={{ color: 'rgba(255,255,255,0.78)', marginBottom: 18, display: 'inline-block' }}>
                {hotel.vibe}
              </span>
            )}
            <h1 className="t4-headline-xl" style={{ color: '#fff', maxWidth: 920, marginBottom: 14 }}>
              {hotel.name}
            </h1>
            <p style={{ fontFamily: 'var(--t4-font-display)', fontStyle: 'italic', fontSize: 'clamp(15px, 1.6vw, 18px)', color: 'rgba(247, 245, 240, 0.88)', margin: 0 }}>
              {location}
              {hotel.hotel_company && (
                <span style={{ marginLeft: 16, fontStyle: 'normal', fontFamily: 'var(--t4-font-body)', fontSize: 'clamp(11px, 1vw, 12px)', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>
                  · {hotel.hotel_company}
                </span>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="t4-section">
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 80, alignItems: 'start' }} className="t4-hotel-body">
          <div>
            <span className="t4-eyebrow">About the property</span>
            <h2 className="t4-headline-lg" style={{ marginTop: 24, marginBottom: 28 }}>
              Why book {hotel.name} through us.
            </h2>
            {hotel.description ? (
              <p className="t4-body t4-body-lg" style={{ marginBottom: 32 }}>
                {hotel.description}
              </p>
            ) : (
              <p className="t4-body t4-body-lg" style={{ marginBottom: 32, fontStyle: 'italic', color: 'var(--t4-text-muted)' }}>
                A deeper property profile is on the way. In the meantime, our
                advisors can speak to rates, suite availability, and the
                partner-program benefits that apply here.
              </p>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '28px 40px', paddingTop: 48, borderTop: '1px solid var(--t4-divider)' }} className="t4-hotel-facts">
              {hotel.hotel_type && <Fact label="Property type" value={hotel.hotel_type} />}
              {hotel.room_count != null && <Fact label="Rooms" value={`${hotel.room_count}`} />}
              {hotel.room_style && <Fact label="Style" value={hotel.room_style} />}
              {hotel.neighborhood && <Fact label="Neighbourhood" value={hotel.neighborhood} />}
              {hotel.experiences && hotel.experiences.length > 0 && (
                <Fact label="Best for" value={hotel.experiences.slice(0, 3).join(' · ')} />
              )}
            </div>
          </div>

          <aside style={{ background: 'var(--t4-bg-alt)', padding: 48, position: 'sticky', top: 100, alignSelf: 'start' }} className="t4-hotel-aside">
            <span className="t4-eyebrow">Bookable through us</span>
            <h3 className="t4-headline-md" style={{ marginTop: 18, marginBottom: 16 }}>
              Plan a stay here.
            </h3>
            <p className="t4-body" style={{ marginBottom: 24, fontSize: 'clamp(13.5px, 1vw, 14.5px)' }}>
              Tell us when you&apos;d like to go. We&apos;ll respond within one
              business day with rates, availability, and the partner-program
              benefits that apply at {hotel.name}.
            </p>
            <Link
              href={`${base}/contact?hotel=${encodeURIComponent(hotel.name)}`}
              className="t4-btn t4-btn-solid"
              style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}
            >
              Enquire About This Stay
            </Link>
            <Link
              href={`${base}/book-hotel#hotel-directory`}
              style={{ display: 'block', textAlign: 'center', marginTop: 18, fontFamily: 'var(--t4-font-body)', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--t4-text-muted)', textDecoration: 'none' }}
            >
              ← Back to all hotels
            </Link>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="t4-section" style={{ background: 'var(--t4-bg-alt)' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="t4-eyebrow">More from this brand</span>
            <h2 className="t4-headline-lg" style={{ marginTop: 24 }}>
              Other {hotel.hotel_company} properties.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48 }} className="t4-hotel-related-grid">
            {related.map(h => (
              <Link key={h.slug} href={`${base}/hotels/${h.slug}`} style={{ display: 'flex', flexDirection: 'column', color: 'inherit', textDecoration: 'none' }}>
                <div style={{ position: 'relative', aspectRatio: '4 / 3', overflow: 'hidden', background: 'var(--t4-bg)', marginBottom: 18 }}>
                  {h.cover_image_url && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={h.cover_image_url} alt={h.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  )}
                </div>
                <h3 className="t4-headline-md" style={{ marginBottom: 6, fontSize: 'clamp(17px, 1.5vw, 20px)' }}>
                  {h.name}
                </h3>
                <p style={{ fontFamily: 'var(--t4-font-display)', fontStyle: 'italic', fontSize: 'clamp(13px, 1.05vw, 14.5px)', color: 'var(--t4-text-muted)', margin: 0 }}>
                  {[h.city, h.country].filter(Boolean).join(' · ')}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <style>{`
        @media (max-width: 1024px) {
          .t4-hotel-body { gap: 48px !important; }
          .t4-hotel-related-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .t4-hotel-body { grid-template-columns: 1fr !important; gap: 32px !important; }
          .t4-hotel-aside { position: static !important; padding: 32px !important; }
          .t4-hotel-facts { grid-template-columns: 1fr !important; gap: 28px !important; }
          .t4-hotel-related-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontFamily: 'var(--t4-font-body)', fontSize: 'clamp(10px, 0.85vw, 11px)', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--t4-accent)', marginBottom: 8 }}>
        {label}
      </p>
      <p style={{ fontFamily: 'var(--t4-font-display)', fontSize: 'clamp(16px, 1.3vw, 18px)', color: 'var(--t4-text)', margin: 0, lineHeight: 1.4 }}>
        {value}
      </p>
    </div>
  )
}
