'use client'
import { useEffect } from 'react'

export default function GA4CopyVariant() {
  useEffect(() => {
    const v = process.env.NEXT_PUBLIC_COPY_VARIANT || ''
    if (!v) return
    // dataLayer 存在保証
    ;(window as any).dataLayer = (window as any).dataLayer || []
    const gtag = function(){ (window as any).dataLayer.push(arguments as any) } as any
    // user_properties に載せる（探索で使いやすい）
    gtag('set', 'user_properties', { copy_variant: v })
    // ページビューと同時にイベントパラメータでも送る（保険）
    gtag('event', 'page_view', { copy_variant: v })
  }, [])
  return null
}
