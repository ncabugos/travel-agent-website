'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import type { CruiseLine } from '@/lib/cruise-lines'
import { Reveal } from './Reveal'
import { useSectionProgress } from './useSectionProgress'

interface WWT2RiverJourneyProps {
  /** River lines pulled from the DB (cruise_lines, cruise_types contains 'river'). */
  lines: CruiseLine[]
  base: string
}

// Editorial image + note overrides keyed by slug; falls back to the line's own
// hero_image_url when a slug isn't curated here.
const CURATED: Record<string, { image: string; note: string; region: string }> = {
  amawaterways: {
    image: '/media/cruises/ama-waterways/amawaterways-amamagna-porto-1500.jpg',
    region: 'The Douro · Rhône · Bordeaux',
    note: 'Estate dinners ashore and a resident sommelier on board — the river line that set the standard for wine cruising.',
  },
  uniworld: {
    image: '/media/cruises/uniworld/uniworld-sunset-hero-2000.jpg',
    region: 'Bordeaux · Douro · Provence',
    note: 'Boutique ships with award-winning cuisine and a cellar curated for every region you sail.',
  },
  viking: {
    image: '/media/cruises/viking/swiss-alps.jpg',
    region: 'The Rhine · Danube · Douro',
    note: 'Elegant longships with quiet staterooms and panoramic views of the passing vineyards.',
  },
}

const LEAD_ORDER = ['amawaterways', 'uniworld', 'viking', 'scenic']

/**
 * Wine River Cruises — pinned scrollytelling. The section is ~1 viewport per
 * "stop" tall; a sticky stage crossfades full-bleed river imagery from one
 * cruise line to the next as you scroll, with a vertical hairline charting the
 * journey. Small screens and reduced-motion get a static stacked itinerary.
 */
