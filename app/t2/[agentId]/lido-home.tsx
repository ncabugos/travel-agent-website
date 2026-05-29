import Image from 'next/image'
import Link from 'next/link'
import { getAgencyAdvisors } from '@/lib/agency-advisors'
import { LIDO_DESTINATIONS, LIDO_JOURNAL } from '@/lib/lido-content'
import { LidoPressBar } from '@/components/t2/LidoPressBar'
import { LidoPartnerNetwork } from '@/components/t2/LidoPartnerNetwork'
import { LidoInstagramMosaic } from '@/components/t2/LidoInstagramMosaic'

interface PageProps {
  params: Promise<{ agentId: string }>
}

/* ── Section header: magazine rule + ordinal + eyebrow + optional CTA ────── */
function MagazineHeader({
  ordinal,
  eyebrow,
  cta,
  base,
}: {
  ordinal?: string
  eyebrow: string
  cta?: { label: string; href: string }
  base: string
}) {
  return (
    <div className="lido-header">
      <span className="lido-eyebrow">
        {ordinal ? `${ordinal} · ` : ''}
        {eyebrow}
      </span>
      {cta && (
        <Link href={`${base}${cta.href}`} className="lido-arrow">
          {cta.label} <span aria-hidden>→</span>
        </Link>
      )}
    </div>
  )
}

// Signature hero shape row — arch · rectangle · leaf · arch (staggered).
const HERO_SHAPES = [
  { shape: 'lido-arch',  image: '/media/hero images/four-seasons-yacht-hero.jpg',                  ratio: '3 / 4', top: 0 },
  { shape: 'lido-rect',  image: '/media/hotel-programs/aman/aman-hero-2000.jpg',                    ratio: '3 / 4', top: 40 },
  { shape: 'lido-leaf',  image: '/media/hero images/four-seasons-astir-hero.jpg',                   ratio: '3 / 4', top: 12 },
  { shape: 'lido-arch',  image: '/media/hero images/four-seasons-CapFerrat_garden-hero.jpg',        ratio: '3 / 4', top: 56 },
]

const SERVICES = [
  { num: '01', name: 'Voyages', desc: 'Private yachts, Aman at sea, expedition vessels to the ends of the earth.', image: '/media/hero images/four-seasons-yacht-hero.jpg', href: '/find-cruise' },
  { num: '02', name: 'Stays', desc: 'The estates, private islands, and grand houses that release no public inventory.', image: '/media/hotel-programs/aman/aman-hero-2000.jpg', href: '/book-hotel' },
  { num: '03', name: 'Journeys', desc: 'Crafted itineraries — access, not checklists. One advisor, first call to last night.', image: '/media/hotel-programs/como-hotels/Como-hero-tuscany-2200.jpg', href: '/plan-a-trip' },
]

