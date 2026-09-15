import Image from 'next/image'
import { getHotelPrograms } from '@/lib/hotel-programs'
import { Reveal } from './Reveal'
import { DISPLAY_FONT, DIVIDER_DARK, NEAR_BLACK } from './tokens'

/**
 * Homepage §4: the supplier catalog. Full-bleed photograph, one number, the
 * benefits a client receives, and the program marks from the live catalog.
 */
const PERKS = [
  'Room upgrade on arrival',
  'Daily breakfast for two',
  '$100 hotel or spa credit',
  'Early check-in and late check-out',
  'VIP recognition',
]

export async function MarketingSupplierPrograms() {
  const programs = await getHotelPrograms()
  const logos = programs
    .map((p) => ({ name: p.name, src: p.logo_url_white ?? p.logo_url_black ?? p.logo_url ?? '', invert: !p.logo_url_white }))
    .filter((l) => l.src)
    .slice(0, 12)

  return (
    <section
      id="catalog"
      className="eah-section"
      style={{ position: 'relative', background: NEAR_BLACK, color: '#fff', padding: '140px 0', overflow: 'hidden' }}
    >
      <Image
        src="/media/hero images/four-seasons-taormina-pool_2-hero.jpg"
        alt=""
        fill
        sizes="100vw"
        style={{ objectFit: 'cover', objectPosition: 'center', zIndex: 0, opacity: 0.55 }}
      />
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'rgba(11,10,9,0.62)', zIndex: 1 }} />

      <div className="eah-container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="eah-catalog-grid" style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '64px', alignItems: 'end' }}>
          <Reveal>
            <p style={{ margin: '0 0 24px', fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>
              Supplier catalog
            </p>
            <div style={{ fontFamily: DISPLAY_FONT, fontSize: 'clamp(72px, 11vw, 160px)', fontWeight: 300, letterSpacing: '-0.04em', lineHeight: 0.95, fontVariantNumeric: 'tabular-nums' }}>
              1,805
            </div>
            <h2 style={{ fontFamily: DISPLAY_FONT, fontSize: 'clamp(24px, 2.6vw, 34px)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.2, margin: '20px 0 24px', maxWidth: '22ch' }}>
              luxury hotels across 103 countries, maintained so you never have to.
            </h2>
            <p style={{ margin: 0, fontSize: '17px', lineHeight: 1.6, color: 'rgba(255,255,255,0.78)', maxWidth: '48ch' }}>
              Every preferred-partner program your clients ask about is already on your site, with the benefits they receive on every stay.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>
              What clients receive
            </p>
            <ul role="list" style={{ listStyle: 'none', margin: 0, padding: 0, borderTop: `1px solid ${DIVIDER_DARK}` }}>
              {PERKS.map((perk) => (
                <li key={perk} style={{ padding: '16px 0', borderBottom: `1px solid ${DIVIDER_DARK}`, fontSize: '17px', color: 'rgba(255,255,255,0.92)' }}>
                  {perk}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {logos.length > 0 && (
          <Reveal delay={200}>
            <ul
              role="list"
              className="eah-catalog-logos"
              style={{
                listStyle: 'none', margin: '96px 0 0', padding: '40px 0 0',
                borderTop: `1px solid ${DIVIDER_DARK}`,
                display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '40px 32px', alignItems: 'center',
              }}
            >
              {logos.map((logo) => (
                <li key={logo.name} title={logo.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '48px' }}>
                  <Image
                    src={logo.src}
                    alt={logo.name}
                    width={140}
                    height={48}
                    unoptimized
                    style={{ height: 'auto', width: 'auto', maxHeight: '40px', maxWidth: '140px', objectFit: 'contain', opacity: 0.8, filter: logo.invert ? 'brightness(0) invert(1)' : undefined }}
                  />
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .eah-catalog-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .eah-catalog-logos { grid-template-columns: repeat(3, 1fr) !important; margin-top: 64px !important; }
        }
        @media (max-width: 480px) {
          .eah-catalog-logos { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  )
}
