'use client'
import React from 'react'

type SDProps = { json: any }
export default function StructuredData({ json }: SDProps) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(json)}} />
}
