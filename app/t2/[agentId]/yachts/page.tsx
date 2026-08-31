import Image from 'next/image'
import Link from 'next/link'
import { getCruiseLines } from '@/lib/cruise-lines'
import { getAgentProfile } from '@/lib/suppliers'
import { T2BenefitsGrid } from '@/components/t2/T2BenefitsGrid'
import { T2LeadForm } from '@/components/t2/T2LeadForm'
import { T2Faq, type Faq } from '@/components/t2/T2Faq'
import { T2HowItWorks } from '@/components/t2/T2HowItWorks'
import {
  JsonLd, faqSchema, categoryServiceSchema, itemListSchema, breadcrumbSchema,
} from '@/components/seo/JsonLd'
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
    icon: 'credit',
    title: 'Shipboard Credit on Every Qualifying Sailing',
    description: '$100 per suite on voyages under 14 nights, $200 per suite on 14 nights or more, through Virtuoso Voyages.',
  },
  {
    icon: 'excursion',
    title: 'A Private Shore Event',
    description: 'A complimentary shore excursion or car and driver, arranged for Virtuoso guests only — not the group tour.',
  },
  {
    icon: 'priority',
    title: 'Suites Held Before General Sale',
    description: 'Owner\u2019s and loft suites sell first. We hold your category while you decide on dates.',
  },
  {
    icon: 'vip',
    title: 'No Extra Cost to You',
    description: 'You pay the same fare as booking direct. Our commission comes from the cruise line, not from you.',
  },
]

const YACHT_FAQS: Faq[] = [
  {
    q: 'How much does a luxury yacht cruise cost?',
    a: 'Expect roughly $1,000 to $2,500 per person per night on The Ritz-Carlton Yacht Collection, Four Seasons Yachts, Aman at Sea, or Orient Express Sailing Yachts. Fares are all-suite and largely inclusive, so gratuities, most dining, and often shore excursions are already covered. We quote exact pricing for your dates on request.',
  },
  {
    q: 'What is the difference between a yacht cruise and a regular cruise ship?',
    a: 'Scale and access. These yachts carry between 100 and 450 guests rather than several thousand, every accommodation is a suite with a private terrace, and the smaller hull reaches marinas and anchorages large ships cannot enter. Service ratios approach one crew member per guest.',
  },
  {
    q: 'Does booking through a travel advisor cost more?',
    a: 'No. You pay the cruise line\u2019s published fare, and we add Virtuoso Voyages amenities on top — shipboard credit, a private shore event, and a dedicated onboard host. Our commission is paid by the cruise line.',
  },
  {
    q: 'How far ahead should I book a luxury yacht cruise?',
    a: 'Twelve to eighteen months for peak season and for the newest ships. Suites on maiden and holiday sailings are frequently sold out within days of release, which is why we register interest before the public on-sale date.',
  },
  {
    q: 'Which yacht line is best for a first voyage?',
    a: 'The Ritz-Carlton Yacht Collection is the most established of the four, with three yachts and the widest choice of itineraries. Four Seasons Yachts suits travellers already loyal to the brand on land, Aman at Sea is the quietest and most design-led, and Orient Express Sailing Yachts is the choice for sail rather than motor.',
  },
]

const YACHT_STEPS = [
  {
    title: 'Tell us the season and the coastline',
    body: 'No dates required. A rough month and a region is enough for us to start.',
  },
  {
    title: 'We come back with what is open',
    body: 'The yachts sailing it, the suite categories still available, and the real fare — usually within one business day.',
  },
  {
    title: 'We hold the suite and add the amenities',
    body: 'Your category is held while you decide, and Virtuoso Voyages benefits are attached to the booking.',
  },
]

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { agentId } = await params
  const agent = await getAgentProfile(agentId)
  if (!agent) return {}
  return buildMetadata({
    agent,
    title: 'Luxury Yacht Cruises',
    description:
      'Book The Ritz-Carlton Yacht Collection, Four Seasons Yachts, Aman at Sea, and Orient Express Sailing Yachts with Virtuoso benefits: shipboard credit, a private shore event, and suites held before general sale. Same fare as booking direct.',
    path: 'yachts',
  })
}

