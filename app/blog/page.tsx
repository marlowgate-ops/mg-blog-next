import { redirect } from 'next/navigation'

export const dynamic = 'force-static'

export default function BlogIndex() {
  redirect('/blog/page/1')
}
