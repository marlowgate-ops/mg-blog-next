'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './toc.module.css'

type TocItem = { id: string; text: string; level: number }

function slugify(s: string) {
  return (s || 'section')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\u3040-\u30ff\u4e00-\u9faf\-\s]/gi, '')
    .trim()
    .replace(/\s+/g, '-')
}

export default function ArticleTocFloating() {
  const [toc, setToc] = useState<TocItem[]>([])
  const [open, setOpen] = useState(false)
  const [activeId, setActiveId] = useState<string>('')
  const obsRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    // find article container heuristically
    const root =
      document.querySelector('article') ||
      document.querySelector('main') ||
      document.body

    const heads = Array.from(
      root.querySelectorAll('h2, h3')
    ) as HTMLElement[]

    const items: TocItem[] = []
    heads.forEach((h) => {
      const txt = (h.textContent || '').trim()
      if (!txt) return
      if (!h.id) h.id = slugify(txt)
      const tag = h.tagName.toLowerCase()
      const level = tag === 'h3' ? 3 : 2
      items.push({ id: h.id, text: txt, level })
    })

    setToc(items)

    // observe for active section highlight
    if (obsRef.current) {
      obsRef.current.disconnect()
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const id = (e.target as HTMLElement).id
            if (id) setActiveId(id)
          }
        })
      },
      { rootMargin: '0px 0px -70% 0px', threshold: [0, 1] }
    )
    heads.forEach((h) => io.observe(h))
    obsRef.current = io

    return () => io.disconnect()
  }, [])

  if (!toc.length) return null

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.fab}
        aria-expanded={open}
        aria-controls="toc-panel"
        onClick={() => setOpen((v) => !v)}
      >
        目次
      </button>
      <div
        id="toc-panel"
        className={`${styles.panel} ${open ? styles.open : ''}`}
        role="navigation"
        aria-label="記事目次"
      >
        <div className={styles.panelHeader}>
          <span>この記事の目次</span>
          <button
            type="button"
            className={styles.close}
            onClick={() => setOpen(false)}
            aria-label="目次を閉じる"
          >
            ×
          </button>
        </div>
        <nav className={styles.listWrap}>
          <ul className={styles.list}>
            {toc.map((item) => (
              <li
                key={item.id}
                className={`${styles.li} ${item.level === 3 ? styles.l3 : styles.l2}`}
              >
                <a
                  href={`#${item.id}`}
                  className={`${styles.link} ${activeId === item.id ? styles.active : ''}`}
                  onClick={() => setOpen(false)}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}
