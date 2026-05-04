import type { Metadata } from 'next'
import { QuizSession } from '@/components/QuizSession'
import { buildMetadata, seoPageAlternates } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Spaced-Repetition-Quiz – 99 Namen Allahs',
  description:
    'Übe die 99 Namen Allahs mit einem aktiven Abrufquiz. Karten tauchen nach einem Spaced-Repetition-Plan wieder auf, je nachdem wie gut du dich erinnert hast.',
  path: '/de/quiz',
  locale: 'de',
  alternates: seoPageAlternates('quiz'),
  index: true,
})

export default function GermanQuizPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <QuizSession locale="de" />
    </div>
  )
}
