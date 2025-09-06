"use client";

import React, { useEffect, useState, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPopup, setIsPopup] = useState(false);

  useEffect(() => {
    // Check if this is a popup window (only available on client side)
    setIsPopup(typeof window !== 'undefined' && window.opener !== null);
    
    // Get payment details from URL parameters
    const sessionId = searchParams.get('session_id');
    const planName = searchParams.get('plan_name');
    const planId = searchParams.get('plan_id');
    
    // Store payment success data in localStorage for the upgrade page
    if (sessionId) {
      // Verify payment with server
      verifyPaymentWithServer(sessionId, planId || 'unknown', planName || 'Unknown Plan');
      
      const paymentData = {
        sessionId,
        planName: planName || 'Unknown Plan',
        planId: planId || 'unknown',
        status: 'completed',
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('paymentSuccess', JSON.stringify(paymentData));
      
      // Trigger storage event for parent window
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'paymentSuccess',
          newValue: JSON.stringify(paymentData)
        }));
      }
    }

    // Close popup window after 2 seconds and redirect parent
    const timer = setTimeout(() => {
      // Check if this is a popup window
      if (typeof window !== 'undefined' && window.opener) {
        // Close the popup
        window.close();
      } else {
        // If not a popup, redirect to upgrade-account page
        router.push('/upgrade-account?payment=success');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [router, searchParams]);
  
  const verifyPaymentWithServer = useCallback(async (sessionId: string, planId: string, planName: string) => {
    try {
      // Get amount from URL parameters or use default
      const amount = searchParams.get('amount') || '0';
      
      // Get authorization token from localStorage or cookie
      const token = localStorage.getItem('authToken') || 
                   document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1] ||
                   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzUyNTE5MzgzLCJpYXQiOjE3NTI1MTU3ODMsImp0aSI6IjlmYWRhYjhhZDA0YTRkZmRiNTFlMWFmMTNkOTE4ZjQyIiwidXNlcl9pZCI6Nn0.Q3S-0x46ZdEAqWMFTRqyvV2eXY7zc9jB1XrnKnsRf_g';
      
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          sessionId,
          planId,
          planName,
          amount: parseFloat(amount)
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Payment verified with server:', data);
      } else {
        console.error('Failed to verify payment with server');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fas fa-check text-3xl text-green-600"></i>
        </div>
        
        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Payment Successful! 🎉</h1>
        <p className="text-gray-600 mb-6">
          Thank you for upgrading your account! Your subscription has been activated and you now have access to all premium features.
        </p>
        
        {/* Features List */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-3">What's Next?</h3>
          <ul className="text-sm text-blue-700 space-y-2">
            <li className="flex items-center gap-2">
              <i className="fas fa-check text-green-500"></i>
              Access to all premium tools
            </li>
            <li className="flex items-center gap-2">
              <i className="fas fa-check text-green-500"></i>
              Unlimited AI content generation
            </li>
            <li className="flex items-center gap-2">
              <i className="fas fa-check text-green-500"></i>
              Priority customer support
            </li>
          </ul>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-3">
          <button 
            onClick={() => {
              if (typeof window !== 'undefined' && window.opener) {
                // If popup, close and let parent handle the redirect
                window.close();
              } else {
                router.push('/upgrade-account?payment=success');
              }
            }}
            className="block w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            <i className="fas fa-crown mr-2"></i>
            {isPopup ? 'Close & Continue' : 'View My Plan'}
          </button>
          
          <button 
            onClick={() => {
              if (typeof window !== 'undefined' && window.opener) {
                window.close();
              } else {
                router.push('/dashboard');
              }
            }}
            className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {isPopup ? 'Close Window' : 'Go to Dashboard'}
          </button>
          
          <button 
            onClick={() => {
              if (typeof window !== 'undefined' && window.opener) {
                window.close();
              } else {
                router.push('/all-tools');
              }
            }}
            className="block w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            {isPopup ? 'Close & Explore' : 'Explore All Tools'}
          </button>
        </div>
        
        {/* Auto-redirect notice */}
        <p className="text-xs text-gray-500 mt-4">
          Redirecting to your plan details in 3 seconds...
        </p>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>
  );
}

export default function Success() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SuccessContent />
    </Suspense>
  );
} 