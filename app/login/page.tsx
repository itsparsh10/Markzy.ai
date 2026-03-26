'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = '/all-tools';
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Check if user is already logged in, redirect appropriately
  useEffect(() => {
    router.prefetch('/all-tools');
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      // Check if it's an admin token
      if (token.startsWith('admin-token-')) {
        router.replace('/admin_dashboard');
      } else {
        router.replace(redirectUrl);
      }
    }
  }, [router, redirectUrl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Check for hardcoded admin credentials
    if (formData.email === 'admin@gmail.com' && formData.password === 'Hello*123') {
      try {
        // Create admin user data
        const adminUser = {
          id: 'admin-001',
          email: 'admin@gmail.com',
          name: 'Admin User',
          role: 'admin'
        };
        
        // Create a mock token for admin
        const adminToken = 'admin-token-' + Date.now();
        
        // Store admin data
        localStorage.setItem('authToken', adminToken);
        localStorage.setItem('userData', JSON.stringify(adminUser));
        
        // Clear logout timestamp since user is now logged in
        localStorage.removeItem('lastLogout');
        
        // Set cookie for middleware authentication
        document.cookie = `authToken=${adminToken}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
        
        // Show success notification
        toast.success('🎉 Welcome Admin! Redirecting to admin dashboard...', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          toastId: 'admin-login-success',
        });
        
        // Redirect immediately for faster login UX
        router.replace('/admin_dashboard');
        return;
      } catch (error) {
        console.error('Admin login error:', error);
        setError('Admin login failed. Please try again.');
        toast.error('Admin login failed. Please try again.', {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    // Regular user login
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data in localStorage and set cookie for middleware
        localStorage.setItem('authToken', data.access);
        localStorage.setItem('userData', JSON.stringify(data.user));
        
        // Clear logout timestamp since user is now logged in
        localStorage.removeItem('lastLogout');
        
        // Set cookie for middleware authentication
        document.cookie = `authToken=${data.access}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
        
        // Show success notification
        toast.success('🎉 Welcome back! Login successful.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          toastId: 'login-success',
        });
        
        // Redirect immediately for faster login UX
        router.replace(redirectUrl);
      } else {
        const errorMessage = data.message || 'Invalid email or password. Please try again.';
        setError(errorMessage);
        
        // Show error notification
        toast.error(`${errorMessage}`, {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          toastId: 'login-error',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = 'An error occurred during login. Please try again.';
      setError(errorMessage);
      
      // Show error notification
      toast.error(`${errorMessage}`, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        toastId: 'login-error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center relative overflow-hidden">
      {/* Back Button */}
      <Link href="/" className="absolute top-6 left-6 z-10">
        <button className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-200 group">
          <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform duration-200"></i>
          <span className="text-sm font-medium">Back to Home</span>
        </button>
      </Link>

      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md relative">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image 
              src="/assets/images/logo2.png" 
              alt="Markzy Logo" 
              width={120}
              height={48}
              className="h-12 w-auto invert brightness-0" 
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-blue-100">Sign in to your Markzy account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all backdrop-blur-sm"
                  placeholder="Enter your email"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <i className="fas fa-envelope text-white/40"></i>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all backdrop-blur-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white/60 transition-colors"
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-sm text-blue-200 hover:text-white transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-100 px-4 py-3 rounded-lg relative" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
                <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                  <button onClick={() => setError('')} className="text-red-100">
                    <i className="fas fa-times"></i>
                  </button>
                </span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white hover:bg-white/90 text-blue-700 font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <i className="fas fa-arrow-right"></i>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-white/60">Or continue with</span>
              </div>
            </div>
          </form>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-white/80">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-blue-200 hover:text-white font-medium transition-colors">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-blue-200 text-sm">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-white transition-colors">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LoginForm />
    </Suspense>
  );
}
