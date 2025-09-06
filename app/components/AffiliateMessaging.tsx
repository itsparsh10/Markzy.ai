import { useState } from 'react';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

export default function AffiliateMessaging({ onBackClick }: { onBackClick: () => void }) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history' | 'result'>('generate');
  const [messagingDetails, setMessagingDetails] = useState('');
  const [engagementStrategy, setEngagementStrategy] = useState('');
  const [contentRepurposing, setContentRepurposing] = useState('');
  const [generatedMessage, setGeneratedMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  // Real-time validation state
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});

  const validateField = (fieldName: string, value: string) => {
    if (!value.trim()) {
      setFieldErrors(prev => ({
        ...prev,
        [fieldName]: 'This field is required'
      }));
    } else if (value.trim().length < 10) {
      setFieldErrors(prev => ({
        ...prev,
        [fieldName]: 'Please provide at least 10 characters for better results'
      }));
    } else {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleInputChange = (fieldName: string, value: string) => {
    switch(fieldName) {
      case 'messagingDetails':
        setMessagingDetails(value);
        break;
      case 'engagementStrategy':
        setEngagementStrategy(value);
        break;
      case 'contentRepurposing':
        setContentRepurposing(value);
        break;
    }
    
    // Validate field in real-time
    validateField(fieldName, value);
    
    // Clear main error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleGenerateMessage = async () => {
    // Comprehensive validation
    const requiredFields = [
      { name: 'messagingDetails', value: messagingDetails, label: 'Message Details' },
      { name: 'engagementStrategy', value: engagementStrategy, label: 'Engagement Strategy' },
      { name: 'contentRepurposing', value: contentRepurposing, label: 'Content Repurposing Ideas' }
    ];
    
    const missingFields = requiredFields.filter(field => !field.value.trim());
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.map(f => f.label).join(', ')}`);
      return;
    }

    // Validate minimum content length
    const insufficientFields = requiredFields.filter(field => field.value.trim().length < 10);
    if (insufficientFields.length > 0) {
      setError(`Please provide more detailed content for: ${insufficientFields.map(f => f.label).join(', ')}`);
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedMessage(null);

    try {
      // Simulate API call
      setTimeout(async () => {
        const response = `
🎯 Affiliate Messaging Strategy

📝 Core Message:
${messagingDetails}

🚀 Engagement Approach:
${engagementStrategy}

♻️ Content Repurposing Plan:
${contentRepurposing}

#affiliate #marketing #strategy`;
        
        setGeneratedMessage(response);
        setActiveTab('result');
        
        // Save to tool history silently
        try {
          await saveToolHistorySilent({
            toolName: 'Affiliate Messaging',
            toolId: 'affiliate-messaging',
            outputResult: { message: response },
            prompt: JSON.stringify({ messagingDetails, engagementStrategy, contentRepurposing })
          });
          console.log('✅ Affiliate messaging saved to history');
        } catch (historyError) {
          console.warn('⚠️ Failed to save to history:', historyError);
        }
        setLoading(false);
      }, 1200);
    } catch (error) {
      console.error('Error generating message:', error);
      setError('Failed to generate message. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Glassmorphic Header with blue gradient */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-comment text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Affiliate Messaging Strategy</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create compelling messaging for your affiliate partners</p>
            </div>
            <div className="flex items-center gap-3 z-10">
              <span className="text-xs bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/30 flex items-center font-semibold text-white/90">
                <i className="fas fa-clock mr-1"></i> 3 min
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
          
          {/* Content area with tabs */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-b from-blue-50/50 to-white">
            {/* Tabs navigation */}
            <div className="flex justify-between items-center px-4 py-2 border-b border-blue-100 bg-white sticky top-0 z-20 shadow-sm">
              <div className="flex space-x-1 relative">
                <button 
                  onClick={() => setActiveTab('generate')}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${activeTab === 'generate' ? 'text-blue-700 bg-blue-50/70' : 'text-blue-500 hover:text-blue-600'}`}
                >
                  <span className="flex items-center gap-2">
                    <i className="fas fa-magic text-xs"></i>
                    Generate
                  </span>
                  {activeTab === 'generate' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>}
                </button>
                {generatedMessage && (
                  <button 
                    onClick={() => setActiveTab('result')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${activeTab === 'result' ? 'text-blue-700 bg-blue-50/70' : 'text-blue-500 hover:text-blue-600'}`}
                  >
                    <span className="flex items-center gap-2">
                      <i className="fas fa-check-circle text-xs"></i>
                      Generated Message
                    </span>
                    {activeTab === 'result' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>}
                  </button>
                )}
                <button 
                  onClick={() => setActiveTab('templates')}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${activeTab === 'templates' ? 'text-blue-700 bg-blue-50/70' : 'text-blue-500 hover:text-blue-600'}`}
                >
                  <span className="flex items-center gap-2">
                    <i className="fas fa-layer-group text-xs"></i>
                    Templates
                  </span>
                  {activeTab === 'templates' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>}
                </button>
                <button 
                  onClick={() => setActiveTab('history')}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${activeTab === 'history' ? 'text-blue-700 bg-blue-50/70' : 'text-blue-500 hover:text-blue-600'}`}
                >
                  <span className="flex items-center gap-2">
                    <i className="fas fa-history text-xs"></i>
                    History
                  </span>
                  {activeTab === 'history' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>}
                </button>
              </div>
              <button className="px-3 py-1.5 text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all flex items-center gap-1 border border-blue-100">
                <i className="fas fa-save text-xs"></i> Save as Template
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-4 pt-3">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Success notification - only show briefly after generation */}
              {generatedMessage && activeTab === 'generate' && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <i className="fas fa-check text-green-600 text-sm"></i>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-green-900">Messaging Generated Successfully!</h4>
                        <p className="text-xs text-green-700 mt-1">Your affiliate messaging strategy is ready to view.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveTab('result')}
                      className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
                    >
                      View Message
                      <i className="fas fa-arrow-right text-xs"></i>
                    </button>
                  </div>
                </div>
              )}
              
              {activeTab === 'result' && generatedMessage && (
                <div className="space-y-4 max-h-[65vh] overflow-y-auto">
                  {/* Header Section */}
                  <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <i className="fas fa-comment text-blue-600 text-lg"></i>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">Affiliate Messaging Strategy</h4>
                        <p className="text-sm text-gray-600">Ready to implement</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => navigator.clipboard.writeText(generatedMessage)}
                        className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2"
                      >
                        <i className="fas fa-copy"></i>
                        Copy All
                      </button>
                      <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2">
                        <i className="fas fa-download"></i>
                        Export
                      </button>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <i className="fas fa-comment-alt text-gray-600"></i>
                        <span className="text-sm font-semibold text-gray-700">Generated Message</span>
                      </div>
                      <button 
                        onClick={() => navigator.clipboard.writeText(generatedMessage)}
                        className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <i className="fas fa-copy"></i>
                      </button>
                    </div>
                    <div className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                      {generatedMessage}
                    </div>
                  </div>
                </div>
              )}

              {/* Generate Tab Content */}
              {activeTab === 'generate' && (
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                  <div className="bg-blue-50 rounded-lg border border-blue-100 p-4">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Messaging Information</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="messagingDetails">
                          Message Details <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="messagingDetails"
                          className={`w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-100 bg-white transition-all min-h-[70px] max-h-[160px] resize-vertical ${
                            fieldErrors.messagingDetails 
                              ? 'border-red-300 focus:border-red-400' 
                              : 'border-blue-200 focus:border-blue-400'
                          }`}
                          placeholder="Describe your affiliate messaging details here..."
                          value={messagingDetails}
                          onChange={e => handleInputChange('messagingDetails', e.target.value)}
                        />
                        {fieldErrors.messagingDetails && (
                          <p className="text-xs text-red-600 flex items-center gap-1">
                            <i className="fas fa-exclamation-triangle"></i>
                            {fieldErrors.messagingDetails}
                          </p>
                        )}
                        <p className="text-xs text-blue-600">Provide details for your affiliate messaging strategy.</p>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="engagementStrategy">
                          Engagement Strategy <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="engagementStrategy"
                          className={`w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-100 bg-white transition-all min-h-[70px] max-h-[160px] resize-vertical ${
                            fieldErrors.engagementStrategy 
                              ? 'border-red-300 focus:border-red-400' 
                              : 'border-blue-200 focus:border-blue-400'
                          }`}
                          placeholder="Outline your engagement strategy here..."
                          value={engagementStrategy}
                          onChange={e => handleInputChange('engagementStrategy', e.target.value)}
                        />
                        {fieldErrors.engagementStrategy && (
                          <p className="text-xs text-red-600 flex items-center gap-1">
                            <i className="fas fa-exclamation-triangle"></i>
                            {fieldErrors.engagementStrategy}
                          </p>
                        )}
                        <p className="text-xs text-blue-600">Provide a detailed engagement strategy for your affiliates.</p>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="contentRepurposing">
                          Content Repurposing Ideas <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="contentRepurposing"
                          className={`w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-100 bg-white transition-all min-h-[70px] max-h-[160px] resize-vertical ${
                            fieldErrors.contentRepurposing 
                              ? 'border-red-300 focus:border-red-400' 
                              : 'border-blue-200 focus:border-blue-400'
                          }`}
                          placeholder="List your content repurposing ideas here..."
                          value={contentRepurposing}
                          onChange={e => handleInputChange('contentRepurposing', e.target.value)}
                        />
                        {fieldErrors.contentRepurposing && (
                          <p className="text-xs text-red-600 flex items-center gap-1">
                            <i className="fas fa-exclamation-triangle"></i>
                            {fieldErrors.contentRepurposing}
                          </p>
                        )}
                        <p className="text-xs text-blue-600">List ideas to repurpose content for different platforms.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Templates Tab Content */}
              {activeTab === 'templates' && (
                <div className="text-center py-10 text-gray-500">Templates feature coming soon.</div>
              )}

              {/* History Tab Content */}
              {activeTab === 'history' && (
                <div className="py-4">
                  <History toolName="Affiliate Messaging" />
                </div>
              )}
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="mt-auto flex justify-between items-center px-4 py-3 border-t border-blue-100">
            <button 
              className="group flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-all px-3 py-1.5 rounded-lg hover:bg-blue-50/50" 
              onClick={onBackClick}
            >
              <i className="fas fa-arrow-left text-xs group-hover:-translate-x-0.5 transition-transform"></i>
              <span>Back to All Tools</span>
            </button>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleGenerateMessage}
                disabled={loading}
                className="px-5 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin text-xs"></i>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Message</span>
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
