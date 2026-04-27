import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/service'

export const dynamic = 'force-dynamic'

type ConsultationRow = {
  id: string
  created_at: string
  tier: string | null
  first_name: string
  last_name: string
  email: string
  phone: string | null
  agency_name: string | null
  num_advisors: number | null
  timeline: string | null
  status: string
}

export default async function AdminConsultationsPage() {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('consultation_requests')
    .select(
      'id, created_at, tier, first_name, last_name, email, phone, agency_name, num_advisors, timeline, status',
    )
    .order('created_at', { ascending: false })

  const rows = (data ?? []) as ConsultationRow[]

  return (
    <div style={{ padding: '24px 32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#1a1a1a' }}>
          Consultation Requests
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280' }}>
          Leads from the Custom and Agency tier consultation form.
        </p>
      </div>

      {error && (
        <div style={{ padding: '14px 20px', marginBottom: '16px', background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '8px', fontSize: '13px', color: '#991B1B' }}>
          Failed to load: {error.message}
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f3f4f6', background: '#f9fafb' }}>
              <th style={th}>Name</th>
              <th style={th}>Agency / Contact</th>
              <th style={th}>Tier</th>
              <th style={th}>Advisors</th>
              <th style={th}>Timeline</th>
              <th style={th}>Status</th>
              <th style={th}>Date</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '48px', color: '#9ca3af', fontSize: '14px' }}>
                  No consultation requests yet.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={td}>
                  <div style={{ fontWeight: 500, color: '#1a1a1a', fontSize: '14px' }}>
                    {r.first_name} {r.last_name}
                  </div>
                </td>
                <td style={td}>
                  <div style={{ fontSize: '13px', color: '#374151' }}>{r.agency_name ?? '—'}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{r.email}</div>
                </td>
                <td style={td}>
                  <span style={tierChip(r.tier)}>{r.tier ?? '—'}</span>
                </td>
                <td style={{ ...td, fontSize: '13px', color: '#374151' }}>{r.num_advisors ?? '—'}</td>
                <td style={{ ...td, fontSize: '13px', color: '#374151' }}>{r.timeline ?? '—'}</td>
                <td style={td}>
                  <span style={statusChip(r.status)}>{r.status}</span>
                </td>
                <td style={{ ...td, color: '#6b7280', fontSize: '13px' }}>
                  {new Date(r.created_at).toLocaleDateString()}
                </td>
                <td style={td}>
                  <Link
                    href={`/admin/consultations/${r.id}`}
                    style={{ color: '#d97706', fontSize: '13px', textDecoration: 'none' }}
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const th: React.CSSProperties = {
  padding: '10px 16px',
  textAlign: 'left',
  fontSize: '11px',
  fontWeight: 600,
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}

const td: React.CSSProperties = { padding: '12px 16px', verticalAlign: 'middle' }

const chip = (bg: string, color: string): React.CSSProperties => ({
  display: 'inline-flex',
  padding: '3px 8px',
  borderRadius: '100px',
  fontSize: '12px',
  fontWeight: 500,
  background: bg,
  color,
  textTransform: 'capitalize',
})

function tierChip(tier: string | null): React.CSSProperties {
  switch (tier) {
    case 'starter': return chip('#ecfccb', '#3f6212')
    case 'growth':  return chip('#dbeafe', '#1e40af')
    case 'custom':  return chip('#fef3c7', '#92400e')
    case 'agency':  return chip('#f3e8ff', '#6b21a8')
    default:        return chip('#f3f4f6', '#374151')
  }
}

function statusChip(status: string): React.CSSProperties {
  switch (status) {
    case 'new':       return chip('#fef3c7', '#92400e')
    case 'contacted': return chip('#dbeafe', '#1e40af')
    case 'qualified': return chip('#e0e7ff', '#3730a3')
    case 'won':       return chip('#d1fae5', '#065f46')
    case 'lost':      return chip('#fee2e2', '#991b1b')
    default:          return chip('#f3f4f6', '#374151')
  }
}
