import { getCruiseLine, getAllCruiseLineSlugs } from '@/lib/cruise-lines'
import { getSupplierPromo } from '@/lib/supplier-promos'
import { getBlogPostsBySupplier } from '@/lib/blog'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { T2HotelGallery } from '@/components/t2/T2HotelGallery'
import { T2BenefitsGrid } from '@/components/t2/T2BenefitsGrid'
import { T2PromoBanner } from '@/components/t2/T2PromoBanner'
import { T2RelatedArticles } from '@/components/t2/T2RelatedArticles'

interface PageProps {
  params: Promise<{ agentId: string; cruiseSlug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllCruiseLineSlugs()
  return slugs.map(slug => ({ cruiseSlug: slug }))
}

export default async function CruiseDetailPage({ params }: PageProps) {
  const { agentId, cruiseSlug } = await params
  const [cruise, promo, relatedPosts] = await Promise.all([
    getCruiseLine(cruiseSlug),
    getSupplierPromo('cruise_line', cruiseSlug),
    getBlogPostsBySupplier(`cruise:${cruiseSlug}`, agentId),
  ])
  if (!cruise) notFound()

  const base = `/t2/${agentId}`


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

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px', maxWidth: 760 }}>
          {/* Only render an image if we have a transparent white logo — never filter opaque images */}
          {cruise.logo_url_white ? (
            <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'center' }}>
              <Image
                src={cruise.logo_url_white}
                alt={`${cruise.name} logo`}
                width={280}
                height={100}
                style={{ objectFit: 'contain', maxHeight: 90, maxWidth: 280 }}
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
              marginBottom: 0,
            }}>
              {cruise.tagline}
            </p>
          )}
        </div>
      </section>

      {/* ── Description ── */}
      <section className="t2-section" style={{ maxWidth: 820, textAlign: 'center' }}>
        <h2 className="t2-heading t2-heading-lg" style={{ marginBottom: 20 }}>{cruise.name}</h2>
        {cruise.description && (
          <p className="t2-body t2-body-center" style={{ fontSize: 17, lineHeight: 1.9 }}>
            {cruise.description}
          </p>
        )}
      </section>

      {/* ── Benefits — icon grid ── */}
      {cruise.highlights.length > 0 && (
        <section className="t2-section" style={{ maxWidth: '100%', width: '100%' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px' }}>
            <T2BenefitsGrid
              benefits={cruise.highlights}
              heading="What Sets Them Apart"
              label="Exclusive Benefits"
            />
          </div>
        </section>
      )}

      {/* ── Promo Banner ── */}
      <section className="t2-section" style={{ paddingTop: 0 }}>
        <T2PromoBanner
          promo={promo}
          fallback={{
            headline: `Sail With ${cruise.name}`,
            subheading: `Book through Eden for Your World and unlock exclusive Virtuoso benefits on every ${cruise.name} voyage — onboard credits, private receptions, and VIP treatment unavailable anywhere else.`,
            cta_label: 'Plan This Cruise',
            cta_url: `${base}/contact`,
            image_url: cruise.slider_images?.[0] ?? cruise.hero_image_url ?? undefined,
          }}
          agentId={agentId}
        />
      </section>

      {/* ── Gallery ── */}
      {cruise.slider_images && cruise.slider_images.length > 0 && (
        <T2HotelGallery images={cruise.slider_images} />
      )}

      {/* ── Ships ── */}
      {cruise.ships && cruise.ships.length > 0 && (
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
          <p className="t2-label" style={{ color: 'var(--t2-accent)', marginBottom: 16 }}>Ready to Set Sail?</p>
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
