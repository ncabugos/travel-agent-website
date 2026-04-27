import { T2HeroStatic } from '@/components/t2/T2HeroStatic'
import { T2ServiceCards } from '@/components/t2/T2ServiceCards'
import { T2VirtuosoBand } from '@/components/t2/T2VirtuosoBand'
import { T2LeadForm } from '@/components/t2/T2LeadForm'
import { T2AdvisorsDirectory } from '@/components/t2/T2AdvisorsDirectory'
import { T2TestimonialsGrid } from '@/components/t2/T2TestimonialsGrid'
import { T2JournalTeaser } from '@/components/t2/T2JournalTeaser'
import { T2InstagramFeed } from '@/components/t2/T2InstagramFeed'
import { YTCPartnerTabs } from '@/components/t2/YTCPartnerTabs'
import { getAgentProfile } from '@/lib/suppliers'
import { getAgencyAdvisors } from '@/lib/agency-advisors'
import { getBlogPosts } from '@/lib/blog'

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

const YTC_TESTIMONIALS = [
  {
    quote:
      "The attention to detail was impeccable — from the moment our flights were booked to the private transfers and hotel amenities. YTC genuinely cares about making every trip extraordinary.",
    author: 'Alexander Wilson',
    context: 'Client since 2018',
  },
  {
    quote:
      "We've worked with three different advisors at YTC over the years and every one has been a specialist in something we needed. It is how a good agency is supposed to feel.",
    author: 'Catherine & Paul M.',
    context: 'Japan, Safari, Amalfi — 2021–2024',
  },
  {
    quote:
      "Yuki planned the most extraordinary two weeks in Kyoto and Osaka. Private temple tours, tea ceremonies at a private home, a kaiseki dinner I still think about. Worth every penny.",
    author: 'Daniel R.',
    context: 'Japan, Spring 2024',
  },
]

export default async function YTCHomePage({ params }: PageProps) {
  const { agentId } = await params
  const [agent, advisors, posts] = await Promise.all([
    getAgentProfile(agentId),
    getAgencyAdvisors(agentId),
    getBlogPosts(agentId),
  ])

  const agencyName = agent?.agency_name ?? 'Your Travel Center'
  const base = `/t2/${agentId}`
  const igHandle = (() => {
    const raw = agent?.instagram_url?.trim() ?? ''
    const stripped = raw
      .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
      .replace(/^@/, '')
      .replace(/\/+$/, '')
      .trim()
    return /^[a-zA-Z0-9._]{1,30}$/.test(stripped) ? stripped : 'yourtravelcenter'
  })()

  return (
    <>
      {/* ── 01 · Hero ───────────────────────────────────────────────────── */}
      <T2HeroStatic
        agentId={agentId}
        image="/media/hotel-programs/aman/aman-hero-2000.jpg"
        h1="Travel Differently with YTC"
        h2="Spokane's most experienced travel advisors — delivering VIP access, exclusive Virtuoso perks, and journeys that transform."
        cta1={{ label: 'Meet Our Advisors', href: '/advisors' }}
        cta2={{ label: 'Plan Your Trip', href: '/contact' }}
      />

      {/* ── 02 · Core values ────────────────────────────────────────────── */}
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

      {/* ── 03 · Services grid ──────────────────────────────────────────── */}
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

      {/* ── 04 · Advisors team (Agency tier) ────────────────────────────── */}
      <T2AdvisorsDirectory
        agentId={agentId}
        advisors={advisors}
        eyebrow="Meet Our Advisors"
        heading="A specialist for every kind of trip."
        subheading="Six advisors, each with a region or product they know better than anyone. You'll be matched with the right one from your first call."
        teaser
      />

      {/* ── 05 · Virtuoso band ──────────────────────────────────────────── */}
      <T2VirtuosoBand agencyName={agencyName} hostAgency="Montecito Village Travel" />

      {/* ── 06 · Partner programs ───────────────────────────────────────── */}
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

      {/* ── 07 · Testimonials ───────────────────────────────────────────── */}
      <T2TestimonialsGrid
        eyebrow="What Our Clients Say"
        heading="In their words."
        testimonials={YTC_TESTIMONIALS}
      />

      {/* ── 08 · Journal teaser ─────────────────────────────────────────── */}
      <T2JournalTeaser agentId={agentId} posts={posts} />

      {/* ── 09 · Instagram feed ─────────────────────────────────────────── */}
      <T2InstagramFeed handle={igHandle} />

      {/* ── 10 · Lead capture ──────────────────────────────────────────── */}
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
