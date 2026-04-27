import { T2ServiceCards } from '@/components/t2/T2ServiceCards'
import { T2AdvisorProfile } from '@/components/t2/T2AdvisorProfile'
import { T2VirtuosoBand } from '@/components/t2/T2VirtuosoBand'
import { T2TestimonialsGrid } from '@/components/t2/T2TestimonialsGrid'
import { T2JournalTeaser } from '@/components/t2/T2JournalTeaser'
import { T2InstagramFeed } from '@/components/t2/T2InstagramFeed'
import { WWTLeadForm } from '@/components/t2/wwt/WWTLeadForm'
import { WWTHero } from '@/components/t2/wwt/WWTHero'
import { WWTPhilosophy } from '@/components/t2/wwt/WWTPhilosophy'
import { WWTFeatureBand } from '@/components/t2/wwt/WWTFeatureBand'
import { WWTDestinationsGrid } from '@/components/t2/wwt/WWTDestinationsGrid'
import { WWTWellnessRow } from '@/components/t2/wwt/WWTWellnessRow'
import { WWTPartnerLogoWall } from '@/components/t2/wwt/WWTPartnerLogoWall'
import { getAgentProfile } from '@/lib/suppliers'
import { getBlogPosts } from '@/lib/blog'
import { HOTEL_LOGOS } from '@/lib/media-library'

interface PageProps {
  params: Promise<{ agentId: string }>
}

// ─── Aethos-style testimonials (wine + wellness tone) ─────────────────────────

const WWT_TESTIMONIALS = [
  {
    quote:
      "A farmhouse in the Langhe. Dinner in a working cellar with the man who made the bottle. A lunch that ran into evening. Nothing we could have booked ourselves.",
    author: 'Claudia & Mark B.',
    context: 'Piemonte, October 2024',
  },
  {
    quote:
      "Six mornings. A single yoga class at sunrise. A room that smelled faintly of bergamot. I needed to disappear, and I did.",
    author: 'Nicole P.',
    context: 'Tuscany, 2024',
  },
  {
    quote:
      "The itinerary read like a letter someone had written for us. A small château here, a market morning there. Never crowded. Never rushed.",
    author: 'The Archer Family',
    context: 'Bordeaux, Spring 2024',
  },
]

// ─── Wine Regions of the World (six featured) ────────────────────────────────

const WWT_WINE_REGIONS = [
  {
    label: 'Tuscany',
    region: 'Italy',
    image: '/media/hotel-programs/como-hotels/Como-hero-tuscany-2200.jpg',
    href: '/contact',
  },
  {
    label: 'Bordeaux',
    region: 'France',
    image: '/media/hotel-programs/belmond-bellini-club/belmond-cap-1500.jpg',
    href: '/contact',
  },
  {
    label: 'Napa & Sonoma',
    region: 'California',
    image: '/media/hotel-programs/auberge-resorts/auberge-hero-2000.jpg',
    href: '/contact',
  },
  {
    label: 'Provence',
    region: 'France',
    image: '/media/hero images/four-seasons-CapFerrat_garden-hero.jpg',
    href: '/contact',
  },
  {
    label: 'Piemonte',
    region: 'Italy',
    image: '/media/hero images/four-seasons-taormina-pool-hero.jpg',
    href: '/contact',
  },
  {
    label: 'Mendoza',
    region: 'Argentina',
    image: '/media/hotel-programs/belmond-bellini-club/belmond-copacabana-1500.jpg',
    href: '/contact',
  },
]

// ─── Preferred Partners — 9-logo wall ────────────────────────────────────────

const WWT_PARTNERS = [
  { name: 'Four Seasons Preferred Partner', logo: HOTEL_LOGOS.fourSeasonsPreferred,  href: '/book-hotel/four-seasons-preferred-partner' },
  { name: 'Aman',                           logo: HOTEL_LOGOS.aman,                  href: '/book-hotel/aman-hotels-and-resorts' },
  { name: 'Belmond Bellini Club',           logo: HOTEL_LOGOS.belmondBelliniClub,    href: '/book-hotel/belmond-bellini-club' },
  { name: 'Rosewood Elite',                 logo: HOTEL_LOGOS.rosewoodElite,         href: '/book-hotel/rosewood-elite' },
  { name: 'Auberge Resorts',                logo: HOTEL_LOGOS.aubergeResorts,        href: '/book-hotel/auberge-resorts-collection' },
  { name: 'COMO Hotels',                    logo: HOTEL_LOGOS.comoHotels,            href: '/book-hotel/como-hotels' },
  { name: 'Hyatt Privé',                    logo: HOTEL_LOGOS.hyattPrive,            href: '/book-hotel/hyatt-prive' },
  { name: 'Mandarin Oriental Fan Club',     logo: HOTEL_LOGOS.mandarinFanClub,       href: '/book-hotel/mandarin-oriental-fan-club' },
  { name: 'Ritz-Carlton Stars',             logo: HOTEL_LOGOS.ritzCarltonStars,      href: '/book-hotel/ritz-carlton-stars' },
  { name: 'Dorchester Diamond Club',        logo: HOTEL_LOGOS.dorchesterDiamondClub, href: '/book-hotel/dorchester-diamond-club' },
  { name: 'Peninsula PenClub',              logo: HOTEL_LOGOS.peninsulaPenClub,      href: '/book-hotel/peninsula-pen-club' },
  { name: 'Rocco Forte Hotels',             logo: HOTEL_LOGOS.roccoForte,            href: '/book-hotel/rocco-forte-hotels' },
  { name: 'Shangri-La Luxury Circle',       logo: HOTEL_LOGOS.shangriLaLuxuryCircle, href: '/book-hotel/shangri-la-hotels-the-luxury-circle' },
  { name: 'Montage International',          logo: HOTEL_LOGOS.montage,               href: '/book-hotel/montage-hotels' },
  { name: 'Oetker Pearl Partner',           logo: HOTEL_LOGOS.oetkerPearl,           href: '/book-hotel/oetker-hotel-collection-pearl-partner' },
]

