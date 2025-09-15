// app/blog/[slug]/page.tsx — 完全置換（構造化データ＋目次＋末尾CTA）
import type { Metadata } from "next";
import { allPosts } from "contentlayer/generated";
import ArticleToc from "@/components/ArticleToc";
import ArticleFooterCta from "@/components/ArticleFooterCta";
import { blogPosting } from "@/lib/seo/jsonld";

export async function generateStaticParams() {
  return allPosts.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = allPosts.find(p => p.slug === params.slug);
  if (!post) return { title: "Not found" };
  return {
    title: post.title,
    description: post.description,
    openGraph: { title: post.title, description: post.description ?? undefined },
  };
}

export default function Page({ params }: { params: { slug: string } }) {
  const post = allPosts.find(p => p.slug === params.slug);
  if (!post) return <div>Not found</div>;
  const json = blogPosting({
    url: `https://blog.marlowgate.com/blog/${post.slug}`,
    title: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    image: (post as any).ogImage,
    authorName: (post as any).author ?? "Marlow Gate",
  });
  return (
    <main className="container">
      <article>
        <h1>{post.title}</h1>
        <p className="meta"><time suppressHydrationWarning dateTime={post.date}>{post.date}</time></p>
        {/* MDX本文 */}
        <post.body.component />
      </article>

      <aside><ArticleToc /></aside>
      <ArticleFooterCta />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
      <style jsx>{`
        .container { max-width: 820px; margin: 0 auto; padding: 24px; }
        article { line-height: 1.85; }
        .meta { color:#666; margin: 8px 0 18px; }
        article :global(img) { max-width: 100%; height: auto; border-radius: 8px; }
        article :global(pre) { overflow:auto; padding:12px; border-radius:8px; background:#0f172a; color:#e5e7eb }
        article :global(code) { font-family: ui-monospace, Menlo, Consolas, monospace; }
      `}</style>
    </main>
  );
}
