import { T2HeroStatic } from '@/components/t2/T2HeroStatic'
import { T2ServiceCards } from '@/components/t2/T2ServiceCards'
import { T2AdvisorProfile } from '@/components/t2/T2AdvisorProfile'
import { T2VirtuosoBand } from '@/components/t2/T2VirtuosoBand'
import { T2PartnerGrid } from '@/components/t2/T2PartnerGrid'
import { T2DestinationCarousel } from '@/components/t2/T2DestinationCarousel'
import { T2ExperienceGrid } from '@/components/t2/T2ExperienceGrid'
import { T2TestimonialsGrid } from '@/components/t2/T2TestimonialsGrid'
import { T2JournalTeaser } from '@/components/t2/T2JournalTeaser'
import { T2InstagramFeed } from '@/components/t2/T2InstagramFeed'
import { T2LeadForm } from '@/components/t2/T2LeadForm'
import { getAgentProfile } from '@/lib/suppliers'
import {
  getPropertiesDestinations,
  getExclusiveExperiences,
  getFeaturedPartners,
} from '@/lib/collections'
import { getBlogPosts } from '@/lib/blog'
import Link from 'next/link'
import YTCHomePage from './ytc-home'
import WWTHomePage from './wwt-home'

interface PageProps {
  params: Promise<{ agentId: string }>
}

// Vista is positioned as the Growth-tier demo. The section set here is the
// canonical Growth homepage composition per the tier matrix:
//   Hero → Value → Services → Advisor → Virtuoso → Partners →
//   Destinations → Experiences → Testimonials → Journal → Instagram → Lead form.
// Starter-tier T2 sites would swap Experiences/Testimonials/Instagram for
// curated Hotel Programs + Cruise Partners teasers (see T2HotelProgramsGrid,
// T2CruisePartnersGrid).

const GROWTH_TESTIMONIALS = [
  {
    quote:
      "Every detail was handled before I noticed it needed handling. The upgrade, the late check-out, the reservation that I'd been told was impossible. I will not book travel any other way again.",
    author: 'Marisa K.',
    context: 'Amalfi & Capri, 2024',
  },
  {
    quote:
      "I've worked with several 'luxury' advisors. None came close. The difference is they actually go where they send you — and it shows in every recommendation.",
    author: 'Andrew H.',
    context: 'Japan, 2024',
  },
  {
    quote:
      "We planned a multi-generational trip across three countries in four weeks. I don't know how they did it. I know the kids and grandparents were both happy. That alone is a small miracle.",
    author: 'The Whitmore Family',
    context: 'Kenya, Zanzibar, South Africa — 2023',
  },
]

