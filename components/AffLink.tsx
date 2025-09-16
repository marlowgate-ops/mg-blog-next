'use client'
type Props = {
  href: string
  children: React.ReactNode
  gaLabel?: string   // kept for backward-compat, we also send event_label & aff_label
  className?: string
  rel?: string
  target?: string
}

export default function AffLink({ href, children, gaLabel, className, rel, target }: Props) {
  const onClick = () => {
    try {
      const text = (typeof children === 'string' ? (children as string) : '') || 'aff_click'
      const label = gaLabel || text
      const domain = (() => { try { return new URL(href).hostname } catch { return '' } })()
      if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
        ;(window as any).gtag('event', 'affiliate_click', {
          event_category: 'engagement',
          event_label: label,        // standard field
          aff_label: label,          // safe custom field (avoid reserved 'ga_*')
          link_url: href,
          link_domain: domain,
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
