import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProviderBySlug, getProviderNews, type ProviderPageParams } from '@/lib/news/providers-data';
import { providers } from '@/lib/news/providers';
import Container from '@/components/Container';
import Breadcrumbs from '@/components/Breadcrumbs';
import VoteWidget from '@/components/VoteWidget';
import s from './provider.module.css';

interface ProviderPageProps {
  params: ProviderPageParams;
  searchParams: { 
    page?: string; 
    category?: string;
    start?: string;
    end?: string;
  };
}

export async function generateStaticParams(): Promise<ProviderPageParams[]> {
  return providers.map((provider) => ({
    slug: provider.id
  }));
}

export async function generateMetadata({ params }: ProviderPageProps): Promise<Metadata> {
  const provider = getProviderBySlug(params.slug);
  
  if (!provider) {
    return {
      title: 'Provider Not Found',
      description: 'The requested news provider was not found.'
    };
  }

  return {
    title: `${provider.name}のニュース記事一覧 | mg-blog-next`,
    description: `${provider.description}による最新の金融・経済ニュース記事をご覧ください。`,
    openGraph: {
      title: `${provider.name}のニュース記事一覧`,
      description: `${provider.description}による最新の金融・経済ニュース記事をご覧ください。`,
      type: 'website'
    }
  };
}

export default async function ProviderPage({ params, searchParams }: ProviderPageProps) {
  const provider = getProviderBySlug(params.slug);
  
  if (!provider) {
    notFound();
  }

  const page = parseInt(searchParams.page || '1', 10);
  const category = searchParams.category;
  const dateRange = searchParams.start && searchParams.end ? {
    start: searchParams.start,
    end: searchParams.end
  } : undefined;

  const { news, total, hasMore } = await getProviderNews(
    provider.id,
    page,
    20,
    category,
    dateRange
  );

  const breadcrumbItems = [
    { name: 'ホーム', href: '/' },
    { name: 'ニュース', href: '/news' },
    { name: 'プロバイダー', href: '/news/providers' },
    { name: provider.name, href: `/news/provider/${provider.id}` }
  ];

  return (
    <Container>
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className={s.providerHeader}>
        <div className={s.providerInfo}>
          <div className={s.providerIcon}>
            {provider.icon && (
              <Image src={provider.icon} alt={`${provider.name} icon`} width={48} height={48} />
            )}
          </div>
          <div className={s.providerDetails}>
            <h1 className={s.providerName}>{provider.name}</h1>
            <p className={s.providerDescription}>{provider.description}</p>
            <div className={s.providerMeta}>
              <span className={s.metaItem}>
                <strong>カテゴリ:</strong> {provider.category}
              </span>
              <span className={s.metaItem}>
                <strong>国:</strong> {provider.country}
              </span>
              <span className={s.metaItem}>
                <strong>設立:</strong> {provider.establishedYear || provider.established}年
              </span>
              <span className={s.metaItem}>
                <strong>更新頻度:</strong> {provider.updateFrequency}
              </span>
              <span className={s.metaItem}>
                <strong>信頼度:</strong> {provider.credibilityScore || '3'}/5
              </span>
            </div>
          </div>
        </div>
        
        <div className={s.providerActions}>
          <a 
            href={provider.website}
            target="_blank"
            rel="noopener noreferrer"
            className={s.visitButton}
          >
            公式サイト
          </a>
        </div>
      </div>

      <div className={s.contentLayout}>
        <main className={s.newsContent}>
          <div className={s.newsHeader}>
            <h2 className={s.newsTitle}>
              記事一覧 ({total}件)
            </h2>
            
            {/* Filter Chips */}
            <div className={s.filterChips}>
              <a 
                href={`/news/provider/${provider.id}`}
                className={`${s.filterChip} ${!category ? s.active : ''}`}
              >
                すべて
              </a>
              {(provider.categories || [provider.category]).map(cat => (
                <a
                  key={cat}
                  href={`/news/provider/${provider.id}?category=${cat}`}
                  className={`${s.filterChip} ${category === cat ? s.active : ''}`}
                >
                  {cat}
                </a>
              ))}
            </div>
          </div>

          <div className={s.newsList}>
            {news.map(article => (
              <article key={article.id} className={s.newsItem}>
                <div className={s.newsContent}>
                  <h3 className={s.newsTitle}>
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                      {article.title}
                    </a>
                  </h3>
                  <p className={s.newsExcerpt}>{article.excerpt}</p>
                  
                  <div className={s.newsMeta}>
                    <span className={s.category}>{article.category}</span>
                    <time className={s.publishedAt}>
                      {new Date(article.publishedAt).toLocaleDateString('ja-JP')}
                    </time>
                    {article.readTime && (
                      <span className={s.readTime}>{article.readTime}分</span>
                    )}
                  </div>
                </div>
                
                {article.imageUrl && (
                  <div className={s.newsImage}>
                    <Image src={article.imageUrl} alt="" width={120} height={80} loading="lazy" />
                  </div>
                )}
                
                <div className={s.newsActions}>
                  <VoteWidget newsId={article.id} compact />
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          {(page > 1 || hasMore) && (
            <div className={s.pagination}>
              {page > 1 && (
                <a 
                  href={`/news/provider/${provider.id}?page=${page - 1}${category ? `&category=${category}` : ''}`}
                  className={s.paginationButton}
                >
                  前のページ
                </a>
              )}
              
              <span className={s.pageInfo}>
                ページ {page}
              </span>
              
              {hasMore && (
                <a 
                  href={`/news/provider/${provider.id}?page=${page + 1}${category ? `&category=${category}` : ''}`}
                  className={s.paginationButton}
                >
                  次のページ
                </a>
              )}
            </div>
          )}
        </main>

        <aside className={s.sidebar}>
          <div className={s.sidebarSection}>
            <h3 className={s.sidebarTitle}>関連プロバイダー</h3>
            <div className={s.relatedProviders}>
              {providers
                .filter(p => p.id !== provider.id && p.category === provider.category)
                .slice(0, 4)
                .map(p => (
                  <a
                    key={p.id}
                    href={`/news/provider/${p.id}`}
                    className={s.relatedProvider}
                  >
                    {p.icon && (
                      <Image src={p.icon} alt={`${p.name} icon`} width={24} height={24} />
                    )}
                    <span>{p.name}</span>
                  </a>
                ))}
            </div>
          </div>
          
          <div className={s.sidebarSection}>
            <h3 className={s.sidebarTitle}>カテゴリー別</h3>
            <div className={s.categoryList}>
              {(provider.categories || [provider.category]).map(cat => (
                <a
                  key={cat}
                  href={`/news/provider/${provider.id}?category=${cat}`}
                  className={s.categoryLink}
                >
                  {cat}
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </Container>
  );
}