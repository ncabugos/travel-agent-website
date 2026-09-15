import Image from 'next/image'
import Link from 'next/link'
import { Reveal } from './Reveal'
import { DISPLAY_FONT, NEAR_BLACK, PRIMARY_CTA_LABEL, PRIMARY_CTA_STYLE } from './tokens'

/**
 * Homepage §10: the closing argument. Same single goal as the hero.
 */
export function MarketingClosingCTA() {
  return (
    <section
      id="closing-cta"
      className="eah-section"
      style={{ position: 'relative', background: NEAR_BLACK, color: '#fff', padding: '160px 0', overflow: 'hidden' }}
    >
      <Image
        src="/media/hotel-programs/belmond-bellini-club/belmond-hero-2000.jpg"
        alt=""
        fill
        sizes="100vw"
        style={{ objectFit: 'cover', objectPosition: 'center', zIndex: 0, opacity: 0.5 }}
      />
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'rgba(11,10,9,0.6)', zIndex: 1 }} />
      <div className="eah-container" style={{ position: 'relative', zIndex: 2 }}>
        <Reveal>
          <h2 style={{ fontFamily: DISPLAY_FONT, fontSize: 'clamp(36px, 5vw, 72px)', fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1.02, margin: '0 0 24px', maxWidth: '18ch' }}>
            Your next client will look you up before they call.
          </h2>
          <p style={{ fontSize: '18px', lineHeight: 1.6, color: 'rgba(255,255,255,0.8)', margin: '0 0 40px', maxWidth: '44ch' }}>
            When they do, the site should hold the standard you set in the room.
          </p>
          <Link href="/schedule-consultation" className="eah-cta-primary" style={PRIMARY_CTA_STYLE}>
            {PRIMARY_CTA_LABEL}
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
