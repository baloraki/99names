'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { getDict, LANGUAGES } from '@/lib/i18n'
import { isLanguage } from '@/lib/languagePreference'
import { getEquivalentLocalizedPath, getLocalizedSeoPath, getLocalizedSettingsPath } from '@/lib/seo'
import { storage } from '@/lib/storage'
import type { Language } from '@/types/language'

const getNavItems = (language: Language) => [
  { href: language === 'de' ? '/de' : language === 'tr' ? '/tr' : '/', key: 'home', icon: '⌂' },
  { href: language === 'de' ? '/de/namen' : language === 'tr' ? '/tr/esmaul-husna' : '/names', key: 'names', icon: '◇' },
  { href: getLocalizedSeoPath('learn', language), key: 'learn', icon: '◐' },
  { href: getLocalizedSettingsPath(language), key: 'settings', icon: '⚙' },
] as const

const getInitialLanguage = (routeLanguage?: Language): Language => {
  if (routeLanguage) return routeLanguage
  if (typeof window === 'undefined') return 'en'
  return storage.getLanguage()
}

export function AppShell({ children, routeLanguage }: { children: ReactNode; routeLanguage?: Language }) {
  const pathname = usePathname()
  const router = useRouter()
  const [language, setLanguage] = useState<Language>(() => getInitialLanguage(routeLanguage))
  const dict = getDict(language)
  const navItems = getNavItems(language)
  const isActive = (href: string) => {
    const exactOnly = href === '/' || href === '/de' || href === '/tr'
    return pathname === href || (!exactOnly && pathname.startsWith(href))
  }

  useEffect(() => {
    if (routeLanguage) {
      document.documentElement.lang = routeLanguage
      return
    }

    queueMicrotask(() => setLanguage(storage.getLanguage()))

    const onLanguageChange = (event: Event) => {
      const next = (event as CustomEvent<unknown>).detail
      if (isLanguage(next)) setLanguage(next)
    }
    window.addEventListener('app-language-change', onLanguageChange)
    return () => window.removeEventListener('app-language-change', onLanguageChange)
  }, [routeLanguage])

  function onLanguageChange(next: Language) {
    setLanguage(next)
    storage.setLanguage(next)
    document.documentElement.lang = next
    window.dispatchEvent(new CustomEvent('app-language-change', { detail: next }))
    const nextPath = getEquivalentLocalizedPath(pathname, next)
    if (nextPath !== pathname) router.push(nextPath)
  }

  return (
    <>
      <div className="star-field fixed inset-0 -z-10" />
      <header className="sticky top-0 z-30 border-b border-white/10 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <Link href={language === 'de' ? '/de' : language === 'tr' ? '/tr' : '/'} className="focus-ring rounded-md" aria-label="Daily Husna">
            <Image
              src="/logo.svg"
              alt="Daily Husna logo"
              width={512}
              height={512}
              priority
              unoptimized
              className="h-18 w-18 sm:h-20 sm:w-20"
            />
            <span className="block text-center text-[11px] text-gold">{dict.nav.aid}</span>
          </Link>
          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-2 md:flex" aria-label={dict.nav.main}>
              {navItems.map((item) => {
                const active = isActive(item.href)
                return (
                  <Link key={item.href} href={item.href} className={active ? 'nav-link nav-link-active' : 'nav-link'}>
                    {dict.nav[item.key]}
                  </Link>
                )
              })}
              <ShareButton labels={dict.share} variant="desktop" />
            </nav>
            <LanguageSwitcher language={language} label={dict.settings.language} onChange={onLanguageChange} compact />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 md:pb-12">{children}</main>

      <footer className="hidden md:block border-t border-white/10 bg-background/60 py-4 text-xs text-muted">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4">
          <Link href="/about" className="hover:text-gold transition-colors">{language === 'de' ? 'Über uns' : language === 'tr' ? 'Hakkımızda' : 'About'}</Link>
          <Link href="/contact" className="hover:text-gold transition-colors">{language === 'de' ? 'Kontakt' : language === 'tr' ? 'İletişim' : 'Contact'}</Link>
          <Link href="/privacy" className="hover:text-gold transition-colors">{language === 'de' ? 'Datenschutz' : language === 'tr' ? 'Gizlilik' : 'Privacy'}</Link>
          <Link href="/imprint" className="hover:text-gold transition-colors">{language === 'de' ? 'Impressum' : language === 'tr' ? 'Künye' : 'Imprint'}</Link>
        </div>
      </footer>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-background/95 px-2 py-2 backdrop-blur md:hidden" aria-label={dict.nav.mobile}>
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link key={item.href} href={item.href} className={active ? 'mobile-nav mobile-nav-active' : 'mobile-nav'}>
                <span aria-hidden="true">{item.icon}</span>
                <span>{dict.nav[item.key]}</span>
              </Link>
            )
          })}
          <ShareButton labels={dict.share} variant="mobile" />
        </div>
      </nav>
    </>
  )
}

function ShareButton({
  labels,
  variant,
}: {
  labels: ReturnType<typeof getDict>['share']
  variant: 'desktop' | 'mobile'
}) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle')

  useEffect(() => {
    if (status === 'idle') return
    const timeout = window.setTimeout(() => setStatus('idle'), 2200)
    return () => window.clearTimeout(timeout)
  }, [status])

  async function onShare() {
    const url = window.location.href
    const shareData: ShareData = {
      title: document.title || labels.title,
      text: labels.text,
      url,
    }

    try {
      if (typeof navigator.share === 'function' && (!navigator.canShare || navigator.canShare(shareData))) {
        await navigator.share(shareData)
        return
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
    }

    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(url)
      setStatus('copied')
    } catch {
      setStatus('failed')
    }
  }

  const label = status === 'copied' ? labels.copied : status === 'failed' ? labels.failed : labels.button

  if (variant === 'mobile') {
    return (
      <button type="button" className="mobile-nav" onClick={onShare} aria-label={labels.button}>
        <span aria-hidden="true">↗</span>
        <span aria-live="polite">{label}</span>
      </button>
    )
  }

  return (
    <button type="button" className="nav-link" onClick={onShare} aria-label={labels.button}>
      <span aria-live="polite">{label}</span>
    </button>
  )
}

function LanguageSwitcher({
  language,
  label,
  onChange,
  compact = false,
}: {
  language: Language
  label: string
  onChange: (language: Language) => void
  compact?: boolean
}) {
  return (
    <label className={compact ? 'flex items-center gap-2 text-sm text-muted' : 'block text-sm text-muted'}>
      <span className={compact ? 'hidden lg:inline' : 'mb-1 block'}>{label}</span>
      <select
        className={compact ? 'language-select language-select-compact' : 'language-select w-full'}
        value={language}
        onChange={(event) => {
          const next = event.target.value
          if (isLanguage(next)) onChange(next)
        }}
        aria-label={label}
      >
        {LANGUAGES.map((item) => (
          <option key={item.value} value={item.value}>{item.label}</option>
        ))}
      </select>
    </label>
  )
}
