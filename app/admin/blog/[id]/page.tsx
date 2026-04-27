import { getAdminPost } from '@/lib/blog'
import { getAllCategories } from '@/lib/blog-categories'
import { getAllSupplierTagOptions } from '@/lib/supplier-tags'
import { createServiceClient } from '@/lib/supabase/service'
import { PostEditor } from '@/components/admin/PostEditor'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

async function getAgents() {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('agents')
    .select('id, agency_name, full_name')
    .order('agency_name', { ascending: true })
  return (data ?? []) as { id: string; agency_name: string; full_name: string }[]
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params
  const [post, agents, categories, suppliers] = await Promise.all([
    getAdminPost(id), 
    getAgents(),
    getAllCategories(),
    getAllSupplierTagOptions(),
  ])
  if (!post) notFound()
  return <PostEditor post={post} agents={agents} categories={categories} suppliers={suppliers} />
}
