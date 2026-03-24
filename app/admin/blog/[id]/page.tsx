import { getAdminPost } from '@/lib/blog'
import { createServiceClient } from '@/lib/supabase/service'
import { PostEditor } from '@/components/admin/PostEditor'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

async function getAgents() {
  const supabase = createServiceClient()
  const { data } = await supabase.from('agents').select('id, agency_name, name').order('agency_name')
  return data ?? []
}

interface Props { params: Promise<{ id: string }> }

export default async function EditPostPage({ params }: Props) {
  const { id } = await params
  const [post, agents] = await Promise.all([getAdminPost(id), getAgents()])
  if (!post) notFound()
  return <PostEditor post={post} agents={agents} />
}
