import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PromoForm } from '@/components/admin/PromoForm'
import { getSupplierPromoById } from '@/lib/supplier-promos'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditPromoPage({ params }: PageProps) {
  const { id } = await params
  const promo = await getSupplierPromoById(id)
  if (!promo) notFound()

  return (
    <div style={{ padding: '24px 32px' }}>
      <Link href="/admin/promos" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none' }}>
        ← Back to promos
      </Link>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: '12px 0 24px' }}>Edit promo banner</h1>
      <PromoForm promo={promo} />
    </div>
  )
}
