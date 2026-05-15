import { NextResponse } from 'next/server'
import { getSupplierTargets } from '@/lib/supplier-promos'

export async function GET() {
  const targets = await getSupplierTargets()
  return NextResponse.json({ targets })
}
