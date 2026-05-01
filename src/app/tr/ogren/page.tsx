import { LocalizedSeoPageContent, getLocalizedSeoMetadata } from '@/components/LocalizedSeoPage'

export const metadata = getLocalizedSeoMetadata('learn', 'tr')

export default function TurkishLearnPage() {
  return <LocalizedSeoPageContent page="learn" locale="tr" />
}
