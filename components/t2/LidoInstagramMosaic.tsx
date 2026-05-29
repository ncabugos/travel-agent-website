import Image from 'next/image'

/**
 * LidoInstagramMosaic — full-bleed Instagram wall for The Lido Collective,
 * in the 1 Hotel South Beach style: an edge-to-edge grid of moments with a
 * centered light card floating over the middle (handle + social icons).
 * Sharp-edged tiles — no rounded photo corners. On mobile the card detaches
 * and sits above a 2-column grid. Static placeholder tiles, no API.
 */

const HANDLE = 'lidocollective'

const TILES = [
  '/media/hero images/four-seasons-taormina-pool-hero.jpg',
  '/media/hotel-programs/aman/aman-hero-2000.jpg',
  '/media/hero images/four-seasons-yacht-hero.jpg',
  '/media/hotel-programs/belmond-bellini-club/belmond-hero-2000.jpg',
  '/media/hero images/four-seasons-sayan-hero.jpg',
  '/media/hotel-programs/oetker-pearl/eden-rock-st-barths-hero.jpg',
  '/media/hero images/four-seasons-CapFerrat-pool-hero.jpg',
  '/media/hotel-programs/como-hotels/Como-hero-tuscany-2200.jpg',
  '/media/hero images/four-seasons-astir-hero.jpg',
  '/media/hero images/four-seasons-CapFerrat_garden-hero.jpg',
]

const Social = ({ children, label }: { children: React.ReactNode; label: string }) => (
  <a
    href={`https://www.instagram.com/${HANDLE}`}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="lido-ig-social"
  >
    {children}
  </a>
)

export function LidoInstagramMosaic() {
  return (
    <section className="lido-ig-section">
      {/* Centered card (precedes the grid so it stacks first on mobile) */}
      <div className="lido-ig-card">
        <h2 className="lido-display" style={{ fontSize: 'clamp(28px, 3.2vw, 38px)', lineHeight: 1.08, margin: 0 }}>
          Find us on Instagram
        </h2>
        <p className="lido-display" style={{ fontStyle: 'italic', fontSize: 'clamp(22px, 2.6vw, 28px)', color: 'var(--lido-bg-dark)', margin: '4px 0 0' }}>
          @{HANDLE}
        </p>
        <p className="lido-body" style={{ fontSize: 14, maxWidth: 360, margin: '20px auto 0' }}>
          Keep up with the places that deserve more than a bookmark — a check-in.
        </p>
        <div className="lido-ig-socials">
          <Social label="Instagram">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" /></svg>
          </Social>
          <Social label="TikTok">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 3c.3 2.1 1.5 3.6 3.5 3.9v2.6c-1.3.1-2.5-.2-3.6-.9v5.9c0 3.3-2.4 5.5-5.4 5.5-2.8 0-5-2-5-4.8 0-3 2.4-4.9 5.6-4.6v2.7c-.4-.1-.9-.2-1.3-.1-1.1.1-1.8.8-1.7 2 .1 1.1 1 1.8 2.1 1.7 1.2-.1 1.8-1 1.8-2.3V3h3.5z" /></svg>
          </Social>
          <Social label="Facebook">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.3-1.5 1.6-1.5h1.6V3.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1v2.3H7.9V13H10.3v8h3.2z" /></svg>
          </Social>
        </div>
      </div>

      {/* Full-bleed photo wall */}
      <div className="lido-ig-wall">
        {TILES.map((src, i) => (
          <a
            key={i}
            href={`https://www.instagram.com/${HANDLE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="lido-ig-tile"
          >
            <Image src={src} alt="" fill sizes="(max-width: 768px) 50vw, 20vw" style={{ objectFit: 'cover' }} />
            <span className="lido-ig-hover" />
          </a>
        ))}
      </div>

      <style>{`
        .lido-ig-section { position: relative; background: var(--lido-bg); }
        .lido-ig-wall {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0;
        }
        .lido-ig-tile { position: relative; aspect-ratio: 1 / 1; overflow: hidden; display: block; }
        .lido-ig-tile img { transition: transform 0.9s var(--t2-ease-out); }
        .lido-ig-tile:hover img { transform: scale(1.05); }
        .lido-ig-hover { position: absolute; inset: 0; background: rgba(13,26,46,0.28); opacity: 0; transition: opacity 0.3s ease; }
        .lido-ig-tile:hover .lido-ig-hover { opacity: 1; }

        .lido-ig-card {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          z-index: 3;
          width: min(520px, 42vw);
          background: var(--lido-bg-grey);
          border-radius: 10px;
          box-shadow: 0 24px 70px rgba(6,16,30,0.20);
          padding: clamp(36px, 4vw, 56px);
          text-align: center;
        }
        .lido-ig-socials { display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 28px; }
        .lido-ig-social {
          display: inline-flex; align-items: center; justify-content: center;
          width: 38px; height: 38px; border-radius: 999px;
          background: var(--lido-bg-dark); color: var(--lido-on-dark);
          transition: background 0.25s ease;
        }
        .lido-ig-social:hover { background: var(--lido-bg-deep); }

        @media (max-width: 900px) {
          .lido-ig-card { width: min(560px, 70vw); }
        }
        @media (max-width: 768px) {
          .lido-ig-wall { grid-template-columns: repeat(2, 1fr); }
          .lido-ig-card {
            position: static; transform: none; width: auto;
            margin: 0 22px; border-radius: 0;
            box-shadow: none; background: var(--lido-bg);
            padding: clamp(48px, 12vw, 72px) 8px;
          }
        }
      `}</style>
    </section>
  )
}
