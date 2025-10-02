'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { z } from 'zod';
import { parseParams, mergeParams, buildUrl } from './params';
import { commitState } from './commitUrl';

interface UseUrlStateOptions<T> {
  schema: z.ZodSchema<T>;
  defaults: T;
  initialState?: T;
}

/**
 * Custom hook for managing URL state with type safety
 * Returns [state, setPatch, replaceUrl] tuple
 */
export function useUrlState<T>({ schema, defaults, initialState }: UseUrlStateOptions<T>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  // Initialize state with initialState if provided (for SSR), otherwise use defaults
  const [state, setState] = useState<T>(initialState ?? defaults);
  
  // Initialize state from URL on mount and when searchParams change
  useEffect(() => {
    try {
      const parsed = parseParams(schema, searchParams);
      setState(parsed);
    } catch {
      // If parsing fails, use initialState if available, otherwise defaults
      setState(initialState ?? defaults);
    }
  }, [searchParams, schema, defaults, initialState]);
  
  // Function to patch state and update URL synchronously
  const setPatch = useCallback((patch: Partial<T>) => {
    // Update React state synchronously first
    commitState(setState, (current: T) => {
      return { ...current, ...patch };
    });
    
    // Then immediately update URL with the new complete state
    const newState = { ...state, ...patch };
    const currentParams = new URLSearchParams(searchParams);
    const mergedParams = mergeParams(currentParams, newState as Record<string, unknown>);
    
    // Immediate router replace (no startTransition for URL writes)
    const newUrl = buildUrl(pathname, mergedParams);
    router.replace(newUrl, { scroll: false });
  }, [router, pathname, searchParams, state]);
  
  // Function to manually trigger URL replacement
  const replaceUrl = useCallback(() => {
    const currentParams = new URLSearchParams(searchParams);
    const newUrl = buildUrl(pathname, currentParams);
    router.replace(newUrl, { scroll: false });
  }, [router, pathname, searchParams]);
  
  return [state, setPatch, replaceUrl] as const;
}