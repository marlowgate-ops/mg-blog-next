// lib/seo/jsonld.ts — 追加（既存 lib/jsonld と併存可）
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
