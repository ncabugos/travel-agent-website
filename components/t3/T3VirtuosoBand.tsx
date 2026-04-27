import Image from 'next/image'

interface T3VirtuosoBandProps {
  agencyName: string
  hostAgency?: string
}

const PERKS = [
  {
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none"
        stroke="var(--t3-accent)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21l9-9" />
        <circle cx="15" cy="9" r="4" />
        <path d="M9.5 14.5L8 16h2v2h2v-2" />
      </svg>
    ),
    title: 'Hotel Perks',
    perks: [
      'Complimentary breakfast daily',
      'Spa, dining, or resort credit',
      'Room upgrades & exclusive amenities',
    ],
  },
  {
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none"
        stroke="var(--t3-accent)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v14" />
        <path d="M5 14H4a8 8 0 0 0 16 0h-1" />
        <path d="M8 11h8" />
      </svg>
    ),
    title: 'Cruise Perks',
    perks: [
      'Dedicated onboard Virtuoso hosts',
      'Private welcome receptions',
      'Exclusive shore excursions & credits',
    ],
  },
  {
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none"
        stroke="var(--t3-accent)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
    title: 'VIP Experiences',
    perks: [
      'Preferred rates & priority access',
      '200+ elite vetted providers',
      '2,500+ global destinations',
    ],
  },
]

/**
 * Dark-band "A Virtuoso Member" section. T3-styled port of T2VirtuosoBand.
 * Uses T3 color tokens (--t3-dark-bg, --t3-accent, --t3-section-pad).
 */
export function T3VirtuosoBand({
  agencyName,
  hostAgency,
}: T3VirtuosoBandProps) {
  const intro = hostAgency
    ? `${agencyName} is an affiliate of ${hostAgency}, and a longtime member of Virtuoso — an elite consortium of luxury travel agencies. Our connections give you access to exclusive deals and privileges you won't find anywhere else.`
    : `${agencyName} is a longtime member of Virtuoso — an elite consortium of luxury travel agencies. Our connections give you access to exclusive deals and privileges you won't find anywhere else.`

  return (
    <section
      style={{
        background: 'var(--t3-dark-bg)',
        color: 'var(--t3-dark-text)',
        padding: 'var(--t3-section-pad) 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle radial accent */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(166, 124, 79, 0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: 'var(--t3-content-max, 1280px)',
          margin: '0 auto',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <span
            className="t3-eyebrow"
            style={{ justifyContent: 'center', color: 'var(--t3-accent)' }}
          >
            Network Affiliation
          </span>
          <h2
            className="t3-headline-xl"
            style={{ color: 'var(--t3-dark-text)', marginTop: 24, marginBottom: 40 }}
          >
            A Virtuoso Member
          </h2>

          {/* Virtuoso logo */}
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
              fontFamily: 'var(--t3-font-body)',
              fontSize: 16,
              lineHeight: 1.85,
              color: 'rgba(247, 245, 240, 0.66)',
              maxWidth: 640,
              margin: '0 auto 32px',
            }}
          >
            {intro}
          </p>

          {/* Condé Nast badges */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 24,
              flexWrap: 'wrap',
            }}
          >
            <Image
              src="/assets/eden/2026_CONDE-NAST_CONDE-NAST-TRAVELER_TOP-TRAVEL-SPECIALISTS_LOGO_RGB.png"
              alt="Condé Nast Traveler Top Travel Specialist 2026"
              width={108}
              height={108}
              style={{ objectFit: 'contain', opacity: 0.82 }}
              unoptimized
            />
            <Image
              src="/assets/eden/2025-2026_CONDE-NAST_CONDE-NAST-TRAVELER_TOP-TRAVEL-SPECIALISTS_LOGO_RGB.png"
              alt="Condé Nast Traveler Top Travel Specialist 2025–2026"
              width={108}
              height={108}
              style={{ objectFit: 'contain', opacity: 0.82 }}
              unoptimized
            />
          </div>
        </div>

        {/* Perk columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 0,
          }}
          className="t3-virtuoso-perks"
        >
          {PERKS.map((col, i) => (
            <div
              key={col.title}
              style={{
                padding: '40px 40px 48px',
                borderLeft: i > 0 ? '1px solid rgba(166, 124, 79, 0.16)' : undefined,
              }}
            >
              <div style={{ marginBottom: 20, opacity: 0.92 }}>{col.icon}</div>
              <h3
                style={{
                  fontFamily: 'var(--t3-font-body)',
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--t3-accent)',
                  marginBottom: 20,
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
                  gap: 12,
                }}
              >
                {col.perks.map((p) => (
                  <li
                    key={p}
                    style={{
                      fontFamily: 'var(--t3-font-body)',
                      fontSize: 14,
                      fontWeight: 300,
                      lineHeight: 1.65,
                      color: 'rgba(247, 245, 240, 0.55)',
                      letterSpacing: '0.01em',
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
          .t3-virtuoso-perks {
            grid-template-columns: 1fr !important;
          }
          .t3-virtuoso-perks > div {
            border-left: none !important;
            border-top: 1px solid rgba(166, 124, 79, 0.16);
            padding: 36px 24px !important;
          }
          .t3-virtuoso-perks > div:first-child {
            border-top: none;
          }
        }
      `}</style>
    </section>
  )
}
