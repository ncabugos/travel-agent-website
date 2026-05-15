'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { SupplierPromo } from '@/lib/supplier-promos'

export default function AdminPromosListPage() {
  const [promos, setPromos] = useState<SupplierPromo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/promos')
      .then(r => r.json())
      .then(data => {
        setPromos(data.promos ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const hotels = promos.filter(p => p.supplier_type === 'hotel_program')
  const cruises = promos.filter(p => p.supplier_type === 'cruise_line')

  return (
    <div style={{ padding: '24px 32px' }}>
      <div style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        marginBottom: 20, gap: 16,
      }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 4px' }}>Promo Banners</h1>
          <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>
            Per-supplier promotional banner shown on hotel and cruise detail pages across every advisor site.
          </p>
        </div>
        <Link
          href="/admin/promos/new"
          style={{
            padding: '10px 18px', background: '#111', color: '#fff',
            borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none',
          }}
        >
          + New promo
        </Link>
      </div>

      {loading ? (
        <p style={{ color: '#9ca3af', fontSize: 13 }}>Loading…</p>
      ) : (
        <>
          <PromoSection title="Hotel programs" promos={hotels} emptyLabel="No hotel program promos yet." />
          <PromoSection title="Cruise lines" promos={cruises} emptyLabel="No cruise line promos yet." />
        </>
      )}
    </div>
  )
}

function PromoSection({ title, promos, emptyLabel }: { title: string; promos: SupplierPromo[]; emptyLabel: string }) {
  return (
    <section style={{ marginTop: 32 }}>
      <h2 style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b7280', margin: '0 0 12px' }}>
        {title} <span style={{ color: '#9ca3af', fontWeight: 500 }}>({promos.length})</span>
      </h2>
      {promos.length === 0 ? (
        <p style={{ color: '#9ca3af', fontSize: 13 }}>{emptyLabel}</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {promos.map(p => (
            <Link
              key={p.id}
              href={`/admin/promos/${p.id}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto auto',
                alignItems: 'center',
                gap: 16,
                padding: '14px 18px',
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{p.headline}</div>
                <div style={{ fontSize: 12, color: '#9ca3af' }}>
                  <code style={{ background: '#f3f4f6', padding: '1px 6px', borderRadius: 4, fontSize: 11 }}>{p.supplier_slug}</code>
                </div>
              </div>
              <span style={{
                fontSize: 11, padding: '3px 9px', borderRadius: 999,
                background: p.is_active ? '#ecfdf5' : '#f3f4f6',
                color: p.is_active ? '#065f46' : '#6b7280',
                fontWeight: 600,
              }}>
                {p.is_active ? 'Active' : 'Inactive'}
              </span>
              <span style={{ fontSize: 12, color: '#9ca3af' }}>Edit →</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
