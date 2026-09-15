import { MarketingNav } from '@/components/marketing/MarketingNav'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'
import { ConsultationForm } from '@/components/marketing/ConsultationForm'
import { BODY_FONT, BODY_STYLE, CHARCOAL, DISPLAY_FONT, LABEL_STYLE } from '@/components/marketing/tokens'

export const metadata = {
  title: 'Schedule a Consultation — Elite Advisor Hub',
  description: 'Talk to our team about a custom-branded advisor site or a multi-advisor agency build.',
}

const ALLOWED_TIERS = ['starter', 'growth', 'custom', 'agency'] as const
type TierValue = (typeof ALLOWED_TIERS)[number]
type BillingCycle = 'monthly' | 'annual'

interface PageProps {
  searchParams: Promise<{ tier?: string; billing?: string }>
}

export default async function ScheduleConsultationPage({ searchParams }: PageProps) {
  const { tier, billing } = await searchParams
  const initialTier: TierValue = (ALLOWED_TIERS as readonly string[]).includes(tier ?? '')
    ? (tier as TierValue)
    : 'custom'
  const initialBilling: BillingCycle = billing === 'annual' ? 'annual' : 'monthly'

  return (
    <div className="eah-marketing" style={{ fontFamily: BODY_FONT, color: CHARCOAL, background: '#fff', minHeight: '100vh' }}>
      <MarketingNav minimal />
      <main>
        <section style={{ padding: '176px 0 64px' }}>
          <div className="eah-container">
            <p style={{ ...LABEL_STYLE, marginBottom: '24px' }}>Consultation</p>
            <h1 style={{ fontFamily: DISPLAY_FONT, fontSize: 'clamp(40px, 5.6vw, 80px)', fontWeight: 300, letterSpacing: '-0.035em', lineHeight: 1.0, margin: '0 0 24px', maxWidth: '14ch' }}>
              Let us talk about your site.
            </h1>
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
