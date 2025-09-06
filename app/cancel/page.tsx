"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Cancel() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect to upgrade page after 5 seconds
    const timer = setTimeout(() => {
      router.push('/upgrade-account');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Cancel Icon */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fas fa-times text-3xl text-red-600"></i>
        </div>
        
        {/* Cancel Message */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Payment Cancelled ❌</h1>
        <p className="text-gray-600 mb-6">
          Your payment was cancelled. Don't worry, you can try again anytime. Your account remains unchanged.
        </p>
        
        {/* Why Upgrade */}
        <div className="bg-orange-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-orange-800 mb-3">Why Upgrade?</h3>
          <ul className="text-sm text-orange-700 space-y-2">
            <li className="flex items-center gap-2">
              <i className="fas fa-star text-orange-500"></i>
              Access to 60+ AI-powered tools
            </li>
            <li className="flex items-center gap-2">
              <i className="fas fa-star text-orange-500"></i>
              Save 40+ hours per month
            </li>
            <li className="flex items-center gap-2">
              <i className="fas fa-star text-orange-500"></i>
              Professional marketing materials
            </li>
          </ul>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-3">
          <Link 
            href="/upgrade-account"
            className="block w-full bg-orange-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-700 transition-colors"
          >
            Try Again
          </Link>
          
          <Link 
            href="/account"
            className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <i className="fas fa-user-circle mr-2"></i>
            Check My Account
          </Link>
          
          <Link 
            href="/dashboard"
            className="block w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
        
        {/* Support */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">Need help?</p>
          <Link 
            href="/contact-us"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Contact Support
          </Link>
        </div>
        
        {/* Auto-redirect notice */}
        <p className="text-xs text-gray-500 mt-4">
          Redirecting to upgrade page in 5 seconds...
        </p>
      </div>
    </div>
  );
} 