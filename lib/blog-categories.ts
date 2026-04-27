import { createServiceClient } from '@/lib/supabase/service'
import type { BlogCategory } from '@/types/index'

export async function getAllCategories(): Promise<BlogCategory[]> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error || !data) return []
  return data
}

export async function getAgentCategoryPreferences(agentId: string): Promise<string[]> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('agent_blog_preferences')
    .select('category_id')
    .eq('agent_id', agentId)
    .eq('is_enabled', true)

  if (error || !data) return []
  return data.map((row) => row.category_id)
}

export async function setAgentCategoryPreference(agentId: string, categoryId: string, isEnabled: boolean) {
  const supabase = createServiceClient()
  const { error } = await supabase
    .from('agent_blog_preferences')
    .upsert({
      agent_id: agentId,
      category_id: categoryId,
      is_enabled: isEnabled
    })
  return !error
}
