import type { Metadata } from 'next'
import { NameIndexContent } from '@/components/NameIndexContent'
import { buildMetadata, namesAlternates } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: "Esmaül Hüsna Anlamları – Allah'ın 99 İsmi Arapça ve Türkçe",
  description: "Allah'ın 99 ismini Arapça yazım, transliterasyon, Türkçe anlam, dua kullanımı, tefekkür ve kaynak notlarıyla incele.",
  path: '/tr/esmaul-husna',
  locale: 'tr',
  alternates: namesAlternates(),
})

export default function TurkishNamesPage() {
  return <NameIndexContent locale="tr" />
}
