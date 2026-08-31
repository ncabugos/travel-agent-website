import Link from 'next/link'
import type { Villa } from '@/lib/villas'
import { Reveal } from './Reveal'
import { WWT2Parallax } from './WWT2Parallax'

/** Per-card parallax strengths — three depths so the trio drifts apart. */
const DEPTHS = [0.15, 0.32, 0.22]

interface WWT2VillasProps {
  /** Curated villas from the DB (villas table). */
  villas: Villa[]
  base: string
}

/**
 * Private villas — DB-driven (villas), a Custom-tier module. A staggered trio
 * of wine-country houses; the middle card drops to create an editorial rhythm
 * distinct from every other section.
 */
export function WWT2Villas({ villas, base }: WWT2VillasProps) {
  const picks = villas.filter((v) => v.cover_image_url).slice(0, 3)
  if (picks.length < 3) return null

  const place = (v: Villa) =>
    [v.city_region || v.neighborhood, v.country].filter(Boolean).join(', ')

  return (
    <section id="ch-villas" className="wwt-section wwt-band-night wwt2-villas">
      <div className="wwt-shell">
        <Reveal className="wwt2-villas-head">
          <p className="wwt-eyebrow">Villas</p>
          <h2 className="wwt-display wwt-h1 wwt2-villas-title">
            Private villas with a chef, <span className="italic">staffed and stocked.</span>
          </h2>
          <p className="wwt-body wwt2-villas-lede">
            Housekeeping, a private pool, and in many cases vineyards beyond the garden wall.
            Every villa is inspected in person before we put it in front of you.
          </p>
        </Reveal>

        <div className="wwt2-villas-grid">
          {picks.map((v, i) => (
            <Reveal
              key={v.id}
              className={`wwt2-villa-card ${i === 1 ? 'is-dropped' : ''}`}
              delay={i * 100}
            >
              <Link href={`${base}/book-villa`} className="wwt2-villa-link">
                <WWT2Parallax
                  src={v.cover_image_url!}
                  alt={v.name}
                  aspect="3 / 4"
                  strength={DEPTHS[i % DEPTHS.length]}
                  className="wwt2-villa-img"
                />
                <div className="wwt2-villa-body">
                  <h3 className="wwt-display wwt2-villa-name">{v.name}</h3>
                  <p className="wwt2-villa-place">{place(v)}</p>
                  <p className="wwt2-villa-meta">
                    {[
                      v.bedrooms ? `${v.bedrooms} bedrooms` : null,
                      v.max_guests ? `sleeps ${v.max_guests}` : null,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="wwt2-villas-foot" delay={120}>
          <Link href={`${base}/book-villa`} className="wwt-link on-night">
            Browse the Villa Collection
          </Link>
        </Reveal>
      </div>

      <style>{`
        .wwt2-villas-head { max-width: 58ch; margin-bottom: clamp(3rem, 6vw, 5rem); }
        .wwt2-villas-title { margin: 1.5rem 0 1.6rem; }
        .wwt2-page .wwt2-villas-lede { max-width: 52ch; margin: 0; line-height: 1.75; }

        .wwt2-villas-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: clamp(1.2rem, 3vw, 2.5rem); align-items: start;
        }
        .wwt2-villa-card.is-dropped { margin-top: clamp(2rem, 6vw, 5rem); }
        .wwt2-villa-link { display: block; text-decoration: none; color: inherit; }
        .wwt2-villa-img {
          background-color: var(--wwt-night-2);
          transition: filter 700ms var(--wwt-ease);
        }
        .wwt2-villa-link:hover .wwt2-villa-img { filter: brightness(1.07); }
        .wwt2-villa-body { padding-top: 1.3rem; }
        .wwt2-villa-name {
          color: var(--wwt-on-night); font-size: clamp(1.3rem, 1.8vw, 1.7rem); margin-bottom: 0.4rem;
          transition: letter-spacing 700ms var(--wwt-ease);
        }
        .wwt2-villa-link:hover .wwt2-villa-name { letter-spacing: 0.045em; }
        .wwt2-villa-place {
          font-family: var(--wwt-sans); font-size: 0.8rem; font-weight: 400;
          letter-spacing: 0.02em; color: rgba(255,255,255,0.72); margin-bottom: 0.5rem;
        }
        .wwt2-villa-meta {
          font-family: var(--wwt-sans); font-size: 0.7rem; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.16em; color: var(--wwt-clay);
        }
        .wwt2-villas-foot { margin-top: clamp(3rem, 6vw, 4.5rem); text-align: center; }

        @media (max-width: 760px) {
          .wwt2-villas-grid { grid-template-columns: 1fr 1fr; }
          .wwt2-villa-card.is-dropped { margin-top: 0; }
        }
        @media (max-width: 480px) {
          .wwt2-villas-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  )
}
