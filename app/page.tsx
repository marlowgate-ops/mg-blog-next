import Link from 'next/link'
import NewsItemClient from '@/components/NewsItemClient'
import s from './home.module.css'

export const revalidate = 300;
export const dynamic = 'force-dynamic';

interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: string;
}

async function getLatest(limit = 3) {
  try {
    const mod: any = await import('contentlayer/generated')
    const all: any[] = (mod.allPosts || mod.allArticles || mod.allDocs || [])
    const sorted = [...all].sort((a,b) => {
      const da = new Date(a.date || 0).getTime()
      const db = new Date(b.date || 0).getTime()
      return db - da
    })
    return sorted.slice(0, limit)
  } catch {
    return []
  }
}

async function getLatestNews(limit = 10): Promise<NewsItem[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/news`, {
      next: { revalidate: 300 }
    });
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    return (data.items || []).slice(0, limit);
  } catch {
    return [];
  }
}

async function getNews() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/news`, { next: { revalidate: 300 } });
  if (!res.ok) return { items: [] as any[] };
  return res.json() as Promise<{ items: { title:string; url:string; source:string; publishedAt:string }[] }>;
}

const SITE = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Marlow Gate',
  tagline: '最新の公開記事をお届けします。読みやすさと実用性を両立した、ここでしか読めないノウハウを。'
}

export default async function Page() {
  const posts = await getLatest(3)
  const { items } = await getNews()
  
  return (
    <main className={s.container}>
      <section className={s.hero}>
        <h1 className={s.heroTitle}>Latest articles</h1>
        <p className={s.heroLead}>{SITE.tagline}</p>
        <div className={s.heroActions}>
          <Link className={s.btn} href="/blog/page/1">すべての記事を見る</Link>
          <Link className={`${s.btn} ${s.ghost}`} href="/blog">トップへ</Link>
        </div>
      </section>

      {/* Latest Market News Section */}
      {items.length > 0 && (
        <section className={s.newsSection}>
          <div className={s.sectionHeader}>
            <h2 className={s.sectionTitle}>Latest Market News</h2>
            <Link className={s.seeAllLink} href="/news">See all →</Link>
          </div>
          <div className={s.newsList}>
            {items.slice(0, 8).map((item: any) => (
              <NewsItemCard key={item.id || item.title} item={item} />
            ))}
          </div>
        </section>
      )}

      <section className={s.grid}>
        {posts.length === 0 ? (
          <>
            <ArticleCardSkeleton />
            <ArticleCardSkeleton />
            <ArticleCardSkeleton />
          </>
        ) : (
          posts.map((p) => <ArticleCard key={String(p._id || p.slug)} post={p} />)
        )}
      </section>

      <section className={s.promo}>
        <div className={s.promoCard}>
          <div>
            <div className={s.promoTitle}>業務テンプレ｜ICS検証ノート</div>
            <div className={s.promoSub}>実務テンプレ｜ICS|検証ノート</div>
          </div>
          <Link className={`${s.btn} ${s.small}`} href={process.env.NEXT_PUBLIC_CTA_URL || '/gumroad'}>詳細を見る</Link>
        </div>
      </section>
    </main>
  )
}

function ArticleCard({ post }: { post: any }) {
  const slug = String(post.slug || post.slugAsParams || post._raw?.flattenedPath || '')
  const href = '/blog/' + slug
  const date = post.date ? new Date(post.date).toLocaleDateString('ja-JP') : ''
  const tag = (post.tags && post.tags[0]) || post.category || null
  const desc = (post.description || '').slice(0, 110)

  return (
    <Link className={s.card} href={href}>
      <div>
        <div className={s.title}>{post.title || slug}</div>
        <div className={s.desc}>{desc}</div>
      </div>
      <div className={s.meta}>
        {tag ? <span className={s.pill}>{String(tag)}</span> : null}
        {date ? <span>{date}</span> : null}
      </div>
    </Link>
  )
}

function ArticleCardSkeleton() {
  return <div className={s.skeleton} />
}

function NewsItemCard({ item }: { item: NewsItem }) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}分前`;
    } else if (diffInHours < 24) {
      return `${diffInHours}時間前`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}日前`;
    }
  };

  return (
    <NewsItemClient item={item} className={s.newsItem}>
      <div className={s.newsContent}>
        <span className={s.newsSource}>{item.source}</span>
        <span className={s.newsTime}>{formatTime(item.publishedAt)}</span>
      </div>
      <h3 className={s.newsTitle}>{item.title}</h3>
    </NewsItemClient>
  );
}
