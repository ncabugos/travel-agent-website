import Image from 'next/image'
import Link from 'next/link'
import { getSupplierProducts } from '@/lib/collections'
import { getHotelPrograms } from '@/lib/hotel-programs'
import { T2ExperiencesGrid } from '@/components/t2/T2ExperiencesGrid'
import { T2BenefitsGrid } from '@/components/t2/T2BenefitsGrid'
import { T2LeadFormLight } from '@/components/t2/T2LeadFormLight'
import { getAgentProfile } from '@/lib/suppliers'
import { buildMetadata } from '@/lib/seo'
import type { Metadata } from 'next'
import { tierAllows, type Tier } from '@/lib/tier-features'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ agentId: string }>
}

/**
 * The advisor's wellness surface. Every house listed here is one we hold a
 * preferred-partner relationship with — the list is intersected against the
 * live `hotel_programs` catalogue below, so a programme that is deactivated
 * drops off this page rather than advertising access we no longer have.
 *
 * `focus` describes what that brand's wellness offer actually is; it is not a
 * benefit claim (those live on the programme page, sourced from the DB).
 */
const WELLNESS_HOUSES: { slug: string; focus: string; image: string }[] = [
  {
    slug: 'six-senses',
    focus: 'Hydrothermal circuits, sleep and longevity programmes, and an Earth Lab at every property.',
    image: '/media/hotel-programs/six-senses/Six_Senses-Featured%20Slider%203%201500.jpg',
  },
  {
    slug: 'aman-hotels-and-resorts',
    focus: 'Aman Spa houses built around the landscape they sit in — desert, jungle, alpine.',
    image: '/media/hotel-programs/aman/aman-hero-2000.jpg',
  },
  {
    slug: 'como-hotels',
    focus: 'COMO Shambhala — the original destination wellness estate, and still the reference point.',
    image: '/media/hotel-programs/como-hotels/COMO-hotels-1500-1.jpg',
  },
  {
    slug: 'rocco-forte-hotels',
    focus: 'Forte Spa across Sicily and Puglia, where the treatment menu follows the harvest.',
    image: '/media/hotel-programs/rocco-forte/RoccoForte-masseria-torre-maizza-pool-7664-jg-may-19.jpg',
  },
  {
    slug: 'rosewood-elite',
    focus: 'Asaya — Rosewood’s integrative wellness concept, built around a long stay rather than a treatment.',
    image: '/media/hotel-programs/rosewood-elite/rosewood-miramar-hero-scaled.jpg',
  },
  {
    slug: 'montage-hotels',
    focus: 'Spa Montage: large, unhurried American spas with the water rituals to match.',
    image: '/media/hotel-programs/montage/montage-cabo-spa_pool-1500.jpg',
  },
]

/** Editorial groupings — how a wellness trip actually gets shaped, not a product list. */
const DISCIPLINES = [
  {
    title: 'Thermal & Hydrotherapy',
    body: 'Hammams, vitality pools, snow rooms, and the cold-plunge circuits worth planning a stay around.',
    image: '/media/hotel-programs/six-senses/Six_Senses-Featured%20Slider%202%201500.jpg',
  },
  {
    title: 'Movement & Open Water',
    body: 'Sunrise practice, mountain air, and coastlines that make the morning session the reason you came.',
    image: '/media/hotel-programs/six-senses/Six_Senses-post-content-2-1080.jpg',
  },
  {
    title: 'The Spa Sabbatical',
    body: 'Seven nights or more on a structured programme — the format where the results actually hold.',
    image: '/media/hotel-programs/montage/montage-cabo-spa_pool-1500.jpg',
  },
  {
    title: 'Vine & Table',
    body: 'Wine country on a wellness footing: estate tables, kitchen gardens, and a cellar worth the detour.',
    image: '/media/hotel-programs/rocco-forte/RoccoForte-masseria-torre-maizza-pool-7664-jg-may-19.jpg',
  },
]

