import { getCruiseLine, getAllCruiseLineSlugs } from '@/lib/cruise-lines'
import { getSupplierPromo } from '@/lib/supplier-promos'
import { getAgentProfile } from '@/lib/suppliers'
import { getBlogPostsBySupplier } from '@/lib/blog'
import { getCruiseLogo, getCruiseGallery } from '@/lib/media-library'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { T2HotelGallery } from '@/components/t2/T2HotelGallery'
import { T2BenefitsGrid } from '@/components/t2/T2BenefitsGrid'
import { T2PromoBanner } from '@/components/t2/T2PromoBanner'
import { T2RelatedArticles } from '@/components/t2/T2RelatedArticles'
import { T2VideoFilm } from '@/components/t2/T2VideoFilm'
import {
  T2CruiseDestinations,
  T2CruiseExperiences,
  T2CruiseSuites,
  T2CruiseJourneys,
} from '@/components/t2/T2CruiseSections'

// Virtuoso Voyages perks shown when a cruise line has no DB-sourced benefits yet.
const DEFAULT_CRUISE_BENEFITS = [
  { title: 'Dedicated Onboard Host', description: 'A personal Virtuoso host sails with your group, present throughout the voyage to answer questions and ensure every detail runs exactly as planned.' },
  { title: 'Private Welcome Reception', description: 'An exclusive cocktail reception at the start of each sailing, arranged solely for Virtuoso Voyages guests with introductions facilitated by your host.' },
  { title: 'Shipboard Credit', description: '$100 per stateroom on voyages under 14 nights; $200 per stateroom on voyages of 14 nights or more, to spend freely on dining, spa, or excursions.' },
  { title: 'Exclusive Shore Experience', description: 'A private shore excursion, VIP tour, or private car and driver whose itinerary is shaped entirely around your interests and pace — never a group schedule.' },
  { title: 'Specialty Dining', description: 'Complimentary reservations at specialty restaurants on select sailings, including chef\'s tastings and curated wine pairings on participating vessels.' },
  { title: 'Spa & Wellness Access', description: 'Select spa treatments, wellness credits, and onboard amenities included on participating voyages across our preferred cruise partners.' },
]

// Editorial imagery for the benefit cards, drawn from the local supplier media
// library (public/media/cruises). Matched to the benefit by keyword so
// DB-sourced benefit titles get sensible imagery too; falls back by index.
const BENEFIT_IMAGES: { match: RegExp; src: string; alt: string }[] = [
  { match: /welcome|reception|champagne|celebrat/i, src: '/media/cruises/crystal/world-cruise-welcome-celebration-champagne.jpg', alt: 'A champagne welcome celebration' },
  { match: /host|concierge|butler|dedicated/i, src: '/media/cruises/cunard/cunard-Grand-Lobby-hero.jpg', alt: 'The grand lobby where guests are received' },
  { match: /credit|spend|amenit|onboard/i, src: '/media/cruises/uniworld/uniworld-lounge-bar.jpg', alt: 'An elegant onboard lounge and bar' },
  { match: /shore|excursion|tour|destination|explore|private car/i, src: '/media/cruises/uniworld/uniworld-douro.jpg', alt: 'A shore excursion through the Douro vineyards' },
  { match: /dining|restaurant|culinary|chef|cuisine|tasting|wine/i, src: '/media/cruises/ama-waterways/amawaterways-amamagna-wine_dinner-1500.jpg', alt: 'A private wine dinner on board' },
  { match: /spa|wellness|fitness|health|treatment/i, src: '/media/cruises/scenic/scenic-spa-1500.jpg', alt: 'The onboard spa and wellness sanctuary' },
]
const BENEFIT_IMAGE_FALLBACK = BENEFIT_IMAGES.map((b) => ({ src: b.src, alt: b.alt }))
function benefitImage(title: string, i: number): { src: string; alt: string } {
  const hit = BENEFIT_IMAGES.find((b) => b.match.test(title))
  if (hit) return { src: hit.src, alt: hit.alt }
  return BENEFIT_IMAGE_FALLBACK[i % BENEFIT_IMAGE_FALLBACK.length]
}

