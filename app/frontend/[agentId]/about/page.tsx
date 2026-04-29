import Image from 'next/image'
import Link from 'next/link'
import { getAgentProfile } from '@/lib/suppliers'
import { getAgentHotelPrograms } from '@/lib/hotel-programs'
import { ProgramLogoGrid } from '@/components/hotel-programs/ProgramLogoGrid'
import { VideoEmbed } from '@/components/ui/VideoEmbed'
import { notFound } from 'next/navigation'
import { EDEN, HOTEL_GALLERY } from '@/lib/media-library'
import { tenantBase } from '@/lib/tenant-paths'

interface PageProps {
  params: Promise<{ agentId: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { agentId } = await params
  const agent = await getAgentProfile(agentId)
  if (!agent) return { title: 'About' }
  const { buildMetadata, getSeoFacts } = await import('@/lib/seo')
  const facts = getSeoFacts(agent)
  const isEden = agent.id === '2e18df43-171a-4565-b840-aade259cab69'
  return buildMetadata({
    agent,
    title: isEden ? 'About John Oberacker & Team' : `About ${agent.agency_name}`,
    description: isEden
      ? 'Meet the Virtuoso advisors of Eden For Your World — John Oberacker, Kasra Esteghamat & team. 20+ years, 80+ countries, Condé Nast Top Specialists.'
      : facts.brandDescriptionLong,
    path: 'about',
    image: '/media/hotel-programs/peninsula/peninsula-brand-hero-2000.jpg',
    imageAlt: `About ${agent.agency_name}`,
    ogTitle: `About ${agent.agency_name} — Virtuoso Luxury Travel Advisors`,
  })
}

const serif = 'var(--font-serif)'
const sans  = 'var(--font-sans)'

const TEAM = [
  {
    name: 'John Oberacker',
    title: 'Travel Expert',
    phone: '(562) 856-8603',
    bio: 'Condé Nast Top Travel Specialist for 2024 & 2025. With 20+ years crafting extraordinary journeys across 80+ countries, John brings unrivalled access and expertise to every itinerary.',
    image: '/media/eden/team/john-oberacker-badge.jpg',
    instagram: 'https://www.instagram.com/edenforyourworld/',
    facebook: 'https://www.facebook.com/edenforyourworld',
    email: 'john@edenforyourworld.com',
  },
  {
    name: 'Kasra Esteghamat',
    title: 'Travel Expert',
    phone: '(562) 856-8603',
    bio: 'Kasra\'s passion for travel has taken him across six continents. His deep relationships with luxury properties worldwide ensure his clients receive an unmatched level of personalised service.',
    image: '/media/eden/team/kasra-e.jpg',
    instagram: 'https://www.instagram.com/edenforyourworld/',
    facebook: 'https://www.facebook.com/edenforyourworld',
    email: 'kasra@edenforyourworld.com',
  },
  {
    name: 'Jill Robbins',
    title: 'Travel Expert',
    phone: '(562) 856-8603',
    bio: 'Jill is passionate about connecting clients with experiences that reflect their unique sense of adventure. From European river cruises to remote island escapes, she crafts journeys that resonate deeply.',
    image: '/media/eden/team/JILL-Robins-800x1000.jpg',
    instagram: 'https://www.instagram.com/edenforyourworld/',
    facebook: 'https://www.facebook.com/edenforyourworld',
    email: 'jill@edenforyourworld.com',
  },
  {
    name: 'Dianna Cooper',
    title: 'Travel Expert',
    phone: '(562) 209-3781',
    bio: 'Born and raised in Southern California, Dianna has had the fortune of exploring many beautiful destinations around the globe — all of which have created memories she won\'t soon forget.',
    image: '/media/eden/team/dianna-cooper-virtuoso-800x1000-700x875.jpg',
    instagram: 'https://www.instagram.com/edenforyourworld/',
    facebook: 'https://www.facebook.com/edenforyourworld',
    email: 'dianna@edenforyourworld.com',
  },
  {
    name: 'Kim Diaz',
    title: 'Travel Expert',
    phone: '(714) 322-2423',
    bio: 'After graduating from college and spending a summer backpacking through Europe, Kim learned a couple things… there are so many beautiful places beckoning for us to visit, and meeting new people and hearing about their lives, eating their food, drinking their spirits, brings new meaning to "breaking bread".',
    image: '/media/eden/team/KIM-Diaz-800x1000-700x875.jpg',
    instagram: 'https://www.instagram.com/edenforyourworld/',
    facebook: 'https://www.facebook.com/edenforyourworld',
    email: 'kim@edenforyourworld.com',
  },
  {
    name: 'Erin Ross',
    title: 'Travel Expert',
    phone: '(562) 277-3999',
    bio: 'My love for adventure started young, exploring my home state of California and our National Parks with my family. Growing up my mother became a travel advisor and through her I learned how much there is to experience in the world! I am passionate about helping others make their dream trips come true.',
    image: '/media/eden/team/ErinRoss-800x1000-1-700x875.jpg',
    instagram: 'https://www.instagram.com/edenforyourworld/',
    email: 'erin@edenforyourworld.com',
  },
  {
    name: 'Kelly Daoud',
    title: 'Travel Expert',
    phone: '(562) 856-8603',
    bio: 'Kelly\'s love of travel was ignited by her first trip overseas and has never stopped. She brings thoughtful, personalised service to every client engagement, ensuring seamless travel experiences from start to finish.',
    image: '/media/eden/team/kellyDoud-700x875.jpg',
    instagram: 'https://www.instagram.com/edenforyourworld/',
    facebook: 'https://www.facebook.com/edenforyourworld',
    email: 'kelly@edenforyourworld.com',
  },
]



/* ─── Social icon helpers ─── */
function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}
function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}
function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
    </svg>
  )
}
function PhoneIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.49 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.4 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.7a16 16 0 0 0 6.29 6.29l.8-.79a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

