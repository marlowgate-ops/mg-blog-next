import type { ReactNode } from 'react'
import FooterMini from '@/components/FooterMini'

// Wrap every route and append the footer globally without touching your existing layout.tsx
export default function Template({ children }: { children: ReactNode }) {
  return (<>{children}<FooterMini /></>)
}
