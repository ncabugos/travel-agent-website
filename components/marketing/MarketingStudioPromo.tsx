import Link from 'next/link'
import { CHARCOAL, DIVIDER, WARM_GRAY_DARK } from './tokens'

/**
 * One line for Studio, the done-for-you marketing service. A band, not a
 * section, so it never competes with the primary action.
 */
export function MarketingStudioPromo() {
  return (
    <section aria-label="Studio" style={{ background: '#fff', color: CHARCOAL, borderTop: `1px solid ${DIVIDER}`, borderBottom: `1px solid ${DIVIDER}` }}>
      <div className="eah-container eah-studio-band" style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '24px 48px', flexWrap: 'wrap', padding: '32px 40px' }}>
        <p style={{ margin: 0, fontSize: '17px', lineHeight: 1.5 }}>
          <span style={{ fontWeight: 500 }}>Studio.</span>{' '}
          <span style={{ color: WARM_GRAY_DARK }}>Done-for-you social, content, and design for advisors on the platform.</span>
        </p>
        <Link href="/studio" className="eah-link" style={{ fontSize: '15px', whiteSpace: 'nowrap' }}>
          See Studio
        </Link>
      </div>
      <style>{`@media (max-width: 640px) { .eah-studio-band { padding: 24px 20px !important; } }`}</style>
    </section>
  )
}
