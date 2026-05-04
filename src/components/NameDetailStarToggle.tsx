'use client'

import { useAppState } from '@/hooks/useAppState'
import type { Language } from '@/types/language'
import { StarToggle } from './StarToggle'

const labels = {
  en: {
    addFavorite: 'Favorite',
    removeFavorite: 'Remove favorite',
  },
  de: {
    addFavorite: 'Favorit',
    removeFavorite: 'Favorit entfernen',
  },
  tr: {
    addFavorite: 'Favori',
    removeFavorite: 'Favoriden kaldır',
  },
} as const

export function NameDetailStarToggle({ nameId, locale }: { nameId: number; locale: Language }) {
  const { progress, actions } = useAppState()
  const text = labels[locale]
  const favorite = progress.favoriteIds.includes(nameId)

  return (
    <StarToggle
      active={favorite}
      onToggle={() => actions.toggleFavorite(nameId)}
      labelAdd={text.addFavorite}
      labelRemove={text.removeFavorite}
    />
  )
}
