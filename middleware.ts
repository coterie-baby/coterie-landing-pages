import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { get } from '@vercel/edge-config';

// Pre-compiled regex for mobile detection (avoids re-compilation on each request)
const MOBILE_REGEX =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

// Type for Edge Config Forever Links structure
interface ForeverLinkMapping {
  destination: string;
  notes?: string;
}

interface ForeverLinksConfig {
  default: string;
  mappings: Record<string, ForeverLinkMapping>;
}

/**
 * Build redirect URL preserving query parameters
 */
function buildRedirectUrl(
  destination: string,
  request: NextRequest,
  excludeParams: string[] = []
): string {
  const currentUrl = new URL(request.url);
  const params = new URLSearchParams();

  currentUrl.searchParams.forEach((value, key) => {
    if (!excludeParams.includes(key)) {
      params.append(key, value);
    }
  });

  const queryString = params.toString();

  // Check if destination is absolute URL or relative path
  if (destination.startsWith('http://') || destination.startsWith('https://')) {
    const destUrl = new URL(destination);
    // Merge params - destination params take precedence
    params.forEach((value, key) => {
      if (!destUrl.searchParams.has(key)) {
        destUrl.searchParams.append(key, value);
      }
    });
    return destUrl.toString();
  }

  // Relative path - build full URL
  const baseUrl = new URL(request.url);
  const destPath = destination.startsWith('/') ? destination : `/${destination}`;

  if (queryString) {
    const separator = destPath.includes('?') ? '&' : '?';
    return `${baseUrl.origin}${destPath}${separator}${queryString}`;
  }

  return `${baseUrl.origin}${destPath}`;
}

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const utmContent = url.searchParams.get('utm_content');
  const alreadyProcessed = url.searchParams.get('_fl') === '1';

  // Forever Links routing: check if utm_content exists and hasn't been processed
  if (utmContent && !alreadyProcessed) {
    try {
      const config = await get<ForeverLinksConfig>('foreverLinks');

      if (config) {
        // Check for specific mapping
        const mapping = config.mappings?.[utmContent];
        const destination = mapping?.destination ?? config.default;

        if (destination) {
          const isLocalRoute = destination.startsWith('/');
          let redirectUrl = buildRedirectUrl(destination, request);

          // Add marker param for local routes to prevent re-processing
          if (isLocalRoute) {
            const destUrl = new URL(redirectUrl);
            destUrl.searchParams.set('_fl', '1');
            redirectUrl = destUrl.toString();
          }

          return NextResponse.redirect(redirectUrl, { status: 302 });
        }
      }
    } catch (error) {
      // Edge Config not available or error - fall through to default behavior
      console.error('Forever Links error:', error);
    }
  }

  // Existing mobile detection logic for traffic without utm_content
  const userAgent = request.headers.get('user-agent') || '';
  const isMobile = MOBILE_REGEX.test(userAgent);

  if (!isMobile) {
    return NextResponse.redirect('https://www.coterie.com/products/the-diaper');
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes (let them handle their own logic)
     * - admin routes (let them render normally)
     */
    '/((?!_next/static|_next/image|favicon.ico|api|admin).*)',
  ],
};
