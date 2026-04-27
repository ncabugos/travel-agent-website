'use client'

import { useState } from 'react'

interface Program {
  id: string
  name: string
  tagline: string | null
  description: string | null
  category: string | null
}

interface Props {
  allPrograms: Program[]
  initiallySelected: string[]
}

/**
 * Agent self-serve Hotel Programs curation. Saves to
 * /api/agent-portal/hotel-programs which derives agent_id from the session
 * (never the request body) and replaces the set in one transaction.
 *
 * When no programs are selected, the agent's public site falls back to the
 * full global active catalogue — the empty state explains this inline so
 * agents don't assume their site is broken.
 */
export function HotelProgramsForm({ allPrograms, initiallySelected }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set(initiallySelected))
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    setMsg(null)
  }

  const selectAll = () => {
    setSelected(new Set(allPrograms.map((p) => p.id)))
    setMsg(null)
  }
  const clearAll = () => {
    setSelected(new Set())
    setMsg(null)
  }

  const save = async () => {
    setSaving(true)
    setMsg(null)
    const programIds = allPrograms.filter((p) => selected.has(p.id)).map((p) => p.id)
    const res = await fetch('/api/agent-portal/hotel-programs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ programIds }),
    })
    if (res.ok) {
      setMsg({ kind: 'ok', text: `Saved — ${programIds.length} program${programIds.length === 1 ? '' : 's'} on your site.` })
    } else {
      const { error } = await res.json().catch(() => ({ error: 'Save failed' }))
      setMsg({ kind: 'err', text: error ?? 'Save failed' })
    }
    setSaving(false)
  }

  const count = selected.size

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid #f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ fontSize: 13, color: '#6b7280' }}>
          <strong style={{ color: '#111' }}>{count}</strong> of {allPrograms.length} selected
          {count === 0 && (
            <span
              style={{
                marginLeft: 10,
                fontSize: 12,
                color: '#9a6a00',
                background: '#fefce8',
                border: '1px solid #fde68a',
                borderRadius: 6,
                padding: '3px 8px',
              }}
            >
              Your site is currently showing the full global catalogue.
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={selectAll} style={ghostBtn}>
            Select all
          </button>
          <button onClick={clearAll} style={ghostBtn}>
            Clear
          </button>
        </div>
      </div>

      <div
        style={{
          padding: 20,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 12,
        }}
      >
        {allPrograms.length === 0 && (
          <p style={{ fontSize: 13, color: '#6b7280' }}>No hotel programs available.</p>
        )}
        {allPrograms.map((p) => {
          const checked = selected.has(p.id)
          return (
            <label
              key={p.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: 14,
                border: `1px solid ${checked ? '#111' : '#e5e7eb'}`,
                borderRadius: 8,
                cursor: 'pointer',
                background: checked ? '#fafafa' : '#fff',
                transition: 'border-color 160ms ease, background 160ms ease',
              }}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(p.id)}
                style={{ marginTop: 3, accentColor: '#111', width: 16, height: 16 }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>{p.name}</div>
                {(p.tagline || p.description) && (
                  <div
                    style={{
                      fontSize: 12,
                      color: '#6b7280',
                      marginTop: 4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {p.tagline ?? p.description?.slice(0, 140)}
                  </div>
                )}
              </div>
            </label>
          )
        })}
      </div>

      <div
        style={{
          padding: '14px 20px',
          borderTop: '1px solid #e5e7eb',
          background: '#f9fafb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 16,
        }}
      >
        {msg && (
          <span
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: msg.kind === 'ok' ? '#16a34a' : '#dc2626',
            }}
          >
            {msg.text}
          </span>
        )}
        <button
          onClick={save}
          disabled={saving}
          style={{
            padding: '10px 22px',
            background: '#111',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: saving ? 'wait' : 'pointer',
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? 'Saving…' : 'Save Selection'}
        </button>
      </div>
    </div>
  )
}

const ghostBtn: React.CSSProperties = {
  padding: '6px 12px',
  background: '#fff',
  color: '#111',
  border: '1px solid #e5e7eb',
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 500,
  cursor: 'pointer',
}
