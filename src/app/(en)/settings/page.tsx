import type { Metadata } from 'next'
import { SettingsClient } from '@/components/SettingsClient'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Settings – 99 Names Learning Aid',
  description: 'Manage local language, learning progress and reminder settings for the 99 Names learning aid.',
  path: '/settings',
  locale: 'en',
})

export default function SettingsPage() {
  return <SettingsClient />
}
