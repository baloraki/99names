import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { AnchorHTMLAttributes, ImgHTMLAttributes } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AppShell } from './AppShell'

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
  usePathname: () => '/de',
  useRouter: () => ({ push: vi.fn() }),
}))

const originalClipboard = navigator.clipboard
const originalShare = navigator.share

afterEach(() => {
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
