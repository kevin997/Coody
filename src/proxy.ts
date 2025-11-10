import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect specific routes that need authentication
  const protectedRoutes = ['/mes-cours', '/cours'];
  
  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Let public routes through
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // For protected routes, check for session token
  const token = req.cookies.get('next-auth.session-token') || 
                req.cookies.get('__Secure-next-auth.session-token');

  if (!token) {
    const loginUrl = new URL('/connexion', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/mes-cours/:path*', '/cours/:path*'],
};
