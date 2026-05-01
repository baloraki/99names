import type { Metadata } from 'next'
import { ContactPageClient } from '@/components/ContactPageClient'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Contact 99 Names Learning Aid',
  description: 'Contact the 99 Names learning aid team about content review, corrections, source notes or technical feedback.',
  path: '/contact',
  locale: 'en',
})

export default function ContactPage() {
  return <ContactPageClient />
}
