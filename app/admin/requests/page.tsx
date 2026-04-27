import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/service'

export const dynamic = 'force-dynamic'

export default async function AdminRequestsPage() {
  const supabase = createServiceClient()
  const { data: requests, error } = await supabase
    .from('edit_requests')
    .select(`
      id, subject, status, created_at,
      agents ( agency_name, full_name, email )
    `)
    .order('created_at', { ascending: false })

  return (
    <div style={{ padding: '24px 32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#1a1a1a' }}>Edit Requests</h1>
        <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280' }}>
          Site modification requests from your agents.
        </p>
      </div>

      <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f3f4f6', background: '#f9fafb' }}>
              <th style={th}>Agent</th>
              <th style={th}>Subject</th>
              <th style={th}>Status</th>
              <th style={th}>Date</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {!requests?.length && (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '48px', color: '#9ca3af', fontSize: '14px' }}>No requests yet.</td></tr>
            )}
            {requests?.map((req: any) => (
              <tr key={req.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={td}>
                  <div style={{ fontWeight: 500, color: '#1a1a1a', fontSize: '14px' }}>{req.agents?.agency_name}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{req.agents?.full_name}</div>
                </td>
                <td style={{ ...td, color: '#374151', fontSize: '14px' }}>{req.subject}</td>
                <td style={td}>
                  {req.status === 'pending' && <span style={chip('#fef3c7', '#92400e')}>Pending</span>}
                  {req.status === 'in_progress' && <span style={chip('#dbeafe', '#1e40af')}>In Progress</span>}
                  {req.status === 'completed' && <span style={chip('#d1fae5', '#065f46')}>Completed</span>}
                  {req.status === 'rejected' && <span style={chip('#fee2e2', '#991b1b')}>Rejected</span>}
                </td>
                <td style={{ ...td, color: '#6b7280', fontSize: '13px' }}>
                  {new Date(req.created_at).toLocaleDateString()}
                </td>
                <td style={td}>
                  <Link href={`/admin/requests/${req.id}`} style={{ color: '#d97706', fontSize: '13px', textDecoration: 'none' }}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const th: React.CSSProperties = { padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }
const td: React.CSSProperties = { padding: '12px 16px', verticalAlign: 'middle' }
const chip = (bg: string, color: string): React.CSSProperties => ({ display: 'inline-flex', padding: '3px 8px', borderRadius: '100px', fontSize: '12px', fontWeight: 500, background: bg, color })
