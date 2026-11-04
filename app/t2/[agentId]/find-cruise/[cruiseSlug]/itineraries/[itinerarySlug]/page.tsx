import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { DEFAULT_CRUISE_BENEFITS, getCruiseLine } from '@/lib/cruise-lines'
import { getCruiseItinerary, getItineraryPageParams, getSailingShips } from '@/lib/cruise-itineraries'
import { getAgentProfile } from '@/lib/suppliers'
import { buildMetadata } from '@/lib/seo'
import { T2ItineraryDetail, T2MoreItineraries } from '@/components/t2/T2ItineraryDetail'
import { T2LeadForm } from '@/components/t2/T2LeadForm'

interface PageProps {
  params: Promise<{ agentId: string; cruiseSlug: string; itinerarySlug: string }>
}

export async function generateStaticParams() {
  return getItineraryPageParams()
}

async function load(cruiseSlug: string, itinerarySlug: string, agentId: string) {
  const line = await getCruiseLine(cruiseSlug, agentId)
  if (!line) return null
  const result = await getCruiseItinerary(line.id, itinerarySlug, agentId)
  return result ? { line, ...result } : null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { agentId, cruiseSlug, itinerarySlug } = await params
  const [data, agent] = await Promise.all([load(cruiseSlug, itinerarySlug, agentId), getAgentProfile(agentId)])
  if (!data || !agent) return {}
  return buildMetadata({
    agent,
    title: `${data.itinerary.name} by ${data.line.name}`,
    description: data.itinerary.overview ?? data.itinerary.blurb ?? data.itinerary.name,
    path: `find-cruise/${cruiseSlug}/itineraries/${itinerarySlug}`,
    image: data.itinerary.image_url ?? undefined,
    imageAlt: data.itinerary.name,
  })
}

export default async function T2CruiseItineraryPage({ params }: PageProps) {
  const { agentId, cruiseSlug, itinerarySlug } = await params
  const data = await load(cruiseSlug, itinerarySlug, agentId)
  if (!data) notFound()
  const { line, itinerary, departures } = data
  const benefits = line.benefits?.length ? line.benefits : DEFAULT_CRUISE_BENEFITS

  return (
    <>
      <section style={{ position: 'relative', height: 560, overflow: 'hidden' }}>
        <Image
          src={itinerary.image_url ?? line.hero_image_url ?? '/media/cruises/regent-seven-seas/Regent-hero-Tahiti-2500.jpg'}
          alt={itinerary.name}
          fill
          priority
          style={{ objectFit: 'cover' }}
          sizes="100vw"
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.55))' }} />
        <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 24px' }}>
          <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 16, color: 'rgba(255,255,255,0.9)', margin: '0 0 12px' }}>{line.name}</p>
          <h1 className="t2-heading t2-heading-xl" style={{ color: '#FFFFFF' }}>{itinerary.name}</h1>
        </div>
      </section>

      <T2ItineraryDetail
        line={line}
        itinerary={itinerary}
        departures={departures}
        ships={getSailingShips(line.ships, departures)}
        benefits={benefits}
      />

      <T2LeadForm
        agentId={agentId}
        heading="Ask about this cruise"
        subheading={`Tell us which ${itinerary.name} sailing you have in mind. We'll check availability and add every benefit we can.`}
      />

      <T2MoreItineraries agentId={agentId} line={line} currentSlug={itinerary.slug} />
    </>
  )
}
