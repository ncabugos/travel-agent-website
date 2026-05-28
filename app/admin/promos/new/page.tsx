import Link from 'next/link'
import { PromoForm } from '@/components/admin/PromoForm'

export default function NewPromoPage() {
  return (
    <div style={{ padding: '24px 32px' }}>
      <Link href="/admin/promos" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none' }}>
        ← Back to promos
      </Link>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: '12px 0 24px' }}>New promo banner</h1>
      <PromoForm />
    </div>
  )
}
