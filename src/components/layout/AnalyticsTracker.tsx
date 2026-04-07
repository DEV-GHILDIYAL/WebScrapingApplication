'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { analyticsService } from '@/services/analytics';

/**
 * Automates page_view tracking on route changes.
 */
export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const url = searchParams?.toString() ? `${pathname}?${searchParams.toString()}` : pathname;
      analyticsService.trackPageView(url);
    }
  }, [pathname, searchParams]);

  return null;
}
