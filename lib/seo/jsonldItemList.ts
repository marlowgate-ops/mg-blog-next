export function itemListJsonLd(items: {name: string, url: string, position: number, brand?: string}[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((it) => ({
      '@type': 'ListItem',
      position: it.position,
      name: it.name,
      url: it.url,
      ...(it.brand ? { brand: it.brand } : {}),
    })),
  }
}
