import Link from 'next/link'

type Breadcrumb = {
  href: string
  label: string
}

export function Breadcrumbs({ items }: { items: Breadcrumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center gap-2">
            {index > 0 && <span aria-hidden="true" className="text-gold-muted">/</span>}
            {index === items.length - 1 ? (
              <span aria-current="page" className="text-primary">{item.label}</span>
            ) : (
              <Link href={item.href} className="rounded text-gold hover:text-gold-soft focus-ring">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
