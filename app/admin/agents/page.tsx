import { AgentsTable, type AdminAgentRow } from '@/components/admin/AgentsTable'
import { getAllAgents } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export default async function AdminAgentsPage() {
  const agents = (await getAllAgents()) as AdminAgentRow[]
  return <AgentsTable initialAgents={agents} />
}
