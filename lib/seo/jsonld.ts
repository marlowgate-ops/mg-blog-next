// lib/seo/jsonld.ts — 新規追加（JSON-LD生成ユーティリティ）
export function breadcrumbList(items: { name: string; item: string }[]) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((it, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": it.name,
      "item": it.item
    }))
  });
}

export function blogPosting(params: {
  url: string;
  title: string;
  description?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  image?: string;
}) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": params.url,
    "headline": params.title,
    "description": params.description || "",
    "datePublished": params.datePublished || undefined,
    "dateModified": params.dateModified || params.datePublished || undefined,
    "author": params.authorName ? { "@type": "Person", "name": params.authorName } : undefined,
    "image": params.image ? [params.image] : undefined
  });
}
