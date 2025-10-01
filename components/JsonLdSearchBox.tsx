interface SearchBoxJsonLdProps {
  domain: string;
  searchUrl: string;
}

export default function SearchBoxJsonLd({ 
  domain,
  searchUrl 
}: SearchBoxJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": domain,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${domain}${searchUrl}?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}