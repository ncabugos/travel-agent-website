import Link from 'next/link'
import type { ExclusiveExperience } from '@/lib/collections'

interface T3ExperienceEditorialProps {
  agentId: string
  eyebrow?: string
  headline: string
  subheading?: string
  experiences: ExclusiveExperience[]
}

const FALLBACK_IMAGE = '/media/hero images/four-seasons-taormina-pool-hero.jpg'

export function T3ExperienceEditorial({
  agentId,
  eyebrow = '03 — Curated Experiences',
  headline,
  subheading,
  experiences,
}: T3ExperienceEditorialProps) {
  const base = `/t3/${agentId}`

  // Take up to 3 — one hero, two support
  const [hero, ...rest] = experiences.slice(0, 3)
  const supporting = rest.slice(0, 2)

  if (!hero) return null

  return (
    <section className="t3-section t3-section-alt" style={{ maxWidth: '100%' }}>
      <div
        style={{
          maxWidth: 'var(--t3-content-max)',
          margin: '0 auto',
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: 72,
            gap: 48,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ maxWidth: 680 }}>
            <span className="t3-eyebrow">{eyebrow}</span>
            <h2 className="t3-headline-xl" style={{ marginTop: 28 }}>
              {headline}
            </h2>
            {subheading && (
              <p className="t3-body t3-body-lg" style={{ marginTop: 24 }}>
                {subheading}
              </p>
            )}
          </div>
          <Link href={`${base}/experiences`} className="t3-link-arrow">
            View All Experiences
            <span className="arrow">→</span>
          </Link>
        </div>

        {/* Asymmetric grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: 32,
          }}
          className="t3-exp-grid"
        >
          {/* Hero card (tall) */}
          <ExperienceCard
            experience={hero}
            tall
            href={`${base}/experiences`}
          />

          {/* Stacked supporting cards */}
          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 32 }}>
            {supporting.map((exp) => (
              <ExperienceCard
                key={exp.id}
                experience={exp}
                href={`${base}/experiences`}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .t3-exp-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}

function ExperienceCard({
  experience,
  href,
  tall,
}: {
  experience: ExclusiveExperience
  href: string
  tall?: boolean
}) {
  const image = experience.image_url || FALLBACK_IMAGE

  return (
    <Link
      href={href}
      style={{
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        color: 'inherit',
        position: 'relative',
      }}
      className="t3-exp-card"
    >
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          aspectRatio: tall ? '4 / 5' : '16 / 10',
          background: 'var(--t3-bg)',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={experience.title}
          className="t3-exp-img"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.8s var(--t3-ease-out)',
          }}
        />
        {experience.supplier_tag && (
          <div
            style={{
              position: 'absolute',
              top: 24,
              left: 24,
              padding: '8px 14px',
              background: 'rgba(247, 245, 240, 0.92)',
              color: 'var(--t3-text)',
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              backdropFilter: 'blur(6px)',
            }}
          >
            {experience.supplier_tag}
          </div>
        )}
      </div>

      <div
        style={{
          paddingTop: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {experience.location_tag && (
          <div
            style={{
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--t3-text-muted)',
            }}
          >
            {experience.location_tag}
          </div>
        )}
        <h3
          className="t3-headline-md"
          style={{
            margin: 0,
            fontSize: tall ? 'clamp(1.6rem, 2.6vw, 2.2rem)' : 'clamp(1.3rem, 2vw, 1.65rem)',
          }}
        >
          {experience.title}
        </h3>
        {experience.itinerary_length && (
          <div
            style={{
              fontSize: 12,
              color: 'var(--t3-text-soft)',
              marginTop: 4,
            }}
          >
            {experience.itinerary_length}
          </div>
        )}
      </div>

      <style>{`
        .t3-exp-card:hover .t3-exp-img {
          transform: scale(1.05);
        }
      `}</style>
    </Link>
  )
}
