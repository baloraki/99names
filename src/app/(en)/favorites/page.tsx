import type { Metadata } from 'next'
import { FavoritesClient } from '@/components/FavoritesClient'
import { buildMetadata, favoritesAlternates } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Favorites – 99 Names Learning Aid',
  description: 'Your saved 99 Names of Allah. Revisit the names you starred for personal study and reflection.',
  path: '/favorites',
  locale: 'en',
  alternates: favoritesAlternates(),
  index: false,
})

export default function FavoritesPage() {
  return <FavoritesClient locale="en" />
}
