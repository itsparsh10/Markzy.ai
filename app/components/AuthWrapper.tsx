'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AuthenticatedLayout from './AuthenticatedLayout';

interface AuthWrapperProps {
  children: React.ReactNode;
}

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/contact-us',
  '/terms',
  '/privacy',
  '/forgot-password'
];

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      // If current route is public, allow access immediately without loading
      if (publicRoutes.includes(pathname)) {
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      // For protected routes, check authentication
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');

      if (token && userData) {
        setIsAuthenticated(true);
      } else {
        // Redirect to login with return URL
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  // Show loading spinner only for protected routes while checking authentication
  if (isLoading && !publicRoutes.includes(pathname)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1d1f89] to-[#46adb6] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and not on a public route, don't render children
  if (!isAuthenticated && !publicRoutes.includes(pathname)) {
    return null;
  }

  // For authenticated users on protected routes, wrap with AuthenticatedLayout
  if (isAuthenticated && !publicRoutes.includes(pathname)) {
    return (
      <AuthenticatedLayout>
        {children}
      </AuthenticatedLayout>
    );
  }

  // For public routes, render children without layout
  return <>{children}</>;
}
