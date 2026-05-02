import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { AnchorHTMLAttributes, ImgHTMLAttributes } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AppShell } from './AppShell'

const navigationMock = vi.hoisted(() => ({
  pathname: '/de',
  push: vi.fn(),
}))

vi.mock('next/image', () => ({
  default: ({ alt, priority, unoptimized, ...props }: ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean; unoptimized?: boolean }) => {
    void priority
    void unoptimized
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={alt ?? ''} />
  },
}))

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock('next/navigation', () => ({
  usePathname: () => navigationMock.pathname,
  useRouter: () => ({ push: navigationMock.push }),
}))

const originalClipboard = navigator.clipboard
const originalShare = navigator.share

afterEach(() => {
  navigationMock.pathname = '/de'
  navigationMock.push.mockClear()
  window.localStorage.clear()
  document.cookie = 'app_language=; Max-Age=0; Path=/'
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: originalClipboard,
  })
  Object.defineProperty(navigator, 'share', {
    configurable: true,
    value: originalShare,
  })
})

describe('AppShell', () => {
  it('renders the language switcher only once', () => {
    render(
      <AppShell routeLanguage="de">
        <div>Inhalt</div>
      </AppShell>,
    )

    expect(screen.getAllByRole('combobox', { name: 'Sprache' })).toHaveLength(1)
  })

  it('links to the localized settings route in German navigation', () => {
    navigationMock.pathname = '/de/einstellungen'

    render(
      <AppShell routeLanguage="de">
        <div>Einstellungen</div>
      </AppShell>,
    )

    expect(screen.getAllByRole('combobox', { name: 'Sprache' })).toHaveLength(1)
    expect(screen.getAllByRole('link', { name: 'Namen' })).toHaveLength(2)
    for (const link of screen.getAllByRole('link', { name: 'Namen' })) {
      expect(link).toHaveAttribute('href', '/de/namen')
    }
    for (const link of screen.getAllByRole('link', { name: 'Einstellungen' })) {
      expect(link).toHaveAttribute('href', '/de/einstellungen')
    }
  })

  it('keeps English content routes bound to the English navigation when the route is English', () => {
    navigationMock.pathname = '/names'

    render(
      <AppShell routeLanguage="en">
        <div>Names</div>
      </AppShell>,
    )

    expect(screen.getAllByRole('combobox', { name: 'Language' })).toHaveLength(1)
    expect(screen.getAllByRole('link', { name: 'Names' })).toHaveLength(2)
    for (const link of screen.getAllByRole('link', { name: 'Names' })) {
      expect(link).toHaveAttribute('href', '/names')
    }
    for (const link of screen.getAllByRole('link', { name: 'Settings' })) {
      expect(link).toHaveAttribute('href', '/settings')
    }
  })

  it('copies the current page link when native sharing is unavailable', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: undefined,
    })
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })

    render(
      <AppShell routeLanguage="de">
        <div>Inhalt</div>
      </AppShell>,
    )

    fireEvent.click(screen.getAllByRole('button', { name: 'Teilen' })[0])

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(window.location.href)
    })
    expect(screen.getByText('Kopiert')).toBeInTheDocument()
  })
})
