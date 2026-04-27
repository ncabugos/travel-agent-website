/**
 * lib/supplier-tags.ts
 * Helper for the blog supplier tagging system.
 * Loads all hotel programs and cruise lines as a flat list of
 * { tag, name, group } items for the PostEditor checkbox UI.
 */
import { getHotelPrograms } from '@/lib/hotel-programs'
import { getCruiseLines } from '@/lib/cruise-lines'

export interface SupplierTagOption {
  /** Prefixed slug stored in DB, e.g. 'hotel:four-seasons-preferred-partner' */
  tag: string
  /** Human-readable label, e.g. 'Four Seasons Preferred Partner' */
  name: string
  /** Grouping header */
  group: 'Hotel Programs' | 'Cruise Lines'
}

/** Returns all available supplier tags sorted by group then name. */
export async function getAllSupplierTagOptions(): Promise<SupplierTagOption[]> {
  const [hotels, cruises] = await Promise.all([
    getHotelPrograms(),
    getCruiseLines(),
  ])

  const hotelTags: SupplierTagOption[] = hotels.map(h => ({
    tag: `hotel:${h.slug}`,
    name: h.name,
    group: 'Hotel Programs',
  }))

  const cruiseTags: SupplierTagOption[] = cruises.map(c => ({
    tag: `cruise:${c.slug}`,
    name: c.name,
    group: 'Cruise Lines',
  }))

  return [...cruiseTags, ...hotelTags]
}
