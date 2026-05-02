import type { Metadata } from 'next'
import { ImprintPageContent } from '@/components/ImprintPageContent'
import { buildMetadata, staticPageAlternates } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Impressum – 99 Namen Lernhilfe',
  description:
    'Rechtliche Anbieterkennzeichnung (Impressum) für die 99-Namen-Lernhilfe gemäß deutschem Recht.',
  path: '/de/impressum',
  locale: 'de',
  alternates: staticPageAlternates('imprint'),
  index: false,
})

export default function GermanImprintPage() {
  return <ImprintPageContent />
}

