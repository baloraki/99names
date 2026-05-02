import type { Metadata } from 'next'
import { AboutPageContent } from '@/components/AboutPageContent'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'About – 99 Names of Allah Learning Aid',
  description:
    'About this learning aid for the 99 Names of Allah. Created for personal learning and shared with the world. Includes full source list (Qurʾān, Ḥadīth, Diyanet, scholarly works).',
  path: '/about',
  locale: 'en',
})

export default function AboutPage() {
  return <AboutPageContent />
}

