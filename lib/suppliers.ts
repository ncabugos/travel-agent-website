import { MOCK_AGENT, MOCK_SUPPLIERS, type DisplaySupplier, type MockAgent } from '@/lib/mock-data'
import { createServiceClient } from '@/lib/supabase/service'

const DEMO_ID = 'demo-agent'
const isDemo = (agentId: string) =>
  agentId === DEMO_ID || !process.env.NEXT_PUBLIC_SUPABASE_URL

// ─── Agent Profile ────────────────────────────────────────────────────────────

export async function getAgentProfile(agentId: string): Promise<MockAgent | null> {
  if (isDemo(agentId)) return MOCK_AGENT

  try {
    const supabase = createServiceClient()

    const { data, error } = await supabase
      .from('agents')
      .select('id, full_name, agency_name, custom_domain, avatar_url')
      .eq('id', agentId)
      .single()

    if (error || !data) return null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row = data as any
    return {
      id: row.id,
      full_name: row.full_name,
      agency_name: row.agency_name,
      custom_domain: row.custom_domain ?? null,
      avatar_url: row.avatar_url ?? null,
      tagline: 'Curating the world\'s most extraordinary stays',
      email: '',
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
