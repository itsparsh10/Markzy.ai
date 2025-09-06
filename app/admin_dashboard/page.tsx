'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserTable from './components/UserTable';
import ToolUsageChart from './components/ToolUsageChart';
import SessionAnalytics from './components/SessionAnalytics';
import RevenueAnalytics from './components/RevenueAnalytics';
import SupportDashboard from './components/SupportDashboard';
import UserAnalytics from './components/UserAnalytics';

// Interface for Form Query
interface FormQuery {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  industry?: string;
  message?: string;
  budget?: string;
  timeline?: string;
  requirements?: string;
  status: string;
  createdAt: string;
}

// FormQueryDashboard Component
const FormQueryDashboard = () => {
  const [formQueries, setFormQueries] = useState<FormQuery[]>([]);
  const [filteredQueries, setFilteredQueries] = useState<FormQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0
  });
  const [filters, setFilters] = useState({
    status: '',
    industry: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState<FormQuery | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchFormQueries();
  }, []);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [formQueries, filters, searchTerm]);

  const fetchFormQueries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/form-query');
      const result = await response.json();
      
      if (result.success) {
        setFormQueries(result.data);
        
        // Calculate stats
        const total = result.pagination.total;
        const resolved = result.data.filter((query: any) => query.status === 'resolved').length;
        const pending = result.data.filter((query: any) => query.status === 'new' || query.status === 'in-progress').length;
        
        setStats({ total, resolved, pending });
      }
    } catch (error) {
      console.error('Error fetching form queries:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSearch = () => {
    let filtered = [...formQueries];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((query: FormQuery) =>
        query.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        query.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        query.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        query.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        query.message?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter((query: FormQuery) => query.status === filters.status);
    }


    // Apply industry filter
    if (filters.industry) {
      filtered = filtered.filter((query: FormQuery) => query.industry === filters.industry);
    }

    setFilteredQueries(filtered);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      industry: ''
    });
    setSearchTerm('');
  };

  const getUniqueIndustries = () => {
    const industries = formQueries.map((query: FormQuery) => query.industry).filter(Boolean);
    return Array.from(new Set(industries));
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'new': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'New' },
      'in-progress': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'In Progress' },
      'resolved': { bg: 'bg-green-100', text: 'text-green-800', label: 'Resolved' },
      'closed': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Closed' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewQuery = (query: FormQuery) => {
    setSelectedQuery(query);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedQuery(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Form Query Management</h3>
          <p className="mt-1 text-sm text-gray-500">
            Manage and respond to form submissions and user queries
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Query Statistics */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <i className="fas fa-inbox text-blue-600 text-2xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-600">Total Queries</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <i className="fas fa-check-circle text-green-600 text-2xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-green-600">Resolved</p>
                  <p className="text-2xl font-bold text-green-900">{stats.resolved}</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <i className="fas fa-clock text-yellow-600 text-2xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-yellow-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Queries Table */}
          <div className="mt-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900 mb-4 sm:mb-0">Recent Form Queries</h4>
              
              {/* Search and Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search Input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search queries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                </div>

                {/* Filter Toggle Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <i className="fas fa-filter"></i>
                  Filter
                  {(filters.status || filters.industry) && (
                    <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                      {[filters.status, filters.industry].filter(Boolean).length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">All Statuses</option>
                      <option value="new">New</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  {/* Industry Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                    <select
                      value={filters.industry}
                      onChange={(e) => handleFilterChange('industry', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">All Industries</option>
                      {getUniqueIndustries().map((industry) => (
                        <option key={industry} value={industry}>
                          {industry}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Clear Filters Button */}
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-600 hover:text-gray-800 underline"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            )}

            {/* Results Count */}
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredQueries.length} of {formQueries.length} queries
            </div>

            {loading ? (
              <div className="text-center py-8">
                <i className="fas fa-spinner fa-spin text-2xl text-gray-400"></i>
                <p className="mt-2 text-gray-500">Loading form queries...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Industry
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredQueries.length > 0 ? (
                      filteredQueries.map((query: FormQuery) => (
                        <tr key={query._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {query.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {query.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {query.company || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {query.industry || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(query.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(query.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              onClick={() => handleViewQuery(query)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                          {searchTerm || filters.status || filters.industry
                            ? 'No queries match your search criteria'
                            : 'No form queries found'
                          }
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-start items-center">
            <div className="flex space-x-3">
              <button 
                onClick={fetchFormQueries}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <i className="fas fa-sync-alt mr-2"></i>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Query Details Modal */}
      {showModal && selectedQuery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[70vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Query Details</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Submitted on {formatDate(selectedQuery.createdAt)}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 space-y-4">
              {/* User Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="font-medium text-gray-900 mb-2 text-sm">Contact Information</h4>
                  <div className="space-y-1">
                    <div>
                      <span className="text-xs text-gray-500">Name:</span>
                      <p className="font-medium text-gray-900 text-sm">{selectedQuery.name}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Email:</span>
                      <p className="font-medium text-gray-900 text-sm">{selectedQuery.email}</p>
                    </div>
                    {selectedQuery.phone && (
                      <div>
                        <span className="text-xs text-gray-500">Phone:</span>
                        <p className="font-medium text-gray-900 text-sm">{selectedQuery.phone}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="font-medium text-gray-900 mb-2 text-sm">Business Information</h4>
                  <div className="space-y-1">
                    <div>
                      <span className="text-xs text-gray-500">Company:</span>
                      <p className="font-medium text-gray-900 text-sm">{selectedQuery.company || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Industry:</span>
                      <p className="font-medium text-gray-900 text-sm">{selectedQuery.industry || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Status:</span>
                      <div className="mt-1">
                        {getStatusBadge(selectedQuery.status)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="bg-blue-50 rounded-lg p-3">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center text-sm">
                  <i className="fas fa-comment-alt text-blue-600 mr-2"></i>
                  Message
                </h4>
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-sm">
                    {selectedQuery.message || 'No message provided'}
                  </p>
                </div>
              </div>

              {/* Additional Information */}
              {(selectedQuery.budget || selectedQuery.timeline || selectedQuery.requirements) && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="font-medium text-gray-900 mb-2 text-sm">Additional Details</h4>
                  <div className="space-y-2">
                    {selectedQuery.budget && (
                      <div>
                        <span className="text-xs text-gray-500">Budget:</span>
                        <p className="font-medium text-gray-900 text-sm">{selectedQuery.budget}</p>
                      </div>
                    )}
                    {selectedQuery.timeline && (
                      <div>
                        <span className="text-xs text-gray-500">Timeline:</span>
                        <p className="font-medium text-gray-900 text-sm">{selectedQuery.timeline}</p>
                      </div>
                    )}
                    {selectedQuery.requirements && (
                      <div>
                        <span className="text-xs text-gray-500">Requirements:</span>
                        <p className="font-medium text-gray-900 text-sm">{selectedQuery.requirements}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end pt-3 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="px-3 py-1.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface DashboardStats {
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  totalToolUsage: number;
  totalPayments: number;
  totalActiveSubscriptions: number;
  totalPaymentVolume: number;
  subscriptions: any[];
  payments: any[];
  topTools: any[];
}

interface EnhancedStats {
  dashboard: DashboardStats;
  toolUsage: any[];
  sessionAnalytics: any[];
  userAnalytics: {
    newUsers?: number;
    activeUsers?: number;
    retentionRate?: number;
    avgSessionDuration?: number;
    avgToolsUsed?: number;
    satisfactionScore?: number;
    subscriptionDistribution?: {
      basic?: number;
      pro?: number;
      enterprise?: number;
    };
    engagementLevels?: {
      high?: number;
      medium?: number;
      low?: number;
    };
  };
  subscriptionStats: any;
  revenueAnalytics: any[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<EnhancedStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchDashboardStats();
    
    // Set up real-time refresh every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardStats();
    }, 30000);
    
    setRefreshInterval(interval);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      } else {
        setError('Failed to load dashboard statistics');
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Failed to load dashboard statistics');
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

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getGrowthRate = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const handleLogout = async () => {
    try {
      // Call logout API to track session
      const token = localStorage.getItem('authToken');
      if (token && !token.startsWith('admin-token-')) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Error calling logout API:', error);
      // Continue with logout even if API call fails
    }
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/admin_dashboard/login');
  };

  const handleHomeRedirect = () => {
    router.push('/all-tools');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading enhanced dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={fetchDashboardStats}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const dashboard = stats?.dashboard;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Enhanced Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Real-time monitoring & analytics</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
              <button
                onClick={handleHomeRedirect}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center gap-2"
              >
                <i className="fas fa-home"></i>
                Home
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm flex items-center gap-2"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: '📊' },
              { id: 'users', name: 'Users', icon: '👥' },
              { id: 'user-analytics', name: 'User Analytics', icon: '📊' },
              { id: 'analytics', name: 'Analytics', icon: '📈' },
              { id: 'revenue', name: 'Revenue', icon: '💰' },
              { id: 'tools', name: 'Tools', icon: '🛠️' },
              { id: 'form-query', name: 'Form Query', icon: '📝' },
              { id: 'support', name: 'Support', icon: '🎫' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 text-sm">👥</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-500">Total Users</p>
                    <p className="text-lg font-bold text-gray-900">{formatNumber(dashboard?.totalUsers || 0)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 text-sm">🟢</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-500">Active Users</p>
                    <p className="text-lg font-bold text-green-600">{formatNumber(dashboard?.activeUsers || 0)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 text-sm">👥</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-500">New Users (30d)</p>
                    <p className="text-lg font-bold text-blue-600">{formatNumber(dashboard?.newUsers || 0)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600 text-sm">🛠️</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-500">Tool Usage</p>
                    <p className="text-lg font-bold text-purple-600">{formatNumber(dashboard?.totalToolUsage || 0)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <span className="text-yellow-600 text-sm">💰</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-500">Total Payments</p>
                    <p className="text-lg font-bold text-yellow-600">{formatNumber(dashboard?.totalPayments || 0)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <span className="text-indigo-600 text-sm">📊</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-500">Active Subs</p>
                    <p className="text-lg font-bold text-indigo-600">{formatNumber(dashboard?.totalActiveSubscriptions || 0)}</p>
                  </div>
                </div>
              </div>


            </div>

            {/* Subscription & Revenue Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Overview</h3>
                <div className="space-y-4">
                  {/* Display subscription plans dynamically based on Subscription data */}
                  {dashboard?.subscriptions?.map((subscription: any, index: number) => (
                    <div 
                      key={subscription._id || index}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        subscription.planName?.toLowerCase().includes('basic') ? 'bg-gray-50' :
                        subscription.planName?.toLowerCase().includes('pro') ? 'bg-blue-50' :
                        subscription.planName?.toLowerCase().includes('enterprise') ? 'bg-purple-50' :
                        subscription.planName?.toLowerCase().includes('lifetime') ? 'bg-green-50' :
                        'bg-gray-50'
                      }`}
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {subscription.planName || 'Unknown Plan'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {subscription.totalUsers || subscription.count || 0} active subscribers
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          {formatCurrency(subscription.totalAmount || 0)}
                        </p>
                        <p className="text-sm text-gray-500">Total Revenue</p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Show message if no subscriptions found */}
                  {(!dashboard?.subscriptions || dashboard.subscriptions.length === 0) && (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <i className="fas fa-chart-line text-gray-400"></i>
                      </div>
                      <p className="text-gray-500 font-medium">No active subscriptions</p>
                      <p className="text-sm text-gray-400 mt-1">Active subscriptions will appear here</p>
                    </div>
                  )}
                  
                  {/* Summary Section */}
                  {dashboard?.subscriptions && dashboard.subscriptions.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">Total Active Subscriptions</p>
                          <p className="text-sm text-gray-500">
                            {dashboard.subscriptions.reduce((total: number, sub: any) => total + (sub.totalUsers || sub.count || 0), 0)} total subscribers
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">
                            {formatCurrency(dashboard.subscriptions.reduce((total: number, sub: any) => total + (sub.totalAmount || 0), 0))}
                          </p>
                          <p className="text-sm text-gray-500">Total Revenue</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Status Overview</h3>
                <div className="space-y-4">
                  {/* Enhanced Payment Status Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Approved Payments */}
                    <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-green-500 rounded-full mr-3 flex items-center justify-center">
                          <i className="fas fa-check text-white text-xs"></i>
                        </div>
                        <div>
                          <p className="font-semibold text-green-700">Approved</p>
                          <p className="text-sm text-green-600">
                            {dashboard?.payments?.find((p: any) => p._id === 'success')?.count || 0} transactions
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-700">
                          {formatCurrency(dashboard?.payments?.find((p: any) => p._id === 'success')?.totalAmount || 0)}
                        </p>
                        <p className="text-xs text-green-600">Total Amount</p>
                      </div>
                    </div>

                    {/* Rejected Payments */}
                    <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-red-500 rounded-full mr-3 flex items-center justify-center">
                          <i className="fas fa-times text-white text-xs"></i>
                        </div>
                        <div>
                          <p className="font-semibold text-red-700">Rejected</p>
                          <p className="text-sm text-red-600">
                            {dashboard?.payments?.find((p: any) => p._id === 'failed')?.count || 0} transactions
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-700">
                          {formatCurrency(dashboard?.payments?.find((p: any) => p._id === 'failed')?.totalAmount || 0)}
                        </p>
                        <p className="text-xs text-red-600">Failed Amount</p>
                      </div>
                    </div>

                    {/* Pending Payments */}
                    <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3 flex items-center justify-center">
                          <i className="fas fa-clock text-white text-xs"></i>
                        </div>
                        <div>
                          <p className="font-semibold text-yellow-700">Pending</p>
                          <p className="text-sm text-yellow-600">
                            {dashboard?.payments?.find((p: any) => p._id === 'pending')?.count || 0} transactions
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-yellow-700">
                          {formatCurrency(dashboard?.payments?.find((p: any) => p._id === 'pending')?.totalAmount || 0)}
                        </p>
                        <p className="text-xs text-yellow-600">Awaiting Approval</p>
                      </div>
                    </div>

                    {/* Deducted/Refunded Payments */}
                    <div className="flex items-center justify-between p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-purple-500 rounded-full mr-3 flex items-center justify-center">
                          <i className="fas fa-undo text-white text-xs"></i>
                        </div>
                        <div>
                          <p className="font-semibold text-purple-700">Deducted/Refunded</p>
                          <p className="text-sm text-purple-600">
                            {dashboard?.payments?.find((p: any) => p._id === 'refunded')?.count || 0} transactions
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-purple-700">
                          {formatCurrency(dashboard?.payments?.find((p: any) => p._id === 'refunded')?.totalAmount || 0)}
                        </p>
                        <p className="text-xs text-purple-600">Refunded Amount</p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-green-600">
                          {dashboard?.payments?.find((p: any) => p._id === 'success')?.count || 0}
                        </p>
                        <p className="text-xs text-gray-500">Approved</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-red-600">
                          {dashboard?.payments?.find((p: any) => p._id === 'failed')?.count || 0}
                        </p>
                        <p className="text-xs text-gray-500">Rejected</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-yellow-600">
                          {dashboard?.payments?.find((p: any) => p._id === 'pending')?.count || 0}
                        </p>
                        <p className="text-xs text-gray-500">Pending</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-600">
                          {dashboard?.payments?.find((p: any) => p._id === 'refunded')?.count || 0}
                        </p>
                        <p className="text-xs text-gray-500">Refunded</p>
              </div>
            </div>


                  </div>
                </div>
              </div>
            </div>

            {/* Top Performing Tools - Temporarily commented out */}
            {/* <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Tools</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dashboard?.topTools?.slice(0, 6).map((tool: any, index: number) => (
                  <div key={tool._id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                        <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                      </span>
                        <span className="font-medium text-gray-900 truncate">{tool._id}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">Usage</p>
                        <p className="font-bold text-gray-900">{formatNumber(tool.usageCount)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Users</p>
                        <p className="font-bold text-gray-900">{formatNumber(tool.uniqueUserCount)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}
              </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <UserTable />
          </div>
        </div>
      )}

        {activeTab === 'user-analytics' && (
          <div className="space-y-6">
            <UserAnalytics />
          </div>
        )}

        {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ToolUsageChart />
            <SessionAnalytics />
          </div>
          </div>
        )}
          
        {activeTab === 'revenue' && (
          <div className="space-y-6">
            <RevenueAnalytics />
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tool Usage Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats?.toolUsage?.map((tool: any) => (
                  <div key={tool._id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{tool._id}</h4>
                      <span className="text-sm text-gray-500">{formatNumber(tool.usageCount)} uses</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Unique Users:</span>
                        <span className="font-medium">{formatNumber(tool.uniqueUserCount)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Last Used:</span>
                        <span className="font-medium">{new Date(tool.lastUsed).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
          </div>
        </div>
        )}

        {activeTab === 'form-query' && (
          <FormQueryDashboard />
        )}

        {activeTab === 'support' && (
          <div className="space-y-6">
            <SupportDashboard />
          </div>
        )}
      </div>
    </div>
  );
} 