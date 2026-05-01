import type { ProgressState } from '@/types/progress'

export function markLearned(state: ProgressState, id: number): ProgressState {
  if (state.learnedIds.includes(id)) return state
  return {
    ...state,
    learnedIds: [...state.learnedIds, id],
    updatedAt: new Date().toISOString(),
  }
}

export function unmarkLearned(state: ProgressState, id: number): ProgressState {
  return {
    ...state,
    learnedIds: state.learnedIds.filter(x => x !== id),
    updatedAt: new Date().toISOString(),
  }
}

export function toggleFavorite(state: ProgressState, id: number): ProgressState {
  const isFav = state.favoriteIds.includes(id)
  return {
    ...state,
    favoriteIds: isFav ? state.favoriteIds.filter(x => x !== id) : [...state.favoriteIds, id],
    updatedAt: new Date().toISOString(),
  }
}

export function getProgressPercentage(state: ProgressState): number {
  return Math.round((state.learnedIds.length / 99) * 100)
}
