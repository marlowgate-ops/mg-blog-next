import React from 'react'
import ArticleFooterCTA from '@/components/ArticleFooterCta'

// This template wraps every /blog/[slug] page.
// It lets us append the CTA after the article without changing page.tsx.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      {/* Persistent, non-intrusive CTA under the article */}
      <ArticleFooterCTA />
    </>
  )
}
