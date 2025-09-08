import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import remarkGfm from 'remark-gfm'

export type Heading = { id: string; text: string; level: number }
export function extractHeadings(markdown: string): Heading[] {
  const out: Heading[] = []
  const lines = (markdown || '').split('\n')
  for (const line of lines) {
    const m = /^(#{1,6})\s+(.+)$/.exec(line)
    if (!m) continue
    const level = m[1].length
    const text = m[2].replace(/[#*_`~]/g, '').trim()
    const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '')
    out.push({ id, text, level })
  }
  return out
}

function readingTime(text: string): number {
  const charsPerMinJa = 500 // 日本語の目安
  const n = (text || '').replace(/\s+/g, '').length
  return Math.max(1, Math.round(n / charsPerMinJa))
}

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `content/blog/**/[!_]*.mdx`, // 先頭が _ のMDXはビルド対象外（テンプレ除外）
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: false },
    date: { type: 'date', required: true },
    lastmod: { type: 'date', required: false },
    draft: { type: 'boolean', required: false, default: false },
    tags: { type: 'list', of: { type: 'string' }, required: false },
    slug: { type: 'string', required: false },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => `/blog/${doc._raw.flattenedPath.replace(/^content\/blog\//, '').replace(/\.mdx$/, '')}`,
    },
    slug: {
      type: 'string',
      resolve: (doc) => doc.slug || doc._raw.flattenedPath.split('/').pop()?.replace(/\.mdx$/, '') || '',
    },
    readingTimeMins: {
      type: 'number',
      resolve: (doc) => readingTime((doc as any).body?.raw || ''),
    },
    headings: {
      type: 'json',
      resolve: (doc) => extractHeadings((doc as any).body?.raw || ''),
    },
  },
}))

export default makeSource({
  contentDirPath: '.',
  documentTypes: [Post],
  mdx: { remarkPlugins: [remarkGfm] },
})
