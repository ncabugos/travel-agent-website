import type {
  CruiseDestination,
  CruiseExperience,
  CruiseSuite,
  CruiseJourney,
} from '@/lib/cruise-lines'

// Casa Solis (T4) cruise detail sections — quiet luxury, the T4 design system.
// Template isolation: these never import from t2/* or t3/*.

function Shell({ children, dark, padTop = true }: { children: React.ReactNode; dark?: boolean; padTop?: boolean }) {
  return (
    <section style={{ padding: `${padTop ? 'var(--t4-section-pad)' : '0'} 48px var(--t4-section-pad)`, background: dark ? 'var(--t4-dark-bg)' : undefined, color: dark ? '#fff' : undefined }}>
      <div style={{ maxWidth: 'var(--t4-content-wide)', margin: '0 auto' }}>{children}</div>
    </section>
  )
}

function Header({ eyebrow, heading, body, dark }: { eyebrow: string; heading: string; body?: string; dark?: boolean }) {
  return (
    <div style={{ maxWidth: 720, marginBottom: 64 }}>
      <span className="t4-eyebrow" style={dark ? { color: 'rgba(255,255,255,0.82)' } : undefined}>{eyebrow}</span>
      <h2 className="t4-headline-xl" style={{ marginTop: 28, color: dark ? '#fff' : undefined }}>{heading}</h2>
      {body && <p className="t4-body t4-body-lg" style={{ marginTop: 24, color: dark ? 'rgba(251,248,241,0.78)' : undefined }}>{body}</p>}
    </div>
  )
}

// ── Destinations ────────────────────────────────────────────────────────────
export function T4CruiseDestinations({ destinations }: { destinations: CruiseDestination[] }) {
  if (!destinations?.length) return null
  return (
    <Shell>
      <Header eyebrow="Where It Sails" heading="Destinations" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 40 }} className="t4-cruise-2col">
        {destinations.map((d) => (
          <article key={d.name}>
            <div style={{ position: 'relative', aspectRatio: '4 / 3', overflow: 'hidden', background: 'var(--t4-bg-alt)', marginBottom: 22 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={d.image_url} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
            </div>
            <h3 className="t4-headline-md" style={{ marginBottom: 12 }}>{d.name}</h3>
            <p className="t4-body" style={{ margin: 0 }}>{d.blurb}</p>
          </article>
        ))}
      </div>
      <ResponsiveCss />
    </Shell>
  )
}

// ── Experiences (alternating editorial rows) ─────────────────────────────────
export function T4CruiseExperiences({ experiences }: { experiences: CruiseExperience[] }) {
  if (!experiences?.length) return null
  return (
    <Shell>
      <Header eyebrow="On Board" heading="Experiences" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(56px, 8vw, 104px)' }}>
        {experiences.map((e, i) => (
          <div key={e.title} className="t4-cruise-exp-row" style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px, 5vw, 72px)', alignItems: 'center',
            direction: i % 2 === 1 ? 'rtl' : 'ltr',
          }}>
            <div style={{ direction: 'ltr', position: 'relative', aspectRatio: '4 / 3', overflow: 'hidden', background: 'var(--t4-bg-alt)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={e.image_url} alt={e.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
            </div>
            <div style={{ direction: 'ltr' }}>
              <div style={{ fontFamily: 'var(--t4-font-display)', fontSize: 44, fontWeight: 300, color: 'var(--t4-accent)', marginBottom: 16, letterSpacing: '-0.02em', lineHeight: 1 }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="t4-headline-md" style={{ marginBottom: 16 }}>{e.title}</h3>
              <p className="t4-body t4-body-lg" style={{ margin: 0 }}>{e.blurb}</p>
            </div>
          </div>
        ))}
      </div>
      <ResponsiveCss />
    </Shell>
  )
}

// ── The Yacht: suites (dark) ─────────────────────────────────────────────────
export function T4CruiseSuites({ suites, vesselNote }: { suites: CruiseSuite[]; vesselNote?: string }) {
  if (!suites?.length) return null
  return (
    <Shell dark>
      <Header eyebrow="The Yacht" heading="Suites &amp; Accommodation" body={vesselNote} dark />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 40 }} className="t4-cruise-2col">
        {suites.map((s) => (
          <article key={s.name}>
            <div style={{ position: 'relative', aspectRatio: '16 / 11', overflow: 'hidden', background: 'rgba(255,255,255,0.06)', marginBottom: 20 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.image_url} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
            </div>
            <h3 className="t4-headline-md" style={{ marginBottom: 12, color: '#fff' }}>{s.name}</h3>
            <p className="t4-body" style={{ margin: 0, color: 'rgba(251,248,241,0.7)' }}>{s.blurb}</p>
          </article>
        ))}
      </div>
      <ResponsiveCss />
    </Shell>
  )
}

// ── Sample journeys ──────────────────────────────────────────────────────────
export function T4CruiseJourneys({ journeys }: { journeys: CruiseJourney[] }) {
  if (!journeys?.length) return null
  return (
    <Shell>
      <Header eyebrow="Itineraries" heading="Sample Journeys" body="Illustrative routings to spark the imagination — every sailing is shaped around you." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, rowGap: 48, borderTop: '1px solid var(--t4-divider)', paddingTop: 56 }} className="t4-cruise-3col">
        {journeys.map((j) => (
          <article key={j.name}>
            <div style={{ fontFamily: 'var(--t4-font-display)', fontSize: 'clamp(13px, 1vw, 14px)', letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--t4-accent)', marginBottom: 16 }}>
              {j.nights}
            </div>
            <h3 className="t4-headline-md" style={{ marginBottom: 14 }}>{j.name}</h3>
            <p className="t4-body" style={{ fontWeight: 500, color: 'var(--t4-text)', marginBottom: 14, fontSize: 13.5 }}>{j.route}</p>
            <p className="t4-body" style={{ margin: 0, fontSize: 13.5 }}>{j.blurb}</p>
          </article>
        ))}
      </div>
      <ResponsiveCss />
    </Shell>
  )
}

function ResponsiveCss() {
  return (
    <style>{`
      @media (max-width: 900px) {
        .t4-cruise-3col { grid-template-columns: 1fr 1fr !important; }
      }
      @media (max-width: 700px) {
        .t4-cruise-2col { grid-template-columns: 1fr !important; gap: 28px !important; }
        .t4-cruise-3col { grid-template-columns: 1fr !important; gap: 28px !important; }
        .t4-cruise-exp-row { grid-template-columns: 1fr !important; direction: ltr !important; gap: 24px !important; }
      }
    `}</style>
  )
}
