// app/blog/page.tsx
import { redirect } from 'next/navigation'
export const revalidate = 60
export default function Page() {
  redirect('/blog/page/1')
}
