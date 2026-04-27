import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getHotelProgram, getHotelPrograms } from '@/lib/hotel-programs'

interface PageProps {
  params: Promise<{ agentId: string; programSlug: string }>
}

export async function generateStaticParams() {
  const programs = await getHotelPrograms()
  return programs.map((p) => ({ programSlug: p.slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { programSlug } = await params
  const p = await getHotelProgram(programSlug)
  if (!p) return { title: 'Not found' }
  return { title: `${p.name} | Casa Solis`, description: p.tagline ?? undefined }
}

export default async function T4HotelProgramDetailPage({ params }: PageProps) {
  const { agentId, programSlug } = await params
  const program = await getHotelProgram(programSlug)
  if (!program) notFound()

  const base = `/t4/${agentId}`

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          minHeight: 'clamp(560px, 78vh, 780px)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          color: '#fff',
          paddingBottom: 'clamp(80px, 10vh, 120px)',
        }}
      >
        {program.image_url && (
          <Image
            src={program.image_url}
            alt=""
            aria-hidden
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            unoptimized
          />
        )}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(20,17,15,0.35) 0%, rgba(20,17,15,0.78) 100%)',
          }}
        />
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            maxWidth: 'var(--t4-content-wide)',
            margin: '0 auto',
            padding: '0 48px',
            width: '100%',
          }}
        >
          <span
            className="t4-eyebrow"
            style={{ color: 'rgba(255,255,255,0.82)', marginBottom: 24 }}
          >
            Hotel Program
          </span>

          {program.logo_url_white ? (
            <div style={{ marginBottom: 28, maxWidth: 320 }}>
              <Image
                src={program.logo_url_white}
                alt={program.name}
                width={320}
                height={104}
                style={{ objectFit: 'contain', maxHeight: 104, width: 'auto' }}
                unoptimized
              />
            </div>
          ) : (
            <h1 className="t4-headline-xl" style={{ color: '#fff', marginBottom: 24 }}>
              {program.name}
            </h1>
          )}

          {program.tagline && (
            <p
              style={{
                fontFamily: 'var(--t4-font-display)',
                fontStyle: 'italic',
                fontSize: 'clamp(20px, 2.2vw, 28px)',
                lineHeight: 1.35,
                color: 'rgba(251, 248, 241, 0.88)',
                margin: 0,
                maxWidth: 720,
                fontWeight: 400,
              }}
            >
              {program.tagline}
            </p>
          )}
        </div>
      </section>

      {/* ── Overview ───────────────────────────────────────────────────── */}
      <section className="t4-section">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.4fr',
            gap: 96,
          }}
          className="t4-program-overview"
        >
          <div>
            <span className="t4-eyebrow">About the Program</span>
            <h2 className="t4-headline-xl" style={{ marginTop: 28 }}>
              {program.name}
            </h2>
            {program.property_count && (
              <p
                style={{
                  fontFamily: 'var(--t4-font-display)',
                  fontStyle: 'italic',
                  fontSize: 19,
                  color: 'var(--t4-accent)',
                  marginTop: 20,
                }}
              >
                {program.property_count}+ participating properties
              </p>
            )}
          </div>
          <div>
            {program.description && (
              <p className="t4-body t4-body-lg">{program.description}</p>
            )}
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .t4-program-overview { grid-template-columns: 1fr !important; gap: 32px !important; }
          }
        `}</style>
      </section>

      {/* ── Benefits ───────────────────────────────────────────────────── */}
      {program.benefits.length > 0 && (
        <section
          style={{
            padding: 'var(--t4-section-pad) 48px',
            background: 'var(--t4-bg-alt)',
          }}
        >
          <div style={{ maxWidth: 'var(--t4-content-wide)', margin: '0 auto' }}>
            <div style={{ maxWidth: 720, marginBottom: 72 }}>
              <span className="t4-eyebrow">Your Privileges</span>
              <h2 className="t4-headline-xl" style={{ marginTop: 28, marginBottom: 24 }}>
                What is arranged, on every stay.
              </h2>
              <p className="t4-body t4-body-lg">
                Booked through us, your stay arrives with these privileges
                already arranged — no codes, no paperwork, no questions at
                check-in.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                columnGap: 80,
                rowGap: 56,
                borderTop: '1px solid var(--t4-divider)',
                paddingTop: 56,
              }}
              className="t4-benefits-grid"
            >
              {program.benefits.map((b, i) => (
                <div key={b.title}>
                  <div
                    style={{
                      fontFamily: 'var(--t4-font-display)',
                      fontSize: 44,
                      fontWeight: 300,
                      color: 'var(--t4-accent)',
                      marginBottom: 16,
                      letterSpacing: '-0.02em',
                      lineHeight: 1,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3
                    className="t4-headline-md"
                    style={{ marginBottom: 12, fontSize: 'clamp(20px, 1.8vw, 24px)' }}
                  >
                    {b.title}
                  </h3>
                  <p className="t4-body" style={{ margin: 0 }}>
                    {b.description}
                  </p>
                </div>
              ))}
            </div>

            <style>{`
              @media (max-width: 700px) {
                .t4-benefits-grid { grid-template-columns: 1fr !important; row-gap: 40px !important; }
              }
            `}</style>
          </div>
        </section>
      )}

      {/* ── Gallery ────────────────────────────────────────────────────── */}
      {program.slider_images && program.slider_images.length > 0 && (
        <section className="t4-section">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 12,
            }}
            className="t4-gallery-grid"
          >
            {program.slider_images.slice(0, 6).map((src, i) => (
              <div
                key={src}
                style={{
                  position: 'relative',
                  aspectRatio: i === 0 ? '16 / 10' : '1 / 1',
                  gridColumn: i === 0 ? 'span 3' : 'auto',
                  overflow: 'hidden',
                  background: 'var(--t4-bg-alt)',
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

          <style>{`
            @media (max-width: 900px) {
              .t4-gallery-grid { grid-template-columns: 1fr 1fr !important; }
              .t4-gallery-grid > div { grid-column: auto !important; aspect-ratio: 1 / 1 !important; }
            }
          `}</style>
        </section>
      )}

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          padding: 'var(--t4-section-pad) 48px',
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
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(20,17,15,0.82) 0%, rgba(20,17,15,0.72) 100%)',
          }}
        />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto' }}>
          <span
            className="t4-eyebrow t4-eyebrow-center"
            style={{ color: 'rgba(255,255,255,0.82)', justifyContent: 'center' }}
          >
            Begin
          </span>
          <h2
            className="t4-headline-xl"
            style={{ color: '#fff', marginTop: 28, marginBottom: 24 }}
          >
            Plan a stay with us.
          </h2>
          <p
            style={{
              color: 'rgba(251, 248, 241, 0.78)',
              fontFamily: 'var(--t4-font-body)',
              fontSize: 17,
              lineHeight: 1.78,
              marginBottom: 40,
              fontWeight: 300,
            }}
          >
            Tell us when and where — we will arrange every {program.name}{' '}
            privilege on your behalf.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={`${base}/contact`} className="t4-btn t4-btn-solid-light">
              Start Planning
            </Link>
            <Link href={`${base}/book-hotel`} className="t4-btn t4-btn-ghost-light">
              All Hotel Programs
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
