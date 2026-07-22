import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TopBar } from '@/components/dashboard/TopBar'
import { Card } from '@/components/dashboard/Card'
import { Badge } from '@/components/dashboard/Badge'
import { PageContent } from '@/components/dashboard/DashboardShell'
import Link from 'next/link'
import { ManageBillingButton } from './ManageBillingButton'
import { BASE_PLAN, MODULES, usd } from '@/lib/pricing'

// Legacy Growth/Custom tiers bundle some modules (business model v2 —
// grandfathered accounts). Rank comparison against each module's legacyTier.
const TIER_RANK: Record<string, number> = { starter: 0, growth: 1, custom: 2, agency: 3 }
function tierAllowsModule(tier: string, moduleKey: string): boolean {
  const mod = MODULES.find((m) => m.key === moduleKey)
  if (!mod) return false
  return (TIER_RANK[tier] ?? 0) >= TIER_RANK[mod.legacyTier]
}

export const dynamic = 'force-dynamic'

// Display pricing follows business model v2 (docs/business-model-v2.md, source
// constants in lib/pricing.ts): one public site plan; Growth/Custom remain as
// grandfathered plans at their current list prices.
const PRICING = {
  starter: { name: 'The Site', price: '$59', setup: 'no', features: [...BASE_PLAN.features] },
  growth: { name: 'Growth', price: '$179', setup: '$1,499', features: ['Everything in The Site', 'Curated editorial stream (1 post/week)', 'Searchable hotel directory', 'Searchable cruise directory', 'Experiences directory', 'Instagram feed integration', 'Priority support'] },
  custom: { name: 'Custom', price: '$349', setup: '$2,999', features: ['Everything in Growth', 'Fully bespoke design', 'Villa catalog access', 'Topic requests (2 posts/week)', 'Bespoke landing pages'] },
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
  const activeModules = (agent?.active_modules as string[] | null) ?? []

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

        {/* Modules — business model v2: growth happens by adding modules,
            not by switching plans. Legacy tier switches are admin-managed. */}
        <Card title="Your Modules" subtitle="Add or remove modules anytime — billed on your existing subscription, prorated">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {MODULES.map((m, i) => {
              const isActive = activeModules.includes(m.key)
              // Legacy Growth/Custom tiers bundle some modules — show those as
              // included so grandfathered accounts read correctly.
              const bundled = !isActive && tierAllowsModule(tier, m.key)
              return (
                <div
                  key={m.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    padding: '12px 0',
                    borderTop: i === 0 ? 'none' : '1px solid #f3f4f6',
                    fontSize: '14px',
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 600, color: '#111' }}>{m.name}</span>
                    <span style={{ marginLeft: '10px', fontSize: '13px', fontWeight: 600, color: '#B49A5A' }}>
                      {usd(m.monthly)}/mo
                    </span>
                  </div>
                  {isActive ? (
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#065f46' }}>✓ Active</span>
                  ) : bundled ? (
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280' }}>Included in {plan.name}</span>
                  ) : (
                    <span style={{ fontSize: '13px', color: '#9ca3af' }}>—</span>
                  )}
                </div>
              )
            })}
          </div>
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
            <Link
              href="/agent-portal/services"
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#7c3aed',
                textDecoration: 'none',
              }}
            >
              Add modules &amp; services →
            </Link>
          </div>
        </Card>
      </PageContent>
    </>
  )
}
