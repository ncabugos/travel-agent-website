import { getCategories } from '@/lib/marketing-blog'
import { MarketingPostEditor } from '@/components/admin/MarketingPostEditor'

export const dynamic = 'force-dynamic'

export default async function NewInsightsPostPage() {
  const categories = await getCategories(false)
  return <MarketingPostEditor categories={categories} isNew />
}
