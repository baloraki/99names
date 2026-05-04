import type { Metadata } from 'next'
import { QuizSession } from '@/components/QuizSession'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Spaced-Repetition-Quiz – 99 Namen Allahs',
  description:
    'Übe die 99 Namen Allahs mit einem aktiven Wiederholungsquiz. Karten tauchen nach einem Spaced-Repetition-Plan wieder auf, je nachdem wie gut du dich erinnert hast.',
  path: '/de/lernen/quiz',
  locale: 'de',
  index: false,
})

export default function DeLernQuizPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <QuizSession locale="de" />
    </div>
  )
}