/** What the advisor adds to a wellness booking. Services rendered, not perks promised. */
const WELLNESS_SERVICE = [
  {
    icon: 'spa',
    title: 'Treatments Booked Before Arrival',
    description: 'The therapists and time slots worth having go first. We reserve them while you are still deciding on flights.',
  },
  {
    icon: 'priority',
    title: 'Programme Matching',
    description: 'Sleep, movement, detox, recovery — we match the property to the outcome rather than the other way round.',
  },
  {
    icon: 'dining',
    title: 'Dietary Brief Ahead of Check-In',
    description: 'Requirements and preferences reach the kitchen before you land, so the first dinner is already right.',
  },
  {
    icon: 'vip',
    title: 'Partner Programme Benefits',
    description: 'Every house here is one we hold a preferred partnership with — the stay carries those privileges.',
  },
]

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { agentId } = await params
  const agent = await getAgentProfile(agentId)
  if (!agent) return {}

  const isWwt = agent.bespoke_layout === 'wwt' || agentId === 'wwt-demo'
  return buildMetadata({
    agent,
    title: isWwt ? 'Wellness' : 'Curated Experiences',
    description: isWwt
      ? 'Wellness travel arranged through preferred partnerships with Six Senses, Aman, COMO Shambhala, Rocco Forte, Rosewood and Montage — with treatments booked before you arrive.'
      : 'Bespoke private journeys and once-in-a-lifetime experiences across 2,500+ destinations, designed by your advisor with exclusive Virtuoso access.',
    path: 'experiences',
  })
}

