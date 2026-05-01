import { LocalizedSeoPageContent, getLocalizedSeoMetadata } from '@/components/LocalizedSeoPage'

export const metadata = getLocalizedSeoMetadata('reflections', 'de')

export default function GermanReflectionsPage() {
  return <LocalizedSeoPageContent page="reflections" locale="de" />
}
