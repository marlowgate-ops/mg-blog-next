import { defineDocumentType, makeSource } from 'contentlayer/source-files'

export const Post = defineDocumentType(() => ({
  name: 'Post',
  // Only scan content/blog and ignore files starting with "_" (templates)
  filePathPattern: `blog/**/[!_]*.mdx`,
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
    url: { type: 'string', resolve: (doc) => `/blog/${doc._raw.flattenedPath.replace(/^blog\//, '').replace(/\.mdx$/, '')}` },
    slug: { type: 'string', resolve: (doc) => doc.slug || doc._raw.flattenedPath.split('/').pop()?.replace(/\.mdx$/, '') || '' },
  },
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Post],
  // TEMP: drop remark-gfm entirely while we stabilize
  mdx: {},
})
