import Link from 'next/link'
import { getAgentProfile } from '@/lib/suppliers'
import { getCruiseLines } from '@/lib/cruise-lines'
import { getHotelPrograms } from '@/lib/hotel-programs'
import { getAllVillas } from '@/lib/villas'
import { getBlogPosts } from '@/lib/blog'
import { WWT2Hero } from '@/components/t2/wwt2/WWT2Hero'
import { WWT2RiverJourney } from '@/components/t2/wwt2/WWT2RiverJourney'
import { WWT2StaysPanels } from '@/components/t2/wwt2/WWT2StaysPanels'
import { WWT2Atlas } from '@/components/t2/wwt2/WWT2Atlas'
import { WWT2Virtuoso } from '@/components/t2/wwt2/WWT2Virtuoso'
import { WWT2Villas } from '@/components/t2/wwt2/WWT2Villas'
import { WWT2Journal } from '@/components/t2/wwt2/WWT2Journal'
import { WWT2ChapterRail } from '@/components/t2/wwt2/WWT2ChapterRail'
import { WWT2HeadlineReveal } from '@/components/t2/wwt2/WWT2HeadlineReveal'
import { WWT2Parallax } from '@/components/t2/wwt2/WWT2Parallax'
import { Reveal } from '@/components/t2/wwt2/Reveal'

interface PageProps {
  params: Promise<{ agentId: string }>
}

const CHAPTERS = [
  { id: 'ch-intro', label: 'Why us' },
  { id: 'ch-advisor', label: 'Your advisor' },
  { id: 'ch-river', label: 'River cruises' },
  { id: 'ch-stays', label: 'Hotels' },
  { id: 'ch-atlas', label: 'Regions' },
  { id: 'ch-virtuoso', label: 'Virtuoso' },
  { id: 'ch-villas', label: 'Villas' },
  { id: 'ch-journal', label: 'Journal' },
]

/**
 * Wine & Wellness Travel — bespoke flagship homepage (v2, "digital experience"
 * build). One continuous editorial journey: a chapter rail tracks progress and
 * every module carries its own signature interaction — split crossfade hero,
 * line-mask manifesto, spoken-word advisor quote, pinned river scrollytelling,
 * hover-expand stay panels, hover-driven region atlas, counting Virtuoso
 * ledger, parallax villa triptych, journal marquee, curtain finale. All data
 * reads live DB; chrome/tokens live in app/t2/wwt2.css.
 */
