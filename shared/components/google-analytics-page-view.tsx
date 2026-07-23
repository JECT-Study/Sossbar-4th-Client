'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const GoogleAnalyticsPageView = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isInitialPageView = useRef(true);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !GA_MEASUREMENT_ID || !pathname) {
      return;
    }

    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;

    if (isInitialPageView.current) {
      isInitialPageView.current = false;
      return;
    }

    window.gtag?.('config', GA_MEASUREMENT_ID, {
      page_path: pagePath,
    });
  }, [pathname, searchParams]);

  return null;
};
