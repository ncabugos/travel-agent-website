'use client'

import { useState } from 'react'

interface Item {
  id: string
  label: string
  sublabel?: string | null
}

interface Props {
  title: string
  description?: string
  emptyStateHint?: string
  allItems: Item[]
  initiallySelected: string[]
  saveEndpoint: string
  /** key used in the POST body, e.g. "programIds" or "categoryIds" */
  payloadKey: string
}

/**
 * Generic multi-select panel for admin-scoped agent curations
 * (Hotel Programs, Blog Categories). Renders a checkbox list and POSTs
 * an array of selected IDs under `payloadKey` when saved.
 *
 * When the selection is empty, the agent's site falls back to the global
 * default set — the panel explains that inline.
 */
export function AgentSelectionPanel({
  title,
  description,
  emptyStateHint,
  allItems,
  initiallySelected,
  saveEndpoint,
  payloadKey,
}: Props) {
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
    setSelected(new Set(allItems.map((i) => i.id)))
    setMsg(null)
  }
  const clearAll = () => {
    setSelected(new Set())
    setMsg(null)
  }

  const save = async () => {
    setSaving(true)
    setMsg(null)
    const ids = allItems.filter((i) => selected.has(i.id)).map((i) => i.id)
    const res = await fetch(saveEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [payloadKey]: ids }),
    })
    if (res.ok) setMsg({ kind: 'ok', text: `Saved — ${ids.length} selected.` })
    else {
      const { error } = await res.json().catch(() => ({ error: 'Save failed' }))
      setMsg({ kind: 'err', text: error ?? 'Save failed' })
    }
    setSaving(false)
  }

  const count = selected.size

  return (
    <section
      style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: 20,
      }}
    >
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 16,
          marginBottom: 16,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#111' }}>
            {title}{' '}
            <span style={{ color: '#6b7280', fontWeight: 400 }}>
              ({count} of {allItems.length})
            </span>
          </h3>
          {description && (
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280', maxWidth: 680 }}>
              {description}
            </p>
          )}
          {count === 0 && emptyStateHint && (
            <p
              style={{
                margin: '6px 0 0',
                fontSize: 12,
                color: '#9a6a00',
                background: '#fefce8',
                border: '1px solid #fde68a',
                borderRadius: 6,
                padding: '6px 10px',
                display: 'inline-block',
              }}
            >
              {emptyStateHint}
            </p>
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
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 10,
          marginBottom: 16,
        }}
      >
        {allItems.length === 0 && (
          <p style={{ fontSize: 13, color: '#6b7280' }}>No items available.</p>
        )}
        {allItems.map((item) => {
          const checked = selected.has(item.id)
          return (
            <label
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                padding: 10,
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
                onChange={() => toggle(item.id)}
                style={{ marginTop: 2, accentColor: '#111' }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>{item.label}</div>
                {item.sublabel && (
                  <div
                    style={{
                      fontSize: 12,
                      color: '#6b7280',
                      marginTop: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {item.sublabel}
                  </div>
                )}
              </div>
            </label>
          )
        })}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 16,
          paddingTop: 12,
          borderTop: '1px solid #f3f4f6',
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
            padding: '9px 20px',
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
    </section>
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
