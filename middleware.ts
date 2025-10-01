// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const startTime = Date.now();
  
  // Add performance headers
  const response = NextResponse.next();
  
  // Calculate response time
  const responseTime = Date.now() - startTime;
  response.headers.set('X-Response-Time', `${responseTime}ms`);
  
  // Add cache control headers for different routes
  const pathname = request.nextUrl.pathname;
  
  if (pathname.startsWith('/api/')) {
    // API routes get shorter cache
    response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
  } else if (pathname.startsWith('/_next/static/')) {
    // Static assets get long cache
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|webp|avif)$/)) {
    // Images get medium cache
    response.headers.set('Cache-Control', 'public, max-age=86400');
  } else {
    // Regular pages get default cache
    response.headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=7200');
  }
  
  // Add security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  
  // Add performance hints
  if (request.headers.get('Accept')?.includes('text/html')) {
    response.headers.set('Link', [
      '</api/news>; rel=prefetch',
      '</api/search>; rel=prefetch'
    ].join(', '));
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};