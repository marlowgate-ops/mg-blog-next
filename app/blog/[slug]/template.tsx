import type { ReactNode } from 'react'
import ArticleCTA from '../../../components/ArticleCTA'
import JsonLdArticle from '../../../components/JsonLdArticle'
import ArticleTocFloating from '../../../components/ArticleTocFloating'

export default function BlogPostTemplate({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLdArticle />
      <ArticleTocFloating />
      {children}
      <ArticleCTA />
    </>
  )
}
