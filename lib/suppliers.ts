import { MOCK_AGENT, DEMO_T2_AGENT, DEMO_YTC_AGENT, DEMO_T3_AGENT, DEMO_WWT_AGENT, DEMO_CASA_SOLIS_AGENT, MOCK_SUPPLIERS, type DisplaySupplier, type MockAgent } from '@/lib/mock-data'
import { createServiceClient } from '@/lib/supabase/service'

// Re-export for use in lib/blog.ts and other modules
export type AgentProfile = MockAgent

const DEMO_ID    = 'demo-agent'
const T2_DEMO_ID = 't2-demo'
const T3_DEMO_ID = 't3-demo'
const YTC_DEMO_ID = 'ytc-demo'
const WWT_DEMO_ID = 'wwt-demo'
const CASA_SOLIS_DEMO_ID = 'casa-solis'

/** Eden For Your World — real beta client agent ID (DB record via migration 021) */
export const EDEN_AGENT_ID = '2e18df43-171a-4565-b840-aade259cab69'
const isDemo    = (agentId: string) =>
  agentId === DEMO_ID || !process.env.NEXT_PUBLIC_SUPABASE_URL
const isT2Demo  = (agentId: string) => agentId === T2_DEMO_ID
const isT3Demo  = (agentId: string) => agentId === T3_DEMO_ID
const isYtcDemo = (agentId: string) => agentId === YTC_DEMO_ID
const isWwtDemo = (agentId: string) => agentId === WWT_DEMO_ID
const isCasaSolisDemo = (agentId: string) => agentId === CASA_SOLIS_DEMO_ID

// ─── Agent Profile ────────────────────────────────────────────────────────────

export async function getAgentProfile(agentId: string): Promise<MockAgent | null> {
  if (isCasaSolisDemo(agentId)) return DEMO_CASA_SOLIS_AGENT
  if (isWwtDemo(agentId)) return DEMO_WWT_AGENT
  if (isYtcDemo(agentId)) return DEMO_YTC_AGENT
  if (isT3Demo(agentId))  return DEMO_T3_AGENT
  if (isT2Demo(agentId))  return DEMO_T2_AGENT
  if (isDemo(agentId))    return MOCK_AGENT

  try {
    const supabase = createServiceClient()

    // Pull every public-profile column from agents, including the
    // onboarding-collected fields (bio, specialties, social URLs).
    // Templates only render fields that are non-empty so the schema
    // is permissive — missing values fall back to sensible defaults.
    const baseColumns = [
      'id',
      'full_name',
      'agency_name',
      'tagline',
      'email',
      'phone',
      'avatar_url',
      'custom_domain',
      'tier',
      'bio',
      'instagram_url',
      'facebook_url',
      'youtube_url',
      'tiktok_url',
      'website_url',
      'travel_specialties',
      'destination_specialties',
      'preferred_suppliers',
      'travel_types',
    ]

    // Try the post-migration-029 schema (with first_name). If the column
    // doesn't exist yet, fall back to the legacy schema so the site keeps
    // rendering until the migration is applied. The {{advisor_first_name}}
    // token will fall back to "your advisor" until first_name is populated.
    let { data, error } = await supabase
      .from('agents')
      .select([...baseColumns, 'first_name'].join(', '))
      .eq('id', agentId)
      .single()

    if (error && /first_name/i.test(error.message ?? '')) {
      ;({ data, error } = await supabase
        .from('agents')
        .select(baseColumns.join(', '))
        .eq('id', agentId)
        .single())
    }

    if (error || !data) return null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row = data as any
    return {
      id: row.id,
      full_name: row.full_name,
      first_name: row.first_name ?? '',
      agency_name: row.agency_name,
      custom_domain: row.custom_domain ?? null,
      avatar_url: row.avatar_url ?? null,
      tagline: row.tagline ?? 'Curating the world\'s most extraordinary stays',
      email: row.email ?? '',
      phone: row.phone ?? '',
      tier: row.tier ?? null,
      bio: row.bio ?? undefined,
      instagram_url: row.instagram_url ?? undefined,
      facebook_url: row.facebook_url ?? undefined,
      youtube_url: row.youtube_url ?? undefined,
      tiktok_url: row.tiktok_url ?? undefined,
      website_url: row.website_url ?? undefined,
      travel_specialties: row.travel_specialties ?? undefined,
      destination_specialties: row.destination_specialties ?? undefined,
      preferred_suppliers: row.preferred_suppliers ?? undefined,
      travel_types: row.travel_types ?? undefined,
    }
  } catch {
    return null
  }
}

// ─── Supplier Selections ──────────────────────────────────────────────────────

export async function getAgentSuppliers(agentId: string): Promise<DisplaySupplier[]> {
  if (isDemo(agentId)) return MOCK_SUPPLIERS

  try {
    const supabase = createServiceClient()

    const { data, error } = await supabase
      .from('agent_supplier_selections')
      .select(`
        notes,
        global_suppliers (
          id, name, logo_url, description, supplier_type, virtuoso_perks, is_active
        )
      `)
      .eq('agent_id', agentId)

    if (error || !data) return []

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((row: any) => ({
      id: row.global_suppliers.id,
      name: row.global_suppliers.name,
      location: '',                          // Add a `location` column to the schema when ready
      description: row.global_suppliers.description ?? '',
      cover_image: row.global_suppliers.logo_url ?? '',
      supplier_type: row.global_suppliers.supplier_type ?? 'hotel',
      virtuoso_perks: row.global_suppliers.virtuoso_perks,
      is_active: row.global_suppliers.is_active,
    }))
  } catch {
    return MOCK_SUPPLIERS
  }
}
