import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import remarkGfm from 'remark-gfm'

function extractHeadings(markdown) {
  const lines = markdown.split('\n')
  const hs = []
  for (const line of lines) {
    const m = /^(#{1,3})\s+(.*)/.exec(line)
    if (m) {
      const level = m[1].length
      const text = m[2].trim()
      const id = text.toLowerCase().replace(/[^a-z0-9\u3040-\u30ff\u4e00-\u9faf\s-]/gi,'').replace(/\s+/g,'-')
      hs.push({ level, text, id })
    }
  }
  return hs
}

function estimateReadingTime(markdown) {
  // naive JP/EN mixed: 400 chars or 200 words per minute
  const chars = markdown.replace(/\s+/g,'').length
  const words = markdown.split(/\s+/).length
  const minutes = Math.ceil(Math.max(chars/400, words/200))
  return minutes
}

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `blog/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
    date: { type: 'date', required: true },
    updated: { type: 'date', required: false },
    draft: { type: 'boolean', default: false },
    tags: { type: 'list', of: { type: 'string' }, default: [] },
    slug: { type: 'string', required: true }
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => `/blog/${doc.slug}`
    },
    headings: {
      type: 'json',
      resolve: (doc) => extractHeadings(doc.body.raw || '')
    },
    readingTimeMins: {
      type: 'number',
      resolve: (doc) => estimateReadingTime(doc.body.raw || '')
    },
    lastmod: {
      type: 'date',
      resolve: (doc) => (doc.updated ?? doc.date)
    }
  }
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }]
    ]
  }
})
