# Marlow Gate Blog (Next.js + Contentlayer + Vercel)

## What you get
- App Router (Next.js 14)
- MDX via Contentlayer (`/content/blog/*.mdx`)
- Blog: `/blog/[slug]`, index, pagination `/blog/page/[n]`
- Tags: `/tags/[tag]`
- Feeds: `/rss.xml`, `/sitemap.xml`, `/robots.txt`
- Dynamic OG: `/og/[slug]` (no external fonts)
- GA4: `NEXT_PUBLIC_GA4_ID` (Vercel env)
- Minimal, production-ready components (PostCard, Pagination, CTA)

## Quick start
1. **Create a new GitHub repo** (e.g., `mg-blog-next`) and push these files.
2. **Vercel** → Import the repo → Framework auto-detects Next.js.
3. **Set environment variable** on Vercel:
   - `NEXT_PUBLIC_GA4_ID` = `G-XXXXXXXXXX`
4. **Custom domain**:
   - Add `blog.marlowgate.com` to your Vercel project (Domains)
   - In Cloudflare DNS, set **CNAME** for `blog` → `cname.vercel-dns.com` (Proxy *OFF*, TTL 120s)
5. **Migrate MDX**: Move existing posts into `content/blog/`, keep frontmatter keys.
6. Done: `/blog/hello-world` should load. Check `/rss.xml`, `/sitemap.xml`, `/og/hello-world`.

## Notes
- Keep your current Cloudflare Pages site *temporarily* until DNS cutover is verified.
- Rollback = point `blog` CNAME back to Cloudflare Pages.
- Later, you can unify LP and Blog inside this Next.js app.

---

# マーロウゲート・ブログ（Next.js + Contentlayer + Vercel）

## 含まれるもの
- Next.js App Router（v14）
- Contentlayer による MDX 読み込み（`/content/blog/*.mdx`）
- ブログ: `/blog/[slug]`、一覧、ページネーション `/blog/page/[n]`
- タグ: `/tags/[tag]`
- フィード: `/rss.xml`、サイトマップ `/sitemap.xml`、`/robots.txt`
- 動的 OG: `/og/[slug]`（外部フォント不使用）
- GA4: `NEXT_PUBLIC_GA4_ID`（Vercel の環境変数で設定）
- ミニマルで本番品質のコンポーネント（PostCard、Pagination、CTA）

## はじめかた
1. **GitHub に新規リポジトリ**（例: `mg-blog-next`）を作成し、本プロジェクトを Push。
2. **Vercel** でリポジトリをインポート → Next.js として自動検出。
3. **環境変数（Vercel）**：
   - `NEXT_PUBLIC_GA4_ID` に `G-XXXXXXXXXX` を設定。
4. **独自ドメイン**：
   - Vercel の「Domains」に `blog.marlowgate.com` を追加
   - Cloudflare の DNS で **CNAME** `blog` → `cname.vercel-dns.com` を設定（**Proxy は OFF**、TTL 120 秒）
5. **MDX 移行**：既存の MDX を `content/blog/` にコピー（frontmatter はそのままでOK）。
6. 動作確認： `/blog/hello-world`、`/rss.xml`、`/sitemap.xml`、`/og/hello-world`。

## メモ
- DNS 切替が安定するまで、現行の Cloudflare Pages を **一時的に残す**のがおすすめです。
- ロールバックは、Cloudflare の CNAME を従来の Pages に戻すだけです。
- 将来的には LP も含めて Next.js に統合可能です。