export default async function T2HomePage({ params }: PageProps) {
  const { agentId } = await params

  // Route the YTC agency demo to its bespoke homepage build.
  if (agentId === 'ytc-demo') {
    return <YTCHomePage params={params} />
  }

  // Route Wine & Wellness Travel to its Aethos-inspired bespoke homepage.
  if (agentId === 'wwt-demo') {
    return <WWTHomePage params={params} />
  }

  const agent = await getAgentProfile(agentId)
  const [properties, experiences, partners, posts] = await Promise.all([
    getPropertiesDestinations(),
    getExclusiveExperiences(),
    getFeaturedPartners(),
    getBlogPosts(agentId),
  ])

  const agencyName = agent?.agency_name ?? 'Luxury Travel'
  const advisorName = agent?.full_name ?? 'John Oberacker'
  const advisorBio =
    agent?.bio ??
    "With two decades spent inside luxury hospitality — from running guest experience at a private-island resort to opening hotels across three continents — I built this agency around the relationships and phone numbers that make extraordinary travel possible for a small group of clients each year."
  const base = `/t2/${agentId}`

  // Derive a display handle from the agent's instagram_url if it's a real
  // username/url; otherwise fall back to a demo handle so the section still
  // renders cleanly.
  const igHandle = (() => {
    const raw = agent?.instagram_url?.trim() ?? ''
    const stripped = raw
      .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
      .replace(/^@/, '')
      .replace(/\/+$/, '')
      .trim()
    return /^[a-zA-Z0-9._]{1,30}$/.test(stripped) ? stripped : 'luxurytravel'
  })()

  return (
    <>
      {/* ── 01 · Hero ───────────────────────────────────────────────────── */}
      <T2HeroStatic
        agentId={agentId}
        image="/media/hero images/four-seasons-taormina-pool-hero.jpg"
        h1="Plan Your Travel Experience with Us"
        h2="Unlock a world of VIP travel perks & unbelievable travel experiences with the best of the best in travel."
        cta1={{ label: 'View Experiences', href: '/experiences' }}
        cta2={{ label: 'Start Planning', href: '/contact' }}
      />

      {/* ── 02 · Value proposition ─────────────────────────────────────── */}
      <section className="t2-section" style={{ textAlign: 'center' }}>
        <p className="t2-label" style={{ marginBottom: 16 }}>Why Choose Us</p>
        <h2 className="t2-heading t2-heading-lg" style={{ marginBottom: 24 }}>
          Effortless Luxury Travel Planning
        </h2>
        <p className="t2-body t2-body-center" style={{ marginBottom: 32 }}>
          Are you dreaming of your next adventure but feeling overwhelmed by the endless options and
          details to consider? Look no further than our team of expert travel advisors, ready to design
          your perfect trip and offer you the best value available. As proud affiliates of Virtuoso Travel,
          the world&apos;s leading luxury travel network, we have access to exclusive perks, upgrades, and
          insider knowledge that can take your trip from ordinary to extraordinary.
        </p>
        <Link href={`${base}/contact`} className="t2-btn t2-btn-outline">
          Contact Us
        </Link>
      </section>

      {/* ── 03 · Service cards ─────────────────────────────────────────── */}
      <T2ServiceCards
        agentId={agentId}
        heading="Incredible travel experiences curated for you"
        subheading="When you book a hotel or trip with us, you'll gain access to exclusive perks and upgrades available only to Virtuoso travelers."
        cards={[
          {
            title: 'Luxury Cruise',
            description: 'Sail on a luxury yacht, ocean or river cruise and indulge in exquisite cuisine, immersive shore excursions and culturally enriching activities.',
            image: '/media/cruises/regent-seven-seas/Regent-hero-Tahiti-2500.jpg',
            cta: { label: 'Explore Cruises', href: '/find-cruise' },
          },
          {
            title: 'Luxury Hotels',
            description: 'A collection of the world\'s best hotels and resorts all over the world in terms of design, architecture, location, service and quality.',
            image: '/media/hero images/four-seasons-CapFerrat-pool-hero.jpg',
            cta: { label: 'Book Hotels', href: '/book-hotel' },
          },
          {
            title: 'Luxury Villas',
            description: 'We work villa properties who are part of the Virtuoso network, handpicked and reviewed by the world\'s best travel advisors.',
            image: '/media/hero images/four-seasons-sayan-hero.jpg',
            cta: { label: 'Reserve a Villa', href: '/book-villa' },
          },
          {
            title: 'Appointments',
            description: 'Discover the world in a way you never knew was possible. Book an appointment and let\'s discuss your travel plans.',
            image: '/media/hero images/four-seasons-taormina-suite-hero.jpg',
            cta: { label: "Let's Chat", href: '/contact' },
          },
        ]}
      />

      {/* ── 04 · Advisor profile ───────────────────────────────────────── */}
      <T2AdvisorProfile
        agentId={agentId}
        fullName={advisorName}
        agencyName={agencyName}
        bio={advisorBio}
        photo="/media/team/agent-sarah-chen.png"
        yearsAdvising={20}
        countries={64}
      />

      {/* ── 05 · Virtuoso band ─────────────────────────────────────────── */}
      <T2VirtuosoBand agencyName={agencyName} />

      {/* ── 06 · Partner logos ─────────────────────────────────────────── */}
      <T2PartnerGrid partners={partners} agentId={agentId} />

      {/* ── 07 · Destinations carousel ─────────────────────────────────── */}
      <T2DestinationCarousel properties={properties} />

      {/* ── 08 · Exclusive experiences (Growth+) ───────────────────────── */}
      <T2ExperienceGrid experiences={experiences} agentId={agentId} />

      {/* ── 09 · Testimonials (Growth+) ────────────────────────────────── */}
      <T2TestimonialsGrid testimonials={GROWTH_TESTIMONIALS} />

      {/* ── 10 · Journal teaser ────────────────────────────────────────── */}
      <T2JournalTeaser agentId={agentId} posts={posts} />

      {/* ── 11 · Instagram feed (Growth+) ──────────────────────────────── */}
      <T2InstagramFeed handle={igHandle} />

      {/* ── 12 · Lead capture ──────────────────────────────────────────── */}
      <T2LeadForm />
    </>
  )
}
