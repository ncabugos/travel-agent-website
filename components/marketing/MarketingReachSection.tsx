import { DotGlobe } from '@/components/auth/DotGlobe'

const REACH_STATS = [
  { value: '1,800+', label: 'Luxury hotels in the catalog' },
  { value: '24', label: 'Preferred-partner programs maintained' },
  { value: '12+', label: 'Ocean & river cruise lines' },
  { value: '7d', label: 'Average time from sign-up to live site' },
]

export function MarketingReachSection() {
  return (
    <section
      style={{
        position: 'relative',
        padding: '120px 24px',
        background: 'linear-gradient(180deg, #0a0b1e 0%, #14163a 100%)',
        color: '#fafafa',
        overflow: 'hidden',
      }}
    >
      {/* Globe canvas — fills the entire section as ambient background */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.55,
        }}
      >
        <DotGlobe
          variant="continents"
          continentSamples={20000}
          color="#a78bfa"
          rotationSeconds={140}
          maxDotRadius={1.6}
          sphereScale={0.62}
          centerX={0.5}
          centerY={0.55}
          interactive={false}
        />
      </div>

      {/* Subtle radial vignette so copy stays legible */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, rgba(10,11,30,0) 0%, rgba(10,11,30,0.65) 75%, rgba(10,11,30,0.92) 100%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '64px',
          alignItems: 'center',
          minHeight: '480px',
        }}
        className="eah-reach-grid"
      >
        <div>
          <span
            style={{
              display: 'inline-block',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#a78bfa',
              marginBottom: '24px',
            }}
          >
            The Network
          </span>
          <h2
            style={{
              fontSize: 'clamp(34px, 4.4vw, 52px)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              lineHeight: 1.05,
              margin: '0 0 24px',
              color: '#ffffff',
              maxWidth: '600px',
            }}
          >
            A network that travels with you, wherever the trip is.
          </h2>
          <p
            style={{
              fontSize: '18px',
              lineHeight: 1.65,
              color: '#c4c4d0',
              margin: '0 0 36px',
              maxWidth: '540px',
            }}
          >
            The best in luxury travel are also the best connected — and that network is built into
            every Elite Advisor Hub site. A global portfolio of the world's finest hotels and the
            major ocean and river cruise lines, with villa specialists across the Mediterranean, the
            Caribbean, and beyond. It's the reach to curate extraordinary journeys anywhere your
            clients want to go — live on your site from day one.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '480px' }}>
            {[
              'Suppliers maintained by us so the catalog never goes stale',
              'Curated cruise pages with itineraries, ships, and benefits',
              'Villa modules unlock at Custom and Agency tiers',
              'New programs added quarterly as the market evolves',
            ].map((line) => (
              <div key={line} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span
                  style={{
                    flexShrink: 0,
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: 'rgba(167,139,250,0.16)',
                    border: '1px solid rgba(167,139,250,0.4)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '2px',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a78bfa' }} />
                </span>
                <span style={{ fontSize: '15px', color: '#e4e4e7', lineHeight: 1.55 }}>{line}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
          }}
          className="eah-reach-stats"
        >
          {REACH_STATS.map((stat) => (
            <div
              key={stat.label}
              style={{
                padding: '24px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '14px',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
              }}
            >
              <div
                style={{
                  fontSize: 'clamp(28px, 3vw, 36px)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: '#ffffff',
                  marginBottom: '8px',
                  lineHeight: 1.1,
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: '13px', color: '#a1a1aa', lineHeight: 1.4 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .eah-reach-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .eah-reach-stats { max-width: 480px; }
        }
      `}</style>
    </section>
  )
}
