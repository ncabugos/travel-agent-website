import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getCruiseCollection, getCruiseCollections } from '@/lib/cruise-itineraries'
import { getAgentProfile } from '@/lib/suppliers'
import { buildMetadata } from '@/lib/seo'
import { templatePath } from '@/lib/tenant-paths'
import { T2CollectionItineraries } from '@/components/t2/T2CruiseSections'
import { T2LeadForm } from '@/components/t2/T2LeadForm'

interface PageProps {
  params: Promise<{ agentId: string; collectionSlug: string }>
}

export async function generateStaticParams() {
  const collections = await getCruiseCollections()
  return collections.map((c) => ({ collectionSlug: c.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { agentId, collectionSlug } = await params
  const [result, agent] = await Promise.all([
    getCruiseCollection(collectionSlug, agentId),
    getAgentProfile(agentId),
  ])
  if (!result || !agent) return {}
  return buildMetadata({
    agent,
    title: result.collection.name,
    description: result.collection.intro ?? result.collection.name,
    path: `find-cruise/collections/${collectionSlug}`,
    image: result.collection.hero_image_url ?? undefined,
    imageAlt: result.collection.name,
  })
}

export default async function T2CruiseCollectionPage({ params }: PageProps) {
  const { agentId, collectionSlug } = await params
  const result = await getCruiseCollection(collectionSlug, agentId)
  if (!result) notFound()
  const { collection, itineraries } = result

  return (
    <>
      <section style={{ position: 'relative', height: 560, overflow: 'hidden' }}>
        <Image
          src={collection.hero_image_url ?? '/media/cruises/regent-seven-seas/Regent-hero-Tahiti-2500.jpg'}
          alt={collection.name}
          fill
          priority
          style={{ objectFit: 'cover' }}
          sizes="100vw"
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))' }} />
        <div
          style={{
            position: 'relative', zIndex: 2, height: '100%',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            textAlign: 'center', padding: '0 24px',
          }}
        >
          <h1 className="t2-heading t2-heading-xl" style={{ color: '#FFFFFF' }}>{collection.name}</h1>
          {collection.intro && (
            <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 16, color: 'rgba(255,255,255,0.85)', maxWidth: 560, marginTop: 16 }}>
              {collection.intro}
            </p>
          )}
        </div>
      </section>

      <T2CollectionItineraries itineraries={itineraries} base={templatePath('t2', agentId)} />

      <T2LeadForm
        agentId={agentId}
        heading="Plan Your Next Cruise"
        subheading="Tell us which itinerary and month you have in mind. We'll check availability and add every benefit we can."
      />
    </>
  )
}
