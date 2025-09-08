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

// 粗い読み時間（200wpm）
function computeReadingTimeMins(raw: string): number {
  if (!raw) return 1
  const words = (raw.replace(/<[^>]+>/g, '').match(/\b\w+\b/g) || []).length
  const mins = Math.max(1, Math.round(words / 200))
  return mins
}

const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `content/blog/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: false },
    date: { type: 'date', required: true },
    lastmod: { type: 'date', required: false },
    draft: { type: 'boolean', required: false, default: false },
    slug: { type: 'string', required: false },
    tags: { type: 'list', of: { type: 'string' }, required: false }
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => (doc.slug ?? doc._raw.flattenedPath.replace(/^content\/blog\//, ''))
    },
    url: {
      type: 'string',
      resolve: (doc) => `/blog/${(doc.slug ?? doc._raw.flattenedPath.replace(/^content\/blog\//, ''))}`
    },
    readingTimeMins: {
      type: 'number',
      resolve: (doc) => computeReadingTimeMins((doc as any).body?.raw || '')
    }
  }
}))

export default makeSource({
  contentDirPath: '.',
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [remarkGfm]
  }
})
