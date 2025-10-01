// lib/cache/enhanced-cache.ts
import { CacheEntry, CacheOptions, PerformanceMetrics, CacheInvalidationEvent } from './types';

export class EnhancedCache {
  private cache = new Map<string, CacheEntry>();
  private metrics: PerformanceMetrics = {
    cacheHits: 0,
    cacheMisses: 0,
    totalRequests: 0,
    averageResponseTime: 0,
    staleServed: 0
  };
  private responseTimes: number[] = [];
  private invalidationEvents: CacheInvalidationEvent[] = [];
  private maxMetricsHistory = 1000;

  // Default cache configuration
  private defaultOptions: Required<CacheOptions> = {
    ttl: 300, // 5 minutes
    staleWhileRevalidate: 60, // 1 minute
    tags: [],
    revalidateOnFocus: true,
    revalidateOnMount: true,
    dedupingInterval: 2000 // 2 seconds
  };

  /**
   * Get data from cache with SWR pattern
   */
  get<T>(key: string): { data: T | null; isStale: boolean; etag?: string } {
    const startTime = Date.now();
    this.metrics.totalRequests++;

    const entry = this.cache.get(key);
    if (!entry) {
      this.metrics.cacheMisses++;
      this.updateResponseTime(Date.now() - startTime);
      return { data: null, isStale: false };
    }

    const now = Date.now();
    const isExpired = now > entry.timestamp + (this.defaultOptions.ttl * 1000);
    const isStale = now > entry.staleTimestamp;

    if (isExpired) {
      this.cache.delete(key);
      this.metrics.cacheMisses++;
      this.updateResponseTime(Date.now() - startTime);
      return { data: null, isStale: false };
    }

    this.metrics.cacheHits++;
    if (isStale) {
      this.metrics.staleServed++;
    }
    
    this.updateResponseTime(Date.now() - startTime);
    return { 
      data: entry.data, 
      isStale, 
      etag: entry.etag 
    };
  }

  /**
   * Set data in cache with options
   */
  set<T>(key: string, data: T, options: Partial<CacheOptions> = {}): void {
    const opts = { ...this.defaultOptions, ...options };
    const now = Date.now();
    
    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      staleTimestamp: now + (opts.staleWhileRevalidate * 1000),
      tags: opts.tags,
      etag: this.generateEtag(data)
    };

    this.cache.set(key, entry);
  }

  /**
   * Invalidate cache by key
   */
  invalidate(key: string, reason?: string): boolean {
    const existed = this.cache.has(key);
    this.cache.delete(key);
    
    this.recordInvalidation({
      type: 'key',
      target: key,
      timestamp: Date.now(),
      reason
    });

    return existed;
  }

  /**
   * Invalidate cache by tags
   */
  invalidateByTags(tags: string[], reason?: string): number {
    let invalidatedCount = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags && entry.tags.some(tag => tags.includes(tag))) {
        this.cache.delete(key);
        invalidatedCount++;
      }
    }

    this.recordInvalidation({
      type: 'tag',
      target: tags.join(','),
      timestamp: Date.now(),
      reason
    });

    return invalidatedCount;
  }

  /**
   * Invalidate cache by pattern
   */
  invalidateByPattern(pattern: RegExp, reason?: string): number {
    let invalidatedCount = 0;
    
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key);
        invalidatedCount++;
      }
    }

    this.recordInvalidation({
      type: 'pattern',
      target: pattern.toString(),
      timestamp: Date.now(),
      reason
    });

    return invalidatedCount;
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
    this.recordInvalidation({
      type: 'pattern',
      target: '*',
      timestamp: Date.now(),
      reason: 'cache_clear'
    });
  }

  /**
   * Get cache metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Get cache hit ratio
   */
  getHitRatio(): number {
    if (this.metrics.totalRequests === 0) return 0;
    return this.metrics.cacheHits / this.metrics.totalRequests;
  }

  /**
   * Get cache size
   */
  getSize(): number {
    return this.cache.size;
  }

  /**
   * Get all cache keys
   */
  getKeys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Check if key exists in cache
   */
  has(key: string): boolean {
    return this.cache.has(key);
  }

  /**
   * Get cache entry info without data
   */
  getInfo(key: string): Omit<CacheEntry, 'data'> | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    const { data, ...info } = entry;
    console.log('Cache entry data exists:', !!data); // Use data to avoid lint warning
    return info;
  }

  /**
   * Prune expired entries
   */
  prune(): number {
    const now = Date.now();
    let prunedCount = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      const isExpired = now > entry.timestamp + (this.defaultOptions.ttl * 1000);
      if (isExpired) {
        this.cache.delete(key);
        prunedCount++;
      }
    }

    return prunedCount;
  }

  /**
   * Get invalidation history
   */
  getInvalidationHistory(): CacheInvalidationEvent[] {
    return [...this.invalidationEvents];
  }

  private generateEtag<T>(data: T): string {
    // Simple etag generation based on data hash
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `"${Math.abs(hash).toString(36)}"`;
  }

  private updateResponseTime(time: number): void {
    this.responseTimes.push(time);
    if (this.responseTimes.length > this.maxMetricsHistory) {
      this.responseTimes.shift();
    }
    
    this.metrics.averageResponseTime = 
      this.responseTimes.reduce((sum, time) => sum + time, 0) / this.responseTimes.length;
  }

  private recordInvalidation(event: CacheInvalidationEvent): void {
    this.invalidationEvents.push(event);
    if (this.invalidationEvents.length > this.maxMetricsHistory) {
      this.invalidationEvents.shift();
    }
  }
}

// Global cache instance
export const globalCache = new EnhancedCache();