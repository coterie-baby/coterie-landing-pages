import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity/client';

interface TargetingRule {
  parameterType: 'query' | 'utm_source' | 'utm_medium' | 'utm_campaign' | 'utm_term' | 'utm_content';
  parameterName?: string;
  value: string;
  matchType: 'exact' | 'contains' | 'startsWith';
}

interface AudienceVariant {
  name: string;
  targetingRules: TargetingRule[];
}

// Cache for page data to avoid repeated Sanity queries
const pageCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getParameterValue(url: URL, rule: TargetingRule): string | null {
  const searchParams = url.searchParams;
  
  switch (rule.parameterType) {
    case 'query':
      return rule.parameterName ? searchParams.get(rule.parameterName) : null;
    case 'utm_source':
      return searchParams.get('utm_source');
    case 'utm_medium':
      return searchParams.get('utm_medium');
    case 'utm_campaign':
      return searchParams.get('utm_campaign');
    case 'utm_term':
      return searchParams.get('utm_term');
    case 'utm_content':
      return searchParams.get('utm_content');
    default:
      return null;
  }
}

function matchesRule(paramValue: string | null, rule: TargetingRule): boolean {
  if (!paramValue || !rule.value) return false;

  const paramValueLower = paramValue.toLowerCase();
  const ruleValueLower = rule.value.toLowerCase();

  switch (rule.matchType) {
    case 'exact':
      return paramValueLower === ruleValueLower;
    case 'contains':
      return paramValueLower.includes(ruleValueLower);
    case 'startsWith':
      return paramValueLower.startsWith(ruleValueLower);
    default:
      return false;
  }
}

function evaluateTargetingRules(url: URL, rules: TargetingRule[]): boolean {
  if (!rules || rules.length === 0) return false;

  return rules.every(rule => {
    const paramValue = getParameterValue(url, rule);
    return matchesRule(paramValue, rule);
  });
}

function findMatchingVariant(url: URL, variants: AudienceVariant[]): string | null {
  if (!variants) return null;

  const matchingVariant = variants.find(variant => 
    evaluateTargetingRules(url, variant.targetingRules)
  );
  
  return matchingVariant?.name || null;
}

async function getPageAudienceData(slug: string) {
  const cacheKey = `page-${slug}`;
  const cached = pageCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const query = `*[_type == "page" && slug.current == $slug][0]{
      audienceTargeting{
        enabled,
        variants[]{
          name,
          targetingRules[]{
            parameterType,
            parameterName,
            value,
            matchType
          }
        }
      }
    }`;

    const pageData = await client.fetch(query, { slug });
    
    const cacheData = {
      data: pageData,
      timestamp: Date.now()
    };
    
    pageCache.set(cacheKey, cacheData);
    return pageData;
  } catch (error) {
    console.error('Error fetching page audience data:', error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // Skip middleware for API routes, static files, and Next.js internals
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/_next/') ||
    url.pathname.startsWith('/static/') ||
    url.pathname.includes('.') ||
    url.pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Extract slug from pathname
  let slug = url.pathname.slice(1); // Remove leading slash
  if (slug === '' || slug === '/') {
    slug = 'home';
  }

  try {
    // Get audience targeting data for this page
    const pageData = await getPageAudienceData(slug);
    
    if (!pageData?.audienceTargeting?.enabled) {
      return NextResponse.next();
    }

    // Find matching variant
    const matchingVariant = findMatchingVariant(
      url,
      pageData.audienceTargeting.variants
    );

    if (matchingVariant) {
      // Add the matching variant to headers so the page can access it
      const response = NextResponse.next();
      response.headers.set('x-audience-variant', matchingVariant);
      response.headers.set('x-audience-targeting-enabled', 'true');
      return response;
    }

    // No variant matched, proceed normally
    const response = NextResponse.next();
    response.headers.set('x-audience-targeting-enabled', 'false');
    return response;
    
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};