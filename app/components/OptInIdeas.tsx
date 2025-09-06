'use client';

import React, { useState } from 'react';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface OptInIdeasProps {
  onBackClick: () => void;
}

export default function OptInIdeas({ onBackClick }: OptInIdeasProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history' | 'result'>('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedIdeas, setGeneratedIdeas] = useState<any>(null);
  
  // State for form inputs
  const [formData, setFormData] = useState({
    businessType: '',
    industry: '',
    targetAudience: '',
    businessGoals: '',
    currentChallenges: '',
    contentFormat: '',
    deliveryMethod: '',
    contentDepth: '',
    leadMagnetType: '',
    valueProp: ''
  });

  // Lead magnet template types with appropriate icons
  const leadMagnetTypes = [
    { name: "Educational Guide", icon: "fas fa-book", description: "Comprehensive guides that teach your audience something valuable." },
    { name: "Checklist & Templates", icon: "fas fa-list-check", description: "Actionable checklists and ready-to-use templates." },
    { name: "Resource Library", icon: "fas fa-folder-open", description: "Curated collections of tools, links, and resources." },
    { name: "Mini Course Series", icon: "fas fa-graduation-cap", description: "Short email courses delivered over several days." },
    { name: "Assessment & Quiz", icon: "fas fa-clipboard-question", description: "Interactive assessments that provide personalized results." },
    { name: "Free Tool Access", icon: "fas fa-tools", description: "Access to calculators, generators, or other useful tools." }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const requiredFields = [
      'businessType', 'industry', 'targetAudience', 'businessGoals', 
      'currentChallenges', 'contentFormat', 'deliveryMethod', 
      'contentDepth', 'leadMagnetType', 'valueProp'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedIdeas(null);
    
    try {
      // Dynamic import for ES modules
      const { aiToolsService } = await import('../../services/aiTools.js');
      
      // Map UI values to API format
      const requestData = {
        business_type: formData.businessType,
        industry: formData.industry,
        target_audience: formData.targetAudience,
        business_goals: formData.businessGoals,
        current_challenges: formData.currentChallenges,
        content_format: formData.contentFormat,
        delivery_method: formData.deliveryMethod,
        content_depth: formData.contentDepth,
        lead_magnet_type: formData.leadMagnetType,
        unique_value_proposition: formData.valueProp
      };

      console.log('Sending opt-in ideas request:', requestData);
      const response = await aiToolsService.generateOptInIdeas(requestData);
      console.log('Opt-in ideas response:', response);
      setGeneratedIdeas(response);
      
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Opt In Ideas',
          toolId: 'opt-in-ideas',
          outputResult: response,
          prompt: JSON.stringify(requestData)
        });
        console.log('✅ Opt-in ideas saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
      setActiveTab('result');
      
    } catch (error: any) {
      console.error('Error generating opt-in ideas:', error);
      
      // Extract meaningful error message to show to user
      let errorMessage = 'Failed to generate opt-in ideas. Please try again.';
      
      if (error.response?.data?.detail) {
        errorMessage = `API Error: ${error.response.data.detail}`;
      } else if (error.message && error.message.includes('Missing required fields')) {
        errorMessage = error.message;
      } else if (error.response?.status === 400) {
        errorMessage = 'The request was invalid. Please check all required fields are filled correctly.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication error. Please try logging out and back in.';
      }
      
      console.error('Error details:', error.response?.data || error.message || 'Unknown error');
      setError(errorMessage);
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
              <i className="fas fa-list-alt text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Opt-In Ideas</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Generate lead magnet ideas to grow your email list</p>
            </div>
            <div className="flex items-center gap-3 z-10">
              <span className="text-xs bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/30 flex items-center font-semibold text-white/90">
                <i className="fas fa-clock mr-1"></i> 5 min
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
                <button 
                  onClick={() => setActiveTab('result')}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${activeTab === 'result' ? 'text-blue-700 bg-blue-50/70' : 'text-blue-500 hover:text-blue-600'}`}
                >
                  <span className="flex items-center gap-2">
                    <i className="fas fa-lightbulb text-xs"></i>
                    Results
                  </span>
                  {activeTab === 'result' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>}
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
                  {/* Business Information Section */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Business & Audience Information</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="business-type">Business Type</label>
                          <select
                            id="business-type"
                            name="businessType"
                            value={formData.businessType}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
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
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="industry">Industry</label>
                          <select
                            id="industry"
                            name="industry"
                            value={formData.industry}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
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
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="target-audience">Target Audience</label>
                        <textarea 
                          id="target-audience"
                          name="targetAudience"
                          value={formData.targetAudience}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Describe your ideal lead magnet subscriber (demographics, interests, challenges)..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Goals & Challenges Section */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Goals & Current Challenges</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="business-goals">Business Goals</label>
                        <textarea 
                          id="business-goals"
                          name="businessGoals"
                          value={formData.businessGoals}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="What are your main business goals? What do you want to achieve with your lead magnets?"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="current-challenges">Current Challenges</label>
                        <textarea 
                          id="current-challenges"
                          name="currentChallenges"
                          value={formData.currentChallenges}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="What challenges do your potential customers face that you can help solve?"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Lead Magnet Preferences Section */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Lead Magnet Preferences</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="content-format">Content Format</label>
                          <select
                            id="content-format"
                            name="contentFormat"
                            value={formData.contentFormat}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Choose preferred format</option>
                            <option value="pdf-guide">PDF Guide</option>
                            <option value="video-series">Video Series</option>
                            <option value="email-course">Email Course</option>
                            <option value="checklist">Checklist</option>
                            <option value="template">Template</option>
                            <option value="tool-access">Tool Access</option>
                            <option value="webinar">Webinar</option>
                            <option value="quiz">Quiz/Assessment</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="delivery-method">Delivery Method</label>
                          <select
                            id="delivery-method"
                            name="deliveryMethod"
                            value={formData.deliveryMethod}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Choose delivery method</option>
                            <option value="instant-download">Instant Download</option>
                            <option value="email-sequence">Email Sequence</option>
                            <option value="member-portal">Member Portal Access</option>
                            <option value="live-session">Live Session</option>
                            <option value="app-access">App/Platform Access</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="content-depth">Content Depth</label>
                          <select
                            id="content-depth"
                            name="contentDepth"
                            value={formData.contentDepth}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Choose content depth</option>
                            <option value="quick-wins">Quick Wins (5-10 min)</option>
                            <option value="comprehensive">Comprehensive (30-60 min)</option>
                            <option value="deep-dive">Deep Dive (1+ hours)</option>
                            <option value="multi-part">Multi-Part Series</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="lead-magnet-type">Lead Magnet Type</label>
                          <select
                            id="lead-magnet-type"
                            name="leadMagnetType"
                            value={formData.leadMagnetType}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Choose type</option>
                            <option value="educational">Educational</option>
                            <option value="entertainment">Entertainment</option>
                            <option value="tools-resources">Tools & Resources</option>
                            <option value="exclusive-access">Exclusive Access</option>
                            <option value="personal-assessment">Personal Assessment</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="value-prop">Unique Value Proposition</label>
                        <textarea 
                          id="value-prop"
                          name="valueProp"
                          value={formData.valueProp}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="What unique value or expertise can you offer that others can't?"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && (
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {leadMagnetTypes.map((magnet, index) => (
                    <div key={index} className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
                            <i className={`${magnet.icon} text-blue-600`}></i>
                          </div>
                          <div>
                            <h4 className="font-medium text-blue-900">{magnet.name}</h4>
                            <p className="text-xs text-blue-600">{magnet.description}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            setFormData(prev => ({...prev, contentFormat: magnet.name.toLowerCase().replace(' ', '-')}));
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
                  <History toolName="Opt In Ideas" />
                </div>
              )}
              
              {activeTab === 'result' && (
                <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <i className="fas fa-exclamation-triangle text-red-500"></i>
                        <span className="text-red-700 font-medium">Error</span>
                      </div>
                      <p className="text-red-600 text-sm mt-1">{error}</p>
                    </div>
                  )}
                  
                  {isLoading && (
                    <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                      <p className="text-blue-700 font-medium">Generating opt-in ideas...</p>
                      <p className="text-sm text-blue-600">This may take a few moments</p>
                    </div>
                  )}
                  
                  {generatedIdeas && !isLoading && (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <i className="fas fa-check-circle text-green-500"></i>
                          <span className="text-green-700 font-medium">Generated Successfully!</span>
                        </div>
                        <p className="text-green-600 text-sm">Here are your personalized opt-in ideas:</p>
                      </div>
                      
                      <div className="space-y-3">
                        {generatedIdeas.ideas && generatedIdeas.ideas.map((idea: string, index: number) => (
                          <div key={index} className="p-4 bg-white border border-blue-200 rounded-lg hover:shadow-md transition-all duration-200">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                                    {index + 1}
                                  </span>
                                  <h4 className="font-medium text-blue-900">{idea}</h4>
                                </div>
                              </div>
                              <button 
                                onClick={() => navigator.clipboard.writeText(idea)}
                                className="ml-3 p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
                                title="Copy to clipboard"
                              >
                                <i className="fas fa-copy text-sm"></i>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Next Steps</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Choose the most relevant ideas for your audience</li>
                          <li>• Create detailed content for your selected lead magnets</li>
                          <li>• Set up your opt-in page and email sequence</li>
                          <li>• Track performance and optimize based on results</li>
                        </ul>
                      </div>
                    </div>
                  )}
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
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`px-5 py-2 text-sm text-white rounded-lg transition-all flex items-center gap-2 shadow-md hover:shadow-lg ${
                    isLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
