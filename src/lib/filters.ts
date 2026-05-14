import type { NameEntry } from '@/types/name'

export type FilterOptions = {
  learnedIds?: number[]
  favoriteIds?: number[]
  showLearned?: boolean
  showFavorites?: boolean
  showUnlearned?: boolean
}

export function filterNames(names: NameEntry[], opts: FilterOptions): NameEntry[] {
  const { learnedIds = [], favoriteIds = [], showLearned, showFavorites, showUnlearned } = opts
  if (!showLearned && !showFavorites && !showUnlearned) return names

  const learnedSet = new Set(learnedIds)
  const favoriteSet = new Set(favoriteIds)

  return names.filter((name) => {
    const isLearned = learnedSet.has(name.id)
    const isFavorite = favoriteSet.has(name.id)
    if (showFavorites && isFavorite) return true
    if (showLearned && isLearned) return true
    if (showUnlearned && !isLearned) return true
    return false
  })
}
