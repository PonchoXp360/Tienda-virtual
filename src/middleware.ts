import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    const sessionToken =
      request.cookies.get('better-auth.session_token')?.value ||
      request.cookies.get('__Secure-better-auth.session_token')?.value;

    if (!sessionToken) {
      return NextResponse.redirect(new URL('/login?redirect=/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
