import Image from 'next/image'
import Link from 'next/link'
import type { CruiseBenefit, CruiseLine, CruiseShip } from '@/lib/cruise-lines'
import {
  formatDepartureDate,
  groupDeparturesByYear,
  type CruiseDeparture,
  type CruiseItinerary,
} from '@/lib/cruise-itineraries'
import { cruiseItineraryPath, templatePath } from '@/lib/tenant-paths'

interface Props {
  line: CruiseLine
  itinerary: CruiseItinerary
  departures: CruiseDeparture[]
  ships: CruiseShip[]
  benefits: CruiseBenefit[]
}

const headingStyle: React.CSSProperties = { fontSize: 'clamp(28px, 3.5vw, 40px)', margin: '0 0 36px' }
const bodyStyle: React.CSSProperties = { fontFamily: 'var(--t2-font-sans)', fontSize: 15, lineHeight: 1.75, color: 'var(--t2-text-muted)', margin: 0 }
const labelStyle: React.CSSProperties = { fontFamily: 'var(--t2-font-sans)', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--t2-primary)', opacity: 0.7 }
const titleStyle: React.CSSProperties = { fontFamily: 'var(--t2-font-serif)', fontSize: 22, fontWeight: 500, lineHeight: 1.3, margin: 0 }

function Section({ title, alt, children }: { title: string; alt?: boolean; children: React.ReactNode }) {
  return (
    <section className="t2-section" style={{ background: alt ? 'var(--t2-bg-alt)' : undefined, maxWidth: 'none' }}>
      <div className="t2-itin-wrap" style={{ maxWidth: 1080, margin: '0 auto', padding: '0 48px' }}>
        <h2 className="t2-heading" style={headingStyle}>{title}</h2>
        {children}
      </div>
    </section>
  )
}

