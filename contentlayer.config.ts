// contentlayer.config.ts
import { defineDocumentType, makeSource } from 'contentlayer/source-files'

export const Post = defineDocumentType(() => ({
  name: 'Post',
  // content/ をルートに読み込む想定。記事は content/blog 配下。
  filePathPattern: 'blog/**/*.mdx',
  fields: {
    title:       { type: 'string', required: true },
    description: { type: 'string', required: false },
    date:        { type: 'date',   required: false },   // ← 追加
    draft:       { type: 'boolean', required: false, default: false },
    tags:        { type: 'list', of: { type: 'string' }, required: false, default: [] },
  },
  computedFields: {
    slug: {
      type: 'string',
      // 例: content/blog/hello-world.mdx -> hello-world
      resolve: doc => doc._raw.flattenedPath.replace(/^blog\//, ''),
    },
    url: {
      type: 'string',
      resolve: doc => `https://blog.marlowgate.com/blog/${doc._raw.flattenedPath.replace(/^blog\//, '')}`,
    },
  },
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Post],
})
