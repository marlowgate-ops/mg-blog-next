// lib/posts.ts
import { allPosts } from 'contentlayer/generated'

export type Post = typeof allPosts[number]

export const publishedPosts: Post[] = allPosts
  .filter(p => !p.draft)
  .sort((a, b) => (a.date < b.date ? 1 : -1)) // 新しい順

export function paginate(page = 1, perPage = 10) {
  const total = publishedPosts.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const start = (page - 1) * perPage
  return {
    items: publishedPosts.slice(start, start + perPage),
    total,
    totalPages,
    page,
    perPage,
  }
}

export function tagMap() {
  const m = new Map<string, number>()
  for (const p of publishedPosts) for (const t of p.tags ?? []) {
    m.set(t, (m.get(t) ?? 0) + 1)
  }
  return m
}
