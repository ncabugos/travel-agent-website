import Image from 'next/image'
import Link from 'next/link'
import { getSupplierProducts } from '@/lib/collections'
import { getHotelPrograms } from '@/lib/hotel-programs'
import { T2ExperiencesGrid } from '@/components/t2/T2ExperiencesGrid'
import { T2BenefitsGrid } from '@/components/t2/T2BenefitsGrid'
import { T2LeadFormLight } from '@/components/t2/T2LeadFormLight'
import { T2Faq, type Faq } from '@/components/t2/T2Faq'
import { T2HowItWorks } from '@/components/t2/T2HowItWorks'
import {
  JsonLd, faqSchema, categoryServiceSchema, itemListSchema, breadcrumbSchema,
} from '@/components/seo/JsonLd'
import { getAgentProfile } from '@/lib/suppliers'
import { buildMetadata } from '@/lib/seo'
import type { Metadata } from 'next'
import { tierAllows, type Tier } from '@/lib/tier-features'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ agentId: string }>
}

/**
 * The advisor's wellness surface. Every brand listed here is one we hold a
 * preferred-partner relationship with — the list is intersected against the
 * live `hotel_programs` catalogue below, so a programme that is deactivated
 * drops off this page rather than advertising access we no longer have.
 *
 * `focus` describes what that brand's wellness offer actually is; it is not a
 * benefit claim (those live on the programme page, sourced from the DB).
 *
 * Naming note: "brand", never "house". The operator's voice rules reject
 * "house" as a synonym for a hotel group.
 */
const WELLNESS_BRANDS: { slug: string; focus: string; image: string }[] = [
  {
    slug: 'six-senses',
    focus: 'Hydrothermal circuits, sleep and longevity programmes, and an Earth Lab at every property.',
    image: '/media/hotel-programs/six-senses/Six_Senses-Featured%20Slider%203%201500.jpg',
  },
  {
    slug: 'aman-hotels-and-resorts',
    focus: 'Aman Spa — destination spas in desert, jungle, and alpine settings.',
    image: '/media/hotel-programs/aman/aman-hero-2000.jpg',
  },
  {
    slug: 'como-hotels',
    focus: 'COMO Shambhala — nutrition, movement and Ayurvedic programmes at estate scale.',
    image: '/media/hotel-programs/como-hotels/COMO-hotels-1500-1.jpg',
  },
  {
    slug: 'rocco-forte-hotels',
    focus: 'Forte Spa across Sicily and Puglia, with treatments built around the local harvest.',
    image: '/media/hotel-programs/rocco-forte/RoccoForte-masseria-torre-maizza-pool-7664-jg-may-19.jpg',
  },
  {
    slug: 'rosewood-elite',
    focus: 'Asaya — Rosewood’s wellness programme, built for a multi-night stay rather than a single treatment.',
    image: '/media/hotel-programs/rosewood-elite/rosewood-miramar-hero-scaled.jpg',
  },
  {
    slug: 'montage-hotels',
    focus: 'Spa Montage — large American spa floors with full hydrotherapy circuits.',
    image: '/media/hotel-programs/montage/montage-cabo-spa_pool-1500.jpg',
  },
]

/** Editorial groupings — how a wellness trip actually gets shaped, not a product list. */
const DISCIPLINES = [
  {
    title: 'Thermal & Hydrotherapy',
    body: 'Hammams, vitality pools, snow rooms, and cold-plunge circuits — the resorts with a full thermal floor.',
    image: '/media/hotel-programs/six-senses/Six_Senses-Featured%20Slider%202%201500.jpg',
  },
  {
    title: 'Movement & Open Water',
    body: 'Sunrise yoga, guided hikes, and open-water swimming, at resorts where the morning session is the point.',
    image: '/media/hotel-programs/six-senses/Six_Senses-post-content-2-1080.jpg',
  },
  {
    title: 'Multi-Night Programmes',
    body: 'Seven nights or more on a structured sleep, detox, or fitness programme, with a practitioner assigned throughout.',
    image: '/media/hotel-programs/montage/montage-cabo-spa_pool-1500.jpg',
  },
  {
    title: 'Wine Country Wellness',
    body: 'Vineyard estates with a full spa: kitchen-garden menus, cellar tastings, and treatments between them.',
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
    title: 'Preferred Partner Benefits at No Extra Cost',
    description: 'Room upgrade, daily breakfast for two, and a property credit on qualifying stays. You pay the same rate as booking direct.',
  },
]

