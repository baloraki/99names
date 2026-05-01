import { LocalizedSeoPageContent, getLocalizedSeoMetadata } from '@/components/LocalizedSeoPage'

export const metadata = getLocalizedSeoMetadata('asma', 'de')

export default function GermanAsmaUlHusnaPage() {
  return <LocalizedSeoPageContent page="asma" locale="de" />
}
