import type { Metadata } from 'next'
import { PrivacyPageContent } from '@/components/PrivacyPageContent'
import { buildMetadata, staticPageAlternates } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Datenschutzerklärung – 99 Namen Lernhilfe',
  description:
    'Datenschutzerklärung der 99-Namen-Lernhilfe mit Informationen zu localStorage, Analytics, Kontaktformular und Push-Erinnerungen.',
  path: '/de/datenschutz',
  locale: 'de',
  alternates: staticPageAlternates('privacy'),
})

export default function GermanPrivacyPage() {
  return <PrivacyPageContent />
}

