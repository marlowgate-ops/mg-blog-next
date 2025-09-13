import type { ReactNode } from 'react'
import FooterMini from '../components/FooterMini'
import JsonLdBreadcrumbs from '../components/JsonLdBreadcrumbs'
import GA4CopyVariant from '../components/GA4CopyVariant'

export default function Template({ children }: { children: ReactNode }) {
  return (
    <>
      <GA4CopyVariant />
      <JsonLdBreadcrumbs />
      {children}
      <FooterMini />
    </>
  )
}
