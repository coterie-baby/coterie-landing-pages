// Umami custom event tracking

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, string>) => void
    }
  }
}

/**
 * Fire a "conversion" custom event in Umami.
 * Called on CTA clicks (add-to-cart, checkout, etc.) so the Sanity
 * Funnels Dashboard can compute per-path conversion rates.
 */
export function trackConversion(label?: string) {
  if (typeof window !== 'undefined' && window.umami) {
    window.umami.track('conversion', label ? { label } : undefined)
  }
}
