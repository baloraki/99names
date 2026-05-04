import Link from 'next/link'
import type { Language } from '@/types/language'

const copy: Record<Language, { code: string; title: string; body: string; home: string }> = {
  en: {
    code: '404',
    title: 'Page not found',
    body: 'The page you are looking for does not exist or has been moved.',
    home: 'Back to home',
  },
  de: {
    code: '404',
    title: 'Seite nicht gefunden',
    body: 'Die gesuchte Seite existiert nicht oder wurde verschoben.',
    home: 'Zurück zur Startseite',
  },
  tr: {
    code: '404',
    title: 'Sayfa bulunamadı',
    body: 'Aradığınız sayfa mevcut değil veya taşınmış.',
    home: 'Ana sayfaya dön',
  },
}

const homeHref: Record<Language, string> = {
  en: '/',
  de: '/de',
  tr: '/tr',
}

export function NotFoundContent({ language }: { language: Language }) {
  const t = copy[language]
  return (
    <section className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-7xl font-bold text-gold/40 select-none">{t.code}</p>
      <h1 className="mt-4 text-2xl font-semibold text-primary">{t.title}</h1>
      <p className="mt-3 max-w-sm text-muted">{t.body}</p>
      <Link
        href={homeHref[language]}
        className="btn-primary mt-8 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium"
      >
        {t.home}
      </Link>
    </section>
  )
}

