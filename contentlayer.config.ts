import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `blog/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: false },
    pubDate: { type: 'date', required: true },
    updatedDate: { type: 'date', required: false },
    draft: { type: 'boolean', required: false, default: false },
    tags: { type: 'list', of: { type: 'string' }, required: false }
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => {
        const fp = doc._raw.flattenedPath.replace(/^blog\//,'')
        return fp
      }
    },
    url: {
      type: 'string',
      resolve: (doc) => `/blog/${doc._raw.flattenedPath.replace(/^blog\//,'')}`
    }
  }
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug]
  }
})
