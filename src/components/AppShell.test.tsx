import { render, screen } from '@testing-library/react'
import type { AnchorHTMLAttributes, ImgHTMLAttributes } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { AppShell } from './AppShell'

vi.mock('next/image', () => ({
  default: ({ alt, priority: _priority, unoptimized: _unoptimized, ...props }: ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean; unoptimized?: boolean }) => (
    <img {...props} alt={alt ?? ''} />
  ),
}))

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock('next/navigation', () => ({
  usePathname: () => '/de',
  useRouter: () => ({ push: vi.fn() }),
}))

describe('AppShell', () => {
  it('renders the language switcher only once', () => {
    render(
      <AppShell routeLanguage="de">
        <div>Inhalt</div>
      </AppShell>,
    )

    expect(screen.getAllByRole('combobox', { name: 'Sprache' })).toHaveLength(1)
  })
})

