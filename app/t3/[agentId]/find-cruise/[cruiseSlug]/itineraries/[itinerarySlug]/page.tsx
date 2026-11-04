import Link from 'next/link'
import { notFound } from 'next/navigation'
import { DEFAULT_CRUISE_BENEFITS, getCruiseLine } from '@/lib/cruise-lines'
import { getCruiseItinerary, getItineraryPageParams, getSailingShips } from '@/lib/cruise-itineraries'
import { templatePath } from '@/lib/tenant-paths'
import { T3PageHero } from '@/components/t3/T3PageHero'
import { T3ItineraryDetail, T3MoreItineraries } from '@/components/t3/T3ItineraryDetail'

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

export async function generateMetadata({ params }: PageProps) {
  const { agentId, cruiseSlug, itinerarySlug } = await params
  const data = await load(cruiseSlug, itinerarySlug, agentId)
  if (!data) return { title: 'Not found' }
  return {
    title: `${data.itinerary.name} by ${data.line.name}`,
    description: data.itinerary.overview ?? data.itinerary.blurb ?? undefined,
  }
}

export default async function T3CruiseItineraryPage({ params }: PageProps) {
  const { agentId, cruiseSlug, itinerarySlug } = await params
  const data = await load(cruiseSlug, itinerarySlug, agentId)
  if (!data) notFound()
  const { line, itinerary, departures } = data
  const benefits = line.benefits?.length ? line.benefits : DEFAULT_CRUISE_BENEFITS

  return (
    <>
      <T3PageHero
        image={itinerary.image_url ?? line.hero_image_url ?? '/media/cruises/regent-seven-seas/Regent-hero-Tahiti-2500.jpg'}
        imageAlt={itinerary.name}
        eyebrow={line.name}
        title={itinerary.name}
      />

      <T3ItineraryDetail
        line={line}
        itinerary={itinerary}
        departures={departures}
        ships={getSailingShips(line.ships, departures)}
        benefits={benefits}
      />

      <section className="t3-section" style={{ textAlign: 'center' }}>
        <h2 className="t3-headline-xl" style={{ marginBottom: 24 }}>Ask about this cruise</h2>
        <p className="t3-body t3-body-lg" style={{ marginLeft: 'auto', marginRight: 'auto', marginBottom: 40 }}>
          Tell us which {itinerary.name} sailing you have in mind. We&apos;ll check availability and add every benefit we can.
        </p>
        <Link href={`${templatePath('t3', agentId)}/contact`} className="t3-btn t3-btn-solid">
          Enquire About This Cruise
        </Link>
      </section>

      <T3MoreItineraries agentId={agentId} line={line} currentSlug={itinerary.slug} />
    </>
  )
}
