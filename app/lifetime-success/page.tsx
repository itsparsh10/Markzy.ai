"use client";

import React, { useEffect, useState, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LifetimeSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentData, setPaymentData] = useState<any>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Auto-redirect timer state
  const [redirectTimer, setRedirectTimer] = useState(4);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);

  useEffect(() => {
    // Set client flag to prevent hydration mismatch
    setIsClient(true);
    
    // Get payment details from URL parameters
    const sessionId = searchParams.get('session_id');
    const planName = searchParams.get('plan_name');
    const planId = searchParams.get('plan_id');
    
    if (sessionId) {
      // Verify payment with server
      verifyPaymentWithServer(sessionId, planId || 'lifetime', planName || 'Lifetime Plan');
      
      const data = {
        sessionId,
        planName: planName || 'Lifetime Plan',
        planId: planId || 'lifetime',
        status: 'completed',
        timestamp: new Date().toISOString()
      };
      
      setPaymentData(data);
      localStorage.setItem('lifetimePaymentSuccess', JSON.stringify(data));
      
      // Trigger storage event for parent window
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'lifetimePaymentSuccess',
        newValue: JSON.stringify(data)
      }));
    }

    // Start confetti after component mounts on client
    setShowConfetti(true);
    
    // Stop confetti after 5 seconds
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    // Start redirect timer after 1 second to allow user to see the success message
    const redirectDelay = setTimeout(() => {
      setShowRedirectMessage(true);
      startRedirectTimer();
    }, 1000);

    return () => {
      clearTimeout(confettiTimer);
      clearTimeout(redirectDelay);
    };
  }, [searchParams]);

  // Redirect timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (showRedirectMessage && redirectTimer > 0) {
      timer = setTimeout(() => {
        setRedirectTimer(prev => prev - 1);
      }, 1000);
    } else if (showRedirectMessage && redirectTimer === 0) {
      // Auto-redirect to user account after timer reaches 0
      setIsRedirecting(true);
      setTimeout(() => {
        window.location.href = '/account';
      }, 500);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showRedirectMessage, redirectTimer]);

  const startRedirectTimer = () => {
    setRedirectTimer(4); // Start with 4 seconds
  };

  const verifyPaymentWithServer = useCallback(async (sessionId: string, planId: string, planName: string) => {
    try {
      // Get amount from URL parameters or use default for lifetime
      const amount = searchParams.get('amount') || '997';
      
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
        console.log('Lifetime payment verified with server:', data);
      } else {
        console.error('Failed to verify lifetime payment with server');
      }
    } catch (error) {
      console.error('Error verifying lifetime payment:', error);
    }
  }, [searchParams]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Confetti Effect - Only render on client to prevent hydration mismatch */}
      {isClient && showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      )}

      {/* Redirect Message Overlay */}
      {showRedirectMessage && (
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-xl shadow-2xl border border-white/20 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <i className="fas fa-clock text-sm"></i>
            </div>
            <div>
              <p className="text-sm font-medium">
                {isRedirecting ? (
                  <span className="flex items-center gap-2">
                    <i className="fas fa-spinner fa-spin"></i>
                    Redirecting to account...
                  </span>
                ) : (
                  `Redirecting to account in ${redirectTimer} seconds...`
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl animate-pulse">
              <i className="fas fa-crown text-6xl text-white"></i>
            </div>
            
            <h1 className="text-6xl font-bold text-white mb-4 animate-fade-in">
              🎉 LIFETIME ACCESS GRANTED! 🎉
            </h1>
            
            <p className="text-2xl text-yellow-200 mb-8 animate-fade-in-delay">
              Welcome to the exclusive lifetime membership club!
            </p>
          </div>

          {/* Success Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-white/20 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Payment Details */}
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white mb-6">Payment Confirmed</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                    <span className="text-yellow-200 font-medium">Plan</span>
                    <span className="text-white font-bold text-lg">{paymentData?.planName || 'Lifetime Plan'}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                    <span className="text-yellow-200 font-medium">Status</span>
                    <span className="text-green-400 font-bold text-lg">✓ ACTIVE</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                    <span className="text-yellow-200 font-medium">Duration</span>
                    <span className="text-white font-bold text-lg">LIFETIME</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                    <span className="text-yellow-200 font-medium">Activated</span>
                    <span className="text-white font-bold text-lg">{formatDate(paymentData?.timestamp || new Date().toISOString())}</span>
                  </div>
                </div>
              </div>

              {/* Lifetime Benefits */}
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white mb-6">Your Lifetime Benefits</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 rounded-xl border border-yellow-400/30">
                    <i className="fas fa-infinity text-2xl text-yellow-400 mt-1"></i>
                    <div>
                      <h3 className="text-white font-bold text-lg">Unlimited Access</h3>
                      <p className="text-yellow-200">All tools and features forever</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-400/20 to-purple-600/20 rounded-xl border border-purple-400/30">
                    <i className="fas fa-rocket text-2xl text-purple-400 mt-1"></i>
                    <div>
                      <h3 className="text-white font-bold text-lg">Future Updates</h3>
                      <p className="text-purple-200">All new features included</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-400/20 to-blue-600/20 rounded-xl border border-blue-400/30">
                    <i className="fas fa-star text-2xl text-blue-400 mt-1"></i>
                    <div>
                      <h3 className="text-white font-bold text-lg">VIP Support</h3>
                      <p className="text-blue-200">Priority customer service</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-xl border border-green-400/30">
                    <i className="fas fa-shield-alt text-2xl text-green-400 mt-1"></i>
                    <div>
                      <h3 className="text-white font-bold text-lg">No Expiry</h3>
                      <p className="text-green-200">Never pay again</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="group relative overflow-hidden bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-4 px-8 rounded-xl text-lg hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/50"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <i className="fas fa-tachometer-alt"></i>
                Go to Dashboard
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
            
            <button 
              onClick={() => window.location.href = '/all-tools'}
              className="group relative overflow-hidden bg-gradient-to-r from-purple-400 to-purple-600 text-white font-bold py-4 px-8 rounded-xl text-lg hover:from-purple-500 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-purple-500/50"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <i className="fas fa-magic"></i>
                Explore All Tools
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-300 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
            
            <button 
              onClick={() => window.location.href = '/account'}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold py-4 px-8 rounded-xl text-lg hover:from-blue-500 hover:to-blue-700 transition-all duration-300 shadow-2xl hover:shadow-blue-500/50"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <i className="fas fa-user-circle"></i>
                My Account
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
          </div>

          {/* Welcome Message */}
          <div className="mt-12 text-center">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-4">Welcome to the Family! 👑</h3>
              <p className="text-yellow-200 text-lg leading-relaxed">
                You've just made one of the best investments in your business. 
                Your lifetime access is now active and you'll never have to pay again. 
                Start creating amazing content and grow your business with unlimited AI-powered tools!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-bounce">
        <i className="fas fa-crown text-4xl text-yellow-400"></i>
      </div>
      <div className="absolute top-40 right-20 animate-bounce delay-1000">
        <i className="fas fa-star text-3xl text-purple-400"></i>
      </div>
      <div className="absolute bottom-40 left-20 animate-bounce delay-2000">
        <i className="fas fa-gem text-4xl text-blue-400"></i>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>
  );
}

export default function LifetimeSuccess() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LifetimeSuccessContent />
    </Suspense>
  );
} 