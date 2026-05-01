'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

const navItems = [
  { href: '/', label: 'Start', icon: '⌂' },
  { href: '/names', label: 'Namen', icon: '◇' },
  { href: '/learn', label: 'Lernen', icon: '◐' },
  { href: '/settings', label: 'Setup', icon: '⚙' },
]

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <>
      <div className="star-field fixed inset-0 -z-10" />
      <header className="sticky top-0 z-30 border-b border-white/10 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="focus-ring rounded-md">
            <span className="block text-lg font-semibold text-primary">99 Names</span>
            <span className="block text-xs text-gold">Lernhilfe</span>
          </Link>
          <nav className="hidden items-center gap-2 md:flex" aria-label="Hauptnavigation">
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
              return (
                <Link key={item.href} href={item.href} className={active ? 'nav-link nav-link-active' : 'nav-link'}>
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 md:pb-12">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-background/95 px-2 py-2 backdrop-blur md:hidden" aria-label="Mobile Navigation">
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
            return (
              <Link key={item.href} href={item.href} className={active ? 'mobile-nav mobile-nav-active' : 'mobile-nav'}>
                <span aria-hidden="true">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
