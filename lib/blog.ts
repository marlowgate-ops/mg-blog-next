// lib/blog.ts
import { allPosts, Post } from 'contentlayer/generated'

/** 下書きを除外し日付降順でソートした配列 */
export const published = [...allPosts]
  .filter(p => !p.draft)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

export function getBySlug(slug: string): Post | undefined {
  return published.find(p => p.slug === slug)
}

export function paginate(page: number, perPage = 10) {
  const offset = (page - 1) * perPage
  return {
    items: published.slice(offset, offset + perPage),
    total: published.length,
    pages: Math.max(1, Math.ceil(published.length / perPage)),
  }
}

export function allTags() {
  const s = new Set<string>()
  published.forEach(p => (p.tags ?? []).forEach(t => s.add(t)))
  return [...s].sort()
}

export function byTag(tag: string) {
  return published.filter(p => (p.tags ?? []).includes(tag))
}
