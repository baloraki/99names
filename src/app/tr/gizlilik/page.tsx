import type { Metadata } from 'next'
import { PrivacyPageContent } from '@/components/PrivacyPageContent'
import { buildMetadata, staticPageAlternates } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: "Gizlilik Politikası – Allah'ın 99 İsmi Öğrenme Yardımı",
  description:
    '99 isim öğrenme yardımının gizlilik politikası: localStorage, analitik ve iletişim formu.',
  path: '/tr/gizlilik',
  locale: 'tr',
  alternates: staticPageAlternates('privacy'),
})

export default function TurkishPrivacyPage() {
  return <PrivacyPageContent />
}


