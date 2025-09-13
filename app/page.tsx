import Link from 'next/link'

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

const SITE = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Marlow Gate',
  tagline: '最新の公開記事をお届けします。読みやすさと実用性を両立した、ここでしか読めないノウハウを。'
}

export default async function Page() {
  const posts = await getLatest(3)
  return (
    <main className="container">
      <section className="hero">
        <h1>Latest articles</h1>
        <p>{SITE.tagline}</p>
        <div className="heroActions">
          <Link className="btn" href="/blog/page/1">すべての記事を見る</Link>
          <Link className="btn ghost" href="/blog">トップへ</Link>
        </div>
      </section>

      <section className="grid">
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

      <section className="promo">
        <div className="promoCard">
          <div className="promoTitle">業務テンプレ｜ICS検証ノート</div>
          <div className="promoSub">実務テンプレ｜ICS|検証ノート</div>
          <Link className="btn small" href={process.env.NEXT_PUBLIC_CTA_URL || '/gumroad'}>詳細を見る</Link>
        </div>
      </section>

      <style jsx>{`
        .container { padding: 24px 16px 56px; max-width: 1100px; margin: 0 auto; }
        .hero {
          background: linear-gradient(180deg, rgba(2,8,23,0.05), rgba(2,8,23,0.03));
          border: 1px solid rgba(2,8,23,0.06);
          border-radius: 18px;
          padding: 20px 20px 18px;
          margin-bottom: 18px;
          box-shadow: 0 8px 24px rgba(2,8,23,.04) inset;
        }
        .hero h1 { font-size: 28px; margin: 0 0 8px; letter-spacing: .2px; }
        .hero p { margin: 0 0 12px; color: #334155; }
        .heroActions { display: flex; gap: 10px; flex-wrap: wrap; }
        .btn {
          display: inline-flex; align-items: center; gap: .5rem;
          padding: .55rem .9rem; border-radius: 9999px; border: 1px solid rgba(2,8,23,.1);
          background: #0ea5e9; color: #fff; font-weight: 700; font-size: .92rem;
          box-shadow: 0 6px 16px rgba(14,165,233,.25);
        }
        .btn.ghost { background: #fff; color: #0b1324; }
        .btn.small { padding: .45rem .8rem; font-size: .86rem; }
        .grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0,1fr));
          gap: 16px;
          margin: 14px 0 6px;
        }
        @media (max-width: 820px) {
          .grid { grid-template-columns: 1fr; }
        }
        .card {
          display: flex; flex-direction: column; justify-content: space-between;
          background: #fff; border: 1px solid rgba(2,8,23,.08);
          border-radius: 16px; padding: 14px; min-height: 140px;
          box-shadow: 0 10px 24px rgba(2,8,23,.06);
          transition: transform .12s ease, box-shadow .12s ease, border-color .12s ease;
        }
        .card:hover { transform: translateY(-2px); border-color: rgba(14,165,233,.35); box-shadow: 0 12px 28px rgba(14,165,233,.18); }
        .title { font-size: 1.04rem; font-weight: 800; color: #0b1324; margin: 2px 0 8px; line-height: 1.25; }
        .meta { display: flex; gap: 10px; align-items: center; color: #475569; font-size: .86rem; }
        .pill {
          display: inline-flex; align-items: center; gap: .35rem;
          border-radius: 9999px; border: 1px dashed rgba(2,8,23,.18);
          padding: .2rem .6rem; color: #0b1324; background: #f8fafc;
        }
        .desc { color: #475569; font-size: .92rem; }
        .skeleton {
          background: linear-gradient(90deg, #eef2f7, #f5f8fb, #eef2f7);
          background-size: 200% 100%;
          animation: shimmer 1.3s infinite;
          height: 110px; border-radius: 14px; border: 1px solid rgba(2,8,23,.06);
        }
        @keyframes shimmer { 0% { background-position: 0 0; } 100% { background-position: -200% 0; } }
        .promo { margin-top: 18px; }
        .promoCard {
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
          border: 1px solid rgba(2,8,23,.06); border-radius: 16px; padding: 14px;
          background: linear-gradient(180deg, rgba(2,8,23,.02), rgba(2,8,23,.01));
        }
        .promoTitle { font-weight: 800; }
        .promoSub { color: #475569; font-size: .9rem; }
        @media (prefers-color-scheme: dark) {
          .hero { background: linear-gradient(180deg, rgba(148,163,184,.08), rgba(148,163,184,.06)); border-color: rgba(148,163,184,.2); }
          .btn.ghost { background: #0b1324; color: #fff; border-color: rgba(148,163,184,.3); }
          .card { background: #0b1324; border-color: rgba(148,163,184,.2); box-shadow: 0 10px 24px rgba(0,0,0,.35); }
          .pill { background: #0f172a; border-color: rgba(148,163,184,.3); color: #e2e8f0; }
          .desc, .meta, .hero p, .promoSub { color: #cbd5e1; }
          .promoCard { border-color: rgba(148,163,184,.25); background: linear-gradient(180deg, rgba(30,41,59,.6), rgba(30,41,59,.4)); }
        }
      `}</style>
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
    <Link className="card" href={href}>
      <div>
        <div className="title">{post.title || slug}</div>
        <div className="desc">{desc}</div>
      </div>
      <div className="meta">
        {tag ? <span className="pill">{String(tag)}</span> : null}
        {date ? <span>{date}</span> : null}
      </div>
    </Link>
  )
}

function ArticleCardSkeleton() {
  return <div className="skeleton" />
}
