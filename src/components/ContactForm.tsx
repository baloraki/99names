'use client'

import type { FormEvent, ReactNode } from 'react'
import { useState } from 'react'
import { useAppState } from '@/hooks/useAppState'
import { getDict } from '@/lib/i18n'
import { validateContactForm } from '@/lib/validation'

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
