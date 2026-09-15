'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { EditRequestStatus } from '@/types/database'
import { FormField, inputStyles, buttonStyles } from '@/components/dashboard/FormField'

const STATUS_OPTIONS: { value: EditRequestStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected', label: 'Rejected' },
]

export function RequestStatusForm({
  id, initialStatus, initialNotes,
}: { id: string; initialStatus: EditRequestStatus; initialNotes: string }) {
  const router = useRouter()
  const [status, setStatus] = useState<EditRequestStatus>(initialStatus)
  const [notes, setNotes] = useState(initialNotes)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    const res = await fetch(`/api/admin/requests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, admin_notes: notes }),
    })
    setSaving(false)
    setMessage(res.ok ? { ok: true, text: 'Saved.' } : { ok: false, text: 'Could not save.' })
    if (res.ok) router.refresh()
  }

  return (
    <form onSubmit={save}>
      <FormField label="Status" htmlFor="request-status">
        <select id="request-status" value={status} onChange={e => setStatus(e.target.value as EditRequestStatus)} style={inputStyles}>
          {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </FormField>
      <FormField label="Internal notes" htmlFor="request-notes">
        <textarea
          id="request-notes" rows={4} value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Notes about this request. Not shown to the agent."
          style={{ ...inputStyles, resize: 'vertical', fontFamily: 'inherit' }}
        />
      </FormField>
      {message && (
        <div style={{
          marginBottom: '16px', padding: '10px 12px', borderRadius: '8px', fontSize: '13px',
          backgroundColor: message.ok ? '#f0fdf4' : '#fef2f2',
          border: `1px solid ${message.ok ? '#bbf7d0' : '#fee2e2'}`,
          color: message.ok ? '#166534' : '#991b1b',
        }}>
          {message.text}
        </div>
      )}
      <button type="submit" disabled={saving} style={{ ...buttonStyles.primary, opacity: saving ? 0.6 : 1 }}>
        {saving ? 'Saving…' : 'Save changes'}
      </button>
    </form>
  )
}
