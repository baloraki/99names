import type { Metadata } from 'next'
import { ContactPageClient } from '@/components/ContactPageClient'
import { buildMetadata, staticPageAlternates } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Kontakt – 99 Namen Lernhilfe',
  description:
    'Kontakt zur 99-Namen-Lernhilfe für Korrekturen, Quellenhinweise oder technisches Feedback.',
  path: '/de/kontakt',
  locale: 'de',
  alternates: staticPageAlternates('contact'),
})

export default function GermanContactPage() {
  return <ContactPageClient />
}

