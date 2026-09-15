import { CREAM, DIVIDER, WARM_GRAY_DARK } from './tokens'

/**
 * Network row under the hero: one sentence, five monochrome marks at a
 * shared cap height. Drop a transparent PNG in public/assets/network-logos
 * to add one.
 */
const NETWORKS = [
  { name: 'Virtuoso', logo: '/assets/network-logos/virtuoso.png', height: 44 },
  { name: 'Signature Travel Network', logo: '/assets/network-logos/signature-travel-logo.png', height: 28 },
  { name: 'Ensemble', logo: '/assets/network-logos/ensemble-logo.png', height: 22 },
  { name: 'Travel Leaders', logo: '/assets/network-logos/travel-leaders-logo.png', height: 34 },
  { name: 'ASTA', logo: '/assets/network-logos/asta-logo.png', height: 40 },
]

export function MarketingNetworkBar() {
  return (
    <section aria-label="Advisor networks" style={{ background: CREAM, borderBottom: `1px solid ${DIVIDER}` }}>
      <div
        className="eah-container eah-network-row"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '32px 48px', flexWrap: 'wrap', padding: '36px 40px',
        }}
      >
        <p style={{ margin: 0, fontSize: '15px', color: WARM_GRAY_DARK, whiteSpace: 'nowrap' }}>
          Built for advisors in every network.
        </p>
        <ul role="list" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', alignItems: 'center', gap: '48px', flexWrap: 'wrap' }}>
          {NETWORKS.map((n) => (
            <li key={n.name} style={{ display: 'flex', alignItems: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={n.logo}
                alt={n.name}
                decoding="async"
                style={{ height: `${n.height}px`, width: 'auto', display: 'block', filter: 'grayscale(1) brightness(0)', opacity: 0.55 }}
              />
            </li>
          ))}
        </ul>
      </div>
      <style>{`
        @media (max-width: 640px) {
          .eah-network-row { padding: 28px 20px !important; }
          .eah-network-row ul { gap: 28px !important; }
          .eah-network-row img { transform: scale(0.8); transform-origin: left center; }
        }
      `}</style>
    </section>
  )
}
