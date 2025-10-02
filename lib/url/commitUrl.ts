import { flushSync } from 'react-dom';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

/**
 * Synchronously commits URL changes with state updates
 * For E2E testing reliability - ensures URL is updated before assertions
 */
export function commitUrl(
  router: AppRouterInstance, 
  path: string, 
  nextParams: URLSearchParams
) {
  // Synchronously update the URL (no scroll)
  const newUrl = path + (nextParams.toString() ? '?' + nextParams.toString() : '');
  
  // Use replace to avoid adding history entries for filters
  router.replace(newUrl, { scroll: false });
  
  // Await one microtask and one paint for reliable URL state
  return Promise.resolve().then(() => 
    new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
  );
}

/**
 * Synchronously applies a state update using flushSync if needed
 * For immediate UI updates during testing
 */
export function commitState<T>(setState: (updater: (prev: T) => T) => void, updater: (prev: T) => T) {
  try {
    flushSync(() => {
      setState(updater);
    });
  } catch {
    // Fallback to normal setState if flushSync fails (SSR context)
    setState(updater);
  }
}