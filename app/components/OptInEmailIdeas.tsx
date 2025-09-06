'use client';

import React, { useState } from 'react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface OptInEmailIdeasProps {
  onBackClick: () => void;
}

export default function OptInEmailIdeas({ onBackClick }: OptInEmailIdeasProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  
  // State for form inputs
  const [formData, setFormData] = useState({
    businessType: '',
    industry: '',
    targetAudience: '',
    currentGoals: '',
    emailFrequency: '',
    contentTopics: '',
    emailObjectives: '',
    toneStyle: 'educational',
    includePromotional: true,
    includeEducational: true,
    brandValues: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);

  // Email idea template types with appropriate icons
  const ideaTypes = [
    { name: "Welcome Series", icon: "fas fa-handshake", description: "Ideas for onboarding new subscribers with value-packed emails." },
    { name: "Educational Content", icon: "fas fa-graduation-cap", description: "Teaching and informative email concepts to build authority." },
    { name: "Nurture Sequence", icon: "fas fa-seedling", description: "Relationship-building emails that warm up leads over time." },
    { name: "Product Introduction", icon: "fas fa-gift", description: "Gentle ways to introduce your products and services." },
    { name: "Story-Based Emails", icon: "fas fa-book-open", description: "Personal and brand story ideas that connect with subscribers." },
    { name: "Engagement Boosters", icon: "fas fa-thumbs-up", description: "Interactive email ideas to increase engagement and replies." }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      // Map form inputs to API request format
      const requestData = {
        business_type: formData.businessType,
        industry: formData.industry,
        target_audience: formData.targetAudience,
        email_frequency: formData.emailFrequency,
        tone_style: formData.toneStyle,
        current_business_goals: formData.currentGoals,
        email_objectives: formData.emailObjectives,
        content_topics: formData.contentTopics,
        include_promotional_ideas: formData.includePromotional,
        include_educational_content: formData.includeEducational,
        brand_values: formData.brandValues
      };

      const response = await aiToolsService.generateOptInEmailIdeas(requestData);
      setResult(response);
      
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Opt In Email Ideas',
          toolId: 'opt-in-email-ideas',
          outputResult: response,
          prompt: JSON.stringify(requestData)
        });
        console.log('✅ Opt-in email ideas saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
    } catch (err: any) {
      console.error('Error generating opt-in email ideas:', err);
      setError(err.message || 'Failed to generate opt-in email ideas. Please try again.');
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
              <i className="fas fa-lightbulb text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Opt-In Email Ideas</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Generate email content ideas to nurture your subscribers</p>
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
                  {/* Input Fields */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Business Information</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="business-type">Business Type</label>
                          <div className="relative group">
                            <select
                              id="business-type"
                              name="businessType"
                              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                              value={formData.businessType}
                              onChange={handleInputChange}
                            >
                              <option value="">Select business type</option>
                              <option value="service-based">Service-Based Business</option>
                              <option value="ecommerce">E-commerce</option>
                              <option value="digital-products">Digital Products</option>
                              <option value="coaching">Coaching/Consulting</option>
                              <option value="agency">Agency</option>
                              <option value="saas">SaaS</option>
                              <option value="other">Other</option>
                            </select>
                            <div className="absolute top-1/2 right-3 transform -translate-y-1/2 text-blue-300 pointer-events-none">
                              <i className="fas fa-chevron-down text-xs"></i>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="industry">Industry</label>
                          <div className="relative group">
                            <select
                              id="industry"
                              name="industry"
                              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                              value={formData.industry}
                              onChange={handleInputChange}
                            >
                              <option value="">Select industry</option>
                              <option value="technology">Technology</option>
                              <option value="health-wellness">Health & Wellness</option>
                              <option value="finance">Finance</option>
                              <option value="education">Education</option>
                              <option value="marketing">Marketing</option>
                              <option value="lifestyle">Lifestyle</option>
                              <option value="business">Business</option>
                              <option value="other">Other</option>
                            </select>
                            <div className="absolute top-1/2 right-3 transform -translate-y-1/2 text-blue-300 pointer-events-none">
                              <i className="fas fa-chevron-down text-xs"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="target-audience">Target Audience</label>
                        <div className="relative group">
                          <textarea 
                            id="target-audience" 
                            name="targetAudience"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all resize-none h-16" 
                            placeholder="Describe your ideal email subscribers..."
                            value={formData.targetAudience}
                            onChange={handleInputChange}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Email Strategy</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="email-frequency">Email Frequency</label>
                          <div className="relative group">
                            <select
                              id="email-frequency"
                              name="emailFrequency"
                              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                              value={formData.emailFrequency}
                              onChange={handleInputChange}
                            >
                              <option value="">How often do you email?</option>
                              <option value="daily">Daily</option>
                              <option value="weekly">Weekly</option>
                              <option value="bi-weekly">Bi-weekly</option>
                              <option value="monthly">Monthly</option>
                              <option value="irregular">Irregular</option>
                            </select>
                            <div className="absolute top-1/2 right-3 transform -translate-y-1/2 text-blue-300 pointer-events-none">
                              <i className="fas fa-chevron-down text-xs"></i>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="tone-style">Tone & Style</label>
                          <div className="relative group">
                            <select
                              id="tone-style"
                              name="toneStyle"
                              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                              value={formData.toneStyle}
                              onChange={handleInputChange}
                            >
                              <option value="educational">Educational</option>
                              <option value="conversational">Conversational</option>
                              <option value="professional">Professional</option>
                              <option value="inspiring">Inspiring</option>
                              <option value="friendly">Friendly</option>
                              <option value="humorous">Humorous</option>
                            </select>
                            <div className="absolute top-1/2 right-3 transform -translate-y-1/2 text-blue-300 pointer-events-none">
                              <i className="fas fa-chevron-down text-xs"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="current-goals">Current Business Goals</label>
                        <div className="relative group">
                          <textarea 
                            id="current-goals" 
                            name="currentGoals"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all resize-none h-16" 
                            placeholder="What are your main business goals right now?"
                            value={formData.currentGoals}
                            onChange={handleInputChange}
                          ></textarea>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="email-objectives">Email Objectives</label>
                        <div className="relative group">
                          <textarea 
                            id="email-objectives" 
                            name="emailObjectives"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all resize-none h-16" 
                            placeholder="What do you want to achieve with your email marketing?"
                            value={formData.emailObjectives}
                            onChange={handleInputChange}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Content Preferences</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="content-topics">Content Topics</label>
                        <div className="relative group">
                          <textarea 
                            id="content-topics" 
                            name="contentTopics"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all resize-none h-16" 
                            placeholder="What topics would you like to cover in your emails?"
                            value={formData.contentTopics}
                            onChange={handleInputChange}
                          ></textarea>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="include-promotional"
                            name="includePromotional"
                            checked={formData.includePromotional}
                            onChange={handleInputChange}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                          />
                          <label htmlFor="include-promotional" className="text-sm text-blue-900">
                            Include promotional ideas
                          </label>
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="include-educational"
                            name="includeEducational"
                            checked={formData.includeEducational}
                            onChange={handleInputChange}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                          />
                          <label htmlFor="include-educational" className="text-sm text-blue-900">
                            Include educational content
                          </label>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="brand-values">Brand Values</label>
                        <div className="relative group">
                          <textarea 
                            id="brand-values" 
                            name="brandValues"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all resize-none h-16" 
                            placeholder="What values does your brand represent?"
                            value={formData.brandValues}
                            onChange={handleInputChange}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && (
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {ideaTypes.map((ideaType, index) => (
                    <div key={index} className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
                            <i className={`${ideaType.icon} text-blue-600`}></i>
                          </div>
                          <div>
                            <h4 className="font-medium text-blue-900">{ideaType.name}</h4>
                            <p className="text-xs text-blue-600">{ideaType.description}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            setFormData(prev => ({...prev, emailObjectives: ideaType.name}));
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
                  <History toolName="Opt In Email Ideas" />
                </div>
              )}
            </div>
            
            {/* Results Display */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                <div className="flex items-center gap-2 text-red-700">
                  <i className="fas fa-exclamation-circle"></i>
                  <span className="font-medium">Error</span>
                </div>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            )}
            
            {result && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-green-700">
                    <i className="fas fa-check-circle"></i>
                    <span className="font-medium">Generated Email Ideas</span>
                  </div>
                  <button
                    onClick={() => {
                      const textToCopy = result.ideas.join('\n\n');
                      navigator.clipboard.writeText(textToCopy);
                    }}
                    className="px-3 py-1 text-xs text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition-all flex items-center gap-1"
                  >
                    <i className="fas fa-copy"></i>
                    Copy All
                  </button>
                </div>
                
                {result.ideas && result.ideas.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-green-800 mb-2">Email Ideas</h4>
                    <div className="space-y-2">
                      {result.ideas.map((idea: string, index: number) => (
                        <div key={index} className="p-3 bg-white rounded-lg border border-green-200">
                          <p className="text-sm text-green-900">{idea}</p>
                          <button
                            onClick={() => navigator.clipboard.writeText(idea)}
                            className="mt-2 px-2 py-1 text-xs text-green-600 hover:text-green-700 transition-all flex items-center gap-1"
                          >
                            <i className="fas fa-copy"></i>
                            Copy
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
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
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-5 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin text-xs"></i>
                      <span>Generating...</span>
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
