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
