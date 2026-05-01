'use client'

import { useEffect } from 'react'
import { useAppState } from '@/hooks/useAppState'
import { getDict } from '@/lib/i18n'
import type { Language } from '@/types/language'
import type { NameEntry } from '@/types/name'

export function NameProgressActions({ name, language }: { name: NameEntry; language: Language }) {
  const { progress, actions } = useAppState()
  const dict = getDict(language)
  const learned = progress.learnedIds.includes(name.id)
  const favorite = progress.favoriteIds.includes(name.id)

  useEffect(() => {
    actions.setLastViewed(name.slug)
  }, [actions, name.slug])

  return (
    <div className="flex flex-wrap gap-3">
      <button
        className={learned ? 'btn-secondary' : 'btn-primary'}
        onClick={() => learned ? actions.unmarkLearned(name.id) : actions.markLearned(name.id, name.slug)}
      >
        {learned ? dict.detail.markOpen : dict.detail.markLearned}
      </button>
      <button className="btn-secondary" onClick={() => actions.toggleFavorite(name.id)}>
        {favorite ? dict.detail.removeFavorite : dict.detail.addFavorite}
      </button>
    </div>
  )
}
