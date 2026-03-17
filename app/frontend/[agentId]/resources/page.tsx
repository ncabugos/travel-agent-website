import Image from 'next/image'
import Link from 'next/link'
import { getAgentProfile } from '@/lib/suppliers'
import { getHotelPrograms } from '@/lib/hotel-programs'
import { ProgramLogoGrid } from '@/components/hotel-programs/ProgramLogoGrid'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ agentId: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { agentId } = await params
  const agent = await getAgentProfile(agentId)
  return {
    title: `Exclusive Hotel Programs — ${agent?.agency_name ?? 'Luxury Travel'}`,
    description: 'Unlock VIP benefits at the world\'s finest hotels — daily breakfast, room upgrades, spa credits, and more — exclusively through our preferred partner programmes.',
  }
}

/* ── SVG line icons (24×24, stroke-only, luxury travel) ────────── */
const IconCrown = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18h18v2H3z"/><path d="M3 18l2-10 4 4 3-7 3 7 4-4 2 10"/></svg>
const IconCompass = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="none"/></svg>
const IconShield = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
const IconLuggage = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="7" width="12" height="14" rx="1"/><path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/><line x1="9" y1="11" x2="9" y2="17"/><line x1="15" y1="11" x2="15" y2="17"/></svg>
const IconGlobe = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><ellipse cx="12" cy="12" rx="4" ry="10"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
const IconCreditCard = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="6" y1="15" x2="10" y2="15"/></svg>

const RESOURCES = [
  { icon: <IconCrown />, title: 'Virtuoso Membership Benefits', description: 'Understand exactly what being a Virtuoso-preferred agency means — from VIP hotel amenities to exclusive experiences.', link: 'https://www.virtuoso.com', linkLabel: 'Learn More' },
  { icon: <IconCompass />, title: 'Destination Entry Requirements', description: 'Stay current with passport, visa, and health documentation requirements for every destination. We recommend checking 90 days before departure.', link: 'https://travel.state.gov', linkLabel: 'U.S. Travel Advisories' },
  { icon: <IconShield />, title: 'Travel Insurance Guide', description: 'A detailed breakdown of travel protection plans — from trip cancellation to medical evacuation — and how to choose the right coverage.', link: '#', linkLabel: 'Download Guide' },
  { icon: <IconLuggage />, title: 'Packing Lists by Destination', description: 'Curated packing guides for safari, cruise, European city, and resort travel — tailored by season.', link: '#', linkLabel: 'View Lists' },
  { icon: <IconGlobe />, title: 'Tipping Etiquette by Region', description: 'Navigate tipping customs with confidence across 40+ countries — from All-Inclusive resorts to East African lodges.', link: '#', linkLabel: 'View Guide' },
  { icon: <IconCreditCard />, title: 'Currency & Money Abroad', description: 'Best practices for currency exchange, using credit cards internationally, and managing money safely while travelling luxury.', link: '#', linkLabel: 'Read More' },
]

const serif = 'var(--font-serif)'
const sans  = 'var(--font-sans)'

