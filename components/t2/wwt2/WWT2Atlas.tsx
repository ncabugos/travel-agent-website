'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useDragScroll } from '@/hooks/useDragScroll'
import { Reveal } from './Reveal'

interface WWT2AtlasProps {
  base: string
}

const REGIONS: { name: string; sub: string; note: string; image: string }[] = [
  {
    name: 'Piemonte & Tuscany',
    sub: 'Italy',
    note: 'Taste Barolo from the barrel and linger over four-hour lunches in the Brunello hills.',
    image: '/media/hotel-programs/como-hotels/Como-hero-tuscany-2200.jpg',
  },
  {
    name: 'Bordeaux & the Douro',
    sub: 'France · Portugal',
    note: 'Visit legendary châteaux by private appointment and cruise the terraced vineyards of the Douro.',
    image: '/media/cruises/uniworld/uniworld-sunset-hero-2000.jpg',
  },
  {
    name: 'Provence',
    sub: 'France',
    note: 'Drink rosé at the source and end each day in a garden above the Riviera.',
    image: '/media/hero%20images/four-seasons-CapFerrat_garden-hero.jpg',
  },
  {
    name: 'Napa & Sonoma',
    sub: 'California',
    note: 'Access cult cellars and tables that never take reservations.',
    image: '/media/hotel-programs/auberge-resorts/auberge-hero-2000.jpg',
  },
  {
    name: 'The Amalfi Coast',
    sub: 'Italy',
    note: 'Sip coastal whites over long lunches high above the sea.',
    image: '/media/hero%20images/four-seasons-taormina-pool-hero.jpg',
  },
]

/**
 * The Atlas — a hover-driven region explorer. An oversized serif index on the
 * left drives a full-bleed crossfading image stage on the right; it drifts
 * through the regions on its own until the visitor takes over. Small screens
 * get a momentum drag rail instead.
 */
