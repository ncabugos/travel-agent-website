import { createServiceClient } from '@/lib/supabase/service'

const VALID_GA_ID = /^G-[A-Z0-9]{4,}$/
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Demo fixtures resolve to mock agents (no DB row), so map their GA IDs here.
// `demo-agent` is the Eden For Your World demo, which mirrors the live site.
const DEMO_GA: Record<string, string> = {
  'demo-agent': 'G-BJK7FMBR0J',
}

/**
 * Returns the advisor's own GA4 measurement ID, or null if none is set.
 *
 * Reads `agents.ga_measurement_id` with a service-role client. Deliberately
 * isolated from getAgentProfile so a missing column (pre-migration) or any
 * query error degrades to null WITHOUT breaking the tenant page — the site
 * keeps rendering, it just won't fire the per-advisor property until the
 * migration lands and an ID is set.
 */
export async function getAgentGaMeasurementId(agentId: string): Promise<string | null> {
  if (DEMO_GA[agentId]) return DEMO_GA[agentId]
  // Non-UUID ids are demo slugs with no DB row — skip the roundtrip.
  if (!UUID.test(agentId)) return null

  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('agents')
      .select('ga_measurement_id')
      .eq('id', agentId)
      .single()

    if (error || !data) return null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const id = (data as any).ga_measurement_id as string | null
    return id && VALID_GA_ID.test(id) ? id : null
  } catch {
    return null
  }
}
