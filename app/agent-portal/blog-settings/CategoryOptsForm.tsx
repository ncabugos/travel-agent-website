'use client'
import { useState } from 'react'
import type { BlogCategory } from '@/types/index'

interface Props {
  // agentId is no longer read by the API route (it is derived from the
  // session) but we keep the prop so the existing server component can
  // still pass it; it is informational only.
  agentId: string
  categories: BlogCategory[]
  initialPreferences: string[]
}

export function CategoryOptsForm({ categories, initialPreferences }: Props) {
  const [selected, setSelected] = useState<string[]>(initialPreferences)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  const handleToggle = (id: string, checked: boolean) => {
    setSelected(prev => checked ? [...prev, id] : prev.filter(x => x !== id))
    setSaveMsg('')
  }

  const save = async () => {
    setSaving(true)
    setSaveMsg('')

    const res = await fetch('/api/agent-portal/preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoryIds: selected })
    })

    if (res.ok) setSaveMsg('Preferences saved ✓')
    else setSaveMsg('Failed to save preferences.')
    setSaving(false)
  }

  return (
    <>
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {categories.length === 0 && (
           <p style={{ color: '#6b7280', fontSize: '14px' }}>No content topics are currently available.</p>
        )}
        {categories.map(cat => (
          <label key={cat.id} style={{
            display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px',
            border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer',
            transition: 'border-color 0.2s', backgroundColor: selected.includes(cat.id) ? '#f0fdf4' : '#fff'
          }}
          onMouseEnter={e => { (e.currentTarget.style.borderColor = '#111') }}
          onMouseLeave={e => { (e.currentTarget.style.borderColor = '#e5e7eb') }}
          >
            <input 
              type="checkbox" 
              checked={selected.includes(cat.id)}
              onChange={e => handleToggle(cat.id, e.target.checked)}
              style={{ marginTop: '4px', width: '18px', height: '18px', accentColor: '#16a34a', cursor: 'pointer' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#111' }}>{cat.label}</div>
              {cat.description && (
                <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>{cat.description}</div>
              )}
            </div>
          </label>
        ))}
      </div>

      <div style={{ padding: '16px 24px', borderTop: '1px solid #e5e7eb', backgroundColor: '#f9fafb', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px' }}>
        {saveMsg && <span style={{ fontSize: '14px', color: saveMsg.includes('Failed') ? '#dc2626' : '#16a34a', fontWeight: 500 }}>{saveMsg}</span>}
        <button onClick={save} disabled={saving} style={{ padding: '10px 20px', background: '#111', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'background-color 0.2s' }}
          onMouseEnter={e => { if (!saving) (e.currentTarget.style.backgroundColor = '#333') }}
          onMouseLeave={e => { (e.currentTarget.style.backgroundColor = '#111') }}
        >
          {saving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </>
  )
}
