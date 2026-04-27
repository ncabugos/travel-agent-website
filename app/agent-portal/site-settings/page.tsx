import { createServerClient } from '@/lib/supabase/server'
import {
  getHotelPrograms,
  getAgentHotelProgramSelections,
} from '@/lib/hotel-programs'
import { HotelProgramsForm } from './HotelProgramsForm'

export const dynamic = 'force-dynamic'

/**
 * /agent-portal/site-settings — agent self-serve curation of which Hotel
 * Programs appear on their public website (homepage teaser + /book-hotel
 * index + /experiences page).
 */
export default async function SiteSettingsPage() {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  // Resolve the agent by session email (middleware has already blocked
  // unauthed access, but handle the edge case anyway).
  const { data: agentRaw } = await supabase
    .from('agents')
    .select('id')
    .eq('email', session?.user.email ?? '')
    .maybeSingle()
  const agent = agentRaw as { id: string } | null

  const [allPrograms, selections] = await Promise.all([
    getHotelPrograms(),
    agent?.id ? getAgentHotelProgramSelections(agent.id) : Promise.resolve([]),
  ])

  const initiallySelected = selections
    .filter((s) => s.is_enabled)
    .map((s) => s.program_id)

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1100, margin: '0 auto' }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#111' }}>
          Site Settings
        </h1>
        <p style={{ margin: '6px 0 0', color: '#6b7280', fontSize: 14, maxWidth: 720 }}>
          Curate which exclusive Hotel Programs appear on your public website. These are
          the invite-only agency programs (Four Seasons Preferred Partner, Aman, Rosewood
          Elite, etc.) — not the individual hotel properties. Select only the programs
          you are formally authorized to promote. Leave empty to show the global
          catalogue.
        </p>
      </header>

      <section style={{ marginBottom: 16 }}>
        <h2 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 600, color: '#111' }}>
          Hotel Programs
        </h2>
        {agent?.id ? (
          <HotelProgramsForm
            allPrograms={allPrograms.map((p) => ({
              id: p.id,
              name: p.name,
              tagline: p.tagline,
              description: p.description,
              category: p.category,
            }))}
            initiallySelected={initiallySelected}
          />
        ) : (
          <p
            style={{
              padding: 16,
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 8,
              fontSize: 13,
              color: '#991b1b',
            }}
          >
            No agent record is linked to your email yet. Please contact your
            administrator to complete your account setup.
          </p>
        )}
      </section>
    </div>
  )
}