const WELLNESS_FAQS: Faq[] = [
  {
    q: 'How much does a luxury wellness retreat cost?',
    a: 'Expect roughly $900 to $2,500 per night at Six Senses, Aman, COMO Shambhala, Rocco Forte, Rosewood, or Montage, before programme fees. Structured multi-night programmes — sleep, detox, fitness — are usually priced on top of the room rate and run from about $1,500 for a three-day programme. We quote exact figures for your dates.',
  },
  {
    q: 'Does booking a wellness retreat through a travel advisor cost more?',
    a: 'No. You pay the resort\u2019s own rate, and the stay carries preferred-partner benefits on top: a room upgrade on arrival, daily breakfast for two, and a property credit on qualifying bookings. Our commission is paid by the resort.',
  },
  {
    q: 'Which wellness resort is best for sleep?',
    a: 'Six Senses runs the most developed sleep programme, with a dedicated Sleep Doctor, in-room tracking, and a multi-night protocol across its resorts. COMO Shambhala is the stronger choice for nutrition-led resets, and Lanserhof-style medical diagnostics sit outside the brands we hold partnerships with.',
  },
  {
    q: 'How long should a wellness stay be?',
    a: 'Seven nights is the shortest stay where a structured programme produces a result that holds. Three to four nights works for a spa-led break, but the sleep, detox, and fitness programmes at these resorts are all designed around a week or more.',
  },
  {
    q: 'Can you book treatments before we arrive?',
    a: 'Yes, and it is the main reason to book through us. The best therapists and the prime time slots are reserved weeks ahead, so we book them while you are still deciding on flights, and brief the kitchen on dietary requirements before you land.',
  },
]

