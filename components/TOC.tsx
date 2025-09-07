'use client'
import React from 'react'

type Heading = { level: number, text: string, id: string }

export default function TOC({ headings }: { headings: Heading[] }) {
  if (!headings?.length) return null
  return (
    <nav aria-label="Table of contents" className="mb-8 rounded-xl border p-4">
      <div className="font-semibold mb-2">Contents</div>
      <ul className="space-y-1 text-sm">
        {headings.map((h, i) => (
          <li key={i} style={{ marginLeft: (h.level-1)*12 }}>
            <a className="underline" href={`#${h.id}`}>{h.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
