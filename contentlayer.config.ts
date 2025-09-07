import { defineDocumentType, makeSource } from "contentlayer/source-files";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";

// 記事スキーマ
export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `blog/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: false },
    date: { type: "date", required: true },
    slug: { type: "string", required: true },
    draft: { type: "boolean", default: false },
    tags: { type: "list", of: { type: "string" } }
  },
  computedFields: {
    url: { type: "string", resolve: (doc) => `/blog/${doc.slug}` }
  }
}));

// Shiki を使うハイライト（shiki は package.json に追加済み）
const prettyCodeOptions = {
  theme: { light: "github-light", dark: "github-dark" }
};

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
      [rehypePrettyCode, prettyCodeOptions]
    ]
  }
});
