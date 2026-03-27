import { T2LeadForm } from '@/components/t2/T2LeadForm'
import { FindHotelClient } from '@/components/t2/FindHotelClient'
import { getHotelFilterOptions } from '@/lib/hotels'
import Image from 'next/image'

interface PageProps {
  params: Promise<{ agentId: string }>
}

export const metadata = {
  title: 'Find a Hotel | Luxury Hotels & Resorts',
  description: 'Search 1,795 luxury hotels worldwide with exclusive Virtuoso benefits — filters by country, vibe, and hotel type.',
}

export default async function BookHotelPage({ params }: PageProps) {
  const { agentId } = await params
  const { countries, vibes, brands } = await getHotelFilterOptions()

  return (
    <>
      {/* Hero */}
      <section style={{ position: 'relative', height: 480, overflow: 'hidden' }}>
        <Image
          src="/media/hero images/four-seasons-CapFerrat-pool-hero.jpg"
          alt="Find a Hotel"
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
          <h1 className="t2-heading t2-heading-xl" style={{ color: '#FFFFFF' }}>Find a Hotel</h1>
          <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 16, color: 'rgba(255,255,255,0.8)', maxWidth: 520, marginTop: 16 }}>
            1,795 luxury hotels in {countries.length} countries — with complimentary breakfasts,
            upgrades, and exclusive Virtuoso benefits.
          </p>
        </div>
      </section>

      {/* Hotel Search */}
      <section className="t2-section">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 className="t2-heading t2-heading-lg">Hotel Collection</h2>
          <p className="t2-body t2-body-center" style={{ marginTop: 12 }}>
            Search by destination, city, or hotel name. Filter by vibe or property type
            to find the perfect match for your next journey.
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
