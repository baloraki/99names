import type { ReviewGrade, SrsCard, SrsState, PromptType } from '@/types/srs'

export const MS_PER_DAY = 24 * 60 * 60 * 1000

export const DEFAULT_EASE_FACTOR = 2.5
export const MIN_EASE_FACTOR = 1.3
export const EASY_BONUS = 1.3

export function createCard(id: string, now: number = Date.now()): SrsCard {
  return {
    id,
    nextReviewDate: now,
    interval: 0,
    easeFactor: DEFAULT_EASE_FACTOR,
  }
}

export function reviewCard(card: SrsCard, grade: ReviewGrade, now: number = Date.now()): SrsCard {
  let interval: number
  let easeFactor: number

  if (grade === 'hard') {
    interval = 1
    easeFactor = Math.max(MIN_EASE_FACTOR, card.easeFactor - 0.2)
  } else if (grade === 'good') {
    if (card.interval <= 0) interval = 1
    else if (card.interval === 1) interval = 6
    else interval = Math.max(1, Math.ceil(card.interval * card.easeFactor))
    easeFactor = card.easeFactor
  } else {
    if (card.interval <= 0) interval = 4
    else if (card.interval === 1) interval = 6
    else interval = Math.max(1, Math.ceil(card.interval * card.easeFactor * EASY_BONUS))
    easeFactor = card.easeFactor + 0.1
  }

  return {
    id: card.id,
    interval,
    easeFactor,
    nextReviewDate: now + interval * MS_PER_DAY,
  }
}

export function isDue(card: SrsCard, now: number = Date.now()): boolean {
  return card.nextReviewDate <= now
}

export function emptyState(now: number = Date.now()): SrsState {
  return { cards: {}, promptPreference: 'random', updatedAt: now }
}

export function ensureCard(state: SrsState, id: string, now: number = Date.now()): SrsState {
  if (state.cards[id]) return state
  return {
    ...state,
    cards: { ...state.cards, [id]: createCard(id, now) },
    updatedAt: now,
  }
}

export function ensureCards(state: SrsState, ids: readonly string[], now: number = Date.now()): SrsState {
  let changed = false
  const cards = { ...state.cards }
  for (const id of ids) {
    if (!cards[id]) {
      cards[id] = createCard(id, now)
      changed = true
    }
  }
  if (!changed) return state
  return { ...state, cards, updatedAt: now }
}

export function applyReview(
  state: SrsState,
  id: string,
  grade: ReviewGrade,
  now: number = Date.now(),
): SrsState {
  const existing = state.cards[id] ?? createCard(id, now)
  const next = reviewCard(existing, grade, now)
  return {
    ...state,
    cards: { ...state.cards, [id]: next },
    updatedAt: now,
  }
}

export function dueCardIds(
  state: SrsState,
  candidateIds: readonly string[],
  now: number = Date.now(),
): string[] {
  return candidateIds.filter((id) => {
    const card = state.cards[id]
    if (!card) return true
    return isDue(card, now)
  })
}

export function setPromptPreference(state: SrsState, preference: SrsState['promptPreference'], now: number = Date.now()): SrsState {
  if (state.promptPreference === preference) return state
  return { ...state, promptPreference: preference, updatedAt: now }
}

export function pickPromptType(preference: SrsState['promptPreference'], rng: () => number = Math.random): PromptType {
  if (preference === 'random') return rng() < 0.5 ? 'meaning' : 'transliteration'
  return preference
}

const PROMPT_PREFERENCES: ReadonlyArray<SrsState['promptPreference']> = ['random', 'meaning', 'transliteration']

function isPromptPreference(value: unknown): value is SrsState['promptPreference'] {
  return typeof value === 'string' && PROMPT_PREFERENCES.includes(value as SrsState['promptPreference'])
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isCard(value: unknown): value is SrsCard {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.id === 'string' &&
    isFiniteNumber(candidate.nextReviewDate) &&
    isFiniteNumber(candidate.interval) &&
    isFiniteNumber(candidate.easeFactor)
  )
}

export function parseSrsState(value: unknown, now: number = Date.now()): SrsState {
  if (!value || typeof value !== 'object') return emptyState(now)
  const raw = value as Record<string, unknown>
  const cards: Record<string, SrsCard> = {}
  if (raw.cards && typeof raw.cards === 'object') {
    for (const [key, candidate] of Object.entries(raw.cards as Record<string, unknown>)) {
      if (isCard(candidate)) cards[key] = candidate
    }
  }
  return {
    cards,
    promptPreference: isPromptPreference(raw.promptPreference) ? raw.promptPreference : 'random',
    updatedAt: isFiniteNumber(raw.updatedAt) ? raw.updatedAt : now,
  }
}
