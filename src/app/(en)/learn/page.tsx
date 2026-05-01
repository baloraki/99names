import { LocalizedSeoPageContent, getLocalizedSeoMetadata } from '@/components/LocalizedSeoPage'

export const metadata = getLocalizedSeoMetadata('learn', 'en')

export default function LearnPage() {
  return <LocalizedSeoPageContent page="learn" locale="en" />
}
