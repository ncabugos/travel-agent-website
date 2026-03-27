import Image from 'next/image'
import Link from 'next/link'

// ─── Team Data (real YTC advisors) ───────────────────────────────────────────

const TEAM = [
  {
    name: 'Sylvia Merrill',
    title: 'Senior Travel Advisor',
    photo: '/assets/ytc/team/sylvia-merrill.jpg',
    bio: 'With 37 years of experience and over 20 personal sailings, Sylvia is YTC\'s resident cruise authority — an Accredited Cruise Counselor and Alaska Certified Travel Expert who brings unmatched expertise to ocean and river cruise planning.',
    specialties: ['Ocean & River Cruising', 'Beach & Sun Escapes', 'Honeymoon Travel'],
  },
  {
    name: 'Michelle Henrich',
    title: 'Luxury & Cultural Travel Advisor',
    photo: '/assets/ytc/team/michelle-henrich.jpg',
    bio: 'Michelle\'s 27 years in travel are defined by meticulous research and a genuine passion for detail. She specializes in luxury cruises, European itineraries, and family adventures — ensuring every element of your journey is seamlessly planned.',
    specialties: ['Luxury Cruises', 'European Travel', 'Family Vacations'],
  },
  {
    name: 'Olevia Kautzman',
    title: 'Adventure & Family Specialist',
    photo: '/assets/ytc/team/olevia-kautzman.jpg',
    bio: 'A CTA-certified advisor with deep expertise in Hawaii and Mexico, Olevia brings 10 years of travel planning and 25 years of customer service expertise to every client interaction — handling leisure, corporate, and government travel with equal ease.',
    specialties: ['Hawaii & Mexico', 'Adventure Travel', 'Small Ship Cruising'],
  },
  {
    name: 'Sheryl Drexel',
    title: 'Group & Adventure Travel Expert',
    photo: '/assets/ytc/team/sheryl-drexel.jpg',
    bio: 'A former agency owner with 47 years in the industry, Sheryl brings rare depth to group travel, safari expeditions, and adventure itineraries. Her extensive background in sports, mission, and corporate group logistics is unparalleled.',
    specialties: ['Group & Safari Travel', 'Adventure Expeditions', 'Ocean & River Cruising'],
  },
  {
    name: 'Laurie Warren',
    title: 'Corporate & Executive Travel Advisor',
    photo: '/assets/ytc/team/laurie-warren.jpg',
    bio: 'With 38 years of experience and CTA certification, Laurie is YTC\'s go-to expert for the complex, time-sensitive world of corporate and executive travel — managing meetings, incentive programs, and business trips with precision.',
    specialties: ['Corporate Travel', 'Meeting & Incentive Programs', 'Executive Air Travel'],
  },
  {
    name: 'Mona Elton',
    title: 'European & Mediterranean Specialist',
    photo: '/assets/ytc/team/mona-elton.jpg',
    bio: 'Having lived in both Germany and Italy, Mona brings a rare insider perspective to European travel. A certified Europe and Mexico Master Agent, she is passionate about Tuscan villas, Mediterranean coastlines, and off-the-beaten-path cultural experiences.',
    specialties: ['European Villas & Culture', 'Mediterranean Travel', 'River Cruising'],
  },
]

// ─── Accolades ────────────────────────────────────────────────────────────────

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
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    label: 'Est. 1985',
    sublabel: 'Serving Spokane for decades',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    label: '2,500+ Destinations',
    sublabel: 'Across 90+ countries worldwide',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
    label: '150+ Years Combined',
    sublabel: 'Team experience in travel',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

interface PageProps {
  params: { agentId: string }
}

