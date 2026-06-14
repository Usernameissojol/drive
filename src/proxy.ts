import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const session = request.cookies.get('auth_session');
  const { pathname } = request.nextUrl;

  // 1. Root route redirect
  if (pathname === '/') {
    if (session) {
      try {
        const user = JSON.parse(session.value);
        if (user.role === 'admin') {
          return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        } else {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      } catch (e) {
        // If session parse fails, let them view the landing page
      }
    }
    // If no session, allow the user to view the default home/landing page
  }

  // 2. Protect admin routes (anything starting with /admin, except /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    try {
      const user = JSON.parse(session.value);
      if (user.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // 3. Protect standard user routes
  const protectedUserRoutes = ['/dashboard', '/add', '/files', '/history', '/settings', '/api-docs'];
  const isProtectedUser = protectedUserRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  if (isProtectedUser) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    try {
      const user = JSON.parse(session.value);
      if (user.role === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 4. Redirect logged-in users away from auth pages
  if ((pathname === '/login' || pathname === '/register') && session) {
    try {
      const user = JSON.parse(session.value);
      if (user.role === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      } else {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch {
      // ignore
    }
  }

  if (pathname === '/admin/login' && session) {
    try {
      const user = JSON.parse(session.value);
      if (user.role === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    } catch {
      // ignore
    }
  }

  return NextResponse.next();
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
