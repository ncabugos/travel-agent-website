import { MarketingNav } from '@/components/marketing/MarketingNav'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'
import { ConsultationForm } from '@/components/marketing/ConsultationForm'
import { BODY_FONT, BODY_STYLE, CHARCOAL, DISPLAY_FONT, GOLD, LABEL_STYLE } from '@/components/marketing/tokens'

export const metadata = {
  title: 'Schedule a Consultation — Elite Advisor Hub',
  description: 'Talk to our team about a custom-branded advisor site or a multi-advisor agency build.',
}

const ALLOWED_TIERS = ['starter', 'growth', 'custom', 'agency'] as const
type TierValue = (typeof ALLOWED_TIERS)[number]
type BillingCycle = 'monthly' | 'annual'

// Black Friday 2026: 50% off setup for signups through Monday, Nov 30.
// The promo copy turns itself off at midnight Pacific on Dec 1.
const BLACK_FRIDAY_ENDS_AT = Date.parse('2026-12-01T00:00:00-08:00')

interface PageProps {
  searchParams: Promise<{ tier?: string; billing?: string }>
}

export default async function ScheduleConsultationPage({ searchParams }: PageProps) {
  const { tier, billing } = await searchParams
  const initialTier: TierValue = (ALLOWED_TIERS as readonly string[]).includes(tier ?? '')
    ? (tier as TierValue)
    : 'custom'
  const initialBilling: BillingCycle = billing === 'annual' ? 'annual' : 'monthly'
  const blackFriday = Date.now() < BLACK_FRIDAY_ENDS_AT

  return (
    <div className="eah-marketing" style={{ fontFamily: BODY_FONT, color: CHARCOAL, background: '#fff', minHeight: '100vh' }}>
      <MarketingNav minimal />
      <main>
        <section style={{ padding: '176px 0 64px' }}>
          <div className="eah-container">
            <p style={{ ...LABEL_STYLE, marginBottom: '24px', ...(blackFriday ? { color: GOLD } : {}) }}>
              {blackFriday ? 'Black Friday · 50% off setup' : 'Consultation'}
            </p>
            <h1 style={{ fontFamily: DISPLAY_FONT, fontSize: 'clamp(40px, 5.6vw, 80px)', fontWeight: 300, letterSpacing: '-0.035em', lineHeight: 1.0, margin: '0 0 24px', maxWidth: '14ch' }}>
              Let us talk about your site.
            </h1>
            {blackFriday && (
              <p style={{ ...BODY_STYLE, fontSize: '19px', maxWidth: '52ch', color: CHARCOAL, marginBottom: '16px' }}>
                Our Black Friday deal starts now: sign up by Monday, November 30, and the setup fee is 50% off.
              </p>
            )}
            <p style={{ ...BODY_STYLE, fontSize: '19px', maxWidth: '52ch' }}>
              Tell us a little about you and what you are building. We reply within one business day to schedule a call.
            </p>
          </div>
        </section>
        <section style={{ padding: '0 0 120px' }}>
          <div className="eah-container">
            <div style={{ maxWidth: '880px' }}>
              <ConsultationForm initialTier={initialTier} initialBilling={initialBilling} />
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  )
}
