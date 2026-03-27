import Image from 'next/image'
import Link from 'next/link'
import type { ExclusiveExperience } from '@/lib/collections'

interface T2ExperienceGridProps {
  experiences: ExclusiveExperience[]
  agentId?: string
}

export function T2ExperienceGrid({ experiences, agentId }: T2ExperienceGridProps) {
  const experiencesHref = agentId ? `/t2/${agentId}/experiences` : '/experiences'
  return (
    <section style={{ padding: 'var(--t2-section-pad) 0', background: 'var(--t2-bg-alt)' }}>
      <div style={{ maxWidth: 'var(--t2-content-max, 1280px)', margin: '0 auto', padding: '0 48px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 56, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p className="t2-label" style={{ marginBottom: 14 }}>Curated Journeys</p>
            <h2 className="t2-heading t2-heading-lg">Exclusive Experiences</h2>
          </div>
          <Link
            href={experiencesHref}
            style={{
              fontFamily: 'var(--t2-font-sans)', fontSize: 10, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: 'var(--t2-text)', textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 4,
              borderBottom: '1px solid var(--t2-text)',
            }}
          >
            View All
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M5 12h14M15 6l6 6-6 6" />
            </svg>
          </Link>
        </div>

        {/* Grid — editorial asymmetric */}
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0 32px' }}
          className="t2-exp-grid"
        >
          {experiences.map((exp, i) => (
            <Link
              key={exp.id}
              href={experiencesHref}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
            <div key={exp.id} style={{ paddingBottom: 48 }}>
              {/* Image */}
              <div
                style={{
                  position: 'relative',
                  aspectRatio: i % 3 === 1 ? '3/4' : '4/3',
                  overflow: 'hidden',
                  marginBottom: 24,
                }}
                className="t2-exp-img-wrap"
              >
                {exp.image_url && (
                  <Image
                    src={exp.image_url}
                    alt={exp.title}
                    fill
                    style={{ objectFit: 'cover', transition: 'transform 0.8s ease' }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="t2-exp-img"
                  />
                )}
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
                {exp.supplier_tag && (
                  <span
                    style={{
                      fontFamily: 'var(--t2-font-sans)',
                      fontSize: 9,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: 'var(--t2-accent)',
                    }}
                  >
                    {exp.supplier_tag}
                  </span>
                )}
                {exp.location_tag && (
                  <>
                    <span style={{ width: 1, height: 10, background: 'var(--t2-divider)', display: 'inline-block' }} />
                    <span
                      style={{
                        fontFamily: 'var(--t2-font-sans)',
                        fontSize: 9,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color: 'var(--t2-text-muted)',
                      }}
                    >
                      {exp.location_tag}
                    </span>
                  </>
                )}
              </div>

              <h3
                style={{
                  fontFamily: 'var(--t2-font-serif)',
                  fontSize: 22,
                  fontWeight: 300,
                  lineHeight: 1.25,
                  color: 'var(--t2-text)',
                  marginBottom: 12,
                }}
              >
                {exp.title}
              </h3>

              {exp.description && (
                <p
                  style={{
                    fontFamily: 'var(--t2-font-sans)',
                    fontSize: 13,
                    fontWeight: 300,
                    lineHeight: 1.8,
                    color: 'var(--t2-text-muted)',
                  }}
                >
                  {exp.description}
                </p>
              )}
            </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .t2-exp-img-wrap:hover .t2-exp-img { transform: scale(1.04); }
        @media (max-width: 768px) {
          .t2-exp-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
