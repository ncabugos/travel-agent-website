'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import type { EditRequestStatus } from '@/types/database'

interface RequestDetail {
  id: string
  agent_id: string
  subject: string
  description: string
  attachment_urls: string[] | null
  status: EditRequestStatus
  admin_notes: string | null
  created_at: string
  updated_at: string
  agents: { agency_name: string; full_name: string; email: string } | null
}

const STATUS_OPTIONS: { value: EditRequestStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected', label: 'Rejected' },
]

const STATUS_COLORS: Record<EditRequestStatus, { bg: string; color: string }> = {
  pending:     { bg: '#fef3c7', color: '#92400e' },
  in_progress: { bg: '#dbeafe', color: '#1e40af' },
  completed:   { bg: '#d1fae5', color: '#065f46' },
  rejected:    { bg: '#fee2e2', color: '#991b1b' },
}

export default function AdminRequestDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [req, setReq] = useState<RequestDetail | null>(null)
  const [status, setStatus] = useState<EditRequestStatus>('pending')
  const [adminNotes, setAdminNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/admin/requests/${id}`)
      .then(r => r.json())
      .then(data => {
        setReq(data)
        setStatus(data.status)
        setAdminNotes(data.admin_notes ?? '')
      })
      .catch(() => setReq(null))
      .finally(() => setLoading(false))
  }, [id])

  const save = async () => {
    setSaving(true)
    setSaveMsg('')
    const res = await fetch(`/api/admin/requests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, admin_notes: adminNotes }),
    })
    setSaveMsg(res.ok ? 'Saved successfully.' : 'Failed to save.')
    setSaving(false)
  }

  if (loading) return <div style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>Loading...</div>
  if (!req) return <div style={{ padding: '48px', textAlign: 'center', color: '#991b1b' }}>Request not found.</div>

  const sc = STATUS_COLORS[req.status]

  return (
    <div style={{ padding: '24px 32px', maxWidth: '860px' }}>
      {/* Back link */}
      <button onClick={() => router.push('/admin/requests')} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '13px', marginBottom: '16px', padding: 0 }}>
        ← Back to requests
      </button>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#1a1a1a', flex: 1 }}>{req.subject}</h1>
        <span style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: '100px', fontSize: '12px', fontWeight: 500, background: sc.bg, color: sc.color }}>{req.status.replace('_', ' ')}</span>
      </div>

      {/* Agent info */}
      <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '16px 20px', marginBottom: '20px', border: '1px solid #f3f4f6' }}>
        <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Submitted by</div>
        <div style={{ fontWeight: 600, color: '#1a1a1a', fontSize: '15px' }}>{req.agents?.agency_name}</div>
        <div style={{ fontSize: '13px', color: '#6b7280' }}>{req.agents?.full_name} &middot; {req.agents?.email}</div>
        <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '6px' }}>
          {new Date(req.created_at).toLocaleString()}
        </div>
      </div>

      {/* Description */}
      <div style={{ background: '#fff', borderRadius: '10px', padding: '20px 24px', marginBottom: '20px', border: '1px solid #e5e7eb' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Description</div>
        <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{req.description}</div>
      </div>

      {/* Admin actions */}
      <div style={{ background: '#fff', borderRadius: '10px', padding: '20px 24px', border: '1px solid #e5e7eb' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Admin Actions</div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Status</label>
          <select value={status} onChange={e => setStatus(e.target.value as EditRequestStatus)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', background: '#fff' }}>
            {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Admin Notes</label>
          <textarea value={adminNotes} onChange={e => setAdminNotes(e.target.value)} rows={4} placeholder="Internal notes about this request..." style={{ width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
        </div>

        {saveMsg && (
          <div style={{ marginBottom: '12px', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, background: saveMsg.includes('Failed') ? '#fef2f2' : '#f0fdf4', color: saveMsg.includes('Failed') ? '#991b1b' : '#166534' }}>
            {saveMsg}
          </div>
        )}

        <button onClick={save} disabled={saving} style={{ padding: '10px 20px', background: '#111', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer' }}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
