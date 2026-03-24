import { createServiceClient } from '@/lib/supabase/service'
import { PostEditor } from '@/components/admin/PostEditor'

export const dynamic = 'force-dynamic'

async function getAgents() {
  const supabase = createServiceClient()
  const { data } = await supabase.from('agents').select('id, agency_name, name').order('agency_name')
  return data ?? []
}

export default async function NewPostPage() {
  const agents = await getAgents()
  return <PostEditor agents={agents} isNew />
}
