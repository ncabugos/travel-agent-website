import Link from 'next/link'
import { CheckoutButton } from '@/components/stripe/CheckoutButton'
import { CTA_MICROCOPY, PRIMARY_CTA_LABEL, PRIMARY_CTA_STYLE } from './tokens'

/**
 * Homepage closing CTA band — the last thing before the footer.
 *
 * Same single goal as the hero: begin the 30 days, straight into Stripe
 * Checkout. The consultation path stays as a text-weight secondary for
 * agencies and advisors who want to talk first. Named proof sits directly
 * under the button (proof adjacent to the CTA outperforms proof elsewhere).
 */
export function MarketingClosingCTA() {
  return (
    <section
      id="closing-cta"
      className="eah-section"
      style={{
        padding: '120px 24px',
        background: 'linear-gradient(180deg, #0a0b1e 0%, #14163a 100%)',
        color: '#fafafa',
      }}
    >
      <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
        <h2
          style={{
            fontSize: 'clamp(34px, 4.4vw, 52px)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            lineHeight: 1.08,
            margin: '0 0 24px',
            color: '#ffffff',
          }}
        >
          Your next client will look you up before they call.
        </h2>
        <p
          style={{
            fontSize: '18px',
            lineHeight: 1.65,
            color: '#c4c4d0',
            margin: '0 auto 40px',
            maxWidth: '560px',
          }}
        >
          When they do, the site should do what you&rsquo;d do in the room — set the standard, then
          step out of the way. Your first 30 days are with our compliments.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
          <CheckoutButton
            tier="starter"
            popular
            className="eah-closing-primary"
            style={{ ...PRIMARY_CTA_STYLE, width: 'auto', minWidth: '260px' }}
          >
            {PRIMARY_CTA_LABEL}
          </CheckoutButton>
          <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.62)' }}>
            {CTA_MICROCOPY}
          </p>
          <Link
            href="/schedule-consultation"
            className="eah-closing-secondary eah-focus-ring"
            style={{
              marginTop: '10px',
              color: 'rgba(255,255,255,0.8)',
              fontSize: '15px',
              fontWeight: 500,
              textDecoration: 'underline',
              textUnderlineOffset: '4px',
              textDecorationColor: 'rgba(255,255,255,0.35)',
            }}
          >
            Prefer to talk first? Schedule a consultation
          </Link>
        </div>

        <p
          style={{
            margin: '44px auto 0',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255,255,255,0.14)',
            maxWidth: '520px',
            fontSize: '14px',
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          1,795+ luxury hotel programs · 30+ cruise lines · live within days
        </p>
      </div>

      <style>{`
        .eah-closing-secondary:hover { color: #fff !important; text-decoration-color: #fff !important; }
        .eah-closing-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 32px rgba(124,58,237,0.5) !important;
        }
      `}</style>
    </section>
  )
}
