import { NextRequest, NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';
import newsSources from '@/config/news-sources.json';
import { isUrlAllowed as isUrlAllowedByList } from '@/lib/url-allowlist';

export const runtime = "nodejs";
export const revalidate = 120;

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

async function fetchAllNews(requestedProviders: string[] = []): Promise<NewsItem[]> {
  const sources = newsSources as NewsSource[];
  
  // Filter sources based on provider request
  const targetSources = requestedProviders.length > 0 
    ? sources.filter(s => requestedProviders.includes(s.id))
    : sources;
  
  // Fetch from all target sources in parallel
  const results = await Promise.allSettled(
    targetSources.map(source => fetchSourceNews(source))
  );
  
  const allItems: NewsItem[] = [];
  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      allItems.push(...result.value);
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
  
  return uniqueItems;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10)));
    const offset = Math.max(0, parseInt(searchParams.get('offset') || '0', 10));
    const providers = searchParams.get('providers');
    
    const requestedProviders = providers 
      ? providers.split(',').map(p => p.trim()).filter(Boolean)
      : [];
    
    // Fetch news items
    const allItems = await fetchAllNews(requestedProviders);
    
    // Apply pagination
    const paginatedItems = allItems.slice(offset, offset + limit);
    const nextOffset = offset + limit < allItems.length ? offset + limit : null;
    
    return NextResponse.json(
      { 
        items: paginatedItems,
        nextOffset,
        total: allItems.length
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
        total: 0 
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