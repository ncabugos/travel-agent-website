import { T2LeadForm } from '@/components/t2/T2LeadForm'
import { FindVillaClient } from '@/components/t2/FindVillaClient'
import { getAllVillas, getVillaCountries } from '@/lib/villas'
import Image from 'next/image'

interface PageProps {
  params: Promise<{ agentId: string }>
}

export const metadata = {
  title: 'Book a Private Villa | Luxury Retreats',
  description: 'Browse handpicked luxury villas worldwide — filter by country, bedrooms, and price.',
}

export default async function BookVillaPage({ params }: PageProps) {
  const { agentId } = await params
  const [villas, countries] = await Promise.all([
    getAllVillas(),
    getVillaCountries(),
  ])

  return (
    <>
      {/* Hero */}
      <section style={{ position: 'relative', height: 480, overflow: 'hidden' }}>
        <Image
          src="/media/hero images/four-seasons-taormina-suite-hero.jpg"
          alt="Book a Private Villa"
          fill
          priority
          style={{ objectFit: 'cover' }}
          sizes="100vw"
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))' }} />
        <div style={{
          position: 'relative', zIndex: 2, height: '100%',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          textAlign: 'center', padding: '0 24px',
        }}>
          <p className="t2-label" style={{ marginBottom: 12, color: 'var(--t2-accent)' }}>Private Retreats</p>
          <h1 className="t2-heading t2-heading-xl" style={{ color: '#FFFFFF' }}>Find Your Villa</h1>
          <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 16, color: 'rgba(255,255,255,0.8)', maxWidth: 520, marginTop: 16 }}>
            {villas.length}+ handpicked luxury villas across {countries.length} countries.
            Reviewed and recommended by your personal travel advisor.
          </p>
        </div>
      </section>

      {/* Villa Search */}
      <section className="t2-section">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 className="t2-heading t2-heading-lg">Villa Collection</h2>
          <p className="t2-body t2-body-center" style={{ marginTop: 12 }}>
            From Caribbean beachfront estates to Tuscan countryside retreats.
            Filter by destination and size to find your perfect getaway.
          </p>
        </div>

        <FindVillaClient
          agentId={agentId}
          villas={villas}
          countries={countries}
        />
      </section>

      {/* Lead Form */}
      <T2LeadForm
        heading="Plan Your Villa Stay"
        subheading="Tell us about your ideal villa — destination, dates, group size — and we'll curate the perfect private retreat."
      />
    </>
  )
}
