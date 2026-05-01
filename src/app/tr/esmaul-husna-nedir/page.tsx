import { LocalizedSeoPageContent, getLocalizedSeoMetadata } from '@/components/LocalizedSeoPage'

export const metadata = getLocalizedSeoMetadata('asma', 'tr')

export default function TurkishAsmaUlHusnaPage() {
  return <LocalizedSeoPageContent page="asma" locale="tr" />
}
