'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import type { Language } from '@/types/language'

const copy: Record<Language, { title: string; body: string; retry: string; home: string }> = {
  en: {
    title: 'Something went wrong',
    body: 'An unexpected error occurred. Please try again or return to the home page.',
    retry: 'Try again',
    home: 'Back to home',
  },
  de: {
    title: 'Etwas ist schiefgelaufen',
    body: 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut oder kehre zur Startseite zurück.',
    retry: 'Erneut versuchen',
    home: 'Zurück zur Startseite',
  },
  tr: {
    title: 'Bir şeyler ters gitti',
    body: 'Beklenmedik bir hata oluştu. Lütfen tekrar deneyin veya ana sayfaya dönün.',
    retry: 'Tekrar dene',
    home: 'Ana sayfaya dön',
  },
}

const homeHref: Record<Language, string> = {
  en: '/',
  de: '/de',
  tr: '/tr',
}

export function ErrorContent({
  language,
  error,
  onRetry,
}: {
  language: Language
  error: Error & { digest?: string }
  onRetry: () => void
}) {
  const t = copy[language]

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-7xl font-bold text-danger/30 select-none">500</p>
      <h1 className="mt-4 text-2xl font-semibold text-primary">{t.title}</h1>
      <p className="mt-3 max-w-sm text-muted">{t.body}</p>
      {error.digest && (
        <p className="mt-2 font-mono text-xs text-muted/50">#{error.digest}</p>
      )}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="btn-primary inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium"
        >
          {t.retry}
        </button>
        <Link
          href={homeHref[language]}
          className="btn-secondary inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium"
        >
          {t.home}
        </Link>
      </div>
    </section>
  )
}

