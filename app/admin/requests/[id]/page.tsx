import Link from 'next/link'
import { notFound } from 'next/navigation'
import { TopBar } from '@/components/dashboard/TopBar'
import { PageContent } from '@/components/dashboard/DashboardShell'
import { Card } from '@/components/dashboard/Card'
import { Badge } from '@/components/dashboard/Badge'
import { RequestStatusForm } from '@/components/admin/RequestStatusForm'
import { createServiceClient } from '@/lib/supabase/service'
import type { EditRequestStatus } from '@/types/database'

export const dynamic = 'force-dynamic'

interface RequestDetail {
  id: string
  agent_id: string
  subject: string
  description: string
  attachment_urls: string[] | null
  status: EditRequestStatus
  admin_notes: string | null
  created_at: string
  agents: { agency_name: string; full_name: string; email: string } | null
}

const STATUS_VARIANT: Record<EditRequestStatus, 'default' | 'success' | 'warning' | 'danger'> = {
  pending: 'warning',
  in_progress: 'default',
  completed: 'success',
  rejected: 'danger',
}

export default async function AdminRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('edit_requests')
    .select('id, agent_id, subject, description, attachment_urls, status, admin_notes, created_at, agents ( agency_name, full_name, email )')
    .eq('id', id)
    .maybeSingle()

  if (!data) notFound()
  const req = data as unknown as RequestDetail

  return (
    <>
      <TopBar
        title={req.subject}
        subtitle={`Submitted ${new Date(req.created_at).toLocaleString()}`}
        actions={
          <>
            <Badge label={req.status.replace('_', ' ')} variant={STATUS_VARIANT[req.status]} size="md" />
            <Link href="/admin/requests" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none' }}>
              ← All requests
            </Link>
          </>
        }
      />
      <PageContent maxWidth="860px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Card title="Submitted by">
            {req.agents ? (
              <>
                <div style={{ fontWeight: 600, color: '#111', fontSize: '15px' }}>
                  <Link href={`/admin/agents/${req.agent_id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {req.agents.agency_name}
                  </Link>
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>{req.agents.full_name} · {req.agents.email}</div>
              </>
            ) : (
              <span style={{ color: '#9ca3af', fontSize: '13px' }}>Agent record not found</span>
            )}
          </Card>

          <Card title="Description">
            <div style={{ fontSize: '14px', color: '#374151', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{req.description}</div>
            {req.attachment_urls && req.attachment_urls.length > 0 && (
              <ul style={{ margin: '16px 0 0', paddingLeft: '18px', fontSize: '13px' }}>
                {req.attachment_urls.map(url => (
                  <li key={url}><a href={url} target="_blank" rel="noreferrer" style={{ color: '#7c3aed' }}>{url}</a></li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Status and notes">
            <RequestStatusForm id={req.id} initialStatus={req.status} initialNotes={req.admin_notes ?? ''} />
          </Card>
        </div>
      </PageContent>
    </>
  )
}
