import Image from 'next/image'
import Link from 'next/link'
import { getCruiseLines } from '@/lib/cruise-lines'
import { getAgentProfile } from '@/lib/suppliers'
import { T2BenefitsGrid } from '@/components/t2/T2BenefitsGrid'
import { T2LeadForm } from '@/components/t2/T2LeadForm'
import { buildMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ agentId: string }>
}

export const revalidate = 3600

/**
 * The lines this surface covers, in display order.
 *
 * Deliberately an explicit list rather than a filter on `cruise_types`: Ponant,
 * Windstar and Star Clippers also carry 'yacht' in that array as a small-ship
 * descriptor, which pulled seven lines onto a page about four. The singular
 * `cruise_type` column is the accurate discriminator but is not on the
 * CruiseLine type, so naming the slugs keeps the page honest without a cast.
 */
const FEATURED_ORDER = [
  'ritz-carlton-yacht',
  'four-seasons-yachts',
  'aman-at-sea',
  'orient-express-sailing-yachts',
]

/**
 * What the advisor adds to a yacht booking. These are services we perform, not
 * line-specific amenities — per-line benefits live on the detail page and come
 * from the `cruise_lines.benefits` column.
 */
const YACHT_SERVICE = [
  {
    icon: 'priority',
    title: 'Suites Held Before Release',
    description: 'Owner’s and loft suites go long before general sale. We hold the category while the itinerary is still being decided.',
  },
  {
    icon: 'onboard',
    title: 'Virtuoso Voyages Amenities',
    description: 'Where the sailing qualifies, shipboard credit and a private shore event are added to the booking.',
  },
  {
    icon: 'excursion',
    title: 'Deck and Itinerary Guidance',
    description: 'Which hull, which deck, which week. The difference between a good sailing and the right one is rarely on the brochure.',
  },
  {
    icon: 'transfer',
    title: 'The Journey Either Side',
    description: 'Pre- and post-cruise stays booked under the same partner programmes as the rest of your travel.',
  },
]

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { agentId } = await params
  const agent = await getAgentProfile(agentId)
  if (!agent) return {}
  return buildMetadata({
    agent,
    title: 'Yachts',
    description:
      'The Ritz-Carlton Yacht Collection, Four Seasons Yachts, Aman at Sea, and Orient Express Sailing Yachts — booked with suites held ahead of release and Virtuoso Voyages amenities where they apply.',
    path: 'yachts',
  })
}

