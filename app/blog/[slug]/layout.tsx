import type { ReactNode } from 'react'
import EndCTA from '../../../components/EndCTA'

export default function BlogPostLayout({ children }: { children: ReactNode }) {
  return (
    <article>
      {children}
      <EndCTA />
    </article>
  )
}
