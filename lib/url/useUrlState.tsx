'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { z } from 'zod';
import { parseParams, mergeParams, buildUrl } from './params';

interface UseUrlStateOptions<T> {
  schema: z.ZodSchema<T>;
  defaults: T;
}

/**
 * Custom hook for managing URL state with type safety
 * Returns [state, setPatch, replaceUrl] tuple
 */
export function useUrlState<T>({ schema, defaults }: UseUrlStateOptions<T>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const [state, setState] = useState<T>(defaults);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize state from URL on mount
  useEffect(() => {
    if (!isInitialized) {
      try {
        const parsed = parseParams(schema, searchParams);
        setState(parsed);
      } catch {
        // If parsing fails, use defaults
        setState(defaults);
      }
      setIsInitialized(true);
    }
  }, [searchParams, schema, defaults, isInitialized]);
  
  // Function to patch state and update URL
  const setPatch = useCallback((patch: Partial<T>) => {
    setState(current => {
      const newState = { ...current, ...patch };
      
      // Update URL immediately
      const currentParams = new URLSearchParams(searchParams);
      const mergedParams = mergeParams(currentParams, patch as Record<string, unknown>);
      const newUrl = buildUrl(pathname, mergedParams);
      
      router.replace(newUrl, { scroll: false });
      
      return newState;
    });
  }, [router, pathname, searchParams]);
  
  // Function to manually trigger URL replacement
  const replaceUrl = useCallback(() => {
    const currentParams = new URLSearchParams(searchParams);
    const newUrl = buildUrl(pathname, currentParams);
    router.replace(newUrl, { scroll: false });
  }, [router, pathname, searchParams]);
  
  return [state, setPatch, replaceUrl] as const;
}