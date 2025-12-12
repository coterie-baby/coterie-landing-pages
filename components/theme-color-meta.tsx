'use client';

import { useEffect } from 'react';

export default function ThemeColorMeta() {
  useEffect(() => {
    // Remove existing theme-color meta tag if it exists
    const existingMeta = document.querySelector('meta[name="theme-color"]');
    if (existingMeta) {
      existingMeta.remove();
    }

    // Create and add new theme-color meta tag
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = '#ffffff';
    document.head.appendChild(meta);

    // Also add Apple-specific meta tag
    const appleMeta = document.querySelector(
      'meta[name="apple-mobile-web-app-status-bar-style"]'
    );
    if (appleMeta) {
      appleMeta.remove();
    }
    const appleMetaTag = document.createElement('meta');
    appleMetaTag.name = 'apple-mobile-web-app-status-bar-style';
    appleMetaTag.content = 'default';
    document.head.appendChild(appleMetaTag);

    return () => {
      // Cleanup on unmount
      const metaToRemove = document.querySelector('meta[name="theme-color"]');
      if (metaToRemove) {
        metaToRemove.remove();
      }
      const appleMetaToRemove = document.querySelector(
        'meta[name="apple-mobile-web-app-status-bar-style"]'
      );
      if (appleMetaToRemove) {
        appleMetaToRemove.remove();
      }
    };
  }, []);

  return null;
}



