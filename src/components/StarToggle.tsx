'use client'

import type { MouseEvent, SVGProps } from 'react'
import { useState } from 'react'

type Props = {
  active: boolean
  onToggle: () => void
  labelAdd: string
  labelRemove: string
  size?: 'sm' | 'md'
  stopPropagation?: boolean
}

export function StarToggle({ active, onToggle, labelAdd, labelRemove, size = 'md', stopPropagation = false }: Props) {
  const [pulse, setPulse] = useState(false)

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (stopPropagation) {
      event.preventDefault()
      event.stopPropagation()
    }
    setPulse(true)
    window.setTimeout(() => setPulse(false), 240)
    onToggle()
  }

  const dimensions = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'
  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={active}
      aria-label={active ? labelRemove : labelAdd}
      className={[
        'star-toggle focus-ring inline-flex items-center justify-center rounded-full border transition',
        dimensions,
        active
          ? 'border-gold/60 bg-gold/10 text-gold'
          : 'border-white/15 bg-white/5 text-muted hover:border-gold/40 hover:text-gold',
        pulse ? 'star-toggle-pulse' : '',
      ].filter(Boolean).join(' ')}
    >
      <StarIcon className={iconSize} filled={active} />
    </button>
  )
}

function StarIcon({ filled, ...props }: SVGProps<SVGSVGElement> & { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 3.5l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.6 6.6 20.4l1-6.1L3.2 10l6.1-.9L12 3.5z" />
    </svg>
  )
}
