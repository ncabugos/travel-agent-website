import { T2HeroStatic } from '@/components/t2/T2HeroStatic'
import { T2ServiceCards } from '@/components/t2/T2ServiceCards'
import { T2VirtuosoBand } from '@/components/t2/T2VirtuosoBand'
import { T2LeadForm } from '@/components/t2/T2LeadForm'
import { YTCPartnerTabs } from '@/components/t2/YTCPartnerTabs'
import { getAgentProfile } from '@/lib/suppliers'

interface PageProps {
  params: Promise<{ agentId: string }>
}

// ─── Value Pillars ────────────────────────────────────────────────────────────

const VALUES = [
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--t2-accent)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    title: 'Expert Advisors',
    body: 'Our advisors have decades of first-hand experience across every destination, category, and cruise line — so every recommendation comes from personal knowledge, not guesswork.',
  },
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--t2-accent)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 6l5 5 5-5 5 5 5-5"/><path d="M1 12l5 5 5-5 5 5 5-5"/>
      </svg>
    ),
    title: 'Immersive Experiences',
    body: 'Travel should transform you. We design journeys that go beyond the surface — private access, curated local experiences, and the moments between moments that define a great trip.',
  },
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--t2-accent)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    title: 'Transformational Journeys',
    body: 'Every journey we craft is built around a singular idea: that the right trip, planned the right way, can genuinely change how you see the world and your place in it.',
  },
]

