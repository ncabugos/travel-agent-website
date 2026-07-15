'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { HotelProgram } from '@/lib/hotel-programs'
import { Reveal } from './Reveal'

interface WWT2StaysPanelsProps {
  /** Full hotel-program catalogue from the DB (hotel_programs). */
  programs: HotelProgram[]
  base: string
}

const CURATED: { slug: string; image: string; eyebrow: string; note: string }[] = [
  {
    slug: 'aman-hotels-and-resorts',
    image: '/media/hotel-programs/aman/aman-hero-2000.jpg',
    eyebrow: 'Sanctuary',
    note: 'Serene, secluded resorts in extraordinary landscapes. We reserve the suites with the finest views.',
  },
  {
    slug: 'six-senses',
    image: '/media/hotel-programs/six-senses/Six_Senses-Featured Slider 1500.jpg',
    eyebrow: 'Wellness',
    note: 'World-class spas with programs built around you — sleep, recovery, longevity — and cuisine grown steps from the table.',
  },
  {
    slug: 'como-hotels',
    image: '/media/hotel-programs/como-hotels/COMO-hotels-1500-1.jpg',
    eyebrow: 'Design & Healing',
    note: 'COMO Shambhala wellness in beautifully designed hotels, from Tuscan estates to Caribbean shores.',
  },
]

/**
 * Where you stay — an interactive panel triptych. Three full-height image
 * panels sit side by side; hovering or focusing one expands it while its
 * siblings narrow and dim, revealing the house's note and link. On small
 * screens the trio stacks into a tap-to-expand accordion.
 */
export function WWT2StaysPanels({ programs, base }: WWT2StaysPanelsProps) {
  const bySlug = new Map(programs.map((p) => [p.slug, p]))
  const rows = CURATED.map((c) => ({ ...c, program: bySlug.get(c.slug) })).filter((r) => r.program)
  const [active, setActive] = useState(-1)

  if (rows.length === 0) return null

  return (
    <section id="ch-stays" className="wwt-section wwt2-sp">
      <div className="wwt-shell">
        <Reveal className="wwt2-sp-head">
          <p className="wwt-eyebrow">Where you stay</p>
          <h2 className="wwt-display wwt-h1 wwt2-sp-title">
            Hotels we know <span className="italic">personally.</span>
          </h2>
          <p className="wwt-body wwt2-sp-lede">
            A curated collection of the world&rsquo;s finest wine and wellness properties — each one
            visited, vetted, and booked with Virtuoso benefits from the moment you arrive.
          </p>
        </Reveal>
      </div>

      <Reveal>
        {/* -1 = resting equal thirds; hover/focus sets the expanded panel. */}
        <div className="wwt2-sp-row" onMouseLeave={() => setActive(-1)}>
          {rows.map((r, i) => {
          const p = r.program!
          const expanded = active === i
          return (
            <Link
              key={r.slug}
              href={`${base}/book-hotel/${p.slug}`}
              className="wwt2-sp-panel"
              data-expanded={expanded}
              data-dimmed={active !== -1 && !expanded}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(-1)}
              onTouchStart={(e) => {
                // First tap expands; second tap follows the link.
                if (!expanded) {
                  e.preventDefault()
                  setActive(i)
                }
              }}
            >
              <span className="wwt2-sp-img" style={{ backgroundImage: `url("${r.image}")` }} />
              <span className="wwt2-sp-shade" />
              <span className="wwt2-sp-body">
                <span className="wwt-eyebrow wwt2-sp-eyebrow">{r.eyebrow}</span>
                <span className="wwt-display wwt2-sp-name">{p.name}</span>
                  <span className="wwt2-sp-detail">
                    <span className="wwt2-sp-note">{r.note}</span>
                    <span className="wwt-link on-night wwt2-sp-cta">
                      Discover {p.name.split(' ')[0]}
                    </span>
                  </span>
                </span>
              </Link>
            )
          })}
        </div>
      </Reveal>

      <Reveal className="wwt2-sp-foot" delay={100}>
        <Link href={`${base}/book-hotel`} className="wwt-btn">
          View the Full Collection
        </Link>
      </Reveal>

      <style>{`
        .wwt2-sp { padding-bottom: var(--wwt-section); }
        .wwt2-sp-head { max-width: 46ch; margin-bottom: clamp(3rem, 6vw, 5rem); }
        .wwt2-sp-title { margin: 1.3rem 0 1.6rem; }

        .wwt2-sp-row {
          display: flex; gap: 3px; height: min(78vh, 720px);
          padding: 0 3px;
        }
        .wwt2-sp-panel {
          position: relative; overflow: hidden; text-decoration: none;
          flex: 1 1 0%;
          transition: flex 750ms var(--wwt-ease);
          outline-offset: -4px;
        }
        .wwt2-sp-panel[data-expanded='true'] { flex-grow: 2.4; }
        .wwt2-sp-img {
          position: absolute; inset: 0;
          background-size: cover; background-position: center;
          transition: transform 1200ms var(--wwt-ease), filter 750ms var(--wwt-ease);
        }
        .wwt2-sp-panel[data-expanded='true'] .wwt2-sp-img { transform: scale(1.045); }
        .wwt2-sp-panel[data-dimmed='true'] .wwt2-sp-img {
          filter: grayscale(0.5) brightness(0.72);
        }
        .wwt2-sp-shade {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.05) 55%);
        }
        .wwt2-sp-body {
          position: absolute; left: 0; right: 0; bottom: 0; z-index: 2;
          display: flex; flex-direction: column; gap: 0.5rem;
          padding: clamp(1.4rem, 2.5vw, 2.4rem);
        }
        .wwt2-sp-eyebrow { color: rgba(255,255,255,0.65); }
        /* .wwt2-page prefix out-specifies the base .wwt-display ink rule. */
        .wwt2-page .wwt2-sp-name {
          color: #fff; font-size: clamp(1.4rem, 2.4vw, 2.1rem); line-height: 1.1;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .wwt2-sp-detail {
          display: grid; grid-template-rows: 0fr; overflow: hidden;
          transition: grid-template-rows 750ms var(--wwt-ease), opacity 600ms var(--wwt-ease) 150ms;
          opacity: 0;
        }
        .wwt2-sp-panel[data-expanded='true'] .wwt2-sp-detail {
          grid-template-rows: 1fr; opacity: 1;
        }
        .wwt2-sp-detail > * { min-height: 0; }
        .wwt2-sp-note {
          display: block;
          font-family: var(--wwt-sans); font-weight: 300; font-size: 0.95rem;
          color: rgba(255,255,255,0.85); line-height: 1.65; max-width: 44ch;
          padding-top: 0.6rem; margin-bottom: 1.2rem;
        }
        .wwt2-sp-cta { align-self: flex-start; }

        .wwt2-sp-foot { margin-top: clamp(3rem, 6vw, 4.5rem); text-align: center; }

        /* Stacked accordion on small screens */
        @media (max-width: 860px) {
          .wwt2-sp-row { flex-direction: column; height: auto; }
          .wwt2-sp-panel { min-height: 150px; flex-basis: auto; }
          .wwt2-sp-panel[data-expanded='true'] { min-height: 380px; }
          .wwt2-sp-panel { transition: min-height 650ms var(--wwt-ease), flex 650ms var(--wwt-ease); }
          .wwt2-sp-name { white-space: normal; }
        }
        @media (prefers-reduced-motion: reduce) {
          .wwt2-sp-panel, .wwt2-sp-img, .wwt2-sp-detail { transition: none; }
        }
      `}</style>
    </section>
  )
}
