import { TopBar } from '@/components/dashboard/TopBar'
import { StatCard } from '@/components/dashboard/StatCard'
import { Card } from '@/components/dashboard/Card'
import { Badge } from '@/components/dashboard/Badge'
import { PageContent } from '@/components/dashboard/DashboardShell'
import { createServiceClient } from '@/lib/supabase/service'
import { Icons } from '@/components/dashboard/Icons'
import { Bell, UserPlus, AlertCircle, XCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getStats() {
  const supabase = createServiceClient()

  const [
    { count: totalAgents },
    { count: activeAgents },
    { count: pendingRequests },
    { count: publishedPosts },
  ] = await Promise.all([
    supabase.from('agents').select('*', { count: 'exact', head: true }),
    supabase.from('agents').select('*', { count: 'exact', head: true }).eq('subscription_status', 'active'),
    supabase.from('edit_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('status', 'published'),
  ])

  return {
    totalAgents: totalAgents ?? 0,
    activeAgents: activeAgents ?? 0,
    pendingRequests: pendingRequests ?? 0,
    publishedPosts: publishedPosts ?? 0,
  }
}

async function getRecentAgents() {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('agents')
    .select('id, full_name, agency_name, tier, subscription_status, created_at')
    .order('created_at', { ascending: false })
    .limit(5)
  return data ?? []
}

async function getRecentRequests() {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('edit_requests')
    .select('id, subject, status, created_at, agent_id')
    .order('created_at', { ascending: false })
    .limit(5)
  return data ?? []
}

async function getNotifications() {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('admin_notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)
  return (data ?? []) as Record<string, any>[]
}

export default async function AdminDashboardPage() {
  const [stats, recentAgents, recentRequests, notifications] = await Promise.all([
    getStats(),
    getRecentAgents(),
    getRecentRequests(),
    getNotifications(),
  ])

  return (
    <>
      <TopBar title="Dashboard" subtitle="Overview of your platform" />
      <PageContent>
        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
          <StatCard title="Total Agents" value={stats.totalAgents} icon={Icons.users} />
          <StatCard title="Active Subscriptions" value={stats.activeAgents} icon={Icons.checkCircle} change="+0 this month" changeType="neutral" />
          <StatCard title="Pending Requests" value={stats.pendingRequests} icon={Icons.inbox} />
          <StatCard title="Published Posts" value={stats.publishedPosts} icon={Icons.file} />
        </div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <Card
            title="Notifications"
            subtitle={`${notifications.filter((n: any) => !n.is_read).length} unread`}
            style={{ marginBottom: '24px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {notifications.map((n: any) => {
                const icon = n.type === 'onboarding_complete' ? <UserPlus size={16} strokeWidth={1.5} style={{ color: '#16a34a', flexShrink: 0 }} />
                  : n.type === 'new_signup' ? <UserPlus size={16} strokeWidth={1.5} style={{ color: '#2563eb', flexShrink: 0 }} />
                  : n.type === 'subscription_canceled' ? <XCircle size={16} strokeWidth={1.5} style={{ color: '#dc2626', flexShrink: 0 }} />
                  : <Bell size={16} strokeWidth={1.5} style={{ color: '#6b7280', flexShrink: 0 }} />
                return (
                  <div
                    key={n.id}
                    style={{
                      display: 'flex', gap: '12px', alignItems: 'flex-start',
                      padding: '12px', borderRadius: '8px',
                      backgroundColor: n.is_read ? '#fff' : '#f0fdf4',
                      border: n.is_read ? '1px solid #f3f4f6' : '1px solid #bbf7d0',
                    }}
                  >
                    <div style={{ marginTop: '2px' }}>{icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: '#111' }}>{n.title}</div>
                      {n.body && (
                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px', lineHeight: 1.5 }}>{n.body}</div>
                      )}
                      <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                        {new Date(n.created_at).toLocaleString()}
                      </div>
                    </div>
                    {!n.is_read && (
                      <div style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        backgroundColor: '#16a34a', flexShrink: 0, marginTop: '6px',
                      }} />
                    )}
                  </div>
                )
              })}
            </div>
          </Card>
        )}

        {/* 2-column: Recent Agents + Recent Requests */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          
          {/* Recent Agents */}
          <Card title="Recent Agents" subtitle="Newest signups">
            {recentAgents.length === 0 ? (
              <p style={{ color: '#9ca3af', fontSize: '13px' }}>No agents yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recentAgents.map((agent: Record<string, unknown>) => (
                  <a
                    key={String(agent.id)}
                    href={`/admin/agents/${agent.id}`}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px', borderRadius: '8px', border: '1px solid #f3f4f6',
                      textDecoration: 'none', color: '#111', transition: 'background-color 0.1s',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 500 }}>{String(agent.full_name)}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{String(agent.agency_name)}</div>
                    </div>
                    <Badge
                      label={String(agent.tier ?? 'starter')}
                      variant={agent.tier === 'custom' ? 'info' : agent.tier === 'growth' ? 'success' : 'default'}
                    />
                  </a>
                ))}
              </div>
            )}
          </Card>

          {/* Recent Edit Requests */}
          <Card title="Recent Edit Requests" subtitle="Latest from agents">
            {recentRequests.length === 0 ? (
              <p style={{ color: '#9ca3af', fontSize: '13px' }}>No requests yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recentRequests.map((req: Record<string, unknown>) => {
                  const statusVariant = req.status === 'completed' ? 'success'
                    : req.status === 'in_progress' ? 'warning'
                    : req.status === 'rejected' ? 'danger'
                    : 'default'
                  return (
                    <div
                      key={String(req.id)}
                      style={{
                        padding: '12px', borderRadius: '8px', border: '1px solid #f3f4f6',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>{String(req.subject)}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          {new Date(String(req.created_at)).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge label={String(req.status)} variant={statusVariant} />
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        </div>
      </PageContent>
    </>
  )
}
