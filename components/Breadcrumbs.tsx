'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import s from './breadcrumbs.module.css'

export default function Breadcrumbs() {
  const pathname = usePathname() || '/'
  const parts = pathname.split('/').filter(Boolean)
  const items = [{ href: '/', label: 'トップへ' }]
  if (parts[0] !== 'blog') items.push({ href: '/blog', label: '記事一覧' })
  if (parts[0] === 'blog' && parts[1]) items.push({ href: pathname, label: decodeURIComponent(parts[1]) })

  return (
    <nav aria-label="パンくずリスト" className={s.wrap}>
      <ol className={s.list}>
        {items.map((it, i) => (
          <li key={i} className={s.item}>
            {i < items.length - 1 ? (
              <Link href={it.href} className={s.link} prefetch={false}>
                {it.label}
              </Link>
            ) : (
              <span className={s.current} aria-current="page">{it.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
