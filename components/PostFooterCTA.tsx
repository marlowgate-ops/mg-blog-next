import Link from 'next/link'
import { COPY } from '@/lib/copy'

type Props = {
  title?: string
  desc?: string
  label?: string
  href?: string
  benefits?: string[]
}

export default function PostFooterCTA({ title, desc, label, href, benefits }: Props) {
  const url = href || process.env.NEXT_PUBLIC_CTA_URL || COPY.post.href
  const btn = label || process.env.NEXT_PUBLIC_CTA_LABEL || COPY.post.label
  const head = title || process.env.NEXT_PUBLIC_CTA_TITLE || COPY.post.title
  const body = desc || process.env.NEXT_PUBLIC_CTA_DESC || COPY.post.desc
  const envBenefits = (process.env.NEXT_PUBLIC_CTA_BENEFITS || COPY.post.benefits.join('|'))
    .split('|')
    .map(s => s.trim())
    .filter(Boolean)
  const items = (benefits && benefits.length ? benefits : envBenefits).slice(0, 3)

  return (
    <aside className="no-print mt-12 rounded-3xl border p-6 sm:p-8 hover:shadow transition">
      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="flex-1">
          <div className="text-lg font-semibold">{head}</div>
          <p className="text-neutral-600 mt-1">{body}</p>
          <ul className="mt-3 text-sm list-disc pl-5 text-neutral-700">
            {items.map((it, i) => <li key={i}>{it}</li>)}
          </ul>
        </div>
        <div className="shrink-0">
          <Link href={url} className="inline-block rounded-full border px-4 py-2 text-sm hover:bg-neutral-50">
            {btn}
          </Link>
        </div>
      </div>
    </aside>
  )
}
