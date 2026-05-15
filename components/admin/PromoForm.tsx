'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PROMO_LIMITS, type SupplierPromo, type SupplierPromoInput, type SupplierTarget } from '@/lib/supplier-promos'

interface Props {
  promo?: SupplierPromo | null
}

export function PromoForm({ promo }: Props) {
  const router = useRouter()
  const isEdit = !!promo

  const [targets, setTargets] = useState<SupplierTarget[]>([])
  const [supplierType, setSupplierType] = useState<'hotel_program' | 'cruise_line'>(promo?.supplier_type ?? 'hotel_program')
  const [supplierSlug, setSupplierSlug] = useState(promo?.supplier_slug ?? '')
  const [headline, setHeadline] = useState(promo?.headline ?? '')
  const [subheading, setSubheading] = useState(promo?.subheading ?? '')
  const [ctaLabel, setCtaLabel] = useState(promo?.cta_label ?? '')
  const [ctaUrl, setCtaUrl] = useState(promo?.cta_url ?? '')
  const [imageUrl, setImageUrl] = useState(promo?.image_url ?? '')
  const [isActive, setIsActive] = useState(promo?.is_active ?? true)
  const [startsAt, setStartsAt] = useState(toDateInput(promo?.starts_at))
  const [endsAt, setEndsAt] = useState(toDateInput(promo?.ends_at))

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/promos/targets')
      .then(r => r.json())
      .then(data => setTargets(data.targets ?? []))
      .catch(() => setTargets([]))
  }, [])

  const visibleTargets = useMemo(
    () => targets.filter(t => t.type === supplierType),
    [targets, supplierType]
  )

  // When supplier_type changes via the form, clear slug if it doesn't match.
  useEffect(() => {
    if (!supplierSlug) return
    const stillValid = visibleTargets.some(t => t.slug === supplierSlug)
    if (!stillValid) setSupplierSlug('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleTargets])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaving(true)

    const payload: SupplierPromoInput = {
      supplier_type: supplierType,
      supplier_slug: supplierSlug,
      headline,
      subheading: subheading || null,
      cta_label: ctaLabel || null,
      cta_url: ctaUrl || null,
      image_url: imageUrl || null,
      is_active: isActive,
      starts_at: startsAt ? new Date(startsAt).toISOString() : null,
      ends_at: endsAt ? new Date(endsAt).toISOString() : null,
    }

    try {
      const url = isEdit ? `/api/admin/promos/${promo!.id}` : '/api/admin/promos'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to save')
      router.push('/admin/promos')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save')
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!isEdit) return
    if (!confirm('Delete this promo? This cannot be undone.')) return
    try {
      const res = await fetch(`/api/admin/promos/${promo!.id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to delete')
      }
      router.push('/admin/promos')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Supplier type */}
      <Field label="Supplier type">
        <select value={supplierType} onChange={e => setSupplierType(e.target.value as 'hotel_program' | 'cruise_line')} style={selectStyle}>
          <option value="hotel_program">Hotel program</option>
          <option value="cruise_line">Cruise line</option>
        </select>
      </Field>

      {/* Supplier target */}
      <Field label={supplierType === 'hotel_program' ? 'Hotel program' : 'Cruise line'}>
        <select value={supplierSlug} onChange={e => setSupplierSlug(e.target.value)} required style={selectStyle}>
          <option value="">Select…</option>
          {visibleTargets.map(t => (
            <option key={t.slug} value={t.slug}>{t.name}</option>
          ))}
        </select>
      </Field>

      {/* Headline */}
      <Field label="Headline" hint={`${headline.length} / ${PROMO_LIMITS.headline}`} hintWarn={headline.length > PROMO_LIMITS.headline}>
        <input
          type="text" value={headline} onChange={e => setHeadline(e.target.value)}
          maxLength={PROMO_LIMITS.headline} required style={inputStyle}
          placeholder="Discover Belmond Bellini Club"
        />
      </Field>

      {/* Subheading */}
      <Field label="Subheading" hint={`${subheading.length} / ${PROMO_LIMITS.subheading}`} hintWarn={subheading.length > PROMO_LIMITS.subheading}>
        <textarea
          value={subheading ?? ''} onChange={e => setSubheading(e.target.value)}
          maxLength={PROMO_LIMITS.subheading} rows={4}
          style={{ ...inputStyle, fontFamily: 'inherit', resize: 'vertical' }}
          placeholder="Book through us and unlock exclusive privileges — upgrades, daily breakfast, and VIP recognition unavailable through any other channel."
        />
      </Field>

      {/* CTA label + URL */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
        <Field label="CTA label" hint={`${ctaLabel.length} / ${PROMO_LIMITS.cta_label}`} hintWarn={ctaLabel.length > PROMO_LIMITS.cta_label}>
          <input
            type="text" value={ctaLabel ?? ''} onChange={e => setCtaLabel(e.target.value)}
            maxLength={PROMO_LIMITS.cta_label} style={inputStyle}
            placeholder="Book through us"
          />
        </Field>
        <Field label="CTA URL (optional — defaults to advisor's contact page)">
          <input
            type="text" value={ctaUrl ?? ''} onChange={e => setCtaUrl(e.target.value)}
            maxLength={PROMO_LIMITS.cta_url} style={inputStyle}
            placeholder="/contact or https://..."
          />
        </Field>
      </div>

      {/* Image URL */}
      <Field label="Image URL">
        <input
          type="text" value={imageUrl ?? ''} onChange={e => setImageUrl(e.target.value)}
          maxLength={PROMO_LIMITS.image_url} style={inputStyle}
          placeholder="/media/hotel-programs/.../hero.jpg or https://..."
        />
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="preview" style={{ marginTop: 8, maxHeight: 140, borderRadius: 6, border: '1px solid #e5e7eb' }} />
        )}
      </Field>

      {/* Schedule + active */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        <Field label="Starts at (optional)">
          <input type="datetime-local" value={startsAt} onChange={e => setStartsAt(e.target.value)} style={inputStyle} />
        </Field>
        <Field label="Ends at (optional)">
          <input type="datetime-local" value={endsAt} onChange={e => setEndsAt(e.target.value)} style={inputStyle} />
        </Field>
        <Field label="Status">
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 10, fontSize: 14 }}>
            <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
            Active
          </label>
        </Field>
      </div>

      {error && (
        <div style={{ padding: '10px 14px', background: '#fef2f2', color: '#991b1b', borderRadius: 8, fontSize: 13 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <button type="submit" disabled={saving} style={{
          padding: '10px 22px', background: '#111', color: '#fff',
          border: 0, borderRadius: 8, fontSize: 13, fontWeight: 600,
          cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
        }}>
          {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create promo'}
        </button>
        {isEdit && (
          <button type="button" onClick={handleDelete} style={{
            padding: '10px 22px', background: '#fff', color: '#b91c1c',
            border: '1px solid #fecaca', borderRadius: 8, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', marginLeft: 'auto',
          }}>
            Delete
          </button>
        )}
      </div>
    </form>
  )
}

function Field({ label, hint, hintWarn, children }: { label: string; hint?: string; hintWarn?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {label}
        </label>
        {hint && (
          <span style={{ fontSize: 11, color: hintWarn ? '#b91c1c' : '#9ca3af', fontVariantNumeric: 'tabular-nums' }}>
            {hint}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  fontSize: 14,
  border: '1px solid #d1d5db',
  borderRadius: 6,
  background: '#fff',
  outline: 'none',
}

const selectStyle: React.CSSProperties = { ...inputStyle, cursor: 'pointer' }

function toDateInput(iso?: string | null): string {
  if (!iso) return ''
  // datetime-local wants yyyy-MM-ddThh:mm (no seconds, no Z)
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}
