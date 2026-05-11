import { NextResponse } from 'next/server'
import { getHotelFilterOptions } from '@/lib/hotels'

/**
 * Returns the distinct values for the directory filter dropdowns:
 *   { countries: string[], vibes: string[], brands: string[] }
 *
 * Useful for client-side debugging + future client-side filter rendering.
 * Server-rendered pages can call getHotelFilterOptions() directly.
 */
export async function GET() {
  const options = await getHotelFilterOptions()
  return NextResponse.json(options)
}
