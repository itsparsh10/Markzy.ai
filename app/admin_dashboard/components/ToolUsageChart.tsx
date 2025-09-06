'use client';

import React, { useState, useEffect } from 'react';

interface ToolUsage {
  _id: string;
  usageCount: number;
  totalDuration: number;
  uniqueUserCount: number;
  averageDuration: number;
}

export default function ToolUsageChart() {
  const [toolUsage, setToolUsage] = useState<ToolUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchToolUsage();
  }, []);

  const fetchToolUsage = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/stats?type=toolUsage');
      const data = await response.json();
      
      if (data.success) {
        setToolUsage(data.data);
      } else {
        setError('Failed to load tool usage data');
      }
    } catch (error) {
      console.error('Error fetching tool usage:', error);
      setError('Failed to load tool usage data');
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

  const maxUsage = Math.max(...toolUsage.map(tool => tool.usageCount), 1);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Tool Usage Statistics</h2>
          <button
            onClick={fetchToolUsage}
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="px-4 sm:px-6 py-4 bg-red-50 border-b border-red-200">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="p-4 sm:p-6">
        {toolUsage.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500">No tool usage data available</p>
          </div>
        ) : (
          <div className="space-y-3">
            {toolUsage.slice(0, 6).map((tool, index) => (
              <div key={tool._id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs sm:text-sm font-medium text-blue-600">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 truncate">{tool._id}</h3>
                      <p className="text-xs text-gray-500">
                        {tool.uniqueUserCount} users
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{tool.usageCount}</p>
                    <p className="text-xs text-gray-500">
                      uses
                    </p>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(tool.usageCount / maxUsage) * 100}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{Math.round((tool.usageCount / maxUsage) * 100)}% of max</span>
                </div>
              </div>
            ))}
            
            {toolUsage.length > 6 && (
              <div className="pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Showing top 6 of {toolUsage.length} tools
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 