import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCruiseCollection, getCruiseCollections } from '@/lib/cruise-itineraries'
import { templatePath } from '@/lib/tenant-paths'
import { T3PageHero } from '@/components/t3/T3PageHero'
import { T3CollectionItineraries } from '@/components/t3/T3CruiseSections'

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

export default async function T3CruiseCollectionPage({ params }: PageProps) {
  const { agentId, collectionSlug } = await params
  const result = await getCruiseCollection(collectionSlug, agentId)
  if (!result) notFound()
  const { collection, itineraries } = result
  const base = templatePath('t3', agentId)

  return (
    <>
      <T3PageHero
        image={collection.hero_image_url ?? '/media/cruises/regent-seven-seas/Regent-hero-Tahiti-2500.jpg'}
        imageAlt={collection.name}
        eyebrow="Cruises"
        title={collection.name}
        body={collection.intro ?? undefined}
      />

      <T3CollectionItineraries itineraries={itineraries} base={base} agentId={agentId} />

      <section className="t3-section" style={{ textAlign: 'center' }}>
        <h2 className="t3-headline-xl" style={{ marginBottom: 24 }}>Plan a voyage with us.</h2>
        <p className="t3-body t3-body-lg" style={{ marginLeft: 'auto', marginRight: 'auto', marginBottom: 40 }}>
          Tell us which itinerary and month you have in mind. We&apos;ll check availability and add every benefit we can.
        </p>
        <Link href={`${base}/contact`} className="t3-btn t3-btn-solid">
          Enquire About a Voyage
        </Link>
      </section>
    </>
  )
}