export default async function AboutPage({ params }: PageProps) {
  const { agentId } = await params

  const [agent, programs, base] = await Promise.all([
    getAgentProfile(agentId),
    getAgentHotelPrograms(agentId),
    tenantBase(agentId),
  ])

  if (!agent) notFound()

  return (
    <main style={{ background: '#FAFAF8' }}>

      {/* ─── HERO ─── */}
      <div style={{ position: 'relative', height: '55vh', minHeight: '380px', overflow: 'hidden' }}>
        <Image
          src={HOTEL_GALLERY['peninsula-pen-club'][1] ?? HOTEL_GALLERY['peninsula-pen-club'][0]}
          alt="About Eden"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center 60%' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(30,25,20,0.42)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(2.4rem, 5vw, 4rem)', fontWeight: 300, color: '#fff', letterSpacing: '0.01em' }}>
            About Eden
          </h1>
        </div>
      </div>

      {/* ─── OUR STORY ─── */}
      <section style={{ padding: '80px 24px 72px', maxWidth: '860px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: serif, fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, color: '#1a1a1a', marginBottom: '18px' }}>
          Our Story
        </h2>
        <div style={{ width: '48px', height: '1px', background: '#b5945a', marginBottom: '32px' }} />
        <p style={{ fontFamily: sans, fontSize: '15px', lineHeight: '1.85', color: '#444', marginBottom: '20px' }}>
          John Oberacker and Kasra Esteghamat have been successful business partners for over 20 years. Their honesty and dedication has yielded them a large and loyal client base, and their energy and loyalty has produced a community of unlimited resources around the world. Their boutique luxury travel agency, Eden For Your World, is a natural extension of their passion for travel, and of their desire to share a lifetime of experiences with others around the globe.
        </p>
        <p style={{ fontFamily: sans, fontSize: '15px', lineHeight: '1.85', color: '#444', marginBottom: '20px' }}>
          John and Kasra are uniquely qualified to help their clients plan the perfect travel adventure because they are avid travelers themselves. From South America to Africa and everything in between, John and Kasra have personally experienced what makes for an enriching travel journey. They have visited 80+ countries, and have had a variety of spectacular experiences that they love to share with their clients. With John and Kasra's expertise, you can trust that the entire team at Eden has your best interests in mind with every detail they arrange.
        </p>
        <p style={{ fontFamily: sans, fontSize: '15px', lineHeight: '1.85', color: '#444', marginBottom: '40px' }}>
          Eden For Your World's goal is to reveal that Eden exists wherever you are… if you just have the right expert to help you find it.
        </p>
        <Link
          href={`${base}/contact`}
          style={{
            display: 'inline-block',
            padding: '14px 36px',
            background: 'linear-gradient(135deg, #b5945a, #c9a96e)',
            color: '#fff',
            fontFamily: sans,
            fontSize: '10px',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            borderRadius: '2px',
          }}
        >
          Start Planning
        </Link>
      </section>

      {/* ─── TEAM ─── */}
      <section style={{ padding: '72px 24px 80px', background: '#F5F4F0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, color: '#1a1a1a', textAlign: 'center', marginBottom: '60px' }}>
            Our Team
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '56px 40px' }}>
            {TEAM.map(member => (
              <div key={member.name}>
                {/* Photo */}
                <div style={{ position: 'relative', width: '100%', paddingBottom: '110%', overflow: 'hidden', marginBottom: '20px', background: '#d8d5cf' }}>
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: 'cover', objectPosition: 'top' }}
                  />
                </div>
                {/* Info */}
                <h3 style={{ fontFamily: serif, fontSize: '22px', fontWeight: 400, color: '#1a1a1a', marginBottom: '4px' }}>
                  {member.name}
                </h3>
                <p style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#b5945a', marginBottom: '10px', fontWeight: 600 }}>
                  {member.title}
                </p>
                <div style={{ width: '36px', height: '1px', background: '#ccc', marginBottom: '18px' }} />

                {/* Phone */}
                <p style={{ fontFamily: sans, fontSize: '14px', color: '#333', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <PhoneIcon /> {member.phone}
                </p>

                {/* Bio */}
                <p style={{ fontFamily: sans, fontSize: '14px', lineHeight: '1.82', color: '#555', marginBottom: '20px' }}>
                  {member.bio}
                </p>

                {/* Social icons */}
                <div style={{ display: 'flex', gap: '14px', color: '#444' }}>
                  {member.instagram && (
                    <a href={member.instagram} target="_blank" rel="noopener" className="social-link">
                      <InstagramIcon />
                    </a>
                  )}
                  {member.facebook && (
                    <a href={member.facebook} target="_blank" rel="noopener" className="social-link">
                      <FacebookIcon />
                    </a>
                  )}
                  {member.email && (
                    <a href={`mailto:${member.email}`} className="social-link">
                      <MailIcon />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VIRTUOSO + VIDEO ─── */}
      <section style={{ padding: '80px 24px', maxWidth: '1160px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '72px', alignItems: 'center' }} className="virtuoso-grid">
          {/* Left — Virtuoso copy */}
          <div>
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)', fontWeight: 300, color: '#1a1a1a', lineHeight: 1.35, marginBottom: '20px' }}>
              Eden for Your World is a proud member of the Virtuoso Travel Network
            </h2>
            <div style={{ width: '40px', height: '1px', background: '#b5945a', marginBottom: '24px' }} />
            <p style={{ fontFamily: sans, fontSize: '14px', lineHeight: '1.85', color: '#555', marginBottom: '28px' }}>
              Virtuoso is the leading international luxury travel network, connecting discerning travellers with the world's finest hotels, cruise lines, tour operators, and more. As a Virtuoso agency, Eden For Your World has access to exclusive amenities, upgrades, and perks that independent agencies simply cannot match.
            </p>
            <div style={{ marginTop: '12px' }}>
              <Image
                src={EDEN.virtuoso}
                alt="Virtuoso Member"
                width={160}
                height={72}
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>

          {/* Right — YouTube embed */}
          <VideoEmbed
            youtubeId="ctwHnGhZCik"
            posterSrc={EDEN.youtubeBg}
            posterAlt="Eden For Your World — Luxury Travel"
            aspectRatio="4/5"
          />
        </div>
      </section>

      {/* ─── WHAT THIS MEANS FOR OUR CLIENTS ─── */}
      <section style={{ padding: '60px 24px 80px', background: '#F5F4F0' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 300, color: '#1a1a1a', textAlign: 'center', marginBottom: '56px' }}>
            What this Means for Our Clients
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }} className="benefits-grid">
            {[
              {
                image: EDEN.destinationsCard,
                title: 'Special Experiences',
                desc: 'VIP recognition and behind the scenes access to unique travel opportunities.',
              },
              {
                image: EDEN.hotelsCard,
                title: 'Hotel & Resort Benefits',
                desc: 'Preferred rates, room upgrades, and exclusive Virtuoso amenities like early check-in/checkout and daily breakfast for two at select properties.',
              },
              {
                image: EDEN.cruisesCard,
                title: 'Cruising Benefits',
                desc: 'Special perks for your time at sea, including shipboard credit, exclusive shore excursions and dedicated onboard hosts.',
              },
            ].map(item => (
              <div key={item.title}>
                <div style={{ position: 'relative', width: '100%', paddingBottom: '75%', overflow: 'hidden', marginBottom: '24px' }}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <h3 style={{ fontFamily: serif, fontSize: 'clamp(1.2rem, 2vw, 1.6rem)', fontWeight: 300, color: '#1a1a1a', marginBottom: '14px' }}>
                  {item.title}
                </h3>
                <div style={{ width: '32px', height: '1px', background: '#aaa', marginBottom: '14px' }} />
                <p style={{ fontFamily: sans, fontSize: '14px', lineHeight: '1.8', color: '#555' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── EXCLUSIVE HOTEL PROGRAMS ─── */}
      <section style={{ padding: '72px 24px 80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '48px' }}>
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 300, color: '#1a1a1a', marginBottom: '16px' }}>
              Exclusive Hotel Programs
            </h2>
            <div style={{ width: '48px', height: '1px', background: '#b5945a', marginBottom: '16px' }} />
            <p style={{ fontFamily: sans, fontSize: '14px', color: '#777', maxWidth: '540px', lineHeight: '1.8' }}>
              Click any programme to see the full list of benefits available to our clients.
            </p>
          </div>
          <ProgramLogoGrid programs={programs} agentId={agentId} base={base} />
        </div>
      </section>

      {/* Responsive overrides */}
      <style>{`
        .social-link {
          color: #444;
          transition: color 0.2s;
          text-decoration: none;
        }
        .social-link:hover {
          color: #b5945a;
        }
        @media (max-width: 900px) {
          .virtuoso-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .benefits-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .benefits-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </main>
  )
}
