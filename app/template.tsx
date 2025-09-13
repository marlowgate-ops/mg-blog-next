import type { ReactNode } from 'react'
import FooterMini from '../components/FooterMini'
export default function Template({ children }: { children: ReactNode }) {
  return (<>{children}<FooterMini /></>)
}
