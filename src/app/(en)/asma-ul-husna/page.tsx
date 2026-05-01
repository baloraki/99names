import { LocalizedSeoPageContent, getLocalizedSeoMetadata } from '@/components/LocalizedSeoPage'

export const metadata = getLocalizedSeoMetadata('asma', 'en')

export default function AsmaUlHusnaPage() {
  return <LocalizedSeoPageContent page="asma" locale="en" />
}
