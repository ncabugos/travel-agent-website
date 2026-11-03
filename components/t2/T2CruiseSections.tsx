import Image from 'next/image'
import Link from 'next/link'
import type {
  CruiseDestination,
  CruiseExperience,
  CruiseSuite,
  CruiseJourney,
} from '@/lib/cruise-lines'
import type { CollectionItinerary, CruiseCollection } from '@/lib/cruise-itineraries'
import { cruiseCollectionPath } from '@/lib/tenant-paths'

// ── Shared section header ──────────────────────────────────────────────────────
function SectionHeader({ eyebrow, heading, body }: { eyebrow: string; heading: string; body?: string }) {
  return (
    <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto clamp(40px, 6vw, 64px)' }}>
      <span style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--t2-primary)', opacity: 0.6, display: 'block', marginBottom: 16 }}>
        {eyebrow}
      </span>
      <h2 className="t2-heading" style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', margin: 0 }}>{heading}</h2>
      {body && (
        <p className="t2-body t2-body-center" style={{ fontSize: 16, lineHeight: 1.85, marginTop: 20 }}>{body}</p>
      )}
    </div>
  )
}

// ── Destinations ───────────────────────────────────────────────────────────────
export function T2CruiseDestinations({ destinations }: { destinations: CruiseDestination[] }) {
  if (!destinations?.length) return null
  return (
    <section className="t2-section" style={{ background: 'var(--t2-bg-alt)', maxWidth: 'none' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px' }}>
        <SectionHeader eyebrow="Where It Sails" heading="Destinations" />
        <div className="t2-cr-dest-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 32 }}>
          {destinations.map((d) => (
            <article key={d.name} style={{ borderRadius: 'var(--t2-radius-lg)', overflow: 'hidden', border: '1px solid var(--t2-divider)', background: '#fff' }}>
              <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
                <Image src={d.image_url} alt={d.name} fill style={{ objectFit: 'cover' }} sizes="(max-width: 900px) 100vw, 50vw" unoptimized />
              </div>
              <div style={{ padding: '28px 30px 32px' }}>
                <h3 style={{ fontFamily: 'var(--t2-font-serif)', fontSize: 22, fontWeight: 500, marginBottom: 12 }}>{d.name}</h3>
                <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 14, lineHeight: 1.75, color: 'var(--t2-text-muted)', margin: 0 }}>{d.blurb}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <style>{`@media (max-width: 760px){ .t2-cr-dest-grid{ grid-template-columns: 1fr !important; } }`}</style>
    </section>
  )
}

// ── Experiences (alternating editorial rows) ───────────────────────────────────
export function T2CruiseExperiences({ experiences }: { experiences: CruiseExperience[] }) {
  if (!experiences?.length) return null
  return (
    <section className="t2-section" style={{ maxWidth: 'none' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 48px' }}>
        <SectionHeader eyebrow="On Board" heading="Experiences" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(48px, 7vw, 88px)' }}>
          {experiences.map((e, i) => (
            <div key={e.title} className="t2-cr-exp-row" style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(28px, 5vw, 64px)', alignItems: 'center',
              direction: i % 2 === 1 ? 'rtl' : 'ltr',
            }}>
              <div style={{ direction: 'ltr', position: 'relative', aspectRatio: '4/3', overflow: 'hidden', borderRadius: 'var(--t2-radius-lg)' }}>
                <Image src={e.image_url} alt={e.title} fill style={{ objectFit: 'cover' }} sizes="(max-width: 820px) 100vw, 50vw" unoptimized />
              </div>
              <div style={{ direction: 'ltr' }}>
                <span style={{ fontFamily: 'var(--t2-font-serif)', fontSize: 13, letterSpacing: '0.1em', color: 'var(--t2-primary)', opacity: 0.45, display: 'block', marginBottom: 14 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 style={{ fontFamily: 'var(--t2-font-serif)', fontSize: 'clamp(24px, 2.6vw, 30px)', fontWeight: 500, marginBottom: 16 }}>{e.title}</h3>
                <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 15, lineHeight: 1.85, color: 'var(--t2-text-muted)', margin: 0 }}>{e.blurb}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media (max-width: 820px){ .t2-cr-exp-row{ grid-template-columns: 1fr !important; direction: ltr !important; } }`}</style>
    </section>
  )
}

// ── The Yacht: suites ──────────────────────────────────────────────────────────
export function T2CruiseSuites({ suites, vesselNote }: { suites: CruiseSuite[]; vesselNote?: string }) {
  if (!suites?.length) return null
  return (
    <section className="t2-section" style={{ background: 'var(--t2-dark-bg)', maxWidth: 'none', color: '#fff' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px' }}>
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto clamp(40px, 6vw, 64px)' }}>
          <span style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: 16 }}>
            The Yacht
          </span>
          <h2 style={{ fontFamily: 'var(--t2-font-serif)', fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 400, color: '#fff', margin: 0 }}>Suites &amp; Accommodation</h2>
          {vesselNote && (
            <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 15, lineHeight: 1.8, color: 'rgba(255,255,255,0.7)', marginTop: 20 }}>{vesselNote}</p>
          )}
        </div>
        <div className="t2-cr-suite-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 32 }}>
          {suites.map((s) => (
            <article key={s.name} style={{ borderRadius: 'var(--t2-radius-lg)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.12)' }}>
              <div style={{ position: 'relative', aspectRatio: '16/11', overflow: 'hidden' }}>
                <Image src={s.image_url} alt={s.name} fill style={{ objectFit: 'cover' }} sizes="(max-width: 760px) 100vw, 50vw" unoptimized />
              </div>
              <div style={{ padding: '26px 28px 30px' }}>
                <h3 style={{ fontFamily: 'var(--t2-font-serif)', fontSize: 21, fontWeight: 500, color: '#fff', marginBottom: 12 }}>{s.name}</h3>
                <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 14, lineHeight: 1.75, color: 'rgba(255,255,255,0.68)', margin: 0 }}>{s.blurb}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <style>{`@media (max-width: 760px){ .t2-cr-suite-grid{ grid-template-columns: 1fr !important; } }`}</style>
    </section>
  )
}

// ── Itinerary card image ───────────────────────────────────────────────────────
function JourneyImage({ src, alt }: { src?: string; alt: string }) {
  if (!src) return null
  return (
    <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden', background: 'var(--t2-bg-alt)' }}>
      <Image src={src} alt={alt} fill style={{ objectFit: 'cover' }} sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 33vw" unoptimized />
    </div>
  )
}

// ── Collection cards (span cruise lines) ───────────────────────────────────────
export function T2CollectionItineraries({ itineraries, base }: { itineraries: CollectionItinerary[]; base: string }) {
  return (
    <section className="t2-section" style={{ background: 'var(--t2-bg-alt)', maxWidth: 'none' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 48px' }} className="t2-cr-collection-wrap">
        <div className="t2-cr-journey-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
          {itineraries.map((j) => (
            <article key={j.id} style={{
              background: '#fff', borderRadius: 'var(--t2-radius-lg)', border: '1px solid var(--t2-divider)',
              overflow: 'hidden', display: 'flex', flexDirection: 'column',
            }}>
              <JourneyImage src={j.image_url} alt={j.name} />
              <div style={{ padding: '30px 30px 34px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <span style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--t2-primary)', opacity: 0.6, marginBottom: 14 }}>
                  {j.line_name} · {j.nights}
                </span>
                <h3 style={{ fontFamily: 'var(--t2-font-serif)', fontSize: 22, fontWeight: 500, marginBottom: 14, lineHeight: 1.25 }}>{j.name}</h3>
                <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 13, lineHeight: 1.7, color: 'var(--t2-primary)', opacity: 0.85, marginBottom: 16, fontWeight: 500 }}>{j.route}</p>
                <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 14, lineHeight: 1.75, color: 'var(--t2-text-muted)', margin: '0 0 22px' }}>{j.blurb}</p>
                <Link href={`${base}/find-cruise/${j.line_slug}`} style={{ marginTop: 'auto', fontFamily: 'var(--t2-font-sans)', fontSize: 13, color: 'var(--t2-primary)', textDecoration: 'underline', textUnderlineOffset: 4 }}>
                  View {j.line_name}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 980px){ .t2-cr-journey-grid{ grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 640px){ .t2-cr-journey-grid{ grid-template-columns: 1fr !important; } .t2-cr-collection-wrap{ padding: 0 24px !important; } }
      `}</style>
    </section>
  )
}

// ── Links from the cruise index to collections ─────────────────────────────────
export function T2CruiseCollectionLinks({ collections, agentId }: { collections: CruiseCollection[]; agentId: string }) {
  if (!collections.length) return null
  return (
    <section className="t2-section" style={{ paddingBottom: 0 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 900, margin: '0 auto' }}>
        {collections.map((c) => (
          <Link key={c.id} href={cruiseCollectionPath('t2', agentId, c.slug)} style={{ display: 'block', padding: '26px 30px', border: '1px solid var(--t2-divider)', borderRadius: 'var(--t2-radius-lg)', background: '#fff', color: 'inherit', textDecoration: 'none' }}>
            <span style={{ display: 'block', fontFamily: 'var(--t2-font-serif)', fontSize: 24, fontWeight: 500, marginBottom: 8 }}>{c.name}</span>
            {c.intro && <span style={{ display: 'block', fontFamily: 'var(--t2-font-sans)', fontSize: 14, lineHeight: 1.7, color: 'var(--t2-text-muted)', marginBottom: 12 }}>{c.intro}</span>}
            <span style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 13, color: 'var(--t2-primary)', textDecoration: 'underline', textUnderlineOffset: 4 }}>View itineraries</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

// ── Sample journeys ────────────────────────────────────────────────────────────
export function T2CruiseJourneys({ journeys }: { journeys: CruiseJourney[] }) {
  if (!journeys?.length) return null
  return (
    <section className="t2-section" style={{ background: 'var(--t2-bg-alt)', maxWidth: 'none' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 48px' }}>
        <SectionHeader eyebrow="Itineraries" heading="Sample Journeys" body="Illustrative routings to spark the imagination; published 2027 voyages to follow. Every sailing is shaped around you." />
        <div className="t2-cr-journey-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
          {journeys.map((j) => (
            <article key={j.name} style={{
              background: '#fff', borderRadius: 'var(--t2-radius-lg)', border: '1px solid var(--t2-divider)',
              overflow: 'hidden', display: 'flex', flexDirection: 'column',
            }}>
              <JourneyImage src={j.image_url} alt={j.name} />
              <div style={{ padding: '30px 30px 34px' }}>
                <span style={{ display: 'block', fontFamily: 'var(--t2-font-sans)', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--t2-primary)', opacity: 0.6, marginBottom: 14 }}>
                  {j.nights}
                </span>
                <h3 style={{ fontFamily: 'var(--t2-font-serif)', fontSize: 22, fontWeight: 500, marginBottom: 14, lineHeight: 1.25 }}>{j.name}</h3>
                <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 13, lineHeight: 1.7, color: 'var(--t2-primary)', opacity: 0.85, marginBottom: 16, fontWeight: 500 }}>{j.route}</p>
                <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 14, lineHeight: 1.75, color: 'var(--t2-text-muted)', margin: 0 }}>{j.blurb}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 980px){ .t2-cr-journey-grid{ grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 640px){ .t2-cr-journey-grid{ grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}
