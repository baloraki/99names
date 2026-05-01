import { LocalizedSeoPageContent, getLocalizedSeoMetadata } from '@/components/LocalizedSeoPage'

export const metadata = getLocalizedSeoMetadata('reflections', 'tr')

export default function TurkishReflectionsPage() {
  return <LocalizedSeoPageContent page="reflections" locale="tr" />
}
