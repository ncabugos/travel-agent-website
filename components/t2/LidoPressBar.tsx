import Image from 'next/image'

/**
 * LidoPressBar — "featured in" strip for The Lido Collective.
 *
 * Each publication renders as a masthead-style wordmark set in a typeface,
 * case, and tracking that evokes its real logo (Vogue / Town & Country in
 * Didot-style caps via Bodoni; Travel + Leisure in sans caps; the rest in a
 * serif). These are typographic representations, NOT the proprietary logo
 * artwork.
 *
 * To use the REAL licensed logos: drop a monochrome SVG/PNG into
 * `public/demos/the-lido-collective/press/<file>` and set `logo` + `width` on
 * the entry below — the component will render the image instead of the
 * wordmark, greyscaled and low-opacity to sit quietly on the page.
 */

type Press = {
  name: string
  /** Optional path under /public to a licensed logo file. */
  logo?: string
  width?: number
  /** Wordmark styling when no logo file is supplied. */
  font: 'serif' | 'sans'
  caps?: boolean
  tracking?: string
  weight?: number
  size?: number
}

const PUBLICATIONS: Press[] = [
  { name: 'Condé Nast Traveler', font: 'serif', tracking: '0.01em', size: 19 },
  { name: 'The New York Times', font: 'serif', tracking: '0.01em', size: 19 },
  { name: 'VOGUE', font: 'serif', caps: true, tracking: '0.34em', weight: 500, size: 20 },
  { name: 'TRAVEL + LEISURE', font: 'sans', caps: true, tracking: '0.22em', weight: 600, size: 13 },
  { name: 'TOWN & COUNTRY', font: 'serif', caps: true, tracking: '0.2em', weight: 500, size: 15 },
]

export function LidoPressBar() {
  return (
    <section style={{ background: 'var(--lido-bg)' }}>
      <div style={{ maxWidth: 'var(--t2-content-max, 1280px)', margin: '0 auto', padding: '0 48px' }}>
        <div style={{ borderTop: '1px solid var(--lido-line)', borderBottom: '1px solid var(--lido-line)', padding: '40px 0', textAlign: 'center' }}>
          <p className="lido-eyebrow" style={{ marginBottom: 30, fontSize: 10 }}>
            Our advisors have been featured in
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 'clamp(28px, 6vw, 64px)' }}>
            {PUBLICATIONS.map((p) =>
              p.logo ? (
                <Image
                  key={p.name}
                  src={p.logo}
                  alt={p.name}
                  width={p.width ?? 140}
                  height={28}
                  className="lido-press-logo"
                  style={{ height: 22, width: 'auto', objectFit: 'contain' }}
                />
              ) : (
                <span
                  key={p.name}
                  className="lido-press-name"
                  style={{
                    fontFamily: p.font === 'sans' ? 'var(--lido-font-body)' : 'var(--lido-font-display)',
                    fontSize: `clamp(${Math.round((p.size ?? 18) * 0.8)}px, 2vw, ${p.size ?? 18}px)`,
                    fontWeight: p.weight ?? 400,
                    letterSpacing: p.tracking ?? '0.01em',
                    textTransform: p.caps ? 'uppercase' : 'none',
                    color: 'var(--lido-text)',
                    opacity: 0.46,
                    whiteSpace: 'nowrap',
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  {p.name}
                </span>
              ),
            )}
          </div>
        </div>
      </div>

      <style>{`
        .lido-press-name:hover { opacity: 0.85 !important; }
        .lido-press-logo { filter: grayscale(1); opacity: 0.5; transition: opacity 0.3s ease; }
        .lido-press-logo:hover { opacity: 0.85; }
      `}</style>
    </section>
  )
}