export function WWT2RiverJourney({ lines, base }: WWT2RiverJourneyProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const fillRef = useRef<HTMLSpanElement>(null)
  const [stop, setStop] = useState(0)
  const [pinned, setPinned] = useState(false)

  const ordered = [...lines].sort(
    (a, b) => (LEAD_ORDER.indexOf(a.slug) + 1 || 99) - (LEAD_ORDER.indexOf(b.slug) + 1 || 99),
  )
  const featured = ordered.filter((l) => CURATED[l.slug]).slice(0, 3)
  const rest = ordered.filter((l) => !featured.includes(l))
  // Stops: 0 = intro panel, then one per featured line.
  const nStops = featured.length + 1

  // Progressive enhancement: static SSR markup upgrades to the pinned stage on
  // wide, motion-permitting clients.
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 900px)')
    const motion = window.matchMedia('(prefers-reduced-motion: no-preference)')
    const decide = () => setPinned(wide.matches && motion.matches)
    decide()
    wide.addEventListener('change', decide)
    motion.addEventListener('change', decide)
    return () => {
      wide.removeEventListener('change', decide)
      motion.removeEventListener('change', decide)
    }
  }, [])

  const onProgress = useCallback(
    (p: number) => {
      if (fillRef.current) fillRef.current.style.transform = `scaleY(${p.toFixed(4)})`
      const idx = Math.min(nStops - 1, Math.floor(p * nStops))
      setStop((prev) => (prev === idx ? prev : idx))
    },
    [nStops],
  )
  useSectionProgress(sectionRef, onProgress, pinned)

  if (featured.length === 0) return null

  const header = (
    <>
      <p className="wwt-eyebrow">Wine River Cruises</p>
      <h2 className="wwt-display wwt-h1 wwt2-rj-title">
        Bordeaux, the Douro, the Rhône —<br />
        <span className="italic">by river.</span>
      </h2>
      <p className="wwt-body wwt2-rj-lede">
        Unpack once and let the vineyards come to you. We reserve staterooms on Europe&rsquo;s
        finest small ships and arrange private estate visits along the way.
      </p>
    </>
  )

  const lineCta = (line: CruiseLine) => (
    <Link href={`${base}/find-cruise/${line.slug}`} className="wwt-link on-night">
      Explore {line.name.split(' ')[0]}
    </Link>
  )

  return (
    <section
      ref={sectionRef}
      id="ch-river"
      className={`wwt2-rj ${pinned ? 'is-pinned' : 'is-static'}`}
      style={pinned ? { height: `${nStops * 110}vh` } : undefined}
    >
      {pinned ? (
        <div className="wwt2-rj-stage">
          {/* Image layers — the intro shares the first line's river frame. */}
          {featured.map((line, i) => (
            <div
              key={line.slug}
              className="wwt2-rj-img"
              data-active={stop === 0 ? i === 0 : stop === i + 1}
              style={{
                backgroundImage: `url("${CURATED[line.slug]?.image ?? line.hero_image_url ?? ''}")`,
              }}
            />
          ))}
          <div className="wwt2-rj-scrim" data-deep={stop === 0} />

          {/* Journey hairline */}
          <div className="wwt2-rj-rail" aria-hidden="true">
            <span ref={fillRef} className="wwt2-rj-rail-fill" />
            {Array.from({ length: nStops }, (_, i) => (
              <span key={i} className="wwt2-rj-rail-dot" data-passed={stop >= i} />
            ))}
          </div>

          {/* Stop 0 — the invitation */}
          <div className="wwt2-rj-panel wwt2-rj-intro" data-active={stop === 0}>
            <div className="wwt-shell">{header}</div>
          </div>

          {/* One panel per line */}
          {featured.map((line, i) => {
            const c = CURATED[line.slug]
            return (
              <div key={line.slug} className="wwt2-rj-panel" data-active={stop === i + 1}>
                <div className="wwt-shell wwt2-rj-panel-inner">
                  <p className="wwt-eyebrow wwt2-rj-stopno">
                    Stop {String(i + 1).padStart(2, '0')} / {String(featured.length).padStart(2, '0')}
                  </p>
                  {c?.region && <p className="wwt-eyebrow wwt2-rj-region">{c.region}</p>}
                  <h3 className="wwt-display wwt2-rj-name">{line.name}</h3>
                  <p className="wwt2-rj-note">{c?.note ?? line.tagline}</p>
                  {lineCta(line)}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* Static itinerary — small screens & reduced motion */
        <div className="wwt2-rj-static">
          <Reveal className="wwt-shell wwt2-rj-static-head">{header}</Reveal>
          {featured.map((line, i) => {
            const c = CURATED[line.slug]
            return (
              <Reveal key={line.slug} className="wwt2-rj-card" delay={i * 80}>
                <div
                  className="wwt2-rj-card-img"
                  style={{
                    backgroundImage: `url("${c?.image ?? line.hero_image_url ?? ''}")`,
                  }}
                />
                <div className="wwt2-rj-card-body">
                  {c?.region && <p className="wwt-eyebrow wwt2-rj-region">{c.region}</p>}
                  <h3 className="wwt-display wwt2-rj-name">{line.name}</h3>
                  <p className="wwt2-rj-note">{c?.note ?? line.tagline}</p>
                  {lineCta(line)}
                </div>
              </Reveal>
            )
          })}
        </div>
      )}

      {rest.length > 0 && (
        <div className="wwt2-rj-foot">
          <div className="wwt-shell">
            <span className="wwt2-rj-foot-label">More ships on the rivers</span>
            <span className="wwt2-rj-foot-lines">
              {rest.map((line, i) => (
                <span key={line.slug}>
                  {i > 0 && <span className="wwt2-rj-dot"> · </span>}
                  <Link href={`${base}/find-cruise/${line.slug}`} className="wwt2-rj-foot-link">
                    {line.name}
                  </Link>
                </span>
              ))}
            </span>
          </div>
        </div>
      )}

      <style>{`
        .wwt2-rj { background: var(--wwt-night); }

        /* ── Pinned stage ─────────────────────────────────────────────────── */
        .wwt2-rj-stage {
          position: sticky; top: 0; height: 100svh; overflow: hidden;
        }
        .wwt2-rj-img {
          position: absolute; inset: 0;
          background-size: cover; background-position: center;
          opacity: 0; transform: scale(1.06);
          transition: opacity 1100ms var(--wwt-ease), transform 1400ms var(--wwt-ease);
        }
        .wwt2-rj-img[data-active='true'] { opacity: 1; transform: scale(1); }
        /* Two stacked washes: a horizontal one that holds the copy column, and a
           vertical one so bright sky at the top of a frame cannot wash out the
           eyebrow. The previous single horizontal gradient dropped to 0.15 on
           the right and left the lede unreadable over busy imagery. */
        .wwt2-rj-scrim {
          position: absolute; inset: 0;
          background:
            linear-gradient(to bottom, rgba(0,0,0,0.34) 0%, rgba(0,0,0,0.10) 42%, rgba(0,0,0,0.30) 100%),
            linear-gradient(to right, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.55) 48%, rgba(0,0,0,0.30) 100%);
          transition: background 900ms var(--wwt-ease);
        }
        .wwt2-rj-scrim[data-deep='true'] {
          background:
            linear-gradient(to bottom, rgba(0,0,0,0.40) 0%, rgba(0,0,0,0.18) 42%, rgba(0,0,0,0.38) 100%),
            linear-gradient(to right, rgba(0,0,0,0.86) 0%, rgba(0,0,0,0.68) 48%, rgba(0,0,0,0.44) 100%);
        }

        .wwt2-rj-rail {
          position: absolute; left: clamp(1.2rem, 3vw, 3rem); top: 18vh; bottom: 18vh;
          width: 1px; background: rgba(255,255,255,0.22); z-index: 3;
        }
        .wwt2-rj-rail-fill {
          position: absolute; inset: 0; background: rgba(255,255,255,0.9);
          transform: scaleY(0); transform-origin: top; will-change: transform;
        }
        .wwt2-rj-rail-dot {
          position: absolute; left: 50%; width: 7px; height: 7px;
          border-radius: 50%; transform: translateX(-50%);
          background: var(--wwt-night); border: 1px solid rgba(255,255,255,0.55);
          transition: background 500ms var(--wwt-ease);
        }
        .wwt2-rj-rail-dot[data-passed='true'] { background: #fff; }
        .wwt2-rj-rail-dot:nth-child(2) { top: 0; }
        .wwt2-rj-rail-dot:nth-child(3) { top: 33.3%; }
        .wwt2-rj-rail-dot:nth-child(4) { top: 66.6%; }
        .wwt2-rj-rail-dot:nth-child(5) { top: 100%; }

        .wwt2-rj-panel {
          position: absolute; inset: 0; z-index: 2;
          display: flex; align-items: center;
          opacity: 0; visibility: hidden; transform: translateY(28px);
          transition: opacity 800ms var(--wwt-ease), transform 800ms var(--wwt-ease), visibility 800ms;
        }
        .wwt2-rj-panel[data-active='true'] {
          opacity: 1; visibility: visible; transform: none;
        }
        .wwt2-rj-panel-inner { max-width: none; }
        /* All of these need the .wwt2-page prefix to out-specify the base
           .wwt2-page .wwt-body / .wwt-eyebrow ink colours. Without it the lede
           inherited --wwt-ink-soft and rendered as dark grey on a dark photo —
           which is why it was effectively invisible. */
        .wwt2-page .wwt2-rj .wwt-eyebrow { color: rgba(255,255,255,0.82); }
        /* .wwt2-page prefix out-specifies the base .wwt-display ink rule. */
        .wwt2-page .wwt2-rj-title {
          color: #fff; margin: 1.6rem 0 1.5rem;
          text-shadow: 0 2px 28px rgba(0,0,0,0.42);
        }
        .wwt2-page .wwt2-rj-lede {
          color: rgba(255,255,255,0.94); max-width: 46ch;
          line-height: 1.75; text-shadow: 0 1px 18px rgba(0,0,0,0.55);
        }
        .wwt2-rj-stopno { margin-bottom: 2.2rem; }
        .wwt2-rj-region { margin-bottom: 0.9rem; }
        .wwt2-page .wwt2-rj-name {
          color: #fff; font-size: clamp(2.2rem, 5vw, 4.2rem); margin-bottom: 1.2rem;
        }
        .wwt2-page .wwt2-rj-note {
          font-family: var(--wwt-sans); font-weight: 300;
          color: rgba(255,255,255,0.92); max-width: 44ch; line-height: 1.75;
          margin-bottom: 2rem; text-shadow: 0 1px 18px rgba(0,0,0,0.55);
        }
        .wwt2-rj-panel .wwt-shell { width: 100%; padding-left: clamp(4rem, 8vw, 8rem); }

        /* ── Static fallback ──────────────────────────────────────────────── */
        .wwt2-rj-static { padding-top: var(--wwt-section); }
        .wwt2-rj-static-head { margin-bottom: clamp(2.5rem, 6vw, 4rem); }
        .wwt2-rj-card { margin-bottom: clamp(2.5rem, 6vw, 4rem); }
        .wwt2-rj-card-img {
          aspect-ratio: 16 / 10; background-size: cover; background-position: center;
        }
        .wwt2-rj-card-body { padding: 1.6rem var(--wwt-gutter) 0; }

        /* ── Foot strip ───────────────────────────────────────────────────── */
        .wwt2-rj-foot {
          position: relative; z-index: 2;
          padding: 1.6rem 0 1.8rem;
          border-top: 1px solid rgba(255,255,255,0.14);
          background: var(--wwt-night);
        }
        .wwt2-rj-foot .wwt-shell { display: flex; flex-wrap: wrap; gap: 0.6rem 2rem; align-items: baseline; }
        .wwt2-rj-foot-label {
          font-family: var(--wwt-sans); font-size: 0.6875rem; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.28em; color: rgba(255,255,255,0.5);
        }
        .wwt2-rj-foot-link {
          font-family: var(--wwt-serif); font-size: 1.05rem;
          color: rgba(255,255,255,0.85); text-decoration: none;
        }
        .wwt2-rj-foot-link:hover { color: #fff; }
        .wwt2-rj-dot { color: rgba(255,255,255,0.4); }
      `}</style>
    </section>
  )
}
