import React from 'react'
import Image from 'next/image'
import CodeBlock from '@/components/CodeBlock'

const A = (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a className="underline" {...props} />
)

const H2 = (props: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className="scroll-mt-24 text-2xl font-semibold mt-10 mb-3" {...props} />
)

const PRE = (props: React.HTMLAttributes<HTMLPreElement>) => (
  <pre className="rounded-xl p-4 overflow-auto" {...props} />
)

const CODE = (props: React.HTMLAttributes<HTMLElement>) => (
  <code className="px-1 py-0.5 rounded" {...props} />
)

const IMG = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <Image
    src={props.src || ""}
    alt={props.alt || ""}
    width={typeof props.width === 'string' ? parseInt(props.width) : props.width || 800}
    height={typeof props.height === 'string' ? parseInt(props.height) : props.height || 400}
    loading="lazy"
    {...(props.alt === "" && { "aria-hidden": true })}
  />
)

export const components = {
  h2: H2,
  pre: PRE,
  code: CODE,
  a: A,
  img: IMG,
  // fenced code blocks route to CodeBlock
  CodeBlock
}
