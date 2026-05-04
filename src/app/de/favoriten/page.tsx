import type { Metadata } from 'next'
import { FavoritesClient } from '@/components/FavoritesClient'
import { buildMetadata, favoritesAlternates } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Favoriten – 99 Namen Lernhilfe',
  description: 'Deine gespeicherten 99 Namen Allahs. Greife auf die Namen zu, die du für dein persönliches Lernen markiert hast.',
  path: '/de/favoriten',
  locale: 'de',
  alternates: favoritesAlternates(),
  index: false,
})

export default function GermanFavoritesPage() {
  return <FavoritesClient locale="de" />
}
