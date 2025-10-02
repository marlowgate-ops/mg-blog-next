// lib/cache/types.ts
export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  staleTimestamp: number;
  etag?: string;
  tags?: string[];
}

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  staleWhileRevalidate?: number; // SWR time in seconds
  tags?: string[]; // Cache tags for invalidation
  revalidateOnFocus?: boolean;
  revalidateOnMount?: boolean;
  dedupingInterval?: number;
}

export interface PerformanceMetrics {
  cacheHits: number;
  cacheMisses: number;
  totalRequests: number;
  averageResponseTime: number;
  staleServed: number;
}

export interface CacheInvalidationEvent {
  type: 'tag' | 'key' | 'pattern';
  target: string;
  timestamp: number;
  reason?: string;
}

export interface SwrConfig<T = any> {
  fetcher?: (key: string) => Promise<T>;
  fallbackData?: T;
  revalidateOnFocus?: boolean;
  revalidateOnReconnect?: boolean;
  refreshInterval?: number;
  dedupingInterval?: number;
  focusThrottleInterval?: number;
  loadingTimeout?: number;
  errorRetryInterval?: number;
  errorRetryCount?: number;
}