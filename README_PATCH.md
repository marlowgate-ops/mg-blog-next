# Batch Patch — unify date handling & stabilize feeds/routes

## 追加/置換ファイル
- `lib/post.ts` … 共有ユーティリティ（`pickDate`, `toTime`, `sortedPosts`, `uniqueTags`）
- `app/blog/[slug]/page.tsx` … 詳細ページ（JSON-LD / OG / date 安定化）
- `app/blog/page.tsx` … 一覧1ページ目（PAGE_SIZE=10）
- `app/blog/page/[page]/page.tsx` … ページング
- `app/tags/[tag]/page.tsx` … タグ一覧（`pubDate` 直参照を撤廃）
- `app/rss.xml/route.ts` … RSS（最大50件、XMLエスケープ）
- `app/sitemap.xml/route.ts` … サイトマップ
- `app/robots.txt/route.ts` … RSS 追記済み

## 適用
1. 上記をそのまま上書き（新規含む）→ commit → push
2. Vercel: 失敗したデプロイから **Redeploy**、Build Cache を **OFF** にして実行

## ねらい
- frontmatter の `date / pubDate / publishedAt / published` を**一元吸収**
- 各画面の直参照を廃してユーティリティに集約 → **横断修正が1ファイルで済む**
- RSS/Sitemap/robots の生成も共通日付で安定化
