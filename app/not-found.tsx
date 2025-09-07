// app/not-found.tsx
import Link from 'next/link'
export default function NotFound() {
  return (
    <section className="prose">
      <h1>404</h1>
      <p>This page could not be found.</p>
      <p><Link href="/blog">Go to Blog</Link></p>
    </section>
  )
}
