import { LocalizedSeoPageContent, getLocalizedSeoMetadata } from '@/components/LocalizedSeoPage'

export const metadata = getLocalizedSeoMetadata('dua', 'tr')

export default function TurkishDuaPage() {
  return <LocalizedSeoPageContent page="dua" locale="tr" />
}
