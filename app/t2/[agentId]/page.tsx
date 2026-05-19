import { T2HeroStatic } from '@/components/t2/T2HeroStatic'
import { T2HeroSlideshow } from '@/components/t2/T2HeroSlideshow'
import { T2ServiceCards } from '@/components/t2/T2ServiceCards'
import { T2ServiceCardsEditorial } from '@/components/t2/T2ServiceCardsEditorial'
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
import { tierAllows, type Tier } from '@/lib/tier-features'
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

interface ServiceCardCopy {
  title: string
  description: string
  image: string
  cta: { label: string; href: string }
}

interface PersonaHomeContent {
  hero: {
    image: string
    /** Optional slideshow image set. When present the persona renders a
        centered slideshow hero instead of the standard left-aligned static. */
    slideshowImages?: string[]
    eyebrow?: string
    h1: string
    h2: string
    cta1: { label: string; href: string }
    cta2: { label: string; href: string }
  }
  valueProp: {
    label: string
    heading: string
    body: string
    cta: { label: string; href: string }
  }
  serviceCards: {
    heading: string
    subheading: string
    cards: ServiceCardCopy[]
  }
  advisor: {
    photo: string
    yearsAdvising: number
    countries: number
  }
  testimonials: { quote: string; author: string; context: string }[]
}

