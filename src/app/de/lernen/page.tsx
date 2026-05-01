import { LocalizedSeoPageContent, getLocalizedSeoMetadata } from '@/components/LocalizedSeoPage'

export const metadata = getLocalizedSeoMetadata('learn', 'de')

export default function GermanLearnPage() {
  return <LocalizedSeoPageContent page="learn" locale="de" />
}
