import Image from 'next/image'

const SUPPLIER_LOGOS = [
  { name: 'Aman', src: '/assets/supplier logos/black transparent/Aman-black-600.png' },
  { name: 'Belmond Bellini Club', src: '/assets/supplier logos/black transparent/belmond_bellini-logo-black-600.png' },
  { name: 'Dorchester Diamond Club', src: '/assets/supplier logos/black transparent/dorchester_diamond-logo-black-600.png' },
  { name: 'Four Seasons Preferred Partner', src: '/assets/supplier logos/black transparent/FS_preferred-600-black.png' },
  { name: 'Rosewood Elite', src: '/assets/supplier logos/black transparent/rosewood_elite-black-600.png' },
  { name: 'Mandarin Oriental Fan Club', src: '/assets/supplier logos/black transparent/mandarin-oriental-fan-club-Mandarin-black-600.png' },
  { name: 'Ritz-Carlton Stars', src: '/assets/supplier logos/black transparent/ritz-carlton-stars-black-600.png' },
  { name: 'Marriott Stars & Luminous', src: '/assets/supplier logos/black transparent/Marriott_stars_luminous-black-600.png' },
  { name: 'Hyatt Privé', src: '/assets/supplier logos/black transparent/HyattPrive-black-600.png' },
  { name: 'Rocco Forte', src: '/assets/supplier logos/black transparent/Rocco_Forte-black-600.png' },
  { name: 'Peninsula Pen Club', src: '/assets/supplier logos/black transparent/Peninsula_PenClub-black-600.png' },
  { name: 'Shangri-La Luxury Circle', src: '/assets/supplier logos/black transparent/ShangriLa-black-600.png' },
  { name: 'Six Senses', src: '/assets/supplier logos/black transparent/SixSenses-logo-black-600.png' },
  { name: 'Auberge Resorts', src: '/assets/supplier logos/black transparent/auberge-logo-black-600.png' },
  { name: 'Como Hotels', src: '/assets/supplier logos/black transparent/como-hotels-black-600.png' },
  { name: 'Montage', src: '/assets/supplier logos/black transparent/montage-black-600.png' },
  { name: 'One&Only', src: '/assets/supplier logos/black transparent/one&only-black-600.png' },
  { name: 'Oetker Collection Pearl', src: '/assets/supplier logos/black transparent/oetker-pearl-black-600.png' },
  { name: 'Leading Hotels of the World', src: '/assets/supplier logos/black transparent/LeadingHotels-black-600.png' },
  { name: 'Kempinski Club 1897', src: '/assets/supplier logos/black transparent/Kempinski-Club1897-black-600.png' },
  { name: 'Jumeirah Passport', src: '/assets/supplier logos/black transparent/jumeirah_passport-black-600.png' },
  { name: 'Preferred Hotels & Resorts', src: '/assets/supplier logos/black transparent/preferredHotels-logo-black-600.png' },
  { name: 'Accor Hera', src: '/assets/supplier logos/black transparent/accor-hera-black-600.png' },
  { name: 'Couture', src: '/assets/supplier logos/black transparent/couture-logo-black-600.png' },
]

const SAMPLE_BENEFITS = [
  'Upgrade on arrival',
  '$100 hotel credit',
  'Daily breakfast for two',
  'Early check-in / late check-out',
  'Welcome amenity',
  'VIP recognition',
]

export function MarketingSupplierPrograms() {
  return (
    <section
      style={{
        padding: '120px 24px',
        background: '#0a0a0a',
        color: '#fafafa',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ maxWidth: '760px', marginBottom: '64px' }}>
          <span
            style={{
              display: 'inline-block',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#a78bfa',
              marginBottom: '20px',
            }}
          >
            Supplier Programs
          </span>
          <h2
            style={{
              fontSize: 'clamp(32px, 4vw, 44px)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              margin: '0 0 20px',
              color: '#ffffff',
            }}
          >
            The catalog that makes you look like you've been doing this for twenty years.
          </h2>
          <p
            style={{
              fontSize: '17px',
              lineHeight: 1.65,
              color: '#a1a1aa',
              margin: 0,
              maxWidth: '680px',
            }}
          >
            Every preferred-partner program your clients care about — already on your site, with the
            benefits they'll receive on every stay. We keep the catalog maintained. You keep the
            relationships.
          </p>
        </div>

        {/* Logo grid */}
        <div
          className="eah-supplier-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '0',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px',
            overflow: 'hidden',
            background: '#fff',
          }}
        >
          {SUPPLIER_LOGOS.map((logo) => (
            <div
              key={logo.name}
              title={logo.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '32px 20px',
                background: '#fff',
                borderRight: '1px solid #f1f1f1',
                borderBottom: '1px solid #f1f1f1',
                minHeight: '120px',
                transition: 'background 0.2s ease',
              }}
              className="eah-supplier-cell"
            >
              <Image
                src={logo.src}
                alt={logo.name}
                width={140}
                height={56}
                style={{ maxHeight: '52px', width: 'auto', objectFit: 'contain', opacity: 0.85 }}
                unoptimized
              />
            </div>
          ))}
        </div>

        {/* Benefits + cruise note */}
        <div
          style={{
            marginTop: '64px',
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '48px',
            alignItems: 'start',
          }}
          className="eah-supplier-detail"
        >
          <div>
            <h3
              style={{
                fontSize: '22px',
                fontWeight: 600,
                margin: '0 0 18px',
                letterSpacing: '-0.01em',
                color: '#ffffff',
              }}
            >
              Every program renders as its own page
            </h3>
            <p style={{ fontSize: '15.5px', lineHeight: 1.7, color: '#a1a1aa', margin: '0 0 22px' }}>
              Each supplier program gets a dedicated landing page on your site — overview, the participating
              properties, and the privileges your client receives at every check-in. Examples of the
              benefits surfaced on each program:
            </p>
            <ul
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '10px',
                margin: 0,
                padding: 0,
                listStyle: 'none',
              }}
            >
              {SAMPLE_BENEFITS.map((b) => (
                <li
                  key={b}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '14px',
                    color: '#e4e4e7',
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#a78bfa',
                      flexShrink: 0,
                    }}
                  />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '28px',
            }}
          >
            <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#a78bfa', marginBottom: '14px' }}>
              Cruise & Villa Partners
            </p>
            <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.65, color: '#d4d4d8' }}>
              Regent Seven Seas, Crystal, Silversea, Explora Journeys, Four Seasons Yachts,
              Ritz-Carlton Yacht Collection, Orient Express Sailing, Aman at Sea, plus AmaWaterways,
              Avalon, and Uniworld on the river side. Villa networks layer in on Custom and Agency
              tiers.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .eah-supplier-cell:hover { background: #fafafa; }
        @media (max-width: 1024px) {
          .eah-supplier-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .eah-supplier-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .eah-supplier-detail { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .eah-supplier-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  )
}
