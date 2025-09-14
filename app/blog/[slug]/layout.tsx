import type { ReactNode } from 'react'
import Breadcrumbs from '../../../components/Breadcrumbs'
import EndCTA from '../../../components/EndCTA'

export default function BlogPostLayout({ children }: { children: ReactNode }) {
  return (
    <article>
      <Breadcrumbs />
      {children}
      <EndCTA />
    </article>
  )
}
