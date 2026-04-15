// app/agent-portal/blog/[id]/page.tsx
import { createServerClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { PostEditor } from '@/components/admin/PostEditor'
import { notFound, redirect } from 'next/navigation'
import { getAllCategories } from '@/lib/blog-categories'

export const dynamic = 'force-dynamic'

export default async function AgentEditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabaseAuth = await createServerClient()
  const { data: { session } } = await supabaseAuth.auth.getSession()
  if (!session) redirect('/agent-portal/login')

  const supabaseService = createServiceClient()
  const { data: agentRaw } = await supabaseService
    .from('agents')
    .select('*')
    .eq('email', session.user.email ?? '')
    .single()

  const agent = agentRaw as { id: string; full_name: string; agency_name: string } | null
  if (!agent) return notFound()

  // Provide their own specific options to the editor
  const agentOption = { id: agent.id, name: agent.full_name, agency_name: agent.agency_name }
  const categories = await getAllCategories()

  if (id === 'new') {
    return (
      <div style={{ padding: '0 16px' }}>
        <PostEditor agents={[agentOption]} categories={categories} isNew mode="agent" />
      </div>
    )
  }

  // Edit existing
  const { data: postRaw } = await supabaseService
    .from('blog_posts')
    .select('*, blog_post_categories(category_id)')
    .eq('id', id)
    .eq('agent_id', agent.id)
    .single()

  const post = postRaw as Record<string, any> | null
  if (!post) return notFound()

  const formattedPost = {
    ...post,
    category_ids: post.blog_post_categories?.map((c: any) => c.category_id) || []
  }

  return (
    <div style={{ padding: '0 16px' }}>
      <PostEditor post={formattedPost as any} agents={[agentOption]} categories={categories} mode="agent" />
    </div>
  )
}
