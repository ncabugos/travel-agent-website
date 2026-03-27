import { NextRequest, NextResponse } from 'next/server'
import { getHotels } from '@/lib/hotels'

export async function GET(req: NextRequest) {
  const url      = req.nextUrl
  const search   = url.searchParams.get('search')   ?? ''
  const country  = url.searchParams.get('country')  ?? ''
  const vibe     = url.searchParams.get('vibe')     ?? ''
  const brand    = url.searchParams.get('brand')    ?? ''
  const page     = Number(url.searchParams.get('page')     ?? '1')
  const pageSize = Number(url.searchParams.get('pageSize') ?? '12')

  const { hotels, total } = await getHotels({
    search:  search  || undefined,
    country: country || undefined,
    vibe:    vibe    || undefined,
    brand:   brand   || undefined,
    page,
    pageSize,
  })

  return NextResponse.json({ hotels, total })
}
