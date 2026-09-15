import type { Metadata } from 'next'
import Link from 'next/link'
import { MarketingNav } from '@/components/marketing/MarketingNav'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'
import { SupportForm } from '@/components/marketing/SupportForm'
import { BODY_FONT, BODY_STYLE, CHARCOAL, DISPLAY_FONT, DIVIDER, LABEL_STYLE, WARM_GRAY } from '@/components/marketing/tokens'

export const metadata: Metadata = {
  title: 'Customer Support',
  description:
    'Get help with your Elite Advisor Hub account, billing, or technical issues. We respond within one business day.',
}

const CONTACTS = [
  { label: 'Email', value: 'support@eliteadvisorhub.com', href: 'mailto:support@eliteadvisorhub.com' },
  { label: 'Billing', value: 'billing@eliteadvisorhub.com', href: 'mailto:billing@eliteadvisorhub.com' },
  { label: 'Mailing address', value: '1016 Cliff Drive, Santa Barbara, CA 93109' },
]

export default function SupportPage() {
  return (
    <div className="eah-marketing" style={{ fontFamily: BODY_FONT, color: CHARCOAL, background: '#fff', minHeight: '100vh' }}>
      <MarketingNav minimal />
      <main>
        <section style={{ padding: '176px 0 64px' }}>
          <div className="eah-container">
            <p style={{ ...LABEL_STYLE, marginBottom: '24px' }}>Support</p>
            <h1 style={{ fontFamily: DISPLAY_FONT, fontSize: 'clamp(40px, 5.6vw, 80px)', fontWeight: 300, letterSpacing: '-0.035em', lineHeight: 1.0, margin: '0 0 24px', maxWidth: '14ch' }}>
              How can we help?
            </h1>
            <p style={{ ...BODY_STYLE, fontSize: '19px', maxWidth: '52ch' }}>
              We respond to every message within one business day. Tell us what is going on and we take it from there.
            </p>
          </div>
        </section>

        <section style={{ padding: '0 0 120px' }}>
          <div className="eah-container support-grid" style={{ display: 'grid', gridTemplateColumns: '4fr 8fr', gap: '64px', alignItems: 'start' }}>
            <div>
              <dl style={{ margin: 0, borderTop: `1px solid ${DIVIDER}` }}>
                {CONTACTS.map((c) => (
                  <div key={c.label} style={{ padding: '18px 0', borderBottom: `1px solid ${DIVIDER}` }}>
                    <dt style={{ ...LABEL_STYLE, marginBottom: '8px' }}>{c.label}</dt>
                    <dd style={{ margin: 0, fontSize: '15px', lineHeight: 1.5 }}>
                      {c.href ? <a href={c.href} className="eah-link" style={{ color: CHARCOAL }}>{c.value}</a> : c.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <p style={{ fontSize: '14px', color: WARM_GRAY, lineHeight: 1.6, margin: '24px 0 0' }}>
                For privacy or legal inquiries, see the{' '}
                <Link href="/privacy" className="eah-link" style={{ color: CHARCOAL }}>privacy policy</Link>.
              </p>
            </div>
            <div style={{ maxWidth: '640px' }}>
              <SupportForm />
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
      <style>{`
        @media (max-width: 900px) { .support-grid { grid-template-columns: 1fr !important; gap: 40px !important; } }
      `}</style>
    </div>
  )
}
