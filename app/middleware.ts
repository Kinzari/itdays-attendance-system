import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('authToken'); // Check for the auth token in the cookies

  // Define the protected routes
  const protectedRoutes = ['/attendance', '/dashboard', '/qrcodescan'];

  // If the user is not logged in and trying to access a protected route, redirect to login
  if (!authToken && protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/login', request.url)); // Redirect to login
  }

  return NextResponse.next(); // Allow the request to proceed if authenticated
}

// Apply the middleware to the desired routes
export const config = {
  matcher: ['/attendance', '/dashboard', '/qrcodescan'], // Protect specific routes
};
