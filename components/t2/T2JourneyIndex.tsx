import Image from 'next/image'
import Link from 'next/link'
import { formatFromPrice, type PrivateJourney } from '@/lib/private-journeys'

interface Props {
  journeys: PrivateJourney[]
  agentId: string
  /** Route segment these cards link into — 'private-jets' or 'safaris'. */
  segment: string
  eyebrow: string
  heading: string
  intro: string
}

/**
 * Landing index for a private-journey type. Deliberately type-led rather than
 * image-led: the launch operators have no licensed photography in the repo yet,
 * so a card renders its image only when one exists and otherwise stands on the
 * name, the territory, and the price. When assets arrive the same markup picks
 * them up with no further change.
 */
export function T2JourneyIndex({ journeys, agentId, segment, eyebrow, heading, intro }: Props) {
  const base = `/t2/${agentId}`

  return (
    <>
      <section className="t2-jindex-hero">
        <div className="t2-jindex-hero-inner">
          <p className="t2-label" style={{ marginBottom: 18, color: 'rgba(255,255,255,0.78)' }}>
            {eyebrow}
          </p>
          <h1 className="t2-heading t2-heading-xl" style={{ color: '#FFFFFF', margin: 0 }}>
            {heading}
          </h1>
          <p className="t2-jindex-hero-body">{intro}</p>
        </div>
      </section>

      <section className="t2-section">
        {journeys.length === 0 ? (
          <p className="t2-body t2-body-center" style={{ textAlign: 'center' }}>
            Nothing published here yet. Get in touch and we&rsquo;ll plan one directly.
          </p>
        ) : (
          <div className="t2-jindex-list">
            {journeys.map((j) => {
              const price = formatFromPrice(j.price_from_usd)
              const count = j.sample_journeys.length
              return (
                <Link key={j.slug} href={`${base}/${segment}/${j.slug}`} className="t2-jindex-card">
                  {j.hero_image_url && (
                    <div className="t2-jindex-media">
                      <Image
                        src={j.hero_image_url}
                        alt={j.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 860px) 100vw, 50vw"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="t2-jindex-body">
                    {j.tagline && <p className="t2-label" style={{ marginBottom: 14 }}>{j.tagline}</p>}
                    <h2 className="t2-jindex-name">{j.name}</h2>
                    {j.description && <p className="t2-jindex-copy">{j.description}</p>}
                    <dl className="t2-jindex-meta">
                      {count > 0 && (
                        <div>
                          <dt>Itineraries</dt>
                          <dd>{count} published</dd>
                        </div>
                      )}
                      <div>
                        <dt>From</dt>
                        <dd>{price ?? 'On request'}</dd>
                      </div>
                    </dl>
                    <span className="t2-jindex-cue">Explore {j.name}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      <style>{`
        .t2-jindex-hero {
          position: relative;
          min-height: clamp(380px, 52vh, 560px);
          display: flex; align-items: center; justify-content: center;
          text-align: center; padding: clamp(80px, 12vw, 132px) 24px;
          background:
            radial-gradient(ellipse at 50% 0%, rgba(154,133,96,0.20) 0%, rgba(154,133,96,0) 62%),
            var(--t2-dark-bg, #0E0E0E);
          border-bottom: 1px solid rgba(255,255,255,0.10);
        }
        .t2-jindex-hero-inner { max-width: 860px; }
        .t2-jindex-hero-body {
          font-family: var(--t2-font-sans); font-size: 16px; font-weight: 300;
          line-height: 1.85; color: rgba(255,255,255,0.80);
          max-width: 640px; margin: 24px auto 0;
        }

        .t2-jindex-list {
          display: flex; flex-direction: column;
          gap: clamp(48px, 6vw, 80px);
          max-width: 1000px; margin: 0 auto;
        }
        .t2-jindex-card {
          display: block; text-decoration: none; color: inherit;
          border-top: 1px solid var(--t2-divider); padding-top: clamp(28px, 3.5vw, 44px);
        }
        .t2-jindex-media {
          position: relative; aspect-ratio: 16 / 9; overflow: hidden;
          margin-bottom: 28px; background: var(--t2-divider);
        }
        .t2-jindex-media img { transition: transform 1000ms var(--t2-ease, ease); }
        .t2-jindex-card:hover .t2-jindex-media img { transform: scale(1.035); }
        .t2-jindex-name {
          font-family: var(--t2-font-serif); font-weight: 400;
          font-size: clamp(28px, 3.4vw, 42px); line-height: 1.15;
          color: var(--t2-text); margin: 0 0 18px;
        }
        .t2-jindex-copy {
          font-family: var(--t2-font-sans); font-size: 14.5px; font-weight: 300;
          line-height: 1.85; color: var(--t2-text-muted); margin: 0 0 26px; max-width: 62ch;
        }
        .t2-jindex-meta {
          margin: 0 0 24px; display: flex; flex-wrap: wrap; gap: 16px 40px;
        }
        .t2-jindex-meta dt {
          font-family: var(--t2-font-sans); font-size: 9.5px; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--t2-accent); margin-bottom: 5px;
        }
        .t2-jindex-meta dd {
          font-family: var(--t2-font-serif); font-size: 16px;
          color: var(--t2-text); margin: 0;
        }
        .t2-jindex-cue {
          font-family: var(--t2-font-sans); font-size: 10.5px; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase; color: var(--t2-accent);
          border-bottom: 1px solid currentColor; padding-bottom: 3px;
        }
        @media (prefers-reduced-motion: reduce) {
          .t2-jindex-media img { transition: none; }
          .t2-jindex-card:hover .t2-jindex-media img { transform: none; }
        }
      `}</style>
    </>
  )
}
