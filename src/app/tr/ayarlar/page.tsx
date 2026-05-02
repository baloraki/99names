import type { Metadata } from 'next'
import { SettingsClient } from '@/components/SettingsClient'
import { buildMetadata, settingsAlternates } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: "Ayarlar – Allah'ın 99 İsmi Öğrenme Yardımı",
  description: "Allah'ın 99 ismi için dil, öğrenme ilerlemesi ve hatırlatma ayarlarını yönet.",
  path: '/tr/ayarlar',
  locale: 'tr',
  alternates: settingsAlternates(),
})

export default function TurkishSettingsPage() {
  return <SettingsClient locale="tr" />
}
