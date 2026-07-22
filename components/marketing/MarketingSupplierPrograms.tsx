import Image from 'next/image'
import { getHotelPrograms } from '@/lib/hotel-programs'

const SAMPLE_BENEFITS = [
  'Upgrade on arrival',
  '$100 hotel credit',
  'Daily breakfast for two',
  'Early check-in / late check-out',
  'Welcome amenity',
  'VIP recognition',
]

export async function MarketingSupplierPrograms() {
  // Single source of truth: the hotel_programs catalog. Black logos on the
  // white grid (black/white-only). Falls back to MOCK offline.
  const programs = await getHotelPrograms()
  const SUPPLIER_LOGOS = programs
    .map((p) => ({ name: p.name, src: p.logo_url_black ?? p.logo_url ?? '' }))
    .filter((l) => l.src)

  return (
    <section
      className="eah-section"
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
            Luxury partnerships, already built in.
          </h2>
          <p
            style={{
              fontSize: '17px',
              lineHeight: 1.65,
              color: '#a1a1aa',
              margin: '0 0 18px',
              maxWidth: '680px',
            }}
          >
            Every preferred-partner program your clients care about — already on your site, with the
            benefits they'll receive on every stay. We keep the catalog maintained. You keep the
            relationships.
          </p>
          <p
            style={{
              fontSize: '14px',
              lineHeight: 1.7,
              color: '#71717a',
              margin: '0 0 14px',
              maxWidth: '680px',
            }}
          >
            At home in every network — Virtuoso, Signature, Ensemble, Travel Leaders, Serandipians,
            XO Private, Internova Select, GlobalStar, and the Affluent Traveler Collection.
          </p>
          <p
            style={{
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              color: '#C9B07A',
              margin: 0,
            }}
          >
            1,795+ luxury hotels &nbsp;·&nbsp; 30+ cruise lines &nbsp;·&nbsp; live within days
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
