import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { names } from '@/data/names'
import { ContactForm } from './ContactForm'
import { NameCard } from './NameCard'
import { ProgressSummary } from './ProgressSummary'

describe('NameCard', () => {
  it('shows Arabic, transliteration, meaning and status', () => {
    render(<NameCard name={names[0]} language="de" learned favorite />)
    expect(screen.getByText(names[0].arabic)).toBeInTheDocument()
    expect(screen.getByText(names[0].transliteration.de)).toBeInTheDocument()
    expect(screen.getByText(names[0].meanings.de)).toBeInTheDocument()
    expect(screen.getByText('Gelernt')).toBeInTheDocument()
    expect(screen.getByText('Favorit')).toBeInTheDocument()
  })
})

describe('ProgressSummary', () => {
  it('shows correct progress', () => {
    render(<ProgressSummary progress={{ learnedIds: [1, 2, 3], favoriteIds: [], updatedAt: 'now' }} />)
    expect(screen.getByText('3 / 99')).toBeInTheDocument()
    expect(screen.getByText('3%')).toBeInTheDocument()
  })
})

describe('ContactForm', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('shows validation errors and blocks submit for missing fields', () => {
    render(<ContactForm />)
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))
    expect(screen.getByText('Name is required')).toBeInTheDocument()
    expect(screen.getByText('Email is required')).toBeInTheDocument()
    expect(screen.getByText('Message is required')).toBeInTheDocument()
  })

  it('blocks submit if Web3Forms key is missing', () => {
    vi.stubEnv('NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY', '')
    render(<ContactForm />)
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Hello' } })
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))
    expect(screen.getByText('The contact form is not configured yet.')).toBeInTheDocument()
  })
})
