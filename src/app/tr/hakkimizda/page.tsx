import type { Metadata } from 'next'
import { AboutPageContent } from '@/components/AboutPageContent'
import { buildMetadata, staticPageAlternates } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: "Hakkımızda – Allah'ın 99 İsmi Öğrenme Yardımı",
  description:
    'Bu 99 isim öğrenme yardımının amacı, kaynak yaklaşımı ve iletişim bilgileri hakkında bilgi edinin.',
  path: '/tr/hakkimizda',
  locale: 'tr',
  alternates: staticPageAlternates('about'),
})

export default function TurkishAboutPage() {
  return <AboutPageContent />
}


