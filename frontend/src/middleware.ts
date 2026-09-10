import { NextRequest, NextResponse } from 'next/server';

/** Keep authenticated and transactional workflows out of search indexes. */
export function middleware(_request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/patients/:path*', '/cart/:path*', '/payment/:path*'],
};

