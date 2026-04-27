import { getCruiseLine, getAllCruiseLineSlugs } from '@/lib/cruise-lines'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ agentId: string; cruiseSlug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllCruiseLineSlugs()
  return slugs.map((slug) => ({ cruiseSlug: slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { cruiseSlug } = await params
  const line = await getCruiseLine(cruiseSlug)
  if (!line) return { title: 'Cruise line not found' }
  return {
    title: `${line.name} | Meridian & Company`,
    description: line.tagline ?? line.description ?? undefined,
  }
}

export default async function T3CruiseLineDetailPage({ params }: PageProps) {
  const { agentId, cruiseSlug } = await params
  const line = await getCruiseLine(cruiseSlug)
  if (!line) notFound()

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
        {line.hero_image_url && (
          <Image
            src={line.hero_image_url}
            alt={line.name}
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
            {(line.cruise_types || []).join(' · ') || 'Luxury Cruise'}
          </span>

          {line.logo_url_white ? (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
              <Image
                src={line.logo_url_white}
                alt={line.name}
                width={280}
                height={96}
                style={{ objectFit: 'contain', maxHeight: 96, width: 'auto' }}
                unoptimized
              />
            </div>
          ) : (
            <h1 className="t3-headline-xl" style={{ color: '#fff', marginBottom: 24 }}>
              {line.name}
            </h1>
          )}

          {line.tagline && (
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
              {line.tagline}
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
          className="t3-cruise-intro"
        >
          <div>
            <span className="t3-eyebrow">About the Line</span>
            <h2 className="t3-headline-xl" style={{ marginTop: 28 }}>
              {line.name}
            </h2>
          </div>
          <div>
            {line.description && <p className="t3-body t3-body-lg">{line.description}</p>}
          </div>
        </div>
      </section>

      {/* ── Highlights / Advisor-only benefits ─────────────────────────── */}
      {line.highlights && line.highlights.length > 0 && (
        <section className="t3-section t3-section-alt">
          <div style={{ maxWidth: 720, marginBottom: 64 }}>
            <span className="t3-eyebrow">Why We Book This Line</span>
            <h2 className="t3-headline-xl" style={{ marginTop: 28 }}>
              Included on every voyage.
            </h2>
            <p className="t3-body t3-body-lg" style={{ marginTop: 24 }}>
              These benefits apply to every {line.name} booking made through us —
              advisor-arranged, confirmed before you sail.
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
            className="t3-cruise-highlights-grid"
          >
            {line.highlights.map((h, i) => (
              <div key={h.title}>
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
                  {h.title}
                </h3>
                <p className="t3-body" style={{ fontSize: 14.5, margin: 0 }}>
                  {h.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Fleet ──────────────────────────────────────────────────────── */}
      {line.ships && line.ships.length > 0 && (
        <section className="t3-section">
          <div style={{ maxWidth: 720, marginBottom: 64 }}>
            <span className="t3-eyebrow">The Fleet</span>
            <h2 className="t3-headline-xl" style={{ marginTop: 28 }}>
              Ships we know personally.
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 32,
              rowGap: 48,
            }}
            className="t3-cruise-ships-grid"
          >
            {line.ships.map((ship) => (
              <div key={ship.name}>
                {ship.image && (
                  <div
                    style={{
                      position: 'relative',
                      aspectRatio: '4 / 3',
                      overflow: 'hidden',
                      marginBottom: 20,
                      background: 'var(--t3-bg-alt)',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ship.image}
                      alt={ship.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                  </div>
                )}
                <h3 className="t3-headline-md" style={{ marginBottom: 8, fontSize: 'clamp(17px, 1.5vw, 20px)' }}>
                  {ship.name}
                </h3>
                {ship.description && (
                  <p className="t3-body" style={{ fontSize: 13.5, color: 'var(--t3-text-muted)', margin: 0 }}>
                    {ship.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Gallery ────────────────────────────────────────────────────── */}
      {line.slider_images && line.slider_images.length > 0 && (
        <section className="t3-section" style={{ paddingTop: 0 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 16,
            }}
            className="t3-cruise-gallery"
          >
            {line.slider_images.slice(0, 6).map((src, i) => (
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
                  alt={`${line.name} gallery ${i + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  loading={i < 3 ? 'eager' : 'lazy'}
                />
              </div>
            ))}
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
        {line.hero_image_url && (
          <Image
            src={line.hero_image_url}
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
            Ready to sail
          </span>
          <h2
            className="t3-headline-xl"
            style={{ color: '#fff', marginTop: 28, marginBottom: 24 }}
          >
            Plan a voyage with us.
          </h2>
          <p
            className="t3-body t3-body-lg"
            style={{ color: 'rgba(247, 245, 240, 0.78)', marginBottom: 40 }}
          >
            Tell us a region, a month, or just a ship you&apos;ve always wanted
            to sail — we&apos;ll return with the right itinerary and every advisor
            benefit already attached.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={`${base}/contact`} className="t3-btn t3-btn-solid-light">
              Enquire About a Voyage
            </Link>
            <Link href={`${base}/find-cruise`} className="t3-btn t3-btn-ghost-light">
              All Cruise Partners
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .t3-cruise-intro { grid-template-columns: 1fr !important; gap: 32px !important; }
          .t3-cruise-highlights-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
          .t3-cruise-ships-grid { grid-template-columns: 1fr 1fr !important; }
          .t3-cruise-gallery { grid-template-columns: 1fr !important; }
          .t3-cruise-gallery > div { grid-column: auto !important; aspect-ratio: 4 / 3 !important; }
        }
        @media (max-width: 600px) {
          .t3-cruise-ships-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
