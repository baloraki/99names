import type { Metadata } from 'next'
import { QuizSession } from '@/components/QuizSession'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Spaced Repetition Quiz – 99 Names of Allah',
  description:
    'Practice the 99 Names of Allah with an active recall quiz. Cards resurface on a spaced-repetition schedule based on how well you recalled each name.',
  path: '/learn/quiz',
  locale: 'en',
  index: false,
})

export default function LearnQuizPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <QuizSession locale="en" />
    </div>
  )
}
