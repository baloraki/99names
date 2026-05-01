import { LocalizedSeoPageContent, getLocalizedSeoMetadata } from '@/components/LocalizedSeoPage'

export const metadata = getLocalizedSeoMetadata('quiz', 'de')

export default function GermanQuizPage() {
  return <LocalizedSeoPageContent page="quiz" locale="de" />
}
