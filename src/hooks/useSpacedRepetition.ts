'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { storage } from '@/lib/storage'
import {
  applyReview,
  dueCardIds,
  emptyState,
  ensureCards,
  setPromptPreference as setPromptPreferenceFn,
} from '@/lib/srs'
import type { ReviewGrade, SrsCard, SrsState } from '@/types/srs'

export type UseSpacedRepetitionResult = {
  ready: boolean
  state: SrsState
  dueIds: string[]
  totalDue: number
  totalCards: number
  getCard: (id: string) => SrsCard | undefined
  review: (id: string, grade: ReviewGrade) => void
  setPromptPreference: (preference: SrsState['promptPreference']) => void
  reset: () => void
}

export function useSpacedRepetition(allIds: readonly string[]): UseSpacedRepetitionResult {
  const [ready, setReady] = useState(false)
  const [state, setState] = useState<SrsState>(() => emptyState(0))
  const [now, setNow] = useState<number>(0)

  const idsKey = useMemo(() => allIds.join(','), [allIds])

  useEffect(() => {
    queueMicrotask(() => {
      const stamp = Date.now()
      const stored = storage.getSrsState()
      const seeded = ensureCards(stored, allIds, stamp)
      if (seeded !== stored) storage.setSrsState(seeded)
      setState(seeded)
      setNow(stamp)
      setReady(true)
    })
    // We intentionally re-seed when the set of IDs changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey])

  useEffect(() => {
    if (!ready) return
    const tick = () => setNow(Date.now())
    const interval = window.setInterval(tick, 60_000)
    const onVisibility = () => {
      if (document.visibilityState === 'visible') tick()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [ready])

  const dueIds = useMemo(() => {
    if (!ready) return []
    return dueCardIds(state, allIds, now)
  }, [ready, state, allIds, now])

  const review = useCallback((id: string, grade: ReviewGrade) => {
    const stamp = Date.now()
    setState((current) => {
      const next = applyReview(current, id, grade, stamp)
      storage.setSrsState(next)
      return next
    })
    setNow(stamp)
  }, [])

  const setPromptPreference = useCallback((preference: SrsState['promptPreference']) => {
    const stamp = Date.now()
    setState((current) => {
      const next = setPromptPreferenceFn(current, preference, stamp)
      if (next !== current) storage.setSrsState(next)
      return next
    })
  }, [])

  const reset = useCallback(() => {
    const stamp = Date.now()
    const fresh = ensureCards(emptyState(stamp), allIds, stamp)
    storage.setSrsState(fresh)
    setState(fresh)
    setNow(stamp)
  }, [allIds])

  const getCard = useCallback((id: string) => state.cards[id], [state])

  return {
    ready,
    state,
    dueIds,
    totalDue: dueIds.length,
    totalCards: allIds.length,
    getCard,
    review,
    setPromptPreference,
    reset,
  }
}
