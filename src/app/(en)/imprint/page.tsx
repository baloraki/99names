import type { Metadata } from 'next'
import { TranslatedLegalPage } from '@/components/TranslatedLegalPage'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Imprint – 99 Names Learning Aid',
  description: 'Imprint page for the 99 Names learning aid. Operator details must be completed before publication.',
  path: '/imprint',
  locale: 'en',
})

export default function ImprintPage() {
  return <TranslatedLegalPage kind="imprint" />
}
