'use client';

import React, { useState } from 'react';

interface ToolLayoutProps {
  title: string;
  description: string;
  icon: string;
  estimatedTime: string;
  onBackClick: () => void;
  children: React.ReactNode;
  generateAction: () => Promise<any>;
  renderResult?: (result: any) => React.ReactNode;
  isLoading?: boolean;
  error?: string;
  result?: any;
}

export default function ToolLayout({
  title,
  description,
  icon,
  estimatedTime,
  onBackClick,
  children,
  generateAction,
  renderResult,
  isLoading = false,
  error = '',
  result = null
}: ToolLayoutProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history' | 'result'>('generate');
  const [internalLoading, setInternalLoading] = useState(false);
  const [internalError, setInternalError] = useState('');
  const [internalResult, setInternalResult] = useState<any>(null);

  // Use internal state if not provided via props
  const currentLoading = isLoading || internalLoading;
  const currentError = error || internalError;
  const currentResult = result || internalResult;

  const handleGenerate = async () => {
    setInternalLoading(true);
    setInternalError('');
    
    try {
      const result = await generateAction();
      setInternalResult(result);
      setActiveTab('result');
    } catch (err: any) {
      console.error('Generation error:', err);
      setInternalError(err.message || 'Failed to generate content. Please try again.');
    } finally {
      setInternalLoading(false);
    }
  };

  const renderTemplatesTab = () => {
    const templates = [
      { name: "Professional Template", icon: "fas fa-briefcase", description: "Business-focused content strategy" },
      { name: "Creative Template", icon: "fas fa-palette", description: "Creative and engaging content approach" },
      { name: "Educational Template", icon: "fas fa-graduation-cap", description: "Educational and informative content" },
      { name: "Promotional Template", icon: "fas fa-megaphone", description: "Sales and promotion focused strategy" },
      { name: "Community Template", icon: "fas fa-users", description: "Community building and engagement" },
      { name: "Brand Awareness Template", icon: "fas fa-eye", description: "Brand visibility and recognition" }
    ];

    return (
      <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
        {templates.map((template, index) => (
          <div key={index} className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
                <i className={`${template.icon} text-blue-600`}></i>
              </div>
              <div>
                <h4 className="font-medium text-blue-900">{template.name}</h4>
                <p className="text-xs text-blue-600">{template.description}</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('generate')}
              className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1"
            >
              Use Template
            </button>
          </div>
        ))}
      </div>
    );
  };

  const renderHistoryTab = () => {
    return (
      <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
        <div className="flex items-center justify-center py-8">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-clock text-blue-600 text-xl"></i>
            </div>
            <h3 className="text-blue-900 font-medium">History</h3>
            <p className="text-sm text-blue-700 max-w-md">View your previously generated content and reuse or modify as needed.</p>
            <button className="mt-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 hover:bg-blue-100 transition-all duration-200 text-sm">
              <i className="fas fa-clock mr-2"></i>View History
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDefaultResult = (result: any) => {
    if (!result) return null;

    return (
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="text-base font-medium text-green-900 mb-2">✅ Content Generated Successfully!</h4>
          <p className="text-sm text-green-700">Your content is ready for use.</p>
        </div>
        
        <div className="p-4 bg-white border border-blue-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-blue-900">📄 Generated Content</h4>
            <div className="flex gap-2">
              <button 
                onClick={() => navigator.clipboard.writeText(typeof result === 'string' ? result : JSON.stringify(result, null, 2))}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-all"
              >
                📋 Copy
              </button>
              <button className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-all">
                📄 Export
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            {typeof result === 'string' ? (
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {result}
              </div>
            ) : (
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {JSON.stringify(result, null, 2)}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Header */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className={`${icon} text-blue-100 text-3xl`}></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">{title}</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">{description}</p>
            </div>
            <div className="flex items-center gap-3 z-10">
              <span className="text-xs bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/30 flex items-center font-semibold text-white/90">
                <i className="fas fa-clock mr-1"></i> {estimatedTime}
              </span>
              <button 
                className="rounded-full transition-all duration-200 border-2 border-white bg-gradient-to-br from-blue-600 to-blue-400 text-white hover:from-blue-700 hover:to-blue-500 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-200 z-20"
                style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                aria-label="Close"
                onClick={onBackClick}
              >
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex justify-between items-center px-4 py-2 border-b border-blue-100 bg-white sticky top-0 z-20 shadow-sm">
            <div className="flex space-x-1 relative">
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${
                  activeTab === 'generate' ? 'text-blue-700 bg-blue-50/70' : 'text-blue-500 hover:text-blue-600'
                }`}
                onClick={() => setActiveTab('generate')}
              >
                <span className="flex items-center gap-2">
                  <i className="fas fa-magic text-xs"></i>Generate
                </span>
                {activeTab === 'generate' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>}
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${
                  activeTab === 'templates' ? 'text-blue-700 bg-blue-50/70' : 'text-blue-500 hover:text-blue-600'
                }`}
                onClick={() => setActiveTab('templates')}
              >
                <span className="flex items-center gap-2">
                  <i className="fas fa-layer-group text-xs"></i>Templates
                </span>
                {activeTab === 'templates' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>}
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${
                  activeTab === 'history' ? 'text-blue-700 bg-blue-50/70' : 'text-blue-500 hover:text-blue-600'
                }`}
                onClick={() => setActiveTab('history')}
              >
                <span className="flex items-center gap-2">
                  <i className="fas fa-history text-xs"></i>History
                </span>
                {activeTab === 'history' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>}
              </button>
              {currentResult && (
                <button 
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${
                    activeTab === 'result' ? 'text-blue-700 bg-blue-50/70' : 'text-blue-500 hover:text-blue-600'
                  }`}
                  onClick={() => setActiveTab('result')}
                >
                  <span className="flex items-center gap-2">
                    <i className="fas fa-check text-xs"></i>Result
                  </span>
                  {activeTab === 'result' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>}
                </button>
              )}
            </div>
            <button className="px-3 py-1.5 text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all flex items-center gap-1 border border-blue-100">
              <i className="fas fa-save text-xs"></i> Save as Template
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-b from-blue-50/50 to-white">
            <div className="p-4 pt-3">
              {currentError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{currentError}</p>
                </div>
              )}

              {activeTab === 'generate' && (
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                  {children}
                </div>
              )}

              {activeTab === 'templates' && renderTemplatesTab()}
              {activeTab === 'history' && renderHistoryTab()}
              
              {activeTab === 'result' && currentResult && (
                renderResult ? renderResult(currentResult) : renderDefaultResult(currentResult)
              )}
            </div>
          </div>

          {/* Footer with Generate Button */}
          <div className="mt-auto flex justify-between items-center px-4 py-3 border-t border-blue-100">
            <button 
              className="group flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-all px-3 py-1.5 rounded-lg hover:bg-blue-50/50" 
              onClick={onBackClick}
            >
              <i className="fas fa-arrow-left text-xs group-hover:-translate-x-0.5 transition-transform"></i>
              <span>Back to All Tools</span>
            </button>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-sm text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-all shadow-sm hover:shadow">
                Save Draft
              </button>
              <button 
                onClick={handleGenerate}
                disabled={currentLoading}
                className={`px-5 py-2 text-sm text-white rounded-lg transition-all flex items-center gap-2 shadow-md hover:shadow-lg ${
                  currentLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600'
                }`}
              >
                {currentLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <span>Generate</span>
                    <i className="fas fa-arrow-right text-xs group-hover:translate-x-0.5 transition-transform"></i>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
