import type {
  CruiseDestination,
  CruiseExperience,
  CruiseSuite,
  CruiseJourney,
} from '@/lib/cruise-lines'

// Meridian (T3) cruise detail sections. Editorial, restrained — the T3 design
// system. Template isolation: these never import from t2/*.

function Header({ eyebrow, heading, body }: { eyebrow: string; heading: string; body?: string }) {
  return (
    <div style={{ maxWidth: 'var(--t3-content-narrow)', marginBottom: 'var(--t3-gap)' }}>
      <span className="t3-eyebrow t3-eyebrow-plain">{eyebrow}</span>
      <h2 className="t3-headline-xl" style={{ marginTop: 28 }}>{heading}</h2>
      {body && <p className="t3-body t3-body-lg" style={{ marginTop: 24 }}>{body}</p>}
    </div>
  )
}

// ── Destinations ────────────────────────────────────────────────────────────
export function T3CruiseDestinations({ destinations }: { destinations: CruiseDestination[] }) {
  if (!destinations?.length) return null
  return (
    <section className="t3-section">
      <Header eyebrow="Where It Sails" heading="Destinations." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--t3-gap)' }} className="t3-cruise-2col">
        {destinations.map((d) => (
          <article key={d.name}>
            <div style={{ position: 'relative', aspectRatio: '4 / 3', overflow: 'hidden', marginBottom: 22, background: 'var(--t3-bg-alt)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={d.image_url} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
            </div>
            <h3 className="t3-headline-md" style={{ marginBottom: 12, fontSize: 'clamp(18px, 1.6vw, 22px)' }}>{d.name}</h3>
            <p className="t3-body" style={{ fontSize: 'clamp(13.5px, 1vw, 14.5px)', margin: 0 }}>{d.blurb}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

// ── Experiences (alternating editorial rows) ─────────────────────────────────
export function T3CruiseExperiences({ experiences }: { experiences: CruiseExperience[] }) {
  if (!experiences?.length) return null
  return (
    <section className="t3-section">
      <Header eyebrow="On Board" heading="Experiences." />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--t3-gap-loose)' }}>
        {experiences.map((e, i) => (
          <div key={e.title} className="t3-cruise-exp-row" style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--t3-gap)', alignItems: 'center',
            direction: i % 2 === 1 ? 'rtl' : 'ltr',
          }}>
            <div style={{ direction: 'ltr', position: 'relative', aspectRatio: '4 / 3', overflow: 'hidden', background: 'var(--t3-bg-alt)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={e.image_url} alt={e.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
            </div>
            <div style={{ direction: 'ltr' }}>
              <div style={{ fontFamily: 'var(--t3-font-display)', fontSize: 28, fontWeight: 400, color: 'var(--t3-accent)', marginBottom: 14, letterSpacing: '-0.02em' }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="t3-headline-md" style={{ marginBottom: 16, fontSize: 'clamp(20px, 1.9vw, 26px)' }}>{e.title}</h3>
              <p className="t3-body t3-body-lg" style={{ margin: 0 }}>{e.blurb}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── The Yacht: suites (dark) ─────────────────────────────────────────────────
export function T3CruiseSuites({ suites, vesselNote }: { suites: CruiseSuite[]; vesselNote?: string }) {
  if (!suites?.length) return null
  return (
    <section className="t3-section t3-cruise-suites" style={{ background: 'var(--t3-dark-bg)', color: '#fff' }}>
      <div style={{ maxWidth: 'var(--t3-content-narrow)', marginBottom: 'var(--t3-gap)' }}>
        <span className="t3-eyebrow t3-eyebrow-plain" style={{ color: 'rgba(255,255,255,0.72)' }}>The Yacht</span>
        <h2 className="t3-headline-xl" style={{ color: '#fff', marginTop: 28 }}>Suites &amp; accommodation.</h2>
        {vesselNote && <p className="t3-body t3-body-lg" style={{ color: 'rgba(247,245,240,0.78)', marginTop: 24 }}>{vesselNote}</p>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--t3-gap)' }} className="t3-cruise-2col">
        {suites.map((s) => (
          <article key={s.name}>
            <div style={{ position: 'relative', aspectRatio: '16 / 11', overflow: 'hidden', marginBottom: 20, background: 'rgba(255,255,255,0.06)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.image_url} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
            </div>
            <h3 className="t3-headline-md" style={{ color: '#fff', marginBottom: 12, fontSize: 'clamp(17px, 1.5vw, 21px)' }}>{s.name}</h3>
            <p className="t3-body" style={{ color: 'rgba(247,245,240,0.7)', fontSize: 'clamp(13px, 1vw, 14px)', margin: 0 }}>{s.blurb}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

// ── Sample journeys ──────────────────────────────────────────────────────────
export function T3CruiseJourneys({ journeys }: { journeys: CruiseJourney[] }) {
  if (!journeys?.length) return null
  return (
    <section className="t3-section">
      <Header eyebrow="Itineraries" heading="Sample journeys." body="Illustrative routings to spark the imagination — every sailing is shaped around you." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--t3-gap)', borderTop: '1px solid var(--t3-divider)', paddingTop: 'var(--t3-gap)' }} className="t3-cruise-3col">
        {journeys.map((j) => (
          <article key={j.name}>
            <div style={{ fontFamily: 'var(--t3-font-display)', fontSize: 'clamp(13px, 1vw, 14px)', letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--t3-accent)', marginBottom: 14 }}>
              {j.nights}
            </div>
            <h3 className="t3-headline-md" style={{ marginBottom: 14, fontSize: 'clamp(18px, 1.6vw, 22px)' }}>{j.name}</h3>
            <p className="t3-body" style={{ fontSize: 'clamp(13px, 1vw, 14px)', fontWeight: 500, color: 'var(--t3-text)', marginBottom: 14 }}>{j.route}</p>
            <p className="t3-body" style={{ fontSize: 'clamp(13px, 1vw, 14px)', color: 'var(--t3-text-muted)', margin: 0 }}>{j.blurb}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
