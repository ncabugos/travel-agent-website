import type { DisplaySupplier } from '@/lib/mock-data'
import { SupplierCard } from './SupplierCard'

interface SupplierGridProps {
  suppliers: DisplaySupplier[]
}

export function SupplierGrid({ suppliers }: SupplierGridProps) {
  if (suppliers.length === 0) {
    return (
      <p
        className="text-sm tracking-wide text-center py-16"
        style={{ color: '#9CA3A0' }}
      >
        No properties curated yet.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
      {suppliers.map((supplier) => (
        <SupplierCard key={supplier.id} supplier={supplier} />
      ))}
    </div>
  )
}
