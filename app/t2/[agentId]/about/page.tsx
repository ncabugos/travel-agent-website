import Image from 'next/image'
import Link from 'next/link'
import YTCAboutPage from './ytc-about'

// ─── Inline data ──────────────────────────────────────────────────────────────

const TEAM = [
  {
    name: 'Sarah Chen',
    title: 'Founder & Senior Travel Advisor',
    photo: '/media/team/agent-sarah-chen.png',
    bio: 'With over 18 years crafting bespoke journeys for discerning clients, Sarah founded Eden Travel with a singular conviction: that genuine human expertise — not algorithms — creates the most extraordinary travel experiences. A Virtuoso Elite advisor and Condé Nast Top Travel Specialist, she has personally stayed in over 300 luxury properties across 60 countries.',
    specialties: ['Private villas & residences', 'Wellness & spa retreats', 'European river cruising'],
  },
  {
    name: 'James Whitmore',
    title: 'Luxury Cruise Specialist',
    photo: '/media/team/agent-james-whitmore.png',
    bio: 'James brings a career at sea to his role as Eden\'s lead cruise consultant. A former guest experience director aboard Silversea\'s flagship vessel, he has unmatched insight into ultra-luxury ocean and expedition cruising. He holds preferred advisor status with Regent Seven Seas, Seabourn, and Silversea.',
    specialties: ['Ultra-luxury ocean cruising', 'Expedition & polar voyages', 'Cruise-and-stay programs'],
  },
  {
    name: 'Isabelle Moreau',
    title: 'Europe & Cultural Travel Expert',
    photo: '/media/team/agent-isabelle-moreau.png',
    bio: 'Born in Lyon and educated in Florence, Isabelle spent a decade as a private art and culture guide before joining Eden Travel. She specialises in curating deeply personal European itineraries — from private access to Vatican collections to harvest-season truffle hunts in Périgord. Her clients return, year after year, for her singular connections.',
    specialties: ['Europe & the Mediterranean', 'Art, culture & gastronomy', 'Private access experiences'],
  },
]