export function WWT2Atlas({ base }: WWT2AtlasProps) {
  const [active, setActive] = useState(0)
  const interacted = useRef(false)
  const { ref: railRef, handlers: railHandlers } = useDragScroll()

  // Auto-drift every 5s until the first deliberate interaction.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => {
      if (!interacted.current) setActive((a) => (a + 1) % REGIONS.length)
    }, 5000)
    return () => clearInterval(id)
  }, [])

  const select = (i: number) => {
    interacted.current = true
    setActive(i)
  }

  const region = REGIONS[active]

  return (
    <section id="ch-atlas" className="wwt-section wwt2-atlas">
      <div className="wwt-shell">
        <Reveal className="wwt2-atlas-head">
          <div>
            <p className="wwt-eyebrow">Where we travel</p>
            <h2 className="wwt-display wwt-h1 wwt2-atlas-title">
              The regions we know <span className="italic">best.</span>
            </h2>
          </div>
          <p className="wwt-body wwt2-atlas-lede">
            We specialize in a short list of destinations and know them in depth — the producers,
            the restaurants, and the experiences you can&rsquo;t book on your own.
          </p>
        </Reveal>
      </div>

      {/* ── Desktop: index + stage ─────────────────────────────────────────── */}
      <div className="wwt-shell wwt2-atlas-split">
        <div className="wwt2-atlas-index" role="list">
          {REGIONS.map((r, i) => (
            <button
              key={r.name}
              type="button"
              role="listitem"
              className="wwt2-atlas-entry"
              data-active={active === i}
              onMouseEnter={() => select(i)}
              onFocus={() => select(i)}
              onClick={() => select(i)}
            >
              <span className="wwt2-atlas-no">{String(i + 1).padStart(2, '0')}</span>
              <span className="wwt2-atlas-entry-text">
                <span className="wwt-display wwt2-atlas-name">{r.name}</span>
                <span className="wwt2-atlas-sub">{r.sub}</span>
              </span>
              <span className="wwt2-atlas-line" aria-hidden="true" />
            </button>
          ))}
          <Link href={`${base}/contact`} className="wwt-link wwt2-atlas-cta">
            Plan Your Region
          </Link>
        </div>

        <div className="wwt2-atlas-stage" aria-live="polite">
          {REGIONS.map((r, i) => (
            <div
              key={r.name}
              className="wwt2-atlas-img"
              data-active={active === i}
              style={{ backgroundImage: `url("${r.image}")` }}
            />
          ))}
          <div className="wwt2-atlas-stage-scrim" />
          <p className="wwt2-atlas-note" key={region.name}>
            {region.note}
          </p>
        </div>
      </div>

      {/* ── Mobile: momentum drag rail ─────────────────────────────────────── */}
      <div className="wwt2-atlas-rail-wrap">
        <div className="wwt2-atlas-rail" ref={railRef} {...railHandlers}>
          {REGIONS.map((r) => (
            <div key={r.name} className="wwt2-atlas-card">
              <div className="wwt2-atlas-card-img" style={{ backgroundImage: `url("${r.image}")` }}>
                <div className="wwt2-atlas-card-scrim" />
                <div className="wwt2-atlas-card-cap">
                  <span className="wwt2-atlas-sub">{r.sub}</span>
                  <h3 className="wwt-display wwt2-atlas-card-name">{r.name}</h3>
                </div>
              </div>
              <p className="wwt2-atlas-card-note">{r.note}</p>
            </div>
          ))}
          <div className="wwt2-atlas-rail-end">
            <Link href={`${base}/contact`} className="wwt-link">
              Plan Your Region
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .wwt2-atlas-head {
          display: grid; grid-template-columns: 1.1fr 0.9fr; gap: clamp(1.5rem, 5vw, 4rem);
          align-items: end; margin-bottom: clamp(2.5rem, 5vw, 4rem);
        }
        .wwt2-atlas-title { margin-top: 1.2rem; }
        .wwt2-atlas-lede { max-width: 46ch; }

        /* Split explorer */
        .wwt2-atlas-split {
          display: grid; grid-template-columns: 0.9fr 1.1fr;
          gap: clamp(2rem, 5vw, 5rem); align-items: stretch;
        }
        .wwt2-atlas-index { display: flex; flex-direction: column; justify-content: center; }
        .wwt2-atlas-entry {
          display: flex; align-items: baseline; gap: 1.2rem;
          background: none; border: 0; cursor: pointer; text-align: left;
          padding: clamp(0.7rem, 1.4vw, 1.1rem) 0;
          border-bottom: 1px solid var(--wwt-clay);
          transition: padding-left 600ms var(--wwt-ease);
        }
        .wwt2-atlas-entry[data-active='true'] { padding-left: 1.4rem; }
        .wwt2-atlas-no {
          font-family: var(--wwt-sans); font-size: 0.7rem; font-weight: 500;
          letter-spacing: 0.2em; color: var(--wwt-stone);
        }
        .wwt2-atlas-entry-text { display: flex; flex-direction: column; gap: 0.15rem; }
        /* .wwt2-page prefix out-specifies the base .wwt-display ink rule. */
        .wwt2-page .wwt2-atlas-name {
          font-size: clamp(1.5rem, 2.6vw, 2.3rem); color: var(--wwt-stone);
          transition: color 500ms var(--wwt-ease);
        }
        .wwt2-page .wwt2-atlas-entry[data-active='true'] .wwt2-atlas-name { color: var(--wwt-ink); }
        .wwt2-atlas-sub {
          font-family: var(--wwt-sans); font-size: 0.65rem; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.24em; color: var(--wwt-stone);
        }
        .wwt2-atlas-line {
          flex: 1; height: 1px; background: var(--wwt-ink);
          transform: scaleX(0); transform-origin: left;
          transition: transform 700ms var(--wwt-ease);
          margin-left: 0.6rem; align-self: center;
        }
        .wwt2-atlas-entry[data-active='true'] .wwt2-atlas-line { transform: scaleX(1); }
        .wwt2-atlas-cta { margin-top: 2rem; align-self: flex-start; }

        .wwt2-atlas-stage {
          position: relative; overflow: hidden; min-height: 560px;
        }
        .wwt2-atlas-img {
          position: absolute; inset: 0;
          background-size: cover; background-position: center;
          opacity: 0; transform: scale(1.05);
          transition: opacity 900ms var(--wwt-ease), transform 1300ms var(--wwt-ease);
        }
        .wwt2-atlas-img[data-active='true'] { opacity: 1; transform: scale(1); }
        .wwt2-atlas-stage-scrim {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0) 45%);
        }
        .wwt2-atlas-note {
          position: absolute; left: 2rem; right: 2rem; bottom: 1.8rem; z-index: 2;
          font-family: var(--wwt-sans); font-weight: 300; font-size: 0.95rem;
          color: rgba(255,255,255,0.9); max-width: 44ch; line-height: 1.65; margin: 0;
          animation: wwt2-atlas-note-in 700ms var(--wwt-ease);
        }
        @keyframes wwt2-atlas-note-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: none; }
        }

        /* Mobile rail */
        .wwt2-atlas-rail-wrap { display: none; }
        .wwt2-atlas-rail {
          display: flex; gap: 1rem;
          overflow-x: auto; scroll-snap-type: x mandatory;
          padding: 0 var(--wwt-gutter) 1.5rem;
          scrollbar-width: none; cursor: grab;
        }
        .wwt2-atlas-rail::-webkit-scrollbar { display: none; }
        .wwt2-atlas-card { flex: 0 0 min(78vw, 340px); scroll-snap-align: start; }
        .wwt2-atlas-card-img {
          position: relative; aspect-ratio: 4 / 5; overflow: hidden;
          background-size: cover; background-position: center; background-color: var(--wwt-sand);
        }
        .wwt2-atlas-card-scrim {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 55%);
        }
        .wwt2-atlas-card-cap { position: absolute; left: 1.4rem; right: 1.4rem; bottom: 1.3rem; z-index: 2; }
        .wwt2-atlas-card-cap .wwt2-atlas-sub { color: rgba(255,255,255,0.8); }
        .wwt2-page .wwt2-atlas-card-name { color: #fff; font-size: 1.5rem; margin-top: 0.4rem; }
        .wwt2-atlas-card-note {
          font-family: var(--wwt-sans); font-weight: 300; font-size: 0.92rem;
          color: var(--wwt-ink-soft); margin-top: 1rem; max-width: 36ch;
        }
        .wwt2-atlas-rail-end {
          flex: 0 0 auto; align-self: center; padding: 0 2rem 0 1rem;
          display: flex; align-items: center;
        }

        @media (max-width: 900px) {
          .wwt2-atlas-head { grid-template-columns: 1fr; }
          .wwt2-atlas-split { display: none; }
          .wwt2-atlas-rail-wrap { display: block; }
        }
        @media (prefers-reduced-motion: reduce) {
          .wwt2-atlas-entry, .wwt2-atlas-img, .wwt2-atlas-name, .wwt2-atlas-line { transition: none; }
          .wwt2-atlas-note { animation: none; }
        }
      `}</style>
    </section>
  )
}
