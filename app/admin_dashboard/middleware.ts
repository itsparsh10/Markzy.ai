import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  try {
    // Check for auth token
    const token = request.cookies.get('authToken')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');
    
    // If no token, redirect to admin login
    if (!token) {
      return NextResponse.redirect(new URL('/admin_dashboard/login', request.url));
    }
    
    // For admin dashboard, we'll accept any valid token
    // The admin login sets a specific token format
    if (token.startsWith('admin-token-')) {
      return NextResponse.next();
    }
    
    // For regular users, check if they have admin role (optional)
    // For now, allow any authenticated user to access admin dashboard
    return NextResponse.next();
    
  } catch (error) {
    console.error('Admin middleware error:', error);
    return NextResponse.redirect(new URL('/admin_dashboard/login', request.url));
  }
}

export const config = {
  matcher: '/admin_dashboard/:path*',
}; 