export type ReviewGrade = 'hard' | 'good' | 'easy'

export type PromptType = 'meaning' | 'transliteration'

export type SrsCard = {
  id: string
  nextReviewDate: number
  interval: number
  easeFactor: number
}

export type SrsState = {
  cards: Record<string, SrsCard>
  promptPreference: PromptType | 'random'
  updatedAt: number
}
