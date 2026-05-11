import { getHotel, getHotels, type LuxuryHotel } from '@/lib/hotels'
import { T2LeadForm } from '@/components/t2/T2LeadForm'
import { HotelCardImage } from '@/components/t2/HotelCardImage'
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
    title: `${hotel.name} — Book through your advisor`,
    description: hotel.description ?? `${hotel.name} in ${[hotel.city, hotel.country].filter(Boolean).join(', ')} — book with Virtuoso benefits through your travel advisor.`,
  }
}

/**
 * Individual hotel detail page — T2 template.
 *
 * Placeholder content for now (hero + quick facts + Enquire form). The
 * deeper "Virtuoso-style" content (rooms, dining, experiences, amenities)
 * will plug in here once the luxury_hotels table is extended with those
 * fields. This route exists today so the directory's hotel cards have
 * an internal navigation target instead of opening a modal.
 */
export default async function T2HotelDetailPage({ params }: PageProps) {
  const { agentId, hotelSlug } = await params
  const hotel = await getHotel(hotelSlug)
  if (!hotel) notFound()

  // Related hotels: same brand, different slug, capped at 3.
  let related: LuxuryHotel[] = []
  if (hotel.hotel_company) {
    const result = await getHotels({ brand: hotel.hotel_company, pageSize: 4 })
    related = result.hotels.filter(h => h.slug !== hotel.slug).slice(0, 3)
  }

  const base = `/t2/${agentId}`
  const location = [hotel.city, hotel.state_region, hotel.country].filter(Boolean).join(', ')

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', height: '70vh', minHeight: 520, overflow: 'hidden' }}>
        {hotel.cover_image_url ? (
          <Image
            src={hotel.cover_image_url}
            alt={hotel.name}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover' }}
            unoptimized
          />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: 'var(--t2-bg-alt, #EDE8E1)' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.65))' }} />

        {/* Breadcrumb / back link */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          padding: '120px 32px 0', zIndex: 2,
          maxWidth: 1280, margin: '0 auto',
        }}>
          <Link
            href={`${base}/book-hotel#hotel-directory`}
            style={{
              fontFamily: 'var(--t2-font-sans)', fontSize: 11,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.85)', textDecoration: 'none',
            }}
          >
            ← Hotels
          </Link>
        </div>

        {/* Headline */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          display: 'flex', alignItems: 'flex-end',
          padding: '0 32px 64px',
        }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', color: '#FFF' }}>
            {hotel.vibe && (
              <p
                className="t2-label"
                style={{ color: 'rgba(255,255,255,0.85)', marginBottom: 14 }}
              >
                {hotel.vibe}
              </p>
            )}
            <h1
              className="t2-heading t2-heading-xl"
              style={{ color: '#FFF', maxWidth: 920, marginBottom: 12 }}
            >
              {hotel.name}
            </h1>
            <p style={{
              fontFamily: 'var(--t2-font-sans)', fontSize: 15,
              letterSpacing: '0.04em', color: 'rgba(255,255,255,0.88)',
            }}>
              {location}
              {hotel.hotel_company && (
                <span style={{ marginLeft: 16, opacity: 0.75 }}>
                  · {hotel.hotel_company}
                </span>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <section className="t2-section">
        <div style={{
          maxWidth: 1080, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 64,
        }} className="t2-hotel-body">
          {/* Description column */}
          <div>
            <p className="t2-label" style={{ color: 'var(--t2-accent)', marginBottom: 12 }}>
              About the property
            </p>
            <h2 className="t2-heading t2-heading-md" style={{ marginBottom: 28 }}>
              Why book {hotel.name} through us.
            </h2>
            {hotel.description ? (
              <p className="t2-body" style={{ marginBottom: 24, lineHeight: 1.85 }}>
                {hotel.description}
              </p>
            ) : (
              <p className="t2-body" style={{ marginBottom: 24, lineHeight: 1.85, fontStyle: 'italic', color: 'var(--t2-text-muted)' }}>
                A detailed property profile is on the way. For now, our advisors
                can share rates, suite availability, and partner-program benefits
                — every booking includes the perks that come with our preferred
                relationship.
              </p>
            )}

            {/* Quick facts */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px 32px',
              padding: '32px 0', borderTop: '1px solid var(--t2-border)',
              marginTop: 16,
            }}>
              {hotel.hotel_type && (
                <DetailFact label="Property type" value={hotel.hotel_type} />
              )}
              {hotel.room_count != null && (
                <DetailFact label="Rooms" value={`${hotel.room_count}`} />
              )}
              {hotel.room_style && (
                <DetailFact label="Style" value={hotel.room_style} />
              )}
              {hotel.neighborhood && (
                <DetailFact label="Neighbourhood" value={hotel.neighborhood} />
              )}
              {hotel.experiences && hotel.experiences.length > 0 && (
                <DetailFact label="Best for" value={hotel.experiences.slice(0, 3).join(' · ')} />
              )}
            </div>
          </div>

          {/* Enquire / contact sidebar */}
          <aside style={{
            background: 'var(--t2-bg-alt, #f8f5ef)', padding: 32,
            position: 'sticky', top: 100, alignSelf: 'start',
          }}>
            <p className="t2-label" style={{ marginBottom: 12, color: 'var(--t2-accent)' }}>
              Bookable through us
            </p>
            <h3 className="t2-heading t2-heading-sm" style={{ marginBottom: 16 }}>
              Plan a stay here.
            </h3>
            <p style={{
              fontFamily: 'var(--t2-font-sans)', fontSize: 13, lineHeight: 1.7,
              color: 'var(--t2-text-muted)', marginBottom: 28,
            }}>
              Tell us your dates and a few preferences — we'll respond within
              one business day with rates, availability, and the partner-program
              benefits that apply at {hotel.name}.
            </p>
            <Link
              href={`${base}/contact?hotel=${encodeURIComponent(hotel.name)}`}
              className="t2-btn t2-btn-primary"
              style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}
            >
              Enquire about this stay
            </Link>
            <Link
              href={`${base}/book-hotel#hotel-directory`}
              style={{
                display: 'block', textAlign: 'center', marginTop: 16,
                fontFamily: 'var(--t2-font-sans)', fontSize: 11,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: 'var(--t2-text-muted)', textDecoration: 'none',
              }}
            >
              ← Back to all hotels
            </Link>
          </aside>
        </div>
      </section>

      {/* ── Related — same brand ─────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="t2-section" style={{ background: 'var(--t2-bg-alt, #f8f5ef)' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <p className="t2-label" style={{ marginBottom: 8, color: 'var(--t2-accent)' }}>
              More from this brand
            </p>
            <h2 className="t2-heading t2-heading-md">
              Other {hotel.hotel_company} properties.
            </h2>
          </div>
          <div className="t2-grid-3" style={{ maxWidth: 1280, margin: '0 auto' }}>
            {related.map(h => (
              <Link
                key={h.slug}
                href={`${base}/hotels/${h.slug}`}
                className="t2-card"
                style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'inherit', background: '#FFF' }}
              >
                <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
                  <HotelCardImage src={h.cover_image_url} alt={h.name} fallbackLabel={h.name} />
                </div>
                <div style={{ padding: '20px 24px 24px' }}>
                  <h3 style={{ fontFamily: 'var(--t2-font-serif)', fontSize: 16, fontWeight: 500, marginBottom: 6 }}>
                    {h.name}
                  </h3>
                  <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 11, letterSpacing: '0.06em', color: 'var(--t2-accent)' }}>
                    {[h.city, h.country].filter(Boolean).join(', ')}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <T2LeadForm
        heading="Plan Your Hotel Stay"
        subheading="Tell us when and where you'd like to go — every booking placed through us comes with partner-program perks."
      />

      <style>{`
        @media (max-width: 900px) {
          .t2-hotel-body { grid-template-columns: 1fr !important; gap: 40px !important; }
          .t2-hotel-body > aside { position: static !important; }
        }
      `}</style>
    </>
  )
}

function DetailFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{
        fontFamily: 'var(--t2-font-sans)', fontSize: 10,
        letterSpacing: '0.18em', textTransform: 'uppercase',
        color: 'var(--t2-text-muted)', marginBottom: 6,
      }}>
        {label}
      </p>
      <p style={{
        fontFamily: 'var(--t2-font-sans)', fontSize: 14,
        color: 'var(--t2-text)', margin: 0,
      }}>
        {value}
      </p>
    </div>
  )
}
