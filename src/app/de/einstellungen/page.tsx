import type { Metadata } from 'next'
import { SettingsClient } from '@/components/SettingsClient'
import { buildMetadata, settingsAlternates } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Einstellungen – 99 Namen Lernhilfe',
  description: 'Verwalte Sprache, Lernfortschritt und Erinnerungen für die 99 Namen Allahs.',
  path: '/de/einstellungen',
  locale: 'de',
  alternates: settingsAlternates(),
  index: false,
})

export default function GermanSettingsPage() {
  return <SettingsClient locale="de" />
}
