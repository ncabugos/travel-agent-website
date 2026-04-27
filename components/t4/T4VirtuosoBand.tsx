import Image from 'next/image'

interface T4VirtuosoBandProps {
  agencyName: string
  hostAgency?: string
}

const PERKS = [
  {
    title: 'Hotel Perks',
    perks: [
      'Complimentary breakfast daily',
      'Spa, dining, or resort credit',
      'Room upgrades on arrival',
    ],
  },
  {
    title: 'Cruise Perks',
    perks: [
      'Dedicated onboard Virtuoso hosts',
      'Private welcome receptions',
      'Exclusive shore excursions',
    ],
  },
  {
    title: 'VIP Access',
    perks: [
      'Preferred rates & priority access',
      '200+ elite vetted providers',
      '2,500+ global destinations',
    ],
  },
]

/**
 * T4 Virtuoso band — warm dark espresso background, centered editorial
 * header, Condé Nast badges, three perk columns separated by thin
 * divider rules. Quieter and more editorial than the T2/T3 versions.
 */
export function T4VirtuosoBand({ agencyName, hostAgency }: T4VirtuosoBandProps) {
  const intro = hostAgency
    ? `${agencyName} is an affiliate of ${hostAgency}, and a member of Virtuoso — the world's leading network of luxury travel advisors. Our standing unlocks privileges that never appear on public rates.`
    : `${agencyName} is a member of Virtuoso — the world's leading network of luxury travel advisors. Our standing unlocks privileges that never appear on public rates.`

  return (
    <section
      className="t4-section-dark"
      style={{
        padding: 'var(--t4-section-pad) 48px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Radial accent */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(155, 118, 65, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: 'var(--t4-content-max)',
          margin: '0 auto',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <span
            className="t4-eyebrow t4-eyebrow-center"
            style={{ color: 'var(--t4-accent-soft)', marginBottom: 32, justifyContent: 'center' }}
          >
            Network Affiliation
          </span>
          <h2
            className="t4-headline-xl"
            style={{
              color: 'var(--t4-dark-text)',
              marginTop: 24,
              marginBottom: 40,
            }}
          >
            A Member of Virtuoso
          </h2>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
            <Image
              src="/assets/virtuoso-footer.png"
              alt="Virtuoso"
              width={180}
              height={48}
              style={{ objectFit: 'contain', opacity: 0.82 }}
              unoptimized
            />
          </div>

          <p
            style={{
              fontFamily: 'var(--t4-font-body)',
              fontSize: 16,
              lineHeight: 1.9,
              color: 'rgba(251, 248, 241, 0.68)',
              maxWidth: 620,
              margin: '0 auto 40px',
              fontWeight: 300,
            }}
          >
            {intro}
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 28,
              flexWrap: 'wrap',
            }}
          >
            <Image
              src="/assets/eden/2026_CONDE-NAST_CONDE-NAST-TRAVELER_TOP-TRAVEL-SPECIALISTS_LOGO_RGB.png"
              alt="Condé Nast Traveler Top Travel Specialist 2026"
              width={112}
              height={112}
              style={{ objectFit: 'contain', opacity: 0.78 }}
              unoptimized
            />
            <Image
              src="/assets/eden/2025-2026_CONDE-NAST_CONDE-NAST-TRAVELER_TOP-TRAVEL-SPECIALISTS_LOGO_RGB.png"
              alt="Condé Nast Traveler Top Travel Specialist 2025–2026"
              width={112}
              height={112}
              style={{ objectFit: 'contain', opacity: 0.78 }}
              unoptimized
            />
          </div>
        </div>

        {/* Ornament */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 72 }}>
          <span className="t4-ornament" style={{ background: 'var(--t4-accent-soft)', opacity: 0.6 }} />
        </div>

        {/* Perks — 3 columns separated by hairlines */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
          }}
          className="t4-virtuoso-perks"
        >
          {PERKS.map((col, i) => (
            <div
              key={col.title}
              style={{
                padding: '32px 40px',
                borderLeft: i > 0 ? '1px solid rgba(155, 118, 65, 0.22)' : undefined,
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--t4-font-body)',
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: 'var(--t4-accent-soft)',
                  marginBottom: 28,
                }}
              >
                {col.title}
              </h3>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                {col.perks.map((p) => (
                  <li
                    key={p}
                    style={{
                      fontFamily: 'var(--t4-font-display)',
                      fontSize: 18,
                      lineHeight: 1.5,
                      color: 'rgba(251, 248, 241, 0.72)',
                      fontWeight: 400,
                    }}
                  >
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .t4-virtuoso-perks {
            grid-template-columns: 1fr !important;
          }
          .t4-virtuoso-perks > div {
            border-left: none !important;
            border-top: 1px solid rgba(155, 118, 65, 0.22);
            padding: 32px 16px !important;
          }
          .t4-virtuoso-perks > div:first-child { border-top: none; }
        }
      `}</style>
    </section>
  )
}
