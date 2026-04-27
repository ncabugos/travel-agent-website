'use client'
import { useState, useEffect } from 'react'
import type { EditRequestStatus } from '@/types/database'

interface PastRequest {
  id: string
  subject: string
  status: EditRequestStatus
  admin_notes: string | null
  created_at: string
  updated_at: string
}

const STATUS_CHIP: Record<EditRequestStatus, { bg: string; color: string; label: string }> = {
  pending:     { bg: '#fef3c7', color: '#92400e', label: 'Pending' },
  in_progress: { bg: '#dbeafe', color: '#1e40af', label: 'In Progress' },
  completed:   { bg: '#d1fae5', color: '#065f46', label: 'Completed' },
  rejected:    { bg: '#fee2e2', color: '#991b1b', label: 'Rejected' },
}

export default function AgentRequestsPage() {
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [requests, setRequests] = useState<PastRequest[]>([])
  const [loadingRequests, setLoadingRequests] = useState(true)

  const loadRequests = () => {
    fetch('/api/agent-portal/requests')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setRequests(data) })
      .catch(() => {})
      .finally(() => setLoadingRequests(false))
  }

  useEffect(() => { loadRequests() }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaveMsg('')

    const res = await fetch('/api/agent-portal/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, description })
    })

    if (res.ok) {
      setSaveMsg('Request submitted successfully. We will review it shortly.')
      setSubject('')
      setDescription('')
      loadRequests()
    } else {
      setSaveMsg('Failed to submit request.')
    }
    setSaving(false)
  }

  return (
    <div style={{ padding: '32px 40px', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#111' }}>Request Site Modifications</h1>
        <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '14px' }}>
          Need new text, photos, or pages added to your site? Submit a request here.
        </p>
      </header>

      {/* Past requests */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '24px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
          <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#1a1a1a' }}>Your Requests</h2>
        </div>

        {loadingRequests ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>Loading...</div>
        ) : !requests.length ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>No requests yet. Submit your first one below.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #f3f4f6' }}>
                <th style={th}>Subject</th>
                <th style={th}>Status</th>
                <th style={th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(r => {
                const sc = STATUS_CHIP[r.status]
                return (
                  <tr key={r.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ ...td, color: '#374151', fontWeight: 500 }}>
                      {r.subject}
                      {r.admin_notes && (
                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', fontWeight: 400 }}>
                          Admin: {r.admin_notes}
                        </div>
                      )}
                    </td>
                    <td style={td}>
                      <span style={{ display: 'inline-flex', padding: '3px 8px', borderRadius: '100px', fontSize: '12px', fontWeight: 500, background: sc.bg, color: sc.color }}>{sc.label}</span>
                    </td>
                    <td style={{ ...td, color: '#6b7280', fontSize: '13px' }}>
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Submit form */}
      <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
        <h2 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 600, color: '#1a1a1a' }}>New Request</h2>

        {saveMsg ? (
          <div style={{ padding: '20px', background: saveMsg.includes('Failed') ? '#fef2f2' : '#f0fdf4', color: saveMsg.includes('Failed') ? '#991b1b' : '#166534', borderRadius: '8px', fontWeight: 500, fontSize: '14px' }}>
            {saveMsg}
            {!saveMsg.includes('Failed') && (
              <button
                onClick={() => setSaveMsg('')}
                style={{ display: 'block', marginTop: '12px', padding: '8px 16px', background: '#166534', color: '#fff', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '13px' }}
              >
                Submit another request
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>Subject line (Short and sweet)</label>
              <input required value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Update Homepage Hero Image" style={inputStyle} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>Detailed Description</label>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 10px' }}>Please provide exact text you want added or changed, and describe where it should go.</p>
              <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={6} placeholder="Please replace the second paragraph on my 'About Me' page with the following..." style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" disabled={saving} style={{ padding: '12px 24px', background: '#111', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer' }}>
                {saving ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

const th: React.CSSProperties = { padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }
const td: React.CSSProperties = { padding: '12px 16px', verticalAlign: 'middle', fontSize: '14px' }
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px',
  fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit'
}
