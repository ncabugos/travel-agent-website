'use client'
import { useState } from 'react'

interface Props {
  agentId: string
  currentDomain: string | null
}

export function CustomDomainField({ agentId, currentDomain }: Props) {
  const [domain, setDomain] = useState(currentDomain ?? '')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [editing, setEditing] = useState(false)

  const isDirty = domain !== (currentDomain ?? '')

  const save = async () => {
    setSaving(true)
    setMsg('')
    const res = await fetch(`/api/admin/agents/${agentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ custom_domain: domain.trim().toLowerCase() }),
    })

    if (res.ok) {
      setMsg('Saved! Remember to add this domain in Vercel.')
      setEditing(false)
    } else {
      const { error } = await res.json()
      setMsg(`Error: ${error}`)
    }
    setSaving(false)
  }

  if (!editing) {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#6b7280' }}>Custom Domain</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 500, color: currentDomain ? '#111' : '#9ca3af' }}>
            {domain || 'Not configured'}
          </span>
          <button
            onClick={() => setEditing(true)}
            style={{
              background: 'none', border: '1px solid #e5e7eb', borderRadius: '6px',
              padding: '3px 8px', fontSize: '11px', color: '#6b7280', cursor: 'pointer',
            }}
          >
            {currentDomain ? 'Edit' : 'Set'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ color: '#6b7280', fontSize: '14px' }}>Custom Domain</span>
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          value={domain}
          onChange={e => { setDomain(e.target.value); setMsg('') }}
          placeholder="example.com"
          style={{
            flex: 1, padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px',
            fontSize: '13px', fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box',
          }}
        />
        <button
          onClick={save}
          disabled={saving || !isDirty}
          style={{
            padding: '8px 14px', background: '#111', color: '#fff', border: 'none',
            borderRadius: '8px', fontSize: '12px', fontWeight: 600,
            cursor: saving || !isDirty ? 'not-allowed' : 'pointer',
            opacity: saving || !isDirty ? 0.5 : 1,
          }}
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button
          onClick={() => { setEditing(false); setDomain(currentDomain ?? ''); setMsg('') }}
          style={{
            padding: '8px 12px', background: 'none', border: '1px solid #e5e7eb',
            borderRadius: '8px', fontSize: '12px', color: '#6b7280', cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
      {msg && (
        <div style={{
          marginTop: '8px', fontSize: '12px', fontWeight: 500,
          color: msg.startsWith('Error') ? '#991b1b' : '#166534',
        }}>
          {msg}
        </div>
      )}
      <div style={{ marginTop: '8px', fontSize: '11px', color: '#9ca3af', lineHeight: '1.5' }}>
        Enter the bare domain (e.g. <code>edenforyourworld.com</code>). After saving, add the domain in Vercel and configure DNS.
      </div>
    </div>
  )
}
