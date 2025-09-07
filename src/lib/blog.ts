import { getPostsByPage, getAllPosts } from './post'

export const PAGE_SIZE = 10

export function paginate(page: number, perPage = PAGE_SIZE) {
  return getPostsByPage(page, perPage)
}

export function totalPages(perPage = PAGE_SIZE) {
  const total = getAllPosts().length
  return Math.max(1, Math.ceil(total / perPage))
}
