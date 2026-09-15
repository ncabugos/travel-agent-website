import Link from 'next/link'
import { Reveal } from './Reveal'
import { CHARCOAL, CREAM, DISPLAY_FONT, DIVIDER, GOLD, WARM_GRAY_DARK } from './tokens'

/**
 * Homepage §8: the founder line and the one production proof point. Real
 * attribution only. When a client testimonial is captured, it goes here as a
 * named, photographed quote. Do not fabricate one.
 */
export function MarketingProof() {
  return (
    <section id="proof" className="eah-section" style={{ background: CREAM, color: CHARCOAL, padding: '120px 0' }}>
      <div className="eah-container" style={{ maxWidth: '1000px' }}>
        <Reveal>
          <div aria-hidden style={{ width: '40px', height: '1px', background: GOLD, marginBottom: '40px' }} />
          <blockquote style={{ margin: 0 }}>
            <p style={{
              fontFamily: DISPLAY_FONT, fontSize: 'clamp(26px, 3.2vw, 44px)', fontWeight: 300,
              letterSpacing: '-0.025em', lineHeight: 1.2, margin: '0 0 32px',
            }}>
              Elite Advisor Hub was built by an active Virtuoso advisor who got tired of explaining to web developers why a $25,000 booking does not look like a $250 booking on the same template.
            </p>
            <footer style={{ fontSize: '14px', color: WARM_GRAY_DARK }}>
              <span style={{ color: CHARCOAL }}>Nick Cabugos</span>, founder. Wine &amp; Wellness Travel, a Virtuoso member agency.
            </footer>
          </blockquote>
          <p style={{ margin: '48px 0 0', paddingTop: '24px', borderTop: `1px solid ${DIVIDER}`, fontSize: '15px', color: WARM_GRAY_DARK }}>
            In production for{' '}
            <Link href="https://www.edenforyourworld.com" target="_blank" rel="noopener" className="eah-link" style={{ color: CHARCOAL }}>
              Eden For Your World
            </Link>{' '}
            since April 2026.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
