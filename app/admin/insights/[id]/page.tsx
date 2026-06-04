import { notFound } from 'next/navigation'
import { getAdminPost, getCategories } from '@/lib/marketing-blog'
import { MarketingPostEditor } from '@/components/admin/MarketingPostEditor'

export const dynamic = 'force-dynamic'

export default async function EditInsightsPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [post, categories] = await Promise.all([getAdminPost(id), getCategories(false)])
  if (!post) notFound()
  return <MarketingPostEditor post={post} categories={categories} />
}
