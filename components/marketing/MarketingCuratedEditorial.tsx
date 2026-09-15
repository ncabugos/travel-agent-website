import Image from 'next/image'
import { Reveal } from './Reveal'
import { BODY_STYLE, CHARCOAL, CREAM, DIVIDER, H2_STYLE, LABEL_STYLE, WARM_GRAY } from './tokens'

/**
 * Homepage §6: the journal and curated editorial stream. One photograph,
 * one claim, three sample pieces in a hairline list.
 */
const SAMPLES = [
  { category: 'Destination guide', title: 'The Amalfi Coast in early October, the season you actually want to book' },
  { category: 'Hotel spotlight', title: 'Inside the Dorchester Diamond Club: what changes when you book through an advisor' },
  { category: 'Voyages', title: 'River cruising for first-timers: AMA, Avalon, or Uniworld' },
]

export function MarketingCuratedEditorial() {
  return (
    <section id="editorial" className="eah-section" style={{ background: CREAM, color: CHARCOAL, padding: '120px 0' }}>
      <div className="eah-container eah-editorial-grid" style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '64px', alignItems: 'center' }}>
        <Reveal>
          <div style={{ position: 'relative', aspectRatio: '4 / 5', background: DIVIDER }}>
            <Image
              src="/media/hotel-programs/dorchester/dorchester-hero-2000.jpg"
              alt="The Dorchester, London"
              fill
              sizes="(max-width: 900px) 100vw, 40vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </Reveal>
        <Reveal delay={100}>
          <p style={{ ...LABEL_STYLE, marginBottom: '20px' }}>Editorial</p>
          <h2 style={{ ...H2_STYLE, marginBottom: '20px', maxWidth: '16ch' }}>A journal that publishes while you travel.</h2>
          <p style={{ ...BODY_STYLE, maxWidth: '52ch', marginBottom: '40px' }}>
            Weekly destination guides, hotel spotlights, and voyage comparisons written for luxury clients, published to your site in the categories you choose. Write your own from the portal editor whenever you like.
          </p>
          <ul role="list" style={{ listStyle: 'none', margin: 0, padding: 0, borderTop: `1px solid ${DIVIDER}` }}>
            {SAMPLES.map((s) => (
              <li key={s.title} style={{ padding: '18px 0', borderBottom: `1px solid ${DIVIDER}` }}>
                <div style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: WARM_GRAY, marginBottom: '6px' }}>{s.category}</div>
                <div style={{ fontSize: '18px', lineHeight: 1.35, letterSpacing: '-0.01em' }}>{s.title}</div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .eah-editorial-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  )
}
