import { createServiceClient } from '@/lib/supabase/service'
import type { CruiseJourney } from '@/lib/cruise-lines'

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
      .select('id, cruise_line_id, name, nights, route, blurb, image_url')
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
        .select('id, name, nights, route, blurb, image_url, sort_order, cruise_lines!inner(name, slug, sort_order, is_active)')
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
        line_name: row.cruise_lines.name,
        line_slug: row.cruise_lines.slug,
      }))

    return itineraries.length > 0 ? { collection, itineraries } : null
  } catch {
    return null
  }
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

/** The whole catalog, inactive rows included. Admin pages only. */
export async function getAdminCruiseCatalog() {
  const sb = createServiceClient()
  const [lines, collections, itineraries] = await Promise.all([
    sb.from('cruise_lines').select('id, name, slug').eq('is_active', true).order('sort_order', { ascending: true }),
    sb.from('cruise_collections').select('*').order('sort_order', { ascending: true }),
    sb.from('cruise_itineraries').select('*').order('sort_order', { ascending: true }),
  ])
  return {
    lines: (lines.data ?? []) as { id: string; name: string; slug: string }[],
    collections: (collections.data ?? []) as CruiseCollection[],
    itineraries: (itineraries.data ?? []) as CruiseItinerary[],
  }
}
