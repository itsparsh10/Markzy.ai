'use client';

import React, { useState } from 'react';
import api from '../../services/api.js';
import { ENDPOINTS } from '../../services/config.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface SocialMediaPlanProps {
  onBackClick: () => void;
}

export default function SocialMediaPlan({ onBackClick }: SocialMediaPlanProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history' | 'result'>('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [error, setError] = useState<string>('');
  
  // State for form inputs
  const [inputs, setInputs] = useState({
    productName: '',
    productCategory: '',
    targetAudience: '',
    platformFocus: '',
    contentPillars: '',
    postFrequency: '',
    campaignGoals: '',
    brandVoice: '',
    visualStyle: '',
    promotionalMix: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!inputs.productName || !inputs.targetAudience || !inputs.platformFocus) {
      setError('Please fill in at least Product Name, Target Audience, and Primary Platform Focus');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      // Map form inputs to API format exactly matching the curl example format
      const apiData = {
        product_name: inputs.productName,
        product_category: inputs.productCategory || 'Online Course',
        target_audience: inputs.targetAudience,
        primary_platform_focus: inputs.platformFocus,
        post_frequency: inputs.postFrequency || '4 posts per week',
        content_pillars: inputs.contentPillars || 'Educational tips, student success stories, project showcases, career advice, product features',
        campaign_goals: inputs.campaignGoals || 'Drive course enrollments, increase brand visibility among students, and grow email list',
        brand_voice_tone: inputs.brandVoice || 'Friendly, motivational, and slightly witty to connect with young learners',
        visual_style_aesthetics: inputs.visualStyle || 'Bright colors (blue, orange), bold fonts, youth-centric imagery, modern UI screenshots, casual mood',
        promotional_content_mix: inputs.promotionalMix || '30% product promotion, 70% value-driven educational or community content'
      };

      console.log('Generating social media plan with data:', apiData);
      
      // Direct API call using the centralized API with detailed logging
      console.log('Using endpoint:', ENDPOINTS.SOCIAL_MEDIA.GENERATE_PLAN);
      console.log('Full API URL:', `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://aitools.codencreative.com/api'}${ENDPOINTS.SOCIAL_MEDIA.GENERATE_PLAN}`);
      
      const response = await api.post(ENDPOINTS.SOCIAL_MEDIA.GENERATE_PLAN, apiData);
      const result = response.data;
      
      setGeneratedPlan(result);
      console.log('Generated plan:', result);
      
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Social Media Plan',
          toolId: 'social-media-plan',
          outputResult: result,
          prompt: JSON.stringify(apiData)
        });
        console.log('✅ Social media plan saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
      
      // Clear error on success
      setError('');
      
    } catch (error: any) {
      console.error('Error generating social media plan:', error);
      
      // Log more detailed error information for debugging
      console.error('Error response:', error.response);
      console.error('Error details:', error.response?.data || error.message || 'Unknown error');
      console.error('Request config:', error.config);
      
      // Handle different error scenarios
      if (error.response?.status === 401) {
        setError('Authentication failed. Please log in again to generate a social media plan.');
      } else if (error.response?.status === 400) {
        // Handle validation errors from the API with more details
        let errorMessage = 'Invalid request. Please check your inputs and try again.';
        
        if (error.response?.data) {
          if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
          } else if (error.response.data.detail) {
            errorMessage = error.response.data.detail;
          } else if (error.response.data.message) {
            errorMessage = error.response.data.message;
          } else {
            errorMessage = JSON.stringify(error.response.data);
          }
        }
        
        setError(`Bad Request (400): ${errorMessage}`);
      } else {
        setError(`Failed to generate social media plan. Status: ${error.response?.status || 'Unknown'}. Please try again.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderTemplatesTab = () => {
    const templates = [
      { name: "Product Launch Plan", icon: "fas fa-rocket", description: "30-day plan for launching a new product with maximum impact." },
      { name: "Engagement Booster", icon: "fas fa-heart", description: "Focus on building community and increasing engagement rates." },
      { name: "Sales-Driven Campaign", icon: "fas fa-dollar-sign", description: "Direct response campaign designed to drive product sales." },
      { name: "Brand Awareness Plan", icon: "fas fa-eye", description: "Build brand recognition and reach new audiences." },
      { name: "Content Calendar", icon: "fas fa-calendar-alt", description: "Structured content planning for consistent posting." },
      { name: "Seasonal Campaign", icon: "fas fa-leaf", description: "Leverage seasonal trends and holidays for product promotion." }
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
              Create
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Glassmorphic Header with blue gradient */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-calendar-alt text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">30 Day Social Media Plan for Products</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Promote your products with a comprehensive 30-day plan</p>
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
                {generatedPlan && (
                  <button 
                    onClick={() => setActiveTab('result')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${activeTab === 'result' ? 'text-blue-700 bg-blue-50/70' : 'text-blue-500 hover:text-blue-600'}`}
                  >
                    <span className="flex items-center gap-2">
                      <i className="fas fa-check-circle text-xs"></i>
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
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Success notification - only show briefly after generation */}
              {generatedPlan && activeTab === 'generate' && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <i className="fas fa-check text-green-600 text-sm"></i>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-green-900">Plan Generated Successfully!</h4>
                        <p className="text-xs text-green-700 mt-1">Your 30-day social media plan is ready to view.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveTab('result')}
                      className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
                    >
                      View Plan
                      <i className="fas fa-arrow-right text-xs"></i>
                    </button>
                  </div>
                </div>
              )}
              
              {activeTab === 'result' && generatedPlan && (
                <div className="space-y-4 max-h-[65vh] overflow-y-auto">
                  {/* Header Section */}
                  <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <i className="fas fa-calendar-alt text-blue-600 text-lg"></i>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">30-Day Social Media Plan</h4>
                        <p className="text-sm text-gray-600">Ready to implement</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          const planText = typeof generatedPlan === 'string' ? 
                            generatedPlan : 
                            JSON.stringify(generatedPlan, null, 2);
                          navigator.clipboard.writeText(planText);
                        }}
                        className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2"
                      >
                        <i className="fas fa-copy text-xs"></i>
                        Copy All
                      </button>
                      <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2">
                        <i className="fas fa-download text-xs"></i>
                        Export
                      </button>
                    </div>
                  </div>
                  
                  {/* Plan Content */}
                  <div className="space-y-3">
                    {generatedPlan?.plan && Array.isArray(generatedPlan.plan) ? (
                      generatedPlan.plan.map((dayPlan: any, index: number) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">
                                {dayPlan.day || index + 1}
                              </span>
                              <span className="font-medium text-gray-900">Day {dayPlan.day || index + 1}</span>
                            </div>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                              {dayPlan.content_format || 'Social Post'}
                            </span>
                          </div>
                          
                          <div className="space-y-3">
                            {dayPlan.post_idea && (
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium text-gray-700">Post Idea</span>
                                  <button 
                                    onClick={() => navigator.clipboard.writeText(dayPlan.post_idea)}
                                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                                  >
                                    <i className="fas fa-copy"></i>
                                  </button>
                                </div>
                                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                  {dayPlan.post_idea}
                                </p>
                              </div>
                            )}
                            
                            {dayPlan.caption && (
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium text-gray-700">Caption</span>
                                  <button 
                                    onClick={() => navigator.clipboard.writeText(dayPlan.caption)}
                                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                                  >
                                    <i className="fas fa-copy"></i>
                                  </button>
                                </div>
                                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg italic">
                                  "{dayPlan.caption}"
                                </p>
                              </div>
                            )}
                            
                            {dayPlan.hashtags && Array.isArray(dayPlan.hashtags) && (
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium text-gray-700">Hashtags</span>
                                  <button 
                                    onClick={() => navigator.clipboard.writeText(dayPlan.hashtags.join(' '))}
                                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                                  >
                                    <i className="fas fa-copy"></i>
                                  </button>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {dayPlan.hashtags.map((hashtag: string, hashtagIndex: number) => (
                                    <span key={hashtagIndex} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                      #{hashtag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {dayPlan.call_to_action && (
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium text-gray-700">Call to Action</span>
                                  <button 
                                    onClick={() => navigator.clipboard.writeText(dayPlan.call_to_action)}
                                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                                  >
                                    <i className="fas fa-copy"></i>
                                  </button>
                                </div>
                                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                  {dayPlan.call_to_action}
                                </p>
                              </div>
                            )}
                            
                            {dayPlan.engagement_tactic && (
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium text-gray-700">Engagement Tactic</span>
                                  <button 
                                    onClick={() => navigator.clipboard.writeText(dayPlan.engagement_tactic)}
                                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                                  >
                                    <i className="fas fa-copy"></i>
                                  </button>
                                </div>
                                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                  {dayPlan.engagement_tactic}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                          {typeof generatedPlan === 'string' ? generatedPlan : JSON.stringify(generatedPlan, null, 2)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'generate' && (
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Product & Campaign Information</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="productName">Product Name</label>
                          <input 
                            id="productName" 
                            name="productName"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all" 
                            placeholder="Enter your product name"
                            type="text"
                            value={inputs.productName}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="productCategory">Product Category</label>
                          <select
                            id="productCategory"
                            name="productCategory"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                            value={inputs.productCategory}
                            onChange={handleInputChange}
                          >
                            <option value="">Select category</option>
                            <option value="fashion">Fashion & Apparel</option>
                            <option value="beauty">Beauty & Skincare</option>
                            <option value="tech">Technology</option>
                            <option value="home">Home & Lifestyle</option>
                            <option value="fitness">Health & Fitness</option>
                            <option value="food">Food & Beverage</option>
                            <option value="digital">Digital Products</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="targetAudience">Target Audience</label>
                        <textarea 
                          id="targetAudience" 
                          name="targetAudience"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Describe your target audience demographics, interests, and behaviors..."
                          value={inputs.targetAudience}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Social Media Strategy</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="platformFocus">Primary Platform Focus</label>
                          <select
                            id="platformFocus"
                            name="platformFocus"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                            value={inputs.platformFocus}
                            onChange={handleInputChange}
                          >
                            <option value="">Select primary platform</option>
                            <option value="instagram">Instagram</option>
                            <option value="facebook">Facebook</option>
                            <option value="tiktok">TikTok</option>
                            <option value="twitter">Twitter/X</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="pinterest">Pinterest</option>
                            <option value="youtube">YouTube</option>
                            <option value="multi">Multi-platform</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="postFrequency">Post Frequency</label>
                          <select
                            id="postFrequency"
                            name="postFrequency"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                            value={inputs.postFrequency}
                            onChange={handleInputChange}
                          >
                            <option value="">Select frequency</option>
                            <option value="daily">Daily (30 posts)</option>
                            <option value="every-other-day">Every Other Day (15 posts)</option>
                            <option value="3-times-week">3 Times per Week (12 posts)</option>
                            <option value="twice-week">Twice per Week (8 posts)</option>
                            <option value="weekly">Weekly (4 posts)</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="contentPillars">Content Pillars</label>
                        <textarea 
                          id="contentPillars" 
                          name="contentPillars"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="What themes will your content focus on? (e.g., product features, behind-the-scenes, user-generated content, educational tips)"
                          value={inputs.contentPillars}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="campaignGoals">Campaign Goals</label>
                        <textarea 
                          id="campaignGoals" 
                          name="campaignGoals"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="What do you want to achieve? (e.g., increase sales, brand awareness, engagement, website traffic)"
                          value={inputs.campaignGoals}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Brand & Content Style</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="brandVoice">Brand Voice & Tone</label>
                          <textarea 
                            id="brandVoice" 
                            name="brandVoice"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                            placeholder="How should your brand sound? (e.g., friendly, professional, playful, inspiring)"
                            value={inputs.brandVoice}
                            onChange={handleInputChange}
                          ></textarea>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="visualStyle">Visual Style & Aesthetics</label>
                          <textarea 
                            id="visualStyle" 
                            name="visualStyle"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                            placeholder="Describe your visual style (colors, fonts, photography style, mood)"
                            value={inputs.visualStyle}
                            onChange={handleInputChange}
                          ></textarea>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="promotionalMix">Promotional Content Mix</label>
                        <textarea 
                          id="promotionalMix" 
                          name="promotionalMix"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="What ratio of promotional vs. value content? (e.g., 30% product promotion, 70% value/entertainment)"
                          value={inputs.promotionalMix}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && renderTemplatesTab()}
              
              {activeTab === 'history' && (
                <div className="py-4">
                  <History toolName="Social Media Plan" />
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
                      <span>Generate Plan</span>
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
