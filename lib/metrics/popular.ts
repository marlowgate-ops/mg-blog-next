/**
 * Popularity tracking system based on first-party analytics
 * Uses KV store for weekly and monthly counters
 */

import { kv } from '@vercel/kv';

export interface PopularItem {
  slug: string;
  type: 'article' | 'news' | 'broker' | 'insurance';
  title: string;
  url: string;
  views: number;
  rank: number;
}

export type PopularRange = 'week' | 'month';
export type PopularKind = 'all' | 'article' | 'news' | 'broker' | 'insurance';

/**
 * Track a page view for popularity rankings
 */
export async function trackView(
  slug: string, 
  type: PopularItem['type'],
  title?: string,
  url?: string
): Promise<void> {
  if (!process.env.KV_REST_API_URL) {
    console.warn('KV not configured, skipping view tracking');
    return;
  }

  try {
    const now = new Date();
    const weekKey = `popular:week:${getWeekKey(now)}`;
    const monthKey = `popular:month:${getMonthKey(now)}`;
    
    // Increment counters for both week and month
    await Promise.all([
      kv.hincrby(weekKey, slug, 1),
      kv.hincrby(monthKey, slug, 1)
    ]);
    
    // Set expiry for automatic cleanup (week: 14 days, month: 60 days)
    await Promise.all([
      kv.expire(weekKey, 14 * 24 * 60 * 60),
      kv.expire(monthKey, 60 * 24 * 60 * 60)
    ]);
    
    // Store metadata if provided
    if (title || url) {
      const metaKey = `meta:${slug}`;
      await kv.hset(metaKey, {
        type,
        title: title || slug,
        url: url || `/${type}/${slug}`,
        lastUpdate: now.toISOString()
      });
      await kv.expire(metaKey, 60 * 24 * 60 * 60); // 60 days
    }
    
  } catch (error) {
    console.error('Failed to track view:', error);
    // Don't throw - view tracking should not break the app
  }
}

/**
 * Get top popular items for a given range and type
 */
export async function getTop(
  kind: PopularKind = 'all',
  range: PopularRange = 'week',
  limit: number = 10
): Promise<PopularItem[]> {
  if (!process.env.KV_REST_API_URL) {
    console.warn('KV not configured, returning empty popular list');
    return [];
  }

  try {
    const key = range === 'week' 
      ? `popular:week:${getWeekKey(new Date())}`
      : `popular:month:${getMonthKey(new Date())}`;
    
    // Get all view counts
    const viewCounts = await kv.hgetall(key) as Record<string, number> || {};
    
    // Sort by view count and limit
    const sortedSlugs = Object.entries(viewCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit * 2) // Get more than needed for filtering
      .map(([slug, views]) => ({ slug, views }));
    
    // Get metadata for each slug
    const items: PopularItem[] = [];
    let rank = 1;
    
    for (const { slug, views } of sortedSlugs) {
      if (items.length >= limit) break;
      
      try {
        const metaKey = `meta:${slug}`;
        const meta = await kv.hgetall(metaKey) as any;
        
        if (!meta) continue; // Skip if no metadata
        
        // Filter by kind if specified
        if (kind !== 'all' && meta.type !== kind) continue;
        
        items.push({
          slug,
          type: meta.type,
          title: meta.title || slug,
          url: meta.url || `/${meta.type}/${slug}`,
          views: Number(views),
          rank: rank++
        });
      } catch (error) {
        console.warn(`Failed to get metadata for ${slug}:`, error);
        continue;
      }
    }
    
    return items;
    
  } catch (error) {
    console.error('Failed to get popular items:', error);
    return [];
  }
}

/**
 * Get current week key (ISO week)
 */
function getWeekKey(date: Date): string {
  const year = date.getFullYear();
  const week = getISOWeek(date);
  return `${year}-W${week.toString().padStart(2, '0')}`;
}

/**
 * Get current month key
 */
function getMonthKey(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}-${month.toString().padStart(2, '0')}`;
}

/**
 * Get ISO week number
 */
function getISOWeek(date: Date): number {
  const target = new Date(date.valueOf());
  const dayNumber = (date.getUTCDay() + 6) % 7;
  target.setUTCDate(target.getUTCDate() - dayNumber + 3);
  const firstThursday = target.valueOf();
  target.setUTCMonth(0, 1);
  if (target.getUTCDay() !== 4) {
    target.setUTCMonth(0, 1 + ((4 - target.getUTCDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
}