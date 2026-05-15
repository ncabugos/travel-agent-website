import Link from 'next/link'
import Image from 'next/image'
import { getCruiseLines } from '@/lib/cruise-lines'
import { T4PageHero } from '@/components/t4/T4PageHero'

interface PageProps {
  params: Promise<{ agentId: string }>
}

export const metadata = {
  title: 'Voyages | Casa Solis',
  description:
    "The cruise lines we book — and what we arrange on every sailing.",
}

export default async function T4FindCruiseIndexPage({ params }: PageProps) {
  const { agentId } = await params
  const lines = await getCruiseLines()
  const base = `/t4/${agentId}`

  return (
    <>
      <T4PageHero
        image="/media/cruises/regent-seven-seas/Regent-hero-Tahiti-2500.jpg"
        imageAlt="Voyages"
        eyebrow="Voyages"
        title="Ocean, river, and expedition."
        body="The cruise lines we have sailed personally, and the ones we book for reasons every client will eventually understand."
        imageCaption="Regent Seven Seas · Tahiti"
      />

      <section
        style={{
          padding: 'var(--t4-section-pad) 48px',
          background: 'var(--t4-bg-alt)',
        }}
      >
        <div style={{ maxWidth: 'var(--t4-content-wide)', margin: '0 auto' }}>
          <div style={{ marginBottom: 56 }}>
            <span className="t4-eyebrow">The Lines</span>
            <h2 className="t4-headline-xl" style={{ marginTop: 28 }}>
              All {lines.length} partner lines.
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 24,
              rowGap: 48,
            }}
            className="t4-cruise-index-grid"
          >
            {lines.map((line) => {
              const types = (line.cruise_types || [])[0] || 'Luxury'
              return (
                <Link
                  key={line.slug}
                  href={`${base}/find-cruise/${line.slug}`}
                  className="t4-cruise-card"
                >
                  {line.hero_image_url && (
                    <div className="t4-cruise-card-imgwrap">
                      <Image
                        src={line.hero_image_url}
                        alt={line.name}
                        fill
                        sizes="(max-width: 900px) 100vw, 33vw"
                        className="t4-cruise-card-img"
                        unoptimized
                      />
                      <span className="t4-cruise-vibe">{types}</span>
                    </div>
                  )}
                  <h3 className="t4-headline-md t4-cruise-card-name">{line.name}</h3>
                  {line.tagline && (
                    <p className="t4-cruise-card-tagline">{line.tagline}</p>
                  )}
                  <span className="t4-cruise-card-cta">
                    View line <span aria-hidden>→</span>
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <style>{`
        .t4-cruise-card {
          display: flex; flex-direction: column;
          text-decoration: none; color: inherit;
          transition: transform 0.4s var(--t4-ease, cubic-bezier(0.25, 0.1, 0.25, 1));
        }
        .t4-cruise-card:hover { transform: translateY(-4px); }
        .t4-cruise-card-imgwrap {
          position: relative;
          aspect-ratio: 4 / 5;
          overflow: hidden;
          background: var(--t4-bg);
          margin-bottom: 22px;
        }
        .t4-cruise-card-img {
          object-fit: cover;
          transition: transform 1.1s var(--t4-ease-out, cubic-bezier(0.16, 1, 0.3, 1));
        }
        .t4-cruise-card:hover .t4-cruise-card-img { transform: scale(1.05); }
        .t4-cruise-vibe {
          position: absolute; top: 14px; left: 14px;
          font-family: var(--t4-font-body);
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.2em; text-transform: uppercase;
          background: #fff;
          color: var(--t4-text);
          padding: 7px 14px;
          box-shadow: 0 2px 12px rgba(20,17,15,0.18);
          transition: transform 0.3s ease;
        }
        .t4-cruise-card:hover .t4-cruise-vibe { transform: translateY(-2px); }
        .t4-cruise-card-name {
          margin: 0 0 10px;
          font-size: clamp(17px, 1.5vw, 20px);
        }
        .t4-cruise-card-tagline {
          font-family: var(--t4-font-display);
          font-style: italic;
          font-size: 14px;
          color: var(--t4-text-muted);
          line-height: 1.5;
          margin: 0 0 18px;
        }
        .t4-cruise-card-cta {
          font-family: var(--t4-font-body);
          font-size: 10.5px; font-weight: 500;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--t4-text);
          padding-top: 14px;
          border-top: 1px solid var(--t4-divider);
          margin-top: auto;
          transition: color 0.25s ease;
        }
        .t4-cruise-card-cta span {
          margin-left: 6px;
          display: inline-block;
          transition: transform 0.3s ease;
        }
        .t4-cruise-card:hover .t4-cruise-card-cta { color: var(--t4-accent); }
        .t4-cruise-card:hover .t4-cruise-card-cta span { transform: translateX(5px); }

        @media (max-width: 900px) {
          .t4-cruise-index-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .t4-cruise-index-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
