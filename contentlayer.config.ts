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
  filePathPattern: `insurance/**/*.{md,mdx}`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    slug: { type: 'string', required: true },
    provider: { type: 'string', required: true },
    category: { type: 'enum', options: ['auto', 'medical', 'life'], required: true },
    tagline: { type: 'string', required: true },
    pros: { type: 'list', of: { type: 'string' }, required: true },
    cons: { type: 'list', of: { type: 'string' }, required: true },
    priceNote: { type: 'string', required: true },
    ratingValue: { type: 'number', required: true },
    ratingCount: { type: 'number', required: true },
    ctaLabel: { type: 'string', required: true },
    ctaUrl: { type: 'string', required: true },
    updatedAt: { type: 'date', required: true },
  },
  computedFields: {
    url: { type: 'string', resolve: (doc) => `/best/insurance/${doc.category}/${doc.slug}` },
    slug: { type: 'string', resolve: (doc) => doc.slug || doc._raw.flattenedPath.split('/').pop()?.replace(/\.mdx?$/, '') || '' },
    rating: { 
      type: 'json', 
      resolve: (doc) => ({ value: doc.ratingValue, count: doc.ratingCount })
    },
    cta: {
      type: 'json',
      resolve: (doc) => ({ label: doc.ctaLabel, url: doc.ctaUrl })
    },
  },
}))

export const Broker = defineDocumentType(() => ({
  name: 'Broker',
  filePathPattern: `brokers/**/*.{md,mdx}`,
  contentType: 'mdx',
  fields: {
    name: { type: 'string', required: true },
    slug: { type: 'string', required: true },
    country: { type: 'string', required: true },
    regulators: { type: 'list', of: { type: 'string' }, required: true },
    safetyScore: { type: 'number', required: true },
    spreads: { type: 'json', required: true }, // { majorPairs: { USDJPY: 0.2, EURUSD: 0.1, ... } }
    feesNote: { type: 'string', required: true },
    platforms: { type: 'list', of: { type: 'string' }, required: true },
    funding: { type: 'list', of: { type: 'string' }, required: true },
    pros: { type: 'list', of: { type: 'string' }, required: true },
    cons: { type: 'list', of: { type: 'string' }, required: true },
    ratingValue: { type: 'number', required: true },
    ratingCount: { type: 'number', required: true },
    ctaLabel: { type: 'string', required: true },
    ctaUrl: { type: 'string', required: true },
    updatedAt: { type: 'date', required: true },
  },
  computedFields: {
    url: { type: 'string', resolve: (doc) => `/brokers/${doc.slug}` },
    slug: { type: 'string', resolve: (doc) => doc.slug || doc._raw.flattenedPath.split('/').pop()?.replace(/\.mdx?$/, '') || '' },
    rating: { 
      type: 'json', 
      resolve: (doc) => ({ value: doc.ratingValue, count: doc.ratingCount })
    },
    cta: {
      type: 'json',
      resolve: (doc) => ({ label: doc.ctaLabel, url: doc.ctaUrl })
    },
  },
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Post, InsuranceProduct, Broker],
  // TEMP: drop remark-gfm entirely while we stabilize
  mdx: {},
})
