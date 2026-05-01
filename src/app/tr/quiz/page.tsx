import { LocalizedSeoPageContent, getLocalizedSeoMetadata } from '@/components/LocalizedSeoPage'

export const metadata = getLocalizedSeoMetadata('quiz', 'tr')

export default function TurkishQuizPage() {
  return <LocalizedSeoPageContent page="quiz" locale="tr" />
}
