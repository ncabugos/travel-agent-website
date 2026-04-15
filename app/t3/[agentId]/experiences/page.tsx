import Link from 'next/link'
import { getSupplierProducts } from '@/lib/collections'
import { T3PageHero } from '@/components/t3/T3PageHero'
import { T3ProductGrid } from '@/components/t3/T3ProductGrid'

interface PageProps {
  params: Promise<{ agentId: string }>
}

export default async function T3ExperiencesPage({ params }: PageProps) {
  const { agentId } = await params
  const products = await getSupplierProducts()
  const base = `/t3/${agentId}`

  // Group by category for editorial presentation
  const experiences = products.filter((p) => p.category === 'experience')
  const cruises = products.filter((p) => p.category === 'cruise')
  const hotels = products.filter((p) => p.category === 'hotel').slice(0, 4)

  return (
    <>
      <T3PageHero
        image="/media/hotel-programs/four-seasons/fs-MAU_1261_original.jpg"
        imageAlt="Curated Experiences"
        eyebrow="Experiences"
        title="The full collection."
        body="Every journey we curate, every property we send clients to, every voyage we recommend — brought together in one quiet catalogue."
      />

      {experiences.length > 0 && (
        <T3ProductGrid
          agentId={agentId}
          products={experiences}
          eyebrow="01 — Private Journeys"
          headline="Bespoke itineraries, built for one."
          subheading="Multi-day journeys designed entirely for you. No set departures, no groups, no compromises — only a private itinerary, guided by people we trust personally in each destination."
        />
      )}

      <div className="t3-section-alt">
        {cruises.length > 0 && (
          <T3ProductGrid
            agentId={agentId}
            products={cruises}
            eyebrow="02 — Voyages"
            headline="Ultra-luxury at sea."
            subheading="Ocean, river, and expedition sailings with our preferred cruise partners — always with advisor-only benefits on board."
          />
        )}
      </div>

      {hotels.length > 0 && (
        <T3ProductGrid
          agentId={agentId}
          products={hotels}
          eyebrow="03 — Hotel Programs"
          headline="The stays we know by heart."
          subheading="Preferred-partner programs with the world's most selective hotel collections — each with direct amenities we arrange on your behalf."
        />
      )}

      {/* CTA */}
      <section className="t3-section-dark" style={{ padding: 'var(--t3-section-pad) 48px' }}>
        <div
          style={{
            maxWidth: 880,
            margin: '0 auto',
            textAlign: 'center',
            color: 'var(--t3-dark-text)',
          }}
        >
          <span className="t3-eyebrow t3-eyebrow-dark" style={{ justifyContent: 'center' }}>
            Begin
          </span>
          <h2 className="t3-headline-xl" style={{ marginTop: 28, color: 'var(--t3-dark-text)' }}>
            None of this is bookable online.
          </h2>
          <p
            className="t3-body t3-body-lg t3-body-dark"
            style={{ marginTop: 24, marginLeft: 'auto', marginRight: 'auto', marginBottom: 40 }}
          >
            Every experience on this page is arranged directly through your advisor. Reach out and we&apos;ll build your trip around the pieces that matter most to you.
          </p>
          <Link href={`${base}/plan-a-trip`} className="t3-btn t3-btn-solid-light">
            Plan Your Trip
          </Link>
        </div>
      </section>
    </>
  )
}
