import type { Metadata } from 'next'
import { FavoritesClient } from '@/components/FavoritesClient'
import { buildMetadata, favoritesAlternates } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Favoriler – 99 İsim Öğrenme Yardımı',
  description: "Kaydettiğin 99 ism-i şerifi burada bulabilirsin. Yıldızladığın isimleri kişisel tefekkür için tekrar gözden geçir.",
  path: '/tr/favoriler',
  locale: 'tr',
  alternates: favoritesAlternates(),
  index: false,
})

export default function TurkishFavoritesPage() {
  return <FavoritesClient locale="tr" />
}
