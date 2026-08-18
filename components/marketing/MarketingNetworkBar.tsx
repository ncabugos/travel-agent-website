/**
 * Network logo bar — sits directly under the hero.
 *
 * Authority markers within the first two screenfuls. Logos render
 * monochrome (CSS filter) at a fixed cap height so mixed brand palettes read
 * as one quiet row. Any network without a file yet falls back to a serif
 * wordmark; drop a transparent PNG/SVG at `public/assets/network-logos/<slug>.png`
 * and set `logo` to switch it over.
 */
interface Network {
  name: string
  /** Path under /public. Omit to render the wordmark fallback. */
  logo?: string
  /** Rendered height in px (logos differ in aspect; tune per mark). */
  height?: number
}

const NETWORKS: Network[] = [
  { name: 'Virtuoso', logo: '/assets/network-logos/virtuoso.png', height: 64 },
  { name: 'Travel Leaders', logo: '/assets/network-logos/travel-leaders-logo.png', height: 46 },
  { name: 'Signature Travel Network', logo: '/assets/network-logos/signature-travel-logo.png', height: 38 },
  { name: 'Ensemble', logo: '/assets/network-logos/ensemble-logo.png', height: 28 },
  { name: 'ASTA', logo: '/assets/network-logos/asta-logo.png', height: 54 },
]

export function MarketingNetworkBar() {
  return (
    <section
      aria-label="Advisor networks"
      style={{
        padding: '56px 24px',
        background: 'linear-gradient(180deg, #0f172a 0%, #111a2e 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{
          margin: '0 0 32px',
          fontSize: '12px', fontWeight: 600, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)',
        }}>
          Advisors from top networks trust us
        </p>
        <ul
          className="eah-network-row"
          role="list"
          style={{
            listStyle: 'none', margin: 0, padding: 0,
            display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center',
            gap: '28px 64px',
          }}
        >
          {NETWORKS.map((n) => (
            <li key={n.name} style={{ display: 'flex', alignItems: 'center', height: '68px' }}>
              {n.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={n.logo}
                  alt={n.name}
                  loading="lazy"
                  decoding="async"
                  style={{
                    // --h lets the mobile rule scale every mark proportionally.
                    ['--h' as string]: `${n.height ?? 28}px`,
                    height: 'var(--h)', width: 'auto', display: 'block',
                    // Monochrome, muted — one row, one tone.
                    filter: 'brightness(0) invert(1)', opacity: 0.72,
                  }}
                />
              ) : (
                <span
                  style={{
                    fontFamily: 'Georgia, "Times New Roman", serif',
                    fontSize: '30px', fontWeight: 600, letterSpacing: '0.01em',
                    color: 'rgba(255,255,255,0.62)', lineHeight: 1, whiteSpace: 'nowrap',
                  }}
                >
                  {n.name}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .eah-network-row { gap: 18px 28px !important; }
          .eah-network-row li { height: auto !important; }
          .eah-network-row span { font-size: 22px !important; }
          .eah-network-row img { height: calc(var(--h) * 0.72) !important; }
        }
      `}</style>
    </section>
  )
}
