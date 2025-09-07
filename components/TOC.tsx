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

    const obs = new IntersectionObserver(
      (entries) => {
        // Pick the heading closest to the top that is intersecting
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => (a.target as HTMLElement).offsetTop - (b.target as HTMLElement).offsetTop)
        if (visible[0]) {
          setActive((visible[0].target as HTMLElement).id)
          return
        }
        // Fallback: find last heading above viewport
        const scrollY = window.scrollY + 100
        const before = elements.filter(el => el.offsetTop <= scrollY)
        if (before.length) setActive(before[before.length - 1].id)
      },
      { rootMargin: '0px 0px -60% 0px', threshold: [0, 1] }
    )

    elements.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [JSON.stringify(headings)])

  if (!headings?.length) return null

  return (
    <nav
      aria-label="Table of contents"
      className="mb-8 rounded-xl border p-4 md:sticky md:top-24 md:max-h-[calc(100vh-8rem)] md:overflow-auto bg-white"
    >
      <div className="font-semibold mb-2">目次</div>
      <ul className="space-y-1 text-sm">
        {headings.map((h, i) => {
          const isActive = active === h.id
          return (
            <li key={i} style={{ marginLeft: (h.level - 1) * 12 }}>
              <a
                className={`hover:underline ${isActive ? 'font-medium text-black' : 'text-neutral-700'}`}
                href={`#${h.id}`}
                aria-current={isActive ? 'true' : undefined}
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
