import type { Metadata } from 'next'
import { ImprintPageContent } from '@/components/ImprintPageContent'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Imprint / Impressum – 99 Names Learning Aid',
  description: 'Legal notice (Impressum) for the 99 Names of Allah learning aid, pursuant to § 5 TMG and § 18 Abs. 2 MStV.',
  path: '/imprint',
  locale: 'en',
  index: false,
})

export default function ImprintPage() {
  return <ImprintPageContent />
}
