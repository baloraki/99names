import { LocalizedSeoPageContent, getLocalizedSeoMetadata } from '@/components/LocalizedSeoPage'

export const metadata = getLocalizedSeoMetadata('quiz', 'en')

export default function QuizPage() {
  return <LocalizedSeoPageContent page="quiz" locale="en" />
}
