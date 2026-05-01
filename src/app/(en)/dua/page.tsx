import { LocalizedSeoPageContent, getLocalizedSeoMetadata } from '@/components/LocalizedSeoPage'

export const metadata = getLocalizedSeoMetadata('dua', 'en')

export default function DuaPage() {
  return <LocalizedSeoPageContent page="dua" locale="en" />
}
