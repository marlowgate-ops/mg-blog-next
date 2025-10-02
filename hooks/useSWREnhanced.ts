// hooks/useSWREnhanced.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import { globalCache } from '../lib/cache/enhanced-cache';

export interface UseSWREnhancedOptions<T> extends SWRConfiguration<T> {
  cacheKey?: string;
  cacheTags?: string[];
  enableCache?: boolean;
  onCacheHit?: (data: T) => void;
  onCacheMiss?: () => void;
  onStaleData?: (data: T) => void;
}

export function useSWREnhanced<T>(
  key: string | null,
  fetcher?: (key: string) => Promise<T>,
  options: UseSWREnhancedOptions<T> = {}
): SWRResponse<T> & {
  isFromCache: boolean;
  isStale: boolean;
  cacheHitRatio: number;
  invalidateCache: () => void;
} {
  const {
    cacheKey = key || '',
    cacheTags = [],
    enableCache = true,
    onCacheHit,
    onCacheMiss,
    onStaleData,
    ...swrOptions
  } = options;

  const [isFromCache, setIsFromCache] = useState(false);
  const [isStale, setIsStale] = useState(false);
  const cacheKeyRef = useRef(cacheKey);

  // Enhanced fetcher with cache integration
  const enhancedFetcher = useCallback(async (fetchKey: string): Promise<T> => {
    if (!enableCache || !fetcher) {
      const result = await fetcher?.(fetchKey);
      setIsFromCache(false);
      return result as T;
    }

    // Check cache first
    const cached = globalCache.get<T>(cacheKeyRef.current);
    if (cached.data !== null) {
      setIsFromCache(true);
      setIsStale(cached.isStale);
      
      if (cached.isStale) {
        onStaleData?.(cached.data);
        // Trigger background revalidation for stale data
        setTimeout(async () => {
          try {
            const freshData = await fetcher(fetchKey);
            globalCache.set(cacheKeyRef.current, freshData, { tags: cacheTags });
          } catch (error) {
            console.warn('Background revalidation failed:', error);
          }
        }, 0);
      } else {
        onCacheHit?.(cached.data);
      }
      
      return cached.data;
    }

    // Cache miss - fetch fresh data
    onCacheMiss?.();
    setIsFromCache(false);
    setIsStale(false);
    
    const freshData = await fetcher(fetchKey);
    globalCache.set(cacheKeyRef.current, freshData, { tags: cacheTags });
    
    return freshData;
  }, [fetcher, enableCache, cacheTags, onCacheHit, onCacheMiss, onStaleData]);

  // Use SWR with enhanced fetcher
  const swrResponse = useSWR<T>(key, enhancedFetcher, {
    dedupingInterval: 2000,
    focusThrottleInterval: 5000,
    ...swrOptions,
  });

  // Cache invalidation function
  const invalidateCache = useCallback(() => {
    if (enableCache) {
      globalCache.invalidate(cacheKeyRef.current, 'manual_invalidation');
      swrResponse.mutate();
    }
  }, [enableCache, swrResponse]);

  // Update cache key ref when key changes
  useEffect(() => {
    cacheKeyRef.current = cacheKey;
  }, [cacheKey]);

  // Get cache metrics
  const cacheHitRatio = globalCache.getHitRatio();

  return {
    ...swrResponse,
    isFromCache,
    isStale,
    cacheHitRatio,
    invalidateCache,
  };
}

// Hook for cache metrics monitoring
export function useCacheMetrics() {
  const [metrics, setMetrics] = useState(globalCache.getMetrics());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(globalCache.getMetrics());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    metrics,
    hitRatio: globalCache.getHitRatio(),
    size: globalCache.getSize(),
    clear: () => globalCache.clear(),
    prune: () => globalCache.prune(),
  };
}