// ─── Wellness row items ───────────────────────────────────────────────────────

const WWT_WELLNESS = [
  {
    title: 'Dawn in the forest',
    description:
      'An old-growth path. A single guide. A silence you had forgotten was possible. Mornings arranged for the traveller who came to remember.',
    image: '/media/hotel-programs/aman/aman-featured-1500.jpg',
  },
  {
    title: 'Dinner in the cellar',
    description:
      'A long table beneath the barrels. The winemaker pouring from bottle to glass. A menu drawn from the village. Conversation that runs until the candles are low.',
    image: '/media/hotel-programs/belmond-bellini-club/belmond-slider-1-1500.jpg',
  },
  {
    title: 'Water, heat, stone',
    description:
      'Geothermal springs in Tuscany. Mineral pools in the Dolomites. Cedar banyas above the Carpathians. The oldest form of wellness. Paired with houses that understand it.',
    image: '/media/hotel-programs/six-senses/Six_Senses-Featured Slider 2 1500.jpg',
  },
  {
    title: 'An Ayurvedic week',
    description:
      'A clinic in Kerala. A consultation on the first morning, a routine by the second. The room faces the garden. You arrive and you exhale.',
    image: '/media/hotel-programs/six-senses/Six_Senses-Featured Slider 3 1500.jpg',
  },
  {
    title: 'At the chef\u2019s table',
    description:
      'Market at dawn. A regional technique learned in a home kitchen. An evening at a table no concierge could book. Food as the way in.',
    image: '/media/hotel-programs/como-hotels/COMO-hotels-1500-1.jpg',
  },
  {
    title: 'A week by the sea',
    description:
      'A villa with its own cove. A chef on your hours. A boat at sunrise, if you ask. Nothing, if you don\u2019t. For the traveller whose itinerary is to have none.',
    image: '/media/hotel-programs/auberge-resorts/auberge-resorts-Featured Slider 4 1500.jpg',
  },
]

