'use client';

import React, { useState } from 'react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface ContentIdeasProps {
  onBackClick: () => void;
}

export default function ContentIdeas({ onBackClick }: ContentIdeasProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'result' | 'templates' | 'history'>('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [inputs, setInputs] = useState({
    contentTopic: '',
    industry: '',
    targetAudience: '',
    contentGoal: '',
    brandValues: '',
    competitorAnalysis: '',
    contentFormat: '',
    audienceProblems: '',
    uniqueAngle: '',
    contentFrequency: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateContentIdeas = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Map form inputs to API format
      const apiData = {
        content_topic: inputs.contentTopic,
        industry: inputs.industry,
        content_goal: inputs.contentGoal,
        preferred_format: inputs.contentFormat,
        target_audience: inputs.targetAudience,
        brand_values: inputs.brandValues,
        audience_problems: inputs.audienceProblems,
        unique_angle: inputs.uniqueAngle,
        content_frequency: inputs.contentFrequency,
        competitor_analysis: inputs.competitorAnalysis
      };

      console.log('Sending API data:', apiData);
      
      const response = await aiToolsService.generateContentIdeas(apiData);
      console.log('API Response received:', response);
      
      setResult(response);
      setActiveTab('result');
      
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Content Ideas',
          toolId: 'content-ideas',
          outputResult: response,
          prompt: JSON.stringify(apiData)
        });
        console.log('✅ Content ideas saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
    } catch (err: any) {
      console.error('Error generating content ideas:', err);
      console.error('Error details:', err.response?.data || err.message);
      setError(err.message || 'Failed to generate content ideas. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const contentTemplates = [
    { name: "Blog Post Ideas", icon: "fas fa-blog", description: "Generate engaging blog post topics for your audience." },
    { name: "Social Media Content", icon: "fas fa-share-alt", description: "Create social media post ideas across platforms." },
    { name: "Email Content Ideas", icon: "fas fa-envelope", description: "Develop email newsletter and campaign content." },
    { name: "Video Content", icon: "fas fa-video", description: "Plan video content for YouTube, TikTok, and other platforms." },
    { name: "Podcast Topics", icon: "fas fa-microphone", description: "Generate podcast episode ideas and talking points." },
    { name: "Educational Content", icon: "fas fa-graduation-cap", description: "Create how-to guides and educational materials." }
  ];

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Glassmorphic Header with blue gradient */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-lightbulb text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Content Ideas</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Generate fresh content ideas for your brand and marketing campaigns</p>
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
                {result && !error && (
                  <button 
                    onClick={() => setActiveTab('result')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${activeTab === 'result' ? 'text-blue-700 bg-blue-50/70' : 'text-blue-500 hover:text-blue-600'}`}
                  >
                    <span className="flex items-center gap-2">
                      <i className="fas fa-plus-circle text-xs"></i>
                      Generated Plan
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
              {activeTab === 'generate' && (
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                  {/* Success Banner */}
                  {result && !error && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <i className="fas fa-check text-green-600 text-sm"></i>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-green-800">Plan Generated Successfully!</h4>
                            <p className="text-xs text-green-600 mt-0.5">Your social media plan is ready to view.</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setActiveTab('result')}
                          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors duration-200"
                        >
                          View Plan
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Content Topic & Focus</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="contentTopic">Content Topic or Niche</label>
                          <input
                            id="contentTopic"
                            name="contentTopic"
                            type="text"
                            value={inputs.contentTopic}
                            onChange={handleInputChange}
                            placeholder="Enter your main topic or niche"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="industry">Industry</label>
                          <select
                            id="industry"
                            name="industry"
                            value={inputs.industry}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select your industry</option>
                            <option value="health">Health & Wellness</option>
                            <option value="finance">Finance & Investing</option>
                            <option value="ecommerce">E-commerce & Retail</option>
                            <option value="education">Education & Training</option>
                            <option value="technology">Technology & Software</option>
                            <option value="creative">Creative & Design</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="contentGoal">Content Goal</label>
                          <select
                            id="contentGoal"
                            name="contentGoal"
                            value={inputs.contentGoal}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select primary goal</option>
                            <option value="educate">Educate audience</option>
                            <option value="sales">Drive sales/conversions</option>
                            <option value="awareness">Build brand awareness</option>
                            <option value="engage">Engage community</option>
                            <option value="authority">Establish authority</option>
                            <option value="entertain">Entertain audience</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="contentFormat">Preferred Content Format</label>
                          <select
                            id="contentFormat"
                            name="contentFormat"
                            value={inputs.contentFormat}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select format</option>
                            <option value="blog">Blog Posts</option>
                            <option value="social">Social Media</option>
                            <option value="video">Video Content</option>
                            <option value="email">Email Content</option>
                            <option value="podcast">Podcast</option>
                            <option value="all">All Formats</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Target Audience & Brand</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="targetAudience">Target Audience</label>
                        <textarea 
                          id="targetAudience"
                          name="targetAudience"
                          value={inputs.targetAudience}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Describe your target audience (demographics, interests, behavior, pain points)..."
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="brandValues">Brand Values & Messaging</label>
                        <textarea 
                          id="brandValues"
                          name="brandValues"
                          value={inputs.brandValues}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="What does your brand stand for? Key messages and values..."
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="audienceProblems">Audience Problems & Challenges</label>
                        <textarea 
                          id="audienceProblems"
                          name="audienceProblems"
                          value={inputs.audienceProblems}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="What problems or challenges does your audience face?"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Content Strategy & Competition</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="uniqueAngle">Unique Angle or Perspective</label>
                          <textarea 
                            id="uniqueAngle"
                            name="uniqueAngle"
                            value={inputs.uniqueAngle}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                            placeholder="What unique perspective can you bring to your content?"
                          ></textarea>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="contentFrequency">Content Frequency</label>
                          <select
                            id="contentFrequency"
                            name="contentFrequency"
                            value={inputs.contentFrequency}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select frequency</option>
                            <option value="daily">Daily</option>
                            <option value="few-times-week">Few times per week</option>
                            <option value="weekly">Weekly</option>
                            <option value="bi-weekly">Bi-weekly</option>
                            <option value="monthly">Monthly</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="competitorAnalysis">Competitor Analysis (optional)</label>
                        <textarea 
                          id="competitorAnalysis"
                          name="competitorAnalysis"
                          value={inputs.competitorAnalysis}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="What type of content are your competitors creating? How can you differentiate?"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'result' && result && (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  <div className="bg-white border border-green-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                        <i className="fas fa-check-circle text-green-600"></i>
                        Generated Content Plan
                      </h3>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => navigator.clipboard.writeText(JSON.stringify(result, null, 2))}
                          className="px-3 py-1.5 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-all flex items-center gap-1"
                        >
                          <i className="fas fa-copy text-xs"></i>
                          Copy
                        </button>
                        <button 
                          onClick={() => setResult(null)}
                          className="px-3 py-1.5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-all flex items-center gap-1"
                        >
                          <i className="fas fa-times text-xs"></i>
                          Clear
                        </button>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="space-y-4">
                        {(() => {
                          console.log('Full API response:', result);
                          
                          // Check different possible response formats
                          let contentData = null;
                          let rawContent = null;
                          
                          if (result.content_ideas && Array.isArray(result.content_ideas)) {
                            contentData = result.content_ideas;
                          } else if (result.ideas && Array.isArray(result.ideas)) {
                            contentData = result.ideas;
                          } else if (typeof result === 'string') {
                            rawContent = result;
                          } else if (result.generated_content) {
                            rawContent = result.generated_content;
                          } else if (result.content) {
                            rawContent = result.content;
                          }

                          if (contentData && Array.isArray(contentData)) {
                            return (
                              <div className="space-y-3">
                                {contentData.map((idea: any, index: number) => (
                                  <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                                    <h5 className="font-medium text-gray-800 mb-1">
                                      {idea.title || idea.idea_title || `Content Idea ${index + 1}`}
                                    </h5>
                                    <p className="text-sm text-gray-600">
                                      {idea.description || idea.content || idea.idea_description || 'No description available'}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            );
                          } else if (rawContent) {
                            return (
                              <div className="bg-white rounded-lg p-3 border border-gray-200">
                                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                  {rawContent}
                                </div>
                              </div>
                            );
                          } else {
                            return (
                              <div className="bg-white rounded-lg p-3 border border-gray-200">
                                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                  {JSON.stringify(result, null, 2)}
                                </div>
                              </div>
                            );
                          }
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && (
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {contentTemplates.map((template, index) => (
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
                          onClick={() => setActiveTab('generate')}
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
                  <History toolName="Content Ideas" />
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-exclamation-triangle text-red-600"></i>
                    <h4 className="text-sm font-medium text-red-900">Error</h4>
                  </div>
                  <p className="text-sm text-red-700">{error}</p>
                  <button 
                    onClick={() => setError(null)}
                    className="text-xs text-red-600 hover:text-red-800 underline"
                  >
                    Dismiss
                  </button>
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
                  onClick={handleGenerateContentIdeas}
                  className="px-5 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin text-xs"></i>
                      Generating...
                    </>
                  ) : (
                    <>
                      <span>Generate Ideas</span>
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
