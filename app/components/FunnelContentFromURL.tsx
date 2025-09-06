'use client';

import React, { useState } from 'react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface FunnelContentFromURLProps {
  onBackClick: () => void;
}

export default function FunnelContentFromURL({ onBackClick }: FunnelContentFromURLProps) {
  // State for active tab
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  
  // State for form inputs
  const [inputs, setInputs] = useState({
    page_url: '',
    funnel_stage: '',
    target_audience: '',
    content_goal: '',
    tone_style: 'Professional',
    content_type: '',
    key_messages: '',
    primary_call_to_action: '',
    competitor_analysis: ''
  });

  // State for API interaction
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState<string | null>(null);

  // Funnel template types with appropriate icons
  const funnelTemplates = [
    { name: "Awareness Stage", icon: "fas fa-eye", description: "Create content to attract and educate prospects about problems." },
    { name: "Interest Stage", icon: "fas fa-heart", description: "Generate content to build interest and engagement with solutions." },
    { name: "Consideration Stage", icon: "fas fa-balance-scale", description: "Develop content to help prospects evaluate and compare options." },
    { name: "Purchase Stage", icon: "fas fa-shopping-cart", description: "Create content to drive conversion and sales decisions." },
    { name: "Retention Stage", icon: "fas fa-user-check", description: "Build content to retain and delight existing customers." },
    { name: "Advocacy Stage", icon: "fas fa-bullhorn", description: "Encourage customers to become brand advocates and referrers." }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const generateContent = async () => {
    // Validate required fields
    const requiredFields = [
      'page_url',
      'funnel_stage',
      'content_type',
      'target_audience',
      'content_goal',
      'tone_style',
      'primary_call_to_action',
      'key_messages'
    ] as const;
    
    const missingFields = requiredFields.filter(field => !inputs[field as keyof typeof inputs] || inputs[field as keyof typeof inputs].trim() === '');
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Clean and prepare the data for API
    const cleanedData = {
      ...inputs,
      page_url: inputs.page_url.trim(),
      funnel_stage: inputs.funnel_stage === 'consideration' ? 'Consideration' : inputs.funnel_stage,
      content_type: inputs.content_type === 'landing-page' ? 'Landing Page Copy' : inputs.content_type,
      tone_style: inputs.tone_style === 'professional' ? 'Professional' : inputs.tone_style
    };

    // Log the data being sent
    console.log('Sending funnel content data:', JSON.stringify(cleanedData, null, 2));

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await aiToolsService.generateFunnelContent(cleanedData);
      setResults(response);
      
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Funnel Content From URL',
          toolId: 'funnel-content-from-url',
          outputResult: response,
          prompt: JSON.stringify(cleanedData)
        });
        console.log('✅ Funnel content from URL saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
      console.log('Funnel content generated successfully:', response);
    } catch (err: any) {
      console.error('Error generating funnel content:', err);
      console.error('Input data that was sent:', JSON.stringify(cleanedData, null, 2));
      setError(err.message || 'Failed to generate content. Please try again.');
    } finally {
      setIsLoading(false);
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
              <i className="fas fa-funnel-dollar text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Funnel Content from a Page URL</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Analyze any page and create targeted funnel content</p>
            </div>
            <div className="flex items-center gap-3 z-10">
              <span className="text-xs bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/30 flex items-center font-semibold text-white/90">
                <i className="fas fa-clock mr-1"></i> 4 min
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
              {activeTab === 'generate' && (
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Page URL & Analysis</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="pageUrl">Page URL to Analyze</label>
                        <input 
                          id="pageUrl" 
                          name="page_url"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all" 
                          placeholder="https://example.com/page-to-analyze"
                          type="url"
                          value={inputs.page_url}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="funnelStage">Target Funnel Stage</label>
                          <select
                            id="funnelStage"
                            name="funnel_stage"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                            value={inputs.funnel_stage}
                            onChange={handleInputChange}
                          >
                            <option value="">Select funnel stage</option>
                            <option value="Awareness">Awareness Stage</option>
                            <option value="Interest">Interest Stage</option>
                            <option value="Consideration">Consideration Stage</option>
                            <option value="Purchase">Purchase Stage</option>
                            <option value="Retention">Retention Stage</option>
                            <option value="Advocacy">Advocacy Stage</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="contentType">Content Type to Create</label>
                          <select
                            id="contentType"
                            name="content_type"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                            value={inputs.content_type}
                            onChange={handleInputChange}
                          >
                            <option value="">Choose content type</option>
                            <option value="Email Campaign">Email Campaign</option>
                            <option value="Blog Post">Blog Post</option>
                            <option value="Social Media Posts">Social Media Posts</option>
                            <option value="Landing Page Copy">Landing Page Copy</option>
                            <option value="Ad Copy">Ad Copy</option>
                            <option value="Lead Magnet">Lead Magnet</option>
                            <option value="Webinar Content">Webinar Content</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Target Audience & Goals</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="targetAudience">Target Audience</label>
                        <textarea 
                          id="targetAudience" 
                          name="target_audience"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Describe your target audience for this funnel stage (demographics, interests, pain points)..."
                          value={inputs.target_audience}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="contentGoal">Content Goal</label>
                        <textarea 
                          id="contentGoal" 
                          name="content_goal"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="What specific outcome do you want to achieve with this content? (awareness, engagement, conversion, etc.)"
                          value={inputs.content_goal}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="toneStyle">Tone & Style</label>
                          <select
                            id="toneStyle"
                            name="tone_style"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                            value={inputs.tone_style}
                            onChange={handleInputChange}
                          >
                            <option value="Professional">Professional</option>
                            <option value="Friendly">Friendly</option>
                            <option value="Casual">Casual</option>
                            <option value="Persuasive">Persuasive</option>
                            <option value="Urgent">Urgent</option>
                            <option value="Educational">Educational</option>
                            <option value="Inspirational">Inspirational</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="callToAction">Primary Call to Action</label>
                          <input 
                            id="callToAction" 
                            name="primary_call_to_action"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all" 
                            placeholder="e.g., Learn More, Sign Up, Buy Now"
                            type="text"
                            value={inputs.primary_call_to_action}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Content Strategy & Messaging</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="keyMessages">Key Messages to Convey</label>
                        <textarea 
                          id="keyMessages" 
                          name="key_messages"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="List the key messages, value propositions, or benefits you want to highlight..."
                          value={inputs.key_messages}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="competitorAnalysis">Competitor Analysis (optional)</label>
                        <textarea 
                          id="competitorAnalysis" 
                          name="competitor_analysis"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="Mention any competitors or alternative solutions your audience might consider..."
                          value={inputs.competitor_analysis}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Error Display */}
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700">
                    <i className="fas fa-exclamation-triangle text-sm"></i>
                    <span className="text-sm font-medium">Error</span>
                  </div>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
              )}

              {/* Results Display */}
              {results && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700 mb-3">
                    <i className="fas fa-check-circle text-sm"></i>
                    <span className="text-sm font-medium">Generated Content</span>
                  </div>
                  <div className="text-sm text-green-800 whitespace-pre-wrap">
                    {typeof results === 'string' ? results : JSON.stringify(results, null, 2)}
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && (
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {funnelTemplates.map((template, index) => (
                    <div key={index} className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group">
                      <div className="flex items-center justify-between">
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
                          onClick={() => {
                            setInputs(prev => ({ ...prev, funnel_stage: template.name.replace(' Stage', '') }));
                            setActiveTab('generate');
                          }}
                          className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1"
                        >
                          Create
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {activeTab === 'history' && (
                <div className="py-4">
                  <History toolName="Funnel Content From URL" />
                </div>
              )}
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
                <button className="px-4 py-2 text-sm text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-all shadow-sm hover:shadow">
                  Save Draft
                </button>
                <button 
                  className="px-5 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={generateContent}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin text-xs"></i>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Content</span>
                      <i className="fas fa-arrow-right text-xs group-hover:translate-x-0.5 transition-transform"></i>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
