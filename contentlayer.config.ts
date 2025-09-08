import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import remarkGfm from 'remark-gfm'

// 型付きの見出し抽出（必要であれば他所で再利用可能）
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

const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `content/blog/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: false },
    date: { type: 'date', required: true },
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
