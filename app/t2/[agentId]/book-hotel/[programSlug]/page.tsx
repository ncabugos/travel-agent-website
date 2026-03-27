import { getHotelProgram, getHotelPrograms } from '@/lib/hotel-programs'
import { getFeaturedHotels } from '@/lib/featured-hotels'
import { getSupplierPromo } from '@/lib/supplier-promos'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { T2HotelGallery } from '@/components/t2/T2HotelGallery'
import { T2FeaturedProperties } from '@/components/t2/T2FeaturedProperties'
import { T2BenefitsGrid } from '@/components/t2/T2BenefitsGrid'
import { T2PromoBanner } from '@/components/t2/T2PromoBanner'

interface PageProps {
  params: Promise<{ agentId: string; programSlug: string }>
}

export async function generateStaticParams() {
  const programs = await getHotelPrograms()
  return programs.map(p => ({ programSlug: p.slug }))
}

export default async function HotelProgramDetailPage({ params }: PageProps) {
  const { agentId, programSlug } = await params
  const [program, promo] = await Promise.all([
    getHotelProgram(programSlug),
    getSupplierPromo('hotel_program', programSlug),
  ])
  if (!program) notFound()

  const featuredHotels = getFeaturedHotels(programSlug)
  const base = `/t2/${agentId}`

  // Fallback promo used until a DB row is configured for this program
  const promoFallback = {
    headline: `Discover ${program.name}`,
    subheading: `Book through Eden for Your World and unlock exclusive ${program.name} privileges — upgrades, daily breakfast, and VIP recognition unavailable through any other channel.`,
    cta_label: 'Book Through Us',
    cta_url: `${base}/contact`,
    image_url: program.slider_images?.[1] ?? program.image_url ?? undefined,
  }

  return (
    <>
      {/* ── Hero ── */}
      <section
        style={{
          position: 'relative',
          height: 650,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--t2-dark-bg)',
        }}
      >
        {program.image_url && (
          <Image
            src={program.image_url}
            alt={program.name}
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            sizes="100vw"
            unoptimized
          />
        )}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(20,18,16,0.55) 0%, rgba(20,18,16,0.65) 100%)',
        }} />

        {program.logo_url_white ? (
          <div style={{ position: 'relative', zIndex: 2, marginBottom: 24 }}>
            <Image
              src={program.logo_url_white}
              alt={program.name}
              width={260}
              height={100}
              style={{ objectFit: 'contain', maxHeight: 90, maxWidth: 260 }}
              unoptimized
            />
          </div>
        ) : (
          <div style={{ position: 'relative', zIndex: 2, marginBottom: 24, textAlign: 'center', padding: '0 24px' }}>
            <h1 style={{
              fontFamily: 'var(--t2-font-serif)',
              fontSize: 'clamp(28px, 4vw, 52px)',
              fontWeight: 400,
              color: '#FFFFFF',
              letterSpacing: '0.04em',
              margin: 0,
              lineHeight: 1.1,
            }}>
              {program.name}
            </h1>
          </div>
        )}

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px', maxWidth: 720 }}>
          {program.tagline && (
            <p style={{
              fontFamily: 'var(--t2-font-sans)',
              fontSize: 15,
              letterSpacing: '0.08em',
              color: 'rgba(255,255,255,0.82)',
              textTransform: 'uppercase',
              margin: 0,
            }}>
              {program.tagline}
            </p>
          )}
        </div>
      </section>

      {/* ── Description ── */}
      <section className="t2-section" style={{ maxWidth: 900 }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 className="t2-heading t2-heading-lg" style={{ marginBottom: 16 }}>{program.name}</h2>
          {program.description && (
            <p className="t2-body t2-body-center">{program.description}</p>
          )}
        </div>

        {/* ── Benefits — icon grid ── */}
        {program.benefits.length > 0 && (
          <T2BenefitsGrid
            benefits={program.benefits}
            heading="Your Exclusive Benefits"
            label="Privileges"
          />
        )}
      </section>

      {/* ── Promo Banner ── */}
      <section className="t2-section" style={{ paddingTop: 0 }}>
        <T2PromoBanner
          promo={promo}
          fallback={promoFallback}
          agentId={agentId}
        />
      </section>

      {/* ── Gallery ── */}
      {program.slider_images && program.slider_images.length > 0 && (
        <T2HotelGallery images={program.slider_images} />
      )}

      {/* ── Featured Properties ── */}
      <T2FeaturedProperties
        hotels={featuredHotels}
        programName={program.name}
        agentId={agentId}
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
          {program.image_url && (
            <Image
              src={program.image_url}
              alt={`${program.name} Background`}
              fill
              style={{ objectFit: 'cover' }}
              unoptimized
            />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(16,16,16,0.95), rgba(16,16,16,0.4))' }} />
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p className="t2-label" style={{ color: 'var(--t2-accent)', marginBottom: 16 }}>Ready to Escape?</p>
          <h2 className="t2-heading t2-heading-lg" style={{ color: '#FFFFFF', marginBottom: 16 }}>
            Plan Your Stay
          </h2>
          <p style={{
            fontFamily: 'var(--t2-font-sans)',
            fontSize: 15,
            color: 'rgba(255,255,255,0.8)',
            maxWidth: 520,
            margin: '0 auto 40px',
            lineHeight: 1.8,
          }}>
            {program.eligibility_notes || 'Book through us and unlock exclusive privileges.'}
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={`${base}/contact`} className="t2-btn t2-btn-accent">
              Start Planning
            </Link>
            <Link href={`${base}/experiences`} className="t2-btn t2-btn-ghost-white">
              Browse All Hotels
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
