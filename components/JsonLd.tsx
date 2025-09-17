import React from "react";
type Props = { data: any };
/** Renders JSON-LD safely for Next.js App Router */
export default function JsonLd({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      // We stringify with safe fallback to avoid "undefined"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data ?? {}) }}
    />
  );
}
