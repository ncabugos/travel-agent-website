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

  return (
    <TenantLegalDocPage
      agentId={agentId}
      file="terms-of-service.md"
      pageTitle="Terms of Service"
    />
  )
}
