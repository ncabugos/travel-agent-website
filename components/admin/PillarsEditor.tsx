'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { MarketingCategory } from '@/types/index'
import { buttonStyles } from '@/components/dashboard/FormField'

/**
 * Inline editor for the Insights content pillars. Rows come from the server
 * page; edits are saved per row through /api/admin/marketing-categories.
 */
export function PillarsEditor({ initialRows }: { initialRows: MarketingCategory[] }) {
  const router = useRouter()
  const [rows, setRows] = useState<MarketingCategory[]>(initialRows)
  const [savingId, setSavingId] = useState<string | null>(null)

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
    if (res.ok) router.refresh()
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button onClick={addRow} style={buttonStyles.primary}>+ New pillar</button>
      </div>
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
              <button onClick={() => saveRow(row)} disabled={savingId === row.id} style={buttonStyles.primary}>
                {savingId === row.id ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

const field: React.CSSProperties = { padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 13, outline: 'none', boxSizing: 'border-box', color: '#374151' }
