import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { SiteSettings, Funnel } from './lib/sanity/types';

// Pre-compiled regex for mobile detection (avoids re-compilation on each request)
const MOBILE_REGEX =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET;

async function fetchSiteSettings(): Promise<SiteSettings | null> {
  if (!SANITY_PROJECT_ID || !SANITY_DATASET) return null;

  const query = encodeURIComponent(
    `*[_type == "siteSettings" && _id == "siteSettings"][0]{desktopRedirect{enabled,destinationUrl,requireUtmParams}}`
  );

  try {
    const res = await fetch(
      `https://${SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${SANITY_DATASET}?query=${query}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.result ?? null;
  } catch {
    return null;
  }
}

async function fetchFunnelRules(): Promise<Funnel[]> {
  if (!SANITY_PROJECT_ID || !SANITY_DATASET) return [];

  const query = encodeURIComponent(
    `*[_type == "funnel" && enabled == true]{sourcePath,"targetSlug":landingPage->slug.current,utmSource,utmMedium,utmCampaign,utmTerm,utmContent,routes[]{_key,name,weight,destinationType,"targetSlug":landingPage->slug.current,targetUrl}}`
  );

  try {
    const res = await fetch(
      `https://${SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${SANITY_DATASET}?query=${query}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.result ?? [];
  } catch {
    return [];
  }
}

const UTM_FIELDS: { param: string; key: keyof Funnel }[] = [
  { param: 'utm_source', key: 'utmSource' },
  { param: 'utm_medium', key: 'utmMedium' },
  { param: 'utm_campaign', key: 'utmCampaign' },
  { param: 'utm_term', key: 'utmTerm' },
  { param: 'utm_content', key: 'utmContent' },
];

/**
 * Find the best funnel match using specificity-based priority.
 *
 * A funnel matches when:
 * 1. Its sourcePath equals the current pathname (without leading slash)
 * 2. Every *specified* UTM field matches the corresponding search param (case-insensitive)
 * 3. At least one UTM field is specified (prevents a bare rule from catching all traffic)
 *
 * When multiple funnels match, the one with the most UTM conditions wins.
 * Returns the full Funnel object so the caller can access routes for traffic splitting.
 */
function findMatchingFunnel(
  pathname: string,
  searchParams: URLSearchParams,
  funnels: Funnel[]
): Funnel | null {
  const bare = pathname.replace(/^\//, '');

  let bestFunnel: Funnel | null = null;
  let bestSpecificity = 0;

  for (const funnel of funnels) {
    if (funnel.sourcePath !== bare) continue;

    const specified = UTM_FIELDS.filter(({ key }) => !!funnel[key]);
    if (specified.length === 0) continue;

    const allMatch = specified.every(
      ({ param, key }) =>
        searchParams.get(param)?.toLowerCase() === (funnel[key] as string).toLowerCase()
    );

    if (allMatch && specified.length > bestSpecificity) {
      bestSpecificity = specified.length;
      bestFunnel = funnel;
    }
  }

  return bestFunnel;
}

type RouteSelection =
  | { type: 'rewrite'; slug: string; setCookie?: { name: string; value: string } }
  | { type: 'redirect'; url: string; setCookie?: { name: string; value: string } };

/**
 * Select which route to serve for a traffic-split funnel.
 * Uses a cookie for sticky visitor assignment so returning visitors
 * always see the same variant.
 *
 * Routes can target either a local landing page (rewrite) or an external URL (redirect).
 */
function selectRoute(
  funnel: Funnel,
  cookies: NextRequest['cookies']
): RouteSelection {
  const routes = funnel.routes;
  // No routes → backward compatible, return default page rewrite
  if (!routes || routes.length === 0) return { type: 'rewrite', slug: funnel.targetSlug };

  // Build a map from cookie value → route result for validation
  // Default page uses its slug as the cookie value; URL routes use the URL
  const cookieToResult = new Map<string, RouteSelection>();
  cookieToResult.set(funnel.targetSlug, { type: 'rewrite', slug: funnel.targetSlug });
  for (const route of routes) {
    if (route.destinationType === 'url' && route.targetUrl) {
      cookieToResult.set(route.targetUrl, { type: 'redirect', url: route.targetUrl });
    } else if (route.targetSlug) {
      cookieToResult.set(route.targetSlug, { type: 'rewrite', slug: route.targetSlug });
    }
  }

  // Cookie key: _frt_{sanitized sourcePath}
  const cookieName = `_frt_${funnel.sourcePath.replace(/[^a-zA-Z0-9_-]/g, '_')}`;

  // Sticky assignment: return existing cookie if still valid
  const existing = cookies.get(cookieName)?.value;
  if (existing && cookieToResult.has(existing)) return cookieToResult.get(existing)!;

  // First visit: build cumulative distribution and roll
  const totalRouteWeight = routes.reduce((sum, r) => sum + (r.weight || 0), 0);
  const defaultWeight = Math.max(0, 100 - totalRouteWeight);

  const distribution: { cookieValue: string; result: RouteSelection; cumulative: number }[] = [];
  let cumulative = 0;

  if (defaultWeight > 0) {
    cumulative += defaultWeight;
    distribution.push({
      cookieValue: funnel.targetSlug,
      result: { type: 'rewrite', slug: funnel.targetSlug },
      cumulative,
    });
  }
  for (const route of routes) {
    if (!route.weight) continue;
    if (route.destinationType === 'url' && route.targetUrl) {
      cumulative += route.weight;
      distribution.push({
        cookieValue: route.targetUrl,
        result: { type: 'redirect', url: route.targetUrl },
        cumulative,
      });
    } else if (route.targetSlug) {
      cumulative += route.weight;
      distribution.push({
        cookieValue: route.targetSlug,
        result: { type: 'rewrite', slug: route.targetSlug },
        cumulative,
      });
    }
  }

  if (distribution.length === 0) return { type: 'rewrite', slug: funnel.targetSlug };

  const roll = Math.random() * cumulative;
  let selected = distribution[distribution.length - 1];
  for (const entry of distribution) {
    if (roll < entry.cumulative) { selected = entry; break; }
  }

  return { ...selected.result, setCookie: { name: cookieName, value: selected.cookieValue } };
}

export async function middleware(request: NextRequest) {
  // Fetch funnels and site settings in parallel
  const [funnels, settings] = await Promise.all([
    fetchFunnelRules(),
    fetchSiteSettings(),
  ]);

  // --- UTM funnel rewrites (all devices, checked first) ---
  if (funnels.length > 0) {
    const matchedFunnel = findMatchingFunnel(
      request.nextUrl.pathname,
      request.nextUrl.searchParams,
      funnels
    );

    if (matchedFunnel) {
      const result = selectRoute(matchedFunnel, request.cookies);

      let response: NextResponse;
      if (result.type === 'redirect') {
        // Forward UTM params + split identifier to the destination URL
        const dest = new URL(result.url);
        const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
        for (const param of UTM_PARAMS) {
          const value = request.nextUrl.searchParams.get(param);
          if (value && !dest.searchParams.has(param)) {
            dest.searchParams.set(param, value);
          }
        }
        dest.searchParams.set('_frt', matchedFunnel.sourcePath);
        response = NextResponse.redirect(dest.toString());
      } else {
        const url = request.nextUrl.clone();
        url.pathname = `/${result.slug}`;
        response = NextResponse.rewrite(url);
      }

      if (result.setCookie) {
        response.cookies.set(result.setCookie.name, result.setCookie.value, {
          maxAge: 60 * 60 * 24 * 30, // 30 days
          path: '/',
          sameSite: 'lax',
          httpOnly: true,
          secure: true,
        });
      }
      return response;
    }
  }

  // --- Desktop redirect (mobile users skip) ---
  const userAgent = request.headers.get('user-agent') || '';
  const isMobile = MOBILE_REGEX.test(userAgent);

  if (isMobile) return NextResponse.next();

  const redirect = settings?.desktopRedirect;

  if (!redirect?.enabled || !redirect.destinationUrl) {
    return NextResponse.next();
  }

  if (redirect.requireUtmParams) {
    const { searchParams } = request.nextUrl;
    const hasUtmParams =
      searchParams.has('utm_source') ||
      searchParams.has('utm_medium') ||
      searchParams.has('utm_campaign') ||
      searchParams.has('utm_term') ||
      searchParams.has('utm_content');

    if (!hasUtmParams) return NextResponse.next();
  }

  return NextResponse.redirect(redirect.destinationUrl);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes (needed for draft mode, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};
