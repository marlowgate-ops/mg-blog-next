import Link from 'next/link'

// We rely on the existing A/B copy in '@/lib/copy' if present.
// Fall back to environment variables or safe defaults.
// The module is typed as 'any' to avoid coupling with user code.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Copy: any = {}
try {
  // @ts-expect-error – project-local module may not export types
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Copy = require('@/lib/copy')
} catch (_) {
  // keep empty; fallbacks below will be used
}

const variant =
  process.env.NEXT_PUBLIC_COPY_VARIANT === 'B' ||
  process.env.NEXT_PUBLIC_COPY_VARIANT === 'b'
    ? 'B'
    : 'A'

const ctaFromCopy = Copy?.cta ?? Copy?.CTA ?? {}
const fromVariant = ctaFromCopy?.[variant] ?? {}

const label: string =
  fromVariant.label ?? process.env.NEXT_PUBLIC_CTA_LABEL ?? '無料で受け取る'
const benefits: string =
  fromVariant.benefits ?? process.env.NEXT_PUBLIC_CTA_BENEFITS ??
  '業務テンプレ｜ICS検証ノート'
const url: string =
  fromVariant.url ?? process.env.NEXT_PUBLIC_CTA_URL ?? 'https://marlowgate.com/gumroad'

// Append basic UTM so GA4で追跡しやすい（静的に付与・クリーン）
function withUtm(href: string) {
  try {
    const u = new URL(href)
    if (!u.searchParams.has('utm_source')) {
      u.searchParams.set('utm_source', 'blog')
      u.searchParams.set('utm_medium', 'article')
      u.searchParams.set('utm_campaign', 'footer_cta')
    }
    return u.toString()
  } catch {
    return href
  }
}

export default function ArticleFooterCTA() {
  const href = withUtm(url)

  return (
    <section
      aria-labelledby="cta-title"
      className="mx-auto mt-10 w-full max-w-4xl rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur-sm
                 dark:border-slate-700 dark:bg-slate-900/60"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 id="cta-title" className="text-lg font-semibold tracking-wide text-slate-900 dark:text-slate-100">
            {benefits}
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            ブログ読者限定の配布。A/Bバリアント {variant} を適用中。
          </p>
        </div>
        <div className="shrink-0">
          <Link
            href={href}
            className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-bold text-white shadow transition
                       hover:bg-sky-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            prefetch={false}
          >
            {label}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
