import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NameDetailArticle } from '@/components/NameDetailArticle'
import { getNameBySlug, names } from '@/data/names'
import { getNamePageMetadata } from '@/lib/seo'

type Props = {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return names.map((name) => ({ slug: name.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const name = getNameBySlug(slug)
  if (!name) return {}
  return getNamePageMetadata(name, 'de')
}

export default async function GermanNameDetailPage({ params }: Props) {
  const { slug } = await params
  const name = getNameBySlug(slug)
  if (!name) notFound()
  return <NameDetailArticle name={name} locale="de" />
}
