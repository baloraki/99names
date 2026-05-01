'use client'

import { useAppState } from '@/hooks/useAppState'
import { getDict } from '@/lib/i18n'
import { ContactForm } from './ContactForm'

export function ContactPageClient() {
  const { language } = useAppState()
  const dict = getDict(language)

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <section>
        <p className="text-sm uppercase tracking-[0.22em] text-gold">{dict.contact.eyebrow}</p>
        <h1 className="mt-3 text-4xl font-semibold">{dict.contact.title}</h1>
        <p className="mt-3 leading-7 text-muted">{dict.contact.intro}</p>
      </section>
      <ContactForm />
    </div>
  )
}
