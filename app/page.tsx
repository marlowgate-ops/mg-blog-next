// app/page.tsx — 完全置換（ヒーロー＋最新6件カード）
// 目的：トップの第一ビューで価値訴求とCTA、直近記事をカードで提示。
import Link from "next/link";
import type { Metadata } from "next";
import { allPosts } from "contentlayer/generated";
import ArticleCard from "@/components/ArticleCard";

export const metadata: Metadata = {
  title: "Marlow Gate Blog",
  description: "Templates, data, and trading ops — faster, safer, repeatable.",
  alternates: { types: { "application/rss+xml": "/rss.xml" } },
  openGraph: { type: "website", url: "https://blog.marlowgate.com/", title: "Marlow Gate Blog" },
  twitter: { card: "summary_large_image" },
};

function getLatest(n:number) {
  return [...allPosts]
    .filter(p => !p.draft)
    .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, n);
}

export default async function Page() {
  const posts = getLatest(6);
  return (
    <main className="container">
      <section className="hero">
        <h1>Marlow Gate</h1>
        <p className="lead">
          不動産テンプレ × 取引カレンダー × 自動売買ノウハウ。<br/>
          工数を1/10に、事故を未然に。
        </p>
        <div className="cta">
          <Link href="https://store.marlowgate.com" className="btn">ストアを見る</Link>
          <Link href="/rss.xml" className="btn btn-ghost">RSSを購読</Link>
        </div>
      </section>

      <section className="grid">
        {posts.map(p => (
          <ArticleCard
            key={p._id}
            href={`/blog/${p.slug}`}
            title={p.title}
            date={p.date}
            description={p.description ?? ""}
            tags={p.tags ?? []}
          />
        ))}
      </section>

      <style jsx>{`
        .container { max-width: 1100px; margin: 0 auto; padding: 24px; }
        .hero { padding: 40px 0 24px; }
        .lead { font-size: 1.1rem; line-height: 1.8; opacity: .9 }
        .cta { display: flex; gap: 12px; margin-top: 14px; flex-wrap: wrap; }
        .btn { padding: 10px 14px; border-radius: 10px; border:1px solid #333; text-decoration:none }
        .btn-ghost { background: transparent }
        .grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(280px,1fr)); gap: 16px; margin: 20px 0 40px; }
      `}</style>
    </main>
  );
}
