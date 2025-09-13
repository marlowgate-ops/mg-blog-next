import type { ReactNode } from 'react'
import ArticleCTA from '../../../components/ArticleCTA'
import JsonLdArticle from '../../../components/JsonLdArticle'
import ArticleTocFloating from '../../../components/ArticleTocFloating'
import ArticleReaderStyles from '../../../components/ArticleReaderStyles'

export default function BlogPostTemplate({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLdArticle />
      <ArticleReaderStyles />
      <ArticleTocFloating />
      {children}
      <ArticleCTA />
    </>
  )
}
