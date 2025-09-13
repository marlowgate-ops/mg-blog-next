import type { ReactNode } from 'react'
import JsonLdArticle from '../../../components/JsonLdArticle'
import ArticleReaderStyles from '../../../components/ArticleReaderStyles'
import ArticleTocFloating from '../../../components/ArticleTocFloating'
import ShareBar from '../../../components/ShareBar'
import ArticleCTA from '../../../components/ArticleCTA'

export default function BlogPostTemplate({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLdArticle />
      <ArticleReaderStyles />
      <ArticleTocFloating />
      {children}
      <ShareBar />
      <ArticleCTA />
    </>
  )
}
