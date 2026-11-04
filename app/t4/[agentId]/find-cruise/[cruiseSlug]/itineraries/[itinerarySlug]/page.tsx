import Link from 'next/link'
import { notFound } from 'next/navigation'
import { DEFAULT_CRUISE_BENEFITS, getCruiseLine } from '@/lib/cruise-lines'
import { getCruiseItinerary, getItineraryPageParams, getSailingShips } from '@/lib/cruise-itineraries'
import { templatePath } from '@/lib/tenant-paths'
import { T4PageHero } from '@/components/t4/T4PageHero'
import { T4ItineraryDetail, T4MoreItineraries } from '@/components/t4/T4ItineraryDetail'

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

export default async function T4CruiseItineraryPage({ params }: PageProps) {
  const { agentId, cruiseSlug, itinerarySlug } = await params
  const data = await load(cruiseSlug, itinerarySlug, agentId)
  if (!data) notFound()
  const { line, itinerary, departures } = data
  const benefits = line.benefits?.length ? line.benefits : DEFAULT_CRUISE_BENEFITS

  return (
    <>
      <T4PageHero
        image={itinerary.image_url ?? line.hero_image_url ?? '/media/cruises/regent-seven-seas/Regent-hero-Tahiti-2500.jpg'}
        imageAlt={itinerary.name}
        eyebrow={line.name}
        title={itinerary.name}
      />

      <T4ItineraryDetail
        line={line}
        itinerary={itinerary}
        departures={departures}
        ships={getSailingShips(line.ships, departures)}
        benefits={benefits}
      />

      <section style={{ padding: 'var(--t4-section-pad) 48px 0', textAlign: 'center' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h2 className="t4-headline-xl" style={{ marginBottom: 24 }}>Ask about this cruise</h2>
          <p className="t4-body t4-body-lg" style={{ marginBottom: 40 }}>
            Tell us which {itinerary.name} sailing you have in mind. We&apos;ll check availability and add every benefit we can.
          </p>
          <Link href={`${templatePath('t4', agentId)}/contact`} className="t4-btn t4-btn-solid">
            Enquire About This Cruise
          </Link>
        </div>
      </section>

      <T4MoreItineraries agentId={agentId} line={line} currentSlug={itinerary.slug} />
      <div style={{ height: 'var(--t4-section-pad)' }} />

    </>
  )
}
