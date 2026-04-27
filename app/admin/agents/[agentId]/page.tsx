import { notFound } from 'next/navigation'
import Link from 'next/link'
import { TopBar } from '@/components/dashboard/TopBar'
import { StatCard } from '@/components/dashboard/StatCard'
import { PageContent } from '@/components/dashboard/DashboardShell'
import { getAgentById } from '@/lib/supabase/admin'
import { createServiceClient } from '@/lib/supabase/service'
import { Icons } from '@/components/dashboard/Icons'
import { AgentSubscriptionPanel } from '@/components/admin/AgentSubscriptionPanel'
import { CustomDomainField } from '@/components/admin/CustomDomainField'
import { AgentProfileEditor } from '@/components/admin/AgentProfileEditor'
import { AgentSelectionPanel } from '@/components/admin/AgentSelectionPanel'
import { loadSubscription, loadInvoices } from '@/lib/stripe-queries'
import {
  getHotelPrograms,
  getAgentHotelProgramSelections,
} from '@/lib/hotel-programs'
import {
  getAllCategories,
  getAgentCategoryPreferences,
} from '@/lib/blog-categories'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ agentId: string }>
}

export default async function AdminAgentDetailPage({ params }: PageProps) {
  const { agentId } = await params
  const agentData = await getAgentById(agentId)
  if (!agentData) return notFound()
  const agent = agentData

  const supabase = createServiceClient()
  const [
    { count: postCount },
    { count: requestCount },
    subscriptionResult,
    invoicesResult,
    allPrograms,
    programSelections,
    allCategories,
    selectedCategoryIds,
  ] = await Promise.all([
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('agent_id', agentId),
    supabase.from('edit_requests').select('*', { count: 'exact', head: true }).eq('agent_id', agentId),
    loadSubscription(agent.stripe_subscription_id),
    loadInvoices(agent.stripe_customer_id),
    getHotelPrograms(),
    getAgentHotelProgramSelections(agentId),
    getAllCategories(),
    getAgentCategoryPreferences(agentId),
  ])

  const template = agent.template || 'frontend'
  const siteUrl = `/${template}/${agentId}`

  const selectedProgramIds = programSelections
    .filter((s) => s.is_enabled)
    .map((s) => s.program_id)

  return (
    <>
      <TopBar
        title={agent.agency_name || 'Agent Detail'}
        subtitle={agent.full_name ?? undefined}
        actions={
          <div style={{ display: 'flex', gap: 10 }}>
            <Link
              href={`/admin/blog?agent_id=${agentId}`}
              style={{
                padding: '10px 18px',
                background: '#fff',
                color: '#111',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Manage Blog
            </Link>
            <Link
              href={siteUrl}
              target="_blank"
              style={{
                padding: '10px 20px',
                backgroundColor: '#111',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              View Website ↗
            </Link>
          </div>
        }
      />
      <PageContent>
        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 24 }}>
          <Link
            href={`/admin/blog?agent_id=${agentId}`}
            style={{ textDecoration: 'none', display: 'block' }}
          >
            <StatCard title="Blog Posts" value={postCount ?? 0} icon={Icons.file} />
          </Link>
          <StatCard title="Edit Requests" value={requestCount ?? 0} icon={Icons.inbox} />
          <StatCard
            title="Subscription"
            value={
              String(agent.tier ?? 'Starter').charAt(0).toUpperCase() +
              String(agent.tier ?? 'starter').slice(1)
            }
            icon={Icons.creditCard}
          />
        </div>

        {/* Subscription panel */}
        <div style={{ marginBottom: 24 }}>
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

        {/* Custom domain (special — its own flow with DNS hint) */}
        <div
          style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            padding: '16px 20px',
            marginBottom: 24,
          }}
        >
          <CustomDomainField
            agentId={agentId}
            currentDomain={agent.custom_domain ?? null}
          />
        </div>

        {/* Editable profile + socials + specialties */}
        <div style={{ marginBottom: 24 }}>
          <AgentProfileEditor
            agent={{
              id: agent.id,
              full_name: agent.full_name ?? null,
              agency_name: agent.agency_name ?? null,
              email: agent.email ?? null,
              phone: agent.phone ?? null,
              tagline: agent.tagline ?? null,
              bio: agent.bio ?? null,
              avatar_url: agent.avatar_url ?? null,
              instagram_url: agent.instagram_url ?? null,
              facebook_url: agent.facebook_url ?? null,
              youtube_url: agent.youtube_url ?? null,
              tiktok_url: agent.tiktok_url ?? null,
              website_url: agent.website_url ?? null,
              tier: (agent.tier as 'starter' | 'growth' | 'custom' | 'agency' | null) ?? null,
              subscription_status: agent.subscription_status ?? null,
              template: agent.template ?? null,
              role: (agent.role as 'super_admin' | 'admin' | 'agent' | null) ?? null,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              travel_specialties: (agent as any).travel_specialties ?? null,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              destination_specialties: (agent as any).destination_specialties ?? null,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              preferred_suppliers: (agent as any).preferred_suppliers ?? null,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              travel_types: (agent as any).travel_types ?? null,
            }}
          />
        </div>

        {/* Hotel Programs curation */}
        <div style={{ marginBottom: 24 }}>
          <AgentSelectionPanel
            title="Hotel Programs on this agent's site"
            description="Select which exclusive hotel programs appear on this agent's public website (Hotel Programs section + /experiences page). These are the invite-only agency programs the agent is authorized to promote — not the individual hotel properties."
            emptyStateHint="No programs selected — the site is showing the full global catalogue by default."
            allItems={allPrograms.map((p) => ({
              id: p.id,
              label: p.name,
              sublabel: p.tagline ?? p.description?.slice(0, 120) ?? null,
            }))}
            initiallySelected={selectedProgramIds}
            saveEndpoint={`/api/admin/agents/${agentId}/hotel-programs`}
            payloadKey="programIds"
          />
        </div>

        {/* Blog categories curation */}
        <div style={{ marginBottom: 24 }}>
          <AgentSelectionPanel
            title="Blog categories on this agent's site"
            description="Select which content topics get broadcasted to this agent's journal. The agent can also manage these themselves from their portal — this override replaces their current selection."
            emptyStateHint="No categories selected — the agent's journal will show nothing from the broadcast feed. Select at least one to enable syndication."
            allItems={allCategories
              .filter((c) => c.is_active)
              .map((c) => ({
                id: c.id,
                label: c.label,
                sublabel: c.description ?? null,
              }))}
            initiallySelected={selectedCategoryIds}
            saveEndpoint={`/api/admin/agents/${agentId}/blog-categories`}
            payloadKey="categoryIds"
          />
        </div>
      </PageContent>
    </>
  )
}
