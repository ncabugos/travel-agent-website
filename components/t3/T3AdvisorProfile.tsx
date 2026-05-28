interface AdvisorStat {
  value: string
  label: string
}

interface T3AdvisorProfileProps {
  agentId: string
  fullName: string
  agencyName: string
  bio?: string
  /** Headline numbers — e.g. years of experience, countries visited. */
  stats?: AdvisorStat[]
  travelSpecialties?: string[]
  destinationSpecialties?: string[]
  preferredSuppliers?: string[]
  travelTypes?: string[]
  eyebrow?: string
  photo?: string
  photoAlt?: string
}

/**
 * Renders the advisor's bio + four chip groups (specialties, destinations,
 * suppliers, travel types). Auto-hides any group that the agent didn't fill
 * out during onboarding so a sparse profile still looks intentional.
 *
 * Designed for Meridian / Template 3 — sans-serif editorial layout with
 * bronze accents, generous spacing, and a thin divider rule.
 */
export function T3AdvisorProfile({
  fullName,
  agencyName,
  bio,
  stats,
  travelSpecialties,
  destinationSpecialties,
  preferredSuppliers,
  travelTypes,
  eyebrow = '03 — Your Advisor',
  photo,
  photoAlt,
}: T3AdvisorProfileProps) {
  const hasAnyChips =
    (travelSpecialties?.length ?? 0) +
    (destinationSpecialties?.length ?? 0) +
    (preferredSuppliers?.length ?? 0) +
    (travelTypes?.length ?? 0) > 0
  const hasStats = (stats?.length ?? 0) > 0

  // If the agent has nothing useful to display, render nothing rather
  // than a hollow section.
  if (!bio && !hasAnyChips && !hasStats) return null

  return (
    <section className="t3-section t3-divider-top">
      <span className="t3-eyebrow">{eyebrow}</span>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '5fr 7fr',
          gap: 80,
          alignItems: 'stretch',
          marginTop: 40,
        }}
        className="t3-advisor-grid"
      >
        {/* Left — portrait */}
        {photo && (
          <div
            className="t3-advisor-portrait"
            style={{
              position: 'relative',
              minHeight: 420,
              overflow: 'hidden',
              background: 'var(--t3-bg-alt)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: 'var(--t3-accent, #8B6F47)',
                zIndex: 1,
              }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo}
              alt={photoAlt ?? fullName}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center top',
              }}
            />
          </div>
        )}

        {/* Right — name, role, bio, stats, chips */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 className="t3-headline-xl" style={{ marginBottom: 10 }}>
            {fullName}
          </h2>
          <p
            style={{
              fontFamily: 'var(--t3-font-display)',
              fontStyle: 'italic',
              fontSize: 18,
              color: 'var(--t3-accent)',
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            {agencyName}
          </p>

          {bio && (
            <p className="t3-body t3-body-lg" style={{ marginTop: 28, marginBottom: 0 }}>
              {bio}
            </p>
          )}

          {hasStats && (
            <div
              className="t3-advisor-stats"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${Math.min(stats!.length, 3)}, 1fr)`,
                gap: 32,
                borderTop: '1px solid var(--t3-divider)',
                paddingTop: 36,
                marginTop: 44,
              }}
            >
              {stats!.map((stat) => (
                <div key={stat.label}>
                  <div
                    style={{
                      fontFamily: 'var(--t3-font-display)',
                      fontSize: 'clamp(34px, 3.4vw, 46px)',
                      fontWeight: 500,
                      lineHeight: 1,
                      letterSpacing: '-0.02em',
                      color: 'var(--t3-text)',
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: 'var(--t3-accent)',
                      marginTop: 14,
                      lineHeight: 1.45,
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {hasAnyChips && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 56,
                rowGap: 48,
                borderTop: '1px solid var(--t3-divider)',
                paddingTop: 48,
                marginTop: 48,
              }}
              className="t3-advisor-chip-grid"
            >
              {travelSpecialties && travelSpecialties.length > 0 && (
                <ChipGroup label="Travel Specialties" items={travelSpecialties} />
              )}
              {destinationSpecialties && destinationSpecialties.length > 0 && (
                <ChipGroup label="Destination Specialties" items={destinationSpecialties} />
              )}
              {preferredSuppliers && preferredSuppliers.length > 0 && (
                <ChipGroup label="Preferred Suppliers" items={preferredSuppliers} />
              )}
              {travelTypes && travelTypes.length > 0 && (
                <ChipGroup label="Types of Travel" items={travelTypes} />
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .t3-advisor-grid {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
          .t3-advisor-portrait {
            aspect-ratio: 4 / 5;
            min-height: 0 !important;
          }
          .t3-advisor-chip-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
        @media (max-width: 480px) {
          .t3-advisor-stats {
            gap: 24px !important;
          }
        }
      `}</style>
    </section>
  )
}

function ChipGroup({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--t3-accent)',
          marginBottom: 16,
        }}
      >
        {label}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {items.map((item) => (
          <span
            key={item}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '7px 14px',
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--t3-text)',
              border: '1px solid var(--t3-divider)',
              background: 'var(--t3-bg)',
              letterSpacing: '0.02em',
              transition: 'border-color 0.2s ease, color 0.2s ease',
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
