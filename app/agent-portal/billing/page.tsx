import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TopBar } from '@/components/dashboard/TopBar'
import { Card } from '@/components/dashboard/Card'
import { Badge } from '@/components/dashboard/Badge'
import { PageContent } from '@/components/dashboard/DashboardShell'
import { ManageBillingButton } from './ManageBillingButton'

export const dynamic = 'force-dynamic'

const PRICING = {
  starter: { name: 'Starter', price: '$79', setup: '$299', features: ['Branded website', 'Curated editorial', 'Hotel programs', 'Preferred Cruise Partners overview', 'Advisor portal', 'Custom domain', 'Email support'] },
  growth: { name: 'Growth', price: '$149', setup: '$499', features: ['Everything in Starter', 'Searchable hotel directory', 'Searchable cruise directory', 'Experiences directory', 'Instagram feed integration', 'Advanced analytics', 'Priority support'] },
  custom: { name: 'Custom', price: '$299', setup: '$1,500', features: ['Everything in Growth', 'Custom-designed template', 'Additional custom pages', 'CRM integration', 'White-label options'] },
  agency: { name: 'Agency', price: 'Contact for quote', setup: '—', features: ['Everything in Custom', 'Individual advisor pages', 'Agency-wide lead routing', 'Unified agency billing', 'Agency admin dashboard', 'Shared content library', 'Team onboarding & training'] },
}

export default async function AgentBillingPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/agent-portal/login')

  const { data: agentData } = await supabase
    .from('agents')
    .select('*')
    .eq('email', session.user.email ?? '')
    .single()

  const agent = agentData as Record<string, unknown> | null
  const tier = (String(agent?.tier ?? 'starter')) as keyof typeof PRICING
  const plan = PRICING[tier]
  const status = String(agent?.subscription_status ?? 'trialing')
  const hasStripe = Boolean(agent?.stripe_customer_id)

  const statusVariant = status === 'active' ? 'success'
    : status === 'past_due' ? 'warning'
    : status === 'canceled' ? 'danger'
    : 'info' as const

  return (
    <>
      <TopBar title="Billing" subtitle="Manage your subscription and payment" />
      <PageContent>
        {/* Current Plan */}
        <Card title="Current Plan" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                <span style={{ fontSize: '24px', fontWeight: 700, color: '#111' }}>{plan.name}</span>
                <Badge label={status} variant={statusVariant} size="md" />
              </div>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>
                {tier === 'agency'
                  ? plan.price
                  : `${plan.price}/month · ${plan.setup} setup fee`}
              </span>
            </div>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '8px', fontSize: '14px',
          }}>
            {plan.features.map((f: string) => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#374151' }}>
                <span style={{ color: '#16a34a', fontSize: '14px' }}>✓</span>
                {f}
              </div>
            ))}
          </div>
        </Card>

        {/* Payment Management */}
        <Card title="Payment Method" style={{ marginBottom: '24px' }}>
          {hasStripe ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ margin: '0 0 4px', fontSize: '14px', color: '#374151' }}>
                  Manage your subscription, update payment methods, and view invoices
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>
                  You&apos;ll be redirected to our secure billing portal
                </p>
              </div>
              <ManageBillingButton />
            </div>
          ) : (
            <div style={{
              padding: '32px 24px',
              textAlign: 'center',
              backgroundColor: '#fafafa',
              borderRadius: '8px',
              border: '1px dashed #e5e7eb',
            }}>
              <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 600, color: '#111' }}>
                No Billing Account
              </h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', maxWidth: '400px', marginInline: 'auto' }}>
                Your account does not have a Stripe billing record yet.
                Contact your administrator to set up billing.
              </p>
            </div>
          )}
        </Card>

        {/* Plan Comparison */}
        <Card title="Available Plans" subtitle="Compare features across tiers">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }} className="eah-billing-plans">
            {Object.entries(PRICING).map(([key, p]) => {
              const isCurrentTier = key === tier
              const isAgency = key === 'agency'
              return (
                <div
                  key={key}
                  style={{
                    padding: '24px',
                    borderRadius: '12px',
                    border: isCurrentTier ? '2px solid #111' : '1px solid #e5e7eb',
                    backgroundColor: isCurrentTier ? '#fafafa' : '#fff',
                    position: 'relative',
                  }}
                >
                  {isCurrentTier && (
                    <div style={{
                      position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)',
                      backgroundColor: '#111', color: '#fff', fontSize: '10px', fontWeight: 600,
                      padding: '3px 10px', borderRadius: '10px', textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>
                      Current Plan
                    </div>
                  )}
                  <h4 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 600 }}>{p.name}</h4>
                  <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#6b7280' }}>
                    {isAgency
                      ? <strong style={{ fontSize: '14px', color: '#111' }}>{p.price}</strong>
                      : <><strong style={{ fontSize: '24px', color: '#111' }}>{p.price}</strong>/mo</>}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                    {p.features.map((f: string) => (
                      <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4b5563' }}>
                        <span style={{ color: '#16a34a' }}>✓</span> {f}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </PageContent>
    </>
  )
}
