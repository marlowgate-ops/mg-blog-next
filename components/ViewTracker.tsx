'use client';

import { usePathname } from 'next/navigation';
import { useViewTracking } from '@/lib/hooks/useViewTracking';
import { PopularItem } from '@/lib/metrics/popular';

interface ViewTrackerProps {
  title: string;
  type?: PopularItem['type'];
  slug?: string;
  enabled?: boolean;
}

export function ViewTracker({ 
  title, 
  type = 'article', 
  slug,
  enabled = true 
}: ViewTrackerProps) {
  const pathname = usePathname();
  
  useViewTracking({
    title,
    path: pathname,
    type,
    slug,
    enabled
  });

  // This component renders nothing
  return null;
}

// Default export for backward compatibility
export default ViewTracker;