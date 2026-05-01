import { LocalizedSeoPageContent, getLocalizedSeoMetadata } from '@/components/LocalizedSeoPage'

export const metadata = getLocalizedSeoMetadata('dua', 'de')

export default function GermanDuaPage() {
  return <LocalizedSeoPageContent page="dua" locale="de" />
}
