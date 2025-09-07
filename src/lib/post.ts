import { allPosts } from 'contentlayer/generated'

export type Post = typeof allPosts[number]

export function getAllPosts(): Post[] {
  return allPosts
    .filter(p => !p.draft)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
}

export function getPostBySlug(slug: string): Post | null {
  return getAllPosts().find(p => p.slug === slug) ?? null
}

export function getPostsByPage(page: number, perPage = 10) {
  const posts = getAllPosts()
  const totalPages = Math.max(1, Math.ceil(posts.length / perPage))
  const start = (Math.max(1, page) - 1) * perPage
  return {
    posts: posts.slice(start, start + perPage),
    totalPages
  }
}
