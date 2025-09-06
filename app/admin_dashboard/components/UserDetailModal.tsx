'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface UserDetails {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  totalToolUsage: number;
  totalPayments: number;
  totalSpent: number;
  lastToolUsage: string | null;
  lastLoginAt: string | null;
  analyticsCount: number;
  additionalData?: {
    companyName?: string;
    jobTitle?: string;
  };
  // Additional detailed data
  subscriptions?: Array<{
    type: string;
    amount: number;
    status: string;
    startDate: string;
    endDate: string;
    nextPaymentDate?: string;
    remainingDays?: number;
  }>;
  paymentHistory?: Array<{
    amount: number;
    status: string;
    date: string;
    description: string;
  }>;
  loginHistory?: Array<{
    loginAt: string;
    logoutAt?: string;
    ipAddress?: string;
    userAgent?: string;
  }>;
  toolUsage?: Array<{
    toolName: string;
    usageCount: number;
    lastUsed: string;
  }>;
}

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
}

export default function UserDetailsModal({ isOpen, onClose, userId }: UserDetailsModalProps) {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserDetails();
    }
  }, [isOpen, userId]);

  const fetchUserDetails = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching details for user ID:', userId);
      const response = await fetch(`/api/admin/users/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setUserDetails(data.data);
      } else {
        setError(data.message || 'Failed to load user details');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const getDaysUntilPayment = (nextPaymentDate: string) => {
    const nextPayment = new Date(nextPaymentDate);
    const today = new Date();
    const diffTime = nextPayment.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateRemainingDays = (subscription: any) => {
    if (subscription.type === 'lifetime') {
      return -1; // Lifetime
    }
    
    const now = new Date();
    const subscriptionDate = new Date(subscription.startDate);
    const daysSinceSubscription = Math.floor((now.getTime() - subscriptionDate.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, 30 - daysSinceSubscription);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              {loading ? 'Loading...' : userDetails?.name || 'User Details'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ) : userDetails ? (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="text-sm font-medium text-gray-900">{userDetails.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-sm font-medium text-gray-900">{userDetails.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Role</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      userDetails.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {userDetails.role}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      userDetails.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {userDetails.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {userDetails.additionalData?.companyName && (
                    <div>
                      <p className="text-sm text-gray-600">Company</p>
                      <p className="text-sm font-medium text-gray-900">{userDetails.additionalData.companyName}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(userDetails.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600">Total Tools Used</p>
                  <p className="text-2xl font-bold text-blue-900">{userDetails.totalToolUsage}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600">Total Payments</p>
                  <p className="text-2xl font-bold text-green-900">{userDetails.totalPayments}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-600">Total Spent</p>
                  <p className="text-2xl font-bold text-yellow-900">{formatCurrency(userDetails.totalSpent)}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600">Analytics Visits</p>
                  <p className="text-2xl font-bold text-purple-900">{userDetails.analyticsCount}</p>
                </div>
              </div>

              {/* Subscription Details */}
              {userDetails.subscriptions && userDetails.subscriptions.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Subscription Details</h4>
                  <div className="space-y-3">
                    {userDetails.subscriptions.map((subscription, index) => {
                      const remainingDays = calculateRemainingDays(subscription);
                      return (
                        <div key={index} className="bg-white p-3 rounded border">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-900 capitalize">{subscription.type}</p>
                              <p className="text-sm text-gray-600">
                                {formatCurrency(subscription.amount)} - {subscription.status}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDate(subscription.startDate)} to {subscription.endDate ? formatDate(subscription.endDate) : 'Lifetime'}
                              </p>
                            </div>
                            <div className="text-right">
                              {subscription.type === 'lifetime' ? (
                                <div>
                                  <p className="text-sm text-gray-600">Status</p>
                                  <p className="text-sm font-medium text-green-600">Lifetime</p>
                                  <p className="text-xs text-gray-500">Never expires</p>
                                </div>
                              ) : (
                                <div>
                                  <p className="text-sm text-gray-600">Remaining Days</p>
                                  <p className={`text-sm font-medium ${
                                    remainingDays <= 7 
                                      ? 'text-red-600' 
                                      : remainingDays <= 14
                                      ? 'text-yellow-600'
                                      : 'text-green-600'
                                  }`}>
                                    {remainingDays} days
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {subscription.nextPaymentDate ? formatDate(subscription.nextPaymentDate) : 'Expires soon'}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Payment History */}
              {userDetails.paymentHistory && userDetails.paymentHistory.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Payment History</h4>
                  <div className="space-y-2">
                    {userDetails.paymentHistory.map((payment, index) => (
                      <div key={index} className="bg-white p-3 rounded border flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900">{payment.description}</p>
                          <p className="text-sm text-gray-600">{formatDate(payment.date)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{formatCurrency(payment.amount)}</p>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            payment.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : payment.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Login History */}
              {userDetails.loginHistory && userDetails.loginHistory.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Recent Login History</h4>
                  <div className="space-y-2">
                    {userDetails.loginHistory.slice(0, 5).map((login, index) => (
                      <div key={index} className="bg-white p-3 rounded border">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {formatDate(login.loginAt)}
                            </p>
                            {login.ipAddress && (
                              <p className="text-xs text-gray-500">IP: {login.ipAddress}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">
                              {login.logoutAt ? `Duration: ${Math.round((new Date(login.logoutAt).getTime() - new Date(login.loginAt).getTime()) / 1000 / 60)}m` : 'Active'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tool Usage */}
              {userDetails.toolUsage && userDetails.toolUsage.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Tool Usage Statistics</h4>
                  <div className="space-y-2">
                    {userDetails.toolUsage.map((tool, index) => (
                      <div key={index} className="bg-white p-3 rounded border flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900">{tool.toolName}</p>
                          <p className="text-sm text-gray-600">Last used: {formatDate(tool.lastUsed)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-blue-600">{tool.usageCount}</p>
                          <p className="text-xs text-gray-500">times used</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Last Activity */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Last Activity</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Last Tool Usage</p>
                    <p className="text-sm font-medium text-gray-900">
                      {userDetails.lastToolUsage ? formatDate(userDetails.lastToolUsage) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Login</p>
                    <p className="text-sm font-medium text-gray-900">
                      {userDetails.lastLoginAt ? formatDate(userDetails.lastLoginAt) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
} 