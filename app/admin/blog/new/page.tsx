import { createServiceClient } from '@/lib/supabase/service'
import { getAllCategories } from '@/lib/blog-categories'
import { getAllSupplierTagOptions } from '@/lib/supplier-tags'
import { PostEditor } from '@/components/admin/PostEditor'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ agent_id?: string }>
}

async function getAgents() {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('agents')
    .select('id, agency_name, full_name')
    .order('agency_name', { ascending: true })
  return (data ?? []) as { id: string; agency_name: string; full_name: string }[]
}

export default async function NewPostPage({ searchParams }: PageProps) {
  const [{ agent_id: defaultAgentId }, agents, categories, suppliers] = await Promise.all([
    searchParams,
    getAgents(),
    getAllCategories(),
    getAllSupplierTagOptions(),
  ])
  return (
    <PostEditor
      agents={agents}
      categories={categories}
      suppliers={suppliers}
      defaultAgentId={defaultAgentId}
      isNew
    />
  )
}
