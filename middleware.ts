import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Always allow static assets (images, CSS, JS, etc.)
  if (
    pathname.startsWith('/assets/') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }
  
  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/contact-us',
    '/help-center',
    '/rate-us',
    '/commercial',
    '/terms',
    '/privacy',
    '/forgot-password'
  ]
  
  // API routes that don't require authentication
  const publicApiRoutes = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/webhooks'
  ]
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.includes(pathname) || 
                       publicApiRoutes.some(route => pathname.startsWith(route))
  
  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next()
  }
  
  // For protected routes, check authentication
  const authToken = request.cookies.get('authToken')?.value || 
                   request.headers.get('authorization')?.replace('Bearer ', '')
  
  // If no auth token is found, redirect to login
  if (!authToken) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // If token exists, allow access (you can add token validation here if needed)
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets (public assets)
     * - images (public images)
     * Also exclude files with extensions
     */
    '/((?!api|_next/static|_next/image|favicon.ico|assets|images|.*\\.).*)',
  ],
} 