'use client'
import React from 'react'

type Heading = { level: number, text: string, id: string }

export default function TOC({ headings }: { headings: Heading[] }) {
  const [active, setActive] = React.useState<string>('')

  React.useEffect(() => {
    if (!headings?.length) return
    const ids = headings.map(h => h.id).filter(Boolean)
    const elements = ids
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el)

    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => (a.target as HTMLElement).offsetTop - (b.target as HTMLElement).offsetTop)
        if (visible[0]) {
          setActive((visible[0].target as HTMLElement).id)
          return
        }
        const scrollY = window.scrollY + 100
        const before = elements.filter(el => el.offsetTop <= scrollY)
        if (before.length) setActive(before[before.length - 1].id)
      },
      { rootMargin: '0px 0px -60% 0px', threshold: [0, 1] }
    )
    elements.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [headings])

  if (!headings?.length) return null

  return (
    <nav aria-label="目次" className="card" style={{margin: '20px 0', padding:'16px'}}>
      <div className="small muted" style={{fontWeight:600, marginBottom:'6px'}}>目次</div>
      <ul style={{listStyle:'none', padding:0, margin:0}}>
        {headings.map((h, i) => {
          const isActive = active === h.id
          return (
            <li key={i} style={{margin: '6px 0', marginLeft: (h.level-1)*8}}>
              <a
                href={`#${h.id}`}
                aria-current={isActive ? 'true' : undefined}
                style={{ textDecoration: isActive ? 'underline' : 'none', fontWeight: isActive ? 600 : 400 }}
              >
                {h.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
