/**
 * Cookie parsing utilities for GTM context enrichment
 */

export function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : undefined;
}

export function getMarketingCookies(): Record<string, string> {
  const cookieNames = [
    '_fbp',           // Facebook Pixel
    '_fbc',           // Facebook Click ID
    '_uetsid',        // Bing UET Session ID
    '_uetvid',        // Bing UET Visitor ID
    '_ga',            // Google Analytics
    '_ga_6GVVFZ37XF', // GA4 property-specific
    '_ga_Y17CX3NJ0H', // GA4 property-specific
    '_ttp',           // TikTok Pixel
    '_kx',            // Klaviyo
    'market_id',      // Market ID
  ];

  const cookies: Record<string, string> = {};

  for (const name of cookieNames) {
    const value = getCookie(name);
    if (value) {
      cookies[name] = value;
    }
  }

  return cookies;
}

export function getClickIds(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const clickIds: Record<string, string> = {};

  // Google Ads Click ID - formatted as "gclid:..."
  const gclid = params.get('gclid') || getCookie('_gcl_aw');
  if (gclid) {
    clickIds.google_ads_click_id = `gclid:${gclid}`;
  }

  // Impact Radius - check URL param and cookie
  const irclickid = params.get('irclickid') || getCookie('irclickid');
  if (irclickid) {
    clickIds.irclickid = irclickid;
  }

  // Facebook Click ID
  const fbclid = params.get('fbclid');
  if (fbclid) {
    clickIds.fbclid = fbclid;
  }

  // TikTok Click ID
  const ttclid = params.get('ttclid');
  if (ttclid) {
    clickIds.ttclid = ttclid;
  }

  // Microsoft/Bing Click ID
  const msclkid = params.get('msclkid');
  if (msclkid) {
    clickIds.msclkid = msclkid;
  }

  // Market ID from URL param
  const marketId = params.get('market_id');
  if (marketId) {
    clickIds.market_id = marketId;
  }

  return clickIds;
}
