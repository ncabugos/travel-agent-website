import { getAgentProfile } from '@/lib/suppliers'
import { getPropertiesDestinations } from '@/lib/collections'
import { getHotelPrograms } from '@/lib/hotel-programs'
import { getBlogPosts } from '@/lib/blog'
import { T4Hero } from '@/components/t4/T4Hero'
import { T4Manifesto } from '@/components/t4/T4Manifesto'
import { T4AdvisorProfile } from '@/components/t4/T4AdvisorProfile'
import { T4VirtuosoBand } from '@/components/t4/T4VirtuosoBand'
import { T4PartnerTabs } from '@/components/t4/T4PartnerTabs'
import { T4HotelProgramsGrid } from '@/components/t4/T4HotelProgramsGrid'
import { T4DestinationGallery } from '@/components/t4/T4DestinationGallery'
import { T4TestimonialsRow } from '@/components/t4/T4TestimonialsRow'
import { T4JournalTeaser } from '@/components/t4/T4JournalTeaser'
import { T4InstagramFeed } from '@/components/t4/T4InstagramFeed'
import { T4ContactSection } from '@/components/t4/T4ContactSection'

interface PageProps {
  params: Promise<{ agentId: string }>
}

const TESTIMONIALS = [
  {
    quote:
      'There was no moment, in three weeks across five properties, when we were made to feel like guests negotiating a stay. Every door was already open.',
    author: 'Eleanor R.',
    context: 'Italy · Spring 2025',
  },
  {
    quote:
      'They arranged an afternoon with a potter in a tiny village in Umbria that I could not have found in a decade of looking. That is the whole argument for working with them.',
    author: 'David M.',
    context: 'Umbria · Autumn 2024',
  },
  {
    quote:
      "I have worked with Virtuoso advisors for twenty years. Casa Solis is the first I've known that writes you letters before the trip. Actual letters.",
    author: 'The Ashton Family',
    context: 'Japan · 2024',
  },
]

export default async function T4HomePage({ params }: PageProps) {
  const { agentId } = await params

  const [agent, destinations, programs, posts] = await Promise.all([
    getAgentProfile(agentId),
    getPropertiesDestinations(),
    getHotelPrograms(),
    getBlogPosts(agentId),
  ])

  const agencyName = agent?.agency_name ?? 'Casa Solis'
  const advisorName = agent?.full_name ?? 'Alessandra Ricci'
  const advisorBio =
    agent?.bio ??
    'Alessandra founded Casa Solis in 2011 after fifteen years as a private concierge for a small number of European families. She plans every trip personally, writes every client by hand before departure, and answers the phone on Sundays without apology.'

  // Build a bespoke destination list from the collection
  const destinationGallery = (destinations || []).slice(0, 5).map((d) => ({
    name: d.name,
    subtitle: d.location,
    image: d.image_gallery?.[0] ?? '/media/hero images/four-seasons-CapFerrat-pool-hero.jpg',
  }))

  return (
    <>
      {/* ── 01 · Hero ─────────────────────────────────────────────────── */}
      <T4Hero
        agentId={agentId}
        image="/media/hotel-programs/belmond-bellini-club/belmond-cap-1500.jpg"
        imageCaption="Belmond · Cap Ferrat"
        eyebrow="A House of Travel"
        headline={'Slowly, and\nquietly, arranged.'}
        body="For two decades, Casa Solis has designed travel for a small number of families who value restraint as much as refinement — and who measure a trip in conversation, not logistics."
        primaryCta={{ label: 'Begin a Journey', href: '/contact' }}
        secondaryCta={{ label: 'Our Philosophy', href: '#philosophy' }}
      />

      {/* ── 02 · Manifesto / Philosophy ──────────────────────────────── */}
      <div id="philosophy">
        <T4Manifesto
          agentId={agentId}
          eyebrow="The House"
          headline={'We plan few trips.\nWe plan them entirely.'}
          body="Casa Solis takes on a small number of clients each year. Every journey is planned by the advisor you first speak to, and it is that same person who answers your call from a bad connection in a remote village, at any hour, across any time zone. We are not a travel company with advisors. We are a small group of advisors, with a shared philosophy about how the world ought to be travelled."
          signature="— Alessandra Ricci, Founder"
          ctaLabel="Read the Atelier"
          ctaHref="/atelier"
          image="/media/hotel-programs/aman/aman-hero-2000.jpg"
          imageCaption="The Studio · Solferino"
        />
      </div>

      {/* ── 03 · Advisor profile ─────────────────────────────────────── */}
      <T4AdvisorProfile
        agentId={agentId}
        fullName={advisorName}
        agencyName={agencyName}
        bio={advisorBio}
        photo="/media/team/agent-sarah-chen.png"
        signatureQuote="Every trip I plan, I plan as if it were my own last three weeks off in a decade."
      />

      {/* ── 04 · Virtuoso band ───────────────────────────────────────── */}
      <T4VirtuosoBand agencyName={agencyName} />

      {/* ── 05 · Partner tabs ────────────────────────────────────────── */}
      <T4PartnerTabs
        agentId={agentId}
        hotelPrograms={programs}
      />

      {/* ── 06 · Hotel programs (editorial rows) ────────────────────── */}
      <T4HotelProgramsGrid
        agentId={agentId}
        programs={programs}
        eyebrow="The Programs"
        heading="Four houses, known by name."
        body="These are the programs we know not just by brand, but by general manager, head sommelier, and turn-down concierge. Here are four we return to most."
        limit={4}
      />

      {/* ── 07 · Destinations gallery ────────────────────────────────── */}
      {destinationGallery.length > 0 && (
        <T4DestinationGallery
          eyebrow="The Regions"
          headline="Places we know, and keep returning to."
          body="Because the best advice comes from the advisor who was there this year — not from a brochure, and not from the last trip report in the company database."
          destinations={destinationGallery}
        />
      )}

      {/* ── 08 · Testimonials ────────────────────────────────────────── */}
      <T4TestimonialsRow testimonials={TESTIMONIALS} />

      {/* ── 09 · Journal ─────────────────────────────────────────────── */}
      <T4JournalTeaser agentId={agentId} posts={posts} />

      {/* ── 10 · Instagram ───────────────────────────────────────────── */}
      <T4InstagramFeed handle="casasolis" />

      {/* ── 11 · Contact ─────────────────────────────────────────────── */}
      <T4ContactSection
        agentId={agentId}
        phone={agent?.phone}
        email={agent?.email}
        address={agent?.address}
      />
    </>
  )
}
