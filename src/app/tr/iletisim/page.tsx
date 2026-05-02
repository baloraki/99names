import type { Metadata } from 'next'
import { ContactPageClient } from '@/components/ContactPageClient'
import { buildMetadata, staticPageAlternates } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: "İletişim – Allah'ın 99 İsmi Öğrenme Yardımı",
  description:
    '99 isim öğrenme yardımı için düzeltme, kaynak önerisi veya teknik geri bildirim gönderebilirsiniz.',
  path: '/tr/iletisim',
  locale: 'tr',
  alternates: staticPageAlternates('contact'),
})

export default function TurkishContactPage() {
  return <ContactPageClient />
}


