import { TopBar } from '@/components/dashboard/TopBar'
import { PageContent } from '@/components/dashboard/DashboardShell'
import { JournalPostsList, type AgentOption } from '@/components/admin/JournalPostsList'
import { createServiceClient } from '@/lib/supabase/service'
import type { BlogPost } from '@/types/index'

export const dynamic = 'force-dynamic'

const POST_COLUMNS =
  'id, agent_id, title, slug, published_at, excerpt, status, is_broadcast, target_agent_ids'

/**
 * Admin journal list. The agency filter lives in the URL (?agent_id=) so the
 * server renders the right rows on first paint and the filter survives reloads.
 */
export default async function AdminBlogPage({ searchParams }: { searchParams: Promise<{ agent_id?: string }> }) {
  const { agent_id: agentId = '' } = await searchParams
  const supabase = createServiceClient()

  let postsQuery = supabase.from('blog_posts').select(POST_COLUMNS).order('published_at', { ascending: false })
  if (agentId) postsQuery = postsQuery.eq('agent_id', agentId)

  const [{ data: posts }, { data: agents }] = await Promise.all([
    postsQuery,
    supabase.from('agents').select('id, agency_name, full_name').order('agency_name'),
  ])

  const agentList = (agents ?? []) as AgentOption[]
  const postList = (posts ?? []) as unknown as BlogPost[]
  const selected = agentId ? agentList.find(a => a.id === agentId) : undefined

  const published = postList.filter(p => p.status === 'published' && !p.is_broadcast).length
  const drafts = postList.filter(p => p.status === 'draft').length
  const broadcast = postList.filter(p => p.is_broadcast).length

  return (
    <>
      <TopBar
        title={selected ? `${selected.agency_name ?? 'Unknown'} journal` : 'Journal Posts'}
        subtitle={`${published} published · ${drafts} draft${drafts !== 1 ? 's' : ''} · ${broadcast} broadcast`}
      />
      <PageContent>
        <JournalPostsList initialPosts={postList} agents={agentList} selectedAgentId={agentId} />
      </PageContent>
    </>
  )
}
