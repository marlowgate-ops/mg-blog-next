'use client'
import React from 'react'

type AffLinkProps = {
  href: string
  brand: string
  placement?: 'top'|'middle'|'bottom'|'sidebar'|'inline'
  variant?: string
  className?: string
  children: React.ReactNode
}

/**
 * AffLink — affiliate-safe anchor with GA4 event and rel attributes.
 * - Sends `affiliate_click` with {brand, page_type, placement, variant}.
 * - Adds rel="sponsored noopener nofollow" and target="_blank".
 * - If href is empty, disables the button-like anchor.
 */
export default function AffLink({ href, brand, placement='inline', variant='A', className='', children }: AffLinkProps) {
  const onClick = () => {
    try {
      // GA4 gtag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any
      if (w?.gtag) {
        w.gtag('event', 'affiliate_click', {
          brand, placement, variant, page_type: 'best',
        })
      }
    } catch { /* noop */ }
  }
  const safeHref = href?.trim()?.length ? href : undefined
  const common = {
    rel: 'sponsored noopener nofollow',
    target: '_blank',
    onClick,
    className: className + (safeHref ? '' : ' opacity-60 pointer-events-none'),
  } as React.AnchorHTMLAttributes<HTMLAnchorElement>
  if (!safeHref) {
    return <span aria-disabled="true" {...common as any}>{children}</span>
  }
  return <a href={safeHref} {...common}>{children}</a>
}
