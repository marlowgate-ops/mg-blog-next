// Improved RSS feed with Japanese-friendly summaries
import type { NextRequest } from 'next/server'

export const dynamic = 'force-static' as const
export const revalidate = 3600 // 1h

function escapeXml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function stripHtml(mdOrHtml: string) {
  // very small sanitizer: remove code fences, html tags, md links/images
  let s = mdOrHtml
    .replace(/```[\s\S]*?```/g, ' ')             // fenced code
    .replace(/`[^`]*`/g, ' ')                   // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')      // images
    .replace(/\[[^\]]*\]\([^)]*\)/g, ' ')       // links
    .replace(/<[^>]+>/g, ' ')                   // html tags
    .replace(/[#>*_~\-]{1,}/g, ' ')             // markdown noise
    .replace(/\r?\n+/g, ' ')                    // newlines
  s = s.replace(/\s{2,}/g, ' ').trim()
  return s
}

function summarizeJa(raw: string, max = 120) {
  const text = stripHtml(raw)
  if (!text) return ''
  // Prefer sentence end "。" if available within range
  const firstPeriod = text.indexOf('。')
  let summary: string
  if (firstPeriod !== -1 && firstPeriod <= max + 20) {
    summary = text.slice(0, firstPeriod + 1)
  } else {
    // safe unicode slice
    const arr = Array.from(text)
    summary = arr.slice(0, Math.min(arr.length, max)).join('')
    if (arr.length > max) summary += '…'
  }
  // avoid ugly endings
  summary = summary.replace(/[,、。・:;、]+$/u, '')
  return summary
}

async function getPosts() {
  try {
    const mod: any = await import('contentlayer/generated')
    const col: any[] = mod.allPosts || mod.allArticles || mod.allDocs || []
    // sort by date desc if available
    col.sort((a, b) => {
      const da = new Date(a.date || a.publishedAt || a._raw?.sourceFileMtime || 0).getTime()
      const db = new Date(b.date || b.publishedAt || b._raw?.sourceFileMtime || 0).getTime()
      return db - da
    })
    return col
  } catch {
    return []
  }
}

export async function GET(_req: NextRequest) {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  const title = process.env.NEXT_PUBLIC_SITE_NAME || 'Blog'
  const desc = process.env.NEXT_PUBLIC_SITE_TAGLINE || 'Updates'
  const posts = await getPosts()

  const itemsXml = posts.map((p) => {
    const slug = String(p.slug || p.slugAsParams || p._raw?.flattenedPath || '')
    const url = `${site.replace(/\/+$/,'')}/blog/${slug}`
    const pub = new Date(p.date || p.publishedAt || Date.now()).toUTCString()
    const s =
      p.description ||
      (p.body && (p.body.raw || p.body.code || p.body.html)) ||
      ''
    const summary = summarizeJa(String(s), 120)
    return [
      '<item>',
      `<title>${escapeXml(String(p.title || slug))}</title>`,
      `<link>${escapeXml(url)}</link>`,
      `<guid>${escapeXml(url)}</guid>`,
      `<pubDate>${pub}</pubDate>`,
      summary ? `<description>${escapeXml(summary)}</description>` : '',
      '</item>',
    ].join('')
  }).join('')

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '<channel>',
    `<title>${escapeXml(title)}</title>`,
    `<link>${escapeXml(site)}</link>`,
    `<description>${escapeXml(desc)}</description>`,
    itemsXml,
    '</channel>',
    '</rss>',
  ].join('')

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