export default async function YTCHomePage({ params }: PageProps) {
  const { agentId } = await params
  const agent = await getAgentProfile(agentId)

  const agencyName = agent?.agency_name ?? 'Your Travel Center'
  const base = `/t2/${agentId}`

  return (
    <>
      {/* ── Section 1: Hero ───────────────────────────────────────────────── */}
      <T2HeroStatic
        agentId={agentId}
        image="/media/hotel-programs/aman/aman-hero-2000.jpg"
        h1="Travel Differently with YTC"
        h2="Spokane's most experienced travel advisors — delivering VIP access, exclusive Virtuoso perks, and journeys that transform."
        cta1={{ label: 'Plan Your Trip', href: '/contact' }}
      />

      {/* ── Section 2: Core Values ────────────────────────────────────────── */}
      <section style={{ background: '#ffffff', padding: 'var(--t2-section-pad) 48px' }}>
        <div style={{ maxWidth: 'var(--t2-content-max)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p className="t2-label" style={{ marginBottom: 16 }}>A New World To Explore</p>
            <h2 className="t2-heading t2-heading-lg">How We Travel Differently</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48 }} className="ytc-values-grid">
            {VALUES.map((v) => (
              <div key={v.title} style={{ borderTop: '1px solid var(--t2-divider)', paddingTop: 36 }}>
                <div style={{ marginBottom: 24 }}>{v.icon}</div>
                <h3 style={{
                  fontFamily: 'var(--t2-font-serif)',
                  fontSize: 22,
                  fontWeight: 400,
                  color: 'var(--t2-text)',
                  marginBottom: 16,
                  letterSpacing: '-0.01em',
                }}>{v.title}</h3>
                <p style={{
                  fontFamily: 'var(--t2-font-sans)',
                  fontSize: 14,
                  lineHeight: 1.9,
                  color: 'var(--t2-text-muted)',
                  fontWeight: 300,
                }}>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Services Grid ──────────────────────────────────────── */}
      <T2ServiceCards
        agentId={agentId}
        heading="Extraordinary travel experiences curated for you"
        subheading="As a proud Virtuoso member, your travels come with exclusive perks, VIP upgrades, and insider access unavailable anywhere else."
        cards={[
          {
            title: 'Luxury Cruise',
            description: 'Sail on a luxury yacht, ocean or river cruise and indulge in exquisite cuisine, immersive shore excursions and culturally enriching experiences.',
            image: '/media/cruises/ponant/ponant-hero-2200.jpg',
            cta: { label: 'Explore Cruises', href: '/find-cruise' },
          },
          {
            title: 'Luxury Hotels',
            description: "A curated collection of the world's finest hotels — selected for their design, location, service, and the exclusive Virtuoso benefits only we can offer.",
            image: '/media/hotel-programs/aman/aman-hero-2000.jpg',
            cta: { label: 'Browse Hotels', href: '/book-hotel' },
          },
          {
            title: 'Private Villas',
            description: "Hand-picked villa properties within the Virtuoso network, personally reviewed by the world's best travel advisors for absolute privacy and luxury.",
            image: '/media/hero images/four-seasons-taormina-pool-hero.jpg',
            cta: { label: 'Reserve a Villa', href: '/book-villa' },
          },
          {
            title: 'Book a Consultation',
            description: "Discover the world in a way you never knew was possible. Schedule a consultation with one of our expert advisors and let's design your journey.",
            image: '/media/hero images/four-seasons-sayan-hero.jpg',
            cta: { label: "Let's Chat", href: '/contact' },
          },
        ]}
      />

      {/* ── Section 4: Virtuoso & Network Band ───────────────────────────── */}
      <T2VirtuosoBand agencyName={agencyName} hostAgency="Montecito Village Travel" />

      {/* ── Section 5: Partner Programs (client component for tab interactivity) */}
      <section style={{ background: '#ffffff', padding: 'var(--t2-section-pad) 48px' }}>
        <div style={{ maxWidth: 'var(--t2-content-max)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <p className="t2-label" style={{ marginBottom: 16 }}>Exclusive Partnerships</p>
            <h2 className="t2-heading t2-heading-lg">Our Partner Programs</h2>
            <p style={{
              fontFamily: 'var(--t2-font-sans)', fontSize: 15, lineHeight: 1.9,
              color: 'var(--t2-text-muted)', fontWeight: 300,
              maxWidth: 580, margin: '16px auto 0',
            }}>
              Our Virtuoso membership unlocks preferred benefits at these world-class brands — unavailable through any other booking channel.
            </p>
          </div>
          <YTCPartnerTabs base={base} />
        </div>
      </section>

      {/* ── Section 6: Testimonial ────────────────────────────────────────── */}
      <section style={{ background: 'var(--t2-bg-alt)', padding: 'var(--t2-section-pad) 48px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <svg style={{ marginBottom: 32, opacity: 0.3 }} width="40" height="28" viewBox="0 0 40 28" fill="var(--t2-text)">
            <path d="M0 28V17.067C0 7.68 6.267 2.027 18.8 0l1.6 3.2C13.6 4.8 9.867 7.76 9.067 12.267H16V28H0zm24 0V17.067C24 7.68 30.267 2.027 42.8 0l1.6 3.2C37.6 4.8 33.867 7.76 33.067 12.267H40V28H24z"/>
          </svg>
          <blockquote style={{
            fontFamily: 'var(--t2-font-serif)',
            fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
            fontWeight: 300,
            fontStyle: 'italic',
            lineHeight: 1.6,
            color: 'var(--t2-text)',
            marginBottom: 32,
          }}>
            &ldquo;The attention to detail was impeccable — from the moment our flights were booked to the private transfers and hotel amenities. YTC genuinely cares about making every trip extraordinary.&rdquo;
          </blockquote>
          <p style={{
            fontFamily: 'var(--t2-font-sans)',
            fontSize: 11,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--t2-text-muted)',
          }}>— Alexander Wilson, Client since 2018</p>
        </div>
      </section>

      {/* ── Section 7: Lead Capture Form ──────────────────────────────────── */}
      <T2LeadForm
        heading="Ready to Begin?"
        subheading="Tell us where you want to go and we'll design the trip of a lifetime — with exclusive VIP access only available through YTC."
      />

      <style>{`
        .ytc-partner-cell:hover .ytc-partner-logo {
          opacity: 1 !important;
          filter: grayscale(0%) !important;
        }
        @media (max-width: 900px) {
          .ytc-values-grid { grid-template-columns: 1fr !important; }
          .ytc-partner-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .ytc-partner-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