export default async function YachtsPage({ params }: PageProps) {
  const { agentId } = await params
  // Editorial surface over the global catalogue, linking to the already-public
  // /find-cruise detail pages — no tier gate of its own.
  const base = `/t2/${agentId}`
  const [all, agent] = await Promise.all([getCruiseLines(), getAgentProfile(agentId)])
  const yachts = all
    .filter((c) => FEATURED_ORDER.includes(c.slug))
    .sort((a, b) => FEATURED_ORDER.indexOf(a.slug) - FEATURED_ORDER.indexOf(b.slug))

  return (
    <>
      {/* Structured data: Service + the enumerated fleet + FAQ + breadcrumb.
          One @graph so the four nodes are read together rather than as
          unrelated fragments. */}
      {agent && (
        <JsonLd
          data={[
            categoryServiceSchema(agent, {
              name: `Luxury Yacht Cruise Booking — ${agent.agency_name}`,
              description:
                'Booking for The Ritz-Carlton Yacht Collection, Four Seasons Yachts, Aman at Sea, and Orient Express Sailing Yachts, with Virtuoso Voyages shipboard credit and a private shore event.',
              path: 'yachts',
              serviceType: 'Luxury Yacht Cruise Booking',
            }),
            itemListSchema(agent, {
              name: 'Luxury yacht lines',
              path: 'yachts',
              items: yachts.map((y) => ({
                name: y.name,
                description: y.description,
                path: `find-cruise/${y.slug}`,
              })),
            }),
            faqSchema(YACHT_FAQS.map((f) => ({ q: f.q, a: f.a }))),
            breadcrumbSchema(agent, [
              { name: 'Home', path: '' },
              { name: 'Yacht Cruises', path: 'yachts' },
            ]),
          ]}
        />
      )}

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
            Yacht Cruises
          </p>
          <h1 className="t2-heading t2-heading-xl" style={{ color: '#FFFFFF', maxWidth: 940 }}>
            Luxury yacht cruises with Virtuoso benefits.
          </h1>
          <p
            style={{
              fontFamily: 'var(--t2-font-sans)', fontSize: 16.5, fontWeight: 300,
              lineHeight: 1.85, color: 'rgba(255,255,255,0.86)',
              maxWidth: 660, marginTop: 22,
            }}
          >
            The Ritz-Carlton Yacht Collection, Four Seasons Yachts, Aman at Sea, and Orient
            Express Sailing Yachts. Every accommodation is a suite with a private terrace, and
            every sailing carries 100 to 450 guests — not several thousand.
          </p>
          <div style={{ marginTop: 34, display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={`${base}/contact`} className="t2-btn t2-btn-accent">
              Check my dates
            </Link>
          </div>
          <p
            style={{
              fontFamily: 'var(--t2-font-sans)', fontSize: 12, fontWeight: 300,
              letterSpacing: '0.04em', color: 'rgba(255,255,255,0.62)', marginTop: 18,
            }}
          >
            Virtuoso member · Same fare as booking direct · Reply within one business day
          </p>
        </div>
      </section>

      {/* ── The fleet — alternating editorial rows ─────────────────────── */}
      <section className="t2-section">
        <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto clamp(52px, 6vw, 84px)' }}>
          <p className="t2-label" style={{ marginBottom: 14 }}>The Fleet</p>
          <h2 className="t2-heading t2-heading-lg" style={{ margin: 0 }}>
            The four yacht lines we book.
          </h2>
          <p className="t2-body" style={{ marginTop: 20 }}>
            Each is a Virtuoso preferred partner, so every sailing below can carry shipboard
            credit and a private shore event.
          </p>
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

                  {/* Outline, not accent: these are navigation into the detail
                      pages. The filled accent button is reserved for the one
                      conversion action so it stays visually dominant. */}
                  <Link href={`${base}/find-cruise/${y.slug}`} className="t2-btn t2-btn-outline">
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
        heading="What you get booking through us."
        label="Your Benefits"
      />

      <T2HowItWorks
        steps={YACHT_STEPS}
        heading="How booking a yacht cruise works"
        ctaHref={`${base}/contact`}
        ctaLabel="Check my dates"
      />

      <T2Faq
        faqs={YACHT_FAQS}
        heading="Luxury yacht cruise questions"
        contactHref={`${base}/contact`}
      />

      {/* ── Enquiry ────────────────────────────────────────────────────── */}
      <T2LeadForm
        agentId={agentId}
        heading="Check availability for your dates"
        subheading="Tell us the season and the coastline. We'll come back within one business day with the yachts sailing it, the suites still open, and the real fare — with Virtuoso benefits attached."
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