const WELLNESS_STEPS = [
  {
    title: 'Tell us what the week should do',
    body: 'Sleep, reset, movement, or simply quiet. No dates or budget needed to start.',
  },
  {
    title: 'We match the resort to the outcome',
    body: 'You get two or three options with real rates, programme details, and what each one is genuinely good at.',
  },
  {
    title: 'We book the stay and everything inside it',
    body: 'Treatments reserved, dietary requirements sent ahead, and preferred-partner benefits attached.',
  },
]

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { agentId } = await params
  const agent = await getAgentProfile(agentId)
  if (!agent) return {}

  const isWwt = agent.bespoke_layout === 'wwt'
  return buildMetadata({
    agent,
    title: isWwt ? 'Luxury Wellness Retreats & Spa Resorts' : 'Curated Experiences',
    description: isWwt
      ? 'Book Six Senses, Aman, COMO Shambhala, Rocco Forte, Rosewood and Montage as a preferred partner. Room upgrade, daily breakfast, and a resort credit at no extra cost — with treatments reserved before you arrive.'
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
  // Match the layout's signal (app/t2/[agentId]/layout.tsx).
  const isWwt = agent?.bespoke_layout === 'wwt'

  if (isWwt) {
    // Intersect the curated list with the live catalogue so the page can never
    // advertise a programme the operator has switched off.
    const programs = await getHotelPrograms()
    const bySlug = new Map(programs.map((p) => [p.slug, p]))
    const houses = WELLNESS_BRANDS.flatMap((h) => {
      const program = bySlug.get(h.slug)
      return program ? [{ ...h, name: program.name, tagline: program.tagline }] : []
    })

    return (
      <>
        {agent && (
          <JsonLd
            data={[
              categoryServiceSchema(agent, {
                name: `Luxury Wellness Retreat Booking — ${agent.agency_name}`,
                description:
                  'Preferred-partner booking for Six Senses, Aman, COMO Shambhala, Rocco Forte, Rosewood and Montage wellness resorts, including room upgrade, daily breakfast and a resort credit on qualifying stays.',
                path: 'experiences',
                serviceType: 'Luxury Wellness Retreat Booking',
              }),
              itemListSchema(agent, {
                name: 'Wellness resort brands',
                path: 'experiences',
                items: houses.map((h) => ({
                  name: h.name,
                  description: h.focus,
                  path: `book-hotel/${h.slug}`,
                })),
              }),
              faqSchema(WELLNESS_FAQS.map((f) => ({ q: f.q, a: f.a }))),
              breadcrumbSchema(agent, [
                { name: 'Home', path: '' },
                { name: 'Wellness', path: 'experiences' },
              ]),
            ]}
          />
        )}

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
            <p className="t2-label" style={{ marginBottom: 16, color: 'rgba(255,255,255,0.82)' }}>Wellness Travel</p>
            <h1 className="t2-heading t2-heading-xl" style={{ color: '#FFFFFF', maxWidth: 940 }}>
              Luxury wellness retreats, booked as a preferred partner.
            </h1>
            <p
              style={{
                fontFamily: 'var(--t2-font-sans)', fontSize: 16.5, fontWeight: 300,
                lineHeight: 1.85, color: 'rgba(255,255,255,0.86)',
                maxWidth: 660, marginTop: 22,
              }}
            >
              Six Senses, Aman, COMO Shambhala, Rocco Forte, Rosewood, and Montage. You get a room
              upgrade, daily breakfast for two, and a resort credit at no extra cost — and your
              treatments are reserved before you arrive.
            </p>
            <div style={{ marginTop: 34, display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href={`${base}/contact`} className="t2-btn t2-btn-accent">
                Plan my wellness stay
              </Link>
            </div>
            <p
              style={{
                fontFamily: 'var(--t2-font-sans)', fontSize: 12, fontWeight: 300,
                letterSpacing: '0.04em', color: 'rgba(255,255,255,0.62)', marginTop: 18,
              }}
            >
              Virtuoso member · Same rate as booking direct · Reply within one business day
            </p>
          </div>
        </section>

        {/* ── The houses ───────────────────────────────────────────────── */}
        <section className="t2-section">
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto clamp(48px, 6vw, 76px)' }}>
            <p className="t2-label" style={{ marginBottom: 14 }}>The Brands</p>
            <h2 className="t2-heading t2-heading-lg" style={{ margin: 0 }}>
              Six wellness brands we book as a preferred partner.
            </h2>
            <p className="t2-body" style={{ marginTop: 22 }}>
              Each carries its own benefits on every stay. Open a brand to see exactly what is
              included.
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
              <p className="t2-label" style={{ marginBottom: 14 }}>By Focus</p>
              <h2 className="t2-heading t2-heading-lg" style={{ margin: 0 }}>
                Choose the kind of wellness stay you want.
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
          heading="What you get booking through us."
          label="Your Benefits"
        />

        <T2HowItWorks
          steps={WELLNESS_STEPS}
          heading="How planning a wellness stay works"
          ctaHref={`${base}/contact`}
          ctaLabel="Plan my wellness stay"
        />

        <T2Faq
          faqs={WELLNESS_FAQS}
          heading="Wellness travel questions"
          contactHref={`${base}/contact`}
        />

        {/* ── Enquiry ──────────────────────────────────────────────────── */}
        <T2LeadFormLight
          agentId={agentId}
          heading="Plan my wellness stay"
          subheading="Tell us what you want the week to do — sleep, reset, movement, or simply quiet. We'll come back within one business day with two or three resorts, real rates, and what each one is genuinely good at."
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
