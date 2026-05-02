'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import type { ReactNode, SVGProps } from 'react'
import { useEffect, useState } from 'react'
import { getDict, LANGUAGES } from '@/lib/i18n'
import { isLanguage } from '@/lib/languagePreference'
import { getEquivalentLocalizedPath, getLocalizedSeoPath, getLocalizedSettingsPath, getLocalizedStaticPath } from '@/lib/seo'
import { storage } from '@/lib/storage'
import type { Language } from '@/types/language'

const getNavItems = (language: Language) => [
  { href: language === 'de' ? '/de' : language === 'tr' ? '/tr' : '/', key: 'home', icon: HomeIcon },
  { href: language === 'de' ? '/de/namen' : language === 'tr' ? '/tr/esmaul-husna' : '/names', key: 'names', icon: DiamondIcon },
  { href: getLocalizedSeoPath('learn', language), key: 'learn', icon: CompassIcon },
] as const

const getInitialLanguage = (routeLanguage?: Language): Language => {
  if (routeLanguage) return routeLanguage
  if (typeof window === 'undefined') return 'en'
  return storage.getLanguage()
}

export function AppShell({ children, routeLanguage }: { children: ReactNode; routeLanguage?: Language }) {
  const pathname = usePathname()
  const router = useRouter()
  const [storedLanguage, setStoredLanguage] = useState<Language>(() => getInitialLanguage(routeLanguage))
  const language = routeLanguage ?? storedLanguage
  const dict = getDict(language)
  const navItems = getNavItems(language)
  const settingsPath = getLocalizedSettingsPath(language)
  const isActive = (href: string) => {
    const exactOnly = href === '/' || href === '/de' || href === '/tr'
    return pathname === href || (!exactOnly && pathname.startsWith(href))
  }

  useEffect(() => {
    if (routeLanguage) {
      storage.setLanguage(routeLanguage)
      document.documentElement.lang = routeLanguage
      queueMicrotask(() => setStoredLanguage(routeLanguage))
      return
    }

    queueMicrotask(() => {
      const next = storage.getLanguage()
      setStoredLanguage(next)
      document.documentElement.lang = next
    })

    const onLanguageChange = (event: Event) => {
      const next = (event as CustomEvent<unknown>).detail
      if (isLanguage(next)) setStoredLanguage(next)
    }
    window.addEventListener('app-language-change', onLanguageChange)
    return () => window.removeEventListener('app-language-change', onLanguageChange)
  }, [routeLanguage])

  function onLanguageChange(next: Language) {
    setStoredLanguage(next)
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
                  <Link
                    key={item.href}
                    href={item.href}
                    className={active ? 'nav-link nav-link-active' : 'nav-link'}
                    aria-current={active ? 'page' : undefined}
                  >
                    {dict.nav[item.key]}
                  </Link>
                )
              })}
              <ShareButton labels={dict.share} variant="desktop" />
              <LanguageSwitcher language={language} label={dict.settings.language} onChange={onLanguageChange} compact />
            </nav>
            <Link
              href={settingsPath}
              className={isActive(settingsPath) ? 'header-icon-link header-icon-link-active md:hidden' : 'header-icon-link md:hidden'}
              aria-label={dict.nav.settings}
              aria-current={isActive(settingsPath) ? 'page' : undefined}
            >
              <span className="mobile-nav-icon" aria-hidden="true"><SettingsIcon /></span>
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 pb-32 pt-6 md:pb-12">{children}</main>

      <footer className="hidden md:block border-t border-white/10 bg-background/60 py-4 text-xs text-muted">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4">
          <Link href={getLocalizedStaticPath('about', language)} className="hover:text-gold transition-colors">{language === 'de' ? 'Über uns' : language === 'tr' ? 'Hakkımızda' : 'About'}</Link>
          <Link href={getLocalizedStaticPath('contact', language)} className="hover:text-gold transition-colors">{language === 'de' ? 'Kontakt' : language === 'tr' ? 'İletişim' : 'Contact'}</Link>
          <Link href={getLocalizedStaticPath('privacy', language)} className="hover:text-gold transition-colors">{language === 'de' ? 'Datenschutz' : language === 'tr' ? 'Gizlilik' : 'Privacy'}</Link>
          <Link href={getLocalizedStaticPath('imprint', language)} className="hover:text-gold transition-colors">{language === 'de' ? 'Impressum' : language === 'tr' ? 'Künye' : 'Imprint'}</Link>
        </div>
      </footer>

      <nav className="mobile-nav-bar fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-background/95 px-2 pt-2 backdrop-blur md:hidden" aria-label={dict.nav.mobile}>
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
          {navItems.map((item) => {
            const active = isActive(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? 'mobile-nav mobile-nav-active' : 'mobile-nav'}
                aria-current={active ? 'page' : undefined}
              >
                <span className="mobile-nav-icon" aria-hidden="true"><Icon /></span>
                <span className="mobile-nav-label">{dict.nav[item.key]}</span>
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
      <button type="button" className="mobile-nav mobile-nav-icon-only" onClick={onShare} aria-label={labels.button}>
        <span className="mobile-nav-icon" aria-hidden="true"><ShareIcon /></span>
        <span className="sr-only" aria-live="polite">{label}</span>
      </button>
    )
  }

  return (
    <button type="button" className="nav-link" onClick={onShare} aria-label={labels.button}>
      <span aria-live="polite">{label}</span>
    </button>
  )
}

function HomeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5 9.5V20h14V9.5" />
      <path d="M10 20v-6h4v6" />
    </svg>
  )
}

function DiamondIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3l8 9-8 9-8-9 8-9z" />
      <path d="M8 8h8" />
    </svg>
  )
}

function CompassIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 14.5l2-5 5-2-2 5-5 2z" />
    </svg>
  )
}

function SettingsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a1 1 0 0 1 0 1.4l-1 1a1 1 0 0 1-1.4 0l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1v-.2a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a1 1 0 0 1-1.4 0l-1-1a1 1 0 0 1 0-1.4l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a1 1 0 0 1-1-1v-1.5a1 1 0 0 1 1-1h.2a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a1 1 0 0 1 0-1.4l1-1a1 1 0 0 1 1.4 0l.1.1a1 1 0 0 0 1.1.2 1 1 0 0 0 .6-.9V4a1 1 0 0 1 1-1h1.5a1 1 0 0 1 1 1v.2a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a1 1 0 0 1 1.4 0l1 1a1 1 0 0 1 0 1.4l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6H20a1 1 0 0 1 1 1v1.5a1 1 0 0 1-1 1h-.2a1 1 0 0 0-.9.6z" />
    </svg>
  )
}

function ShareIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 15V4" />
      <path d="M8 8l4-4 4 4" />
      <path d="M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
    </svg>
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
