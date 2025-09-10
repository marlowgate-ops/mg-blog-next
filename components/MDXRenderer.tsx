'use client'
import { useMDXComponent } from 'next-contentlayer/hooks'

export default function MDXRenderer({ code }: { code: string }) {
  const Component = useMDXComponent(code)
  return <Component />
}
