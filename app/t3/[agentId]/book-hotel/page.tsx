import Link from 'next/link'
import { getSupplierProducts } from '@/lib/collections'
import { T3PageHero } from '@/components/t3/T3PageHero'
import { T3ProductGrid } from '@/components/t3/T3ProductGrid'

interface PageProps {
  params: Promise<{ agentId: string }>
}

export const metadata = {
  title: 'Hotels & Resorts | Meridian & Company',
  description:
    'Preferred-partner access at the world\'s most selective hotels — with amenities arranged directly by your advisor.',
}

export default async function T3BookHotelPage({ params }: PageProps) {
  const { agentId } = await params
  const hotels = await getSupplierProducts('hotel')
  const base = `/t3/${agentId}`

  return (
    <>
      <T3PageHero
        image="/media/hero images/four-seasons-CapFerrat-pool-hero.jpg"
        imageAlt="Hotels & Resorts"
        eyebrow="Hotels"
        title="A quieter list."
        body="We do not work with every hotel brand. The ones below are the ones where our relationships still matter — where we can pick up the phone, ask for a favour, and have it happen."
        imageCaption="Four Seasons Grand-Hôtel du Cap-Ferrat"
      />

      {/* Intro band */}
      <section className="t3-section">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.4fr',
            gap: 96,
            paddingTop: 24,
          }}
          className="t3-hotel-intro"
        >
          <div>
            <span className="t3-eyebrow">Our Approach</span>
            <h2 className="t3-headline-xl" style={{ marginTop: 32 }}>
              What we arrange, on every stay.
            </h2>
          </div>
          <div>
            <p className="t3-body t3-body-lg" style={{ marginBottom: 32 }}>
              Booking through Meridian is not about a discount. It is about the quiet privileges that transform a good stay into a memorable one — the upgrade you didn&apos;t ask for, the hand-written note at turn-down, the sommelier who happens to stop by your table with an off-menu pairing.
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 24,
                borderTop: '1px solid var(--t3-divider)',
                paddingTop: 32,
              }}
              className="t3-hotel-perks"
            >
              {[
                { label: 'Room upgrade', detail: 'On arrival, when available' },
                { label: 'Breakfast', detail: 'Daily, for two' },
                { label: 'Property credit', detail: '$100 or more, per stay' },
                { label: 'Welcome amenity', detail: 'Often a hand-picked gesture' },
                { label: 'Check-in & check-out', detail: 'Early and late, when possible' },
                { label: 'VIP recognition', detail: 'Noted on every reservation' },
              ].map((p) => (
                <div key={p.label}>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 500,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: 'var(--t3-accent)',
                      marginBottom: 6,
                    }}
                  >
                    {p.label}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--t3-text-muted)', lineHeight: 1.5 }}>
                    {p.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hotel programs grid */}
      <div className="t3-section-alt">
        <T3ProductGrid
          agentId={agentId}
          products={hotels}
          eyebrow="The Collection"
          headline="Our preferred hotel programs."
          subheading="Each of the collections below is a program we are on a first-name basis with. Every booking we place comes with direct amenities — arranged by us, on your behalf."
        />
      </div>

      {/* CTA */}
      <section className="t3-section" style={{ textAlign: 'center' }}>
        <span className="t3-eyebrow" style={{ justifyContent: 'center' }}>
          Begin
        </span>
        <h2 className="t3-headline-xl" style={{ marginTop: 28, maxWidth: 720, marginLeft: 'auto', marginRight: 'auto' }}>
          Tell us where you&apos;d like to stay.
        </h2>
        <p
          className="t3-body t3-body-lg"
          style={{ marginTop: 24, marginLeft: 'auto', marginRight: 'auto', marginBottom: 48 }}
        >
          We will find the right property, negotiate the right rate, and arrange the quiet privileges that make a stay memorable.
        </p>
        <Link href={`${base}/contact`} className="t3-btn t3-btn-solid">
          Enquire Now
        </Link>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .t3-hotel-intro { grid-template-columns: 1fr !important; gap: 40px !important; }
          .t3-hotel-perks { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
