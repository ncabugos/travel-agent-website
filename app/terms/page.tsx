import type { Metadata } from 'next'
import { LegalDocPage } from '@/components/legal/LegalDocPage'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms of Service for the EliteAdvisorHub platform, operated by Elite Advisor Hub, LLC.',
}

export default function TermsPage() {
  return <LegalDocPage file="terms-and-conditions.md" pageTitle="Terms of Service" />
}
