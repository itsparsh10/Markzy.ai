"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51RmFMN093NmKUNibcfB22xhdQxEJrPH13527ITxdVqXSaHtCyrN3pmn8tUsEiM9pf0vLSf1ZICcDdQUDNcZ3tVDF00QQsi899l');

interface Plan {
  id: string;
  name: string;
  originalPrice: number;
  price: number;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
  color: string;
}

export default function UpgradeAccount() {
  // State for countdown timer
  const [countdown, setCountdown] = useState({
    days: 6,
    hours: 23,
    minutes: 59,
    seconds: 59
  });
  
  // State for loading payment
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // State for payment success
  const [paymentSuccess, setPaymentSuccess] = useState<any>(null);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [paymentSuccessTimer, setPaymentSuccessTimer] = useState(7);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // State for membership status
  const [membershipStatus, setMembershipStatus] = useState<any>(null);
  const [loadingMembership, setLoadingMembership] = useState(true);
  
  // State for subscription validation
  const [subscriptionValidation, setSubscriptionValidation] = useState<{
    isValid: boolean;
    message: string;
    canUpgrade: boolean;
  }>({
    isValid: true,
    message: '',
    canUpgrade: false
  });
  
  // Check for payment success and membership status on component mount
  useEffect(() => {
    // Check URL parameters for payment success
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    
    if (paymentStatus === 'success') {
      // Get payment data from localStorage
      const paymentData = localStorage.getItem('paymentSuccess');
      const lifetimePaymentData = localStorage.getItem('lifetimePaymentSuccess');
      
      if (lifetimePaymentData) {
        // Lifetime payment completed
        const parsedData = JSON.parse(lifetimePaymentData);
        setPaymentSuccess(parsedData);
        setShowPaymentSuccess(true);
        localStorage.removeItem('lifetimePaymentSuccess');
        startPaymentSuccessTimer();
      } else if (paymentData) {
        const parsedData = JSON.parse(paymentData);
        setPaymentSuccess(parsedData);
        setShowPaymentSuccess(true);
        localStorage.removeItem('paymentSuccess');
        startPaymentSuccessTimer();
      }
    }
    
    // Check membership status
    checkMembershipStatus();
  }, []);
  
  // Payment success timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (showPaymentSuccess && paymentSuccessTimer > 0) {
      timer = setTimeout(() => {
        setPaymentSuccessTimer(prev => prev - 1);
      }, 1000);
    } else if (showPaymentSuccess && paymentSuccessTimer === 0) {
      // Auto-redirect to user profile after 7 seconds
      setIsRedirecting(true);
      setTimeout(() => {
        window.location.href = '/account';
      }, 500);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showPaymentSuccess, paymentSuccessTimer]);
  
  const startPaymentSuccessTimer = () => {
    setPaymentSuccessTimer(7);
  };
  
  const checkMembershipStatus = async () => {
    try {
      setLoadingMembership(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setLoadingMembership(false);
        return;
      }
      
      const response = await fetch('/api/user/membership', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMembershipStatus(data.data);
      }
    } catch (error) {
      console.error('Error checking membership status:', error);
    } finally {
      setLoadingMembership(false);
    }
  };

  // Validate subscription before payment
  const validateSubscription = (planId: string): boolean => {
    if (!membershipStatus) return true;
    
    // If user has no active subscription, they can buy any plan
    if (!membershipStatus.hasActiveSubscription) {
      setSubscriptionValidation({
        isValid: true,
        message: '',
        canUpgrade: false
      });
      return true;
    }
    
    // Check if user already has the same plan
    const currentPlan = membershipStatus.planName?.toLowerCase();
    const selectedPlan = planId.toLowerCase();
    
    if (currentPlan === selectedPlan) {
      setSubscriptionValidation({
        isValid: false,
        message: `You already have an active ${membershipStatus.planName} subscription. You can only upgrade to a higher tier.`,
        canUpgrade: false
      });
      return false;
    }
    
    // Check if user is trying to downgrade
    const planHierarchy = {
      'small-business': 1,
      'entrepreneur': 2,
      'lifetime': 3
    };
    
    const currentPlanLevel = planHierarchy[currentPlan as keyof typeof planHierarchy] || 0;
    const selectedPlanLevel = planHierarchy[selectedPlan as keyof typeof planHierarchy] || 0;
    
    if (selectedPlanLevel < currentPlanLevel) {
      setSubscriptionValidation({
        isValid: false,
        message: `You cannot downgrade from ${membershipStatus.planName} to ${planId}. You can only upgrade to a higher tier.`,
        canUpgrade: false
      });
      return false;
    }
    
    // Valid upgrade
    setSubscriptionValidation({
      isValid: true,
      message: `You can upgrade from ${membershipStatus.planName} to ${planId}.`,
      canUpgrade: true
    });
    return true;
  };

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prevState => {
        // Calculate new countdown values
        let { days, hours, minutes, seconds } = prevState;
        
        if (seconds > 0) {
          seconds -= 1;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes -= 1;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours -= 1;
            } else {
              hours = 23;
              if (days > 0) {
                days -= 1;
              } else {
                // Time's up
                clearInterval(timer);
              }
            }
          }
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Plans data
  const plans: Plan[] = [
    {
      id: 'small-business',
      name: 'Free',
      originalPrice: 39,
      price: 0,
      period: 'free forever',
      description: 'Perfect for getting started with AI marketing',
      features: [
        '5 AI-generated contents per month',
        '3 marketing tools access', 
        'Basic templates',
        'Community support',
        'Export to PDF/Word'
      ],
      popular: false,
      color: 'blue'
    },
    {
      id: 'entrepreneur',
      name: 'Pro',
      originalPrice: 69,
      price: 19.99,
      period: 'monthly',
      description: 'Everything you need to scale your marketing',
      features: [
        'Unlimited AI-generated content',
        'All 100+ marketing tools',
        'Premium templates', 
        'Priority email support',
        'Advanced analytics',
        'Team collaboration (5 members)',
        'Custom branding',
        'API access'
      ],
      popular: true,
      color: 'blue'
    },
    {
      id: 'lifetime',
      name: 'Enterprise',
      originalPrice: 1997,
      price: 199,
      period: 'one-time payment',
      description: 'Advanced features for growing teams',
      features: [
        'Everything in Pro',
        'Unlimited team members',
        'White-label solutions',
        'Dedicated account manager', 
        '24/7 phone support',
        'Custom integrations',
        'Advanced reporting',
        'SLA guarantee'
      ],
      popular: false,
      color: 'gold'
    }
  ];
  
  // Selected plan for potential modal or highlight
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  // Handle Stripe payment with enhanced error handling and subscription validation
  const handleStripePayment = async (plan: Plan) => {
    try {
      // Clear previous validation messages
      setSubscriptionValidation({
        isValid: true,
        message: '',
        canUpgrade: false
      });
      
      // Validate subscription before proceeding
      if (!validateSubscription(plan.id)) {
        setErrorMessage(subscriptionValidation.message);
        return;
      }
      
      setIsProcessingPayment(true);
      setProcessingPlan(plan.id);
      setErrorMessage(null);
      
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load. Please refresh the page and try again.');
      }

      // Get user data from localStorage - but only use it if no auth token exists
      const userData = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('userData') || '{}') : {};
      const authToken = localStorage.getItem('authToken');
      
      console.log('Payment request user data:', {
        userData: userData,
        hasAuthToken: !!authToken,
        authTokenLength: authToken?.length,
        userDataId: userData.id,
        userDataEmail: userData.email
      });
      
      // CRITICAL FIX: If user is authenticated, don't send localStorage data that could be from previous users
      const requestBody: any = {
        planName: plan.name,
        description: plan.description,
        amount: plan.price,
        origin: window.location.origin,
        planId: plan.id,
      };
      
      // Only include localStorage user data if no auth token (for guest/anonymous users)
      if (!authToken) {
        requestBody.userId = userData.id || 'anonymous';
        requestBody.customerEmail = userData.email || undefined;
        console.log('No auth token - including localStorage user data');
      } else {
        console.log('Auth token present - letting server use authenticated user data only');
      }
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to create checkout session');
      }

      if (data.sessionId) {
        // Open Stripe checkout in a new window/tab
        const checkoutWindow = window.open(data.url, '_blank', 'width=500,height=700,scrollbars=yes,resizable=yes');
        
        if (!checkoutWindow) {
          throw new Error('Please allow popups for this site to complete your payment.');
        }
        
        // Listen for the window to close or redirect
        const checkWindowClosed = setInterval(() => {
          if (checkoutWindow.closed) {
            clearInterval(checkWindowClosed);
            // Check if payment was successful by looking for success data
            setTimeout(() => {
              const paymentData = localStorage.getItem('paymentSuccess');
              const lifetimePaymentData = localStorage.getItem('lifetimePaymentSuccess');
              
              if (lifetimePaymentData) {
                // Lifetime payment completed - redirect to lifetime success page
                window.location.href = '/lifetime-success?payment=success';
                localStorage.removeItem('lifetimePaymentSuccess');
              } else if (paymentData) {
                const parsedData = JSON.parse(paymentData);
                setPaymentSuccess(parsedData);
                setShowPaymentSuccess(true);
                localStorage.removeItem('paymentSuccess');
                startPaymentSuccessTimer();
              }
            }, 1000);
          }
        }, 1000);
        
        // Also listen for storage events (when success page updates localStorage)
        const handleStorageChange = (e: StorageEvent) => {
          if (e.key === 'lifetimePaymentSuccess' && e.newValue) {
            // Lifetime payment completed - redirect to lifetime success page
            window.location.href = '/lifetime-success?payment=success';
            localStorage.removeItem('lifetimePaymentSuccess');
            window.removeEventListener('storage', handleStorageChange);
          } else if (e.key === 'paymentSuccess' && e.newValue) {
            const parsedData = JSON.parse(e.newValue);
            setPaymentSuccess(parsedData);
            setShowPaymentSuccess(true);
            localStorage.removeItem('paymentSuccess');
            startPaymentSuccessTimer();
            window.removeEventListener('storage', handleStorageChange);
          }
        };
        
        window.addEventListener('storage', handleStorageChange);
        
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setErrorMessage(errorMessage);
      
      // Show error alert
      alert(`Payment failed: ${errorMessage}`);
    } finally {
      setIsProcessingPayment(false);
      setProcessingPlan(null);
    }
  };

  // Clear error message when user starts a new action
  const clearError = () => {
    setErrorMessage(null);
    setSubscriptionValidation({
      isValid: true,
      message: '',
      canUpgrade: false
    });
  };
  
  return (
    <div className="h-full w-full flex overflow-hidden bg-gray-50">
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Fixed Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl flex items-center justify-center shadow-md">
              <i className="fas fa-crown text-white text-lg"></i>
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-800">Upgrade Your Account</h1>
              <p className="text-xs text-gray-500">Unlock the full power of Markzy</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
              <i className="fas fa-arrow-left mr-1"></i> Back to Dashboard
            </Link>
          </div>
        </header>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Membership Status Display */}
          {!loadingMembership && membershipStatus?.hasActiveSubscription && (
            <div className="bg-gradient-to-r from-green-600 to-green-500 text-white py-8 relative">
              <div className="max-w-6xl mx-auto px-4">
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fas fa-crown text-3xl text-white"></i>
                  </div>
                  
                  <h2 className="text-3xl font-bold mb-4">
                    {membershipStatus.planType === 'lifetime' ? 'Lifetime Membership Active' : 'Active Membership'}
                  </h2>
                  
                  <p className="text-xl mb-6">
                    {membershipStatus.planName}
                  </p>
                  
                  {membershipStatus.planType === 'lifetime' ? (
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
                      <div className="text-4xl font-bold mb-2">∞</div>
                      <div className="text-lg">Lifetime Access</div>
                      <div className="text-sm opacity-80">Never expires</div>
                    </div>
                  ) : (
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
                      <div className="text-4xl font-bold mb-2">{membershipStatus.remainingDays}</div>
                      <div className="text-lg">Days Remaining</div>
                      <div className="text-sm opacity-80">
                        Expires on {(() => {
                          const subscriptionDate = new Date(membershipStatus.subscriptionDate);
                          const expiryDate = new Date(subscriptionDate.getTime() + 30 * 24 * 60 * 60 * 1000);
                          return expiryDate.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          });
                        })()}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-8 flex justify-center gap-4">
                    <button 
                      onClick={() => window.location.href = '/dashboard'}
                      className="px-6 py-3 bg-white text-green-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                    >
                      Go to Dashboard
                    </button>
                    <button 
                      onClick={() => window.location.href = '/all-tools'}
                      className="px-6 py-3 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-colors"
                    >
                      Explore Tools
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Payment Success Banner with Timer */}
          {showPaymentSuccess && paymentSuccess && (
            <div className="bg-gradient-to-r from-green-600 to-green-500 text-white py-6 relative">
              <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <i className="fas fa-check text-2xl text-white"></i>
                  </div>
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Payment Completed Successfully! 🎉</h2>
                    <p className="text-green-100">
                      Your {paymentSuccess.planName} plan has been activated. 
                      {paymentSuccess.planId === 'lifetime' ? ' You now have lifetime access!' : ' Your subscription is active for 30 days.'}
                    </p>
                    <div className="mt-4 text-green-100">
                      {isRedirecting ? (
                        <span className="flex items-center gap-2">
                          <i className="fas fa-spinner fa-spin"></i>
                          Redirecting to profile...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <i className="fas fa-clock"></i>
                          Redirecting to profile in {paymentSuccessTimer} seconds...
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Plan Details */}
                <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4 max-w-md mx-auto">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-green-100 text-sm">Plan</p>
                      <p className="font-bold text-lg">{paymentSuccess.planName}</p>
                    </div>
                    <div>
                      <p className="text-green-100 text-sm">Status</p>
                      <p className="font-bold text-lg text-green-200">Active</p>
                    </div>
                    <div>
                      <p className="text-green-100 text-sm">Duration</p>
                      <p className="font-bold text-lg">
                        {paymentSuccess.planId === 'lifetime' ? 'Lifetime' : '30 Days'}
                      </p>
                    </div>
                    <div>
                      <p className="text-green-100 text-sm">Session ID</p>
                      <p className="font-bold text-xs">{paymentSuccess.sessionId?.slice(-8)}</p>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="mt-6 flex justify-center gap-4">
                  <button 
                    onClick={() => {
                      setShowPaymentSuccess(false);
                      setPaymentSuccessTimer(0);
                    }}
                    className="px-6 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                  >
                    Continue Browsing
                  </button>
                  <button 
                    onClick={() => window.location.href = '/account'}
                    className="px-6 py-2 bg-white text-green-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                  >
                    Go to Profile Now
                  </button>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-full bg-green-400 rounded-full filter blur-3xl opacity-10 -mr-32"></div>
              <div className="absolute bottom-0 left-0 w-64 h-full bg-green-700 rounded-full filter blur-3xl opacity-10 -ml-32"></div>
            </div>
          )}
          
          {/* Discount Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 relative">
            <div className="max-w-6xl mx-auto px-4 flex flex-col items-center md:flex-row md:justify-between">
              <div className="flex items-center gap-3 mb-3 md:mb-0">
                <i className="fas fa-stopwatch text-2xl text-blue-100 animate-pulse"></i>
                <h2 className="text-xl font-bold">Your discount ends in:</h2>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg min-w-[60px] text-center">
                  <div className="text-2xl font-bold">{countdown.days}</div>
                  <div className="text-xs text-blue-100">days</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg min-w-[60px] text-center">
                  <div className="text-2xl font-bold">{countdown.hours}</div>
                  <div className="text-xs text-blue-100">hours</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg min-w-[60px] text-center">
                  <div className="text-2xl font-bold">{countdown.minutes}</div>
                  <div className="text-xs text-blue-100">mins</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg min-w-[60px] text-center">
                  <div className="text-2xl font-bold">{countdown.seconds}</div>
                  <div className="text-xs text-blue-100">secs</div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-full bg-blue-400 rounded-full filter blur-3xl opacity-10 -mr-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-full bg-blue-700 rounded-full filter blur-3xl opacity-10 -ml-32"></div>
          </div>
          
          {/* Error Message */}
          {errorMessage && (
            <div className="max-w-6xl mx-auto px-4 py-2">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <i className="fas fa-exclamation-triangle text-red-500"></i>
                  <span className="text-red-700">{errorMessage}</span>
                </div>
                <button 
                  onClick={clearError}
                  className="text-red-500 hover:text-red-700"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          )}
          
          {/* Subscription Validation Message */}
          {!subscriptionValidation.isValid && subscriptionValidation.message && (
            <div className="max-w-6xl mx-auto px-4 py-2">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <i className="fas fa-info-circle text-yellow-500"></i>
                  <span className="text-yellow-700">{subscriptionValidation.message}</span>
                </div>
                <button 
                  onClick={clearError}
                  className="text-yellow-500 hover:text-yellow-700"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          )}
          
          {/* Pricing Section */}
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Choose the Perfect Plan for Your Business</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Unlock the full potential of your marketing efforts with our AI-powered platform. 
                Select the plan that fits your business needs and start creating amazing content today.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => {
                // Check if user already has this plan
                const hasCurrentPlan = membershipStatus?.planName?.toLowerCase() === plan.name.toLowerCase();
                const isDisabled = hasCurrentPlan || isProcessingPayment;
                
                return (
                  <div 
                    key={plan.id}
                    className={`relative bg-white rounded-xl shadow-lg overflow-hidden border ${
                      plan.popular 
                        ? 'border-blue-400 ring-2 ring-blue-400 ring-opacity-30' 
                        : plan.id === 'lifetime'
                          ? 'border-yellow-400'
                          : 'border-gray-200'
                    } ${hasCurrentPlan ? 'opacity-75' : ''}`}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 right-0">
                        <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg shadow-sm">
                          MOST POPULAR
                        </div>
                      </div>
                    )}
                    
                    {plan.id === 'lifetime' && (
                      <div className="absolute top-0 right-0">
                        <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-bl-lg shadow-sm">
                          BEST VALUE
                        </div>
                      </div>
                    )}
                    
                    {hasCurrentPlan && (
                      <div className="absolute top-0 left-0">
                        <div className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-br-lg shadow-sm">
                          CURRENT PLAN
                        </div>
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="text-center">
                        <div className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium mb-3">
                          {plan.name}
                        </div>
                        
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <span className="text-gray-400 line-through text-lg">${plan.originalPrice}</span>
                          <span className="text-4xl font-bold text-gray-800">${plan.price}</span>
                        </div>
                        
                        <div className="text-gray-500 text-sm mb-6">{plan.period}</div>
                        
                        <p className="text-sm text-gray-600 mb-6">
                          {plan.description}
                        </p>
                      </div>
                      
                      <div className="space-y-3 mb-6">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className={`mt-0.5 text-${plan.id === 'lifetime' ? 'yellow' : 'blue'}-500`}>
                              <i className="fas fa-check"></i>
                            </div>
                            <div className="text-sm text-gray-600">{feature}</div>
                          </div>
                        ))}
                      </div>
                      
                      <button 
                        onClick={() => handleStripePayment(plan)}
                        disabled={isDisabled}
                        className={`w-full py-3 rounded-lg font-medium transition-all ${
                          hasCurrentPlan
                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                            : plan.id === 'lifetime'
                              ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
                              : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
                        }`}
                      >
                        {hasCurrentPlan ? (
                          <>
                            <i className="fas fa-check mr-2"></i>
                            Current Plan
                          </>
                        ) : isProcessingPayment && processingPlan === plan.id ? (
                          <>
                            <i className="fas fa-spinner fa-spin mr-2"></i>
                            Processing...
                          </>
                        ) : (
                          <>
                            {hasCurrentPlan ? 'Current Plan' : 'Upgrade Now'} <i className="fas fa-arrow-right ml-1"></i>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Testimonials */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">What Our Customers Say</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                  <div className="flex text-yellow-400 mb-3">
                    {[1, 2, 3, 4, 5].map(star => (
                      <i key={star} className="fas fa-star"></i>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"Markzy has completely transformed how I create content. What used to take me hours now takes minutes!"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-medium">SJ</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Sarah Johnson</p>
                      <p className="text-xs text-gray-500">Small Business Owner</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                  <div className="flex text-yellow-400 mb-3">
                    {[1, 2, 3, 4, 5].map(star => (
                      <i key={star} className="fas fa-star"></i>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"The ROI is incredible! I've 3x'd my email open rates and doubled my sales conversions since upgrading to Markzy."</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-medium">MT</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Mark Thompson</p>
                      <p className="text-xs text-gray-500">E-commerce Entrepreneur</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                  <div className="flex text-yellow-400 mb-3">
                    {[1, 2, 3, 4, 5].map(star => (
                      <i key={star} className="fas fa-star"></i>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"I invested in the lifetime plan and it paid for itself in the first month. The time saved and quality of content is unmatched."</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-medium">PM</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Priya Mehta</p>
                      <p className="text-xs text-gray-500">Agency Owner</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* FAQ Section */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">Frequently Asked Questions</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                  <h4 className="text-lg font-medium text-gray-800 mb-2">Can I upgrade or downgrade my plan later?</h4>
                  <p className="text-gray-600">Yes, you can easily upgrade to a higher tier at any time. Downgrades take effect at the end of your billing cycle.</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                  <h4 className="text-lg font-medium text-gray-800 mb-2">Is there a money-back guarantee?</h4>
                  <p className="text-gray-600">Absolutely! We offer a 14-day money-back guarantee on all plans if you're not completely satisfied.</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                  <h4 className="text-lg font-medium text-gray-800 mb-2">What payment methods do you accept?</h4>
                  <p className="text-gray-600">We accept all major credit cards, PayPal, and bank transfers for annual plans.</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                  <h4 className="text-lg font-medium text-gray-800 mb-2">Can I use Markzy for client work?</h4>
                  <p className="text-gray-600">The Entrepreneur plan allows you to manage up to 4 brands, making it perfect for freelancers and agencies with multiple clients.</p>
                </div>
              </div>
            </div>
            
            {/* CTA Banner */}
            <div className="mt-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg overflow-hidden text-white">
              <div className="p-8 relative">
                <div className="max-w-3xl mx-auto text-center">
                  <h3 className="text-2xl font-bold mb-4">Ready to transform your marketing?</h3>
                  <p className="text-blue-100 mb-6">Upgrade now and save with our limited-time discount. Start creating professional marketing materials in minutes, not hours.</p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button 
                      onClick={() => handleStripePayment(plans[1])} // Default to Entrepreneur plan
                      disabled={isProcessingPayment}
                      className="px-6 py-3 bg-white text-blue-700 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="font-medium">Choose a Plan</span>
                      <i className="fas fa-chevron-up"></i>
                    </button>
                    
                    <button className="px-6 py-3 bg-blue-500 text-white rounded-lg border border-blue-400 hover:bg-blue-600 transition-colors">
                      <span className="font-medium">Schedule a Demo</span>
                    </button>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl opacity-20 -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-700 rounded-full filter blur-3xl opacity-20 -ml-32 -mb-32"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
