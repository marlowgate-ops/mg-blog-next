import type { ReactNode } from 'react'
import Breadcrumbs from '../../../components/Breadcrumbs'
import EndCTA from '../../../components/EndCTA'

export default function BlogPostLayout({ children }: { children: ReactNode }) {
  const breadcrumbItems = [
    { name: 'ホーム', href: '/' },
    { name: 'ブログ', href: '/blog' },
  ]
  
  return (
    <article>
      <Breadcrumbs items={breadcrumbItems} />
      {children}
      <EndCTA />
    </article>
  )
}
