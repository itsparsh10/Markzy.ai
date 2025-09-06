"use client";

import React, { useEffect, useState } from "react";
import { getToolHistory } from "@/services/toolHistoryService_global";

type HistoryEntry = {
  id: string;
  toolName: string;
  outputResult: any;
  prompt?: string;
  generatedDate: string;
};

type HistoryTableProps = {
  toolName?: string;
  userId?: string;
};

const HistoryTable: React.FC<HistoryTableProps> = ({ toolName, userId: passedUserId }) => {
  const [userId, setUserId] = useState<string | null>(passedUserId || null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!userId) {
      const userData = localStorage.getItem("userData");
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          setUserId(parsed._id || parsed.id || null);
        } catch (err) {
          console.warn("⚠️ Failed to parse userData from localStorage");
        }
      }
    }
  }, [userId]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!userId) return;
      setLoading(true);
      const data = await getToolHistory(userId, toolName);
      setHistory(data);
      setLoading(false);
    };

    fetchHistory();
  }, [toolName, userId]);

  const toggleRowExpansion = (itemId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedRows(newExpanded);
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const formatOutput = (output: any, isExpanded: boolean = false) => {
    if (typeof output === "string") {
      return output;
    }
    
    if (isExpanded && typeof output === "object" && output !== null) {
      // Check if it's a social media plan structure
      if (output.plan && Array.isArray(output.plan)) {
        return renderSocialMediaPlan(output);
      }
      // Create a structured display for other objects
      return renderStructuredOutput(output);
    }
    
    // For collapsed view, just show a simple string representation
    if (typeof output === "object" && output !== null) {
      if (output.plan && Array.isArray(output.plan)) {
        return `Social Media Plan with ${output.plan.length} days`;
      }
      if (Array.isArray(output)) {
        return `Array with ${output.length} items`;
      }
      const keys = Object.keys(output);
      return `Object with ${keys.length} properties: ${keys.slice(0, 3).join(', ')}${keys.length > 3 ? '...' : ''}`;
    }
    
    return String(output);
  };

  const renderSocialMediaPlan = (planData: any): JSX.Element => {
    if (!planData.plan || !Array.isArray(planData.plan)) {
      return <div className="text-gray-600">Invalid plan format</div>;
    }

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
            <i className="fas fa-calendar-alt text-blue-600 text-xs"></i>
          </div>
          <h4 className="font-medium text-gray-900">30-Day Social Media Plan</h4>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
            {planData.plan.length} days
          </span>
        </div>
        
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {planData.plan.map((dayPlan: any, index: number) => (
            <div key={index} className="border border-gray-200 rounded-lg p-3 bg-white">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-medium">
                    {dayPlan.day || index + 1}
                  </span>
                  <span className="font-medium text-gray-900 text-sm">Day {dayPlan.day || index + 1}</span>
                </div>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                  {dayPlan.content_format || 'Post'}
                </span>
              </div>
              
              <div className="space-y-2">
                {dayPlan.post_idea && (
                  <div>
                    <span className="text-xs font-medium text-gray-600">Post Idea:</span>
                    <p className="text-xs text-gray-800 bg-gray-50 p-2 rounded mt-1">
                      {dayPlan.post_idea}
                    </p>
                  </div>
                )}
                
                {dayPlan.caption && (
                  <div>
                    <span className="text-xs font-medium text-gray-600">Caption:</span>
                    <p className="text-xs text-gray-800 bg-gray-50 p-2 rounded mt-1 italic">
                      "{dayPlan.caption}"
                    </p>
                  </div>
                )}
                
                {dayPlan.hashtags && Array.isArray(dayPlan.hashtags) && (
                  <div>
                    <span className="text-xs font-medium text-gray-600">Hashtags:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {dayPlan.hashtags.map((hashtag: string, hashtagIndex: number) => (
                        <span key={hashtagIndex} className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                          #{hashtag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {dayPlan.call_to_action && (
                  <div>
                    <span className="text-xs font-medium text-gray-600">CTA:</span>
                    <p className="text-xs text-gray-800 bg-gray-50 p-2 rounded mt-1">
                      {dayPlan.call_to_action}
                    </p>
                  </div>
                )}
                
                {dayPlan.engagement_tactic && (
                  <div>
                    <span className="text-xs font-medium text-gray-600">Engagement:</span>
                    <p className="text-xs text-gray-800 bg-gray-50 p-2 rounded mt-1">
                      {dayPlan.engagement_tactic}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStructuredOutput = (obj: any, level: number = 0): JSX.Element => {
    if (obj === null) return <span className="text-gray-500">null</span>;
    if (typeof obj === "boolean") return <span className="text-blue-600">{String(obj)}</span>;
    if (typeof obj === "number") return <span className="text-green-600">{obj}</span>;
    if (typeof obj === "string") return <span className="text-gray-700">"{obj}"</span>;
    
    if (Array.isArray(obj)) {
      return (
        <div>
          <span className="text-gray-600 font-medium">Array ({obj.length} items):</span>
          <div className="ml-4 mt-1 space-y-1">
            {obj.slice(0, 5).map((item, index) => (
              <div key={index} className="flex">
                <span className="text-gray-400 mr-2">[{index}]</span>
                {renderStructuredOutput(item, level + 1)}
              </div>
            ))}
            {obj.length > 5 && (
              <div className="text-xs text-gray-500 ml-6">... and {obj.length - 5} more items</div>
            )}
          </div>
        </div>
      );
    }
    
    if (typeof obj === "object") {
      const entries = Object.entries(obj);
      return (
        <div>
          <span className="text-gray-600 font-medium">Object ({entries.length} properties):</span>
          <div className="ml-4 mt-1 space-y-1">
            {entries.slice(0, 5).map(([key, value]) => (
              <div key={key} className="flex items-start">
                <span className="text-blue-700 font-medium mr-2 text-sm">{key}:</span>
                {renderStructuredOutput(value, level + 1)}
              </div>
            ))}
            {entries.length > 5 && (
              <div className="text-xs text-gray-500 ml-6">... and {entries.length - 5} more properties</div>
            )}
          </div>
        </div>
      );
    }
    
    return <span>{String(obj)}</span>;
  };

  // Loading State
  if (!userId) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No user ID found</p>
          <p className="text-sm text-gray-400 mt-1">Please log in to view history</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Loading history...</p>
          <p className="text-sm text-gray-400 mt-1">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  if (!history.length) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No history found</p>
          <p className="text-sm text-gray-400 mt-1">Your tool usage history will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tool Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Output
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {history.map((item, idx) => {
                  const isExpanded = expandedRows.has(item.id || idx.toString());
                  const outputText = formatOutput(item.outputResult, false);

                  return (
                    <tr key={item.id || idx} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex flex-col">
                          <span className="text-gray-900 font-medium">
                            {new Date(item.generatedDate).toLocaleDateString()}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {new Date(item.generatedDate).toLocaleTimeString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="max-w-xs">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {item.toolName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="max-w-md">
                          {isExpanded ? (
                            <div className="text-gray-700">
                              {typeof item.outputResult === "string" ? (
                                <div className="bg-gray-50 p-3 rounded-lg max-h-64 overflow-y-auto">
                                  <span className="whitespace-pre-wrap text-sm">{item.outputResult}</span>
                                </div>
                              ) : (
                                <div className="bg-gray-50 p-3 rounded-lg max-h-64 overflow-y-auto">
                                  {formatOutput(item.outputResult, true)}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-700">{truncateText(String(outputText), 100)}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleRowExpansion(item.id || idx.toString())}
                            className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
                          >
                            {isExpanded ? (
                              <>
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                                Less
                              </>
                            ) : (
                              <>
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                                More
                              </>
                            )}
                          </button>
                          
                          <button
                            onClick={() => {
                              const outputText = typeof item.outputResult === 'string' 
                                ? item.outputResult 
                                : JSON.stringify(item.outputResult, null, 2);
                              navigator.clipboard.writeText(outputText);
                            }}
                            className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
                            title="Copy output to clipboard"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy
                          </button>
                          
                          <button
                            onClick={() => {
                              const outputText = typeof item.outputResult === 'string' 
                                ? item.outputResult 
                                : JSON.stringify(item.outputResult, null, 2);
                              const blob = new Blob([outputText], { type: 'text/plain' });
                              const url = window.URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `${item.toolName.replace(/\s+/g, '_')}_${new Date(item.generatedDate).toISOString().split('T')[0]}.txt`;
                              document.body.appendChild(a);
                              a.click();
                              window.URL.revokeObjectURL(url);
                              document.body.removeChild(a);
                            }}
                            className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
                            title="Export output as file"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {history.map((item, idx) => {
          const isExpanded = expandedRows.has(item.id || idx.toString());
          const outputText = formatOutput(item.outputResult, false);

          return (
            <div
              key={item.id || idx}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(item.generatedDate).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(item.generatedDate).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {item.toolName}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleRowExpansion(item.id || idx.toString())}
                        className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-150"
                      >
                        {isExpanded ? (
                          <>
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                            Less
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            More
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => {
                          const outputText = typeof item.outputResult === 'string' 
                            ? item.outputResult 
                            : JSON.stringify(item.outputResult, null, 2);
                          navigator.clipboard.writeText(outputText);
                        }}
                        className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-150"
                        title="Copy output to clipboard"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={() => {
                          const outputText = typeof item.outputResult === 'string' 
                            ? item.outputResult 
                            : JSON.stringify(item.outputResult, null, 2);
                          const blob = new Blob([outputText], { type: 'text/plain' });
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${item.toolName.replace(/\s+/g, '_')}_${new Date(item.generatedDate).toISOString().split('T')[0]}.txt`;
                          document.body.appendChild(a);
                          a.click();
                          window.URL.revokeObjectURL(url);
                          document.body.removeChild(a);
                        }}
                        className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-150"
                        title="Export output as file"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                    Output
                  </h4>
                  {isExpanded ? (
                    <div className="text-gray-700">
                      {typeof item.outputResult === "string" ? (
                        <div className="bg-gray-50 p-3 rounded-lg max-h-64 overflow-y-auto">
                          <p className="whitespace-pre-wrap text-sm">{item.outputResult}</p>
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-3 rounded-lg max-h-64 overflow-y-auto">
                          {formatOutput(item.outputResult, true)}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700">{truncateText(String(outputText), 150)}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Results Count */}
      <div className="flex justify-center pt-4">
        <p className="text-sm text-gray-500">
          Showing {history.length} result{history.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
};

export default HistoryTable;