const GENERIC_GROWTH_TESTIMONIALS = [
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

const COAST_COMPASS_CONTENT: PersonaHomeContent = {
  hero: {
    image: '/media/hero images/four-seasons-yacht-hero.jpg',
    slideshowImages: [
      '/media/hero images/four-seasons-yacht-hero.jpg',
      '/media/hero images/four-seasons-yacht-2-hero.jpg',
      '/media/hero images/four-seasons-taormina-pool-hero.jpg',
      '/media/hero images/four-seasons-astir-hero.jpg',
      '/media/hero images/four-seasons-CapFerrat-pool-hero.jpg',
    ],
    eyebrow: 'Curated Luxury Travel',
    h1: 'Effortless at sea. Considered ashore.',
    h2: 'Small-ship voyages and coastal escapes — composed for travelers who measure trips in moments, not miles.',
    cta1: { label: 'Explore Voyages', href: '/experiences' },
    cta2: { label: 'Start Planning',  href: '/plan-a-trip' },
  },
  valueProp: {
    label: 'Why Coast & Compass',
    heading: 'The Coast & Compass Distinction',
    body:
      "We chart a short list of journeys each year — small-ship voyages, private-yacht weeks, and the kind of harbor-side hotels you only hear about from someone who has stayed there. As a member of the invitation-only Virtuoso network, reserved for the top 1% of travel advisors worldwide, we hold privileged partnerships with every ship worth boarding and every coastal house worth knowing. The result is unparalleled access: the cabin held back from inventory, the captain's table reserved on the right night, the tender ashore that waits for you. We are available before, during, and after every voyage, so you can stop planning and start being somewhere.",
    cta: { label: 'Plan a Voyage', href: '/plan-a-trip' },
  },
  serviceCards: {
    heading: 'Composed voyages, curated just for you',
    subheading:
      "Whether you board a small ship in the Cyclades, a Norwegian expedition vessel, or a coastal hotel where the only schedule is the tide — every itinerary comes with Virtuoso perks and a single advisor on call from first call to last night.",
    cards: [
      {
        title: 'Small-Ship Voyages',
        description:
          'Yachts, expedition vessels, and river ships under 250 guests — paced for travelers who would rather know the captain than queue at a buffet.',
        image: '/media/cruises/regent-seven-seas/Regent-hero-Tahiti-2500.jpg',
        cta: { label: 'See Voyages', href: '/find-cruise' },
      },
      {
        title: 'Coastal Escapes',
        description:
          "Harbor-side hotels and private-island houses from the Dalmatian Coast to the Seychelles — unpack once and let the world come to you.",
        image: '/media/hero images/four-seasons-CapFerrat-pool-hero.jpg',
        cta: { label: 'Browse Hotels', href: '/book-hotel' },
      },
      {
        title: 'Expedition Sailing',
        description:
          'Antarctic peninsulas, the Galápagos at golden hour, the Inside Passage in summer — expedition voyages outfitted for guests who travel curious.',
        image: '/media/hero images/four-seasons-astir-hero.jpg',
        cta: { label: 'Find a Ship', href: '/find-cruise' },
      },
      {
        title: 'Schedule a Consultation',
        description:
          "Begin with a short, unhurried conversation. We listen for the trip you've been imagining, then come back with one composed proposal — never a catalogue.",
        image: '',
        cta: { label: 'Get in Touch', href: '/contact' },
      },
    ],
  },
  advisor: {
    photo: '/media/team/agent-isabelle-moreau.png',
    yearsAdvising: 14,
    countries: 52,
  },
  testimonials: [
    {
      quote:
        "Marin built us a fortnight in the Cyclades on a yacht of twelve. We were never once on someone else's schedule. The morning the captain woke us early because the light was right — that is a memory I will keep.",
      author: 'Eliza & Andrew P.',
      context: 'Greek Isles by Yacht, 2024',
    },
    {
      quote:
        "I have booked expedition voyages for fifteen years. This was the first time the cabin we were given was held back, not assigned. That detail alone changed the week.",
      author: 'Dr. Patrick H.',
      context: 'Antarctic Peninsula, 2024',
    },
    {
      quote:
        "Three generations, two coastal hotels, one small ship, no logistics in our inbox. Coast & Compass made it disappear, and we just lived the trip.",
      author: 'The Lindgren Family',
      context: 'Dalmatian Coast & Venice, 2023',
    },
  ],
}

const PERSONA_CONTENT: Record<string, PersonaHomeContent> = {
  'coast-compass-demo': COAST_COMPASS_CONTENT,
}

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
  const tier: Tier | null = (agent?.tier ?? null) as Tier | null
  const advisorBio =
    agent?.bio ??
    "With two decades spent inside luxury hospitality — from running guest experience at a private-island resort to opening hotels across three continents — I built this agency around the relationships and phone numbers that make extraordinary travel possible for a small group of clients each year."
  const base = `/t2/${agentId}`
  const persona = PERSONA_CONTENT[agentId]

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
      {persona?.hero.slideshowImages ? (
        <T2HeroSlideshow
          agentId={agentId}
          images={persona.hero.slideshowImages}
          eyebrow={persona.hero.eyebrow}
          h1={persona.hero.h1}
          h2={persona.hero.h2}
          cta1={persona.hero.cta1}
          cta2={persona.hero.cta2}
        />
      ) : (
        <T2HeroStatic
          agentId={agentId}
          image={persona?.hero.image ?? '/media/hero images/four-seasons-taormina-pool-hero.jpg'}
          h1={persona?.hero.h1 ?? 'Plan Your Travel Experience with Us'}
          h2={persona?.hero.h2 ?? 'Unlock a world of VIP travel perks & unbelievable travel experiences with the best of the best in travel.'}
          cta1={persona?.hero.cta1 ?? { label: 'View Experiences', href: '/experiences' }}
          cta2={persona?.hero.cta2 ?? { label: 'Start Planning', href: '/contact' }}
        />
      )}

      {/* ── 02 · Value proposition ─────────────────────────────────────── */}
      <section className="t2-section" style={{ textAlign: 'center' }}>
        <p className="t2-label" style={{ marginBottom: 16 }}>{persona?.valueProp.label ?? 'Why Choose Us'}</p>
        <h2 className="t2-heading t2-heading-lg" style={{ marginBottom: 24 }}>
          {persona?.valueProp.heading ?? 'Effortless Luxury Travel Planning'}
        </h2>
        <p className="t2-body t2-body-center" style={{ marginBottom: 32 }}>
          {persona?.valueProp.body ?? (
            <>Are you dreaming of your next adventure but feeling overwhelmed by the endless options and
            details to consider? Look no further than our team of expert travel advisors, ready to design
            your perfect trip and offer you the best value available. As proud affiliates of Virtuoso Travel,
            the world&apos;s leading luxury travel network, we have access to exclusive perks, upgrades, and
            insider knowledge that can take your trip from ordinary to extraordinary.</>
          )}
        </p>
        <Link href={`${base}${persona?.valueProp.cta.href ?? '/contact'}`} className="t2-btn t2-btn-outline">
          {persona?.valueProp.cta.label ?? 'Contact Us'}
        </Link>
      </section>

      {/* ── 03 · Service cards ─────────────────────────────────────────── */}
      {persona && agentId === 'coast-compass-demo' ? (
        <T2ServiceCardsEditorial
          agentId={agentId}
          heading={persona.serviceCards.heading}
          subheading={persona.serviceCards.subheading}
          cards={persona.serviceCards.cards}
        />
      ) : (
      <T2ServiceCards
        agentId={agentId}
        heading={persona?.serviceCards.heading ?? 'Incredible travel experiences curated for you'}
        subheading={persona?.serviceCards.subheading ?? "When you book a hotel or trip with us, you'll gain access to exclusive perks and upgrades available only to Virtuoso travelers."}
        cards={persona?.serviceCards.cards ?? [
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
            image: '',
            cta: { label: "Let's Chat", href: '/contact' },
          },
        ]}
      />
      )}

      {/* ── 04 · Advisor profile ───────────────────────────────────────── */}
      <T2AdvisorProfile
        agentId={agentId}
        fullName={advisorName}
        agencyName={agencyName}
        bio={advisorBio}
        photo={persona?.advisor.photo ?? '/media/team/agent-sarah-chen.png'}
        yearsAdvising={persona?.advisor.yearsAdvising ?? 20}
        countries={persona?.advisor.countries ?? 64}
      />

      {/* ── 05 · Virtuoso band ─────────────────────────────────────────── */}
      <T2VirtuosoBand agencyName={agencyName} />

      {/* ── 06 · Partner logos ─────────────────────────────────────────── */}
      <T2PartnerGrid partners={partners} agentId={agentId} />

      {/* ── 07 · Destinations carousel ─────────────────────────────────── */}
      <T2DestinationCarousel properties={properties} />

      {/* ── 08 · Exclusive experiences (Growth+) ───────────────────────── */}
      {tierAllows(tier, 'experiences') && (
        <T2ExperienceGrid experiences={experiences} agentId={agentId} />
      )}

      {/* ── 09 · Testimonials (Growth+) ────────────────────────────────── */}
      {tierAllows(tier, 'testimonials') && (
        <T2TestimonialsGrid testimonials={persona?.testimonials ?? GENERIC_GROWTH_TESTIMONIALS} />
      )}

      {/* ── 10 · Journal teaser ────────────────────────────────────────── */}
      <T2JournalTeaser agentId={agentId} posts={posts} />

      {/* ── 11 · Instagram feed (Growth+) ──────────────────────────────── */}
      {tierAllows(tier, 'instagram-feed') && (
        <T2InstagramFeed handle={igHandle} />
      )}

      {/* ── 12 · Lead capture ──────────────────────────────────────────── */}
      {/* T2LeadForm auto-delegates to T2LeadFormLight on Coast & Compass. */}
      <T2LeadForm />
    </>
  )
}
