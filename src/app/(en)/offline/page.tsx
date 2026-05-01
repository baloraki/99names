import type { Metadata } from 'next'
import { TranslatedLegalPage } from '@/components/TranslatedLegalPage'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Offline – 99 Names Learning Aid',
  description: 'Offline fallback page for cached 99 Names learning aid content and locally bundled name data.',
  path: '/offline',
  locale: 'en',
})

export default function OfflinePage() {
  return <TranslatedLegalPage kind="offline" />
}
