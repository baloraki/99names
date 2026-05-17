'use client'

import type { ChangeEvent } from 'react'
import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAppState } from '@/hooks/useAppState'
import { getDict, LANGUAGES } from '@/lib/i18n'
import { isLanguage } from '@/lib/languagePreference'
import { getEquivalentLocalizedPath } from '@/lib/seo'
import type { Language } from '@/types/language'
import { THEMES, type ThemeName } from '@/types/theme'
import { PushReminderSettings } from './PushReminderSettings'

export function SettingsClient({ locale }: { locale: Language }) {
  const pathname = usePathname()
  const router = useRouter()
  const { progress, theme, actions } = useAppState()
  const dict = getDict(locale)

  useEffect(() => {
    queueMicrotask(() => actions.setLanguage(locale))
  }, [actions, locale])

  function onLanguageChange(event: ChangeEvent<HTMLSelectElement>) {
    const next = event.target.value
    if (!isLanguage(next)) return

    actions.setLanguage(next)
    const nextPath = getEquivalentLocalizedPath(pathname, next)
    if (nextPath !== pathname) router.push(nextPath)
  }

  function onThemeChange(event: ChangeEvent<HTMLSelectElement>) {
    const next = event.target.value as ThemeName
    if (!THEMES.includes(next)) return
    actions.setTheme(next)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <section>
        <p className="text-sm uppercase tracking-[0.22em] text-gold">{dict.settings.eyebrow}</p>
        <h1 className="mt-3 text-4xl font-semibold">{dict.settings.title}</h1>
      </section>
      <section className="rounded-lg border border-white/10 bg-surface p-5">
        <label className="text-sm text-muted" htmlFor="language">{dict.settings.language}</label>
        <select id="language" className="mt-2 field" value={locale} onChange={onLanguageChange}>
          {LANGUAGES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
      </section>
      <section className="rounded-lg border border-white/10 bg-surface p-5">
        <label className="text-sm text-muted" htmlFor="theme">{dict.settings.theme}</label>
        <select id="theme" className="mt-2 field" value={theme} onChange={onThemeChange}>
          {THEMES.map((item) => <option key={item} value={item}>{dict.settings.themeOptions[item]}</option>)}
        </select>
      </section>
      <PushReminderSettings title={dict.settings.pushReminderTitle} iosPushUnavailable={dict.settings.iosPushUnavailable} iosPwaNote={dict.settings.iosPwaNote} />
      <section className="rounded-lg border border-white/10 bg-surface p-5">
        <h2 className="text-xl font-semibold">{dict.settings.localData}</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          {dict.settings.localDataBody(progress.learnedIds.length, progress.favoriteIds.length, progress.lastViewedSlug ?? dict.common.none)}
        </p>
        <button type="button" className="btn-danger mt-5" onClick={() => window.confirm(dict.settings.resetConfirm) && actions.resetProgress()}>
          {dict.settings.resetProgress}
        </button>
      </section>
      <p className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-muted">
        {dict.settings.notificationNote}
      </p>
    </div>
  )
}
