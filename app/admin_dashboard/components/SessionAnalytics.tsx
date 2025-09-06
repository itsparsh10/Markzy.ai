'use client';

import React, { useState, useEffect } from 'react';

interface SessionAnalytics {
  _id: string; // Date string
  dailySessions: number;
  dailyDuration: number;
  dailyUniqueUsers: number;
}

export default function SessionAnalytics() {
  const [analytics, setAnalytics] = useState<SessionAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSessionAnalytics();
  }, []);

  const fetchSessionAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/stats?type=sessionAnalytics');
      const data = await response.json();
      
      if (data.success) {
        setAnalytics(data.data);
      } else {
        setError('Failed to load session analytics');
      }
    } catch (error) {
      console.error('Error fetching session analytics:', error);
      setError('Failed to load session analytics');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return '0s';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return `${Math.round(seconds)}s`;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const maxSessions = Math.max(...analytics.map(day => day.dailySessions), 1);
  const maxUsers = Math.max(...analytics.map(day => day.dailyUniqueUsers), 1);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(7)].map((_, i) => (
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
          <h2 className="text-xl font-semibold text-gray-900">Session Analytics</h2>
          <button
            onClick={fetchSessionAnalytics}
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
        {analytics.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No session data available</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {analytics.reduce((sum, day) => sum + day.dailySessions, 0)}
                </p>
                <p className="text-sm text-gray-500">Total Sessions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {Math.max(...analytics.map(day => day.dailyUniqueUsers))}
                </p>
                <p className="text-sm text-gray-500">Peak Daily Users</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {formatDuration(analytics.reduce((sum, day) => sum + day.dailyDuration, 0))}
                </p>
                <p className="text-sm text-gray-500">Total Duration</p>
              </div>
            </div>

            {/* Chart */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Last 30 Days Activity</h3>
              
              <div className="space-y-3">
                {analytics.slice(-7).map((day) => (
                  <div key={day._id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">
                        {formatDate(day._id)}
                      </span>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {day.dailySessions} sessions
                        </p>
                        <p className="text-xs text-gray-500">
                          {day.dailyUniqueUsers} users
                        </p>
                      </div>
                    </div>
                    
                    {/* Sessions Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Sessions</span>
                        <span>{Math.round((day.dailySessions / maxSessions) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(day.dailySessions / maxSessions) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Users Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Users</span>
                        <span>{Math.round((day.dailyUniqueUsers / maxUsers) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(day.dailyUniqueUsers / maxUsers) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Avg duration: {formatDuration(day.dailyDuration / Math.max(day.dailySessions, 1))}
                    </div>
                  </div>
                ))}
              </div>
              
              {analytics.length > 7 && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 text-center">
                    Showing last 7 days of {analytics.length} total days
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 