export default async function LidoHomePage({ params }: PageProps) {
  const { agentId } = await params
  const base = `/t2/${agentId}`
  const advisors = (await getAgencyAdvisors(agentId)).slice(0, 6)

  return (
    <div style={{ background: 'var(--lido-bg)', color: 'var(--lido-text)' }}>
      {/* ── Hero (traditional · white) ─────────────────────────────────── */}
      <section className="lido-hero">
        <div className="lido-hero-copy">
          <p className="lido-eyebrow" style={{ marginBottom: 28 }}>A Collective of Specialists</p>
          <h1 className="lido-display lido-hero-h1">Travel at its most uncompromising.</h1>
          <p className="lido-body lido-hero-sub">
            Aman. Four Seasons. Orient Express. The places that don&apos;t need to advertise — and the people who can
            still get you in.
          </p>
          <div className="lido-hero-cta">
            <Link href={`${base}/contact`} className="lido-btn-fill">Plan a Journey</Link>
            <Link href={`${base}/advisors`} className="lido-arrow">The Collective <span aria-hidden>→</span></Link>
          </div>
        </div>

        {/* Signature shape row */}
        <div className="lido-hero-shapes">
          {HERO_SHAPES.map((s, i) => (
            <div key={i} className={`lido-shape ${s.shape}`} style={{ aspectRatio: s.ratio, marginTop: s.top }}>
              <Image src={s.image} alt="" fill priority={i < 2} sizes="(max-width: 760px) 50vw, 24vw" />
            </div>
          ))}
        </div>
      </section>

      {/* ── Press bar ──────────────────────────────────────────────────── */}
      <LidoPressBar />

      {/* ── 01 · Who we are (arch image + editorial) — grey band ───────── */}
      <div className="lido-band-grey">
      <section className="lido-section">
        <MagazineHeader ordinal="01" eyebrow="Who We Are" base={base} />
        <div className="lido-split-3070">
          <div style={{ position: 'relative' }}>
            <span className="lido-ordinal" style={{ fontSize: 170, position: 'absolute', top: -96, left: -10, zIndex: 0 }} aria-hidden>01.</span>
            <div className="lido-shape lido-arch" style={{ aspectRatio: '4 / 5', position: 'relative', zIndex: 1 }}>
              <Image src="/media/hotel-programs/belmond-bellini-club/belmond-hero-2000.jpg" alt="" fill sizes="(max-width: 900px) 100vw, 30vw" />
            </div>
          </div>
          <div>
            <h2 className="lido-display" style={{ fontSize: 'clamp(32px, 4vw, 48px)', marginBottom: 28 }}>
              Not a travel agency. A collective.
            </h2>
            <p className="lido-body" style={{ fontSize: 16, marginBottom: 20, maxWidth: 620 }}>
              We are a small group of independent specialists who happen to book the world&apos;s most unrepeatable journeys.
              Aman at sea. The Orient Express sailing yachts. Expedition voyages to places most people only read about.
            </p>
            <p className="lido-body" style={{ fontSize: 16, marginBottom: 40, maxWidth: 620 }}>
              Each member owns one corner of the world — and the relationships that come with two decades inside it. You
              work with the right person, not the next available one.
            </p>
            <blockquote className="lido-display" style={{ fontStyle: 'italic', fontSize: 28, lineHeight: 1.3, margin: '0 0 40px', maxWidth: 560, color: 'var(--lido-text)' }}>
              &ldquo;The places that don&apos;t need to advertise.&rdquo;
            </blockquote>
            <Link href={`${base}/about`} className="lido-arrow">The Story <span aria-hidden>→</span></Link>
          </div>
        </div>
      </section>
      </div>

      {/* ── 02 · Services (cinematic, sharp rectangles) ────────────────── */}
      <section className="lido-section">
        <MagazineHeader ordinal="02" eyebrow="What We Do" base={base} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {SERVICES.map((s) => (
            <Link key={s.name} href={`${base}${s.href}`} className="lido-shape lido-rect lido-service-card" style={{ aspectRatio: '21 / 9' }}>
              <Image src={s.image} alt={s.name} fill sizes="(max-width: 1280px) 100vw, 1184px" />
              <div className="lido-service-overlay">
                <div>
                  <span className="lido-eyebrow" style={{ color: 'rgba(237,234,228,0.8)' }}>{s.num}</span>
                  <h3 className="lido-display" style={{ fontSize: 'clamp(28px, 4vw, 36px)', margin: '6px 0 8px', color: '#EDEAE4' }}>{s.name}</h3>
                  <p style={{ fontFamily: 'var(--lido-font-body)', fontSize: 13, color: 'rgba(237,234,228,0.78)', margin: 0, maxWidth: 460 }}>{s.desc}</p>
                </div>
                <span className="lido-service-arrow" aria-hidden>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Partner network (dark module · white logos · 2 filters) ────── */}
      <LidoPartnerNetwork base={base} />

      {/* ── 03 · Destinations (arch cards, labels below) ───────────────── */}
      <section className="lido-section">
        <MagazineHeader ordinal="03" eyebrow="Destinations" cta={{ label: 'View All', href: '/destinations' }} base={base} />
        <div className="lido-scroll-strip">
          {LIDO_DESTINATIONS.map((d) => (
            <Link key={d.slug} href={`${base}/destinations/${d.slug}`} className="lido-dest-card">
              <div className="lido-shape lido-arch" style={{ aspectRatio: '3 / 4' }}>
                <Image src={d.cardImage} alt={d.label} fill sizes="(max-width: 768px) 70vw, 360px" />
              </div>
              <h3 className="lido-display lido-dest-name" style={{ fontSize: 24, margin: '20px 0 0', textAlign: 'center' }}>{d.label}</h3>
            </Link>
          ))}
          <Link href={`${base}/destinations`} className="lido-dest-viewall">
            <span className="lido-display" style={{ fontSize: 26, lineHeight: 1.2 }}>View All<br />Destinations</span>
            <span className="lido-arrow" aria-hidden>Explore →</span>
          </Link>
        </div>
      </section>

      {/* ── 04 · The Collective (advisor grid) — grey band ─────────────── */}
      <div className="lido-band-grey">
      <section className="lido-section">
        <MagazineHeader ordinal="04" eyebrow="The Collective" cta={{ label: 'Meet the Collective', href: '/advisors' }} base={base} />
        <div style={{ maxWidth: 720, marginBottom: 56 }}>
          <h2 className="lido-display" style={{ fontSize: 'clamp(32px, 4vw, 48px)', marginBottom: 20 }}>People, not pipelines.</h2>
          <p className="lido-body" style={{ fontSize: 16 }}>
            Each member of The Lido Collective specializes in one corner of the world. You work with the right person —
            not the next available one.
          </p>
        </div>
        <div className="lido-advisor-grid">
          {advisors.map((a) => (
            <Link key={a.slug} href={`${base}/advisors/${a.slug}`} className="lido-advisor-card">
              <div className="lido-advisor-photo">
                <Image src={a.photo} alt={a.name} fill sizes="120px" style={{ objectFit: 'cover' }} />
              </div>
              <h3 className="lido-display lido-advisor-name" style={{ fontSize: 22, margin: '20px 0 6px' }}>{a.name}</h3>
              <p style={{ fontFamily: 'var(--lido-font-body)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--lido-text-muted)', margin: '0 0 16px' }}>{a.title}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
                {a.specialties.slice(0, 2).map((s) => (
                  <span key={s} style={{ fontFamily: 'var(--lido-font-body)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--lido-text-muted)', border: '1px solid var(--lido-line)', padding: '4px 10px' }}>
                    {s}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>
      </div>

      {/* ── 05 · Journal (editorial rows) ──────────────────────────────── */}
      <section className="lido-section">
        <MagazineHeader ordinal="05" eyebrow="From the Field" cta={{ label: 'The Journal', href: '/journal' }} base={base} />
        <div className="lido-journal-grid">
          {LIDO_JOURNAL.map((post) => (
            <Link key={post.slug} href={`${base}/journal`} className="lido-journal-card">
              <div className="lido-shape lido-rect" style={{ aspectRatio: '3 / 2', marginBottom: 20 }}>
                <Image src={post.image} alt={post.title} fill sizes="(max-width: 900px) 100vw, 380px" />
              </div>
              <span className="lido-eyebrow">{post.category}</span>
              <h3 className="lido-display lido-journal-title" style={{ fontSize: 26, lineHeight: 1.1, margin: '12px 0 14px' }}>{post.title}</h3>
              <p className="lido-body" style={{ fontSize: 14, marginBottom: 16 }}>{post.excerpt}</p>
              <span style={{ fontFamily: 'var(--lido-font-body)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--lido-text-muted)' }}>{post.date} · Read →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Instagram mosaic ───────────────────────────────────────────── */}
      <LidoInstagramMosaic />

      {/* ── CTA band (light) ───────────────────────────────────────────── */}
      <section className="lido-band-grey" style={{ padding: 'clamp(110px, 15vw, 190px) 48px', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2 className="lido-display" style={{ fontSize: 'clamp(40px, 6vw, 60px)', marginBottom: 24 }}>Ready to begin?</h2>
          <p className="lido-body" style={{ fontSize: 17, margin: '0 auto 44px', maxWidth: 520 }}>
            Conversations start with a note. We respond personally within 24 hours.
          </p>
          <form action={`${base}/contact`} style={{ display: 'flex', gap: 12, maxWidth: 480, margin: '0 auto', justifyContent: 'center', flexWrap: 'wrap' }}>
            <input
              type="email"
              name="email"
              placeholder="Your email"
              aria-label="Your email"
              style={{ flex: 1, minWidth: 220, background: 'transparent', border: '1px solid var(--lido-line-strong)', borderRadius: 4, padding: '14px 18px', color: 'var(--lido-text)', fontFamily: 'var(--lido-font-body)', fontSize: 14, outline: 'none' }}
            />
            <button type="submit" className="lido-btn-fill">Begin <span aria-hidden>→</span></button>
          </form>
        </div>
      </section>

      {/* ── Scoped layout + interaction styles ─────────────────────────── */}
      <style>{`
        .lido-hero {
          max-width: var(--t2-content-max, 1280px);
          margin: 0 auto;
          padding: clamp(150px, 20vh, 240px) 48px clamp(64px, 8vw, 110px);
          text-align: center;
        }
        .lido-hero-h1 { font-size: clamp(44px, 6.4vw, 92px); font-weight: 400; line-height: 1.02; margin: 0 auto; max-width: 15ch; }
        .lido-hero-sub { font-size: 17px; max-width: 540px; margin: 28px auto 0; }
        .lido-hero-cta { display: flex; align-items: center; justify-content: center; gap: 28px; margin-top: 40px; flex-wrap: wrap; }
        .lido-hero-shapes {
          margin-top: clamp(56px, 7vw, 96px);
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(14px, 2vw, 28px);
          align-items: start;
        }

        .lido-split-3070 { display: grid; grid-template-columns: 1fr 2.2fr; gap: clamp(32px, 6vw, 88px); align-items: start; }

        .lido-service-card { position: relative; }
        .lido-service-overlay {
          position: absolute; inset: 0; z-index: 2;
          display: flex; align-items: flex-end; justify-content: space-between; gap: 24px;
          padding: clamp(24px, 4vw, 48px);
          background: linear-gradient(to top, rgba(6,16,30,0.74) 0%, rgba(6,16,30,0.16) 55%, rgba(6,16,30,0) 100%);
        }
        .lido-service-arrow { font-family: var(--lido-font-body); font-size: 22px; color: #EDEAE4; opacity: 0; transform: translateX(-8px); transition: opacity 0.3s ease, transform 0.3s ease; align-self: flex-end; }
        .lido-service-card:hover .lido-service-arrow { opacity: 0.9; transform: translateX(0); }

        .lido-partner-name:hover { opacity: 0.95 !important; }

        .lido-scroll-strip { display: flex; gap: 28px; overflow-x: auto; scroll-snap-type: x mandatory; padding-bottom: 12px; scrollbar-width: none; margin: 0 -4px; }
        .lido-scroll-strip::-webkit-scrollbar { display: none; }
        .lido-dest-card { flex: 0 0 auto; width: clamp(240px, 30vw, 340px); scroll-snap-align: start; text-decoration: none; color: var(--lido-text); }
        .lido-dest-name { transition: opacity 0.2s ease; }
        .lido-dest-card:hover .lido-dest-name { opacity: 0.62; }
        .lido-dest-viewall { flex: 0 0 auto; width: clamp(240px, 30vw, 340px); aspect-ratio: 3 / 4; scroll-snap-align: start; display: flex; flex-direction: column; align-items: flex-start; justify-content: space-between; border: 1px solid var(--lido-line-strong); padding: 32px; text-decoration: none; color: var(--lido-text); }

        .lido-advisor-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px 32px; }
        .lido-advisor-card { display: flex; flex-direction: column; align-items: center; text-align: center; text-decoration: none; color: var(--lido-text); padding: 36px 16px; border-bottom: 1px solid var(--lido-line); }
        .lido-advisor-photo { position: relative; width: 120px; height: 120px; border-radius: 999px; overflow: hidden; }
        .lido-advisor-photo img { transition: transform 0.5s var(--t2-ease-out); }
        .lido-advisor-card:hover .lido-advisor-photo img { transform: scale(1.05); }
        .lido-advisor-name { transition: text-decoration 0.2s ease; }
        .lido-advisor-card:hover .lido-advisor-name { text-decoration: underline; text-underline-offset: 5px; }

        .lido-journal-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
        .lido-journal-card { text-decoration: none; color: var(--lido-text); display: block; }
        .lido-journal-title { transition: opacity 0.2s ease; }
        .lido-journal-card:hover .lido-journal-title { opacity: 0.62; }

        @media (max-width: 900px) {
          .lido-hero-shapes { grid-template-columns: repeat(2, 1fr); }
          .lido-hero-shapes > *:nth-child(n) { margin-top: 0 !important; }
          .lido-split-3070 { grid-template-columns: 1fr; }
          .lido-advisor-grid { grid-template-columns: repeat(2, 1fr); }
          .lido-journal-grid { grid-template-columns: 1fr; gap: 48px; }
        }
        @media (max-width: 640px) {
          .lido-hero { padding-left: 22px; padding-right: 22px; padding-top: clamp(116px, 17vh, 150px); }
          .lido-hero-h1 { font-size: clamp(34px, 8.4vw, 60px); }
          .lido-hero-sub { font-size: 15px; }
        }
        @media (max-width: 560px) {
          .lido-advisor-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
