import { getHotelProgram, getHotelPrograms } from '@/lib/hotel-programs'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

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
    title: `${program.name} | Meridian & Company`,
    description: program.tagline ?? program.description ?? undefined,
  }
}

export default async function T3HotelProgramDetailPage({ params }: PageProps) {
  const { agentId, programSlug } = await params
  const program = await getHotelProgram(programSlug)
  if (!program) notFound()

  const base = `/t3/${agentId}`

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

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px', maxWidth: 760 }}>
          <span
            className="t3-eyebrow"
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
            gap: 96,
            paddingTop: 24,
          }}
          className="t3-program-intro"
        >
          <div>
            <span className="t3-eyebrow">About the Program</span>
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
          <div style={{ maxWidth: 720, marginBottom: 64 }}>
            <span className="t3-eyebrow">Your Exclusive Privileges</span>
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
              gap: '48px 56px',
              borderTop: '1px solid var(--t3-divider)',
              paddingTop: 48,
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
                <p className="t3-body" style={{ fontSize: 14.5, margin: 0 }}>
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

      {/* ── Booking notes ──────────────────────────────────────────────── */}
      {(program.eligibility_notes || program.booking_notes) && (
        <section className="t3-section" style={{ paddingTop: 0 }}>
          <div
            style={{
              maxWidth: 820,
              margin: '0 auto',
              padding: '48px 56px',
              background: 'var(--t3-bg-alt)',
              borderLeft: '2px solid var(--t3-accent)',
            }}
          >
            <span
              className="t3-eyebrow"
              style={{ marginBottom: 20 }}
            >
              How to book
            </span>
            {program.booking_notes && (
              <p className="t3-body" style={{ marginBottom: program.eligibility_notes ? 16 : 0 }}>
                {program.booking_notes}
              </p>
            )}
            {program.eligibility_notes && (
              <p
                className="t3-body"
                style={{
                  fontSize: 13,
                  color: 'var(--t3-text-muted)',
                  margin: 0,
                  fontStyle: 'italic',
                }}
              >
                {program.eligibility_notes}
              </p>
            )}
          </div>
        </section>
      )}

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          padding: 'var(--t3-section-pad) 24px',
          textAlign: 'center',
          overflow: 'hidden',
          color: '#fff',
        }}
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
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto' }}>
          <span
            className="t3-eyebrow"
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
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .t3-program-intro { grid-template-columns: 1fr !important; gap: 32px !important; }
          .t3-benefits-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
          .t3-program-gallery { grid-template-columns: 1fr !important; }
          .t3-program-gallery > div { grid-column: auto !important; aspect-ratio: 4 / 3 !important; }
        }
      `}</style>
    </>
  )
}
