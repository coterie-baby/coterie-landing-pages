'use client';

import { useState, useCallback, useRef } from 'react';

/**
 * Returns a ref callback and a boolean indicating whether the observed
 * element is currently intersecting the viewport (or a custom root).
 *
 * SSR-safe: defaults to `true` so consumers that hide UI when the target
 * is in view will keep that UI hidden during server render / hydration.
 */
export function useInView(
  options?: IntersectionObserverInit
): [React.RefCallback<Element>, boolean] {
  const [isInView, setIsInView] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const ref = useCallback(
    (node: Element | null) => {
      // Clean up previous observer
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (!node) return;

      if (typeof IntersectionObserver === 'undefined') return;

      observerRef.current = new IntersectionObserver(([entry]) => {
        setIsInView(entry.isIntersecting);
      }, options);

      observerRef.current.observe(node);
    },
    // Recreate observer if options identity changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [options?.threshold, options?.root, options?.rootMargin]
  );

  return [ref, isInView];
}
