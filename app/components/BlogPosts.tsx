'use client';

import React, { useState } from 'react';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface BlogPostsProps {
  onBackClick: () => void;
}

export default function BlogPosts({ onBackClick }: BlogPostsProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'result' | 'templates' | 'history'>('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [toolHistory, setToolHistory] = useState<any[]>([]);
  const [inputs, setInputs] = useState({
    productService: '',
    businessType: '',
    targetAudience: '',
    customerJourneyStage: '',
    contentGoals: '',
    brandVoice: '',
    blogTopics: '',
    seoKeywords: '',
    competitorAnalysis: '',
    contentFrequency: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    // Validation
    if (!inputs.productService || !inputs.businessType || !inputs.customerJourneyStage || !inputs.targetAudience || !inputs.contentGoals || !inputs.brandVoice || !inputs.contentFrequency) {
      alert('Please fill in all required fields: Product/Service, Business Type, Focus Stage, Target Audience, Content Goals, Brand Voice, and Content Frequency');
      return;
    }

    setIsLoading(true);
    
    try {
      // Dynamic import for ES modules
      const { aiToolsService } = await import('../../services/aiTools.js');
      
      // Map UI values to API format
      const requestData = {
        product_service: inputs.productService,
        business_type: inputs.businessType,
        focus_stage: inputs.customerJourneyStage,
        target_audience: inputs.targetAudience,
        content_goals: inputs.contentGoals,
        brand_voice: inputs.brandVoice,
        content_frequency: inputs.contentFrequency,
        seo_keywords: inputs.seoKeywords || 'relevant keywords',
        existing_blog_topics: inputs.blogTopics || 'No previous topics specified',
        competitor_insights: inputs.competitorAnalysis || 'No competitor analysis provided'
      };

      console.log('Sending blog posts request:', requestData);
      const response = await aiToolsService.generateBlogPosts(requestData);
      console.log('Blog posts response:', response);
      setGeneratedContent(response);
      setActiveTab('result');
      
      // Save to tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Blog Posts',
          toolId: 'blog-posts',
          outputResult: response,
          prompt: JSON.stringify(requestData)
        });
        console.log('✅ Blog posts saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
      
    } catch (error: any) {
      // Error handling with user-friendly messages
      let errorMessage = 'Failed to generate blog posts strategy. Please try again.';
      
      if (error.response?.data?.detail) {
        errorMessage = `API Error: ${error.response.data.detail}`;
      } else if (error.message && error.message.includes('Missing required fields')) {
        errorMessage = error.message;
      } else if (error.response?.status === 400) {
        errorMessage = 'The request was invalid. Please check all required fields.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication error. Please try logging out and back in.';
      }
      
      console.error('Error details:', error.response?.data || error.message);
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };



  const journeyTemplates = [
    { name: "Awareness Stage", icon: "fas fa-eye", description: "Blog posts to attract and educate potential customers." },
    { name: "Consideration Stage", icon: "fas fa-search", description: "Content for customers evaluating solutions and options." },
    { name: "Decision Stage", icon: "fas fa-check-circle", description: "Blog posts to help customers choose your product/service." },
    { name: "Retention Stage", icon: "fas fa-heart", description: "Content to keep existing customers engaged and loyal." },
    { name: "Advocacy Stage", icon: "fas fa-bullhorn", description: "Posts that turn customers into brand advocates." },
    { name: "Full Journey", icon: "fas fa-route", description: "Complete blog content strategy covering all stages." }
  ];

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Glassmorphic Header with blue gradient */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-pen-fancy text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Blog Posts</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Get blog titles and outlines for each stage of the customer journey</p>
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
                {generatedContent && (
                  <button 
                    onClick={() => setActiveTab('result')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${activeTab === 'result' ? 'text-blue-700 bg-blue-50/70' : 'text-blue-500 hover:text-blue-600'}`}
                  >
                    <span className="flex items-center gap-2">
                      <i className="fas fa-blog text-xs"></i>
                      Generated Strategy
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
                  {generatedContent && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <i className="fas fa-check text-green-600 text-sm"></i>
                          </div>
                          <div>
                            <h4 className="text-green-800 font-semibold">Blog Strategy Generated Successfully!</h4>
                            <p className="text-green-600 text-sm">Your blog content strategy is ready to view.</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveTab('result')}
                          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center gap-2"
                        >
                          <i className="fas fa-eye text-xs"></i>
                          View Strategy
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Business Information */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Business Information</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="productService">Product/Service</label>
                        <input
                          id="productService"
                          name="productService"
                          type="text"
                          value={inputs.productService}
                          onChange={handleInputChange}
                          placeholder="What product or service do you offer?"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="businessType">Business Type</label>
                          <select
                            id="businessType"
                            name="businessType"
                            value={inputs.businessType}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select business type</option>
                            <option value="b2b">B2B (Business to Business)</option>
                            <option value="b2c">B2C (Business to Consumer)</option>
                            <option value="ecommerce">E-commerce</option>
                            <option value="saas">SaaS/Software</option>
                            <option value="consulting">Consulting/Services</option>
                            <option value="education">Education/Training</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="customerJourneyStage">Focus Stage</label>
                          <select
                            id="customerJourneyStage"
                            name="customerJourneyStage"
                            value={inputs.customerJourneyStage}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select focus stage</option>
                            <option value="awareness">Awareness Stage</option>
                            <option value="consideration">Consideration Stage</option>
                            <option value="decision">Decision Stage</option>
                            <option value="retention">Retention Stage</option>
                            <option value="advocacy">Advocacy Stage</option>
                            <option value="all">All Stages</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Audience & Content Strategy */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Audience & Content Strategy</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="targetAudience">Target Audience</label>
                        <textarea 
                          id="targetAudience"
                          name="targetAudience"
                          value={inputs.targetAudience}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Describe your ideal blog readers..."
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="contentGoals">Content Goals</label>
                        <textarea 
                          id="contentGoals"
                          name="contentGoals"
                          value={inputs.contentGoals}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="What do you want to achieve with your blog content?"
                        ></textarea>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="brandVoice">Brand Voice</label>
                          <input
                            id="brandVoice"
                            name="brandVoice"
                            type="text"
                            value={inputs.brandVoice}
                            onChange={handleInputChange}
                            placeholder="e.g., professional, friendly, authoritative"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
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
                            <option value="">How often do you blog?</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="biweekly">Bi-weekly</option>
                            <option value="monthly">Monthly</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SEO & Topic Research */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">SEO & Topic Research</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="seoKeywords">SEO Keywords (optional)</label>
                        <input
                          id="seoKeywords"
                          name="seoKeywords"
                          type="text"
                          value={inputs.seoKeywords}
                          onChange={handleInputChange}
                          placeholder="Enter keywords you want to target, separated by commas"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="blogTopics">Existing Blog Topics (optional)</label>
                        <textarea 
                          id="blogTopics"
                          name="blogTopics"
                          value={inputs.blogTopics}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="List any topics you've already covered or want to avoid..."
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="competitorAnalysis">Competitor Insights (optional)</label>
                        <textarea 
                          id="competitorAnalysis"
                          name="competitorAnalysis"
                          value={inputs.competitorAnalysis}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="What topics are your competitors covering? What gaps do you see?"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && (
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {journeyTemplates.map((template, index) => (
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
                            setInputs(prev => ({...prev, customerJourneyStage: template.name.toLowerCase().replace(' stage', '').replace(' ', '-')}));
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
              
              {activeTab === 'result' && generatedContent && (
                <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
                  {/* Blog Strategy Overview */}
                  {generatedContent.strategy && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center gap-2">
                        <i className="fas fa-bullseye text-green-600"></i>
                        Blog Strategy
                      </h3>
                      <div className="bg-white p-3 rounded-lg border border-green-100">
                        <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">{generatedContent.strategy}</div>
                      </div>
                    </div>
                  )}

                  {/* Content Calendar */}
                  {generatedContent.contentCalendar && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-blue-800 mb-2 flex items-center gap-2">
                        <i className="fas fa-calendar-alt text-blue-600"></i>
                        Content Calendar
                      </h3>
                      <div className="bg-white p-4 rounded-lg border border-blue-100">
                        <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">{generatedContent.contentCalendar}</div>
                      </div>
                    </div>
                  )}

                  {/* Blog Topics */}
                  {generatedContent.blogTopics && generatedContent.blogTopics.length > 0 && (
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-purple-800 mb-2 flex items-center gap-2">
                        <i className="fas fa-lightbulb text-purple-600"></i>
                        Suggested Blog Topics
                      </h3>
                      <div className="bg-white p-3 rounded-lg border border-purple-100">
                        <div className="grid gap-3">
                          {generatedContent.blogTopics.map((topic: string, index: number) => (
                            <div key={index} className="p-3 bg-purple-25 border border-purple-100 rounded-lg">
                              <p className="text-gray-800 font-medium">{topic}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SEO Keywords */}
                  {generatedContent.seoKeywords && generatedContent.seoKeywords.length > 0 && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                        <i className="fas fa-search text-yellow-600"></i>
                        SEO Keywords
                      </h3>
                      <div className="bg-white p-3 rounded-lg border border-yellow-100">
                        <div className="flex flex-wrap gap-2">
                          {generatedContent.seoKeywords.map((keyword: string, index: number) => (
                            <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full border border-yellow-200">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Content Pillars */}
                  {generatedContent.contentPillars && generatedContent.contentPillars.length > 0 && (
                    <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-indigo-800 mb-2 flex items-center gap-2">
                        <i className="fas fa-columns text-indigo-600"></i>
                        Content Pillars
                      </h3>
                      <div className="bg-white p-3 rounded-lg border border-indigo-100">
                        <div className="grid gap-3">
                          {generatedContent.contentPillars.map((pillar: string, index: number) => (
                            <div key={index} className="p-3 bg-indigo-25 border border-indigo-100 rounded-lg">
                              <p className="text-gray-800 font-medium">{pillar}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Performance Metrics */}
                  {generatedContent.performanceMetrics && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-red-800 mb-2 flex items-center gap-2">
                        <i className="fas fa-chart-line text-red-600"></i>
                        Performance Metrics
                      </h3>
                      <div className="bg-white p-3 rounded-lg border border-red-100">
                        <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">{generatedContent.performanceMetrics}</div>
                      </div>
                    </div>
                  )}

                  {/* Content Distribution Strategy */}
                  {generatedContent.distributionStrategy && (
                    <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-teal-800 mb-2 flex items-center gap-2">
                        <i className="fas fa-share-alt text-teal-600"></i>
                        Distribution Strategy
                      </h3>
                      <div className="bg-white p-3 rounded-lg border border-teal-100">
                        <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">{generatedContent.distributionStrategy}</div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-4">
                    <button
                      onClick={() => navigator.clipboard.writeText(JSON.stringify(generatedContent, null, 2))}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
                    >
                      <i className="fas fa-copy"></i>
                      Copy Strategy
                    </button>
                    <button
                      onClick={() => {
                        const element = document.createElement('a');
                        const file = new Blob([JSON.stringify(generatedContent, null, 2)], { type: 'application/json' });
                        element.href = URL.createObjectURL(file);
                        element.download = 'blog_strategy.json';
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200"
                    >
                      <i className="fas fa-download"></i>
                      Download
                    </button>
                    <button
                      onClick={() => setActiveTab('generate')}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200"
                    >
                      <i className="fas fa-edit"></i>
                      Edit & Regenerate
                    </button>
                  </div>
                </div>
              )}
              
              {activeTab === 'history' && (
                <div className="py-4">
                  <History toolName="Blog Posts" />
                </div>
              )}
            </div>
            
            {/* Results Display */}
            {generatedContent && (
              <div className="mt-4 px-4">
                <div className="bg-white border border-green-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                      <i className="fas fa-check-circle text-green-600"></i>
                      Generated Blog Strategy
                    </h3>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => navigator.clipboard.writeText(generatedContent.blog_strategy || generatedContent.content || JSON.stringify(generatedContent))}
                        className="px-3 py-1.5 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-all flex items-center gap-1"
                      >
                        <i className="fas fa-copy text-xs"></i>
                        Copy
                      </button>
                      <button 
                        onClick={() => setGeneratedContent(null)}
                        className="px-3 py-1.5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-all flex items-center gap-1"
                      >
                        <i className="fas fa-times text-xs"></i>
                        Clear
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                    {generatedContent.blog_strategy ? (
                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                          {generatedContent.blog_strategy}
                        </div>
                      </div>
                    ) : generatedContent.content ? (
                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                          {generatedContent.content}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {Object.entries(generatedContent).map(([key, value]) => (
                          <div key={key} className="border-b border-gray-200 pb-3 last:border-b-0">
                            <h4 className="font-semibold text-gray-900 capitalize mb-2">
                              {key.replace(/_/g, ' ')}
                            </h4>
                            <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                              {typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
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
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className={`px-5 py-2 text-sm text-white rounded-lg transition-all flex items-center gap-2 shadow-md hover:shadow-lg ${
                    isLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin text-xs"></i>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Blog Strategy</span>
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
