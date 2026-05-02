import type { Metadata } from 'next'
import { PrivacyPageContent } from '@/components/PrivacyPageContent'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy / Datenschutzerklärung – 99 Names Learning Aid',
  description:
    'GDPR-compliant privacy policy for the 99 Names of Allah learning aid. Covers localStorage, Vercel Analytics, Web3Forms contact, and no cookies.',
  path: '/privacy',
  locale: 'en',
})

export default function PrivacyPage() {
  return <PrivacyPageContent />
}
