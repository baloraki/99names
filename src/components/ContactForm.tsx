'use client'

import type { FormEvent, ReactNode } from 'react'
import { useState } from 'react'
import { validateContactForm } from '@/lib/validation'

const maxMessageLength = 2000

export function ContactForm() {
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
      <Field label="Name" error={errors.name}>
        <input className="field" value={values.name} maxLength={100} onChange={(event) => setValues({ ...values, name: event.target.value })} />
      </Field>
      <Field label="E-Mail" error={errors.email}>
        <input className="field" type="email" value={values.email} maxLength={200} onChange={(event) => setValues({ ...values, email: event.target.value })} />
      </Field>
      <Field label="Nachricht" error={errors.message}>
        <textarea className="field min-h-40 resize-y" value={values.message} maxLength={maxMessageLength + 1} onChange={(event) => setValues({ ...values, message: event.target.value })} />
      </Field>
      {errors.honeypot && <p className="text-sm text-danger">{errors.honeypot}</p>}
      {status === 'missing-key' && <p className="text-sm text-danger">Das Kontaktformular ist noch nicht konfiguriert.</p>}
      {status === 'success' && <p className="text-sm text-success">Deine Nachricht wurde gesendet.</p>}
      {status === 'error' && <p className="text-sm text-danger">Die Nachricht konnte gerade nicht gesendet werden. Bitte versuche es spaeter erneut.</p>}
      <button className="btn-primary" disabled={status === 'loading'}>{status === 'loading' ? 'Senden...' : 'Senden'}</button>
    </form>
  )
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
