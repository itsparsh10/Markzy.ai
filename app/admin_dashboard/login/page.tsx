'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token && token.startsWith('admin-token-')) {
      router.push('/admin_dashboard');
    }
  }, [router]);

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
    if (formData.email === '7977732099' && formData.password === 'asdfghjkl') {
      try {
        // Create admin user data
        const adminUser = {
          id: 'admin-001',
          email: 'admin@markzy.ai',
          name: 'Admin User',
          role: 'admin'
        };
        
        // Create a mock token for admin
        const adminToken = 'admin-token-' + Date.now();
        
        // Store admin data
        localStorage.setItem('authToken', adminToken);
        localStorage.setItem('userData', JSON.stringify(adminUser));
        
        // Set cookie for middleware authentication
        document.cookie = `authToken=${adminToken}; path=/; max-age=86400; secure; samesite=strict`;
        
        // Force immediate redirect
        window.location.href = '/admin_dashboard';
        return;
      } catch (error) {
        console.error('Admin login error:', error);
        setError('Login failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
    
    // If not admin credentials, try regular login
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Check if user is admin (for now, allow any authenticated user)
        localStorage.setItem('authToken', data.access);
        localStorage.setItem('userData', JSON.stringify(data.user));
        
        // Set cookie for middleware authentication
        document.cookie = `authToken=${data.access}; path=/; max-age=86400; secure; samesite=strict`;
        
        // Force immediate redirect
        window.location.href = '/admin_dashboard';
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
            <i className="fas fa-shield-alt text-white text-xl"></i>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Admin Access
          </h2>
          <p className="mt-2 text-sm text-purple-200">
            Sign in to access the admin dashboard
          </p>
          <div className="mt-4 p-3 bg-purple-500/20 border border-purple-400/30 rounded-lg">
            <p className="text-xs text-purple-200">
              <strong>Admin Credentials:</strong><br/>
              ID: <code className="bg-purple-600/30 px-1 rounded">7977732099</code><br/>
              Password: <code className="bg-purple-600/30 px-1 rounded">asdfghjkl</code>
            </p>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-xl rounded-lg border border-white/20 p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Admin ID / Email
              </label>
              <input
                id="email"
                name="email"
                type="text"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                placeholder="7977732099"
                autoComplete="username"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Admin Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                placeholder="asdfghjkl"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-100 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-purple-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-700 mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in to Admin Dashboard'
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link 
              href="/login" 
              className="text-purple-200 hover:text-white text-sm"
            >
              ← Back to regular login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 