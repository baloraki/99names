import type { JsonLdValue } from '@/lib/structuredData'
import { serializeJsonLd } from '@/lib/structuredData'

export function JsonLd({ data }: { data: JsonLdValue }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  )
}
