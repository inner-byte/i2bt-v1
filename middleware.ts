import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import rateLimit from '@/lib/rate-limit';

// Create limiter instance for API routes
const apiLimiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per interval
});

export default withAuth(
  async function middleware(req) {
    // Apply rate limiting to API routes
    if (req.nextUrl.pathname.startsWith('/api')) {
      const ip = req.headers.get('x-forwarded-for') ?? 'anonymous';
      const { success } = apiLimiter.check(ip, 100); // 100 requests per minute

      if (!success) {
        return new NextResponse(
          JSON.stringify({ message: 'Too many requests' }),
          {
            status: 429,
            headers: {
              'Retry-After': '60',
              'Content-Type': 'application/json',
            },
          }
        );
      }
    }

    // Handle role-based access
    const token = req.nextauth.token;
    const isAdmin = token?.role === 'ADMIN';
    const isModerator = token?.role === 'MODERATOR';

    // Protect admin routes
    if (req.nextUrl.pathname.startsWith('/admin') && !isAdmin) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    // Protect moderator routes
    if (
      req.nextUrl.pathname.startsWith('/moderator') &&
      !(isAdmin || isModerator)
    ) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    // Add security headers
    const response = NextResponse.next();
    
    // Security headers
    const securityHeaders = {
      'X-DNS-Prefetch-Control': 'on',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-XSS-Protection': '1; mode=block',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
      'Content-Security-Policy': `
        default-src 'self';
        script-src 'self' 'unsafe-eval' 'unsafe-inline';
        style-src 'self' 'unsafe-inline';
        img-src 'self' blob: data: https:;
        font-src 'self';
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
        block-all-mixed-content;
        upgrade-insecure-requests;
      `.replace(/\s+/g, ' ').trim(),
    };

    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Specify which routes to protect
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/moderator/:path*',
    '/profile/:path*',
    '/api/:path*',
  ],
};
