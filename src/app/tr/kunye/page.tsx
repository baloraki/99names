import type { Metadata } from 'next'
import { ImprintPageContent } from '@/components/ImprintPageContent'
import { buildMetadata, staticPageAlternates } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: "Künye – Allah'ın 99 İsmi Öğrenme Yardımı",
  description:
    '99 isim öğrenme yardımı için yasal bildirim ve sorumlu kişi bilgileri.',
  path: '/tr/kunye',
  locale: 'tr',
  alternates: staticPageAlternates('imprint'),
  index: false,
})

export default function TurkishImprintPage() {
  return <ImprintPageContent />
}


