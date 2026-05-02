'use client'

import { useEffect } from 'react'
import { storage } from '@/lib/storage'

export function LanguageRedirect() {
  useEffect(() => {
    const preferred = storage.getLanguage()

    if (preferred === 'de') {
      window.location.replace('/de')
    } else if (preferred === 'tr') {
      window.location.replace('/tr')
    }
  }, [])

  return null
}
