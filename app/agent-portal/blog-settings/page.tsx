// app/agent-portal/blog-settings/page.tsx
import { createServerClient } from '@/lib/supabase/server'
import { getAllCategories } from '@/lib/blog-categories'
import { CategoryOptsForm } from './CategoryOptsForm'

export const dynamic = 'force-dynamic'

export default async function AgentBlogSettingsPage() {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  const { data: agentRaw } = await supabase
    .from('agents')
    .select('*')
    .eq('email', session?.user.email ?? '')
    .single()

  const agent = agentRaw as { id: string } | null

  const { data: prefsRaw } = await supabase
    .from('agent_blog_preferences')
    .select('category_id')
    .eq('agent_id', agent?.id ?? '')
    .eq('is_enabled', true)

  const preferences = prefsRaw as { category_id: string }[] | null
  const enabledIds = preferences?.map(p => p.category_id) || []
  const allCategories = await getAllCategories()

  return (
    <div style={{ padding: '32px 40px', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#111' }}>Blog Topic Subscriptions</h1>
        <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '14px' }}>
          Select which content topics you want broadcasted to your website journal automatically.
        </p>
      </header>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <CategoryOptsForm 
          agentId={agent!.id} 
          categories={allCategories.filter(c => c.is_active)} 
          initialPreferences={enabledIds} 
        />
      </div>
    </div>
  )
}
