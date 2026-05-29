import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getLidoDestination, LIDO_DESTINATIONS, LIDO_JOURNAL } from '@/lib/lido-content'
import { getHotels, type LuxuryHotel } from '@/lib/hotels'

interface PageProps {
  params: Promise<{ agentId: string; destination: string }>
}

export function generateStaticParams() {
  return LIDO_DESTINATIONS.map((d) => ({ destination: d.slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { destination } = await params
  const dest = getLidoDestination(destination)
  if (!dest) return { title: 'Destination | The Lido Collective' }
  return { title: `${dest.label} | The Lido Collective`, description: dest.intro }
}

/* Magazine-rule header (local — destination pages have no ordinals). */
function RuleHeader({ eyebrow }: { eyebrow: string }) {
  return (
    <div className="lido-header">
      <span className="lido-eyebrow">{eyebrow}</span>
    </div>
  )
}

export default async function DestinationDetailPage({ params }: PageProps) {
  const { agentId, destination } = await params
  if (agentId !== 'lido-collective') notFound()
  const dest = getLidoDestination(destination)
  if (!dest) notFound()

  const base = `/t2/${agentId}`

  // Surface active hotels in this destination's countries; fall back to the
  // first few so the section always renders against the placeholder catalog.
  const { hotels: pool } = await getHotels({ pageSize: 120 })
  const wanted = dest.countries.map((c) => c.toLowerCase())
  const matched = pool.filter((h) => h.country && wanted.includes(h.country.toLowerCase()))
  const properties: LuxuryHotel[] = (matched.length ? matched : pool).slice(0, 6)

  return (
    <div style={{ background: 'var(--lido-bg)', color: 'var(--lido-text)' }}>
      {/* ── 1 · Hero (full-bleed image, traditional) ───────────────────── */}
      <section style={{ position: 'relative', minHeight: '78svh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 32px' }}>
        <Image src={dest.heroImage} alt={dest.label} fill priority sizes="100vw" style={{ objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(6,16,30,0.32), rgba(6,16,30,0.52))' }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 900 }}>
          <h1 className="lido-display" style={{ fontSize: 'clamp(64px, 9vw, 140px)', lineHeight: 0.96, fontWeight: 400, margin: 0, whiteSpace: 'pre-line', color: '#FFFFFF' }}>
            {dest.headline}
          </h1>
          <p className="lido-body" style={{ fontSize: 17, color: 'rgba(255,255,255,0.82)', maxWidth: 600, margin: '32px auto 0' }}>
            {dest.intro}
          </p>
        </div>
      </section>

      {/* ── 2 · Editorial intro (40/60, arch + rect) ───────────────────── */}
      <section className="lido-section">
        <RuleHeader eyebrow={`Why ${dest.label}`} />
        <div className="lido-ed-split">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="lido-shape lido-arch" style={{ aspectRatio: '4 / 5' }}>
              <Image src={dest.editorialImages[0]} alt="" fill sizes="(max-width: 900px) 100vw, 40vw" />
            </div>
            <div className="lido-shape lido-rect" style={{ aspectRatio: '1 / 1' }}>
              <Image src={dest.editorialImages[1]} alt="" fill sizes="(max-width: 900px) 100vw, 40vw" />
            </div>
          </div>
          <div>
            {dest.body.map((para, i) => (
              <p key={i} style={{ fontFamily: 'var(--lido-font-display)', fontSize: 20, lineHeight: 1.55, color: 'var(--lido-text)', margin: '0 0 24px' }}>
                {para}
              </p>
            ))}
            <blockquote className="lido-display" style={{ fontStyle: 'italic', fontSize: 30, lineHeight: 1.3, margin: '8px 0 0', maxWidth: 560 }}>
              &ldquo;{dest.pullQuote}&rdquo;
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── 3 · Gallery strip (sharp rectangles) ───────────────────────── */}
      <section style={{ padding: '0 0 clamp(64px, 8vw, 120px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, padding: '0 10px' }}>
          {dest.galleryImages.map((img, i) => (
            <div key={i} className="lido-shape lido-rect" style={{ aspectRatio: '16 / 9' }}>
              <Image src={img} alt="" fill sizes="33vw" />
            </div>
          ))}
        </div>
      </section>

      {/* ── 4 · Properties ─────────────────────────────────────────────── */}
      {properties.length > 0 && (
        <section className="lido-section" style={{ paddingTop: 0 }}>
          <RuleHeader eyebrow="Properties" />
          <div className="lido-prop-grid">
            {properties.map((h) => (
              <Link key={h.id} href={`${base}/hotels/${h.slug}`} className="lido-prop-card">
                <div className="lido-shape lido-rect" style={{ aspectRatio: '4 / 3', marginBottom: 16, background: 'var(--lido-bg-warm)' }}>
                  {h.cover_image_url && (
                    <Image src={h.cover_image_url} alt="" fill sizes="(max-width: 900px) 100vw, 380px" style={{ objectFit: 'cover' }} unoptimized />
                  )}
                </div>
                <h3 className="lido-display lido-prop-name" style={{ fontSize: 22, margin: '0 0 6px' }}>{h.name}</h3>
                <p style={{ fontFamily: 'var(--lido-font-body)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--lido-text-muted)', margin: 0 }}>
                  {[h.city, h.country].filter(Boolean).join(', ')}
                </p>
              </Link>
            ))}
          </div>
          <div style={{ marginTop: 48 }}>
            <Link href={`${base}/book-hotel`} className="lido-arrow">All Properties <span aria-hidden>→</span></Link>
          </div>
        </section>
      )}

      {/* ── 5 · Stories (dark module) ──────────────────────────────────── */}
      <section className="lido-dark">
        <div className="lido-section">
          <RuleHeader eyebrow={`Stories from ${dest.label}`} />
          <div className="lido-journal-grid-d">
            {LIDO_JOURNAL.map((post) => (
              <Link key={post.slug} href={`${base}/journal`} className="lido-journal-card-d">
                <div className="lido-shape lido-rect" style={{ aspectRatio: '3 / 2', marginBottom: 20 }}>
                  <Image src={post.image} alt={post.title} fill sizes="(max-width: 900px) 100vw, 380px" />
                </div>
                <span className="lido-eyebrow">{post.category}</span>
                <h3 className="lido-display lido-prop-name" style={{ fontSize: 24, lineHeight: 1.12, margin: '12px 0 14px', color: 'var(--lido-on-dark)' }}>{post.title}</h3>
                <span style={{ fontFamily: 'var(--lido-font-body)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--lido-on-dark-muted)' }}>{post.date} · Read →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6 · CTA band ───────────────────────────────────────────────── */}
      <section className="lido-section" style={{ textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2 className="lido-display" style={{ fontSize: 'clamp(40px, 6vw, 60px)', marginBottom: 24 }}>Planning {dest.label}?</h2>
          <p className="lido-body" style={{ fontSize: 17, margin: '0 auto 44px', maxWidth: 520 }}>
            Begin a conversation. We respond personally within 24 hours.
          </p>
          <Link href={`${base}/contact`} className="lido-btn-fill">Begin a Conversation <span aria-hidden>→</span></Link>
        </div>
      </section>

      <style>{`
        .lido-ed-split { display: grid; grid-template-columns: 0.66fr 1fr; gap: clamp(32px, 6vw, 80px); align-items: start; }
        .lido-prop-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 36px; }
        .lido-prop-card { text-decoration: none; color: var(--lido-text); display: block; }
        .lido-prop-name { transition: opacity 0.2s ease; }
        .lido-prop-card:hover .lido-prop-name, .lido-journal-card-d:hover .lido-prop-name { opacity: 0.65; }
        .lido-journal-grid-d { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
        .lido-journal-card-d { text-decoration: none; display: block; }
        @media (max-width: 900px) {
          .lido-ed-split { grid-template-columns: 1fr; }
          .lido-prop-grid { grid-template-columns: 1fr 1fr; }
          .lido-journal-grid-d { grid-template-columns: 1fr; gap: 48px; }
        }
        @media (max-width: 560px) {
          .lido-prop-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
