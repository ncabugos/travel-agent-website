import Link from 'next/link'
import { TopBar } from '@/components/dashboard/TopBar'
import { PageContent } from '@/components/dashboard/DashboardShell'
import { buttonStyles } from '@/components/dashboard/FormField'
import { listSupplierPromos, type SupplierPromo } from '@/lib/supplier-promos'

export const dynamic = 'force-dynamic'

export default async function AdminPromosListPage() {
  const promos = await listSupplierPromos()
  const hotels = promos.filter(p => p.supplier_type === 'hotel_program')
  const cruises = promos.filter(p => p.supplier_type === 'cruise_line')

  return (
    <>
      <TopBar
        title="Promo Banners"
        subtitle="Per-supplier banner shown on hotel and cruise detail pages across every advisor site"
        actions={
          <Link href="/admin/promos/new" style={{ ...buttonStyles.primary, textDecoration: 'none' }}>
            + New promo
          </Link>
        }
      />
      <PageContent>
        <PromoSection title="Hotel programs" promos={hotels} emptyLabel="No hotel program promos yet." />
        <PromoSection title="Cruise lines" promos={cruises} emptyLabel="No cruise line promos yet." />
      </PageContent>
    </>
  )
}

function PromoSection({ title, promos, emptyLabel }: { title: string; promos: SupplierPromo[]; emptyLabel: string }) {
  return (
    <section style={{ marginBottom: 32 }}>
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
