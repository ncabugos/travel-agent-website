import { T2LeadForm } from '@/components/t2/T2LeadForm'
import { FindHotelClient } from '@/components/t2/FindHotelClient'
import { T2HotelProgramsGrid } from '@/components/t2/T2HotelProgramsGrid'
import { getHotelFilterOptions } from '@/lib/hotels'
import { getAgentHotelPrograms } from '@/lib/hotel-programs'
import Image from 'next/image'

interface PageProps {
  params: Promise<{ agentId: string }>
}

export const metadata = {
  title: 'Hotels | Programs & Directory',
  description: 'Browse our preferred hotel programs and search 1,795 luxury hotels worldwide with exclusive Virtuoso benefits.',
}

/**
 * Hotels landing for the T2 template.
 *
 * Two-section page (every tier):
 *   1. Hotel Programs grid — the curated partner-brand list (Aman, Belmond,
 *      Four Seasons…) with per-program detail pages for benefits/details.
 *   2. Hotel Directory — searchable individual-property finder backed by the
 *      luxury_hotels table (1,795 properties). Filters by country/vibe/brand.
 *
 * Programs land first because the page-down user mental model is "what
 * brands do you book?" before "is the specific hotel I'm thinking of
 * available?". Searchers find the directory immediately by scrolling once.
 */
export default async function BookHotelPage({ params }: PageProps) {
  const { agentId } = await params

  // Both sources fetched in parallel.
  const [programs, filterOpts] = await Promise.all([
    getAgentHotelPrograms(agentId),
    getHotelFilterOptions(),
  ])
  const { countries, vibes, brands } = filterOpts

  return (
    <>
      {/* Hero */}
      <section style={{ position: 'relative', height: 650, overflow: 'hidden' }}>
        <Image
          src="/media/hero images/four-seasons-CapFerrat-pool-hero.jpg"
          alt="Hotel Programs & Directory"
          fill
          priority
          style={{ objectFit: 'cover' }}
          sizes="100vw"
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))' }} />
        <div style={{
          position: 'relative', zIndex: 2, height: '100%',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          alignItems: 'center', textAlign: 'center', padding: '0 24px',
        }}>
          <p className="t2-label" style={{ marginBottom: 12, color: 'var(--t2-accent)' }}>Exclusive Access</p>
          <h1 className="t2-heading t2-heading-xl" style={{ color: '#FFFFFF' }}>Hotels</h1>
          <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 16, color: 'rgba(255,255,255,0.8)', maxWidth: 560, marginTop: 16 }}>
            Browse our preferred partner programs or search {`1,795`} luxury hotels worldwide —
            all bookable with complimentary breakfasts, upgrades, and exclusive Virtuoso benefits.
          </p>
        </div>
      </section>

      {/* Curated programs grid */}
      <T2HotelProgramsGrid
        agentId={agentId}
        programs={programs}
        eyebrow="Hotel Programs"
        heading="Our preferred hotel programs."
        subheading="Every program below unlocks preferred benefits — room upgrades on arrival, daily breakfast, early check-in or late check-out, and a personalised welcome — bookable only through a Virtuoso-affiliated advisor."
      />

      {/* Searchable hotel directory */}
      <section id="hotel-directory" className="t2-section" style={{ background: 'var(--t2-bg-alt, #f8f5ef)' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p className="t2-label" style={{ marginBottom: 12, color: 'var(--t2-accent)' }}>The Full Directory</p>
          <h2 className="t2-heading t2-heading-lg">Search every hotel.</h2>
          <p className="t2-body t2-body-center" style={{ marginTop: 12, maxWidth: 640, marginLeft: 'auto', marginRight: 'auto' }}>
            Looking for a specific property? Search across {countries.length}+ countries
            by destination, vibe, or brand. Every listing is bookable through us with
            partner-program benefits when applicable.
          </p>
        </div>

        <FindHotelClient
          agentId={agentId}
          countries={countries}
          vibes={vibes}
          brands={brands}
        />
      </section>

      {/* Lead Form */}
      <T2LeadForm
        heading="Plan Your Hotel Stay"
        subheading="Let us match you with the ideal property — exclusive rates, preferred amenities, and a personalised welcome."
      />
    </>
  )
}
