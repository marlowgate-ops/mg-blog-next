import { allPosts } from 'contentlayer/generated'

export const dynamic = 'force-static'

export async function GET() {
  const items = allPosts
    .filter(p => !p.draft)
    .map(p => ({
      title: p.title,
      description: p.description,
      slug: p.slug,
      url: p.url,
      date: p.date,
      tags: p.tags || []
    }))

  return new Response(JSON.stringify({ items }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  })
}
