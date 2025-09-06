'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface UserAnalyticsData {
  _id: string;
  username: string;
  email: string;
  toolName: string;
  usageCount: number;
  lastVisited: string;
  subscription: string;
  subscriptionType?: string;
  status: string;
}

interface FilterState {
  search: string;
  toolFilter: string;
  subscriptionFilter: string;
  statusFilter: string;
  dateRange: string;
  startDate: string;
  endDate: string;
}

export default function UserAnalytics() {
  const [userData, setUserData] = useState<UserAnalyticsData[]>([]);
  const [filteredData, setFilteredData] = useState<UserAnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    toolFilter: '',
    subscriptionFilter: '',
    statusFilter: '',
    dateRange: 'all',
    startDate: '',
    endDate: ''
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof UserAnalyticsData;
    direction: 'asc' | 'desc';
  }>({ key: 'lastVisited', direction: 'desc' });

  useEffect(() => {
    fetchUserAnalytics();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [userData, filters, sortConfig]);

  const fetchUserAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      const response = await fetch('/api/admin/user-analytics', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('=== DATA LOADED ===');
        console.log('Fetched user analytics data:', data.data);
        console.log('Total records:', data.data.length);
        console.log('Available tools:', data.data.map((item: any) => item.toolName));
        console.log('Available users:', Array.from(new Set(data.data.map((item: any) => item.username))));
        console.log('Available subscriptions:', Array.from(new Set(data.data.map((item: any) => item.subscription))));
        console.log('Available statuses:', Array.from(new Set(data.data.map((item: any) => item.status))));
        console.log('=== END DATA LOADED ===');
        setUserData(data.data);
      } else {
        setError(data.message || 'Failed to load user analytics data');
      }
    } catch (error) {
      console.error('Error fetching user analytics:', error);
      setError('Failed to load user analytics data');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...userData];

    console.log('=== FILTER DEBUG ===');
    console.log('Filters applied:', filters);
    console.log('Total data before filtering:', userData.length);
    console.log('Sample data:', userData.slice(0, 3));

    // Search filter
    if (filters.search && filters.search.trim() !== '') {
      filtered = filtered.filter(user => 
        (user.username && user.username.toLowerCase().includes(filters.search.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(filters.search.toLowerCase())) ||
        (user.toolName && user.toolName.toLowerCase().includes(filters.search.toLowerCase()))
      );
      console.log('After search filter:', filtered.length);
    }

    // Tool filter - show all if empty or "All Tools" selected
    if (filters.toolFilter && filters.toolFilter !== '' && filters.toolFilter !== 'All Tools') {
      filtered = filtered.filter(user => user.toolName === filters.toolFilter);
      console.log('After tool filter:', filtered.length, 'Filtered by tool:', filters.toolFilter);
    } else {
      console.log('No tool filter applied - showing all tools. Available tools:', getUniqueTools());
    }

    // Subscription filter - show all if empty or "All Plans" selected
    if (filters.subscriptionFilter && filters.subscriptionFilter !== '' && filters.subscriptionFilter !== 'All Plans') {
      filtered = filtered.filter(user => user.subscription === filters.subscriptionFilter);
      console.log('After subscription filter:', filtered.length);
    } else {
      console.log('No subscription filter applied - showing all subscriptions');
    }

    // Status filter - show all if empty or "All Status" selected
    if (filters.statusFilter && filters.statusFilter !== '' && filters.statusFilter !== 'All Status') {
      filtered = filtered.filter(user => user.status === filters.statusFilter);
      console.log('After status filter:', filtered.length);
    } else {
      console.log('No status filter applied - showing all statuses');
    }

    // Date range filter
    if (filters.startDate && filters.endDate) {
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999); // Include the entire end date
      
      filtered = filtered.filter(user => {
        const userDate = new Date(user.lastVisited);
        return userDate >= startDate && userDate <= endDate;
      });
      console.log('After date filter:', filtered.length);
    } else {
      console.log('No date filter applied - showing all dates');
    }

    console.log('Final filtered data:', filtered.length);
    console.log('Sample filtered data:', filtered.slice(0, 3));
    console.log('=== END FILTER DEBUG ===');

    // Apply sorting with improved logic for all data types
    filtered.sort((a: any, b: any) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      // Handle null/undefined values
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      // Handle string values (username, email, toolName, subscription, status)
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const result = aValue.localeCompare(bValue);
        return sortConfig.direction === 'asc' ? result : -result;
      }
      
      // Handle number values (usageCount)
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      // Handle date strings (lastVisited)
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const dateA = new Date(aValue);
        const dateB = new Date(bValue);
        if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
          const result = dateA.getTime() - dateB.getTime();
          return sortConfig.direction === 'asc' ? result : -result;
        }
      }
      
      return 0;
    });

    setFilteredData(filtered);
  }, [userData, filters, sortConfig]);

  const handleSort = (key: keyof UserAnalyticsData) => {
    setSortConfig(prev => {
      const newDirection = prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc';
      return {
        key,
        direction: newDirection
      };
    });
  };

  const getUniqueTools = () => {
    const tools = userData
      .map(user => user.toolName)
      .filter(tool => tool && tool.trim() !== '');
    return Array.from(new Set(tools)).sort();
  };

  const getUniqueSubscriptions = () => {
    const subscriptions = userData
      .map(user => user.subscription)
      .filter(sub => sub && sub.trim() !== '');
    return Array.from(new Set(subscriptions)).sort();
  };

  const getUniqueStatuses = () => {
    const statuses = userData
      .map(user => user.status)
      .filter(status => status && status.trim() !== '');
    return Array.from(new Set(statuses)).sort();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getSubscriptionColor = (subscription: string) => {
    const subscriptionLower = subscription.toLowerCase();
    switch (subscriptionLower) {
      case 'basic':
      case 'basic plan':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pro':
      case 'pro plan':
      case 'premium':
      case 'premium plan':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'enterprise':
      case 'enterprise plan':
      case 'lifetime':
      case 'lifetime plan':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'free':
      case 'free plan':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading user analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchUserAnalytics}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">User Analytics Dashboard</h3>
            <p className="text-sm text-gray-600 mt-1">
              Track user activity, tool usage, and engagement patterns
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-2">
            <button
              onClick={fetchUserAnalytics}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-2"
            >
              <span>🔄</span>
              Refresh Data
            </button>
            <button
              onClick={() => {
                const resetFilters = {
                  search: '',
                  toolFilter: '',
                  subscriptionFilter: '',
                  statusFilter: '',
                  dateRange: 'all',
                  startDate: '',
                  endDate: ''
                };
                console.log('Resetting filters to:', resetFilters);
                setFilters(resetFilters);
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm flex items-center gap-2"
            >
              <span>🗑️</span>
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="flex flex-col h-20">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search users, emails, tools..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Tool Filter */}
          <div className="flex flex-col h-20">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tool</label>
            <select
              value={filters.toolFilter}
              onChange={(e) => setFilters(prev => ({ ...prev, toolFilter: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Tools</option>
              {getUniqueTools().map(tool => (
                <option key={tool} value={tool}>{tool}</option>
              ))}
            </select>
          </div>

          {/* Subscription Filter */}
          <div className="flex flex-col h-20">
            <label className="block text-sm font-medium text-gray-700 mb-1">Subscription</label>
            <select
              value={filters.subscriptionFilter}
              onChange={(e) => setFilters(prev => ({ ...prev, subscriptionFilter: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Plans</option>
              {getUniqueSubscriptions().map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col h-20">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.statusFilter}
              onChange={(e) => setFilters(prev => ({ ...prev, statusFilter: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              {getUniqueStatuses().map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="flex flex-col h-20">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <div className="flex gap-1">
              <div className="flex-1">
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  placeholder="From"
                />
              </div>
              <div className="flex-1">
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  placeholder="To"
                />
              </div>
            </div>
            
            {/* Quick Selection Buttons */}
            <div className="flex flex-wrap gap-1 mt-1">
              <button
                onClick={() => {
                  const today = new Date().toISOString().split('T')[0];
                  setFilters(prev => ({ ...prev, startDate: today, endDate: today }));
                }}
                className="px-1 py-0.5 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                Today
              </button>
              <button
                onClick={() => {
                  const yesterday = new Date();
                  yesterday.setDate(yesterday.getDate() - 1);
                  const yesterdayStr = yesterday.toISOString().split('T')[0];
                  setFilters(prev => ({ ...prev, startDate: yesterdayStr, endDate: yesterdayStr }));
                }}
                className="px-1 py-0.5 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Yesterday
              </button>
              <button
                onClick={() => {
                  const last7Days = new Date();
                  last7Days.setDate(last7Days.getDate() - 7);
                  const startDate = last7Days.toISOString().split('T')[0];
                  const endDate = new Date().toISOString().split('T')[0];
                  setFilters(prev => ({ ...prev, startDate, endDate }));
                }}
                className="px-1 py-0.5 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
              >
                7D
              </button>
              <button
                onClick={() => {
                  const last30Days = new Date();
                  last30Days.setDate(last30Days.getDate() - 30);
                  const startDate = last30Days.toISOString().split('T')[0];
                  const endDate = new Date().toISOString().split('T')[0];
                  setFilters(prev => ({ ...prev, startDate, endDate }));
                }}
                className="px-1 py-0.5 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
              >
                30D
              </button>
            </div>
            
            {/* Selected Range Display */}
            {filters.startDate && filters.endDate && (
              <div className="text-xs text-gray-500 bg-gray-50 px-1 py-0.5 rounded mt-1">
                {filters.startDate} - {filters.endDate}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{filteredData.length}</p>
            <p className="text-sm text-gray-600">Total Records</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {filteredData.filter(user => user.status === 'active').length}
            </p>
            <p className="text-sm text-gray-600">Active Users</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {filteredData.reduce((sum, user) => sum + user.usageCount, 0)}
            </p>
            <p className="text-sm text-gray-600">Total Usage</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {getUniqueTools().length}
            </p>
            <p className="text-sm text-gray-600">Unique Tools</p>
          </div>
        </div>
      </div>

      {/* Table with proper scrolling */}
      <div className="overflow-x-auto max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 bg-gray-50"
                onClick={() => handleSort('username')}
              >
                <div className="flex items-center gap-2">
                  Username
                  {sortConfig.key === 'username' && (
                    <span className="text-blue-600 font-bold">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 bg-gray-50"
                onClick={() => handleSort('email')}
              >
                <div className="flex items-center gap-2">
                  Email
                  {sortConfig.key === 'email' && (
                    <span className="text-blue-600 font-bold">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 bg-gray-50"
                onClick={() => handleSort('toolName')}
              >
                <div className="flex items-center gap-2">
                  Tool Name
                  {sortConfig.key === 'toolName' && (
                    <span className="text-blue-600 font-bold">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 bg-gray-50"
                onClick={() => handleSort('usageCount')}
              >
                <div className="flex items-center gap-2">
                  Usage Count
                  {sortConfig.key === 'usageCount' && (
                    <span className="text-blue-600 font-bold">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 bg-gray-50"
                onClick={() => handleSort('lastVisited')}
              >
                <div className="flex items-center gap-2">
                  Last Visited
                  {sortConfig.key === 'lastVisited' && (
                    <span className="text-blue-600 font-bold">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 bg-gray-50"
                onClick={() => handleSort('subscription')}
              >
                <div className="flex items-center gap-2">
                  Subscription
                  {sortConfig.key === 'subscription' && (
                    <span className="text-blue-600 font-bold">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 bg-gray-50"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-2">
                  Status
                  {sortConfig.key === 'status' && (
                    <span className="text-blue-600 font-bold">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((user, index) => (
              <tr key={`${user._id}-${index}`} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.username}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.toolName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-semibold">{user.usageCount}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatDate(user.lastVisited)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getSubscriptionColor(user.subscription)}`}>
                    {user.subscription || 'Free'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination and Data Info */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="text-sm text-gray-700 mb-2 sm:mb-0">
            Showing <span className="font-medium">{filteredData.length}</span> of <span className="font-medium">{userData.length}</span> records
          </div>
          <div className="text-sm text-gray-500">
            {filteredData.length > 0 ? (
              <span>Scroll to see all {filteredData.length} records</span>
            ) : (
              <span>No records found</span>
            )}
          </div>
        </div>
      </div>

      {/* No Data Message */}
      {filteredData.length === 0 && (
        <div className="px-6 py-8 text-center">
          <div className="text-gray-500">
            <p className="text-lg">No data found</p>
            <p className="text-sm mt-2">Try adjusting your filters</p>
          </div>
        </div>
      )}
    </div>
  );
}
