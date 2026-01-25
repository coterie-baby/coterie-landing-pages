'use client';

import { useEffect } from 'react';
import { buildGTMContext } from './context';

function pushToDataLayer(data: Record<string, unknown>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push(data);
}

export function GTMTracking() {
  useEffect(() => {
    const pushContext = () => {
      const context = buildGTMContext();
      pushToDataLayer({
        ...context,
      });

      pushToDataLayer({
        event: 'page_view',
        page_location: window.location.href,
        page_title: document.title,
        page_path: window.location.pathname,
      });
    };

    // Follow-up event after GA4 and other tags have had time to set cookies
    const pushEnrichedContext = () => {
      const context = buildGTMContext();
      pushToDataLayer({
        ...context,
      });
    };

    // Wait for window load + small delay to ensure cookies are available
    const delayedPush = () => {
      setTimeout(pushContext, 100);
      // Send follow-up event after 3 seconds to capture GA4 cookies
      setTimeout(pushEnrichedContext, 3000);
    };

    if (document.readyState === 'complete') {
      delayedPush();
    } else {
      window.addEventListener('load', delayedPush);
    }

    return () => {
      window.removeEventListener('load', delayedPush);
    };
  }, []);

  return null;
}
