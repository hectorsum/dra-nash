import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('auth-token')?.value;
  const { pathname } = req.nextUrl;

  // Protect patient routes
  if (pathname.startsWith('/patient')) {
    if (!token) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
      
      // Check if user has PATIENT role
      if (payload.role !== 'PATIENT') {
        return NextResponse.redirect(new URL('/doctor/dashboard', req.url));
      }
      
      return NextResponse.next();
    } catch (error) {
      // Invalid token
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('from', pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('auth-token');
      return response;
    }
  }

  // Protect doctor routes
  if (pathname.startsWith('/doctor')) {
    if (!token) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
      
      // Check if user has DOCTOR role
      if (payload.role !== 'DOCTOR') {
        return NextResponse.redirect(new URL('/patient/dashboard', req.url));
      }
      
      return NextResponse.next();
    } catch (error) {
      // Invalid token
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('from', pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('auth-token');
      return response;
    }
  }

  // Protect /book route (keep for patients only)
  if (pathname.startsWith('/book')) {
    if (!token) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
      
      // Only patients can book
      if (payload.role !== 'PATIENT') {
        return NextResponse.redirect(new URL('/doctor/dashboard', req.url));
      }
      
      return NextResponse.next();
    } catch (error) {
      // Invalid token
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('from', pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('auth-token');
      return response;
    }
  }

  // Redirect authenticated users away from auth pages
  if (pathname === '/login' || pathname === '/signup') {
    if (token) {
      try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
        
        // Redirect to appropriate dashboard based on role
        const dashboardUrl = payload.role === 'DOCTOR' ? '/doctor/dashboard' : '/patient/dashboard';
        return NextResponse.redirect(new URL(dashboardUrl, req.url));
      } catch (error) {
        // Token invalid, let them stay on login/signup
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/book/:path*', '/login', '/signup', '/patient/:path*', '/doctor/:path*'],
};
