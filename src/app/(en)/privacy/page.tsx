import type { Metadata } from 'next'
import { TranslatedLegalPage } from '@/components/TranslatedLegalPage'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Privacy – 99 Names Learning Aid',
  description: 'Privacy notes for the 99 Names learning aid, including local browser storage, contact form handling and no analytics tracking.',
  path: '/privacy',
  locale: 'en',
})

export default function PrivacyPage() {
  return <TranslatedLegalPage kind="privacy" />
}
