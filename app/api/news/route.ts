import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import newsSources from '@/config/news-sources.json';

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

async function fetchRSSFeed(source: NewsSource): Promise<NewsItem[]> {
  try {
    if (isUrlBlocked(source.url)) {
      console.warn(`Blocked source: ${source.id}`);
      return [];
    }

    const parser = new Parser();
    const feed = await parser.parseURL(source.url);
    
    const items: NewsItem[] = [];
    
    for (const item of feed.items.slice(0, 20)) { // Limit per source
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
}

async function fetchAllNews(): Promise<NewsItem[]> {
  const sources = newsSources as NewsSource[];
  const allItems: NewsItem[] = [];
  
  // Fetch from all sources in parallel
  const fetchPromises = sources.map(source => fetchRSSFeed(source));
  const results = await Promise.allSettled(fetchPromises);
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      allItems.push(...result.value);
    } else {
      console.error(`Failed to fetch from ${sources[index].id}:`, result.reason);
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

export async function GET() {
  try {
    // Check cache
    const now = Date.now();
    if (newsCache && (now - newsCache.lastFetch) < CACHE_DURATION) {
      return NextResponse.json({ items: newsCache.items });
    }
    
    // Fetch fresh data
    const items = await fetchAllNews();
    
    // Update cache
    newsCache = {
      items,
      lastFetch: now
    };
    
    return NextResponse.json({ items });
  } catch (error) {
    console.error('Error in news API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}