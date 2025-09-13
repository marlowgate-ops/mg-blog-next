import type { ReactNode } from 'react'
import ArticleCTA from '../../../components/ArticleCTA'
export default function BlogPostTemplate({ children }: { children: ReactNode }) {
  return (<>{children}<ArticleCTA /></>)
}
