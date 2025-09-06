'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface GlobalHistorySectionProps {
  toolId: string;
  toolName: string;
  onSelectHistory?: (historyItem: any) => void;
}

interface HistoryItem {
  _id: string;
  toolName: string;
  toolId: string;
  outputResult: any;
  prompt?: string;
  generatedDate: string;
  userId: string;
}

export default function GlobalHistorySection({ 
  toolId, 
  toolName, 
  onSelectHistory 
}: GlobalHistorySectionProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedHistory, setSelectedHistory] = useState<HistoryItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user data from localStorage
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const userId = userData._id || userData.id;
      setCurrentUserId(userId);

      if (!userId) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      // Fetch history using the global service
      const toolHistoryService = await import('../../../services/toolHistoryService.js');
      const historyData = await toolHistoryService.default.getUserToolHistory(userId, { toolId });

      if (historyData?.success && historyData?.data) {
        setHistory(historyData.data as any);
      } else {
        setHistory([]);
      }
    } catch (error) {
      console.error('Error loading history:', error);
      setError('Failed to load history');
    } finally {
      setLoading(false);
    }
  }, [toolId]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleDeleteHistory = async (historyId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    if (!currentUserId) {
      alert('User not authenticated');
      return;
    }

    try {
      const toolHistoryService = await import('../../../services/toolHistoryService.js');
      const result = await toolHistoryService.default.deleteToolHistory(historyId, currentUserId);

      if (result && typeof result === 'object' && 'success' in result && result.success) {
        setHistory(prev => prev.filter(item => item._id !== historyId));
        if (selectedHistory?._id === historyId) {
          setSelectedHistory(null);
          setShowModal(false);
        }
      } else {
        alert('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting history:', error);
      alert('Error deleting item');
    }
  };

  const handleSelectHistory = (historyItem: HistoryItem) => {
    setSelectedHistory(historyItem);
    setShowModal(true);
    if (onSelectHistory) {
      onSelectHistory(historyItem);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatPreview = (outputResult: any) => {
    if (typeof outputResult === 'string') {
      return outputResult.substring(0, 100) + (outputResult.length > 100 ? '...' : '');
    }
    
    if (typeof outputResult === 'object') {
      const contentFields = ['content', 'story', 'body', 'subject', 'text', 'result'];
      for (const field of contentFields) {
        if (outputResult[field]) {
          const content = outputResult[field];
          if (typeof content === 'string') {
            return content.substring(0, 100) + (content.length > 100 ? '...' : '');
          }
        }
      }
      
      const jsonStr = JSON.stringify(outputResult);
      return jsonStr.substring(0, 100) + (jsonStr.length > 100 ? '...' : '');
    }
    
    return 'No preview available';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-blue-600 font-medium">Loading history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <i className="fas fa-exclamation-triangle text-red-500 text-xl"></i>
        </div>
        <h3 className="text-red-900 font-medium">Error Loading History</h3>
        <p className="text-sm text-red-700 text-center max-w-md">{error}</p>
        <button 
          onClick={loadHistory}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm"
        >
          <i className="fas fa-refresh mr-2"></i>Try Again
        </button>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="py-4 flex flex-col items-center justify-center text-center space-y-2">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <i className="fas fa-history text-blue-500 text-xl"></i>
        </div>
        <h3 className="text-blue-900 font-medium">{toolName} History</h3>
        <p className="text-sm text-blue-700 max-w-md">View your previously generated content and reuse or modify as needed.</p>
        <button 
          onClick={loadHistory}
          className="mt-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 hover:bg-blue-100 transition-all duration-200 text-sm"
        >
          <i className="fas fa-clock mr-2"></i>Refresh History
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-blue-900">
          <i className="fas fa-history mr-2 text-blue-600"></i>
          {toolName} History ({history.length})
        </h3>
        <button 
          onClick={loadHistory}
          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <i className="fas fa-refresh text-xs"></i>
          Refresh
        </button>
      </div>

      {/* History List */}
      <div className="space-y-3">
        {history.map((item) => (
          <div 
            key={item._id} 
            className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group"
            onClick={() => handleSelectHistory(item)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
                  <i className="fas fa-file-alt text-blue-600"></i>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900 text-sm">{toolName} Generation</h4>
                  <p className="text-xs text-blue-600 font-medium">{formatDate(item.generatedDate)}</p>
                  <p className="text-xs text-gray-600 mt-1">{formatPreview(item.outputResult)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(JSON.stringify(item.outputResult, null, 2));
                  }}
                  className="p-2 text-blue-600 hover:text-blue-800 transition-colors opacity-0 group-hover:opacity-100"
                  title="Copy to clipboard"
                >
                  <i className="fas fa-copy text-sm"></i>
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteHistory(item._id);
                  }}
                  className="p-2 text-red-600 hover:text-red-800 transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete"
                >
                  <i className="fas fa-trash text-sm"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedHistory && showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {toolName} - {formatDate(selectedHistory.generatedDate)}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Generated on {formatDate(selectedHistory.generatedDate)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => copyToClipboard(JSON.stringify(selectedHistory.outputResult, null, 2))}
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
                >
                  <i className="fas fa-copy text-xs"></i>
                  Copy All
                </button>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
            
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
              <div className="space-y-4">
                {selectedHistory.prompt && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-900 mb-3 flex items-center gap-2">
                      <i className="fas fa-lightbulb text-yellow-600"></i>
                      Original Prompt
                    </h4>
                    <div className="bg-white p-3 rounded border">
                      <p className="text-gray-700 text-sm whitespace-pre-wrap">
                        {selectedHistory.prompt}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <i className="fas fa-file-alt text-blue-600"></i>
                    Generated Content
                  </h4>
                  <div className="bg-white p-3 rounded border">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-auto">
                      {JSON.stringify(selectedHistory.outputResult, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 