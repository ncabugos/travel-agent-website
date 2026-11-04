import { createServiceClient } from '@/lib/supabase/service'
import type { CruiseIncludedGroup, CruiseJourney, CruiseShip } from '@/lib/cruise-lines'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CruiseCollection {
  id: string
  slug: string
  name: string
  intro: string | null
  hero_image_url: string | null
  sort_order: number
  is_active: boolean
}

export interface CruiseItinerary {
  id: string
  cruise_line_id: string
  collection_id: string | null
  slug: string
  name: string
  nights: string
  route: string
  blurb: string | null
  image_url: string | null
  source_url: string | null
  sort_order: number
  is_active: boolean
  overview: string | null
  highlights: string[]
  region: string | null
  countries: string | null
  days_direction: string | null
  days: CruiseDay[]
  departures_note: string | null
}

/** One day of an itinerary. Its position in the list is the day number. */
export interface CruiseDay {
  place: string
  title?: string
  summary?: string
  excursions?: string[]
}

export interface CruiseDeparture {
  id: string
  departs_on: string
  embark: string
  disembark: string
  ship: string | null
}

/** One card on a collection page, which spans cruise lines. */
export interface CollectionItinerary extends CruiseJourney {
  id: string
  line_name: string
  line_slug: string
}

// ─── Opt-outs ─────────────────────────────────────────────────────────────────

// Route ids are UUIDs for real advisors. Demo sites use slugs such as t2-demo,
// have no agents row, and so can have no opt-outs.
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** A failed lookup returns no opt-outs: the catalog shows rather than vanishes. */
async function getExcludedItineraryIds(agentId?: string): Promise<Set<string>> {
  if (!agentId || !UUID.test(agentId)) return new Set()

  const { data, error } = await createServiceClient()
    .from('agent_cruise_itinerary_exclusions')
    .select('itinerary_id')
    .eq('agent_id', agentId)

  if (error || !data) return new Set()
  return new Set(data.map((row: { itinerary_id: string }) => row.itinerary_id))
}

/**
 * Sets which active itineraries a site shows. Opt-outs on deactivated
 * itineraries are left alone, so reactivating one doesn't undo a site's choice.
 * Service-role write: callers must have checked who is signed in.
 */
export async function setAgentEnabledItineraries(agentId: string, enabledIds: string[]) {
  const sb = createServiceClient()

  // Sites on the frontend template have no cruise pages, so nothing is stored for them.
  const { data: agent } = await sb.from('agents').select('template').eq('id', agentId).maybeSingle()
  if (!agent || !['t2', 't3', 't4'].includes(agent.template ?? '')) {
    throw new Error('This site has no cruise pages.')
  }

  const { data, error } = await sb.from('cruise_itineraries').select('id').eq('is_active', true)
  if (error || !data) throw new Error(error?.message ?? 'Could not read the itinerary catalog')

  const enabled = new Set(enabledIds)
  const activeIds = data.map((row: { id: string }) => row.id)
  const optIn = activeIds.filter((id) => enabled.has(id))
  const optOut = activeIds.filter((id) => !enabled.has(id))

  if (optOut.length > 0) {
    const { error: upsertError } = await sb
      .from('agent_cruise_itinerary_exclusions')
      .upsert(optOut.map((itinerary_id) => ({ agent_id: agentId, itinerary_id })), { ignoreDuplicates: true })
    if (upsertError) throw new Error(upsertError.message)
  }
  if (optIn.length > 0) {
    const { error: deleteError } = await sb
      .from('agent_cruise_itinerary_exclusions')
      .delete()
      .eq('agent_id', agentId)
      .in('itinerary_id', optIn)
    if (deleteError) throw new Error(deleteError.message)
  }
}