const ACCOLADES = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    ),
    label: 'Virtuoso Member',
    sublabel: 'Elite luxury travel consortium',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
    label: 'Condé Nast Traveler',
    sublabel: 'Top Travel Specialists 2025 & 2026',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    label: 'Established 2006',
    sublabel: 'Nearly two decades of bespoke travel',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    label: '2,500+ Destinations',
    sublabel: 'Across 90 countries worldwide',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AboutPage({ params }: { params: Promise<{ agentId: string }> }) {
  const { agentId } = await params

  if (agentId === 'ytc-demo') {
    return <YTCAboutPage params={{ agentId }} />
  }

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', height: 650, overflow: 'hidden' }}>
        <Image
          src="/media/hero images/four-seasons-CapFerrat-pool-hero.jpg"
          alt="About Eden Travel"
          fill
          priority
          style={{ objectFit: 'cover', objectPosition: 'center 60%' }}
          sizes="100vw"
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 100%)' }} />
        <div
          style={{
            position: 'relative', zIndex: 2, height: '100%',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center', textAlign: 'center',
            padding: '0 24px',
          }}
        >
          <p className="t2-label" style={{ marginBottom: 14, color: 'var(--t2-accent)' }}>Our Story</p>
          <h1 className="t2-heading t2-heading-xl" style={{ color: '#ffffff', maxWidth: 640 }}>
            Crafting Extraordinary Journeys Since 2006
          </h1>
        </div>
      </section>

      {/* ── Story ────────────────────────────────────────────────────────── */}
      <section style={{ background: '#ffffff', padding: '100px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>

          {/* Left — image */}
          <div style={{ position: 'relative', height: 540, borderRadius: 2, overflow: 'hidden' }}>
            <Image
              src="/media/hotel-programs/four-seasons/fs-maui-ocean_suite-3840x2160.jpg"
              alt="Luxury travel experience"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              sizes="(max-width: 1100px) 50vw, 550px"
            />
          </div>

          {/* Right — copy */}
          <div>
            <p className="t2-label" style={{ marginBottom: 20, letterSpacing: '0.2em' }}>Who We Are</p>
            <h2 className="t2-heading" style={{ fontSize: 38, lineHeight: 1.2, marginBottom: 28 }}>
              Independent Advisors.<br />Unrivalled Access.
            </h2>
            <p style={{
              fontFamily: 'var(--t2-font-sans)', fontSize: 16, lineHeight: 1.9,
              color: 'var(--t2-text-muted)', marginBottom: 24,
            }}>
              Eden Travel was founded on a simple but powerful idea: that exceptional travel begins with a trusted human relationship. We are an independent luxury travel agency and proud affiliate of Montecito Village Travel — one of the most decorated Virtuoso agencies in the United States.
            </p>
            <p style={{
              fontFamily: 'var(--t2-font-sans)', fontSize: 16, lineHeight: 1.9,
              color: 'var(--t2-text-muted)', marginBottom: 36,
            }}>
              Our advisors aren't order-takers. We are experienced travellers, hotel connoisseurs, and destination specialists who have personally vetted the properties, experiences, and routes we recommend. When you travel with Eden, you benefit not just from our knowledge — but from the privileged access that comes with nearly two decades of trusted supplier relationships.
            </p>
            {/* Stat row */}
            <div style={{ display: 'flex', gap: 40, borderTop: '1px solid var(--t2-divider)', paddingTop: 32 }}>
              {[['18+', 'Years in business'], ['60+', 'Countries covered'], ['300+', 'Properties personally stayed']].map(([num, label]) => (
                <div key={num}>
                  <div style={{ fontFamily: 'var(--t2-font-serif)', fontSize: 32, fontWeight: 400, color: 'var(--t2-text)', letterSpacing: '-0.01em' }}>{num}</div>
                  <div style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--t2-text-muted)', marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Accolades band ───────────────────────────────────────────────── */}
      <section style={{ background: 'var(--t2-bg)', borderTop: '1px solid var(--t2-divider)', borderBottom: '1px solid var(--t2-divider)', padding: '60px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
          {ACCOLADES.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                padding: '16px 32px',
                borderLeft: i > 0 ? '1px solid var(--t2-divider)' : undefined,
              }}
            >
              <div style={{ marginBottom: 14, color: 'var(--t2-text-muted)', opacity: 0.7 }}>
                {item.icon}
              </div>
              <div style={{ fontFamily: 'var(--t2-font-serif)', fontSize: 17, fontWeight: 400, color: 'var(--t2-text)', marginBottom: 4 }}>
                {item.label}
              </div>
              <div style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 11, color: 'var(--t2-text-muted)', letterSpacing: '0.05em' }}>
                {item.sublabel}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────────────────── */}
      <section style={{ background: '#ffffff', padding: '100px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <p className="t2-label" style={{ marginBottom: 16, letterSpacing: '0.2em' }}>The People Behind Your Journey</p>
            <h2 className="t2-heading t2-heading-lg">Meet the Team</h2>
          </div>

          {/* Team grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48 }}>
            {TEAM.map((member) => (
              <div key={member.name}>
                {/* Photo */}
                <div style={{ position: 'relative', height: 420, marginBottom: 28, overflow: 'hidden', borderRadius: 2 }}>
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'center top' }}
                    sizes="(max-width: 1100px) 33vw, 360px"
                    unoptimized
                  />
                </div>

                {/* Name & title */}
                <h3 style={{ fontFamily: 'var(--t2-font-serif)', fontSize: 22, fontWeight: 400, color: 'var(--t2-text)', marginBottom: 4 }}>
                  {member.name}
                </h3>
                <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--t2-accent)', marginBottom: 18 }}>
                  {member.title}
                </p>

                {/* Divider */}
                <div style={{ width: 32, height: 1, background: 'var(--t2-divider)', marginBottom: 18 }} />

                {/* Bio */}
                <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 14, lineHeight: 1.85, color: 'var(--t2-text-muted)', marginBottom: 20 }}>
                  {member.bio}
                </p>

                {/* Specialties */}
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {member.specialties.map(s => (
                    <li key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6h8M7 3l3 3-3 3" stroke="var(--t2-accent)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 12, letterSpacing: '0.04em', color: 'var(--t2-text-muted)' }}>
                        {s}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Philosophy ───────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', height: 440, overflow: 'hidden' }}>
        <Image
          src="/media/hotel-programs/aman/aman-hero-2000.jpg"
          alt="Our philosophy"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
          sizes="100vw"
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)' }} />
        <div
          style={{
            position: 'relative', zIndex: 2, height: '100%',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center', textAlign: 'center',
            padding: '0 24px',
          }}
        >
          <p style={{
            fontFamily: 'var(--t2-font-serif)', fontSize: 26, fontWeight: 300, fontStyle: 'italic',
            color: '#ffffff', maxWidth: 700, lineHeight: 1.6, marginBottom: 32,
          }}>
            &ldquo;We don&rsquo;t sell travel. We engineer memories — with the rigour of experts and the passion of people who genuinely love the world.&rdquo;
          </p>
          <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--t2-accent)' }}>
            Sarah Chen, Founder
          </p>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section style={{ background: '#ffffff', padding: '100px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <p className="t2-label" style={{ marginBottom: 16, letterSpacing: '0.2em' }}>Ready to Begin?</p>
          <h2 className="t2-heading t2-heading-lg" style={{ marginBottom: 20 }}>Let&rsquo;s Plan Your Journey</h2>
          <p style={{
            fontFamily: 'var(--t2-font-sans)', fontSize: 16, lineHeight: 1.9,
            color: 'var(--t2-text-muted)', marginBottom: 40,
          }}>
            Every great trip starts with a conversation. Reach out to one of our advisors and let&rsquo;s design something extraordinary together.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Link
              href={`/t2/demo/plan-a-trip`}
              style={{
                display: 'inline-block',
                fontFamily: 'var(--t2-font-sans)', fontSize: 11, letterSpacing: '0.2em',
                textTransform: 'uppercase', fontWeight: 500,
                padding: '16px 36px',
                background: 'var(--t2-text)', color: '#ffffff',
                textDecoration: 'none',
                transition: 'opacity 0.2s ease',
              }}
            >
              Start Planning
            </Link>
            <Link
              href={`/t2/demo/contact`}
              style={{
                display: 'inline-block',
                fontFamily: 'var(--t2-font-sans)', fontSize: 11, letterSpacing: '0.2em',
                textTransform: 'uppercase', fontWeight: 500,
                padding: '16px 36px',
                background: 'transparent', color: 'var(--t2-text)',
                border: '1px solid var(--t2-divider)',
                textDecoration: 'none',
                transition: 'border-color 0.2s ease',
              }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .about-story-grid { grid-template-columns: 1fr !important; }
          .about-team-grid  { grid-template-columns: 1fr !important; }
          .about-accolade-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </>
  )
}
