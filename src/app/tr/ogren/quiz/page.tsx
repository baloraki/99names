import type { Metadata } from 'next'
import { QuizSession } from '@/components/QuizSession'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Aralıklı Tekrar Quiz – Allah\'ın 99 İsmi',
  description:
    "Allah'ın 99 ismini aktif hatırlama quiziyle çalış. Kartlar, her ismi ne kadar iyi hatırladığına göre aralıklı tekrar planına göre yeniden gelir.",
  path: '/tr/ogren/quiz',
  locale: 'tr',
  index: false,
})

export default function TrOgrenQuizPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <QuizSession locale="tr" />
    </div>
  )
}
