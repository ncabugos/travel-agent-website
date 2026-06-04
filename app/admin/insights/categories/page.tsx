'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { MarketingCategory } from '@/types/index'

export default function InsightsCategoriesPage() {
  const [rows, setRows] = useState<MarketingCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)

  const load = () => {
    fetch('/api/admin/marketing-categories')
      .then(r => r.json())
      .then((d) => setRows(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const update = (id: string, patch: Partial<MarketingCategory>) =>
    setRows(rs => rs.map(r => (r.id === id ? { ...r, ...patch } : r)))

  async function saveRow(row: MarketingCategory) {
    setSavingId(row.id)
    await fetch(`/api/admin/marketing-categories/${row.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row),
    })
    setSavingId(null)
  }

  async function addRow() {
    const label = prompt('New pillar label:')
    if (!label) return
    const slug = label.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
    const res = await fetch('/api/admin/marketing-categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label, slug, sort_order: rows.length + 1 }),
    })
    if (res.ok) load()
  }

  return (
    <div style={{ padding: '24px 32px', maxWidth: 920, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/admin/insights" style={{ color: '#6b7280', textDecoration: 'none', fontSize: 13 }}>← Insights</Link>
          <span style={{ color: '#d1d5db' }}>/</span>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#1a1a1a' }}>Content pillars</h1>
        </div>
        <button onClick={addRow} style={{ padding: '8px 16px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>+ New pillar</button>
      </div>

      <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 16px' }}>
        The five content pillars from the 90-day strategy. Posts map to one pillar each; pillars become the Insights category filters and archive pages.
      </p>

      {loading ? (
        <p style={{ color: '#9ca3af', fontSize: 14 }}>Loading…</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {rows.map(row => (
            <div key={row.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 16 }}>
              <div style={{ display: 'flex', gap: 12, marginBottom: 10, alignItems: 'center' }}>
                {row.pillar_key && <span style={{ fontSize: 11, fontWeight: 700, color: '#B49A5A', background: 'rgba(180,154,90,0.1)', padding: '3px 8px', borderRadius: 4 }}>{row.pillar_key}</span>}
                <input value={row.label} onChange={e => update(row.id, { label: e.target.value })} style={{ ...field, fontWeight: 600, flex: 1 }} />
                <input value={row.slug} onChange={e => update(row.id, { slug: e.target.value })} style={{ ...field, fontFamily: 'monospace', fontSize: 12, width: 200 }} />
              </div>
              <textarea value={row.description ?? ''} onChange={e => update(row.id, { description: e.target.value })} rows={2} placeholder="Description…" style={{ ...field, resize: 'vertical', marginBottom: 10 }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#374151' }}>
                    <span>Sort</span>
                    <input type="number" value={row.sort_order} onChange={e => update(row.id, { sort_order: Number(e.target.value) })} style={{ ...field, width: 70 }} />
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#374151', cursor: 'pointer' }}>
                    <input type="checkbox" checked={row.is_active} onChange={e => update(row.id, { is_active: e.target.checked })} /> Active
                  </label>
                </div>
                <button onClick={() => saveRow(row)} disabled={savingId === row.id} style={{ padding: '7px 16px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  {savingId === row.id ? 'Saving…' : 'Save'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const field: React.CSSProperties = { padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 13, outline: 'none', boxSizing: 'border-box', color: '#374151' }
