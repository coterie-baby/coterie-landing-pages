'use client';

import { useEffect } from 'react';
import { sendGTMEvent } from '@next/third-parties/google';
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

    // Wait for window load + small delay to ensure cookies are available
    const delayedPush = () => {
      setTimeout(pushContext, 100);
    };

    if (document.readyState === 'complete') {
      delayedPush();
    } else {
      window.addEventListener('load', delayedPush);
    }

    // Auto-capture clicks on interactive elements
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickable = target.closest('a, button, [role="button"]');

      if (clickable) {
        // Skip elements that handle their own tracking
        if (target.closest('[data-gtm-ignore]')) {
          return;
        }

        const element = clickable as HTMLElement;
        sendGTMEvent({
          event: 'cta_click',
          cta_text: element.textContent?.trim().slice(0, 100) || '',
          location: element.getAttribute('href') || '',
          search_query: '',
        });
      }
    };

    document.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('load', delayedPush);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return null;
}
