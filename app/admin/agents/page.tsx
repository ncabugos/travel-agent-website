'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TopBar } from '@/components/dashboard/TopBar'
import { DataTable, Column } from '@/components/dashboard/DataTable'
import { Badge } from '@/components/dashboard/Badge'
import { PageContent } from '@/components/dashboard/DashboardShell'
import { buttonStyles } from '@/components/dashboard/FormField'
// Agents fetched via API route (service client) to bypass RLS

interface Agent {
  id: string
  full_name: string
  agency_name: string
  email: string | null
  tier: string | null
  subscription_status: string | null
  template: string | null
  custom_domain: string | null
  role: string
  created_at: string
  [key: string]: unknown
}

const tierBadge = (tier: string | null) => {
  switch (tier) {
    case 'custom': return <Badge label="Custom" variant="info" />
    case 'growth': return <Badge label="Growth" variant="success" />
    default: return <Badge label="Starter" variant="default" />
  }
}

const statusBadge = (status: string | null) => {
  switch (status) {
    case 'active': return <Badge label="Active" variant="success" />
    case 'past_due': return <Badge label="Past Due" variant="warning" />
    case 'canceled': return <Badge label="Canceled" variant="danger" />
    default: return <Badge label="Trialing" variant="info" />
  }
}

const columns: Column<Agent>[] = [
  { key: 'full_name', header: 'Name', sortable: true },
  { key: 'agency_name', header: 'Agency', sortable: true },
  { key: 'email', header: 'Email', sortable: true },
  {
    key: 'tier', header: 'Tier', sortable: true,
    render: (row) => tierBadge(row.tier),
  },
  {
    key: 'subscription_status', header: 'Status', sortable: true,
    render: (row) => statusBadge(row.subscription_status),
  },
  { key: 'template', header: 'Template', sortable: true },
  {
    key: 'created_at', header: 'Joined', sortable: true,
    render: (row) => (
      <span style={{ color: '#6b7280', fontSize: '12px' }}>
        {new Date(row.created_at).toLocaleDateString()}
      </span>
    ),
  },
]

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/admin/agents')
      const data = await res.json()
      setAgents((data ?? []) as Agent[])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <>
      <TopBar
        title="Agents"
        subtitle={`${agents.length} registered agent${agents.length !== 1 ? 's' : ''}`}
        actions={
          <button
            style={buttonStyles.primary}
            onClick={() => { /* Phase 2: Add agent modal */ }}
          >
            + Add Agent
          </button>
        }
      />
      <PageContent>
        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: '#9ca3af' }}>
            Loading agents...
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={agents}
            keyField="id"
            searchPlaceholder="Search agents..."
            onRowClick={(agent) => router.push(`/admin/agents/${agent.id}`)}
            emptyMessage="No agents found. Add your first agent to get started."
          />
        )}
      </PageContent>
    </>
  )
}
