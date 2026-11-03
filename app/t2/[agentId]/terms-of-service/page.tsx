import { notFound } from 'next/navigation'
import { getAgentProfile } from '@/lib/suppliers'
import { buildMetadata } from '@/lib/seo'
import { TenantLegalDocPage } from '@/components/legal/TenantLegalDocPage'

interface PageProps {
  params: Promise<{ agentId: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { agentId } = await params
  const agent = await getAgentProfile(agentId)
  if (!agent) return { title: 'Terms of Service' }
  return buildMetadata({
    agent,
    title: 'Terms of Service',
    description: `Terms of Service for ${agent.agency_name} — booking, cancellation, liability and website use terms.`,
    path: 'terms-of-service',
  })
}

export default async function TermsOfServicePage({ params }: PageProps) {
  const { agentId } = await params
  const agent = await getAgentProfile(agentId)
  if (!agent) notFound()

  // t2 navs are fixed, so offset the document below them.
  return (
    <div style={{ paddingTop: 'calc(var(--eah-banner-h, 0px) + 80px)' }}>
      <TenantLegalDocPage
        agentId={agentId}
        file="terms-of-service.md"
        pageTitle="Terms of Service"
      />
    </div>
  )
}