export default async function WWTHomeV2({ params }: PageProps) {
  const { agentId } = await params
  const [agent, riverLines, programs, allVillas, posts] = await Promise.all([
    getAgentProfile(agentId),
    getCruiseLines('river'),
    getHotelPrograms(),
    getAllVillas(),
    getBlogPosts(agentId),
  ])

  const base = `/t2/${agentId}`
  const agencyName = agent?.agency_name ?? 'Wine & Wellness Travel'
  const advisorName =
    agent?.full_name && agent.full_name !== 'Your Advisor' ? agent.full_name : 'Your Advisor'

  // Wine-country villas for the Custom-tier villa module — Italian (Tuscany,
  // Piemonte, Umbria) lead the trio; French Provence/Bordeaux fill in.
  const WINE_REGIONS = ['Tuscany', 'Piemonte', 'Piedmont', 'Umbria', 'Provence', 'Bordeaux', 'Arezzo']
  const isWineCountry = (region: string | null) =>
    !!region && WINE_REGIONS.some((r) => region.toLowerCase().includes(r.toLowerCase()))
  const withCover = allVillas.filter((v) => v.cover_image_url)
  const villas = [
    ...withCover.filter((v) => v.country === 'Italy' && isWineCountry(v.city_region)),
    ...withCover.filter((v) => v.country === 'Italy' && !isWineCountry(v.city_region)),
    ...withCover.filter((v) => v.country === 'France'),
  ]

  return (
    <>
      <WWT2ChapterRail chapters={CHAPTERS} />

      <WWT2Hero
        eyebrow="Wine · Wellness · Private Travel"
        headline="The world's great wine regions,"
        headlineItalic="expertly planned."
        sub="Private cellar dinners in Piemonte. A spa week in Tuscany. A river cruise through Bordeaux. Your advisor plans every detail and secures Virtuoso benefits at every stay."
        images={[
          '/media/hotel-programs/como-hotels/Como-hero-tuscany-2200.jpg',
          '/media/hero%20images/four-seasons-taormina-pool-hero.jpg',
          '/media/hero%20images/four-seasons-CapFerrat_garden-hero.jpg',
        ]}
        primaryCta={{ label: 'Start Planning', href: `${base}/contact` }}
        secondaryCta={{ label: 'How We Travel', href: `${base}/about` }}
      />

      {/* ── I · Manifesto — line-mask reveal + parallax figure ─────────────── */}
      <section id="ch-intro" className="wwt-section">
        <div className="wwt-shell wwt2-intro">
          <div className="wwt2-intro-copy">
            <Reveal className="wwt2-chmark">
              <span className="wwt2-chmark-numeral">I</span>
              <span className="wwt2-chmark-line" aria-hidden="true" />
              <span className="wwt-eyebrow">Why travel with us</span>
            </Reveal>
            <div className="wwt2-intro-head">
              <WWT2HeadlineReveal
                as="h2"
                className="wwt-display wwt-h1 wwt2-intro-line"
                text="Every detail handled."
                stagger={80}
              />
              <WWT2HeadlineReveal
                as="p"
                className="wwt-display wwt-h1 wwt2-intro-line"
                text="Every stay with benefits"
                delay={250}
                stagger={80}
              />
              <WWT2HeadlineReveal
                as="p"
                className="wwt-display wwt-h1 wwt2-intro-line"
                text="you can't book online."
                delay={500}
                stagger={80}
              />
            </div>
            <Reveal delay={700}>
              <p className="wwt-body wwt2-intro-body">
                We plan a limited number of journeys each year and work only with properties we know
                firsthand. As a Virtuoso member agency, every reservation includes room upgrades when
                available, hotel credits, daily breakfast, and VIP recognition on arrival. One call
                starts the process — your advisor handles the rest, from first idea to final night.
              </p>
              <Link href={`${base}/contact`} className="wwt-link wwt2-intro-link">
                Start the Conversation
              </Link>
            </Reveal>
          </div>

          <div className="wwt2-intro-figure">
            <WWT2Parallax
              src="/media/hotel-programs/belmond-bellini-club/bel-cam-first-light-mallorca02_960x1198.jpg"
              alt="First light over the Mediterranean"
              aspect="4 / 5"
              strength={0.3}
            />
          </div>
        </div>
      </section>

      {/* ── II · The signature band — spoken-word quote ────────────────────── */}
      <section id="ch-advisor" className="wwt-section wwt-band-night">
        <div className="wwt-shell">
          <Reveal className="wwt2-note">
            <div className="wwt2-chmark on-night">
              <span className="wwt2-chmark-numeral">II</span>
              <span className="wwt2-chmark-line" aria-hidden="true" />
              <span className="wwt-eyebrow">From your advisor</span>
            </div>
            <WWT2HeadlineReveal
              as="blockquote"
              className="wwt-display wwt2-note-quote"
              text="“After years of building relationships with winemakers, hoteliers, and spa directors across the world's great wine regions, I know exactly who to call — and they answer. That access becomes yours the moment we start planning.”"
              stagger={36}
            />
            <div className="wwt2-note-sign">
              <span className="wwt2-note-name">{advisorName}</span>
              <svg
                className="wwt2-sig"
                viewBox="0 0 220 14"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M2 9 C 40 2, 70 13, 105 7 S 175 3, 218 8"
                  pathLength="1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
              </svg>
              <span className="wwt2-note-role">{agencyName} · Virtuoso Member</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── III · Pinned river scrollytelling (DB: cruise_lines) ───────────── */}
      <WWT2RiverJourney lines={riverLines} base={base} />

      {/* ── IV · Hover-expand stay panels (DB: hotel_programs) ─────────────── */}
      <WWT2StaysPanels programs={programs} base={base} />

      {/* ── V · The Atlas — hover-driven region explorer ────────────────────── */}
      <WWT2Atlas base={base} />

      {/* ── VI · The Virtuoso ledger ────────────────────────────────────────── */}
      <WWT2Virtuoso />

      {/* ── VII · Parallax villa triptych (DB: villas) ─────────────────────── */}
      <WWT2Villas villas={villas} base={base} />

      {/* ── VIII · The Journal dispatch (DB: blog_posts) ───────────────────── */}
      <WWT2Journal posts={posts} base={base} />

      {/* Curtain finale + footer render from the layout (shared across WWT pages). */}

      <style>{`
        .wwt2-page main { padding-top: 0; }

        .wwt2-intro {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: clamp(2.5rem, 6vw, 6rem);
          align-items: center;
        }
        .wwt2-intro-head { margin: 1.4rem 0 1.8rem; }
        .wwt2-intro-line { max-width: 20ch; }
        .wwt2-intro-body { margin-bottom: 2.2rem; }
        @media (max-width: 860px) {
          .wwt2-intro { grid-template-columns: 1fr; }
          .wwt2-intro-figure { order: -1; }
        }

        .wwt2-note { max-width: none; }
        .wwt2-note-quote {
          font-size: clamp(1.6rem, 3.4vw, 2.9rem);
          font-weight: 300;
          line-height: 1.28;
          max-width: 26ch;
          margin: 1.6rem 0 2.4rem;
          color: var(--wwt-on-night);
        }
        .wwt2-note-sign { display: flex; flex-direction: column; gap: 0.3rem; }
        .wwt2-note-name {
          font-family: var(--wwt-serif); font-style: italic;
          font-size: 1.5rem; color: var(--wwt-on-night);
        }
        .wwt2-sig {
          width: 200px; height: 14px; color: rgba(255,255,255,0.65);
        }
        .wwt2-sig path {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          transition: stroke-dashoffset 1400ms var(--wwt-ease) 600ms;
        }
        .wwt2-note[data-inview='true'] .wwt2-sig path { stroke-dashoffset: 0; }
        @media (prefers-reduced-motion: reduce) {
          .wwt2-sig path { transition: none; stroke-dashoffset: 0; }
        }
        .wwt2-note-role {
          font-family: var(--wwt-sans); font-size: 0.72rem; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.24em; color: rgba(255,255,255,0.55);
          margin-top: 0.5rem;
        }
      `}</style>
    </>
  )
}
