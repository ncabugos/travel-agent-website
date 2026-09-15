import Link from 'next/link'
import { TopBar } from '@/components/dashboard/TopBar'
import { PageContent } from '@/components/dashboard/DashboardShell'
import { PillarsEditor } from '@/components/admin/PillarsEditor'
import { getCategories } from '@/lib/marketing-blog'

export const dynamic = 'force-dynamic'

export default async function InsightsCategoriesPage() {
  const rows = await getCategories(false)

  return (
    <>
      <TopBar
        title="Content pillars"
        subtitle="Posts map to one pillar each; pillars become the Insights category filters and archive pages"
        actions={
          <Link href="/admin/insights" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none' }}>
            ← Insights
          </Link>
        }
      />
      <PageContent maxWidth="920px">
        <PillarsEditor initialRows={rows} />
      </PageContent>
    </>
  )
}