export default async function YachtsPage({ params }: PageProps) {
  const { agentId } = await params
  // Editorial surface over the global catalogue, linking to the already-public
  // /find-cruise detail pages — no tier gate of its own.
  const base = `/t2/${agentId}`
  const all = await getCruiseLines()
  const yachts = all
    .filter((c) => FEATURED_ORDER.includes(c.slug))
    .sort((a, b) => FEATURED_ORDER.indexOf(a.slug) - FEATURED_ORDER.indexOf(b.slug))

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', height: 'clamp(540px, 80vh, 860px)', overflow: 'hidden' }}>
        <Image
          src="/media/cruises/aman-at-sea/Amangati_Exterior_02_2880x1780px.webp"
          alt="A private yacht at anchor at dusk"
          fill
          priority
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          sizes="100vw"
          unoptimized
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.30), rgba(0,0,0,0.66))',
          }}
        />
        <div
          style={{
            position: 'relative', zIndex: 2, height: '100%',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center', textAlign: 'center',
            padding: '0 24px',
          }}
        >
          <p className="t2-label" style={{ marginBottom: 16, color: 'rgba(255,255,255,0.82)' }}>
            Yachting
          </p>
          <h1 className="t2-heading t2-heading-xl" style={{ color: '#FFFFFF', maxWidth: 900 }}>
            Small hulls. The whole ocean.
          </h1>
          <p
            style={{
              fontFamily: 'var(--t2-font-sans)', fontSize: 16, fontWeight: 300,
              lineHeight: 1.85, color: 'rgba(255,255,255,0.82)',
              maxWidth: 640, marginTop: 22,
            }}
          >
            Four houses took what they know about hotels and put it to sea. Every suite has a
            terrace, every marina is one you could not otherwise reach, and the guest count stays
            in the hundreds rather than the thousands.
          </p>
        </div>
      </section>

      {/* ── The fleet — alternating editorial rows ─────────────────────── */}
      <section className="t2-section">
        <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto clamp(52px, 6vw, 84px)' }}>
          <p className="t2-label" style={{ marginBottom: 14 }}>The Fleet</p>
          <h2 className="t2-heading t2-heading-lg" style={{ margin: 0 }}>
            The houses that took to sea.
          </h2>
        </div>

        <div className="t2-yacht-rows">
          {yachts.map((y, i) => {
            const shipCount = y.ships?.length ?? 0
            const journeyCount = y.sample_journeys?.length ?? 0
            const image = y.slider_images?.[0] ?? y.hero_image_url

            return (
              <article key={y.slug} className="t2-yacht-row" data-flip={i % 2 === 1 ? 'true' : 'false'}>
                <Link href={`${base}/find-cruise/${y.slug}`} className="t2-yacht-media">
                  {image && (
                    <Image
                      src={image}
                      alt={y.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 900px) 100vw, 56vw"
                      unoptimized
                    />
                  )}
                </Link>

                <div className="t2-yacht-body">
                  {y.tagline && <p className="t2-label" style={{ marginBottom: 14 }}>{y.tagline}</p>}
                  <h3 className="t2-yacht-name">{y.name}</h3>
                  {y.description && <p className="t2-yacht-copy">{y.description}</p>}

                  {(shipCount > 0 || journeyCount > 0) && (
                    <dl className="t2-yacht-facts">
                      {shipCount > 0 && (
                        <div>
                          <dt>{shipCount === 1 ? 'Yacht' : 'Yachts'}</dt>
                          <dd>{y.ships.map((s) => s.name).join(' · ')}</dd>
                        </div>
                      )}
                      {journeyCount > 0 && (
                        <div>
                          <dt>Sample journeys</dt>
                          <dd>{journeyCount} published</dd>
                        </div>
                      )}
                    </dl>
                  )}

                  <Link href={`${base}/find-cruise/${y.slug}`} className="t2-btn t2-btn-accent">
                    Explore {y.name}
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* ── What we add ────────────────────────────────────────────────── */}
      <T2BenefitsGrid
        benefits={YACHT_SERVICE}
        heading="What booking through us adds."
        label="The Difference"
      />

      {/* ── Enquiry ────────────────────────────────────────────────────── */}
      <T2LeadForm
        agentId={agentId}
        heading="Plan a yacht voyage"
        subheading="Tell us the season and the coastline. We'll come back with the hulls sailing it, the suites still open, and what each one actually costs."
      />

      <style>{`
        .t2-yacht-rows {
          display: flex; flex-direction: column;
          gap: clamp(64px, 8vw, 120px);
          max-width: var(--t2-content-max, 1280px); margin: 0 auto;
        }
        .t2-yacht-row {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: clamp(32px, 4vw, 64px);
          align-items: center;
        }
        .t2-yacht-row[data-flip='true'] .t2-yacht-media { order: 2; }
        @media (max-width: 900px) {
          .t2-yacht-row { grid-template-columns: 1fr; }
          .t2-yacht-row[data-flip='true'] .t2-yacht-media { order: 0; }
        }
        .t2-yacht-media {
          position: relative; aspect-ratio: 4 / 3; overflow: hidden;
          display: block; background: var(--t2-divider);
        }
        .t2-yacht-media img { transition: transform 1000ms var(--t2-ease, ease); }
        .t2-yacht-media:hover img { transform: scale(1.035); }
        .t2-yacht-name {
          font-family: var(--t2-font-serif); font-weight: 400;
          font-size: clamp(28px, 3.2vw, 40px); line-height: 1.15;
          color: var(--t2-text); margin: 0 0 18px;
        }
        .t2-yacht-copy {
          font-family: var(--t2-font-sans); font-size: 14.5px; font-weight: 300;
          line-height: 1.85; color: var(--t2-text-muted); margin: 0 0 28px; max-width: 52ch;
        }
        .t2-yacht-facts {
          margin: 0 0 32px; padding: 22px 0 0; border-top: 1px solid var(--t2-divider);
          display: flex; flex-direction: column; gap: 14px;
        }
        .t2-yacht-facts dt {
          font-family: var(--t2-font-sans); font-size: 10px; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--t2-accent); margin-bottom: 5px;
        }
        .t2-yacht-facts dd {
          font-family: var(--t2-font-serif); font-size: 16px;
          color: var(--t2-text); margin: 0; line-height: 1.45;
        }
        @media (prefers-reduced-motion: reduce) {
          .t2-yacht-media img { transition: none; }
          .t2-yacht-media:hover img { transform: none; }
        }
      `}</style>
    </>
  )
}
