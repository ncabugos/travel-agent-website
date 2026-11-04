import Link from 'next/link'
import type { CruiseBenefit, CruiseLine, CruiseShip } from '@/lib/cruise-lines'
import {
  formatDepartureDate,
  groupDeparturesByYear,
  type CruiseDeparture,
  type CruiseItinerary,
} from '@/lib/cruise-itineraries'
import { cruiseItineraryPath, templatePath } from '@/lib/tenant-paths'

// Meridian (T3) itinerary template. Template isolation: never imports from t2/* or t4/*.

interface Props {
  line: CruiseLine
  itinerary: CruiseItinerary
  departures: CruiseDeparture[]
  ships: CruiseShip[]
  benefits: CruiseBenefit[]
}

const small: React.CSSProperties = { fontSize: 'clamp(13px, 1vw, 14px)' }
const label: React.CSSProperties = { fontFamily: 'var(--t3-font-display)', fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--t3-accent)' }
const rule = '1px solid var(--t3-divider)'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="t3-section">
      <h2 className="t3-headline-xl" style={{ marginBottom: 'var(--t3-gap-tight)' }}>{title}</h2>
      {children}
    </section>
  )
}

/** Sections 2 to 8 of the itinerary template. The page adds the hero and the enquiry. */
export function T3ItineraryDetail({ line, itinerary, departures, ships, benefits }: Props) {
  const facts = [
    { label: 'Length', value: itinerary.nights },
    { label: 'Region', value: itinerary.region },
    { label: 'Countries', value: itinerary.countries },
  ].filter((fact) => fact.value)
  const years = groupDeparturesByYear(departures)
  const included = line.included ?? []

  return (
    <>
      <section className="t3-section">
        <dl className="t3-itin-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--t3-gap-tight)', margin: '0 0 var(--t3-gap)', paddingBottom: 32, borderBottom: rule }}>
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt style={label}>{fact.label}</dt>
              <dd className="t3-headline-md" style={{ margin: '8px 0 0' }}>{fact.value}</dd>
            </div>
          ))}
        </dl>
        <div className="t3-itin-intro" style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 'var(--t3-gap)' }}>
          <div>
            {itinerary.overview && <p className="t3-body t3-body-lg" style={{ marginBottom: 20 }}>{itinerary.overview}</p>}
            <p className="t3-body" style={{ fontWeight: 500, color: 'var(--t3-text)', margin: 0 }}>{itinerary.route}</p>
          </div>
          {itinerary.highlights.length > 0 && (
            <div>
              <h2 className="t3-headline-md" style={{ marginBottom: 16 }}>Highlights</h2>
              <ul className="t3-body" style={{ paddingLeft: 18, margin: 0 }}>
                {itinerary.highlights.map((highlight) => <li key={highlight} style={{ marginBottom: 8 }}>{highlight}</li>)}
              </ul>
            </div>
          )}
        </div>
      </section>

      <Section title="Day by day">
        {itinerary.days_direction && (
          <p className="t3-body" style={{ marginBottom: 32 }}>Shown from {itinerary.days_direction}. Direction and ports can vary by sailing.</p>
        )}
        <ol style={{ listStyle: 'none', margin: 0, padding: 0, borderTop: rule }}>
          {itinerary.days.map((day, index) => (
            <li key={index} className="t3-itin-day" style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: 24, padding: '28px 0', borderBottom: rule }}>
              <span style={label}>Day {index + 1}</span>
              <div>
                <h3 className="t3-headline-md" style={{ margin: 0 }}>{day.title || day.place}</h3>
                {day.title && <p className="t3-body" style={{ ...small, color: 'var(--t3-text)', margin: '6px 0 0' }}>{day.place}</p>}
                {day.summary && <p className="t3-body" style={{ marginTop: 12, marginBottom: 0 }}>{day.summary}</p>}
                {day.excursions && day.excursions.length > 0 && (
                  <p className="t3-body" style={{ ...small, marginTop: 12, marginBottom: 0 }}>
                    <strong style={{ fontWeight: 600 }}>Tours:</strong> {day.excursions.join(', ')}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {years.length > 0 && (
        <Section title="Dates">
          <p className="t3-body" style={{ marginBottom: 32 }}>
            Availability changes. Ask us to confirm.{itinerary.departures_note ? ` ${itinerary.departures_note}` : ''}
          </p>
          <div className="t3-itin-years" style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(years.length, 3)}, 1fr)`, gap: 'var(--t3-gap)' }}>
            {years.map(({ year, rows }) => (
              <div key={year}>
                <h3 className="t3-headline-md" style={{ paddingBottom: 12, borderBottom: rule, margin: 0 }}>{year}</h3>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {rows.map((row) => (
                    <li key={row.id} style={{ padding: '12px 0', borderBottom: rule }}>
                      <span style={{ display: 'block', fontSize: 14, fontWeight: 500, color: 'var(--t3-text)' }}>{formatDepartureDate(row.departs_on)}</span>
                      <span style={{ display: 'block', fontSize: 13, color: 'var(--t3-text-muted)', marginTop: 2 }}>
                        {row.embark} to {row.disembark}{row.ship ? ` · ${row.ship}` : ''}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      )}

      {included.length > 0 && (
        <Section title="What's included">
          <div className="t3-itin-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--t3-gap-tight)' }}>
            {included.map((group) => (
              <div key={group.title}>
                <h3 className="t3-headline-md" style={{ marginBottom: 12 }}>{group.title}</h3>
                <ul className="t3-body" style={{ ...small, paddingLeft: 18, margin: 0 }}>
                  {group.items.map((item) => <li key={item} style={{ marginBottom: 6 }}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      )}

      {benefits.length > 0 && (
        <Section title="Virtuoso benefits">
          <div className="t3-itin-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--t3-gap-tight)' }}>
            {benefits.map((benefit) => (
              <div key={benefit.title}>
                <h3 className="t3-headline-md" style={{ marginBottom: 8 }}>{benefit.title}</h3>
                <p className="t3-body" style={{ ...small, margin: 0 }}>{benefit.description}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {ships.length > 0 && (
        <Section title="Ships">
          <div className="t3-itin-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--t3-gap-tight)' }}>
            {ships.map((ship) => (
              <article key={ship.name}>
                {ship.image && (
                  <div style={{ aspectRatio: '16 / 10', overflow: 'hidden', background: 'var(--t3-bg-alt)', marginBottom: 16 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={ship.image} alt={ship.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  </div>
                )}
                <h3 className="t3-headline-md" style={{ margin: 0 }}>{ship.name}</h3>
                {ship.description && <p className="t3-body" style={{ ...small, marginTop: 8, marginBottom: 0 }}>{ship.description}</p>}
              </article>
            ))}
          </div>
        </Section>
      )}

      <ResponsiveCss />
    </>
  )
}

/** Section 10: other itineraries on this line, full pages first. */
export function T3MoreItineraries({ agentId, line, currentSlug }: { agentId: string; line: CruiseLine; currentSlug: string }) {
  const others = (line.sample_journeys ?? [])
    .filter((journey) => journey.slug !== currentSlug)
    .sort((a, b) => Number(Boolean(b.has_details)) - Number(Boolean(a.has_details)))
    .slice(0, 3)
  if (others.length === 0) return null

  return (
    <Section title="More itineraries">
      <div className="t3-itin-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--t3-gap-tight)' }}>
        {others.map((journey) => (
          <article key={journey.name}>
            <span style={label}>{journey.nights}</span>
            <h3 className="t3-headline-md" style={{ margin: '8px 0' }}>{journey.name}</h3>
            <p className="t3-body" style={{ ...small, marginBottom: 10 }}>{journey.route}</p>
            <Link
              href={journey.has_details && journey.slug
                ? cruiseItineraryPath('t3', agentId, line.slug, journey.slug)
                : `${templatePath('t3', agentId)}/find-cruise/${line.slug}`}
              style={{ fontSize: 13, color: 'var(--t3-text)', textDecoration: 'underline', textUnderlineOffset: 4 }}
            >
              {journey.has_details ? 'View full itinerary' : `View ${line.name}`}
            </Link>
          </article>
        ))}
      </div>
      <ResponsiveCss />
    </Section>
  )
}

function ResponsiveCss() {
  return (
    <style>{`
      @media (max-width: 1024px) {
        .t3-itin-intro { grid-template-columns: 1fr !important; }
        .t3-itin-grid-3, .t3-itin-grid-4 { grid-template-columns: 1fr 1fr !important; }
      }
      @media (max-width: 768px) {
        .t3-itin-grid-3, .t3-itin-grid-4, .t3-itin-years { grid-template-columns: 1fr !important; }
        .t3-itin-day { grid-template-columns: 1fr !important; gap: 8px !important; }
      }
    `}</style>
  )
}
