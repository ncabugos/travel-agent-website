import { getHotelProgram, getHotelPrograms } from '@/lib/hotel-programs'
import { getProgramFeaturedHotels } from '@/lib/hotels'
import { getBlogPostsBySupplier } from '@/lib/blog'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { T3FeaturedProperties } from '@/components/t3/T3FeaturedProperties'
import { T3SiblingPrograms } from '@/components/t3/T3SiblingPrograms'
import { T3JournalTeaser, type T3JournalPost } from '@/components/t3/T3JournalTeaser'

interface PageProps {
  params: Promise<{ agentId: string; programSlug: string }>
}

export async function generateStaticParams() {
  const programs = await getHotelPrograms()
  return programs.map((p) => ({ programSlug: p.slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { programSlug } = await params
  const program = await getHotelProgram(programSlug)
  if (!program) return { title: 'Program not found' }
  return {
    title: `${program.name} | Meridian Travel`,
    description: program.tagline ?? program.description ?? undefined,
  }
}

export default async function T3HotelProgramDetailPage({ params }: PageProps) {
  const { agentId, programSlug } = await params
  const program = await getHotelProgram(programSlug)
  if (!program) notFound()

  const base = `/t3/${agentId}`

  // Fetch supplemental modules in parallel; each gracefully renders nothing when empty.
  const [featuredHotels, relatedPosts, allPrograms] = await Promise.all([
    getProgramFeaturedHotels(programSlug),
    getBlogPostsBySupplier(programSlug, agentId).catch(() => []),
    getHotelPrograms(),
  ])

  // Sibling programs: same category, ordered by sort_order, exclude current.
  const siblingPrograms = allPrograms
    .filter((p) => p.slug !== program.slug && p.category === program.category)
    .slice(0, 3)

  // Convert BlogPost[] → T3JournalPost[] shape used by T3JournalTeaser.
  const journalItems: T3JournalPost[] = relatedPosts.slice(0, 3).map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt ?? null,
    cover_image_url: p.cover_image_url ?? null,
    published_at: p.published_at ?? null,
    category: p.categories?.[0] ?? null,
  }))

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          height: 'clamp(520px, 68vh, 720px)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--t3-dark-bg)',
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
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(20,17,15,0.48) 0%, rgba(20,17,15,0.72) 100%)',
          }}
        />

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px', maxWidth: 'var(--t3-content-narrow)' }}>
          <span
            className="t3-eyebrow t3-eyebrow-plain"
            style={{ justifyContent: 'center', color: 'rgba(255,255,255,0.72)', marginBottom: 24 }}
          >
            Hotel Program
          </span>

          {program.logo_url_white ? (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
              <Image
                src={program.logo_url_white}
                alt={program.name}
                width={280}
                height={100}
                style={{ objectFit: 'contain', maxHeight: 96, width: 'auto' }}
                unoptimized
              />
            </div>
          ) : (
            <h1
              className="t3-headline-xl"
              style={{ color: '#fff', marginBottom: 24 }}
            >
              {program.name}
            </h1>
          )}

          {program.tagline && (
            <p
              style={{
                fontFamily: 'var(--t3-font-display)',
                fontStyle: 'italic',
                fontSize: 'clamp(18px, 2vw, 22px)',
                lineHeight: 1.45,
                color: 'rgba(247, 245, 240, 0.88)',
                margin: 0,
              }}
            >
              {program.tagline}
            </p>
          )}
        </div>
      </section>

      {/* ── Overview ───────────────────────────────────────────────────── */}
      <section className="t3-section">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.4fr',
            gap: 'var(--t3-gap-loose)',
            paddingTop: 'var(--t3-gap-tight)',
          }}
          className="t3-program-intro"
        >
          <div>
            <span className="t3-eyebrow t3-eyebrow-plain">About the Program</span>
            <h2 className="t3-headline-xl" style={{ marginTop: 28 }}>
              {program.name}
            </h2>
            {program.property_count && (
              <p
                style={{
                  fontFamily: 'var(--t3-font-display)',
                  fontStyle: 'italic',
                  fontSize: 17,
                  color: 'var(--t3-accent)',
                  lineHeight: 1.5,
                  marginTop: 16,
                  marginBottom: 0,
                }}
              >
                {program.property_count}+ participating properties
              </p>
            )}
          </div>
          <div>
            {program.description && (
              <p className="t3-body t3-body-lg">{program.description}</p>
            )}
          </div>
        </div>
      </section>

      {/* ── Benefits ───────────────────────────────────────────────────── */}
      {program.benefits.length > 0 && (
        <section className="t3-section t3-section-alt">
          <div style={{ maxWidth: 'var(--t3-content-narrow)', marginBottom: 'var(--t3-gap-loose)' }}>
            <span className="t3-eyebrow t3-eyebrow-plain">Your Exclusive Privileges</span>
            <h2 className="t3-headline-xl" style={{ marginTop: 28 }}>
              Every benefit, included on every stay.
            </h2>
            <p className="t3-body t3-body-lg" style={{ marginTop: 24 }}>
              Booked through us, your stay arrives with these privileges already
              arranged — no codes, no paperwork, no questions at check-in.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 'var(--t3-gap)',
              borderTop: '1px solid var(--t3-divider)',
              paddingTop: 'var(--t3-gap)',
            }}
            className="t3-benefits-grid"
          >
            {program.benefits.map((b, i) => (
              <div key={b.title}>
                <div
                  style={{
                    fontFamily: 'var(--t3-font-display)',
                    fontSize: 28,
                    fontWeight: 400,
                    color: 'var(--t3-accent)',
                    marginBottom: 12,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="t3-headline-md" style={{ marginBottom: 12, fontSize: 'clamp(18px, 1.6vw, 22px)' }}>
                  {b.title}
                </h3>
                <p className="t3-body" style={{ fontSize: 'clamp(13.5px, 1vw, 14.5px)', margin: 0 }}>
                  {b.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Gallery ────────────────────────────────────────────────────── */}
      {program.slider_images && program.slider_images.length > 0 && (
        <section className="t3-section" style={{ paddingTop: 0 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 16,
            }}
            className="t3-program-gallery"
          >
            {program.slider_images.slice(0, 6).map((src, i) => (
              <div
                key={src}
                style={{
                  position: 'relative',
                  aspectRatio: i === 0 ? '16 / 10' : '4 / 3',
                  gridColumn: i === 0 ? 'span 3' : 'auto',
                  overflow: 'hidden',
                  background: 'var(--t3-bg-alt)',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`${program.name} gallery ${i + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  loading={i < 3 ? 'eager' : 'lazy'}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Featured Properties ────────────────────────────────────────── */}
      <T3FeaturedProperties
        hotels={featuredHotels}
        programName={program.name}
        base={base}
      />

      {/* ── Related Journal ────────────────────────────────────────────── */}
      {journalItems.length > 0 && (
        <T3JournalTeaser
          agentId={agentId}
          posts={journalItems}
          eyebrow="From the Journal"
          heading={`More on ${program.name}.`}
          subheading="Recent dispatches and field notes from our advisors."
        />
      )}

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          padding: 'var(--t3-section-pad) 48px',
          textAlign: 'center',
          overflow: 'hidden',
          color: '#fff',
        }}
        className="t3-program-cta"
      >
        {program.image_url && (
          <Image
            src={program.image_url}
            alt=""
            aria-hidden
            fill
            style={{ objectFit: 'cover' }}
            unoptimized
          />
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(20,17,15,0.88) 0%, rgba(20,17,15,0.72) 100%)',
          }}
        />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 'var(--t3-content-narrow)', margin: '0 auto' }}>
          <span
            className="t3-eyebrow t3-eyebrow-plain"
            style={{ justifyContent: 'center', color: 'rgba(255,255,255,0.72)' }}
          >
            Ready when you are
          </span>
          <h2
            className="t3-headline-xl"
            style={{ color: '#fff', marginTop: 28, marginBottom: 24 }}
          >
            Plan a stay with us.
          </h2>
          <p
            className="t3-body t3-body-lg"
            style={{
              color: 'rgba(247, 245, 240, 0.78)',
              marginBottom: 40,
            }}
          >
            Tell us when and where you&apos;d like to go — we&apos;ll arrange every
            {' '}{program.name} privilege on your behalf.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={`${base}/contact`} className="t3-btn t3-btn-solid-light">
              Start Planning
            </Link>
            <Link href={`${base}/book-hotel`} className="t3-btn t3-btn-ghost-light">
              All Hotel Programs
            </Link>
          </div>
          {(program.booking_notes || program.eligibility_notes) && (
            <p
              style={{
                marginTop: 32,
                fontFamily: 'var(--t3-font-display)',
                fontStyle: 'italic',
                fontSize: 'clamp(12px, 0.95vw, 13.5px)',
                lineHeight: 1.6,
                color: 'rgba(247, 245, 240, 0.62)',
                maxWidth: 'var(--t3-content-narrow)',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              {program.booking_notes ?? program.eligibility_notes}
            </p>
          )}
        </div>
      </section>

      {/* ── Sibling programs ───────────────────────────────────────────── */}
      <T3SiblingPrograms
        programs={siblingPrograms}
        base={base}
      />

      <style>{`
        @media (max-width: 1024px) {
          .t3-program-intro { gap: var(--t3-gap) !important; }
          .t3-benefits-grid { gap: var(--t3-gap) !important; }
        }
        @media (max-width: 768px) {
          .t3-program-intro { grid-template-columns: 1fr !important; gap: var(--t3-gap-tight) !important; }
          .t3-benefits-grid { grid-template-columns: 1fr !important; gap: var(--t3-gap-tight) !important; }
          .t3-program-gallery { grid-template-columns: 1fr !important; }
          .t3-program-gallery > div { grid-column: auto !important; aspect-ratio: 4 / 3 !important; }
          .t3-program-cta { padding-left: 24px !important; padding-right: 24px !important; }
        }
      `}</style>
    </>
  )
}
