import { getAgentProfile } from '@/lib/suppliers'
import { getPropertiesDestinations, getFeaturedPartners } from '@/lib/collections'
import { getAgentHotelPrograms } from '@/lib/hotel-programs'
import { getBlogPosts } from '@/lib/blog'
import { T3HeroSplit } from '@/components/t3/T3HeroSplit'
import { T3Philosophy } from '@/components/t3/T3Philosophy'
import { T3ServiceCards } from '@/components/t3/T3ServiceCards'
import { T3AdvisorProfile } from '@/components/t3/T3AdvisorProfile'
import { T3DestinationScroll } from '@/components/t3/T3DestinationScroll'
import { T3PartnerTabs } from '@/components/t3/T3PartnerTabs'
import { T3VirtuosoBand } from '@/components/t3/T3VirtuosoBand'
import { T3FullBleedFeature } from '@/components/t3/T3FullBleedFeature'
import { T3JournalTeaser } from '@/components/t3/T3JournalTeaser'
import { T3ContactSection } from '@/components/t3/T3ContactSection'

interface PageProps {
  params: Promise<{ agentId: string }>
}

export default async function T3HomePage({ params }: PageProps) {
  const { agentId } = await params

  const agent = await getAgentProfile(agentId)
  const [destinations, hotelPrograms, posts] = await Promise.all([
    getPropertiesDestinations(),
    getAgentHotelPrograms(agentId),
    getBlogPosts(agentId),
    // partners marquee data retained for now in case it's wanted later
    getFeaturedPartners(),
  ])

  const agencyName = agent?.agency_name ?? 'Meridian & Company'

  return (
    <>
      {/* ── 01 · Hero (split-screen) ────────────────────────────────────── */}
      <T3HeroSplit
        agentId={agentId}
        image="/media/hotel-programs/belmond-bellini-club/belmond-hero-2000.jpg"
        imageCaption="Belmond Hotel Cipriani · Venice"
        eyebrow="A World Beyond"
        headlineLine1="Quietly"
        headlineLine2="extraordinary."
        body="We design private journeys for travelers who know exactly what they don't want. No templated itineraries — only considered introductions to the places, stays, and people worth knowing."
        primaryCta={{ label: 'Plan a Trip', href: '/contact' }}
        secondaryCta={{ label: 'Our Philosophy', href: '#philosophy' }}
      />

      {/* ── 02 · Philosophy ─────────────────────────────────────────────── */}
      <div id="philosophy">
        <T3Philosophy
          agentId={agentId}
          eyebrow="02 — Our Approach"
          headline={`Travel, rewritten\nas something\nmore personal.`}
          body={`${agencyName} is a studio — not an agency. We begin each journey with a conversation, not a questionnaire. From there we handle every detail: the stays, the access, the small introductions that are quietly impossible without the right address book. The result is a trip that feels inevitable, as if it were always meant for you.`}
          stats={[
            { value: '22', label: 'Years Advising' },
            { value: '64', label: 'Countries' },
            { value: '1:1', label: 'Attention' },
          ]}
          ctaLabel="Read our story"
          ctaHref="/about"
        />
      </div>

      {/* ── 03 · Services (M03) ─────────────────────────────────────────── */}
      <T3ServiceCards
        agentId={agentId}
        eyebrow="03 — Services"
        heading={`How we work${'\u2014'}\nfour ways to begin.`}
        subheading="Every journey starts the same way — with a conversation. From there it becomes one of four things, depending on how you like to travel and what you're looking for this time."
        cards={[
          {
            title: 'Luxury Hotels',
            description: 'Virtuoso-preferred stays with upgrades, breakfast, and the kind of welcome that starts the moment you arrive.',
            image: '/media/hero images/four-seasons-CapFerrat-pool-hero.jpg',
            cta: { label: 'Explore Hotels', href: '/book-hotel' },
          },
          {
            title: 'Ocean & River Cruise',
            description: 'Sail with the world\u2019s finest small-ship and yacht brands — each with meaningful onboard perks for our clients.',
            image: '/media/cruises/regent-seven-seas/Regent-hero-Tahiti-2500.jpg',
            cta: { label: 'Explore Cruises', href: '/find-cruise' },
          },
          {
            title: 'Private Villas',
            description: 'Staffed homes, fincas, and estates — selected for the family who wants space without sacrificing service.',
            image: '/media/hero images/four-seasons-sayan-hero.jpg',
            cta: { label: 'Browse Villas', href: '/contact' },
          },
          {
            title: 'Bespoke Journeys',
            description: 'Tell us where you\u2019re going and we\u2019ll handle the rest \u2014 one advisor, one point of contact, one perfectly planned trip.',
            image: '/media/hero images/four-seasons-taormina-suite-hero.jpg',
            cta: { label: 'Start a Trip', href: '/contact' },
          },
        ]}
      />

      {/* ── 04 · Advisor profile ────────────────────────────────────────── */}
      <T3AdvisorProfile
        agentId={agentId}
        fullName={agent?.full_name ?? agencyName}
        agencyName={agencyName}
        bio={agent?.bio}
        eyebrow="04 — Your Advisor"
        photo="/media/team/agent-sarah-chen.png"
        photoAlt={agent?.full_name ?? agencyName}
      />

      {/* ── 05 · Virtuoso Member band ───────────────────────────────────── */}
      <T3VirtuosoBand agencyName={agencyName} />

      {/* ── 06 · Partner Programs (Hotels / Cruise tabs) ───────────────── */}
      <div className="t3-section-alt">
        <T3PartnerTabs
          agentId={agentId}
          hotelPrograms={hotelPrograms}
          eyebrow="06 — Exclusive Partnerships"
          headline="Our Partner Programs"
          body="Our Virtuoso membership unlocks preferred benefits at these world-class brands — unavailable through any other booking channel."
        />
      </div>

      {/* ── 07 · Destinations scroll ────────────────────────────────────── */}
      <T3DestinationScroll
        agentId={agentId}
        eyebrow="07 — Destinations"
        headline="The places we know best."
        body="Properties and regions we return to year after year — because the people there know us, and because nothing replaces knowing the person at the front desk."
        destinations={destinations}
      />

      {/* ── 08 · Full-bleed feature ─────────────────────────────────────── */}
      <T3FullBleedFeature
        agentId={agentId}
        image="/media/hero images/four-seasons-CapFerrat-pool-hero.jpg"
        eyebrow="08 — The Journey"
        headline="A dedicated advisor, on call from first call to last night."
        body="You work with one person from the first conversation through your return flight home. On the ground, we're a message away — always, and in every time zone."
        ctaLabel="Begin Planning"
        ctaHref="/contact"
        align="left"
      />

      {/* ── 09 · Journal teaser ─────────────────────────────────────────── */}
      <T3JournalTeaser
        agentId={agentId}
        posts={posts.map(p => ({
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt,
          cover_image_url: p.cover_image_url,
          published_at: p.published_at,
          category: p.categories[0] ?? null,
        }))}
        eyebrow="09 — Journal"
      />

      {/* ── 10 · Contact ────────────────────────────────────────────────── */}
      <T3ContactSection
        eyebrow="10 — Begin the Conversation"
        headline="Every great journey starts with a conversation."
        body="Tell us where you're dreaming of, and we'll reach out within 24 hours to discuss what's possible."
        phone={agent?.phone}
        email={agent?.email}
        address={agent?.address}
      />
    </>
  )
}