export default async function ResourcesPage({ params }: PageProps) {
  const { agentId } = await params

  const [agent, programs] = await Promise.all([
    getAgentProfile(agentId),
    getHotelPrograms(),
  ])

  if (!agent) notFound()

  return (
    <main style={{ background: 'var(--cream)' }}>

      {/* ── Page Banner ─────────────────────────────────────────── */}
      <div style={{ position: 'relative', height: '60vh', minHeight: '400px', overflow: 'hidden' }}>
        <Image
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=2000&q=80"
          alt="Luxury hotel lobby"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,18,16,0.55)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px' }}>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 300, color: '#FFFFFF', lineHeight: 1.1, marginBottom: '20px' }}>
            Exclusive Hotel Programs
          </h1>
          <p style={{ fontFamily: sans, fontSize: '15px', color: 'rgba(255,255,255,0.75)', maxWidth: '560px', lineHeight: '1.8' }}>
            As a member of the world's leading luxury consortia, we unlock benefits at the finest hotels on earth — available only when you book through us.
          </p>
        </div>
      </div>

      {/* ── What This Means Section ──────────────────────────────── */}
      <section style={{ padding: '100px 24px', textAlign: 'center', background: 'var(--cream)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p className="section-label" style={{ marginBottom: '24px' }}>Why Book Through Us</p>
          <h2 style={{
            fontFamily: serif,
            fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
            fontWeight: 300,
            fontStyle: 'italic',
            color: 'var(--charcoal)',
            lineHeight: 1.25,
            marginBottom: '28px',
          }}>
            Benefits you simply cannot get anywhere else.
          </h2>
          <div style={{ width: '40px', height: '1px', background: 'var(--gold)', margin: '0 auto 28px' }} />
          <p style={{ fontFamily: sans, fontSize: '15px', color: 'var(--warm-gray)', lineHeight: '1.9', marginBottom: '60px' }}>
            Our preferred partner status with the world's most prestigious Exclusive Hotel Programs means your clients receive complimentary breakfast, resort credits, room upgrades, VIP recognition, and personalised service — automatically included at no extra cost when booking through us.
          </p>

          {/* Three pillars */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '48px', textAlign: 'left' }}>
            {[
              { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>, title: 'Daily Breakfast', body: 'Full breakfast for two, every morning — included at no extra charge at nearly every programme property.' },
              { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>, title: 'Room Upgrades', body: 'Priority upgrades to superior rooms and suites, guaranteed at the time of booking or check-in.' },
              { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L8 6H4v4l-4 4 4 4v4h4l4 4 4-4h4v-4l4-4-4-4V6h-4z"/><circle cx="12" cy="12" r="3"/></svg>, title: 'Resort & Spa Credits', body: 'Between $50 and $200 in flexible property credit per stay, for dining, spa, or experiences.' },
            ].map(({ icon, title, body }) => (
              <div key={title}>
                <div style={{ fontSize: '22px', color: 'var(--gold)', marginBottom: '16px' }}>{icon}</div>
                <h3 style={{ fontFamily: serif, fontSize: '18px', fontWeight: 400, color: 'var(--charcoal)', marginBottom: '10px' }}>{title}</h3>
                <p style={{ fontFamily: sans, fontSize: '14px', color: 'var(--warm-gray)', lineHeight: '1.8' }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <hr style={{ border: 'none', borderTop: '1px solid var(--divider)' }} />
      </div>

      {/* ── Hotel Programs Logo Grid ─────────────────────────────── */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '56px' }}>
            <p className="section-label" style={{ marginBottom: '12px' }}>Our Programmes</p>
            <h2 style={{
              fontFamily: serif,
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              fontWeight: 300,
              color: 'var(--charcoal)',
              lineHeight: 1.2,
              marginBottom: '16px',
            }}>
              19 Exclusive Hotel Consortia
            </h2>
            <p style={{ fontFamily: sans, fontSize: '14px', color: 'var(--warm-gray)', maxWidth: '540px', lineHeight: '1.8' }}>
              Click any programme to see the full list of benefits available to our clients.
            </p>
          </div>

          <ProgramLogoGrid programs={programs} agentId={agentId} />
        </div>
      </section>

      {/* Divider */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <hr style={{ border: 'none', borderTop: '1px solid var(--divider)' }} />
      </div>

      {/* ── Traveller Toolkit ────────────────────────────────────── */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '56px' }}>
            <p className="section-label" style={{ marginBottom: '12px' }}>Traveller Toolkit</p>
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 300, color: 'var(--charcoal)', lineHeight: 1.2 }}>
              Travel Resources
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2px' }}>
            {RESOURCES.map(resource => (
              <div key={resource.title} style={{ padding: '48px 40px', border: '1px solid var(--divider)', background: 'var(--cream)' }}>
                <div style={{ color: 'var(--gold)', marginBottom: '20px', lineHeight: 1 }}>{resource.icon}</div>
                <h3 style={{ fontFamily: serif, fontSize: '20px', fontWeight: 400, color: 'var(--charcoal)', marginBottom: '12px', lineHeight: 1.25 }}>{resource.title}</h3>
                <p style={{ fontFamily: sans, fontSize: '14px', color: 'var(--warm-gray)', lineHeight: '1.8', marginBottom: '24px' }}>{resource.description}</p>
                <Link
                  href={resource.link}
                  target={resource.link.startsWith('http') ? '_blank' : undefined}
                  rel={resource.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                  style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', textDecoration: 'none', borderBottom: '1px solid var(--gold)', paddingBottom: '2px' }}
                >
                  {resource.linkLabel} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <hr style={{ border: 'none', borderTop: '1px solid var(--divider)' }} />
      </div>

      {/* ── Travel Links ─────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '48px' }}>
            <p className="section-label" style={{ marginBottom: '12px' }}>Quick Links</p>
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 300, color: 'var(--charcoal)', lineHeight: 1.2 }}>
              Travel Links
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '48px' }}>

            {/* Before You Go */}
            <div>
              <h3 style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '20px' }}>Before You Go</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  { label: 'Immunizations', href: 'https://wwwnc.cdc.gov/travel' },
                  { label: 'World Fact Book', href: 'https://www.cia.gov/the-world-factbook/' },
                  { label: 'LGBTI', href: 'https://travel.state.gov/content/travel/en/international-travel/before-you-go/travelers-with-special-considerations/lgbti.html' },
                ].map(({ label, href }) => (
                  <li key={label} style={{ marginBottom: '10px' }}>
                    <a href={href} target="_blank" rel="noopener noreferrer"
                      className="hover-gold"
                      style={{ fontFamily: sans, fontSize: '14px', color: 'var(--warm-gray)', textDecoration: 'none', borderBottom: '1px solid transparent', transition: 'color 0.2s, border-color 0.2s' }}
                    >{label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Travel Alerts */}
            <div>
              <h3 style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '20px' }}>Travel Alerts</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  { label: 'Homeland Security', href: 'http://www.dhs.gov/travel-alerts' },
                  { label: 'Embassy Listings', href: 'http://www.usembassy.gov/' },
                  { label: 'Travel Advisories', href: 'https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories.html' },
                  { label: 'CDC Health Alerts', href: 'https://wwwnc.cdc.gov/travel' },
                ].map(({ label, href }) => (
                  <li key={label} style={{ marginBottom: '10px' }}>
                    <a href={href} target="_blank" rel="noopener noreferrer"
                      className="hover-gold"
                      style={{ fontFamily: sans, fontSize: '14px', color: 'var(--warm-gray)', textDecoration: 'none', borderBottom: '1px solid transparent', transition: 'color 0.2s, border-color 0.2s' }}
                    >{label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Travel Tools */}
            <div>
              <h3 style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '20px' }}>Travel Tools</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  { label: 'Currency Converter', href: 'http://www.xe.com/currencyconverter/' },
                  { label: 'Flight Tracker', href: 'http://www.flightview.com/TravelTools/default.asp' },
                  { label: 'Google Maps', href: 'http://maps.google.com/' },
                  { label: 'Google Earth', href: 'http://earth.google.com/' },
                  { label: 'Weather', href: 'https://weather.com' },
                ].map(({ label, href }) => (
                  <li key={label} style={{ marginBottom: '10px' }}>
                    <a href={href} target="_blank" rel="noopener noreferrer"
                      className="hover-gold"
                      style={{ fontFamily: sans, fontSize: '14px', color: 'var(--warm-gray)', textDecoration: 'none', borderBottom: '1px solid transparent', transition: 'color 0.2s, border-color 0.2s' }}
                    >{label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Assistance */}
            <div>
              <h3 style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '20px' }}>Assistance</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  { label: 'US Dept of State: International Travel', href: 'https://travel.state.gov/content/travel/en/international-travel.html' },
                  { label: 'US Dept of State: Passport Information', href: 'http://travel.state.gov/passport/passport_1738.html' },
                  { label: 'Visas', href: 'https://cibtvisas.com/?login=montecitovillagetravel' },
                ].map(({ label, href }) => (
                  <li key={label} style={{ marginBottom: '10px' }}>
                    <a href={href} target="_blank" rel="noopener noreferrer"
                      className="hover-gold"
                      style={{ fontFamily: sans, fontSize: '14px', color: 'var(--warm-gray)', textDecoration: 'none', borderBottom: '1px solid transparent', transition: 'color 0.2s, border-color 0.2s' }}
                    >{label}</a>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ── CTA Band ────────────────────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <Image
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=2000&q=80"
          alt="Luxury hotel"
          fill
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,18,16,0.72)' }} />
        <div style={{ position: 'relative', textAlign: 'center', padding: '80px 24px' }}>
          <p style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '16px' }}>
            Ready to Experience the Difference?
          </p>
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 300, color: '#FFFFFF', marginBottom: '32px' }}>
            Book through us and unlock every benefit.
          </h2>
          <Link href={`/frontend/${agentId}/contact`} className="btn-gold">Start Planning</Link>
        </div>
      </section>

    </main>
  )
}
