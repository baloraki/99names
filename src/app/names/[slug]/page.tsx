import { notFound } from 'next/navigation'
import { NameDetailClient } from '@/components/NameDetailClient'
import { getNameBySlug, names } from '@/data/names'

export function generateStaticParams() {
  return names.map((name) => ({ slug: name.slug }))
}

export default async function NameDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const name = getNameBySlug(slug)
  if (!name) notFound()
  return <NameDetailClient name={name} />
}
