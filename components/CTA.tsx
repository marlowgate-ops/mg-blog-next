import Link from 'next/link'

export default function CTA() {
  return (
    <div style={{marginTop: '1.25rem'}}>
      <Link
        href="/store"
        style={{padding: '10px 14px', border: '1px solid #111', borderRadius: 10, textDecoration: 'none'}}
      >
        Go to Store
      </Link>
    </div>
  )
}