export default async function WWTHomePage({ params }: PageProps) {
  const { agentId } = await params

  const [agent, posts] = await Promise.all([
    getAgentProfile(agentId),
    getBlogPosts(agentId),
  ])

  const agencyName = agent?.agency_name ?? 'Wine & Wellness Travel'
  const advisorName = agent?.full_name ?? 'Your Advisor'
  const advisorBio =
    agent?.bio ??
    'Your placeholder bio.'

  const igHandle = (() => {
    const raw = agent?.instagram_url?.trim() ?? ''
    const stripped = raw
      .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
      .replace(/^@/, '')
      .replace(/\/+$/, '')
      .trim()
    return /^[a-zA-Z0-9._]{1,30}$/.test(stripped) ? stripped : 'lesbourgeoistravel'
  })()

  return (
    <>
      {/* ── 01 · Hero — full-bleed parallax with headline reveal ──────────── */}
      <WWTHero
        agentId={agentId}
        image="/media/hotel-programs/como-hotels/Como-hero-tuscany-2200.jpg"
        eyebrow="Wine country & wellness, by hand"
        headline="Poured slowly. Lived fully."
        body="A small travel advisory for the great wine regions and the quiet houses beyond them. Vineyard mornings. Dinners in the cellar. Long lunches that do not end."
        cta1={{ label: 'Begin with a note', href: '/contact' }}
        cta2={{ label: 'The approach', href: '/experiences' }}
      />

      {/* ── 02 · Philosophy — editorial intro ────────────────────────────── */}
      <WWTPhilosophy
        eyebrow="The approach"
        headline="Unhurried places. Honest hours."
        body={[
          "The best trips are not the most full. They are the most felt. A longer table. A slower morning. A wine you would not have found, poured by the hand that made it.",
          "We plan in partnership with Montecito Village Travel and Virtuoso \u2014 which means the right telephone number for the right suite, the amenity that never appears online, and a single person on your side from the first note to the last evening.",
        ]}
        image="/media/hotel-programs/belmond-bellini-club/bel-cam-first-light-mallorca02_960x1198.jpg"
        imageAlt="First light over a working countryside estate"
      />

      {/* ── 03 · Services — four pillars ─────────────────────────────────── */}
      <T2ServiceCards
        agentId={agentId}
        heading="Four ways in."
        subheading="One standard of care. A single point of contact from the first conversation to the last evening."
        cards={[
          {
            title: 'Wine Country',
            description:
              'Estates in Tuscany. Ch\u00e2teaux in Bordeaux. Farmhouses in the Langhe. Paired with the vigneron, the cellar, and the table that has kept them going for a century.',
            image: '/media/hotel-programs/belmond-bellini-club/belmond-slider-1-1500.jpg',
            cta: { label: 'Wine country', href: '/book-hotel' },
          },
          {
            title: 'Wellness Houses',
            description:
              'The quiet houses \u2014 Aman, COMO, Six Senses \u2014 and the longer programmes beyond them. We plan the retreat, the travel days, and the return to real life.',
            image: '/media/hotel-programs/six-senses/Six_Senses-Featured Slider 2 1500.jpg',
            cta: { label: 'Wellness', href: '/experiences' },
          },
          {
            title: 'A Villa of Your Own',
            description:
              'Hand-vetted houses across Tuscany, Provence, the Amalfi and Hawaii. A chef when you want one. A concierge already in the village. Designed for families, reunions and long sabbaticals.',
            image: '/media/hero images/four-seasons-taormina-pool-hero.jpg',
            cta: { label: 'Private villas', href: '/book-villa' },
          },
          {
            title: 'Slow Water',
            description:
              'River journeys through French and Italian wine country. Small-ship ocean voyages with a host who knows every port by name. Booked with the quiet perks of Virtuoso.',
            image: '/media/cruises/regent-seven-seas/Regent-hero-Tahiti-2500.jpg',
            cta: { label: 'By water', href: '/find-cruise' },
          },
        ]}
      />

      {/* ── 04 · Advisor profile ─────────────────────────────────────────── */}
      <T2AdvisorProfile
        agentId={agentId}
        fullName={advisorName}
        agencyName={agencyName}
        bio={advisorBio}
        photo="/media/team/agent-isabelle-moreau.png"
        yearsAdvising={15}
        countries={48}
      />

      {/* ── 05 · Virtuoso band ───────────────────────────────────────────── */}
      <T2VirtuosoBand agencyName={agencyName} hostAgency="Montecito Village Travel" />

      {/* ── 06 · Experiences full-bleed band (cinematic feature) ──────────── */}
      <WWTFeatureBand
        agentId={agentId}
        eyebrow="The unhurried route"
        headline="Travel, at the pace it was meant for."
        body="Every itinerary begins with a single question — how do you want to return home? From there: the region, the house, the table, the evening. Not a package. A plan, made by hand."
        cta={{ label: 'Begin a conversation', href: '/contact' }}
        image="/media/hero images/four-seasons-CapFerrat-pool-hero.jpg"
        fullBleed
      />

      {/* ── 07 · Preferred partners — 9-logo wall ────────────────────────── */}
      <WWTPartnerLogoWall
        agentId={agentId}
        eyebrow="The houses we know"
        headline="Preferred partners."
        body="Our membership in Virtuoso and a handful of invitation-only programmes unlocks daily breakfast, upgrades and property credits at the houses below. Unavailable through any other channel."
        items={WWT_PARTNERS}
      />

      {/* ── 08 · Wine Regions of the World ───────────────────────────────── */}
      <WWTDestinationsGrid
        agentId={agentId}
        eyebrow="The vineyards we know"
        headline="Six regions. A lifetime of harvests."
        body="For each, a reason we return — a vigneron, a cellar door, a village table, a window in the harvest. When you travel with us, that network becomes yours."
        items={WWT_WINE_REGIONS}
      />

      {/* ── 09 · Wellness horizontal row ─────────────────────────────────── */}
      <WWTWellnessRow
        eyebrow="Slow rituals"
        headline="Rituals, not resorts."
        body="A short list of the practices we build into almost every journey — not add-ons, but often the reason for the trip itself."
        items={WWT_WELLNESS}
      />

      {/* ── 10 · Testimonials ────────────────────────────────────────────── */}
      <T2TestimonialsGrid
        eyebrow="From the correspondence"
        heading="Notes from the road."
        testimonials={WWT_TESTIMONIALS}
      />

      {/* ── 11 · Journal teaser (Growth feature) ─────────────────────────── */}
      <div id="journal">
        <T2JournalTeaser agentId={agentId} posts={posts} />
      </div>

      {/* ── 12 · Instagram feed (Growth feature) ─────────────────────────── */}
      <T2InstagramFeed handle={igHandle} />

      {/* ── 13 · Lead form — Aethos-inspired linear design ───────────────── */}
      <WWTLeadForm
        eyebrow="A first conversation"
        heading="Begin with a sentence."
        body="Not a destination. A mood. A season. A wine you were handed once. Send us a note and we will write back."
        contactEmail={agent?.email ?? 'hello@wineandwellnesstravel.com'}
        contactPhone={agent?.phone && agent.phone !== '+1 (000) 000-0000' ? agent.phone : undefined}
      />
    </>
  )
}
