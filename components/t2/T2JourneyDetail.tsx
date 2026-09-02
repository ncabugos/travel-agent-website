import Image from 'next/image'
import Link from 'next/link'
import { T2BenefitsGrid } from '@/components/t2/T2BenefitsGrid'
import { T2HotelGallery } from '@/components/t2/T2HotelGallery'
import { T2LeadForm } from '@/components/t2/T2LeadForm'
import { formatFromPrice, type PrivateJourney } from '@/lib/private-journeys'

interface Props {
  journey: PrivateJourney
  agentId: string
  /** Where the "all operators" link goes — /private-jets or /safaris. */
  indexHref: string
  indexLabel: string
}

/**
 * Full detail body for a private-journey operator, shared by /private-jets and
 * /safaris — the two surfaces differ in what they list, not in how an operator
 * reads once opened.
 *
 * The page follows the operator's own brochure order: hero, the aircraft and
 * team, where the routings go, the published itineraries as image cards with
 * dates, stops and price, what is on board, a cabin gallery, then what booking
 * through the advisor adds.
 *
 * Every section is conditional on its data, so an operator seeded with only
 * copy renders a shorter but complete page rather than a run of empty bands.
 * The hero falls back to a typographic treatment when `hero_image_url` is null,
 * and itinerary and region cards render text-only when no image is on file.
 */
