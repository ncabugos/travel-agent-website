import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { TopBar } from '@/components/dashboard/TopBar'
import { StatCard } from '@/components/dashboard/StatCard'
import { Card } from '@/components/dashboard/Card'
import { PageContent } from '@/components/dashboard/DashboardShell'
import { Badge } from '@/components/dashboard/Badge'
import { Icons } from '@/components/dashboard/Icons'

export const dynamic = 'force-dynamic'

export default async function AgentDashboardPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect('/agent-portal/login')

  const { data: agentRaw } = await supabase
    .from('agents')
    .select('*')
    .eq('email', session.user.email ?? '')
    .single()

  const agent = agentRaw as Record<string, any> | null

  if (!agent) {
    return (
      <>
        <TopBar title="Dashboard" subtitle="Agent profile not found" />
        <PageContent>
          <Card>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>
              Your email ({session.user.email}) is not linked to an agent account.
              Contact your administrator for access.
            </p>
          </Card>
        </PageContent>
      </>
    )
  }

  // Redirect to onboarding if not yet completed
  if (!agent.onboarding_completed_at) {
    redirect('/agent-portal/onboarding')
  }

  // Get agent stats
  const [
    { count: postCount },
    { count: requestCount },
    { count: categoryCount },
  ] = await Promise.all([
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('agent_id', agent.id as string),
    supabase.from('edit_requests').select('*', { count: 'exact', head: true }).eq('agent_id', agent.id as string).eq('status', 'pending'),
    supabase.from('agent_blog_preferences').select('*', { count: 'exact', head: true }).eq('agent_id', agent.id as string).eq('is_enabled', true),
  ])

  const tierLabel = String(agent.tier ?? 'starter').charAt(0).toUpperCase() + String(agent.tier ?? 'starter').slice(1)
  const tierVariant = agent.tier === 'custom' ? 'info' : agent.tier === 'growth' ? 'success' : 'default' as const
  const template = agent.template || 'frontend'

  return (
    <>
      <TopBar
        title={`Welcome back, ${agent.full_name.split(' ')[0]}`}
        subtitle={agent.agency_name}
      />
      <PageContent>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
          <StatCard title="My Posts" value={postCount ?? 0} icon={Icons.file} />
          <StatCard title="Pending Requests" value={requestCount ?? 0} icon={Icons.inbox} />
          <StatCard title="Active Categories" value={categoryCount ?? 0} icon={Icons.folder} />
          <StatCard title="My Plan" value={tierLabel} icon={Icons.creditCard} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Quick Actions */}
          <Card title="Quick Actions">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <QuickLink href={`/${template}/${agent.id}`} label="View My Website" external />
              <QuickLink href="/agent-portal/blog" label="Write a Journal Post" />
              <QuickLink href="/agent-portal/blog-settings" label="Manage Blog Topics" />
              <QuickLink href="/agent-portal/requests" label="Submit Edit Request" />
              <QuickLink href="/agent-portal/profile" label="Update My Profile" />
            </div>
          </Card>

          {/* Account Summary */}
          <Card title="Account Summary">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Agency</span>
                <span style={{ fontWeight: 500 }}>{agent.agency_name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#6b7280' }}>Subscription</span>
                <Badge label={tierLabel} variant={tierVariant} size="md" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Template</span>
                <span style={{ fontWeight: 500 }}>{template}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Custom Domain</span>
                <span style={{ fontWeight: 500 }}>{agent.custom_domain || 'Not configured'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Email</span>
                <span style={{ fontWeight: 500 }}>{agent.email}</span>
              </div>
            </div>
          </Card>
        </div>
      </PageContent>
    </>
  )
}

function QuickLink({ href, label, external }: { href: string; label: string; external?: boolean }) {
  return (
    <Link
      href={href}
      target={external ? '_blank' : undefined}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', background: '#fafafa', borderRadius: '8px',
        color: '#111', textDecoration: 'none', fontSize: '14px', fontWeight: 500,
        border: '1px solid #f3f4f6', transition: 'all 0.15s',
      }}
    >
      <span>{label}</span>
      <span style={{ color: '#9ca3af', fontSize: '16px' }}>{external ? '↗' : '→'}</span>
    </Link>
  )
}
