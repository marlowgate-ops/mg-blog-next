import Link from 'next/link'

type Props = {
  title?: string
  desc?: string
  benefits?: string[]
  label?: string
  href?: string
}

export default function HeroMiniCTA({ title, desc, benefits, label, href }: Props) {
  const url = href || process.env.NEXT_PUBLIC_HERO_CTA_URL || '/'
  const head = title || process.env.NEXT_PUBLIC_HERO_CTA_TITLE || '今すぐ使えるテンプレ＆カレンダー'
  const body = desc || process.env.NEXT_PUBLIC_HERO_CTA_DESC || '運用の立ち上げを最短化。無料リソースを配布中。'
  const btn  = label || process.env.NEXT_PUBLIC_HERO_CTA_LABEL || '無料で受け取る'
  const envBenefits = (process.env.NEXT_PUBLIC_HERO_CTA_BENEFITS || '週次更新の運用テンプレ|主要指標ICS（時差補正）|検証ノートのひな形')
    .split('|')
    .map(s => s.trim())
    .filter(Boolean)
  const items = (benefits && benefits.length ? benefits : envBenefits).slice(0, 3)

  return (
    <aside className="no-print mb-8 rounded-3xl border p-6 sm:p-8 hover:shadow transition">
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
