'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Session storage key for deduplication
    const sessionKey = `viewed:${pathname}`;
    
    // Check if we've already tracked this path in this session
    if (typeof window !== 'undefined' && !sessionStorage.getItem(sessionKey)) {
      // Mark as seen for this session
      sessionStorage.setItem(sessionKey, '1');
      
      // Send tracking request (fire and forget - don't block rendering)
      fetch('/api/metrics/view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: pathname }),
      }).catch(() => {
        // Silently ignore errors - tracking is not critical
      });
    }
  }, [pathname]);

  // This component renders nothing
  return null;
}