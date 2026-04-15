import { notFound } from 'next/navigation'
import Link from 'next/link'
import { TopBar } from '@/components/dashboard/TopBar'
import { Card } from '@/components/dashboard/Card'
import { Badge } from '@/components/dashboard/Badge'
import { StatCard } from '@/components/dashboard/StatCard'
import { PageContent } from '@/components/dashboard/DashboardShell'
import { getAgentById } from '@/lib/supabase/admin'
import { createServiceClient } from '@/lib/supabase/service'
import { Icons } from '@/components/dashboard/Icons'
import { AgentSubscriptionPanel } from '@/components/admin/AgentSubscriptionPanel'
import { loadSubscription, loadInvoices } from '@/lib/stripe-queries'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ agentId: string }>
}

export default async function AdminAgentDetailPage({ params }: PageProps) {
  const { agentId } = await params
  const agentData = await getAgentById(agentId)
  if (!agentData) return notFound()
  const agent = agentData

  // Get agent stats + Stripe data in parallel
  const supabase = createServiceClient()
  const [
    { count: postCount },
    { count: requestCount },
    subscriptionResult,
    invoicesResult,
  ] = await Promise.all([
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('agent_id', agentId),
    supabase.from('edit_requests').select('*', { count: 'exact', head: true }).eq('agent_id', agentId),
    loadSubscription(agent.stripe_subscription_id),
    loadInvoices(agent.stripe_customer_id),
  ])

  const tierVariant = agent.tier === 'custom' ? 'info' : agent.tier === 'growth' ? 'success' : 'default' as const
  const statusVariant = agent.subscription_status === 'active' ? 'success'
    : agent.subscription_status === 'past_due' ? 'warning'
    : agent.subscription_status === 'canceled' ? 'danger'
    : 'info' as const
  const template = agent.template || 'frontend'
  const siteUrl = `/${template}/${agentId}`

  return (
    <>
      <TopBar
        title={agent.agency_name || 'Agent Detail'}
        subtitle={agent.full_name}
        actions={
          <Link
            href={siteUrl}
            target="_blank"
            style={{
              padding: '10px 20px', backgroundColor: '#111', color: '#fff',
              border: 'none', borderRadius: '8px', fontSize: '13px',
              fontWeight: 600, textDecoration: 'none',
            }}
          >
            View Website ↗
          </Link>
        }
      />
      <PageContent>
        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
          <StatCard title="Blog Posts" value={postCount ?? 0} icon={Icons.file} />
          <StatCard title="Edit Requests" value={requestCount ?? 0} icon={Icons.inbox} />
          <StatCard
            title="Subscription"
            value={String(agent.tier ?? 'Starter').charAt(0).toUpperCase() + String(agent.tier ?? 'starter').slice(1)}
            icon={Icons.creditCard}
          />
        </div>

        {/* Subscription panel — full width */}
        <div style={{ marginBottom: '24px' }}>
          <AgentSubscriptionPanel
            agentId={agentId}
            subscription={subscriptionResult.data}
            invoices={invoicesResult.data ?? []}
            errors={{
              subscription: subscriptionResult.error,
              invoices: invoicesResult.error,
            }}
            stripeCustomerId={agent.stripe_customer_id ?? null}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Account Info */}
          <Card title="Account Information">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px' }}>
              <InfoRow label="Full Name" value={agent.full_name} />
              <InfoRow label="Agency" value={agent.agency_name} />
              <InfoRow label="Email" value={agent.email || '—'} />
              <InfoRow label="Phone" value={agent.phone || '—'} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#6b7280' }}>Tier</span>
                <Badge label={String(agent.tier ?? 'starter')} variant={tierVariant} size="md" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#6b7280' }}>Status</span>
                <Badge label={String(agent.subscription_status ?? 'trialing')} variant={statusVariant} size="md" />
              </div>
              <InfoRow label="Template" value={template} />
              <InfoRow label="Custom Domain" value={agent.custom_domain || 'Not configured'} />
              <InfoRow label="Joined" value={new Date(agent.created_at).toLocaleDateString()} />
            </div>
          </Card>

          {/* Social & Bio */}
          <Card title="Profile & Social">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px' }}>
              <InfoRow label="Tagline" value={agent.tagline || '—'} />
              <InfoRow label="Bio" value={agent.bio ? (agent.bio.length > 100 ? agent.bio.slice(0, 100) + '...' : agent.bio) : '—'} />
              <InfoRow label="Instagram" value={agent.instagram_url || '—'} />
              <InfoRow label="Facebook" value={agent.facebook_url || '—'} />
              <InfoRow label="YouTube" value={agent.youtube_url || '—'} />
              <InfoRow label="TikTok" value={agent.tiktok_url || '—'} />
              <InfoRow label="Website" value={agent.website_url || '—'} />
            </div>
          </Card>
        </div>
      </PageContent>
    </>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ color: '#6b7280' }}>{label}</span>
      <span style={{ fontWeight: 500, color: '#111', textAlign: 'right', maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {value}
      </span>
    </div>
  )
}
