import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Pre-compiled regex for mobile detection (avoids re-compilation on each request)
const MOBILE_REGEX =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

export function middleware(request: NextRequest) {
  // const userAgent = request.headers.get('user-agent') || '';
  // // Use pre-compiled regex for faster matching
  // const isMobile = MOBILE_REGEX.test(userAgent);
  // if (!isMobile) {
  //   return NextResponse.redirect('https://www.coterie.com/products/the-diaper');
  // }
  // return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
