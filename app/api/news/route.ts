import { NextRequest, NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';
import newsSources from '@/config/news-sources.json';
import { isUrlAllowed as isUrlAllowedByList } from '@/lib/url-allowlist';

export const runtime = "nodejs";
export const revalidate = 120;

// Simple in-memory cache (would use Redis/KV in production)
const cache = new Map<string, { data: any; timestamp: number; staleTimestamp: number }>();
const CACHE_TTL = 120 * 1000; // 120 seconds
const STALE_WHILE_REVALIDATE = 60 * 1000; // 60 seconds

type Period = 'day' | 'week';

function filterByPeriod(items: NewsItem[], period: Period): NewsItem[] {
  const now = new Date();
  const cutoffTime = new Date(now);
  
  if (period === 'day') {
    cutoffTime.setHours(0, 0, 0, 0); // Start of today
  } else if (period === 'week') {
    cutoffTime.setDate(now.getDate() - 7); // 7 days ago
  }
  
  return items.filter(item => {
    const publishedAt = new Date(item.publishedAt);
    return publishedAt >= cutoffTime;
  });
}

function getCacheKey(providers: string[], period: Period): string {
  const providerKey = providers.length > 0 ? providers.sort().join(',') : 'all';
  return `mg:news:${providerKey}:${period}`;
}

function getCachedData(cacheKey: string): { data: NewsItem[] | null; isStale: boolean } {
  const cached = cache.get(cacheKey);
  if (!cached) {
    return { data: null, isStale: false };
  }
  
  const now = Date.now();
  const isExpired = now > cached.timestamp + CACHE_TTL;
  const isStale = now > cached.staleTimestamp;
  
  if (isExpired) {
    cache.delete(cacheKey);
    return { data: null, isStale: false };
  }
  
  return { data: cached.data, isStale };
}

function setCachedData(cacheKey: string, data: NewsItem[]): void {
  const now = Date.now();
  cache.set(cacheKey, {
    data,
    timestamp: now,
    staleTimestamp: now + STALE_WHILE_REVALIDATE
  });
}

interface NewsItem {
  id: string;
  title: string;
  url: string;
  sourceId: string;
  sourceName: string;
  publishedAt: string;
}

interface NewsSource {
  id: string;
  name: string;
  type: string;
  url: string;
  icon: string;
  hostname: string;
}

// Legacy hostname validation function (kept for reference but not used)
/*
function isUrlAllowed(url: string, allowedHostname: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname === allowedHostname || urlObj.hostname.endsWith(`.${allowedHostname}`);
  } catch {
    return false; // Block invalid URLs
  }
}
*/

async function fetchSourceNews(source: NewsSource): Promise<NewsItem[]> {
  const items: NewsItem[] = [];
  const TIMEOUT = 5000;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);
    
    const response = await fetch(source.url, { 
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NewsAggregator/1.0)',
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn(`Failed to fetch ${source.id}: ${response.status}`);
      return [];
    }
    
    const xmlText = await response.text();
    
    // Parse RSS/XML with fast-xml-parser
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_'
    });
    
    const parsed = parser.parse(xmlText);
    
    // Handle different RSS structures
    const channel = parsed.rss?.channel || parsed.feed;
    const itemsArray = channel?.item || channel?.entry || [];
    const items_normalized = Array.isArray(itemsArray) ? itemsArray : [itemsArray];
    
    for (const item of items_normalized.slice(0, 30)) {
      if (!item) continue;
      
      // Extract data with RSS/Atom compatibility
      const title = item.title?.['#text'] || item.title || '';
      const link = item.link?.['@_href'] || item.link || item.guid || '';
      const pubDate = item.pubDate || item.published || item['dc:date'] || '';
      
      // Validate URL against allowlist - using async call in sync context for initial validation
      const linkAllowed = await isUrlAllowedByList(link).catch(() => false);
      if (!title || !link || !linkAllowed) {
        continue;
      }
      
      // Create canonical URL hash for deduplication
      const urlHash = Buffer.from(link).toString('base64').slice(0, 12);
      
      items.push({
        id: `${source.id}-${urlHash}`,
        title: title.toString().trim(),
        url: link.toString(),
        sourceId: source.id,
        sourceName: source.name,
        publishedAt: pubDate ? new Date(pubDate.toString()).toISOString() : new Date().toISOString()
      });
    }
    
    return items;
  } catch (error) {
    console.error(`Error fetching RSS for ${source.id}:`, error);
    return [];
  }
}

