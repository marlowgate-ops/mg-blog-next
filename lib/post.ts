import { allPosts as _all } from 'contentlayer/generated'

export type Post = typeof _all[number]

/**
 * Return ISO date string if present in any common frontmatter fields.
 * Supports: date, pubDate, publishedAt, published
 */
export function pickDate(p: Partial<Post>): string | undefined {
  const anyp = p as any
  return anyp?.date ?? anyp?.pubDate ?? anyp?.publishedAt ?? anyp?.published ?? undefined
}

/** Stable numeric timestamp for sort (fallback 0). */
export function toTime(p: Partial<Post>): number {
  const d = pickDate(p)
  const t = d ? Date.parse(d) : NaN
  return Number.isFinite(t) ? t : 0
}

/** Filter out drafts and sort desc by date. */
export function sortedPosts(posts: Post[]): Post[] {
  return [...posts].filter(p => !(p as any).draft).sort((a, b) => toTime(b) - toTime(a))
}

/** Unique tag list (string-cast for robustness). */
export function uniqueTags(posts: Post[]): string[] {
  const set = new Set<string>()
  for (const p of posts) {
    const arr = ((p as any).tags ?? []) as unknown[]
    for (const t of arr) set.add(String(t))
  }
  return [...set]
}