/** The checklist behind the portal and admin opt-out panels. */
export async function getItineraryChecklist(agentId: string) {
  const sb = createServiceClient()
  const [{ data, error }, excluded] = await Promise.all([
    sb
      .from('cruise_itineraries')
      .select('id, name, nights, route, sort_order, cruise_lines!inner(name, sort_order, is_active)')
      .eq('is_active', true)
      .eq('cruise_lines.is_active', true),
    getExcludedItineraryIds(agentId),
  ])
  if (error || !data) return { items: [], enabledIds: [] as string[] }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = (data as any[]).sort(
    (a, b) => a.cruise_lines.sort_order - b.cruise_lines.sort_order || a.sort_order - b.sort_order,
  )
  return {
    items: rows.map((row) => ({
      id: row.id as string,
      label: `${row.cruise_lines.name}: ${row.name}`,
      sublabel: `${row.nights} · ${row.route}`,
    })),
    enabledIds: rows.filter((row) => !excluded.has(row.id)).map((row) => row.id as string),
  }
}

// ─── Public reads ─────────────────────────────────────────────────────────────

function hasDays(days: unknown): boolean {
  return Array.isArray(days) && days.length > 0
}

/**
 * One itinerary for its full page, with its future sailings. Null when it has no
 * day-by-day content yet or this site opted out, so the page returns a 404.
 */
export async function getCruiseItinerary(
  lineId: string,
  slug: string,
  agentId?: string,
): Promise<{ itinerary: CruiseItinerary; departures: CruiseDeparture[] } | null> {
  try {
    const sb = createServiceClient()
    const { data: itinerary, error } = await sb
      .from('cruise_itineraries')
      .select('*')
      .eq('cruise_line_id', lineId)
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle()
    if (error || !itinerary || !hasDays(itinerary.days)) return null

    const excluded = await getExcludedItineraryIds(agentId)
    if (excluded.has(itinerary.id)) return null

    const today = new Date().toISOString().slice(0, 10)
    const { data: departures } = await sb
      .from('cruise_itinerary_departures')
      .select('id, departs_on, embark, disembark, ship')
      .eq('itinerary_id', itinerary.id)
      .gte('departs_on', today)
      .order('departs_on', { ascending: true })
      .order('embark', { ascending: true })

    return { itinerary, departures: departures ?? [] }
  } catch {
    return null
  }
}

/** Route params for every itinerary that has a full page. */
export async function getItineraryPageParams(): Promise<{ cruiseSlug: string; itinerarySlug: string }[]> {
  try {
    const { data, error } = await createServiceClient()
      .from('cruise_itineraries')
      .select('slug, days, cruise_lines!inner(slug, is_active)')
      .eq('is_active', true)
      .eq('cruise_lines.is_active', true)
    if (error || !data) return []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data as any[])
      .filter((row) => hasDays(row.days))
      .map((row) => ({ cruiseSlug: row.cruise_lines.slug, itinerarySlug: row.slug }))
  } catch {
    return []
  }
}

/** Sailings by calendar year, in date order. */
export function groupDeparturesByYear(departures: CruiseDeparture[]) {
  const years = new Map<string, CruiseDeparture[]>()
  for (const departure of departures) {
    const year = departure.departs_on.slice(0, 4)
    years.set(year, [...(years.get(year) ?? []), departure])
  }
  return [...years.entries()].map(([year, rows]) => ({ year, rows }))
}

export function formatDepartureDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

const shipKey = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '')

/** Each ship named in the sailings, with its card from the line's fleet when there is one. */
export function getSailingShips(fleet: CruiseShip[], departures: CruiseDeparture[]): CruiseShip[] {
  const names = [...new Set(departures.map((d) => d.ship).filter((s): s is string => Boolean(s)))]
  return names.map((name) => {
    const key = shipKey(name)
    return fleet.find((ship) => shipKey(ship.name).includes(key)) ?? { name }
  })
}

/**
 * Active itineraries grouped by cruise line id, minus the site's opt-outs when
 * an agentId is given. Returns null if the catalog can't be read, so the caller
 * can tell that apart from a line with no itineraries.
 */
