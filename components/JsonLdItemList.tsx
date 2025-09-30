'use client';

import { useMemo } from 'react';
import JsonLd from './JsonLd';

interface NewsItem {
  id: string;
  title: string;
  url: string;
  sourceId: string;
  sourceName: string;
  publishedAt: string;
}

interface JsonLdItemListProps {
  items: NewsItem[];
}

export default function JsonLdItemList({ items }: JsonLdItemListProps) {
  const jsonLdData = useMemo(() => {
    if (items.length === 0) return null;

    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "numberOfItems": items.length,
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": item.url,
        "name": item.title,
        "datePublished": item.publishedAt,
        "publisher": {
          "@type": "Organization",
          "name": item.sourceName
        }
      }))
    };
  }, [items]);

  if (!jsonLdData) return null;

  return <JsonLd data={jsonLdData} />;
}