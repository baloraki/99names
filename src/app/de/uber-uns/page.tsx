import type { Metadata } from 'next'
import { AboutPageContent } from '@/components/AboutPageContent'
import { buildMetadata, staticPageAlternates } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Über uns – 99 Namen Lernhilfe',
  description:
    'Über diese Lernhilfe für die 99 Namen Allahs mit Quellenangaben, theologischer Einordnung und Kontaktmöglichkeit.',
  path: '/de/uber-uns',
  locale: 'de',
  alternates: staticPageAlternates('about'),
})

export default function GermanAboutPage() {
  return <AboutPageContent />
}

