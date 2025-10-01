// app/api/news-enhanced/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { allPosts } from 'contentlayer/generated';
import { globalCache } from '../../../lib/cache/enhanced-cache';

export const runtime = 'edge';
export const revalidate = 120;

interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
  category: string;
  author: string;
  image?: string | null;
  tags: string[];
}

type Period = 'day' | 'week' | 'month';

// Enhanced caching configuration
const CACHE_TTL = 120; // 2 minutes
const STALE_WHILE_REVALIDATE = 60; // 1 minute
const CACHE_TAGS = ['news', 'posts', 'enhanced'];

function getCacheKey(providers: string[], period: Period, limit?: number, search?: string): string {
  const providersKey = providers.sort().join(',') || 'all';
  const limitKey = limit ? `_limit${limit}` : '';
  const searchKey = search ? `_search${encodeURIComponent(search)}` : '';
  return `news-enhanced:${providersKey}:${period}${limitKey}${searchKey}`;
}

function getDateRange(period: Period): { start: Date; end: Date } {
  const now = new Date();
  const end = now;
  let start: Date;

  switch (period) {
    case 'day':
      start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case 'week':
      start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }

  return { start, end };
}

async function fetchNewsData(
  providers: string[], 
  period: Period, 
  limit?: number, 
  search?: string
): Promise<NewsItem[]> {
  const { start, end } = getDateRange(period);
  
  // Filter posts by date range and providers
  let filteredPosts = allPosts.filter(post => {
    const postDate = new Date(post.date);
    const isInRange = postDate >= start && postDate <= end;
    
    if (providers.length === 0) return isInRange;
    
    // For now, all posts are from 'marlowgate' provider
    return isInRange && providers.includes('marlowgate');
  });

  // Apply search filter if provided
  if (search) {
    const searchTerms = search.toLowerCase().split(/\s+/).filter(Boolean);
    filteredPosts = filteredPosts.filter(post => {
      const searchableText = [
        post.title,
        post.description || '',
        ...(post.tags || [])
      ].join(' ').toLowerCase();
      
      return searchTerms.every(term => searchableText.includes(term));
    });
  }

  // Sort by date (newest first)
  filteredPosts.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Apply limit if specified
  if (limit && limit > 0) {
    filteredPosts = filteredPosts.slice(0, limit);
  }

  // Transform to NewsItem format with enhanced data
  const newsItems: NewsItem[] = filteredPosts.map(post => ({
    id: post._id,
    title: post.title,
    description: post.description || '',
    url: `/${post.slug}`,
    publishedAt: post.date,
    source: 'marlowgate',
    category: 'news',
    author: 'Editorial Team',
    image: null,
    tags: post.tags || [],
  }));

  return newsItems;
}

export async function GET(request: NextRequest) {
  const startTime = performance.now();
  
  try {
    const { searchParams } = new URL(request.url);
    const providersParam = searchParams.get('providers');
    const period = (searchParams.get('period') || 'week') as Period;
    const limitParam = searchParams.get('limit');
    const search = searchParams.get('search') || undefined;
    const offset = Math.max(0, parseInt(searchParams.get('offset') || '0', 10));
    
    const providers = providersParam ? providersParam.split(',') : [];
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;
    
    // Validate period
    if (!['day', 'week', 'month'].includes(period)) {
      return NextResponse.json(
        { error: 'Invalid period. Must be day, week, or month.' },
        { status: 400 }
      );
    }

    const cacheKey = getCacheKey(providers, period, limit, search);
    
    // Try enhanced cache first
    const cached = globalCache.get<NewsItem[]>(cacheKey);
    if (cached.data !== null) {
      const responseTime = performance.now() - startTime;
      
      // Background refresh for stale data
      if (cached.isStale) {
        setTimeout(async () => {
          try {
            const freshData = await fetchNewsData(providers, period, limit, search);
            globalCache.set(cacheKey, freshData, { 
              ttl: CACHE_TTL,
              staleWhileRevalidate: STALE_WHILE_REVALIDATE,
              tags: CACHE_TAGS
            });
          } catch (error) {
            console.warn('Background refresh failed:', error);
          }
        }, 0);
      }

      // Apply offset to cached data
      const paginatedData = cached.data.slice(offset);
      const nextOffset = offset + (paginatedData.length > 0 ? paginatedData.length : 0) < cached.data.length 
        ? offset + paginatedData.length 
        : null;

      return NextResponse.json({
        items: paginatedData,
        total: cached.data.length,
        period,
        providers: providers.length > 0 ? providers : ['all'],
        limit,
        offset,
        nextOffset,
        search,
        cached: true,
        stale: cached.isStale,
        responseTime: Math.round(responseTime),
        cacheStats: {
          hitRatio: globalCache.getHitRatio(),
          cacheSize: globalCache.getSize()
        }
      }, {
        headers: {
          'Cache-Control': cached.isStale 
            ? 'public, max-age=30, stale-while-revalidate=90'
            : 'public, max-age=120, stale-while-revalidate=300',
          'X-Cache': cached.isStale ? 'HIT-STALE' : 'HIT',
          'X-Response-Time': `${Math.round(responseTime)}ms`,
          'X-Cache-Key': cacheKey
        }
      });
    }

    // Cache miss - fetch fresh data
    const newsItems = await fetchNewsData(providers, period, limit, search);
    
    // Cache the results
    globalCache.set(cacheKey, newsItems, { 
      ttl: CACHE_TTL,
      staleWhileRevalidate: STALE_WHILE_REVALIDATE,
      tags: CACHE_TAGS
    });
    
    // Apply pagination
    const paginatedData = newsItems.slice(offset);
    const nextOffset = offset + paginatedData.length < newsItems.length 
      ? offset + paginatedData.length 
      : null;
    
    const responseTime = performance.now() - startTime;

    return NextResponse.json({
      items: paginatedData,
      total: newsItems.length,
      period,
      providers: providers.length > 0 ? providers : ['all'],
      limit,
      offset,
      nextOffset,
      search,
      cached: false,
      stale: false,
      responseTime: Math.round(responseTime),
      cacheStats: {
        hitRatio: globalCache.getHitRatio(),
        cacheSize: globalCache.getSize()
      }
    }, {
      headers: {
        'Cache-Control': 'public, max-age=120, stale-while-revalidate=300',
        'X-Cache': 'MISS',
        'X-Response-Time': `${Math.round(responseTime)}ms`,
        'X-Cache-Key': cacheKey
      }
    });

  } catch (error) {
    console.error('Enhanced news API error:', error);
    const responseTime = performance.now() - startTime;
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch news', 
        responseTime: Math.round(responseTime),
        cacheStats: {
          hitRatio: globalCache.getHitRatio(),
          cacheSize: globalCache.getSize()
        }
      },
      { 
        status: 500,
        headers: {
          'X-Response-Time': `${Math.round(responseTime)}ms`
        }
      }
    );
  }
}