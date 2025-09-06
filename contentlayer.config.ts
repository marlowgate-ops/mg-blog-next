// contentlayer.config.ts
import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import remarkGfm from 'remark-gfm'

export const Post = defineDocumentType(() => ({
  name: 'Post',
  contentType: 'mdx',
  // ここはあなたの構成に合わせる（src ではなく content/ 配下を使っている前提）
  filePathPattern: 'content/blog/**/*.mdx',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: false },
    // ← これを追加（オプショナルにしておくと投稿に日付が無くても通ります）
    date: { type: 'date', required: false },
    draft: { type: 'boolean', required: false, default: false },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) =>
        doc._raw.flattenedPath
          .replace(/^content\/blog\//, '')
          .replace(/\\/g, '/'),
    },
  },
}))

export default makeSource({
  contentDirPath: '.',
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    ],
  },
})
