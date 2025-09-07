// lib/posts.ts
import { allPosts, type Post } from 'contentlayer/generated'

/** 一覧の1ページあたり件数（他ファイルからも参照できるよう export） */
export const PER_PAGE = 10

/** 公開済み記事（draft を除外）を新しい順に並べ替え */
export const publishedPosts: Post[] = allPosts
  .filter((p) => !p.draft)
  .sort(byDateDesc)

/** ページネーション（1 始まり）。perPage の既定値は PER_PAGE */
export function paginate(page = 1, perPage = PER_PAGE) {
  const total = publishedPosts.length
  const pages = Math.max(1, Math.ceil(total / perPage))
  const current = Math.min(Math.max(page, 1), pages)
  const start = (current - 1) * perPage

  return {
    items: publishedPosts.slice(start, start + perPage),
    total,
    page: current,
    perPage,
    pages,
  }
}

/* ---- helpers ---- */

/** date が未定義でも落ちない「新しい順」比較 */
function byDateDesc(a: Post, b: Post) {
  const ad = toTime(a.date as any)
  const bd = toTime(b.date as any)
  return bd - ad
}

/** string | Date | undefined を number に正規化（未定義や不正は 0 ）*/
function toTime(d?: string | Date) {
  if (!d) return 0
  const t = typeof d === 'string' ? Date.parse(d) : d.getTime()
  return Number.isNaN(t) ? 0 : t
}
