import Link from 'next/link'
import { allPosts } from 'contentlayer/generated'
import { lookupTag } from '@/lib/tag-meta'
import JsonLd from '@/components/JsonLd'
import JsonLdBreadcrumbs from '@/components/JsonLdBreadcrumbs'
import Breadcrumbs from '@/components/Breadcrumbs'
import { itemListJSONLD } from '@/lib/seo/jsonld'

export const dynamic = 'force-static'
const PAGE_SIZE = 20

export function generateStaticParams() {
  const set = new Set<string>()
  allPosts.forEach(p => p.tags?.forEach(t => set.add(t)))
  return Array.from(set).map(t => ({ tag: t }))
}

export function generateMetadata({ params }: { params: { tag: string } }) {
  const { key, meta } = lookupTag(params.tag)
  const title = meta ? `${meta.title}の記事一覧` : `「${key}」の記事一覧`
  const description = meta?.description || `「${key}」に関する記事一覧です。関連するガイド、ニュース、レビューを掲載しています。`
  
  return { 
    title, 
    description,
    openGraph: {
      title,
      description,
      type: 'website'
    },
    twitter: {
      title,
      description
    }
  }
}

export default function TagPage({ params }: { params: { tag: string } }) {
  const { key, meta } = lookupTag(params.tag)

  const posts = allPosts
    .filter(p => !p.draft && (p.tags||[]).includes(key))
    .sort((a,b) => +new Date(b.date) - +new Date(a.date))

  const pagePosts = posts.slice(0, PAGE_SIZE)
  const hasMore = posts.length > PAGE_SIZE
  const tags = Array.from(new Set(allPosts.flatMap(p => p.tags || []))).sort()

  // Breadcrumbs
  const breadcrumbs = [
    { name: 'ホーム', href: '/' },
    { name: 'タグ一覧', href: '/tags' },
    { name: meta?.title || key }
  ]

  // JSON-LD for ItemList
  const jsonLdData = itemListJSONLD(
    `${meta?.title || key}の記事一覧`,
    posts.map((post) => ({
      name: post.title,
      url: `https://marlowgate.com${post.url}`,
      ratingValue: undefined
    }))
  )

  return (
    <>
      <JsonLd data={jsonLdData} />
      <JsonLdBreadcrumbs />
      
      <section className="mx-auto max-w-4xl px-4 py-8">
        <Breadcrumbs items={breadcrumbs} />
        
        <header className="mb-8 mt-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {meta?.title || key}
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            {meta?.description || `「${key}」に関する記事一覧です。関連するガイド、ニュース、レビューを掲載しています。`}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              📄 {posts.length}件の記事
            </span>
          </div>
        </header>

        {/* Related Tags */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">関連タグ</h2>
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 15).map(t => {
              const isCurrentTag = t === key
              return (
                <Link 
                  key={t} 
                  href={`/tags/${encodeURIComponent(t)}`} 
                  className={`rounded-full border px-3 py-1 text-sm transition-colors hover:bg-gray-50 ${
                    isCurrentTag 
                      ? 'bg-blue-100 border-blue-300 text-blue-800 font-medium' 
                      : 'border-gray-200 text-gray-700'
                  }`}
                >
                  {t}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6">記事一覧</h2>
          {posts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-4">
                このタグに関連する記事はまだありません。
              </p>
              <Link 
                href="/blog" 
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                すべての記事を見る →
              </Link>
            </div>
          ) : (
            <ul className="grid gap-6 min-h-[400px]">
              {pagePosts.map(p => (
                <li key={p._id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <article>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">
                          <Link 
                            href={p.url} 
                            className="text-gray-900 hover:text-blue-600 transition-colors"
                          >
                            {p.title}
                          </Link>
                        </h3>
                        <p className="text-gray-600 line-clamp-2 mb-3">
                          {p.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <time dateTime={p.date}>
                        {new Date(p.date).toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                      
                      <div className="flex items-center gap-2">
                        {(p.tags || []).slice(0, 3).map(tag => (
                          <Link
                            key={tag}
                            href={`/tags/${encodeURIComponent(tag)}`}
                            className="px-2 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200 transition-colors"
                          >
                            {tag}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Internal CTA */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              もっと詳しく知りたい方へ
            </h3>
            <p className="text-gray-600 mb-4">
              {meta?.title || key}に関する最新の情報とガイドをお届けします。
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link 
                href="/best/forex-brokers-jp"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                おすすめランキングを見る
              </Link>
              <Link 
                href="/guides"
                className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                ガイド一覧を見る
              </Link>
            </div>
          </div>
        </div>

        {/* Pagination */}
        {hasMore && (
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              さらに{posts.length - PAGE_SIZE}件の記事があります
            </p>
            <Link 
              href={`/tags/${encodeURIComponent(key)}?page=2`}
              className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              もっと見る →
            </Link>
          </div>
        )}
      </section>
    </>
  )
}
