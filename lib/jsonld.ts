export function blogPostingLD(input: {
  headline: string
  url: string
  description?: string
  datePublished?: string
  dateModified?: string
  authorName?: string
  image?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.headline,
    description: input.description ?? undefined,
    datePublished: input.datePublished ?? undefined,
    dateModified: input.dateModified ?? undefined,
    url: input.url,
    mainEntityOfPage: { "@type": "WebPage", "@id": input.url },
    author: input.authorName ? { "@type": "Person", name: input.authorName } : undefined,
    image: input.image ? [input.image] : undefined
  }
}

export function breadcrumbLD(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url
    }))
  }
}