interface PageProps {
  params: Promise<{ agentId: string; cruiseSlug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllCruiseLineSlugs()
  return slugs.map(slug => ({ cruiseSlug: slug }))
}

export default async function CruiseDetailPage({ params }: PageProps) {
  const { agentId, cruiseSlug } = await params
  const [cruise, promo, relatedPosts, agent] = await Promise.all([
    getCruiseLine(cruiseSlug),
    getSupplierPromo('cruise_line', cruiseSlug),
    getBlogPostsBySupplier(`cruise:${cruiseSlug}`, agentId),
    getAgentProfile(agentId),
  ])
  if (!cruise) notFound()

  const base = `/t2/${agentId}`
  // Supplier copy is shared across advisors — never name one agency here.
  const agencyName = agent?.agency_name?.trim() || 'us'
  // Prefer DB value, fall back to slug-based asset lookup so cruise lines
  // whose logo_url_white column is null still get a hero logo when we ship
  // the corresponding asset in public/assets/supplier logos/.../cruise/.
  const heroLogoUrl = cruise.logo_url_white || getCruiseLogo(cruise.slug, 'white')
  // Prefer DB slider_images; fall back to slug-keyed gallery in media-library
  // so cruise lines that haven't had their gallery uploaded to the DB still
  // get a Gallery + promo-banner image when we ship the assets to /public.
  const gallerySlides = (cruise.slider_images && cruise.slider_images.length > 0)
    ? cruise.slider_images
    : getCruiseGallery(cruise.slug)

  // DB-sourced benefits, falling back to the standard Virtuoso Voyages perks so
  // every existing cruise line keeps its block until enriched in the DB.
  const benefits = (cruise.benefits && cruise.benefits.length > 0)
    ? cruise.benefits
    : DEFAULT_CRUISE_BENEFITS

  return (
    <>
      {/* ── Hero 800px ── */}
      <section
        style={{
          position: 'relative',
          height: 800,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--t2-dark-bg)',
        }}
      >
        {cruise.hero_image_url && (
          <Image
            src={cruise.hero_image_url}
            alt={cruise.name}
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            sizes="100vw"
            unoptimized
          />
        )}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(20,18,16,0.4) 0%, rgba(20,18,16,0.7) 100%)',
        }} />

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px', maxWidth: 820 }}>
          {/* Only render an image if we have a transparent white logo — never filter opaque images */}
          {heroLogoUrl ? (
            <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'center' }}>
              <Image
                src={heroLogoUrl}
                alt={`${cruise.name} logo`}
                width={520}
                height={170}
                style={{ objectFit: 'contain', maxHeight: 160, maxWidth: 'min(520px, 70vw)', width: 'auto', height: 'auto' }}
                unoptimized
              />
            </div>
          ) : (
            <h1 style={{
              fontFamily: 'var(--t2-font-serif)',
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 400,
              color: '#FFFFFF',
              letterSpacing: '0.04em',
              marginBottom: 20,
              lineHeight: 1.1,
            }}>
              {cruise.name}
            </h1>
          )}

          {/* Tagline */}
          {cruise.tagline && (
            <p style={{
              fontFamily: 'var(--t2-font-sans)',
              fontSize: 14,
              letterSpacing: '0.12em',
              color: 'rgba(255,255,255,0.85)',
              textTransform: 'uppercase',
              marginBottom: cruise.description ? 22 : 0,
            }}>
              {cruise.tagline}
            </p>
          )}

          {/* Description */}
          {cruise.description && (
            <p style={{
              fontFamily: 'var(--t2-font-sans)',
              fontSize: 'clamp(15px, 1.2vw, 17px)',
              lineHeight: 1.75,
              color: 'rgba(255,255,255,0.85)',
              margin: '0 auto',
              maxWidth: 680,
            }}>
              {cruise.description}
            </p>
          )}
        </div>
      </section>

      {/* ── Overview intro ── */}
      {cruise.intro && (
        <section className="t2-section">
          <div style={{ maxWidth: 820, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
            <span style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--t2-primary)', opacity: 0.6, display: 'block', marginBottom: 16 }}>
              {cruise.intro.eyebrow}
            </span>
            <h2 className="t2-heading" style={{ fontSize: 'clamp(30px, 4vw, 48px)', marginBottom: 28, lineHeight: 1.15 }}>
              {cruise.intro.heading}
            </h2>
            <p className="t2-body t2-body-center" style={{ fontSize: 'clamp(16px, 1.3vw, 18px)', lineHeight: 1.9 }}>
              {cruise.intro.body}
            </p>
          </div>
        </section>
      )}

      {/* ── Cinematic film ── */}
      {cruise.video_url && (
        <T2VideoFilm
          videoUrl={cruise.video_url}
          posterUrl={cruise.video_poster_url ?? cruise.hero_image_url}
          heading={`${cruise.name}, in motion`}
        />
      )}

      {/* ── Virtuoso Voyages ── */}
      <section className="t2-section" style={{ background: 'var(--t2-bg-alt)', maxWidth: 'none', paddingBottom: 'clamp(56px, 8vw, 96px)' }}>
        <div style={{ width: '100%', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 64px' }}>
            <span style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--t2-primary)', opacity: 0.6, display: 'block', marginBottom: 16 }}>
              Virtuoso Voyages
            </span>
            <h2 className="t2-heading" style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', marginBottom: 20 }}>
              Benefits included on every booking.
            </h2>
            <p className="t2-body t2-body-center" style={{ fontSize: 16, lineHeight: 1.85 }}>
              As a member of Virtuoso Voyages, we are able to offer our clients exclusive benefits on every sailing — arranged before you board and confirmed directly through us.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 40,
          }} className="t2-voyages-grid">
            {benefits.map((p, i) => {
              const img = (p as { image?: string }).image
                ? { src: (p as { image?: string }).image as string, alt: p.title }
                : benefitImage(p.title, i)
              return (
                <article key={p.title} className="t2-voyage-card" style={{
                  background: '#fff',
                  borderRadius: 'var(--t2-radius-lg)',
                  border: '1px solid var(--t2-divider)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  <div className="t2-voyage-card-media">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
                      style={{ objectFit: 'cover' }}
                    />
                    <span className="t2-voyage-card-num">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div style={{ padding: '26px 28px 30px' }}>
                    <h3 style={{ fontFamily: 'var(--t2-font-serif)', fontSize: 18, fontWeight: 500, marginBottom: 12 }}>{p.title}</h3>
                    <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 13.5, lineHeight: 1.75, color: 'var(--t2-text-muted)', margin: 0 }}>{p.description}</p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        <style>{`
          .t2-voyage-card {
            transition: transform 500ms cubic-bezier(0.22,1,0.36,1), box-shadow 500ms cubic-bezier(0.22,1,0.36,1);
          }
          .t2-voyage-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 24px 50px -28px rgba(0,0,0,0.4);
          }
          .t2-voyage-card-media {
            position: relative;
            aspect-ratio: 16 / 10;
            overflow: hidden;
            background: var(--t2-bg-alt);
          }
          .t2-voyage-card-media img {
            transition: transform 900ms cubic-bezier(0.22,1,0.36,1);
          }
          .t2-voyage-card:hover .t2-voyage-card-media img { transform: scale(1.06); }
          .t2-voyage-card-num {
            position: absolute; top: 14px; left: 16px; z-index: 2;
            font-family: var(--t2-font-serif); font-size: 12px; letter-spacing: 0.14em;
            color: #fff;
            width: 34px; height: 34px; border-radius: 50%;
            display: inline-flex; align-items: center; justify-content: center;
            background: rgba(0,0,0,0.34);
            backdrop-filter: blur(4px);
            border: 1px solid rgba(255,255,255,0.35);
          }
          @media (prefers-reduced-motion: reduce) {
            .t2-voyage-card, .t2-voyage-card-media img { transition: none; }
          }
          @media (max-width: 900px) {
            .t2-voyages-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
          @media (max-width: 560px) {
            .t2-voyages-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* ── Destinations ── */}
      <T2CruiseDestinations destinations={cruise.destinations ?? []} />

      {/* ── Experiences ── */}
      <T2CruiseExperiences experiences={cruise.experiences ?? []} />

      {/* ── The Yacht: suites ── */}
      <T2CruiseSuites suites={cruise.suites ?? []} vesselNote={cruise.ships?.[0]?.description} />

      {/* ── Sample Journeys ── */}
      <T2CruiseJourneys journeys={cruise.sample_journeys ?? []} />

      {/* ── Promo Banner ── */}
      <section className="t2-section">
        <T2PromoBanner
          promo={promo}
          fallback={{
            headline: `Sail With ${cruise.name}`,
            subheading: `Book through ${agencyName} and unlock exclusive Virtuoso benefits on every ${cruise.name} voyage — onboard credits, private receptions, and VIP treatment unavailable anywhere else.`,
            cta_label: 'Plan This Cruise',
            cta_url: `${base}/contact`,
            image_url: gallerySlides[0] ?? cruise.hero_image_url ?? undefined,
          }}
          agentId={agentId}
        />
      </section>

      {/* ── Gallery ── */}
      {gallerySlides.length > 0 && (
        <T2HotelGallery images={gallerySlides} />
      )}

      {/* ── Ships (fleet grid; hidden only for a single-yacht line whose suites section already shows the vessel) ── */}
      {cruise.ships && cruise.ships.length > 0 && !(cruise.ships.length === 1 && cruise.suites && cruise.suites.length > 0) && (
        <section className="t2-section">
          <div style={{ padding: '80px 48px', maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <span style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--t2-primary)', opacity: 0.6, display: 'block', marginBottom: 16 }}>
                The Fleet
              </span>
              <h2 className="t2-heading" style={{ fontSize: 48, margin: 0 }}>Featured Ships</h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 32 }}>
            {cruise.ships.map((ship, i) => (
              <div
                key={i}
                style={{
                  borderRadius: 'var(--t2-radius-lg)',
                  overflow: 'hidden',
                  border: '1px solid var(--t2-divider)',
                  background: 'var(--t2-bg-alt)',
                }}
              >
                {ship.image && (
                  <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
                    <Image
                      src={ship.image}
                      alt={ship.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      unoptimized
                    />
                  </div>
                )}
                <div style={{ padding: 24 }}>
                  <h4 style={{ fontFamily: 'var(--t2-font-serif)', fontSize: 17, fontWeight: 500, marginBottom: 8 }}>
                    {ship.name}
                  </h4>
                  {ship.description && (
                    <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 13, lineHeight: 1.6, color: 'var(--t2-text-muted)', margin: 0 }}>
                      {ship.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          </div>
        </section>
      )}

      {/* ── Related Articles ── */}
      <T2RelatedArticles
        posts={relatedPosts}
        heading={`${cruise.name} Stories`}
        basePath={base}
      />

      {/* ── CTA ── */}
      <section
        style={{
          position: 'relative',
          padding: '120px 24px',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          {cruise.hero_image_url && (
            <Image
              src={cruise.hero_image_url}
              alt={`${cruise.name} Background`}
              fill
              style={{ objectFit: 'cover' }}
              unoptimized
            />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(16,16,16,0.95), rgba(16,16,16,0.4))' }} />
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="t2-heading t2-heading-lg" style={{ color: '#FFFFFF', marginBottom: 16 }}>
            Plan Your Cruise
          </h2>
          <p style={{
            fontFamily: 'var(--t2-font-sans)',
            fontSize: 15,
            color: 'rgba(255,255,255,0.8)',
            maxWidth: 520,
            margin: '0 auto 40px',
            lineHeight: 1.8,
          }}>
            Book through us and unlock exclusive Virtuoso benefits — onboard credits, private receptions, and VIP treatment unavailable elsewhere.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={`${base}/contact`} className="t2-btn t2-btn-accent">
              Start Planning
            </Link>
            <Link href={`${base}/experiences`} className="t2-btn t2-btn-ghost-white">
              Browse All Cruises
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
