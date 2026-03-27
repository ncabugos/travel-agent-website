import Image from 'next/image'

interface T2VirtuosoBandProps {
  agencyName: string
  hostAgency?: string
}


export function T2VirtuosoBand({ agencyName, hostAgency = 'Montecito Village Travel' }: T2VirtuosoBandProps) {
  const PERKS = [
    {
      icon: (
        // Hotel key — single clean stroke
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
          stroke="var(--t2-accent)" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21l9-9" />
          <circle cx="15" cy="9" r="4" />
          <path d="M9.5 14.5L8 16h2v2h2v-2" />
        </svg>
      ),
      title: 'Hotel Perks',
      perks: ['Complimentary breakfast daily', 'Spa, dining, or resort credit', 'Room upgrades & exclusive amenities'],
    },
    {
      icon: (
        // Anchor — nautical, minimal
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
          stroke="var(--t2-accent)" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="5" r="2" />
          <path d="M12 7v14" />
          <path d="M5 14H4a8 8 0 0 0 16 0h-1" />
          <path d="M8 11h8" />
        </svg>
      ),
      title: 'Cruise Perks',
      perks: ['Dedicated onboard Virtuoso hosts', 'Private welcome receptions', 'Exclusive shore excursions & credits'],
    },
    {
      icon: (
        // Star / sparkle — VIP, minimal 4-point
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
          stroke="var(--t2-accent)" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      ),
      title: 'VIP Experiences',
      perks: ['Preferred rates & priority access', '200+ elite vetted providers', '2,500+ global destinations'],
    },
  ]

  return (
    <section
      className="t2-section-dark"
      style={{ padding: 'var(--t2-section-pad) 24px', position: 'relative', overflow: 'hidden' }}
    >
      {/* Background radial glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(180,154,90,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 'var(--t2-content-max, 1280px)', margin: '0 auto', position: 'relative' }}>



        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p className="t2-label" style={{ marginBottom: 14, letterSpacing: '0.18em' }}>Network Affiliation</p>
          <h2
            className="t2-heading t2-heading-lg"
            style={{ color: '#FFFFFF', marginBottom: 32 }}
          >
            A Virtuoso Member
          </h2>

          {/* Virtuoso logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
            <Image
              src="/assets/virtuoso-footer.png"
              alt="Virtuoso"
              width={180}
              height={48}
              style={{ objectFit: 'contain', opacity: 0.85 }}
              unoptimized
            />
          </div>

          <p
            style={{
              fontFamily: 'var(--t2-font-sans)',
              fontSize: 16,
              lineHeight: 1.9,
              color: 'rgba(255,255,255,0.65)',
              maxWidth: 640,
              margin: '0 auto 28px',
            }}
          >
            {agencyName} is an affiliate of {hostAgency}, and longtime member of Virtuoso — an elite
            consortium of luxury travel agencies. Our connections give you access to exclusive deals
            and privileges you won&apos;t find anywhere else.
          </p>

          {/* Conde Nast badge row */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            <Image
              src="/assets/eden/2026_CONDE-NAST_CONDE-NAST-TRAVELER_TOP-TRAVEL-SPECIALISTS_LOGO_RGB.png"
              alt="Condé Nast Traveler Top Travel Specialist 2026"
              width={110}
              height={110}
              style={{ objectFit: 'contain', opacity: 0.8 }}
              unoptimized
            />
            <Image
              src="/assets/eden/2025-2026_CONDE-NAST_CONDE-NAST-TRAVELER_TOP-TRAVEL-SPECIALISTS_LOGO_RGB.png"
              alt="Condé Nast Traveler Top Travel Specialist 2025"
              width={110}
              height={110}
              style={{ objectFit: 'contain', opacity: 0.8 }}
              unoptimized
            />
          </div>
        </div>


        {/* 3 Perk Columns — simplified */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 0,
          }}
        >
          {PERKS.map((col, i) => (
            <div
              key={i}
              style={{
                padding: '40px 40px 48px',
                textAlign: 'left',
                borderLeft: i > 0 ? '1px solid rgba(180,154,90,0.15)' : undefined,
              }}
            >
              {/* Bare icon — no ring */}
              <div style={{ marginBottom: 20, opacity: 0.9 }}>
                {col.icon}
              </div>

              {/* Title */}
              <h3
                style={{
                  fontFamily: 'var(--t2-font-sans)',
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--t2-accent)',
                  marginBottom: 20,
                }}
              >
                {col.title}
              </h3>

              {/* Perks — clean stacked lines, no dividers */}
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {col.perks.map((perk, j) => (
                  <li key={j}>
                    <span
                      style={{
                        fontFamily: 'var(--t2-font-sans)',
                        fontSize: 14,
                        fontWeight: 300,
                        lineHeight: 1.65,
                        color: 'rgba(255,255,255,0.55)',
                        letterSpacing: '0.01em',
                      }}
                    >
                      {perk}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>



      </div>

      {/* Mobile responsiveness */}
      <style>{`
        @media (max-width: 768px) {
          .t2-virtuoso-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