async function fetchAllNews(requestedProviders: string[] = [], period: Period = 'week'): Promise<NewsItem[]> {
  const cacheKey = getCacheKey(requestedProviders, period);
  const cached = getCachedData(cacheKey);
  
  // Return cached data if available and not stale
  if (cached.data && !cached.isStale) {
    return cached.data;
  }
  
  // If stale, return cached data but refresh in background
  if (cached.data && cached.isStale) {
    // Background refresh (don't await)
    refreshNewsData(requestedProviders, period, cacheKey).catch(console.error);
    return cached.data;
  }
  
  // No cached data, fetch fresh
  return await refreshNewsData(requestedProviders, period, cacheKey);
}

async function refreshNewsData(requestedProviders: string[], period: Period, cacheKey: string): Promise<NewsItem[]> {
  const sources = newsSources as NewsSource[];
  
  // Filter sources based on provider request
  const targetSources = requestedProviders.length > 0 
    ? sources.filter(s => requestedProviders.includes(s.id))
    : sources;
  
  // Fetch from all target sources in parallel with individual try/catch
  const results = await Promise.allSettled(
    targetSources.map(source => fetchSourceNews(source))
  );
  
  const allItems: NewsItem[] = [];
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      allItems.push(...result.value);
    } else {
      console.warn(`Failed to fetch from ${targetSources[index].id}:`, result.reason);
    }
  });
  
  // Dedupe by canonical URL
  const seenUrls = new Set<string>();
  const uniqueItems = allItems.filter(item => {
    if (seenUrls.has(item.url)) {
      return false;
    }
    seenUrls.add(item.url);
    return true;
  });
  
  // Sort by publishedAt desc
  uniqueItems.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  
  // Apply period filter
  const filteredItems = filterByPeriod(uniqueItems, period);
  
  // Cache the filtered results
  setCachedData(cacheKey, filteredItems);
  
  return filteredItems;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10)));
    const offset = Math.max(0, parseInt(searchParams.get('offset') || '0', 10));
    const providers = searchParams.get('providers');
    const periodParam = searchParams.get('period');
    
    // Validate period parameter
    const period: Period = (periodParam === 'day' || periodParam === 'week') ? periodParam : 'week';
    
    const requestedProviders = providers 
      ? providers.split(',').map(p => p.trim()).filter(Boolean)
      : [];
    
    // Fetch news items with period filtering
    const allItems = await fetchAllNews(requestedProviders, period);
    
    // Apply pagination
    const paginatedItems = allItems.slice(offset, offset + limit);
    const nextOffset = offset + limit < allItems.length ? offset + limit : null;
    
    return NextResponse.json(
      { 
        items: paginatedItems,
        nextOffset,
        total: allItems.length,
        period
      }, 
      { 
        headers: { 
          'Cache-Control': 's-maxage=120, stale-while-revalidate=60',
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error('Error in news API:', error);
    // Always return valid shape on error
    return NextResponse.json(
      { 
        items: [], 
        nextOffset: null, 
        total: 0,
        period: 'week'
      }, 
      { 
        status: 200, // Don't return error status for graceful degradation
        headers: { 
          'Cache-Control': 's-maxage=120, stale-while-revalidate=60',
          'Content-Type': 'application/json'
        } 
      }
    );
  }
}