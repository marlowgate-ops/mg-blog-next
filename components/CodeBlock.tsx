'use client'
import React from 'react'

export default function CodeBlock({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const onCopy = async () => {
    const text = ref.current?.innerText || ''
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // noop
    }
  }
  return (
    <div className="relative group">
      <button
        className="absolute right-2 top-2 rounded-md border px-2 py-1 text-xs opacity-70 group-hover:opacity-100"
        onClick={onCopy}
        aria-label="Copy code"
        type="button"
      >
        Copy
      </button>
      <div ref={ref} className="rounded-xl p-4 overflow-auto">
        {children}
      </div>
    </div>
  )
}
