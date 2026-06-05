import { NextResponse } from 'next/server'
import { getSupplierTargets } from '@/lib/supplier-promos'
import { getCurrentSuperAdmin } from '@/lib/admin-auth'

export async function GET() {
  const adminUser = await getCurrentSuperAdmin()
  if (!adminUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const targets = await getSupplierTargets()
  return NextResponse.json({ targets })
}
