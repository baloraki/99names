import type { Metadata } from 'next'
import { QuizSession } from '@/components/QuizSession'
import { buildMetadata, seoPageAlternates } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Spaced Repetition Quiz – 99 Names of Allah',
  description:
    'Practice the 99 Names of Allah with an active recall quiz. Cards resurface on a spaced-repetition schedule based on how well you recalled each name.',
  path: '/quiz',
  locale: 'en',
  alternates: seoPageAlternates('quiz'),
  index: true,
})

export default function QuizPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <QuizSession locale="en" />
    </div>
  )
}
