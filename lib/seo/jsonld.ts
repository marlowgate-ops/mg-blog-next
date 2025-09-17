export type BrokerItem = {
  name: string;
  url?: string;
  ratingValue?: number;
  bestRating?: number;
  worstRating?: number;
  position: number;
};

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

export function itemListJSONLD(listName: string, items: BrokerItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    itemListElement: items.map((x) => ({
      "@type": "ListItem",
      position: x.position,
      item: {
        "@type": "Product",
        name: x.name,
        url: x.url,
        aggregateRating: x.ratingValue
          ? {
              "@type": "AggregateRating",
              ratingValue: x.ratingValue,
              bestRating: x.bestRating ?? 5,
              worstRating: x.worstRating ?? 0,
            }
          : undefined,
      },
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

export function organization(siteName: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url,
    logo: url.replace(/\/$/, "") + "/favicon.ico",
  };
}
