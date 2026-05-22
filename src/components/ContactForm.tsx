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
    text: 'Die von Ihnen eingegebenen Daten werden über Web3Forms verarbeitet und per E-Mail an uns weitergeleitet. Je nach Web3Forms-Plan können Einsendungen dort zeitlich begrenzt gespeichert werden. Details finden Sie in unserer ',
    linkLabel: 'Datenschutzerklärung',
  },
  en: {
    text: 'The data you enter is processed via Web3Forms and forwarded to us by email. Depending on the Web3Forms plan, submissions may be stored there for a limited period. For details see our ',
    linkLabel: 'Privacy Policy',
  },
  tr: {
    text: 'Girdiğiniz veriler Web3Forms aracılığıyla işlenerek e-posta ile tarafımıza iletilir. Web3Forms planına bağlı olarak gönderiler belirli bir süre orada saklanabilir. Ayrıntılar için ',
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
      <Field label={dict.contact.name} required error={translateError(errors.name, dict)} htmlFor="contact-name">
        <input id="contact-name" className="field" required aria-invalid={!!errors.name} aria-describedby={errors.name ? 'contact-name-error' : undefined} value={values.name} maxLength={100} onChange={(event) => setValues({ ...values, name: event.target.value })} />
      </Field>
      <Field label={dict.contact.email} required error={translateError(errors.email, dict)} htmlFor="contact-email">
        <input id="contact-email" className="field" required aria-invalid={!!errors.email} aria-describedby={errors.email ? 'contact-email-error' : undefined} type="email" value={values.email} maxLength={200} onChange={(event) => setValues({ ...values, email: event.target.value })} />
      </Field>
      <Field label={dict.contact.message} required error={translateError(errors.message, dict)} htmlFor="contact-message">
        <textarea id="contact-message" className="field min-h-40 resize-y" required aria-invalid={!!errors.message} aria-describedby={errors.message ? 'contact-message-error' : undefined} value={values.message} maxLength={maxMessageLength + 1} onChange={(event) => setValues({ ...values, message: event.target.value })} />
      </Field>
      <div aria-live="polite">
        {errors.honeypot && <p className="text-sm text-danger">{translateError(errors.honeypot, dict)}</p>}
        {status === 'missing-key' && <p className="text-sm text-danger">{dict.contact.noKey}</p>}
        {status === 'success' && <p className="text-sm text-success">{dict.contact.success}</p>}
        {status === 'error' && <p className="text-sm text-danger">{dict.contact.error}</p>}
      </div>
      {/* DSGVO / GDPR privacy notice */}
      <p className="rounded-md border border-white/10 bg-surface px-4 py-3 text-xs leading-6 text-muted">
        {privacyNote[language]?.text ?? privacyNote.en.text}
        <Link href={getLocalizedStaticPath('privacy', language)} className="text-gold underline underline-offset-2 hover:text-gold/80">
          {privacyNote[language]?.linkLabel ?? privacyNote.en.linkLabel}
        </Link>
        {language === 'tr' ? ' bakabilirsiniz.' : '.'}
      </p>

      <button className="btn-primary gap-2" disabled={status === 'loading'}>
        {status === 'loading' ? (
          <>
            <Spinner />
            {dict.contact.sending}
          </>
        ) : (
          dict.contact.send
        )}
      </button>
    </form>
  )
}

function Spinner() {
  return (
    <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  )
}

function translateError(code: string | undefined, dict: ReturnType<typeof getDict>): string | undefined {
  if (!code) return undefined
  return dict.validation[code as keyof typeof dict.validation] ?? code
}

function Field({ label, error, required, children, htmlFor }: { label: string; error?: string; required?: boolean; children: ReactNode; htmlFor?: string }) {
  return (
    <label className="block" htmlFor={htmlFor}>
      <span className="text-sm text-muted">
        {label}{required && <span className="text-danger" aria-hidden="true"> *</span>}
      </span>
      <span className="mt-2 block">{children}</span>
      {error && <span id={htmlFor ? `${htmlFor}-error` : undefined} className="mt-1 block text-sm text-danger">{error}</span>}
    </label>
  )
}
