'use client'
import React from 'react'

type Props = {
  href: string
  children: React.ReactNode
  gaLabel?: string
  className?: string
  rel?: string
  target?: string
}

export default function AffLink({ href, children, gaLabel, className, rel, target }: Props) {
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    try {
      const label = gaLabel || (typeof children === 'string' ? children : 'aff_click')
      const params = {
        event: 'affiliate_click',
        link_url: href,
        link_domain: (() => { try { return new URL(href).hostname } catch { return '' } })(),
        ga_label: label,
      } as any

      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        ;(window as any).dataLayer.push(params)
      }
      if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
        ;(window as any).gtag('event', 'affiliate_click', {
          event_category: 'engagement',
          event_label: label,
          link_url: href,
          value: 1,
          debug_mode: typeof window !== 'undefined' && window.location.search.includes('debug=1'),
          transport_type: 'beacon',
        })
      }
    } catch {}
  }

  const finalRel = rel || 'sponsored noopener nofollow'
  return (
    <a href={href} onClick={onClick} className={className} rel={finalRel} target={target}>
      {children}
    </a>
  )
}
