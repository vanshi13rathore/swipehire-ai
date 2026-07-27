import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT = 50; // Requests per minute
const WINDOW_MS = 60 * 1000;

const protectedRoutes = [
  '/profile',
  '/resume',
  '/dashboard',
  '/applications',
  '/saved-jobs',
  '/career-copilot',
  '/mock-interview'
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rate Limiting for API routes
  if (pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now - entry.timestamp > WINDOW_MS) {
      rateLimitMap.set(ip, { count: 1, timestamp: now });
    } else {
      if (entry.count >= RATE_LIMIT) {
        return new NextResponse("Too Many Requests", { status: 429 });
      }
      entry.count++;
    }
  }

  // Auth guards using Supabase SSR
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  
  const { supabaseResponse, user, supabase } = await updateSession(request);

  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Missing Profile Guard
  if (user && isProtectedRoute && pathname !== '/profile') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_complete')
      .eq('id', user.id)
      .single();

    if (!profile?.is_complete) {
      return NextResponse.redirect(new URL('/profile', request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
