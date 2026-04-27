// app/admin/categories/[id]/page.tsx
import { createServiceClient } from '@/lib/supabase/service'
import { notFound } from 'next/navigation'
import { CategoryEditor } from '@/components/admin/CategoryEditor'

export const dynamic = 'force-dynamic'

async function getCategory(id: string) {
  if (id === 'new') return null
  const supabase = createServiceClient()
  const { data } = await supabase.from('blog_categories').select('*').eq('id', id).single()
  return data
}

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const category = await getCategory(id)
  
  if (id !== 'new' && !category) notFound()

  return <CategoryEditor category={category} isNew={id === 'new'} />
}
