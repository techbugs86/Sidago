import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/landing'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoggedIn = request.cookies.get('auth')?.value === 'true';
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  // Not logged in and trying to access a protected page → redirect to landing
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL('/landing', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
