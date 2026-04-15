import Link from 'next/link'
import { getCruiseLines } from '@/lib/cruise-lines'
import { T3PageHero } from '@/components/t3/T3PageHero'
import { T3CruiseGrid } from '@/components/t3/T3CruiseGrid'

interface PageProps {
  params: Promise<{ agentId: string }>
}

export const metadata = {
  title: 'Voyages | Meridian & Company',
  description:
    'Ocean, river, and expedition sailings with the world\'s finest cruise lines — always with advisor-only benefits on board.',
}

export default async function T3FindCruisePage({ params }: PageProps) {
  const { agentId } = await params
  const cruiseLines = await getCruiseLines()
  const base = `/t3/${agentId}`

  return (
    <>
      <T3PageHero
        image="/media/cruises/regent-seven-seas/Regent-hero-Tahiti-2500.jpg"
        imageAlt="Luxury Voyages"
        eyebrow="Voyages"
        title="Ocean, river, and expedition."
        body="The cruise lines we trust, the ones we have sailed personally, and the only way to see their ports with the access that comes from two decades of advisor relationships."
        imageCaption="Regent Seven Seas · Tahiti"
      />

      {/* Intro */}
      <section className="t3-section">
        <div
          style={{
            maxWidth: 900,
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <span className="t3-eyebrow" style={{ justifyContent: 'center' }}>
            Why Sail With Us
          </span>
          <h2 className="t3-headline-xl" style={{ marginTop: 28, marginBottom: 32 }}>
            Every voyage, with advisor benefits.
          </h2>
          <p className="t3-body t3-body-lg" style={{ marginLeft: 'auto', marginRight: 'auto', marginBottom: 56 }}>
            We are preferred partners with every major ultra-luxury and expedition line. That translates, on every booking we place, into onboard credit, included shore excursions, or category upgrades — frequently all three.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 48,
              borderTop: '1px solid var(--t3-divider)',
              paddingTop: 48,
            }}
            className="t3-cruise-stats"
          >
            {[
              { num: '14', label: 'Preferred Partners' },
              { num: '$1,500+', label: 'Typical Onboard Credit' },
              { num: '100%', label: 'Personal Knowledge' },
            ].map((s) => (
              <div key={s.label}>
                <div
                  className="t3-headline-lg"
                  style={{
                    color: 'var(--t3-accent)',
                    fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
                    marginBottom: 8,
                  }}
                >
                  {s.num}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--t3-text-muted)',
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cruise lines list */}
      <div className="t3-section-alt">
        <section className="t3-section">
          <div style={{ maxWidth: 720, marginBottom: 80 }}>
            <span className="t3-eyebrow">The Lines We Know</span>
            <h2 className="t3-headline-xl" style={{ marginTop: 28 }}>
              Cruise partners, in order of preference.
            </h2>
          </div>
        </section>
        <T3CruiseGrid agentId={agentId} cruiseLines={cruiseLines.slice(0, 6)} />
      </div>

      {/* CTA */}
      <section className="t3-section" style={{ textAlign: 'center' }}>
        <span className="t3-eyebrow" style={{ justifyContent: 'center' }}>
          Begin
        </span>
        <h2 className="t3-headline-xl" style={{ marginTop: 28, maxWidth: 720, marginLeft: 'auto', marginRight: 'auto' }}>
          Planning a voyage?
        </h2>
        <p
          className="t3-body t3-body-lg"
          style={{ marginTop: 24, marginLeft: 'auto', marginRight: 'auto', marginBottom: 48 }}
        >
          Tell us which region you&apos;re thinking about — we&apos;ll come back with the right ship, the right itinerary, and every advisor-only benefit already attached to the quote.
        </p>
        <Link href={`${base}/contact`} className="t3-btn t3-btn-solid">
          Enquire About a Voyage
        </Link>
      </section>

      <style>{`
        @media (max-width: 700px) {
          .t3-cruise-stats { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </>
  )
}
