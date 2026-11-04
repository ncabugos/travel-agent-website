import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCruiseCollection, getCruiseCollections } from '@/lib/cruise-itineraries'
import { templatePath } from '@/lib/tenant-paths'
import { T4PageHero } from '@/components/t4/T4PageHero'
import { T4CollectionItineraries } from '@/components/t4/T4CruiseSections'

interface PageProps {
  params: Promise<{ agentId: string; collectionSlug: string }>
}

export async function generateStaticParams() {
  const collections = await getCruiseCollections()
  return collections.map((c) => ({ collectionSlug: c.slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { agentId, collectionSlug } = await params
  const result = await getCruiseCollection(collectionSlug, agentId)
  if (!result) return { title: 'Not found' }
  return { title: result.collection.name, description: result.collection.intro ?? undefined }
}

export default async function T4CruiseCollectionPage({ params }: PageProps) {
  const { agentId, collectionSlug } = await params
  const result = await getCruiseCollection(collectionSlug, agentId)
  if (!result) notFound()
  const { collection, itineraries } = result
  const base = templatePath('t4', agentId)

  return (
    <>
      <T4PageHero
        image={collection.hero_image_url ?? '/media/cruises/regent-seven-seas/Regent-hero-Tahiti-2500.jpg'}
        imageAlt={collection.name}
        eyebrow="Voyages"
        title={collection.name}
        body={collection.intro ?? undefined}
      />

      <T4CollectionItineraries itineraries={itineraries} base={base} agentId={agentId} />

      <section style={{ padding: '0 48px var(--t4-section-pad)', textAlign: 'center' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h2 className="t4-headline-xl" style={{ marginBottom: 24 }}>Sail with us.</h2>
          <p className="t4-body t4-body-lg" style={{ marginBottom: 40 }}>
            Tell us which itinerary and month you have in mind. We will check availability and add every benefit we can.
          </p>
          <Link href={`${base}/contact`} className="t4-btn t4-btn-solid">
            Enquire About a Voyage
          </Link>
        </div>
      </section>
    </>
  )
}
