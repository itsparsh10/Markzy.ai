'use client';

import React, { useState, useEffect } from 'react';

interface SubscriptionStats {
  subscriptions: Array<{
    _id: string;
    count: number;
    totalAmount: number;
    totalUsers: number;
  }>;
  payments: Array<{
    _id: string;
    count: number;
    totalAmount: number;
  }>;
}

export default function RevenueAnalytics() {
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRevenueStats();
  }, []);

  const fetchRevenueStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/stats?type=subscriptionStats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      } else {
        setError('Failed to load revenue statistics');
      }
    } catch (error) {
      console.error('Error fetching revenue stats:', error);
      setError('Failed to load revenue statistics');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      case 'pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getSubscriptionColor = (type: string) => {
    switch (type) {
      case 'premium':
        return 'text-purple-600';
      case 'enterprise':
        return 'text-blue-600';
      case 'standard':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Revenue Analytics</h2>
          <button
            onClick={fetchRevenueStats}
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="px-6 py-4 bg-red-50 border-b border-red-200">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="p-6">
        {!stats ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No revenue data available</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {stats.subscriptions?.reduce((sum, sub) => sum + sub.count, 0) || 0}
                </p>
                <p className="text-sm text-gray-500">Total Subscriptions</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.payments?.reduce((sum, payment) => sum + payment.totalAmount, 0) || 0)}
                </p>
                <p className="text-sm text-gray-500">Total Revenue</p>
              </div>
            </div>

            {/* Subscription Types */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Subscription Types</h3>
              <div className="space-y-3">
                {stats.subscriptions?.map((subscription) => (
                  <div key={subscription._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <span className={`text-sm font-medium capitalize ${getSubscriptionColor(subscription._id)}`}>
                        {subscription._id}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">{subscription.count}</div>
                      <div className="text-xs text-gray-500">{formatCurrency(subscription.totalAmount)}</div>
                      <div className="text-xs text-gray-400">{subscription.totalUsers} users</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Payment Status</h3>
              <div className="space-y-3">
                {stats.payments?.map((payment) => (
                  <div key={payment._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <span className={`text-sm font-medium capitalize ${getStatusColor(payment._id)}`}>
                        {payment._id}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">{payment.count}</div>
                      <div className="text-xs text-gray-500">{formatCurrency(payment.totalAmount)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Success Rate */}
            {stats.payments && stats.payments.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Success Rate</h4>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  {(() => {
                    const successPayment = stats.payments.find(p => p._id === 'success');
                    const totalPayments = stats.payments.reduce((sum, p) => sum + p.count, 0);
                    const successRate = successPayment ? (successPayment.count / totalPayments) * 100 : 0;
                    return (
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${successRate}%` }}
                      ></div>
                    );
                  })()}
                </div>
                <p className="text-xs text-gray-500">
                  {(() => {
                    const successPayment = stats.payments.find(p => p._id === 'success');
                    const totalPayments = stats.payments.reduce((sum, p) => sum + p.count, 0);
                    const successRate = successPayment ? (successPayment.count / totalPayments) * 100 : 0;
                    return `${successRate.toFixed(1)}% successful payments`;
                  })()}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 