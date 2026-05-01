import { LocalizedSeoPageContent, getLocalizedSeoMetadata } from '@/components/LocalizedSeoPage'

export const metadata = getLocalizedSeoMetadata('reflections', 'en')

export default function ReflectionsPage() {
  return <LocalizedSeoPageContent page="reflections" locale="en" />
}
