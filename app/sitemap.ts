import { MetadataRoute } from 'next';
import { allPosts, allBrokers, allInsuranceProducts } from 'contentlayer/generated';
import { site } from '@/lib/site';

interface SitemapEntry {
  url: string;
  lastModified?: string | Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = site.url;
  const currentDate = new Date().toISOString();

  // Static pages with priorities
  const staticRoutes: SitemapEntry[] = [
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/best`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/best/forex-brokers-jp`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/insurance`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/insurance/compare/auto`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/insurance/compare/life`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/insurance/compare/medical`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/topics`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/popular`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/bookmarks`,
      lastModified: currentDate,
      changeFrequency: 'never',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: currentDate,
      changeFrequency: 'never',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];

  // Blog posts - highest priority for fresh content
  const blogRoutes: SitemapEntry[] = allPosts
    .filter((post: any) => {
      // Filter out drafts and invalid posts
      const isDraft = !!post.draft;
      const hasSlug = !!post.slug;
      const fileName = post._raw?.sourceFileName || '';
      const isValid = !fileName.startsWith('_') && hasSlug;
      return !isDraft && isValid;
    })
    .map((post: any) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.lastmod || post.date || currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  // Broker reviews
  const brokerRoutes: SitemapEntry[] = allBrokers
    .filter((broker: any) => !!broker.slug && !broker.draft)
    .map((broker: any) => ({
      url: `${baseUrl}/brokers/${broker.slug}`,
      lastModified: broker.lastmod || broker.updatedAt || currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  // Best broker comparison pages
  const bestBrokerRoutes: SitemapEntry[] = allBrokers
    .filter((broker: any) => !!broker.slug && !broker.draft)
    .map((broker: any) => ({
      url: `${baseUrl}/best/forex-brokers/${broker.slug}`,
      lastModified: broker.lastmod || broker.updatedAt || currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

  // Insurance products
  const insuranceRoutes: SitemapEntry[] = allInsuranceProducts
    .filter((product: any) => !!product.slug && !product.draft)
    .map((product: any) => ({
      url: `${baseUrl}/insurance/${product.slug}`,
      lastModified: product.lastmod || product.updatedAt || currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  // Tool pages
  const toolRoutes: SitemapEntry[] = [
    {
      url: `${baseUrl}/tools`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/tools/position-size-calculator`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/tools/pip-value-calculator`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/tools/margin-calculator`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Topic pages
  const topicRoutes: SitemapEntry[] = [
    'fx-basics',
    'risk-management', 
    'insurance-basics',
    'market-analysis',
    'trading-psychology',
    'regulations',
    'tax-guide',
    'beginner-guide'
  ].map(slug => ({
    url: `${baseUrl}/topics/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // News provider pages (if they exist)
  const newsProviderRoutes: SitemapEntry[] = [
    'reuters',
    'bloomberg', 
    'nikkei',
    'jiji',
    'kyodo',
    'marketwatch',
    'cnbc',
    'wsj',
    'ft',
    'asahi'
  ].map(slug => ({
    url: `${baseUrl}/news/provider/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'daily' as const,
    priority: 0.5,
  }));

  // Tag pages (get unique tags from posts)
  const allTags = new Set<string>();
  allPosts.forEach((post: any) => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach((tag: string) => allTags.add(tag));
    }
  });

  const tagRoutes: SitemapEntry[] = Array.from(allTags).map(tag => ({
    url: `${baseUrl}/tags/${encodeURIComponent(tag)}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.4,
  }));

  // Combine all routes
  const allRoutes = [
    ...staticRoutes,
    ...blogRoutes,
    ...brokerRoutes,
    ...bestBrokerRoutes,
    ...insuranceRoutes,
    ...toolRoutes,
    ...topicRoutes,
    ...newsProviderRoutes,
    ...tagRoutes,
  ];

  // Sort by priority (highest first), then by URL
  allRoutes.sort((a, b) => {
    const priorityDiff = (b.priority || 0) - (a.priority || 0);
    if (priorityDiff !== 0) return priorityDiff;
    return a.url.localeCompare(b.url);
  });

  return allRoutes;
}