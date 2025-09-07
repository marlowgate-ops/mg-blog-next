// lib/posts.ts
import { allPosts, type Post } from 'contentlayer/generated';

/** 公開済み記事（draft 以外）を新しい順でソート */
export const publishedPosts: Post[] = allPosts
  .filter((p) => !p.draft)
  .sort(byDateDesc);

/** ページネーション（1 始まり） */
export function paginate(page = 1, perPage = 10) {
  const total = publishedPosts.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(Math.max(page, 1), pages);
  const start = (current - 1) * perPage;

  return {
    items: publishedPosts.slice(start, start + perPage),
    total,
    page: current,
    perPage,
    pages,
  };
}

/** ---- helpers ---- */

/** date が未定義でも落ちない「新しい順」比較 */
function byDateDesc(a: Post, b: Post) {
  const ad = toTime(a.date);
  const bd = toTime(b.date);
  return bd - ad; // 大きい＝新しい方を先頭に
}

/** string | Date | undefined を number に正規化（未定義や不正は 0） */
function toTime(d?: string | Date) {
  if (!d) return 0;
  const t = typeof d === 'string' ? Date.parse(d) : d.getTime();
  return Number.isNaN(t) ? 0 : t;
}
