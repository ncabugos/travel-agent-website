'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TopBar } from '@/components/dashboard/TopBar'
import { DataTable, Column } from '@/components/dashboard/DataTable'
import { Badge } from '@/components/dashboard/Badge'
import { PageContent } from '@/components/dashboard/DashboardShell'
import { FormField, inputStyles, buttonStyles } from '@/components/dashboard/FormField'
import { Modal } from '@/components/dashboard/Modal'
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

async function fetchAgents(): Promise<Agent[]> {
  const res = await fetch('/api/admin/agents')
  const data = await res.json()
  return (Array.isArray(data) ? data : []) as Agent[]
}

const emptyInvite = { full_name: '', agency_name: '', email: '', tier: 'starter', template: 'frontend' }

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [showInvite, setShowInvite] = useState(false)
  const [invite, setInvite] = useState(emptyInvite)
  const [inviting, setInviting] = useState(false)
  const [inviteError, setInviteError] = useState('')
  const [notice, setNotice] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchAgents().then(rows => { setAgents(rows); setLoading(false) })
  }, [])

  function closeInvite() {
    setShowInvite(false)
    setInviteError('')
  }

  async function sendInvite(e: React.FormEvent) {
    e.preventDefault()
    setInviting(true)
    setInviteError('')
    const res = await fetch('/api/admin/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invite),
    })
    const data = await res.json().catch(() => ({}))
    setInviting(false)
    if (!res.ok) {
      setInviteError(data.error ?? 'Could not send the invitation.')
      return
    }
    setNotice(`Invitation sent to ${invite.email}.`)
    setInvite(emptyInvite)
    closeInvite()
    fetchAgents().then(setAgents)
  }

  return (
    <>
      <TopBar
        title="Agents"
        subtitle={`${agents.length} registered agent${agents.length !== 1 ? 's' : ''}`}
        actions={
          <button
            style={buttonStyles.primary}
            onClick={() => setShowInvite(true)}
          >
            + Add Agent
          </button>
        }
      />
      <PageContent>
        {notice && (
          <div style={{
            marginBottom: '16px', padding: '12px 16px', borderRadius: '8px',
            backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534',
            fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span>{notice}</span>
            <button onClick={() => setNotice('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#166534' }}>✕</button>
          </div>
        )}
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

      <Modal open={showInvite} onClose={closeInvite} title="Invite an agent">
        <form onSubmit={sendInvite}>
          <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#6b7280', lineHeight: 1.5 }}>
            The agent receives an email invitation. Accepting it signs them in and opens the onboarding wizard.
          </p>
          <FormField label="Full name" htmlFor="invite-name" required>
            <input
              id="invite-name" type="text" required autoFocus
              value={invite.full_name}
              onChange={e => setInvite({ ...invite, full_name: e.target.value })}
              style={inputStyles}
            />
          </FormField>
          <FormField label="Agency name" htmlFor="invite-agency" required>
            <input
              id="invite-agency" type="text" required
              value={invite.agency_name}
              onChange={e => setInvite({ ...invite, agency_name: e.target.value })}
              style={inputStyles}
            />
          </FormField>
          <FormField label="Email" htmlFor="invite-email" required>
            <input
              id="invite-email" type="email" required
              value={invite.email}
              onChange={e => setInvite({ ...invite, email: e.target.value })}
              style={inputStyles}
            />
          </FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FormField label="Tier" htmlFor="invite-tier">
              <select
                id="invite-tier" value={invite.tier}
                onChange={e => setInvite({ ...invite, tier: e.target.value })}
                style={inputStyles}
              >
                <option value="starter">Starter</option>
                <option value="growth">Growth</option>
                <option value="custom">Custom</option>
              </select>
            </FormField>
            <FormField label="Template" htmlFor="invite-template">
              <select
                id="invite-template" value={invite.template}
                onChange={e => setInvite({ ...invite, template: e.target.value })}
                style={inputStyles}
              >
                <option value="frontend">frontend</option>
                <option value="t2">t2</option>
                <option value="t3">t3</option>
                <option value="t4">t4</option>
              </select>
            </FormField>
          </div>
          {inviteError && (
            <div style={{
              marginBottom: '16px', padding: '10px 12px', borderRadius: '8px',
              backgroundColor: '#fef2f2', border: '1px solid #fee2e2', color: '#991b1b', fontSize: '13px',
            }}>
              {inviteError}
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={closeInvite} style={buttonStyles.secondary}>Cancel</button>
            <button type="submit" disabled={inviting} style={{ ...buttonStyles.primary, opacity: inviting ? 0.6 : 1 }}>
              {inviting ? 'Sending…' : 'Send invitation'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
