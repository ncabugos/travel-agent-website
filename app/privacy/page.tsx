import type { Metadata } from 'next'
import { LegalDocPage } from '@/components/legal/LegalDocPage'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Elite Advisor Hub, LLC collects, uses, and protects information about visitors and customers of EliteAdvisorHub.',
}

export default function PrivacyPage() {
  return <LegalDocPage file="privacy-policy.md" pageTitle="Privacy Policy" />
}
