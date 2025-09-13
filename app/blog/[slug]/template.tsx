import type { ReactNode } from 'react'
import ArticleCTA from '@/components/ArticleCTA'

// Inject CTA right after each article page without changing page.tsx
export default function BlogPostTemplate({ children }: { children: ReactNode }) {
  return (<>{children}<ArticleCTA /></>)
}
