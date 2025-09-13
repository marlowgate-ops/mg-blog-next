import type { ReactNode } from 'react'
import ArticleCTA from '../../../components/ArticleCTA'
import JsonLdArticle from '../../../components/JsonLdArticle'

export default function BlogPostTemplate({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLdArticle />
      {children}
      <ArticleCTA />
    </>
  )
}
