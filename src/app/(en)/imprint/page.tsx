import type { Metadata } from 'next'
import { ImprintPageContent } from '@/components/ImprintPageContent'
import { buildMetadata, staticPageAlternates } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Imprint / Impressum – 99 Names Learning Aid',
  description: 'Legal notice (Impressum) for the 99 Names of Allah learning aid.',
  path: '/imprint',
  locale: 'en',
  alternates: staticPageAlternates('imprint'),
  index: false,
})

export default function ImprintPage() {
  return <ImprintPageContent />
}
