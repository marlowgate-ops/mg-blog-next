export function breadcrumbList(items: { name: string; item: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.name,
      item: b.item,
    })),
  };
}
export function itemListJSONLD(listName: string, items: {name:string, url?: string, ratingValue?: number}[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    itemListElement: items.map((x, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: x.name,
        url: x.url,
        aggregateRating: x.ratingValue ? {
          "@type": "AggregateRating", ratingValue: x.ratingValue, bestRating: 5, worstRating: 0
        } : undefined
      }
    })),
  };
}
export function faqPage(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}


export function organization(opts?: { name?: string; url?: string; logo?: string; sameAs?: string[] }) {
  const name = opts?.name ?? "Marlow Gate";
  const url = opts?.url ?? (process.env.NEXT_PUBLIC_SITE_URL || "https://marlowgate.com");
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo: opts?.logo ?? url + "/og/logo_gate_monogram_dark.png",
    sameAs: opts?.sameAs ?? [],
  };
}

// Enhanced Article schema
export function articleSchema(input: {
  headline: string;
  url: string;
  description?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  image?: string[];
  wordCount?: number;
  readingTime?: string;
  category?: string;
  tags?: string[];
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://marlowgate.com';
  
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": input.headline,
    "description": input.description,
    "url": input.url,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": input.url
    },
    "author": {
      "@type": "Person",
      "name": input.authorName || "Marlow Gate編集部",
      "url": `${baseUrl}/about`
    },
    "publisher": {
      "@type": "Organization",
      "name": "Marlow Gate",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/og/logo_gate_monogram_dark.png`,
        "width": 200,
        "height": 200
      }
    },
    "datePublished": input.datePublished,
    "dateModified": input.dateModified || input.datePublished,
    "image": input.image || [`${baseUrl}/og/default-og.png`],
    "articleSection": input.category || "金融・投資",
    "keywords": input.tags?.join(', '),
    "wordCount": input.wordCount,
    "timeRequired": input.readingTime || "PT5M",
    "inLanguage": "ja-JP",
    "isAccessibleForFree": true,
    "genre": "finance"
  };
}

// WebSite schema for homepage and search functionality
export function websiteSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://marlowgate.com';
  
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Marlow Gate",
    "description": "FX・投資・保険の比較・ランキング情報サイト",
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Marlow Gate",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/og/logo_gate_monogram_dark.png`,
        "width": 200,
        "height": 200
      }
    }
  };
}

// Enhanced ranking schema for broker lists
export function brokerRankingSchema(
  brokers: Array<{ 
    name: string; 
    position: number; 
    score?: number;
    url?: string;
  }>,
  listName: string = "FX業者ランキング"
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": listName,
    "description": "総合評価による国内FX業者ランキング",
    "numberOfItems": brokers.length,
    "itemListElement": brokers.map(broker => ({
      "@type": "ListItem",
      "position": broker.position,
      "name": broker.name,
      "url": broker.url || undefined,
      "item": {
        "@type": "FinancialProduct",
        "name": broker.name,
        "aggregateRating": broker.score ? {
          "@type": "AggregateRating",
          "ratingValue": broker.score,
          "bestRating": 5,
          "worstRating": 1,
          "ratingCount": 1
        } : undefined
      }
    }))
  };
}

// Validation helper
export function validateJSONLD(schema: any): boolean {
  try {
    if (typeof schema !== 'object' || schema === null) return false;
    if (!schema['@type']) return false;
    JSON.stringify(schema); // Test serialization
    return true;
  } catch {
    return false;
  }
}
