'use client'
import React from 'react'
import { useMDXComponent } from 'next-contentlayer/hooks'

type Props = {
  code: string
  scope?: Record<string, unknown>
  components?: Record<string, React.ComponentType<any>>
}

/**
 * Safe MDX renderer.
 * - Accepts `scope` to inject variables used inside MDX (e.g., readingTimeMins)
 * - Keeps components override extensible
 */
export default function MDXRenderer({ code, scope, components }: Props) {
  const Mdx = useMDXComponent(code)
  return <Mdx {...(scope || {})} components={components} />
}
