'use client'

import { useMemo } from 'react'
import styles from './sharebar.module.css'
import { usePathname } from 'next/navigation'

const X = (props: any) => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...props}>
    <path fill="currentColor" d="M18 2h3l-7.5 8.6L22 22h-6.8l-4.4-5.9L5.6 22H2.6l8-9.2L2 2h7l4 5.4L18 2z"/>
  </svg>
)
const LinkIcon = (props: any) => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...props}>
    <path fill="currentColor" d="M3.9 12a5 5 0 0 1 1.5-3.6l3-3a5 5 0 0 1 7.1 7.1l-1 1a1 1 0 1 1-1.4-1.4l1-1a3 3 0 1 0-4.2-4.2l-3 3A3 3 0 0 0 6 12a1 1 0 1 1-2.1 0zm16.2 0a5 5 0 0 1-1.5 3.6l-3 3a5 5 0 0 1-7.1-7.1l1-1a1 1 0 1 1 1.4 1.4l-1 1a3 3 0 1 0 4.2 4.2l3-3A3 3 0 0 0 18 12a1 1 0 1 1 2.1 0z"/>
  </svg>
)
const Line = (props: any) => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...props}>
    <path fill="currentColor" d="M12 3c5.5 0 10 3.4 10 7.5S17.5 18 12 18c-.7 0-1.3 0-2-.1L6 21l.6-3.5C4.1 16.2 2 14 2 10.5 2 6.4 6.5 3 12 3zm-3 6.2H7.5V14H9V9.2zM10.5 14H12V9.2h-1.5V14zm6-1.8V9.2H14V14h2.5l2 2V9.2H18V12.2z"/>
  </svg>
)

export default function ShareBar() {
  const pathname = usePathname()
  const base = process.env.NEXT_PUBLIC_SITE_URL || ''
  const url = useMemo(() => (base ? new URL(pathname || '/', base).toString() : (typeof window !== 'undefined' ? window.location.href : '')), [pathname, base])

  const tweet = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`
  const line = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      alert('リンクをコピーしました')
    } catch {
      // fallback
      const textarea = document.createElement('textarea')
      textarea.value = url
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      alert('リンクをコピーしました')
    }
  }

  return (
    <div className={styles.bar} role="group" aria-label="Share this article">
      <a className={styles.btn} href={tweet} target="_blank" rel="noopener noreferrer" aria-label="Share on X">
        <X /> <span>ポスト</span>
      </a>
      <a className={styles.btn} href={line} target="_blank" rel="noopener noreferrer" aria-label="Share on LINE">
        <Line /> <span>LINE</span>
      </a>
      <button className={styles.btn} onClick={copy} aria-label="Copy link">
        <LinkIcon /> <span>コピー</span>
      </button>
    </div>
  )
}