export default function YTCAboutPage({ params }: PageProps) {
  const base = `/t2/${params.agentId}`

  return (
    <>
      <section style={{ position: 'relative', height: 540, overflow: 'hidden' }}>
        <Image
          src="/media/hotel-programs/aman/aman-hero-2000.jpg"
          alt="About Your Travel Center"
          fill
          priority
          style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
          sizes="100vw"
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(18,18,26,0.15) 0%, rgba(18,18,26,0.65) 100%)' }} />
        <div style={{
          position: 'relative', zIndex: 2, height: '100%',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center', textAlign: 'center',
          padding: '0 24px',
        }}>
          <p className="t2-label" style={{ marginBottom: 16, color: 'var(--t2-accent)' }}>Your Travel Center</p>
          <h1 className="t2-heading t2-heading-xl" style={{ color: '#ffffff', maxWidth: 700, marginBottom: 20 }}>
            Experts in Travel
          </h1>
          <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 16, color: 'rgba(255,255,255,0.75)', maxWidth: 540 }}>
            A division of Montecito Village Travel and proud member of the Virtuoso luxury travel network.
          </p>
        </div>
      </section>

      {/* ── Story Section ─────────────────────────────────────────────────── */}
      <section style={{ background: '#ffffff', padding: '0 24px 100px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }} className="ytc-about-grid">

          {/* Left — image: extends above the section padding to be taller than the text */}
          <div style={{ position: 'relative', height: 720, overflow: 'hidden', borderRadius: 2, marginTop: -60 }}>
            <Image
              src="/media/hotel-programs/four-seasons/fs-maui-ocean_suite-3840x2160.jpg"
              alt="Travel expertise"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              sizes="(max-width: 1100px) 100vw, 550px"
            />
          </div>

          {/* Right — copy, padded from top */}
          <div style={{ paddingTop: 80 }}>
            <p className="t2-label" style={{ marginBottom: 20, letterSpacing: '0.2em' }}>Who We Are</p>
            <h2 className="t2-heading" style={{ fontSize: 38, lineHeight: 1.2, marginBottom: 28 }}>
              Spokane&rsquo;s Most Trusted<br />Travel Experts.
            </h2>
            <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 15, lineHeight: 1.95, color: 'var(--t2-text-muted)', marginBottom: 20, fontWeight: 300 }}>
              Your Travel Center has grown from a beloved local Spokane agency into a nationally-recognized travel consultancy serving clients all over the world. We&rsquo;ve spent decades building relationships with the best global travel partners — and those relationships are our secret weapon.
            </p>
            <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 15, lineHeight: 1.95, color: 'var(--t2-text-muted)', marginBottom: 36, fontWeight: 300 }}>
              As a division of Montecito Village Travel and proud Virtuoso member, our advisors unlock exclusive perks, VIP upgrades, and insider access that simply aren&rsquo;t available through any booking website. We handle every facet of travel — from honeymoons and family adventures to corporate accounts and luxury expedition sailing.
            </p>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 40, borderTop: '1px solid var(--t2-divider)', paddingTop: 32 }}>
              {[['40+', 'Years in Business'], ['150+', 'Years Combined Experience'], ['6', 'Expert Advisors']].map(([num, label]) => (
                <div key={num}>
                  <div style={{ fontFamily: 'var(--t2-font-serif)', fontSize: 32, fontWeight: 400, color: 'var(--t2-text)', letterSpacing: '-0.01em' }}>{num}</div>
                  <div style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--t2-text-muted)', marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Why YTC — 3 Pillars ───────────────────────────────────────────── */}
      <section style={{ background: 'var(--t2-bg-alt)', padding: '100px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <p className="t2-label" style={{ marginBottom: 16 }}>The YTC Advantage</p>
            <h2 className="t2-heading t2-heading-lg">Why Travel with YTC?</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48 }} className="ytc-pillars-grid">
            {[
              {
                icon: (
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--t2-accent)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                ),
                title: 'Insider Knowledge',
                body: 'Our expert travel advisors have traversed the globe in search of the finest places to eat, stay, and explore — and they\'re ready to share that hard-won knowledge with you.',
              },
              {
                icon: (
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--t2-accent)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
                  </svg>
                ),
                title: 'Unprecedented Access',
                body: 'As a Virtuoso member and division of Montecito Village Travel, our connections unlock complimentary breakfasts, room upgrades, spa credits, and exclusive amenities unavailable anywhere else.',
              },
              {
                icon: (
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--t2-accent)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                ),
                title: 'Peace of Mind',
                body: 'If anything goes wrong on your trip, we get your vacation back on track. With decades of experience, we\'ve seen it all — and we know exactly how to handle any situation with grace and speed.',
              },
            ].map((pillar) => (
              <div key={pillar.title} style={{ background: '#ffffff', padding: '48px 40px' }}>
                <div style={{ marginBottom: 28 }}>{pillar.icon}</div>
                <h3 style={{
                  fontFamily: 'var(--t2-font-sans)',
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--t2-text)',
                  marginBottom: 20,
                }}>{pillar.title}</h3>
                <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 14, lineHeight: 1.9, color: 'var(--t2-text-muted)', fontWeight: 300 }}>
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Accolades Band ───────────────────────────────────────────────── */}
      <section style={{ background: 'var(--t2-bg)', borderTop: '1px solid var(--t2-divider)', borderBottom: '1px solid var(--t2-divider)', padding: '60px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }} className="ytc-accolades-grid">
          {ACCOLADES.map((item, i) => (
            <div key={i} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
              padding: '16px 32px',
              borderLeft: i > 0 ? '1px solid var(--t2-divider)' : undefined,
            }}>
              <div style={{ marginBottom: 14, color: 'var(--t2-accent)', opacity: 0.8 }}>{item.icon}</div>
              <div style={{ fontFamily: 'var(--t2-font-serif)', fontSize: 17, fontWeight: 400, color: 'var(--t2-text)', marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 11, color: 'var(--t2-text-muted)', letterSpacing: '0.05em' }}>{item.sublabel}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Team Section ──────────────────────────────────────────────────── */}
      <section style={{ background: '#ffffff', padding: '100px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <p className="t2-label" style={{ marginBottom: 16, letterSpacing: '0.2em' }}>The People Behind Your Journey</p>
            <h2 className="t2-heading t2-heading-lg">Meet Our Advisors</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 56 }} className="ytc-team-grid">
            {TEAM.map((member) => (
              <div key={member.name}>
                {/* Photo */}
                <div style={{ position: 'relative', height: 400, marginBottom: 28, overflow: 'hidden', borderRadius: 2 }}>
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'center top' }}
                    sizes="(max-width: 1100px) 33vw, 360px"
                    unoptimized
                  />
                </div>

                <h3 style={{ fontFamily: 'var(--t2-font-serif)', fontSize: 22, fontWeight: 400, color: 'var(--t2-text)', marginBottom: 4 }}>
                  {member.name}
                </h3>
                <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--t2-accent)', marginBottom: 18 }}>
                  {member.title}
                </p>

                <div style={{ width: 32, height: 1, background: 'var(--t2-divider)', marginBottom: 18 }} />

                <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 13, lineHeight: 1.85, color: 'var(--t2-text-muted)', marginBottom: 20, fontWeight: 300 }}>
                  {member.bio}
                </p>

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

      {/* ── Philosophy Quote ──────────────────────────────────────────────── */}
      <section style={{ position: 'relative', height: 650, overflow: 'hidden' }}>
        <Image
          src="/media/hotel-programs/aman/aman-hero-2000.jpg"
          alt="Our philosophy"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
          sizes="100vw"
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(18,18,26,0.58)' }} />
        <div style={{
          position: 'relative', zIndex: 2, height: '100%',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center', textAlign: 'center',
          padding: '0 24px',
        }}>
          <p style={{
            fontFamily: 'var(--t2-font-serif)', fontSize: 26, fontWeight: 300, fontStyle: 'italic',
            color: '#ffffff', maxWidth: 720, lineHeight: 1.6, marginBottom: 32,
          }}>
            &ldquo;We don&rsquo;t just book travel. We design transformational experiences — fueled by three generations of expertise and a genuine love of the world.&rdquo;
          </p>
          <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--t2-accent)' }}>
            Your Travel Center, Spokane
          </p>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section style={{ background: '#ffffff', padding: '100px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <p className="t2-label" style={{ marginBottom: 16, letterSpacing: '0.2em' }}>Get Connected</p>
          <h2 className="t2-heading t2-heading-lg" style={{ marginBottom: 20 }}>Let&rsquo;s Plan Your Journey</h2>
          <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 15, lineHeight: 1.9, color: 'var(--t2-text-muted)', marginBottom: 40, fontWeight: 300 }}>
            Every great trip starts with a conversation. Reach out to one of our expert advisors and let&rsquo;s design something extraordinary — together.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link href={`${base}/contact`} style={{
              display: 'inline-block',
              fontFamily: 'var(--t2-font-sans)', fontSize: 11, letterSpacing: '0.2em',
              textTransform: 'uppercase', fontWeight: 500,
              padding: '16px 40px',
              background: 'var(--t2-accent)', color: '#ffffff',
              textDecoration: 'none',
              transition: 'background 0.2s ease',
            }}>
              Get Connected with an Advisor
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .ytc-about-grid   { grid-template-columns: 1fr !important; }
          .ytc-team-grid    { grid-template-columns: repeat(2, 1fr) !important; }
          .ytc-pillars-grid { grid-template-columns: 1fr !important; }
          .ytc-accolades-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .ytc-team-grid    { grid-template-columns: 1fr !important; }
          .ytc-accolades-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
