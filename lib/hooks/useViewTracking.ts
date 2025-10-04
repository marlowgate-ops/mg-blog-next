import { useEffect } from 'react';
import { trackView, PopularItem } from '@/lib/metrics/popular';

type ValidPopularType = PopularItem['type'];

interface UseViewTrackingOptions {
  title: string;
  path: string;
  type?: ValidPopularType;
  slug?: string;
  enabled?: boolean;
}

export function useViewTracking({
  title,
  path,
  type = 'article',
  slug,
  enabled = true
}: UseViewTrackingOptions) {
  useEffect(() => {
    if (!enabled) return;
    
    const trackPageView = async () => {
      try {
        const pageSlug = slug || path.split('/').pop() || path;
        await trackView(pageSlug, type, title, path);
      } catch (error) {
        // Fail silently - analytics shouldn't break the page
        console.warn('View tracking failed:', error);
      }
    };

    // Small delay to ensure page is loaded
    const timer = setTimeout(trackPageView, 100);
    
    return () => clearTimeout(timer);
  }, [title, path, type, slug, enabled]);
}

// Simplified function for direct use
export async function trackPageView(
  title: string, 
  path: string, 
  type: ValidPopularType = 'article'
) {
  try {
    const slug = path.split('/').pop() || path;
    await trackView(slug, type, title, path);
  } catch (error) {
    console.warn('View tracking failed:', error);
  }
}