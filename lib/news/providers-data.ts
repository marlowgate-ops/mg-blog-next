import { NewsProvider } from '@/lib/news/types';
import { providers } from '@/lib/news/providers';

export interface ProviderPageParams {
  slug: string;
}

export async function generateStaticParams(): Promise<ProviderPageParams[]> {
  return providers.map((provider) => ({
    slug: provider.id
  }));
}

export function getProviderBySlug(slug: string): NewsProvider | null {
  return providers.find(p => p.id === slug) || null;
}

export function getProvidersByCategory(category?: string): NewsProvider[] {
  if (!category) return providers;
  return providers.filter(p => p.categories.includes(category));
}

export function getProvidersByCountry(country?: string): NewsProvider[] {
  if (!country) return providers;
  return providers.filter(p => p.country === country);
}

export function getProviderCategories(): string[] {
  const categories = new Set<string>();
  providers.forEach(p => p.categories.forEach(c => categories.add(c)));
  return Array.from(categories).sort();
}

export function getProviderCountries(): string[] {
  const countries = new Set<string>();
  providers.forEach(p => countries.add(p.country));
  return Array.from(countries).sort();
}

// Mock news data for provider archives
export interface ProviderNews {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  publishedAt: string;
  category: string;
  readTime?: number;
  imageUrl?: string;
}

export async function getProviderNews(
  providerId: string, 
  page: number = 1, 
  limit: number = 20,
  category?: string,
  dateRange?: { start: string; end: string }
): Promise<{ news: ProviderNews[]; total: number; hasMore: boolean }> {
  
  // Mock data - in production this would fetch from actual news API or database
  const mockNews: ProviderNews[] = Array.from({ length: 50 }, (_, i) => {
    const baseId = page * limit + i;
    const categories = ['market', 'economy', 'policy', 'crypto', 'forex', 'stocks'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    return {
      id: `${providerId}-${baseId}`,
      title: `${getProviderBySlug(providerId)?.name || 'News'} 記事 ${baseId + 1}: 金融市場の最新動向について`,
      excerpt: 'この記事では、最新の金融市場動向と経済指標について詳しく解説します。投資家にとって重要な情報をお届けします。',
      url: `https://${providerId}.com/article-${baseId + 1}`,
      publishedAt: new Date(Date.now() - (baseId * 2 * 60 * 60 * 1000)).toISOString(),
      category: category || randomCategory,
      readTime: 3 + Math.floor(Math.random() * 7),
      imageUrl: Math.random() > 0.7 ? `https://picsum.photos/300/200?random=${baseId}` : undefined
    };
  });
  
  // Filter by category if specified
  let filteredNews = category ? 
    mockNews.filter(n => n.category === category) : 
    mockNews;
  
  // Filter by date range if specified
  if (dateRange) {
    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);
    filteredNews = filteredNews.filter(n => {
      const publishedDate = new Date(n.publishedAt);
      return publishedDate >= start && publishedDate <= end;
    });
  }
  
  // Paginate
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedNews = filteredNews.slice(startIndex, endIndex);
  
  return {
    news: paginatedNews,
    total: filteredNews.length,
    hasMore: endIndex < filteredNews.length
  };
}