export async function getJourneysByLine(
  options: { lineId?: string; agentId?: string } = {},
): Promise<Map<string, CruiseJourney[]> | null> {
  try {
    let query = createServiceClient()
      .from('cruise_itineraries')
      .select('id, cruise_line_id, slug, name, nights, route, blurb, image_url, days')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (options.lineId) query = query.eq('cruise_line_id', options.lineId)

    const [{ data, error }, excluded] = await Promise.all([
      query,
      getExcludedItineraryIds(options.agentId),
    ])
    if (error || !data) return null

    const byLine = new Map<string, CruiseJourney[]>()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const row of data as any[]) {
      if (excluded.has(row.id)) continue
      const journeys = byLine.get(row.cruise_line_id) ?? []
      journeys.push({
        name: row.name,
        nights: row.nights,
        route: row.route,
        blurb: row.blurb ?? '',
        image_url: row.image_url ?? undefined,
        slug: row.slug,
        has_details: hasDays(row.days),
      })
      byLine.set(row.cruise_line_id, journeys)
    }
    return byLine
  } catch {
    return null
  }
}

/** Active collections with at least one itinerary this site still shows. */
export async function getCruiseCollections(agentId?: string): Promise<CruiseCollection[]> {
  try {
    const sb = createServiceClient()
    const [collections, itineraries, excluded] = await Promise.all([
      sb.from('cruise_collections').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
      sb.from('cruise_itineraries').select('id, collection_id').eq('is_active', true).not('collection_id', 'is', null),
      getExcludedItineraryIds(agentId),
    ])
    if (collections.error || itineraries.error) return []

    const visible = new Set(
      (itineraries.data ?? [])
        .filter((row: { id: string }) => !excluded.has(row.id))
        .map((row: { collection_id: string | null }) => row.collection_id),
    )
    return (collections.data ?? []).filter((c: CruiseCollection) => visible.has(c.id))
  } catch {
    return []
  }
}

/** One collection and its cards, or null when it has nothing to show this site. */
export async function getCruiseCollection(
  slug: string,
  agentId?: string,
): Promise<{ collection: CruiseCollection; itineraries: CollectionItinerary[] } | null> {
  try {
    const sb = createServiceClient()
    const { data: collection, error } = await sb
      .from('cruise_collections')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle()
    if (error || !collection) return null

    const [rows, excluded] = await Promise.all([
      sb
        .from('cruise_itineraries')
        .select('id, slug, name, nights, route, blurb, image_url, days, sort_order, cruise_lines!inner(name, slug, sort_order, is_active)')
        .eq('collection_id', collection.id)
        .eq('is_active', true)
        .eq('cruise_lines.is_active', true),
      getExcludedItineraryIds(agentId),
    ])
    if (rows.error || !rows.data) return null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const itineraries = (rows.data as any[])
      .filter((row) => !excluded.has(row.id))
      .sort((a, b) => a.cruise_lines.sort_order - b.cruise_lines.sort_order || a.sort_order - b.sort_order)
      .map((row) => ({
        id: row.id,
        name: row.name,
        nights: row.nights,
        route: row.route,
        blurb: row.blurb ?? '',
        image_url: row.image_url ?? undefined,
        slug: row.slug,
        has_details: hasDays(row.days),
        line_name: row.cruise_lines.name,
        line_slug: row.cruise_lines.slug,
      }))

    return itineraries.length > 0 ? { collection, itineraries } : null
  } catch {
    return null
  }
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export type AdminDeparture = Omit<CruiseDeparture, 'id'> & { itinerary_id: string }

export function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

/** The whole catalog, inactive rows included. Admin pages only. */
export async function getAdminCruiseCatalog() {
  const sb = createServiceClient()
  const [lines, collections, itineraries, departures] = await Promise.all([
    sb.from('cruise_lines').select('id, name, slug, included').eq('is_active', true).order('sort_order', { ascending: true }),
    sb.from('cruise_collections').select('*').order('sort_order', { ascending: true }),
    sb.from('cruise_itineraries').select('*').order('sort_order', { ascending: true }),
    sb.from('cruise_itinerary_departures').select('itinerary_id, departs_on, embark, disembark, ship').order('departs_on', { ascending: true }),
  ])
  return {
    lines: (lines.data ?? []) as { id: string; name: string; slug: string; included: CruiseIncludedGroup[] }[],
    collections: (collections.data ?? []) as CruiseCollection[],
    itineraries: (itineraries.data ?? []) as CruiseItinerary[],
    departures: (departures.data ?? []) as AdminDeparture[],
  }
}
