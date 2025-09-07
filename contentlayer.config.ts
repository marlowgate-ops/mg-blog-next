import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import rehypeSlug from 'rehype-slug'
import rehypeAutolink from 'rehype-autolink-headings'
import remarkGfm from 'remark-gfm'
import rehypePrettyCode from 'rehype-pretty-code'

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `blog/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date:  { type: 'date',   required: true },
    description: { type: 'string', required: false },
    tags: { type: 'list', of: { type: 'string' }, required: false },
    draft: { type: 'boolean', required: false, default: false },
  },
  computedFields: {
    slug: { type: 'string', resolve: (p) => p._raw.flattenedPath.replace(/^blog\//,'') },
    url:  { type: 'string', resolve: (p) => `/blog/${p._raw.flattenedPath.replace(/^blog\//,'')}` },
  },
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolink, { behavior: 'wrap' }],
      [rehypePrettyCode, { theme: 'github-dark' }],
    ],
  },
})
