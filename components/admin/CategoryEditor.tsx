'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { BlogCategory } from '@/types/index'

interface Props {
  category?: BlogCategory | null
  isNew?: boolean
}

export function CategoryEditor({ category, isNew }: Props) {
  const router = useRouter()
  const [label, setLabel] = useState(category?.label ?? '')
  const [slug, setSlug] = useState(category?.slug ?? '')
  const [description, setDescription] = useState(category?.description ?? '')
  const [sortOrder, setSortOrder] = useState(category?.sort_order ?? 0)
  const [isActive, setIsActive] = useState((category as any)?.is_active ?? true)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  async function save() {
    setSaving(true)
    setSaveMsg('')
    const payload = { label, slug, description, sort_order: sortOrder, is_active: isActive }
    const url = isNew ? '/api/admin/categories' : `/api/admin/categories/${category!.id}`
    const method = isNew ? 'POST' : 'PUT'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    setSaving(false)
    if (res.ok) {
      setSaveMsg('Saved ✓')
      if (isNew) {
        const saved = await res.json()
        router.push(`/admin/categories/${saved.id}`)
      }
    } else {
      const err = await res.json()
      setSaveMsg(`Error: ${err.error ?? 'Save failed'}`)
    }
  }

  return (
    <div style={{ padding: '24px 32px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a href="/admin/categories" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '13px' }}>← Categories</a>
          <span style={{ color: '#d1d5db' }}>/</span>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#1a1a1a' }}>
            {isNew ? 'New Category' : 'Edit Category'}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {saveMsg && <span style={{ fontSize: '13px', color: saveMsg.startsWith('Error') ? '#dc2626' : '#059669' }}>{saveMsg}</span>}
          <button onClick={save} disabled={saving || !label || !slug} style={{ padding: '8px 18px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      <div style={{ background: '#fff', padding: '24px', borderRadius: '10px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={labelStyle}>Label</label>
          <input value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Travel Tips" style={fieldStyle} />
        </div>
        <div>
          <label style={labelStyle}>Slug (Unique identifier)</label>
          <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="e.g. travel-tips" style={fieldStyle} />
          <p style={{ fontSize: '11px', color: '#9ca3af', margin: '4px 0 0' }}>Used in URLs and internal linking. Must be unique.</p>
        </div>
        <div>
          <label style={labelStyle}>Description (Optional)</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Describe this category for agents..." style={{ ...fieldStyle, resize: 'vertical' }} />
        </div>
        <div>
          <label style={labelStyle}>Sort Order</label>
          <input type="number" value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))} style={fieldStyle} />
          <p style={{ fontSize: '11px', color: '#9ca3af', margin: '4px 0 0' }}>Lower numbers appear first.</p>
        </div>
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', color: '#374151' }}>
            <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
            Active (Visible to agents)
          </label>
        </div>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: '12px', fontWeight: 500, color: '#6b7280', marginBottom: '6px' }
const fieldStyle: React.CSSProperties = { width: '100%', padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '13px', outline: 'none', boxSizing: 'border-box', color: '#374151' }
