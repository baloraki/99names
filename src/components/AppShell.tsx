'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { getDict } from '@/lib/i18n'
import { storage } from '@/lib/storage'
import type { Language } from '@/types/language'

const getNavItems = (language: Language) => [
  { href: language === 'de' ? '/de' : language === 'tr' ? '/tr' : '/', key: 'home', icon: '⌂' },
  { href: language === 'de' ? '/de/namen' : language === 'tr' ? '/tr/esmaul-husna' : '/names', key: 'names', icon: '◇' },
  { href: '/learn', key: 'learn', icon: '◐' },
  { href: '/settings', key: 'settings', icon: '⚙' },
] as const

const isLanguage = (value: unknown): value is Language => {
  return value === 'de' || value === 'tr' || value === 'en'
}

const getInitialLanguage = (routeLanguage?: Language): Language => {
  if (routeLanguage) return routeLanguage
  if (typeof window === 'undefined') return 'en'
  return storage.getLanguage()
}

export function AppShell({ children, routeLanguage }: { children: ReactNode; routeLanguage?: Language }) {
  const pathname = usePathname()
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

  return (
    <>
      <div className="star-field fixed inset-0 -z-10" />
      <header className="sticky top-0 z-30 border-b border-white/10 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="focus-ring rounded-md">
            <span className="block text-lg font-semibold text-primary">99 Names</span>
            <span className="block text-xs text-gold">{dict.nav.aid}</span>
          </Link>
          <nav className="hidden items-center gap-2 md:flex" aria-label={dict.nav.main}>
            {navItems.map((item) => {
              const active = isActive(item.href)
              return (
                <Link key={item.href} href={item.href} className={active ? 'nav-link nav-link-active' : 'nav-link'}>
                  {dict.nav[item.key]}
                </Link>
              )
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 md:pb-12">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-background/95 px-2 py-2 backdrop-blur md:hidden" aria-label={dict.nav.mobile}>
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link key={item.href} href={item.href} className={active ? 'mobile-nav mobile-nav-active' : 'mobile-nav'}>
                <span aria-hidden="true">{item.icon}</span>
                <span>{dict.nav[item.key]}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
