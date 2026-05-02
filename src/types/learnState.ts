export type LearnMode = 'card' | 'list'

export type LearnState = {
  mode: LearnMode
  shuffle: boolean
  repeatIds: number[]
  streakCount: number
  lastLearnedDate: string
}
