'use client'
import { useState, useRef, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import type { BlogCategory } from '@/types/index'

interface Props {
  category?: BlogCategory | null
  isNew?: boolean
}

type CategorySnapshot = {
  label: string
  slug: string
  description: string
  sortOrder: number
  isActive: boolean
}

function snapshotForm(f: CategorySnapshot): string {
  return JSON.stringify(f)
}

export function CategoryEditor({ category, isNew }: Props) {
  const router = useRouter()
  const [label, setLabel] = useState(category?.label ?? '')
  const [slug, setSlug] = useState(category?.slug ?? '')
  const [description, setDescription] = useState(category?.description ?? '')
  const [sortOrder, setSortOrder] = useState(category?.sort_order ?? 0)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [isActive, setIsActive] = useState((category as any)?.is_active ?? true)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  const initialFormRef = useRef<CategorySnapshot>({
    label: category?.label ?? '',
    slug: category?.slug ?? '',
    description: category?.description ?? '',
    sortOrder: category?.sort_order ?? 0,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isActive: (category as any)?.is_active ?? true,
  })
  const [initialKey, setInitialKey] = useState(() =>
    snapshotForm(initialFormRef.current)
  )
  const currentKey = useMemo(
    () => snapshotForm({ label, slug, description, sortOrder, isActive }),
    [label, slug, description, sortOrder, isActive]
  )
  const isDirty = currentKey !== initialKey
  const canSave = !!label && !!slug

  // Warn before tab close / nav while there are unsaved changes.
  useEffect(() => {
    if (!isDirty) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isDirty])

  // Auto-dismiss the success toast.
  useEffect(() => {
    if (!saveMsg.startsWith('Saved')) return
    const t = setTimeout(() => setSaveMsg(''), 2500)
    return () => clearTimeout(t)
  }, [saveMsg])

  async function save() {
    if (!canSave || !isDirty) return
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
      initialFormRef.current = { label, slug, description, sortOrder, isActive }
      setInitialKey(snapshotForm(initialFormRef.current))
      if (isNew) {
        const saved = await res.json()
        router.push(`/admin/categories/${saved.id}`)
      }
    } else {
      const err = await res.json()
      setSaveMsg(`Error: ${err.error ?? 'Save failed'}`)
    }
  }

  function discard() {
    const i = initialFormRef.current
    setLabel(i.label)
    setSlug(i.slug)
    setDescription(i.description)
    setSortOrder(i.sortOrder)
    setIsActive(i.isActive)
    setSaveMsg('')
  }

  const headerSaveDisabled = saving || !isDirty || !canSave
  const headerSaveTitle = !canSave
    ? 'Label and slug are required'
    : !isDirty
      ? 'No changes to save'
      : undefined

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
          <button
            onClick={save}
            disabled={headerSaveDisabled}
            title={headerSaveTitle}
            style={primaryBtn(headerSaveDisabled)}
          >
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

      {/* Padding for the fixed bar so it never covers the last field. */}
      {isDirty && <div style={{ height: 80 }} aria-hidden />}

      {isDirty && (
        <div
          role="region"
          aria-label="Unsaved changes"
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255,255,255,0.96)',
            backdropFilter: 'blur(6px)',
            borderTop: '1px solid #e5e7eb',
            padding: '14px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            zIndex: 50,
            boxShadow: '0 -4px 12px rgba(0,0,0,0.04)',
            animation: 'categoryEditorBarSlideUp 180ms ease-out',
          }}
        >
          <style>{`@keyframes categoryEditorBarSlideUp{from{opacity:0}to{opacity:1}}`}</style>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
            <span
              aria-hidden
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                background: '#f59e0b',
                boxShadow: '0 0 0 3px rgba(245,158,11,0.18)',
              }}
            />
            <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>
              You have unsaved changes
            </span>
            {!canSave && (
              <span style={{ fontSize: 12, color: '#dc2626', marginLeft: 8 }}>
                Label and slug are required
              </span>
            )}
            {saveMsg.startsWith('Error') && (
              <span style={{ fontSize: 13, fontWeight: 500, color: '#dc2626', marginLeft: 8 }}>
                {saveMsg}
              </span>
            )}
          </div>
          <button type="button" onClick={discard} disabled={saving} style={secondaryBtn(saving)}>
            Discard
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving || !canSave}
            title={!canSave ? 'Label and slug are required' : undefined}
            style={primaryBtn(saving || !canSave)}
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  )
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: '12px', fontWeight: 500, color: '#6b7280', marginBottom: '6px' }
const fieldStyle: React.CSSProperties = { width: '100%', padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '13px', outline: 'none', boxSizing: 'border-box', color: '#374151' }

function primaryBtn(disabled: boolean): React.CSSProperties {
  return {
    padding: '8px 18px',
    background: disabled ? '#e5e7eb' : '#1a1a1a',
    color: disabled ? '#9ca3af' : '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background 150ms ease, color 150ms ease',
  }
}

function secondaryBtn(disabled: boolean): React.CSSProperties {
  return {
    padding: '8px 18px',
    background: '#fff',
    color: disabled ? '#9ca3af' : '#374151',
    border: '1px solid ' + (disabled ? '#e5e7eb' : '#d1d5db'),
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: disabled ? 'not-allowed' : 'pointer',
  }
}