export default async function ExperiencesPage({ params }: PageProps) {
  const { agentId } = await params

  // Experiences directory is a Growth+ feature. Return 404 on Starter.
  const agent = await getAgentProfile(agentId)
  if (!tierAllows(agent?.tier as Tier | null | undefined, 'experiences')) {
    notFound()
  }

  const base = `/t2/${agentId}`
  // Match the layout's signal (app/t2/[agentId]/layout.tsx) rather than the
  // demo slug alone — keying on 'wwt-demo' meant the real agent never hit this
  // branch and shipped the generic placeholder itineraries instead.
  const isWwt = agent?.bespoke_layout === 'wwt' || agentId === 'wwt-demo'

  if (isWwt) {
    // Intersect the curated list with the live catalogue so the page can never
    // advertise a programme the operator has switched off.
    const programs = await getHotelPrograms()
    const bySlug = new Map(programs.map((p) => [p.slug, p]))
    const houses = WELLNESS_HOUSES.flatMap((h) => {
      const program = bySlug.get(h.slug)
      return program ? [{ ...h, name: program.name, tagline: program.tagline }] : []
    })

    return (
      <>
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section style={{ position: 'relative', height: 'clamp(520px, 76vh, 820px)', overflow: 'hidden' }}>
          <Image
            src="/media/hotel-programs/como-hotels/Como-hero-tuscany-2200.jpg"
            alt="A wellness estate at first light"
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center 55%' }}
            sizes="100vw"
            unoptimized
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.28), rgba(0,0,0,0.62))',
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
            <p className="t2-label" style={{ marginBottom: 16, color: 'rgba(255,255,255,0.82)' }}>Wellness</p>
            <h1 className="t2-heading t2-heading-xl" style={{ color: '#FFFFFF', maxWidth: 900 }}>
              Time away that actually changes something.
            </h1>
            <p
              style={{
                fontFamily: 'var(--t2-font-sans)', fontSize: 16, fontWeight: 300,
                lineHeight: 1.85, color: 'rgba(255,255,255,0.82)',
                maxWidth: 640, marginTop: 22,
              }}
            >
              The houses below are the ones we hold preferred partnerships with. We book the
              treatments before you arrive, brief the kitchen on how you eat, and match the
              programme to what you actually want out of the week.
            </p>
          </div>
        </section>

        {/* ── The houses ───────────────────────────────────────────────── */}
        <section className="t2-section">
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto clamp(48px, 6vw, 76px)' }}>
            <p className="t2-label" style={{ marginBottom: 14 }}>The Houses</p>
            <h2 className="t2-heading t2-heading-lg" style={{ margin: 0 }}>
              Six wellness brands, booked as a partner.
            </h2>
            <p className="t2-body" style={{ marginTop: 22 }}>
              Each carries its own programme benefits on every stay. Open a house to see exactly
              what it includes.
            </p>
          </div>

          <div className="t2-wellness-grid">
            {houses.map((h) => (
              <Link key={h.slug} href={`${base}/book-hotel/${h.slug}`} className="t2-wellness-card">
                <div className="t2-wellness-media">
                  <Image
                    src={h.image}
                    alt={h.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 700px) 100vw, (max-width: 1040px) 50vw, 33vw"
                    unoptimized
                  />
                </div>
                <h3 className="t2-wellness-name">{h.name}</h3>
                <p className="t2-wellness-focus">{h.focus}</p>
                <span className="t2-wellness-cue">View the programme</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Disciplines ──────────────────────────────────────────────── */}
        <section className="t2-section" style={{ background: 'var(--t2-bg-alt)', maxWidth: 'none' }}>
          <div style={{ maxWidth: 'var(--t2-content-max, 1280px)', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: 620, margin: '0 auto clamp(44px, 5vw, 68px)' }}>
              <p className="t2-label" style={{ marginBottom: 14 }}>How We Shape It</p>
              <h2 className="t2-heading t2-heading-lg" style={{ margin: 0 }}>
                Start from the week you want back.
              </h2>
            </div>

            <div className="t2-discipline-grid">
              {DISCIPLINES.map((d) => (
                <article key={d.title} className="t2-discipline">
                  <div className="t2-discipline-media">
                    <Image
                      src={d.image}
                      alt={d.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 760px) 100vw, 50vw"
                      unoptimized
                    />
                  </div>
                  <h3 className="t2-discipline-title">{d.title}</h3>
                  <p className="t2-discipline-body">{d.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── What we add ──────────────────────────────────────────────── */}
        <T2BenefitsGrid
          benefits={WELLNESS_SERVICE}
          heading="What booking through us adds."
          label="The Difference"
        />

        {/* ── Enquiry ──────────────────────────────────────────────────── */}
        <T2LeadFormLight
          agentId={agentId}
          heading="Plan a wellness stay"
          subheading="Tell us what you want the week to do — sleep, reset, movement, or simply quiet. We'll match the house to it and arrange the rest."
        />

        <style>{`
          .t2-wellness-grid {
            display: flex; flex-wrap: wrap; justify-content: center;
            gap: clamp(36px, 4vw, 56px) clamp(24px, 3vw, 40px);
            max-width: 1180px; margin: 0 auto;
          }
          .t2-wellness-card {
            flex: 0 1 330px; max-width: 360px;
            text-decoration: none; color: inherit; display: block;
          }
          .t2-wellness-media {
            position: relative; aspect-ratio: 4 / 5; overflow: hidden;
            margin-bottom: 22px; background: var(--t2-divider);
          }
          .t2-wellness-media img {
            transition: transform 900ms var(--t2-ease, ease);
          }
          .t2-wellness-card:hover .t2-wellness-media img { transform: scale(1.04); }
          .t2-wellness-name {
            font-family: var(--t2-font-serif); font-weight: 400;
            font-size: 21px; line-height: 1.3; color: var(--t2-text); margin: 0 0 10px;
          }
          .t2-wellness-focus {
            font-family: var(--t2-font-sans); font-size: 13.5px; font-weight: 300;
            line-height: 1.8; color: var(--t2-text-muted); margin: 0 0 16px;
          }
          .t2-wellness-cue {
            font-family: var(--t2-font-sans); font-size: 10.5px; font-weight: 500;
            letter-spacing: 0.2em; text-transform: uppercase; color: var(--t2-accent);
            border-bottom: 1px solid currentColor; padding-bottom: 3px;
          }

          .t2-discipline-grid {
            display: grid; grid-template-columns: repeat(2, 1fr);
            gap: clamp(36px, 4vw, 60px) clamp(28px, 3vw, 48px);
          }
          @media (max-width: 760px) {
            .t2-discipline-grid { grid-template-columns: 1fr; }
          }
          .t2-discipline-media {
            position: relative; aspect-ratio: 16 / 10; overflow: hidden;
            margin-bottom: 22px; background: var(--t2-divider);
          }
          .t2-discipline-title {
            font-family: var(--t2-font-serif); font-weight: 400;
            font-size: 23px; line-height: 1.3; color: var(--t2-text); margin: 0 0 10px;
          }
          .t2-discipline-body {
            font-family: var(--t2-font-sans); font-size: 14px; font-weight: 300;
            line-height: 1.8; color: var(--t2-text-muted); margin: 0; max-width: 46ch;
          }
          @media (prefers-reduced-motion: reduce) {
            .t2-wellness-media img { transition: none; }
            .t2-wellness-card:hover .t2-wellness-media img { transform: none; }
          }
        `}</style>
      </>
    )
  }

  // ── Generic t2 advisors: the curated-experiences directory, unchanged ────
  const products = await getSupplierProducts()
  const visibleProducts = products.filter((p) => p.category === 'experience')

  return (
    <>
      {/* ── Hero ── */}
      <section style={{ position: 'relative', height: 850, overflow: 'hidden' }}>
        <Image
          src="/media/hotel-programs/four-seasons/fs-MAU_1261_original.jpg"
          alt="Curated Experiences"
          fill
          priority
          style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
          sizes="100vw"
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))' }} />
        <div style={{
          position: 'relative', zIndex: 2, height: '100%',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center', textAlign: 'center',
          padding: '0 24px',
        }}>
          <p className="t2-label" style={{ marginBottom: 14, color: 'var(--t2-accent)' }}>Bespoke Travel</p>
          <h1 className="t2-heading t2-heading-xl" style={{ color: '#ffffff', maxWidth: 860 }}>
            Curated Experiences
          </h1>
          <p style={{
            fontFamily: 'var(--t2-font-sans)', fontSize: 16, fontWeight: 300,
            lineHeight: 1.8, color: 'rgba(255,255,255,0.8)',
            maxWidth: 620, marginTop: 20,
          }}>
            A hand-selected portfolio of bespoke private journeys and curated itineraries — designed around you and arranged exclusively through your advisor.
          </p>
        </div>
      </section>

      {/* ── Grid section ── */}
      <section style={{ background: 'var(--t2-bg)', padding: '80px 48px' }}>
        <div style={{ maxWidth: 'var(--t2-content-max, 1280px)', margin: '0 auto' }}>
          <T2ExperiencesGrid
            products={visibleProducts}
            agentId={agentId}
            showCategoryTabs={false}
            restLabel="More Experiences"
          />
        </div>
      </section>

      {/* ── Traveller CTA band ── */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        padding: '120px 24px', textAlign: 'center',
      }}>
        <Image
          src="/media/hero images/four-seasons-yacht-hero.jpg"
          alt="Plan your journey"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center 60%' }}
          sizes="100vw"
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(10,8,6,0.55) 0%, rgba(10,8,6,0.75) 100%)',
        }} />

        <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <h2 className="t2-heading t2-heading-lg" style={{ color: '#ffffff', marginBottom: 20 }}>
            Plan Your Perfect Journey
          </h2>
          <p style={{
            fontFamily: 'var(--t2-font-sans)', fontSize: 15, lineHeight: 1.9,
            color: 'rgba(255,255,255,0.65)', marginBottom: 36,
          }}>
            Every experience on this page is available exclusively through your advisor. Get in touch and we&rsquo;ll handle every detail — from booking to beyond.
          </p>
          <Link
            href={`${base}/contact`}
            style={{
              display: 'inline-block',
              fontFamily: 'var(--t2-font-sans)', fontSize: 11, letterSpacing: '0.2em',
              textTransform: 'uppercase', fontWeight: 500,
              padding: '16px 40px',
              background: 'var(--t2-accent)', color: '#ffffff',
              textDecoration: 'none',
            }}
          >
            Start Planning
          </Link>
        </div>
      </section>
    </>
  )
}
