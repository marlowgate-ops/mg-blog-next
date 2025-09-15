import type { NextRequest } from 'next/server'

export const revalidate = 3600  // Re-generate at most once per hour

type Post = {
  title?: string
  description?: string
  body?: { raw?: string }
  date?: string
  slug?: string
  slugAsParams?: string
  _raw?: { flattenedPath?: string }
}

// --- Japanese-friendly summary (single-file, dependency-free) ---
function stripCodeBlocks(s: string) {
  return s.replace(/```[\s\S]*?```/g, '').replace(/`[^`]*`/g, '')
}

function stripMdHtml(s: string) {
  return s
    .replace(/<[^>]+>/g, ' ')
    .replace(/^\s*#+\s*/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/!\[[^\]]*\]\([^\)]*\)/g, '')
    .replace(/\[[^\]]*\]\([^\)]*\)/g, '$1')
}

function normalizeJp(s: string) {
  let out = s
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([。、！!？?])\s*/g, '$1')
    .replace(/[\u3000\s]{2,}/g, ' ')
    .trim()
  out = out.replace(/[!！?？]+$/, '。')
  return out
}

function summarizeJp(input: string, max = 160) {
  const base = normalizeJp(stripMdHtml(stripCodeBlocks(input || '')))
  if (!base) return ''
  const m = base.match(/.+?[。！？!?]/)
  if (m && m[0].length >= 36 && m[0].length <= max) return m[0]
  const arr = Array.from(base)
  const sliced = arr.slice(0, Math.min(max, arr.length)).join('')
  return sliced + (arr.length > max ? '…' : '')
}

async function getAllPosts(): Promise<Post[]> {
  try {
    const mod: any = await import('contentlayer/generated')
    const all: any[] = (mod.allPosts || mod.allArticles || mod.allDocs || [])
    return all
  } catch {
    return []
  }
}

function getSlug(p: Post) {
  return String(p.slug || p.slugAsParams || p._raw?.flattenedPath || '')
}

export async function GET(_req: NextRequest) {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.marlowgate.com').replace(/\/$/, '')
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Marlow Gate – Blog'
  const siteDesc = process.env.NEXT_PUBLIC_SITE_TAGLINE || '読むたびに価値が積み上がる。'

  const posts = (await getAllPosts())
    .filter(Boolean)
    .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
    .slice(0, 50)

  const items = posts.map((p) => {
    const slug = getSlug(p)
    const url = `${base}/blog/${encodeURIComponent(slug)}`
    const raw = p.description || p.body?.raw || ''
    const desc = summarizeJp(raw, 160)
    const pub = p.date ? new Date(p.date) : new Date()
    const pubStr = pub.toUTCString()
    const title = (p.title || slug).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

    return `
      <item>
        <title>${title}</title>
        <link>${url}</link>
        <guid isPermaLink="true">${url}</guid>
        <pubDate>${pubStr}</pubDate>
        <description>${desc.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</description>
      </item>
    `.trim()
  }).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>${siteName.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</title>
      <link>${base}</link>
      <description>${siteDesc.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</description>
      ${items}
    </channel>
  </rss>`

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=UTF-8',
      'Cache-Control': 'public, max-age=300, s-maxage=3600',
    },
  })
}
