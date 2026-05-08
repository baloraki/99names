import { Inter, Noto_Naskh_Arabic } from 'next/font/google'

export const fontSans = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-sans',
  fallback: ['system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
})

export const fontArabic = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-arabic',
  weight: ['400', '500', '700'],
  fallback: ['Amiri', 'Scheherazade New', 'Geeza Pro', 'Tahoma', 'serif'],
})
