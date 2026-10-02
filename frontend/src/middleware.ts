import { NextRequest, NextResponse } from 'next/server';

/** Keep authenticated and transactional workflows out of search indexes. */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const pathname = request.nextUrl.pathname;
  const isPrivateRoute =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/patients') ||
    pathname.startsWith('/cart') ||
    pathname.startsWith('/payment');

  if (isPrivateRoute) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  } else if (pathname === '/appointments/book' && request.nextUrl.search) {
    // Deep-link parameters select a booking option; they are not separate
    // landing pages and otherwise create duplicate indexable URLs.
    response.headers.set('X-Robots-Tag', 'noindex, follow');
  }

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/patients/:path*',
    '/cart/:path*',
    '/payment/:path*',
    '/appointments/book',
  ],
};
