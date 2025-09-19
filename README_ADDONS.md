# Structured Data Addons

- `components/StructuredData.tsx` : JSON-LD を安全に埋め込むための小コンポーネント。
- `.github/workflows/reviews_ingest.yml` : Pandoc による docx/pdf -> Markdown 変換。見出しは H2/H3 推奨。

## 使い方（JSON-LD）
```tsx
import StructuredData from "@/components/StructuredData"

const faq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {"@type":"Question","name":"初心者はどの口座が良い？","acceptedAnswer":{"@type":"Answer","text":"約定・アプリ・コストのバランスで1〜2社の使い分けが最適です。"}},
    {"@type":"Question","name":"乗換えの目安は？","acceptedAnswer":{"@type":"Answer","text":"約定の安定／アプリ完結性／コスト許容の3軸で再評価しましょう。"}}
  ]
}
export default function Page(){ 
  return (<>
    <StructuredData json={faq} />
    {/* page content */}
  </>)
}
```
