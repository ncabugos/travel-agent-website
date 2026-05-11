import { getAgentProfile } from '@/lib/suppliers'
import { getHotel, getHotels, type LuxuryHotel } from '@/lib/hotels'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { tenantBase } from '@/lib/tenant-paths'

interface PageProps {
  params: Promise<{ agentId: string; hotelSlug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { agentId, hotelSlug } = await params
  const [hotel, agent] = await Promise.all([
    getHotel(hotelSlug),
    getAgentProfile(agentId),
  ])
  if (!hotel || !agent) return { title: 'Hotel not found' }
  const { buildMetadata } = await import('@/lib/seo')
  return buildMetadata({
    agent,
    title: `${hotel.name} | ${agent.agency_name}`,
    description: hotel.description ??
      `${hotel.name} in ${[hotel.city, hotel.country].filter(Boolean).join(', ')} — booked through ${agent.agency_name} with partner-program benefits.`,
    path: `hotels/${hotelSlug}`,
    image: hotel.cover_image_url ?? undefined,
    imageAlt: hotel.name,
  })
}

const serif = 'var(--font-serif)'
const sans  = 'var(--font-sans)'

export default async function EdenHotelDetailPage({ params }: PageProps) {
  const { agentId, hotelSlug } = await params
  const [agent, hotel] = await Promise.all([
    getAgentProfile(agentId),
    getHotel(hotelSlug),
  ])
  if (!agent || !hotel) notFound()

  let related: LuxuryHotel[] = []
  if (hotel.hotel_company) {
    const result = await getHotels({ brand: hotel.hotel_company, pageSize: 4 })
    related = result.hotels.filter(h => h.slug !== hotel.slug).slice(0, 3)
  }

  const base = tenantBase(agent)
  const location = [hotel.city, hotel.state_region, hotel.country].filter(Boolean).join(', ')

  return (
    <main style={{ background: 'var(--cream)' }}>
      {/* Hero */}
      <section style={{ position: 'relative', height: '65vh', minHeight: 480, overflow: 'hidden' }}>
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
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,18,16,0.08)' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(20,18,16,0.15) 0%, rgba(20,18,16,0.62) 100%)' }} />

        {/* Back link */}
        <div style={{ position: 'absolute', top: 'clamp(100px, 14vw, 140px)', left: 0, right: 0, padding: '0 24px', zIndex: 2, maxWidth: 1200, margin: '0 auto' }}>
          <Link
            href={`${base}/resources#hotel-directory`}
            style={{ fontFamily: sans, fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.82)', textDecoration: 'none' }}
          >
            ← Hotels
          </Link>
        </div>

        {/* Headline */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', alignItems: 'flex-end', padding: '0 24px 72px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', color: '#fff' }}>
            {hotel.vibe && (
              <p style={{ fontFamily: sans, fontSize: 10, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 22 }}>
                {hotel.vibe}
              </p>
            )}
            <h1 style={{ fontFamily: serif, fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontWeight: 300, color: '#fff', lineHeight: 1.1, marginBottom: 14, maxWidth: 920 }}>
              {hotel.name}
            </h1>
            <p style={{ fontFamily: sans, fontSize: 15, letterSpacing: '0.04em', color: 'rgba(255,255,255,0.88)', margin: 0 }}>
              {location}
              {hotel.hotel_company && (
                <span style={{ marginLeft: 16, opacity: 0.75 }}>· {hotel.hotel_company}</span>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Body */}
      <section style={{ padding: '100px 24px', background: 'var(--cream)' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 80, alignItems: 'start' }} className="eden-hotel-body">
          <div>
            <p className="section-label" style={{ marginBottom: 12 }}>About the property</p>
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: 300, color: 'var(--charcoal)', marginBottom: 32, lineHeight: 1.25 }}>
              Why book {hotel.name} through {agent.agency_name}.
            </h2>
            {hotel.description ? (
              <p style={{ fontFamily: sans, fontSize: 16, lineHeight: 1.9, color: 'var(--warm-gray)', marginBottom: 32 }}>
                {hotel.description}
              </p>
            ) : (
              <p style={{ fontFamily: sans, fontSize: 16, lineHeight: 1.9, color: 'var(--warm-gray)', fontStyle: 'italic', marginBottom: 32 }}>
                A detailed property profile is on the way. For now, our advisors
                can share rates, suite availability, and the partner-program
                benefits that apply at this hotel — every booking includes the
                perks that come with our preferred relationship.
              </p>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px 36px', paddingTop: 40, borderTop: '1px solid var(--divider)' }} className="eden-hotel-facts">
              {hotel.hotel_type && <Fact label="Property type" value={hotel.hotel_type} />}
              {hotel.room_count != null && <Fact label="Rooms" value={`${hotel.room_count}`} />}
              {hotel.room_style && <Fact label="Style" value={hotel.room_style} />}
              {hotel.neighborhood && <Fact label="Neighbourhood" value={hotel.neighborhood} />}
              {hotel.experiences && hotel.experiences.length > 0 && (
                <Fact label="Best for" value={hotel.experiences.slice(0, 3).join(' · ')} />
              )}
            </div>
          </div>

          <aside style={{ background: '#FFFFFF', padding: 40, border: '1px solid var(--divider)', position: 'sticky', top: 100, alignSelf: 'start' }} className="eden-hotel-aside">
            <p className="section-label" style={{ marginBottom: 12 }}>Bookable through us</p>
            <h3 style={{ fontFamily: serif, fontSize: 22, fontWeight: 400, color: 'var(--charcoal)', marginBottom: 16 }}>
              Plan a stay here.
            </h3>
            <p style={{ fontFamily: sans, fontSize: 14, lineHeight: 1.85, color: 'var(--warm-gray)', marginBottom: 32 }}>
              Tell us when you&apos;d like to go — we&apos;ll respond within one
              business day with rates, availability, and the partner-program
              benefits that apply at {hotel.name}.
            </p>
            <Link
              href={`${base}/contact?hotel=${encodeURIComponent(hotel.name)}`}
              style={{
                display: 'block', width: '100%', boxSizing: 'border-box',
                padding: '16px 24px', textAlign: 'center',
                background: 'var(--gold)', color: 'var(--charcoal)',
                fontFamily: sans, fontSize: 10, letterSpacing: '0.3em',
                textTransform: 'uppercase', textDecoration: 'none',
              }}
            >
              Enquire About This Stay
            </Link>
            <Link
              href={`${base}/resources#hotel-directory`}
              style={{
                display: 'block', textAlign: 'center', marginTop: 18,
                fontFamily: sans, fontSize: 10, letterSpacing: '0.28em',
                textTransform: 'uppercase', color: 'var(--warm-gray)',
                textDecoration: 'none',
              }}
            >
              ← Back to all hotels
            </Link>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section style={{ padding: '80px 24px 100px', background: 'rgba(20,18,16,0.04)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <p className="section-label" style={{ marginBottom: 8 }}>More from this brand</p>
              <h2 style={{ fontFamily: serif, fontSize: 'clamp(1.5rem, 2.4vw, 2rem)', fontWeight: 300, color: 'var(--charcoal)' }}>
                Other {hotel.hotel_company} properties.
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }} className="eden-hotel-related-grid">
              {related.map(h => (
                <Link key={h.slug} href={`${base}/hotels/${h.slug}`} style={{ display: 'flex', flexDirection: 'column', color: 'inherit', textDecoration: 'none' }}>
                  <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden', background: 'rgba(20,18,16,0.08)', marginBottom: 16 }}>
                    {h.cover_image_url && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={h.cover_image_url} alt={h.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                    )}
                  </div>
                  <h3 style={{ fontFamily: serif, fontSize: 17, fontWeight: 400, color: 'var(--charcoal)', marginBottom: 4 }}>
                    {h.name}
                  </h3>
                  <p style={{ fontFamily: sans, fontSize: 12, letterSpacing: '0.08em', color: 'var(--warm-gray)', margin: 0 }}>
                    {[h.city, h.country].filter(Boolean).join(', ')}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <style>{`
        @media (max-width: 900px) {
          .eden-hotel-body { grid-template-columns: 1fr !important; gap: 40px !important; }
          .eden-hotel-body > aside { position: static !important; }
          .eden-hotel-facts { grid-template-columns: 1fr !important; }
          .eden-hotel-related-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </main>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--warm-gray)', marginBottom: 6 }}>
        {label}
      </p>
      <p style={{ fontFamily: 'var(--font-serif)', fontSize: 17, color: 'var(--charcoal)', margin: 0, lineHeight: 1.4 }}>
        {value}
      </p>
    </div>
  )
}
