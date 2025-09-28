import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import newsSources from '@/config/news-sources.json';

export const runtime = "nodejs";

// Blocklist for domains we must not request or store
const BLOCKED_DOMAINS = [
  'reuters.com',
  'bloomberg.com',
  'bloomberg.co.jp',
  'wsj.com',
  'ft.com'
];

interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: string;
}

interface NewsSource {
  id: string;
  type: string;
  url: string;
  name: string;
  description: string;
}

// Cache for 300 seconds (5 minutes)
let newsCache: { items: NewsItem[], lastFetch: number } | null = null;
const CACHE_DURATION = 300 * 1000; // 5 minutes in milliseconds

function isUrlBlocked(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return BLOCKED_DOMAINS.some(domain => urlObj.hostname.includes(domain));
  } catch {
    return true; // Block invalid URLs
  }
}

async function fetchAllNews(): Promise<NewsItem[]> {
  const sources = newsSources as NewsSource[];
  const allItems: NewsItem[] = [];
  
  const TIMEOUT = 5000;
  const controller = () => {
    const ac = new AbortController();
    setTimeout(() => ac.abort(), TIMEOUT);
    return ac;
  };

  // Fetch from all sources with timeouts
  const results = await Promise.allSettled(
    sources.map(async (source) => {
      try {
        if (isUrlBlocked(source.url)) {
          console.warn(`Blocked source: ${source.id}`);
          return [];
        }

        const response = await fetch(source.url, { 
          signal: controller().signal 
        });
        
        if (!response.ok) return [];
        
        const text = await response.text();
        const parser = new Parser();
        const feed = await parser.parseString(text);
        
        const items: NewsItem[] = [];
        
        for (const item of feed.items.slice(0, 20)) {
          if (!item.link || !item.title || isUrlBlocked(item.link)) {
            continue;
          }

          const publishedAt = item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString();
          
          items.push({
            id: `${source.id}-${Buffer.from(item.link).toString('base64').slice(0, 8)}`,
            title: item.title.trim(),
            url: item.link,
            source: source.name,
            publishedAt
          });
        }
        
        return items;
      } catch (error) {
        console.error(`Error fetching RSS for ${source.id}:`, error);
        return [];
      }
    })
  );
  
  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      allItems.push(...result.value);
    }
  });
  
  // Dedupe by URL and sort by publishedAt desc
  const seenUrls = new Set();
  const uniqueItems = allItems.filter(item => {
    if (seenUrls.has(item.url)) {
      return false;
    }
    seenUrls.add(item.url);
    return true;
  });
  
  // Sort by published date, newest first
  uniqueItems.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  
  return uniqueItems;
}

export async function GET(request: Request) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10)));
    const offset = Math.max(0, parseInt(searchParams.get('offset') || '0', 10));
    const sourcesParam = searchParams.get('sources');
    const requestedSources = sourcesParam ? sourcesParam.split(',').map(s => s.trim()) : [];
    
    // Check cache
    const now = Date.now();
    let allItems: NewsItem[] = [];
    
    if (newsCache && (now - newsCache.lastFetch) < CACHE_DURATION) {
      allItems = newsCache.items;
    } else {
      // Fetch fresh data
      allItems = await fetchAllNews();
      
      // Update cache
      newsCache = {
        items: allItems,
        lastFetch: now
      };
    }
    
    // Filter by sources if requested
    let filteredItems = allItems;
    if (requestedSources.length > 0) {
      const sources = newsSources as NewsSource[];
      const sourceNames = sources
        .filter(s => requestedSources.includes(s.id))
        .map(s => s.name);
      
      filteredItems = allItems.filter(item => 
        sourceNames.some(name => item.source === name)
      );
    }
    
    // Apply pagination
    const paginatedItems = filteredItems.slice(offset, offset + limit);
    const nextOffset = offset + limit < filteredItems.length ? offset + limit : null;
    
    return Response.json({ 
      items: paginatedItems,
      nextOffset,
      total: filteredItems.length
    }, { 
      headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=60" } 
    });
  } catch (error) {
    console.error('Error in news API:', error);
    // Never return invalid shapes; if parsing yields nothing, respond with { items: [] }
    return Response.json({ 
      items: [], 
      nextOffset: null, 
      total: 0 
    }, { 
      headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=60" } 
    });
  }
}