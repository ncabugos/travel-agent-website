import Image from 'next/image'

interface TemplateDemo {
  name: string
  tagline: string
  image: string
  url: string
  palette: string[]
}

const TEMPLATES: TemplateDemo[] = [
  {
    name: 'Vista',
    tagline: 'Cinematic, editorial. For advisors with a strong photography library.',
    image: '/demos/vista.png',
    url: '/t2/t2-demo',
    palette: ['#1a1715', '#a67c4f', '#f8f5f0'],
  },
  {
    name: 'Meridian',
    tagline: 'Quiet sans-serif grid. For advisors whose brand is the typography.',
    image: '/demos/meridian.png',
    url: '/t3/t3-demo',
    palette: ['#14110f', '#8b6840', '#f7f5f0'],
  },
  {
    name: 'Casa Solis',
    tagline: 'Quiet-luxury flagship. For boutique agencies and bespoke brands.',
    image: '/demos/casa_solis.jpg',
    url: '/t4/casa-solis',
    palette: ['#2d1f15', '#c4a26f', '#fbf8f1'],
  },
]

export function MarketingBrandedWebsite() {
  return (
    <section
      style={{
        padding: '120px 24px',
        background: 'linear-gradient(180deg, #fafafa 0%, #ffffff 100%)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ maxWidth: '720px', marginBottom: '64px' }}>
          <span
            style={{
              display: 'inline-block',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#7c3aed',
              marginBottom: '20px',
            }}
          >
            Branded Website
          </span>
          <h2
            style={{
              fontSize: 'clamp(32px, 4vw, 44px)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              margin: '0 0 20px',
              color: '#0a0a0a',
            }}
          >
            Your brand, on a site that earns the bookings you sell.
          </h2>
          <p
            style={{
              fontSize: '17px',
              lineHeight: 1.65,
              color: '#52525b',
              margin: 0,
              maxWidth: '640px',
            }}
          >
            Every Elite Advisor Hub website is tailored to your agency — your name, your typography,
            your palette, your photography, your voice. Choose one of three editorial templates as a
            starting point, then commission a bespoke layout if your brand demands it. None of them
            look like Squarespace.
          </p>
        </div>

        <div
          className="eah-templates-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
          }}
        >
          {TEMPLATES.map((tpl) => (
            <a
              key={tpl.name}
              href={tpl.url}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'block',
                background: '#fff',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid #ececec',
                transition: 'transform 0.4s ease, box-shadow 0.4s ease',
              }}
              className="eah-template-card"
            >
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '4 / 3',
                  background: '#f4f4f4',
                  overflow: 'hidden',
                }}
              >
                <Image
                  src={tpl.image}
                  alt={tpl.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '24px 24px 28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, letterSpacing: '-0.01em' }}>
                    {tpl.name}
                  </h3>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {tpl.palette.map((c) => (
                      <span
                        key={c}
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background: c,
                          border: '1px solid rgba(0,0,0,0.06)',
                        }}
                      />
                    ))}
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.55, color: '#71717a' }}>
                  {tpl.tagline}
                </p>
                <div style={{ marginTop: '20px', fontSize: '12px', fontWeight: 600, color: '#7c3aed', letterSpacing: '0.04em' }}>
                  View live demo →
                </div>
              </div>
            </a>
          ))}
        </div>

        <div
          style={{
            marginTop: '64px',
            padding: '32px 36px',
            background: '#0a0a0a',
            color: '#ffffff',
            borderRadius: '20px',
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '24px',
            alignItems: 'center',
          }}
          className="eah-bespoke-cta"
        >
          <div>
            <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#a78bfa', marginBottom: '10px' }}>
              Bespoke design
            </p>
            <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.3 }}>
              Need a fully custom design? Custom and Agency tiers ship with a bespoke build — typography,
              palette, modules, and premium page layouts designed around your existing brand.
            </h3>
          </div>
          <a
            href="/schedule-consultation"
            style={{
              display: 'inline-block',
              padding: '14px 24px',
              background: '#fff',
              color: '#0a0a0a',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Schedule a Consultation
          </a>
        </div>
      </div>

      <style>{`
        .eah-template-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 24px 48px -24px rgba(0,0,0,0.15);
        }
        @media (max-width: 900px) {
          .eah-templates-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 640px) {
          .eah-templates-grid { grid-template-columns: 1fr !important; }
          .eah-bespoke-cta { grid-template-columns: 1fr !important; padding: 28px !important; }
        }
      `}</style>
    </section>
  )
}
