'use client'

import type { FormEvent, ReactNode } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { useAppState } from '@/hooks/useAppState'
import { getDict } from '@/lib/i18n'
import { getLocalizedStaticPath } from '@/lib/seo'
import { validateContactForm } from '@/lib/validation'

const privacyNote: Record<string, { text: string; linkLabel: string }> = {
  de: {
    text: 'Die von Ihnen eingegebenen Daten (Name, E-Mail, Nachricht) werden über Web3Forms verarbeitet und direkt per E-Mail an uns weitergeleitet. Es findet keine Speicherung der Daten auf den Servern von Web3Forms statt. Weitere Informationen finden Sie in unserer ',
    linkLabel: 'Datenschutzerklärung',
  },
  en: {
    text: 'The data you enter (name, email, message) is processed via Web3Forms and forwarded directly to us by email. According to Web3Forms, no data is stored on their servers. For details see our ',
    linkLabel: 'Privacy Policy',
  },
  tr: {
    text: 'Girdiğiniz veriler (ad, e-posta, mesaj) Web3Forms aracılığıyla işlenerek doğrudan e-posta ile tarafımıza iletilir. Web3Forms\'un belirttiğine göre veriler kendi sunucularında saklanmamaktadır. Ayrıntılar için ',
    linkLabel: 'Gizlilik Politikamıza',
  },
}

const maxMessageLength = 2000

export function ContactForm() {
  const { language } = useAppState()
  const dict = getDict(language)
  const key = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY
  const [values, setValues] = useState({ name: '', email: '', message: '', honeypot: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'missing-key'>('idle')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = validateContactForm(values)
    setErrors(result.errors)
    if (!result.valid) return
    if (!key) {
      setStatus('missing-key')
      return
    }
    setStatus('loading')
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: key,
          name: values.name,
          email: values.email,
          message: values.message,
        }),
      })
      if (!response.ok) throw new Error('send failed')
      setStatus('success')
      setValues({ name: '', email: '', message: '', honeypot: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <form className="space-y-4 rounded-lg border border-white/10 bg-surface p-5" onSubmit={onSubmit} noValidate>
      <input
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        value={values.honeypot}
        onChange={(event) => setValues({ ...values, honeypot: event.target.value })}
        aria-hidden="true"
      />
      <Field label={dict.contact.name} error={translateError(errors.name, dict)}>
        <input className="field" value={values.name} maxLength={100} onChange={(event) => setValues({ ...values, name: event.target.value })} />
      </Field>
      <Field label={dict.contact.email} error={translateError(errors.email, dict)}>
        <input className="field" type="email" value={values.email} maxLength={200} onChange={(event) => setValues({ ...values, email: event.target.value })} />
      </Field>
      <Field label={dict.contact.message} error={translateError(errors.message, dict)}>
        <textarea className="field min-h-40 resize-y" value={values.message} maxLength={maxMessageLength + 1} onChange={(event) => setValues({ ...values, message: event.target.value })} />
      </Field>
      {errors.honeypot && <p className="text-sm text-danger">{translateError(errors.honeypot, dict)}</p>}
      {status === 'missing-key' && <p className="text-sm text-danger">{dict.contact.noKey}</p>}
      {status === 'success' && <p className="text-sm text-success">{dict.contact.success}</p>}
      {status === 'error' && <p className="text-sm text-danger">{dict.contact.error}</p>}
      {/* DSGVO / GDPR privacy notice */}
      <p className="rounded-md border border-white/10 bg-surface px-4 py-3 text-xs leading-6 text-muted">
        {privacyNote[language]?.text ?? privacyNote.en.text}
        <Link href={getLocalizedStaticPath('privacy', language)} className="text-gold underline underline-offset-2 hover:text-gold/80">
          {privacyNote[language]?.linkLabel ?? privacyNote.en.linkLabel}
        </Link>
        {language === 'tr' ? ' bakabilirsiniz.' : '.'}
      </p>

      <button className="btn-primary" disabled={status === 'loading'}>{status === 'loading' ? dict.contact.sending : dict.contact.send}</button>
    </form>
  )
}

function translateError(code: string | undefined, dict: ReturnType<typeof getDict>): string | undefined {
  if (!code) return undefined
  return dict.validation[code as keyof typeof dict.validation] ?? code
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm text-muted">{label}</span>
      <span className="mt-2 block">{children}</span>
      {error && <span className="mt-1 block text-sm text-danger">{error}</span>}
    </label>
  )
}