/** Sections 2 to 8 of the itinerary template. The page adds the hero and the lead form. */
export function T2ItineraryDetail({ line, itinerary, departures, ships, benefits }: Props) {
  const facts = [
    { label: 'Length', value: itinerary.nights },
    { label: 'Region', value: itinerary.region },
    { label: 'Countries', value: itinerary.countries },
  ].filter((fact) => fact.value)
  const years = groupDeparturesByYear(departures)
  const included = line.included ?? []

  return (
    <>
      <section className="t2-section" style={{ maxWidth: 'none' }}>
        <div className="t2-itin-wrap" style={{ maxWidth: 1080, margin: '0 auto', padding: '0 48px' }}>
          <dl className="t2-itin-facts" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, margin: '0 0 48px', paddingBottom: 32, borderBottom: '1px solid var(--t2-divider)' }}>
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt style={labelStyle}>{fact.label}</dt>
                <dd style={{ fontFamily: 'var(--t2-font-serif)', fontSize: 20, margin: '8px 0 0' }}>{fact.value}</dd>
              </div>
            ))}
          </dl>
          <div className="t2-itin-intro" style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 56 }}>
            <div>
              {itinerary.overview && <p style={{ ...bodyStyle, fontSize: 17, marginBottom: 20 }}>{itinerary.overview}</p>}
              <p style={{ ...bodyStyle, color: 'var(--t2-primary)', fontWeight: 500 }}>{itinerary.route}</p>
            </div>
            {itinerary.highlights.length > 0 && (
              <div>
                <h2 style={{ ...titleStyle, marginBottom: 16 }}>Highlights</h2>
                <ul style={{ ...bodyStyle, paddingLeft: 18 }}>
                  {itinerary.highlights.map((highlight) => <li key={highlight} style={{ marginBottom: 8 }}>{highlight}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      <Section title="Day by day" alt>
        {itinerary.days_direction && (
          <p style={{ ...bodyStyle, marginBottom: 32 }}>
            Shown from {itinerary.days_direction}. Direction and ports can vary by sailing.
          </p>
        )}
        <ol style={{ listStyle: 'none', margin: 0, padding: 0, borderTop: '1px solid var(--t2-divider)' }}>
          {itinerary.days.map((day, index) => (
            <li key={index} className="t2-itin-day" style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: 24, padding: '28px 0', borderBottom: '1px solid var(--t2-divider)' }}>
              <span style={labelStyle}>Day {index + 1}</span>
              <div>
                <h3 style={titleStyle}>{day.title || day.place}</h3>
                {day.title && <p style={{ ...bodyStyle, fontSize: 13, color: 'var(--t2-primary)', margin: '6px 0 0' }}>{day.place}</p>}
                {day.summary && <p style={{ ...bodyStyle, marginTop: 12 }}>{day.summary}</p>}
                {day.excursions && day.excursions.length > 0 && (
                  <p style={{ ...bodyStyle, fontSize: 13, marginTop: 12 }}>
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
          <p style={{ ...bodyStyle, marginBottom: 32 }}>
            Availability changes. Ask us to confirm.{itinerary.departures_note ? ` ${itinerary.departures_note}` : ''}
          </p>
          <div className="t2-itin-years" style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(years.length, 3)}, 1fr)`, gap: 40 }}>
            {years.map(({ year, rows }) => (
              <div key={year}>
                <h3 style={{ ...titleStyle, paddingBottom: 12, borderBottom: '1px solid var(--t2-divider)' }}>{year}</h3>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {rows.map((row) => (
                    <li key={row.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--t2-divider)', fontFamily: 'var(--t2-font-sans)' }}>
                      <span style={{ display: 'block', fontSize: 14, fontWeight: 500 }}>{formatDepartureDate(row.departs_on)}</span>
                      <span style={{ display: 'block', fontSize: 13, color: 'var(--t2-text-muted)', marginTop: 2 }}>
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
        <Section title="What's included" alt>
          <div className="t2-itin-four" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
            {included.map((group) => (
              <div key={group.title}>
                <h3 style={{ ...titleStyle, fontSize: 20, marginBottom: 12 }}>{group.title}</h3>
                <ul style={{ ...bodyStyle, fontSize: 14, paddingLeft: 18 }}>
                  {group.items.map((item) => <li key={item} style={{ marginBottom: 6 }}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      )}

      {benefits.length > 0 && (
        <Section title="Virtuoso benefits">
          <div className="t2-itin-three" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {benefits.map((benefit) => (
              <div key={benefit.title}>
                <h3 style={{ ...titleStyle, fontSize: 19, marginBottom: 8 }}>{benefit.title}</h3>
                <p style={{ ...bodyStyle, fontSize: 14 }}>{benefit.description}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {ships.length > 0 && (
        <Section title="Ships" alt>
          <div className="t2-itin-three" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
            {ships.map((ship) => (
              <article key={ship.name}>
                {ship.image && (
                  <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden', marginBottom: 16, borderRadius: 'var(--t2-radius-lg)' }}>
                    <Image src={ship.image} alt={ship.name} fill style={{ objectFit: 'cover' }} sizes="(max-width: 640px) 100vw, 33vw" unoptimized />
                  </div>
                )}
                <h3 style={{ ...titleStyle, fontSize: 20 }}>{ship.name}</h3>
                {ship.description && <p style={{ ...bodyStyle, fontSize: 14, marginTop: 8 }}>{ship.description}</p>}
              </article>
            ))}
          </div>
        </Section>
      )}

      <style>{`
        @media (max-width: 900px){
          .t2-itin-intro{ grid-template-columns: 1fr !important; }
          .t2-itin-four, .t2-itin-three{ grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 640px){
          .t2-itin-wrap{ padding: 0 24px !important; }
          .t2-itin-facts, .t2-itin-four, .t2-itin-three, .t2-itin-years{ grid-template-columns: 1fr !important; }
          .t2-itin-day{ grid-template-columns: 1fr !important; gap: 8px !important; }
        }
      `}</style>
    </>
  )
}

/** Section 10: other itineraries on this line, full pages first. */
export function T2MoreItineraries({ agentId, line, currentSlug }: { agentId: string; line: CruiseLine; currentSlug: string }) {
  const others = (line.sample_journeys ?? [])
    .filter((journey) => journey.slug !== currentSlug)
    .sort((a, b) => Number(Boolean(b.has_details)) - Number(Boolean(a.has_details)))
    .slice(0, 3)
  if (others.length === 0) return null

  return (
    <Section title="More itineraries">
      <div className="t2-itin-three" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
        {others.map((journey) => (
          <article key={journey.name}>
            <span style={labelStyle}>{journey.nights}</span>
            <h3 style={{ ...titleStyle, margin: '8px 0' }}>{journey.name}</h3>
            <p style={{ ...bodyStyle, fontSize: 14, marginBottom: 10 }}>{journey.route}</p>
            <Link
              href={journey.has_details && journey.slug
                ? cruiseItineraryPath('t2', agentId, line.slug, journey.slug)
                : `${templatePath('t2', agentId)}/find-cruise/${line.slug}`}
              style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 13, color: 'var(--t2-primary)', textDecoration: 'underline', textUnderlineOffset: 4 }}
            >
              {journey.has_details ? 'View full itinerary' : `View ${line.name}`}
            </Link>
          </article>
        ))}
      </div>
    </Section>
  )
}
