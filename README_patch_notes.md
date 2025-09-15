# mg-blog-next — Patch (Phase A 1–4) — 2025-09-15T00:32:10Z

This patch delivers Phase A (1–4) per the handover plan:
- Top page hero + latest cards (`app/page.tsx`)
- Article TOC + footer CTA (`components/ArticleToc.tsx`, `components/ArticleFooterCta.tsx`)
- JSON-LD utilities and injection (`lib/seo/jsonld.ts`, `app/layout.tsx`, `app/blog/[slug]/page.tsx`)
- GA4 lightweight tag with user_property `copy_variant` (layout)

## Files (complete replacements / additions)
- `app/blog/[slug]/page.tsx` — 2216 bytes — sha256: 6ae5c8b582baa94c5cf25d440e5ccfdfdd77b0ea10fa0dac3087622f4489f85d
- `app/layout.tsx` — 1528 bytes — sha256: 97636ffda6678ab748406f2ff08f00cc226712f37fd91003f74914ab939b1343
- `app/page.tsx` — 2382 bytes — sha256: dc1cc8ae4bdfa2ea6da77a4e0b5f8bdf7d374f73d490c54b949b605e20a67bfa
- `components/ArticleCard.tsx` — 1328 bytes — sha256: 61779cd837aa2168a2f380ec3d32573a4bb8e7651dfd9d3b77910bdd7ddba212
- `components/ArticleFooterCta.tsx` — 780 bytes — sha256: 4a49ef5715ab284430f9ea77030faa1ad2321edae2b0f8e4fe4e2b688010d825
- `components/ArticleToc.tsx` — 1460 bytes — sha256: 5a273123129433876cbff0ac6b7d47d19b2aaf10d976c8a589180cade11f7421
- `lib/copy.ts` — 635 bytes — sha256: 51b507f3555624a7cb629e8bb84bfa4bb7599c39568fa48364848bb24533b79a
- `lib/seo/jsonld.ts` — 1095 bytes — sha256: 5a7cf57db5b0eac72f37f23d80fb6f961deacbdbfb957014610373aa2712b955