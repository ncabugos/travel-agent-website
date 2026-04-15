import { getAgentProfile } from '@/lib/suppliers'
import {
  getPropertiesDestinations,
  getExclusiveExperiences,
  getFeaturedPartners,
} from '@/lib/collections'
import { T3HeroSplit } from '@/components/t3/T3HeroSplit'
import { T3Philosophy } from '@/components/t3/T3Philosophy'
import { T3ExperienceEditorial } from '@/components/t3/T3ExperienceEditorial'
import { T3DestinationScroll } from '@/components/t3/T3DestinationScroll'
import { T3PartnerMarquee } from '@/components/t3/T3PartnerMarquee'
import { T3FullBleedFeature } from '@/components/t3/T3FullBleedFeature'
import { T3ContactSection } from '@/components/t3/T3ContactSection'

interface PageProps {
  params: Promise<{ agentId: string }>
}

export default async function T3HomePage({ params }: PageProps) {
  const { agentId } = await params

  const agent = await getAgentProfile(agentId)
  const [destinations, experiences, partners] = await Promise.all([
    getPropertiesDestinations(),
    getExclusiveExperiences(),
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

      {/* ── 03 · Curated Experiences ────────────────────────────────────── */}
      <T3ExperienceEditorial
        agentId={agentId}
        eyebrow="03 — Curated Experiences"
        headline="Signature journeys, quietly arranged."
        subheading="A hand-selected collection of our most requested itineraries. Each is fully private and shaped entirely around you."
        experiences={experiences}
      />

      {/* ── 04 · Destinations scroll ────────────────────────────────────── */}
      <T3DestinationScroll
        agentId={agentId}
        eyebrow="04 — Destinations"
        headline="The places we know best."
        body="Properties and regions we return to year after year — because the people there know us, and because nothing replaces knowing the person at the front desk."
        destinations={destinations}
      />

      {/* ── 05 · Full-bleed feature ─────────────────────────────────────── */}
      <T3FullBleedFeature
        agentId={agentId}
        image="/media/hero images/four-seasons-CapFerrat-pool-hero.jpg"
        eyebrow="05 — The Journey"
        headline="A dedicated advisor, on call from first call to last night."
        body="You work with one person from the first conversation through your return flight home. On the ground, we're a message away — always, and in every time zone."
        ctaLabel="Begin Planning"
        ctaHref="/contact"
        align="left"
      />

      {/* ── 06 · Partner network ────────────────────────────────────────── */}
      <T3PartnerMarquee
        eyebrow="06 — Our Network"
        headline="Partnerships that open doors."
        body="We are longstanding members of the world's most selective travel networks. That access translates, for our guests, into complimentary upgrades, on-property credits, and the kind of welcome you can't book online."
        partners={partners}
      />

      {/* ── 07 · Contact ────────────────────────────────────────────────── */}
      <T3ContactSection
        eyebrow="07 — Begin the Conversation"
        headline="Every great journey starts with a conversation."
        body="Tell us where you're dreaming of, and we'll reach out within 24 hours to discuss what's possible."
        phone={agent?.phone}
        email={agent?.email}
        address={agent?.address}
      />
    </>
  )
}
