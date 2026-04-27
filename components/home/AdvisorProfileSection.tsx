/**
 * AdvisorProfileSection — Eden / Template 1 advisor bio + specialties block.
 *
 * Renders inside the warm-ivory Eden aesthetic: Playfair serif headlines,
 * antique-gold accent rules, generous line-height, two-column editorial
 * layout. Auto-hides any chip group that the agent didn't fill in.
 */

interface AdvisorProfileSectionProps {
  fullName: string
  agencyName: string
  avatarUrl?: string | null
  bio?: string
  travelSpecialties?: string[]
  destinationSpecialties?: string[]
  preferredSuppliers?: string[]
  travelTypes?: string[]
}

const FALLBACK_AVATAR = '/media/team/agent-sarah-chen.png'

export function AdvisorProfileSection({
  fullName,
  agencyName,
  avatarUrl,
  bio,
  travelSpecialties,
  destinationSpecialties,
  preferredSuppliers,
  travelTypes,
}: AdvisorProfileSectionProps) {
  const hasAnyChips =
    (travelSpecialties?.length ?? 0) +
    (destinationSpecialties?.length ?? 0) +
    (preferredSuppliers?.length ?? 0) +
    (travelTypes?.length ?? 0) > 0

  if (!bio && !hasAnyChips) return null

  const serif = 'var(--font-serif)'
  const sans = 'var(--font-sans)'

  return (
    <section
      style={{
        background: '#FFFFFF',
        padding: '120px 24px',
        borderTop: '1px solid #f0ebe1',
      }}
    >
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        {/* ── Section header ─────────────────────────────────────────── */}
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 20,
              marginBottom: 24,
            }}
          >
            <div style={{ width: 48, height: 1, background: 'rgba(181,148,90,0.4)' }} />
            <p
              style={{
                fontFamily: sans,
                fontSize: 9,
                letterSpacing: '0.38em',
                textTransform: 'uppercase',
                color: '#B5945A',
                margin: 0,
              }}
            >
              Meet Your Advisor
            </p>
            <div style={{ width: 48, height: 1, background: 'rgba(181,148,90,0.4)' }} />
          </div>
          <h2
            style={{
              fontFamily: serif,
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              fontWeight: 300,
              color: 'var(--charcoal, #1a1a1a)',
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            {fullName}
          </h2>
          <p
            style={{
              fontFamily: serif,
              fontStyle: 'italic',
              fontSize: 15,
              color: '#B5945A',
              margin: '14px 0 0',
            }}
          >
            {agencyName}
          </p>
        </div>

        {/* ── Bio + portrait ─────────────────────────────────────────── */}
        {bio && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: 48,
              alignItems: 'center',
              maxWidth: 980,
              margin: '0 auto',
              marginBottom: hasAnyChips ? 80 : 0,
            }}
            className="eden-advisor-bio"
          >
            <div
              style={{
                width: 220,
                height: 220,
                borderRadius: '50%',
                overflow: 'hidden',
                background: '#f4ede0',
                flexShrink: 0,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarUrl || FALLBACK_AVATAR}
                alt={fullName}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                }}
              />
            </div>
            <p
              style={{
                fontFamily: sans,
                fontSize: 16,
                lineHeight: 1.85,
                color: '#4b4540',
                margin: 0,
                maxWidth: 640,
              }}
            >
              {bio}
            </p>
          </div>
        )}

        {/* ── Chip groups ────────────────────────────────────────────── */}
        {hasAnyChips && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 56,
              rowGap: 56,
              maxWidth: 980,
              margin: '0 auto',
              borderTop: '1px solid #f0ebe1',
              paddingTop: 56,
            }}
            className="eden-advisor-chips"
          >
            {travelSpecialties && travelSpecialties.length > 0 && (
              <ChipGroup label="Travel Specialties" items={travelSpecialties} sans={sans} />
            )}
            {destinationSpecialties && destinationSpecialties.length > 0 && (
              <ChipGroup label="Destinations" items={destinationSpecialties} sans={sans} />
            )}
            {preferredSuppliers && preferredSuppliers.length > 0 && (
              <ChipGroup label="Preferred Suppliers" items={preferredSuppliers} sans={sans} />
            )}
            {travelTypes && travelTypes.length > 0 && (
              <ChipGroup label="Types of Travel" items={travelTypes} sans={sans} />
            )}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .eden-advisor-bio {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
            justify-items: center;
            text-align: center;
          }
          .eden-advisor-chips {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  )
}

function ChipGroup({
  label,
  items,
  sans,
}: {
  label: string
  items: string[]
  sans: string
}) {
  return (
    <div>
      <p
        style={{
          fontFamily: sans,
          fontSize: 9,
          letterSpacing: '0.38em',
          textTransform: 'uppercase',
          color: '#B5945A',
          margin: '0 0 18px',
        }}
      >
        {label}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {items.map((item) => (
          <span
            key={item}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '7px 14px',
              fontSize: 12,
              fontFamily: sans,
              color: '#1a1a1a',
              border: '1px solid #e7dfcf',
              background: '#fdfaf3',
              borderRadius: 0,
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
