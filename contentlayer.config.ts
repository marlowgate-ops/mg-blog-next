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

export const InsuranceProduct = defineDocumentType(() => ({
  name: 'InsuranceProduct',
  filePathPattern: `insurance/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    slug: { type: 'string', required: true },
    provider: { type: 'string', required: true },
    category: { type: 'enum', options: ['auto', 'medical', 'life'], required: true },
    tagline: { type: 'string', required: true },
    pros: { type: 'list', of: { type: 'string' }, required: true },
    cons: { type: 'list', of: { type: 'string' }, required: true },
    priceNote: { type: 'string', required: false },
    ratingValue: { type: 'number', required: true },
    ratingCount: { type: 'number', required: true },
    ctaLabel: { type: 'string', required: true },
    ctaUrl: { type: 'string', required: true },
    updatedAt: { type: 'date', required: true },
  },
  computedFields: {
    url: { type: 'string', resolve: (doc) => `/insurance/${doc.category}/${doc.slug}` },
  },
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Post, InsuranceProduct],
  // TEMP: drop remark-gfm entirely while we stabilize
  mdx: {},
})
