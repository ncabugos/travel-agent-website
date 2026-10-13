import Link from 'next/link'
import { DIVIDER_DARK, NEAR_BLACK } from './tokens'

/**
 * One line for Studio, the done-for-you marketing service. A band, not a
 * section, so it never competes with the primary action.
 */
export function MarketingStudioPromo() {
  return (
    <section aria-label="Marketing services" style={{ background: NEAR_BLACK, color: '#fff', borderTop: `1px solid ${DIVIDER_DARK}`, borderBottom: `1px solid ${DIVIDER_DARK}` }}>
      <div className="eah-container eah-studio-band" style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '24px 48px', flexWrap: 'wrap', padding: '32px 40px' }}>
        <p style={{ margin: 0, fontSize: '17px', lineHeight: 1.5 }}>
          <span style={{ fontWeight: 500 }}>Marketing services.</span>{' '}
          <span style={{ color: 'rgba(255,255,255,0.7)' }}>We handle your social media, blog, newsletter, and design.</span>
        </p>
        <Link href="/studio" className="eah-link" style={{ fontSize: '15px', whiteSpace: 'nowrap', textDecorationColor: 'rgba(255,255,255,0.4)' }}>
          See what is included
        </Link>
      </div>
      <style>{`@media (max-width: 640px) { .eah-studio-band { padding: 24px 20px !important; } }`}</style>
    </section>
  )
}