export function T2JourneyDetail({ journey: j, agentId, indexHref, indexLabel }: Props) {
  const base = `/t2/${agentId}`
  const fromPrice = formatFromPrice(j.price_from_usd)

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="t2-journey-hero" data-photo={j.hero_image_url ? 'true' : 'false'}>
        {j.hero_image_url && (
          <>
            <Image
              src={j.hero_image_url}
              alt={j.name}
              fill
              priority
              style={{ objectFit: 'cover' }}
              sizes="100vw"
              unoptimized
            />
            <div className="t2-journey-hero-scrim" />
          </>
        )}

        <div className="t2-journey-hero-inner">
          {j.tagline && (
            <p className="t2-label" style={{ marginBottom: 18, color: 'rgba(255,255,255,0.78)' }}>
              {j.tagline}
            </p>
          )}
          {j.logo_url_white ? (
            <Image
              src={j.logo_url_white}
              alt={j.name}
              width={280}
              height={92}
              style={{ objectFit: 'contain', maxHeight: 84, width: 'auto', margin: '0 auto' }}
              unoptimized
            />
          ) : (
            <h1 className="t2-heading t2-heading-xl" style={{ color: '#FFFFFF', margin: 0 }}>
              {j.name}
            </h1>
          )}
          {/* Figure only — the qualifier and verification note live under the
              itinerary list, where there is room to read them. */}
          {fromPrice && <p className="t2-journey-hero-price">{fromPrice}</p>}
        </div>
      </section>

      {/* ── Intro ──────────────────────────────────────────────────────── */}
      {(j.intro?.heading || j.description) && (
        <section className="t2-section" style={{ maxWidth: 900 }}>
          <div style={{ textAlign: 'center' }}>
            {j.intro?.eyebrow && (
              <p className="t2-label" style={{ marginBottom: 16 }}>{j.intro.eyebrow}</p>
            )}
            <h2 className="t2-heading t2-heading-lg" style={{ marginBottom: 24 }}>
              {j.intro?.heading ?? j.name}
            </h2>
            <p className="t2-body t2-body-center">{j.intro?.body ?? j.description}</p>
            {j.intro?.body && j.description && (
              <p className="t2-body t2-body-center" style={{ marginTop: 20 }}>{j.description}</p>
            )}
          </div>
        </section>
      )}

      {/* ── Where it goes ──────────────────────────────────────────────── */}
      {j.destinations.length > 0 && (
        <section className="t2-section" style={{ background: 'var(--t2-bg-alt)', maxWidth: 'none' }}>
          <div style={{ maxWidth: 'var(--t2-content-max, 1280px)', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: 620, margin: '0 auto clamp(40px, 5vw, 64px)' }}>
              <p className="t2-label" style={{ marginBottom: 14 }}>Where It Goes</p>
              <h2 className="t2-heading t2-heading-lg" style={{ margin: 0 }}>Where the journeys go.</h2>
            </div>
            <div className="t2-journey-dests">
              {j.destinations.map((d) => (
                <div key={d.name} className="t2-journey-dest">
                  {d.image_url && (
                    <div className="t2-journey-dest-media">
                      <Image
                        src={d.image_url}
                        alt={d.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 720px) 100vw, 520px"
                        unoptimized
                      />
                    </div>
                  )}
                  <h3 className="t2-journey-dest-name">{d.name}</h3>
                  {d.blurb && <p className="t2-journey-dest-blurb">{d.blurb}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Itineraries ────────────────────────────────────────────────── */}
      {j.sample_journeys.length > 0 && (
        <section className="t2-section">
          <div style={{ textAlign: 'center', maxWidth: 660, margin: '0 auto clamp(44px, 5vw, 68px)' }}>
            <p className="t2-label" style={{ marginBottom: 14 }}>The Journeys</p>
            <h2 className="t2-heading t2-heading-lg" style={{ margin: 0 }}>
              {j.sample_journeys.length === 1 ? 'The itinerary.' : 'Published itineraries.'}
            </h2>
          </div>

          <div className="t2-journey-grid">
            {j.sample_journeys.map((it) => {
              // The <dt> supplies the word "From", so the value is the bare figure.
              const price = it.price_from_usd
                ? `$${it.price_from_usd.toLocaleString('en-US')}`
                : null
              const stops = it.stops ?? []
              return (
                <article key={it.name} className="t2-journey-card">
                  {it.image_url && (
                    <div className="t2-journey-card-media">
                      <Image
                        src={it.image_url}
                        alt={it.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 860px) 100vw, 540px"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="t2-journey-card-body">
                    {it.dates && <p className="t2-journey-card-dates">{it.dates}</p>}
                    <h3 className="t2-journey-item-name">{it.name}</h3>
                    {stops.length > 0 && (
                      <p className="t2-journey-card-stops">{stops.join(' · ')}</p>
                    )}
                    {it.blurb && <p className="t2-journey-item-blurb">{it.blurb}</p>}
                    <dl className="t2-journey-item-meta">
                      {it.days ? (
                        <div><dt>Length</dt><dd>{it.days} days</dd></div>
                      ) : null}
                      {stops.length > 0 ? (
                        <div><dt>Destinations</dt><dd>{stops.length}</dd></div>
                      ) : it.regions ? (
                        <div><dt>Region</dt><dd>{it.regions}</dd></div>
                      ) : null}
                      <div>
                        <dt>From</dt>
                        <dd className="t2-journey-item-price">{price ?? 'On request'}</dd>
                      </div>
                    </dl>
                    {it.brochure_url && (
                      <a
                        href={it.brochure_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="t2-journey-card-link"
                      >
                        Brochure (PDF)
                      </a>
                    )}
                  </div>
                </article>
              )
            })}
          </div>

          {j.price_note && (
            <p className="t2-journey-pricenote">{j.price_note}</p>
          )}
        </section>
      )}

      {/* ── Onboard / on-the-ground ────────────────────────────────────── */}
      {j.experiences.length > 0 && (
        <T2BenefitsGrid
          benefits={j.experiences}
          heading={j.journey_type === 'jet' ? 'On board the aircraft.' : 'What the operator brings.'}
          label="The Experience"
        />
      )}

      {/* ── Gallery ────────────────────────────────────────────────────── */}
      {j.slider_images.length > 0 && (
        <T2HotelGallery
          images={j.slider_images}
          title={j.journey_type === 'jet' ? 'The cabin.' : undefined}
        />
      )}

      {/* ── What we add ────────────────────────────────────────────────── */}
      {j.benefits.length > 0 && (
        <T2BenefitsGrid
          benefits={j.benefits}
          heading="What booking through us adds."
          label="The Difference"
        />
      )}

      {/* ── Enquiry ────────────────────────────────────────────────────── */}
      <T2LeadForm
        agentId={agentId}
        heading={`Plan a ${j.name} journey`}
        subheading={`Tell us roughly when and how long. We'll come back with the departures still open, what they include, and what they actually cost.`}
      />

      <section style={{ textAlign: 'center', padding: '0 24px clamp(64px, 8vw, 96px)' }}>
        <Link href={`${base}${indexHref}`} className="t2-journey-back">
          {indexLabel}
        </Link>
      </section>

      <style>{`
        .t2-journey-hero {
          position: relative; overflow: hidden;
          min-height: clamp(460px, 66vh, 720px);
          display: flex; align-items: center; justify-content: center;
          text-align: center; padding: clamp(80px, 12vw, 140px) 24px;
          background: var(--t2-dark-bg, #0E0E0E);
        }
        /* No licensed photography yet — carry the hero on type and a rule
           rather than shipping an empty black band. */
        .t2-journey-hero[data-photo='false'] {
          background:
            radial-gradient(ellipse at 50% 0%, rgba(154,133,96,0.20) 0%, rgba(154,133,96,0) 62%),
            var(--t2-dark-bg, #0E0E0E);
          border-bottom: 1px solid rgba(255,255,255,0.10);
        }
        .t2-journey-hero-scrim {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.30), rgba(0,0,0,0.66));
        }
        .t2-journey-hero-inner { position: relative; z-index: 2; max-width: 880px; }
        .t2-journey-hero-price {
          font-family: var(--t2-font-sans); font-size: 12px; font-weight: 400;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: rgba(255,255,255,0.72); margin: 28px 0 0;
        }

        .t2-journey-dests {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: clamp(28px, 3.5vw, 48px);
          max-width: 1100px; margin: 0 auto;
        }
        @media (max-width: 720px) { .t2-journey-dests { grid-template-columns: 1fr; } }
        .t2-journey-dest { border-top: 1px solid var(--t2-divider); padding-top: 22px; }
        .t2-journey-dest-media {
          position: relative; aspect-ratio: 16 / 10; overflow: hidden;
          margin-bottom: 20px; background: var(--t2-divider);
        }
        .t2-journey-dest-name {
          font-family: var(--t2-font-serif); font-weight: 400; font-size: 22px;
          color: var(--t2-text); margin: 0 0 10px;
        }
        .t2-journey-dest-blurb {
          font-family: var(--t2-font-sans); font-size: 14px; font-weight: 300;
          line-height: 1.8; color: var(--t2-text-muted); margin: 0; max-width: 52ch;
        }

        .t2-journey-grid {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: clamp(40px, 4.5vw, 64px) clamp(28px, 3vw, 44px);
          max-width: 1100px; margin: 0 auto;
        }
        @media (max-width: 860px) { .t2-journey-grid { grid-template-columns: 1fr; } }
        .t2-journey-card {
          display: flex; flex-direction: column;
          border-top: 1px solid var(--t2-divider); padding-top: 22px;
        }
        .t2-journey-card-media {
          position: relative; aspect-ratio: 3 / 2; overflow: hidden;
          margin-bottom: 22px; background: var(--t2-divider);
        }
        .t2-journey-card-media img { transition: transform 1000ms var(--t2-ease, ease); }
        .t2-journey-card:hover .t2-journey-card-media img { transform: scale(1.035); }
        .t2-journey-card-body { display: flex; flex-direction: column; flex: 1; }
        .t2-journey-card-dates {
          font-family: var(--t2-font-sans); font-size: 10.5px; font-weight: 500;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--t2-accent); margin: 0 0 10px;
        }
        .t2-journey-item-name {
          font-family: var(--t2-font-serif); font-weight: 400; font-size: 24px;
          color: var(--t2-text); margin: 0 0 10px; line-height: 1.25;
        }
        .t2-journey-card-stops {
          font-family: var(--t2-font-sans); font-size: 12.5px; font-weight: 400;
          letter-spacing: 0.02em; line-height: 1.7;
          color: var(--t2-text); margin: 0 0 12px;
        }
        .t2-journey-item-blurb {
          font-family: var(--t2-font-sans); font-size: 13.5px; font-weight: 300;
          line-height: 1.75; color: var(--t2-text-muted); margin: 0; max-width: 58ch;
        }
        .t2-journey-item-meta {
          margin: 20px 0 0; display: flex; flex-wrap: wrap; gap: 14px 30px;
        }
        .t2-journey-item-meta dt {
          font-family: var(--t2-font-sans); font-size: 9.5px; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--t2-accent); margin-bottom: 5px;
        }
        .t2-journey-item-meta dd {
          font-family: var(--t2-font-serif); font-size: 15px;
          color: var(--t2-text); margin: 0; line-height: 1.4;
        }
        .t2-journey-item-price { white-space: nowrap; }
        .t2-journey-card-link {
          align-self: flex-start; margin-top: 20px;
          font-family: var(--t2-font-sans); font-size: 10.5px; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--t2-accent); text-decoration: none;
          border-bottom: 1px solid currentColor; padding-bottom: 3px;
        }
        .t2-journey-pricenote {
          max-width: 1100px; margin: 30px auto 0;
          font-family: var(--t2-font-sans); font-size: 12px; font-weight: 300;
          line-height: 1.7; color: var(--t2-text-muted); font-style: italic;
        }

        .t2-journey-back {
          font-family: var(--t2-font-sans); font-size: 10.5px; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--t2-accent); text-decoration: none;
          border-bottom: 1px solid currentColor; padding-bottom: 3px;
        }
        @media (prefers-reduced-motion: reduce) {
          .t2-journey-card-media img { transition: none; }
          .t2-journey-card:hover .t2-journey-card-media img { transform: none; }
        }
      `}</style>
    </>
  )
}
