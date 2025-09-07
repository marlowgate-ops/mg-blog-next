import { defineDocumentType, makeSource } from 'contentlayer/source-files'

const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `content/blog/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: false },
    date: { type: 'date', required: true },
    draft: { type: 'boolean', required: false, default: false },
    slug: { type: 'string', required: false },   // ← 任意に変更
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
  documentTypes: [Post]
})
