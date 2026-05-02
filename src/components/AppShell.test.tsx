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
  vi.restoreAllMocks()
  window.localStorage.clear()
  document.cookie = 'app_language=; Max-Age=0; Path=/'
  Object.defineProperty(window, 'scrollY', {
    configurable: true,
    value: 0,
  })
  Object.defineProperty(window, 'innerHeight', {
    configurable: true,
    value: 768,
  })
  Reflect.deleteProperty(document.documentElement, 'scrollHeight')
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
    fireEvent.click(screen.getByRole('button', { name: 'Menü öffnen' }))

    expect(screen.getAllByRole('link', { name: 'Namen' })).toHaveLength(2)
    for (const link of screen.getAllByRole('link', { name: 'Namen' })) {
      expect(link).toHaveAttribute('href', '/de/namen')
    }
    const settingsLink = screen.getByRole('link', { name: 'Einstellungen' })
    expect(settingsLink).toHaveAttribute('href', '/de/einstellungen')
    expect(settingsLink).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Über uns' })).toHaveAttribute('href', '/de/uber-uns')
    expect(screen.getByRole('link', { name: 'Kontakt' })).toHaveAttribute('href', '/de/kontakt')
    expect(screen.getByRole('link', { name: 'Datenschutz' })).toHaveAttribute('href', '/de/datenschutz')
    expect(screen.getByRole('link', { name: 'Impressum' })).toHaveAttribute('href', '/de/impressum')
  })

  it('marks active and inactive navigation links with proper aria-current states', () => {
    navigationMock.pathname = '/names'

    render(
      <AppShell routeLanguage="en">
        <div>Names</div>
      </AppShell>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))

    for (const link of screen.getAllByRole('link', { name: 'Names' })) {
      expect(link).toHaveAttribute('aria-current', 'page')
    }

    for (const link of screen.getAllByRole('link', { name: 'Home' })) {
      expect(link).not.toHaveAttribute('aria-current')
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
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))

    expect(screen.getAllByRole('link', { name: 'Names' })).toHaveLength(2)
    for (const link of screen.getAllByRole('link', { name: 'Names' })) {
      expect(link).toHaveAttribute('href', '/names')
    }
    for (const link of screen.getAllByRole('link', { name: 'Settings' })) {
      expect(link).toHaveAttribute('href', '/settings')
    }
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about')
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact')
    expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy')
    expect(screen.getByRole('link', { name: 'Imprint' })).toHaveAttribute('href', '/imprint')
    expect(screen.getByRole('contentinfo')).not.toHaveClass('hidden')
  })

  it('updates static footer links when routeLanguage changes', () => {
    const { rerender } = render(
      <AppShell routeLanguage="en">
        <div>Content</div>
      </AppShell>,
    )

    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about')

    rerender(
      <AppShell routeLanguage="de">
        <div>Inhalt</div>
      </AppShell>,
    )

    expect(screen.getByRole('link', { name: 'Über uns' })).toHaveAttribute('href', '/de/uber-uns')
  })

  it('keeps the burger in the mobile header and preserves header scroll behavior', async () => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback: FrameRequestCallback) => {
      callback(0)
      return 1
    })
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 600,
    })
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      value: 2000,
    })
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 0,
    })

    render(
      <AppShell routeLanguage="en">
        <div>Content</div>
      </AppShell>,
    )

    const header = screen.getByRole('banner')
    const menuButton = screen.getByRole('button', { name: 'Open menu' })

    expect(header).not.toHaveClass('app-header-hidden')
    expect(header).toContainElement(menuButton)

    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 120,
    })
    fireEvent.scroll(window)

    await waitFor(() => {
      expect(header).toHaveClass('app-header-hidden')
    })
    expect(header).toContainElement(menuButton)

    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 80,
    })
    fireEvent.scroll(window)

    await waitFor(() => {
      expect(header).not.toHaveClass('app-header-hidden')
      expect(header).toContainElement(menuButton)
    })

    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 1400,
    })
    fireEvent.scroll(window)

    await waitFor(() => {
      expect(header).toHaveClass('app-header-hidden')
      expect(header).toContainElement(menuButton)
    })
  })

  it('keeps the mobile menu open when a scroll event fires after tapping the burger', async () => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback: FrameRequestCallback) => {
      callback(0)
      return 1
    })
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      value: 2000,
    })

    render(
      <AppShell routeLanguage="en">
        <div>Content</div>
      </AppShell>,
    )

    const header = screen.getByRole('banner')

    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))
    expect(screen.getAllByRole('button', { name: 'Close menu' })[0]).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: /mobile navigation/i })).toBeInTheDocument()

    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 120,
    })
    fireEvent.scroll(window)

    await waitFor(() => {
      expect(header).not.toHaveClass('app-header-hidden')
      expect(screen.getAllByRole('button', { name: 'Close menu' })[0]).toBeInTheDocument()
    })
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
