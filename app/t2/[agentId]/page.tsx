import { T2HeroStatic } from '@/components/t2/T2HeroStatic'
import { T2ServiceCards } from '@/components/t2/T2ServiceCards'
import { T2VirtuosoBand } from '@/components/t2/T2VirtuosoBand'
import { T2PartnerGrid } from '@/components/t2/T2PartnerGrid'
import { T2DestinationCarousel } from '@/components/t2/T2DestinationCarousel'
import { T2ExperienceGrid } from '@/components/t2/T2ExperienceGrid'
import { T2LeadForm } from '@/components/t2/T2LeadForm'
import { getAgentProfile } from '@/lib/suppliers'
import { getPropertiesDestinations, getExclusiveExperiences, getFeaturedPartners } from '@/lib/collections'
import Link from 'next/link'
import YTCHomePage from './ytc-home'

interface PageProps {
  params: Promise<{ agentId: string }>
}

export default async function T2HomePage({ params }: PageProps) {
  const { agentId } = await params

  // Route to YTC-specific homepage for Demo 3
  if (agentId === 'ytc-demo') {
    return <YTCHomePage params={params} />
  }

  const agent = await getAgentProfile(agentId)
  const [properties, experiences, partners] = await Promise.all([
    getPropertiesDestinations(),
    getExclusiveExperiences(),
    getFeaturedPartners(),
  ])

  const agencyName = agent?.agency_name ?? 'Luxury Travel'
  const base = `/t2/${agentId}`


  return (
    <>
      {/* ── Section 1: Hero ───────────────────────────────────────────────── */}
      <T2HeroStatic
        agentId={agentId}
        image="/media/hero images/four-seasons-taormina-pool-hero.jpg"
        h1="Plan Your Travel Experience with Us"
        h2="Unlock a world of VIP travel perks & unbelievable travel experiences with the best of the best in travel."
        cta1={{ label: 'View Experiences', href: '/experiences' }}
        cta2={{ label: 'Start Planning', href: '/contact' }}
      />

      {/* ── Section 2: Value Proposition ──────────────────────────────────── */}
      <section className="t2-section" style={{ textAlign: 'center' }}>
        <p className="t2-label" style={{ marginBottom: 16 }}>Why Choose Us</p>
        <h2 className="t2-heading t2-heading-lg" style={{ marginBottom: 24 }}>
          Effortless Luxury Travel Planning
        </h2>
        <p
          className="t2-body t2-body-center"
          style={{ marginBottom: 32 }}
        >
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

      {/* ── Section 3: Core Services Grid ─────────────────────────────────── */}
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

      {/* ── Section 4: Network Affiliation ────────────────────────────────── */}
      <T2VirtuosoBand agencyName={agencyName} />

      {/* ── Section 5: Featured Partners Grid ─────────────────────────────── */}
      <T2PartnerGrid partners={partners} agentId={agentId} />

      {/* ── Section 6: Destinations Carousel ──────────────────────────────── */}
      <T2DestinationCarousel properties={properties} />

      {/* ── Section 7: Exclusive Experiences ──────────────────────────────── */}
      <T2ExperienceGrid experiences={experiences} agentId={agentId} />

      {/* ── Section 8: Lead Capture Form ──────────────────────────────────── */}
      <T2LeadForm />
    </>
  )
}
