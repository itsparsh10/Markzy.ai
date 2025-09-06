'use client';

import React, { useState } from 'react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface AffiliateSocialSwipesProps {
  onBackClick: () => void;
}

export default function AffiliateSocialSwipes({ onBackClick }: AffiliateSocialSwipesProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'result' | 'templates' | 'history'>('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedSwipes, setGeneratedSwipes] = useState<any>(null);
  
  const [inputs, setInputs] = useState({
    productName: '',
    brandName: '',
    productDescription: '',
    targetPlatform: '',
    targetAudience: '',
    keyBenefits: '',
    callToAction: '',
    hashtagStrategy: '',
    postTone: 'professional',
    socialProof: '',
    visualSuggestions: '',
    campaignObjective: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateSwipes = async () => {
    // Validate required fields
    const requiredFields = [
      'productName',
      'brandName',
      'productDescription',
      'targetPlatform',
      'campaignObjective',
      'targetAudience',
      'keyBenefits',
      'callToAction',
      'hashtagStrategy',
      'socialProof',
      'visualSuggestions'
    ];
    
    const missingFields = requiredFields.filter(field => !inputs[field as keyof typeof inputs]);
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedSwipes(null);

    try {
      // Transform inputs to match API format
      const swipesData = {
        product_name: inputs.productName,
        brand_name: inputs.brandName,
        product_description: inputs.productDescription,
        target_platform: inputs.targetPlatform,
        campaign_objective: inputs.campaignObjective,
        target_audience: inputs.targetAudience,
        key_benefits_features: inputs.keyBenefits,
        post_tone: inputs.postTone,
        call_to_action: inputs.callToAction,
        hashtag_strategy: inputs.hashtagStrategy,
        social_proof: inputs.socialProof,
        visual_content_suggestions: inputs.visualSuggestions
      };

      const response = await aiToolsService.generateAffiliateSocialSwipes(swipesData);
      setGeneratedSwipes(response);
      setActiveTab('result'); // Switch to result tab after successful generation
      console.log('Generated social swipes:', response);
      
      // Save to tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Affiliate Social Swipes',
          toolId: 'affiliate-social-swipes',
          outputResult: response,
          prompt: JSON.stringify(swipesData)
        });
        console.log('✅ Affiliate social swipes saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }

    } catch (error: any) {
      console.error('Error generating social swipes:', error);
      setError(error.message || 'Failed to generate social swipes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const socialTemplates = [
    { name: "Instagram Feed Post", icon: "fas fa-camera", description: "Professional Instagram feed posts with engaging captions." },
    { name: "Instagram Stories", icon: "fas fa-circle", description: "Story-style content with interactive elements and CTAs." },
    { name: "Facebook Posts", icon: "fas fa-thumbs-up", description: "Facebook-optimized posts for maximum engagement." },
    { name: "Twitter/X Posts", icon: "fas fa-twitter", description: "Concise, engaging Twitter posts with relevant hashtags." },
    { name: "LinkedIn Posts", icon: "fas fa-linkedin", description: "Professional LinkedIn content for B2B audiences." },
    { name: "TikTok/Reels Scripts", icon: "fas fa-video", description: "Short-form video scripts for TikTok and Instagram Reels." }
  ];

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Glassmorphic Header with blue gradient */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-share-alt text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Affiliate Social Swipes</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create engaging social media content for affiliates</p>
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
                {generatedSwipes && !error && (
                  <button 
                    onClick={() => setActiveTab('result')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${activeTab === 'result' ? 'text-blue-700 bg-blue-50/70' : 'text-blue-500 hover:text-blue-600'}`}
                  >
                    <span className="flex items-center gap-2">
                      <i className="fas fa-share-alt text-xs"></i>
                      Generated Swipes
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
                <div>
                  {/* Success notification - only show after generation */}
                  {generatedSwipes && !error && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <i className="fas fa-check text-green-600 text-sm"></i>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-green-900">Swipes Generated Successfully!</h4>
                            <p className="text-xs text-green-700 mt-1">Your social media swipes are ready to view.</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setActiveTab('result')}
                          className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
                        >
                          View Swipes
                          <i className="fas fa-arrow-right text-xs"></i>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Error Display */}
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}

                  <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Product & Brand Information</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="productName">Product Name</label>
                          <input
                            id="productName"
                            name="productName"
                            type="text"
                            value={inputs.productName}
                            onChange={handleInputChange}
                            placeholder="Enter your product name"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="brandName">Brand Name</label>
                          <input
                            id="brandName"
                            name="brandName"
                            type="text"
                            value={inputs.brandName}
                            onChange={handleInputChange}
                            placeholder="Enter the brand name"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="productDescription">Product Description</label>
                        <textarea 
                          id="productDescription"
                          name="productDescription"
                          value={inputs.productDescription}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Describe your product and its key benefits..."
                        ></textarea>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="targetPlatform">Target Platform</label>
                          <select
                            id="targetPlatform"
                            name="targetPlatform"
                            value={inputs.targetPlatform}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select platform</option>
                            <option value="instagram">Instagram</option>
                            <option value="facebook">Facebook</option>
                            <option value="twitter">Twitter/X</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="tiktok">TikTok</option>
                            <option value="all">All Platforms</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="campaignObjective">Campaign Objective</label>
                          <select
                            id="campaignObjective"
                            name="campaignObjective"
                            value={inputs.campaignObjective}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select objective</option>
                            <option value="awareness">Brand Awareness</option>
                            <option value="traffic">Drive Traffic</option>
                            <option value="conversions">Increase Conversions</option>
                            <option value="engagement">Boost Engagement</option>
                            <option value="leads">Generate Leads</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Content Strategy</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="targetAudience">Target Audience</label>
                        <textarea 
                          id="targetAudience"
                          name="targetAudience"
                          value={inputs.targetAudience}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Describe your target audience demographics, interests, and behaviors..."
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="keyBenefits">Key Benefits & Features</label>
                        <textarea 
                          id="keyBenefits"
                          name="keyBenefits"
                          value={inputs.keyBenefits}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="List the main benefits and features to highlight in social posts..."
                        ></textarea>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="postTone">Post Tone</label>
                          <select
                            id="postTone"
                            name="postTone"
                            value={inputs.postTone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="professional">Professional</option>
                            <option value="casual">Casual & Friendly</option>
                            <option value="enthusiastic">Enthusiastic</option>
                            <option value="educational">Educational</option>
                            <option value="inspiring">Inspiring</option>
                            <option value="conversational">Conversational</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="callToAction">Call to Action</label>
                          <input
                            id="callToAction"
                            name="callToAction"
                            type="text"
                            value={inputs.callToAction}
                            onChange={handleInputChange}
                            placeholder="e.g., Shop Now, Learn More, Get Started"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Additional Elements</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="hashtagStrategy">Hashtag Strategy</label>
                          <textarea 
                            id="hashtagStrategy"
                            name="hashtagStrategy"
                            value={inputs.hashtagStrategy}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                            placeholder="Relevant hashtags and tagging strategy..."
                          ></textarea>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="socialProof">Social Proof</label>
                          <textarea 
                            id="socialProof"
                            name="socialProof"
                            value={inputs.socialProof}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                            placeholder="Testimonials, reviews, user stats, or success stories..."
                          ></textarea>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="visualSuggestions">Visual Content Suggestions</label>
                        <textarea 
                          id="visualSuggestions"
                          name="visualSuggestions"
                          value={inputs.visualSuggestions}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Ideas for images, videos, graphics, or visual elements to accompany posts..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'result' && generatedSwipes && !error && (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="text-base font-medium text-green-900 mb-3 flex items-center gap-2">
                      <i className="fas fa-check-circle text-green-600"></i>
                      Generated Social Swipes ({generatedSwipes.social_swipes.length} posts)
                    </h4>
                    
                    <div className="space-y-4">
                      {generatedSwipes.social_swipes.map((swipe: any, index: number) => (
                        <div key={index} className="bg-white p-4 rounded border border-green-200">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="text-sm font-semibold text-green-900">Post #{index + 1}</h5>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                              {inputs.targetPlatform || 'Social Media'}
                            </span>
                          </div>
                          
                          <div className="space-y-3 text-sm text-green-800">
                            <div>
                              <strong>Post Text:</strong>
                              <p className="mt-1 whitespace-pre-wrap">{swipe.post_text}</p>
                            </div>
                            
                            <div>
                              <strong>Hashtags:</strong>
                              <p className="mt-1 text-blue-600">{swipe.hashtags}</p>
                            </div>
                            
                            <div>
                              <strong>Visual Content:</strong>
                              <p className="mt-1 italic">{swipe.visual_content}</p>
                            </div>
                            
                            <div>
                              <strong>Call to Action:</strong>
                              <p className="mt-1 font-medium text-green-700">{swipe.call_to_action}</p>
                            </div>
                          </div>
                          
                          <div className="mt-3 flex gap-2">
                            <button className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded hover:bg-green-200 transition-all">
                              <i className="fas fa-copy mr-1"></i>Copy Post
                            </button>
                            <button className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded hover:bg-blue-200 transition-all">
                              <i className="fas fa-edit mr-1"></i>Edit
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <button className="px-3 py-1.5 text-xs text-green-700 bg-green-100 rounded hover:bg-green-200 transition-all">
                        <i className="fas fa-copy mr-1"></i>Copy All Posts
                      </button>
                      <button className="px-3 py-1.5 text-xs text-blue-700 bg-blue-100 rounded hover:bg-blue-200 transition-all">
                        <i className="fas fa-download mr-1"></i>Export
                      </button>
                      <button className="px-3 py-1.5 text-xs text-purple-700 bg-purple-100 rounded hover:bg-purple-200 transition-all">
                        <i className="fas fa-share mr-1"></i>Schedule
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && (
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {socialTemplates.map((template, index) => (
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
                        onClick={() => {
                          setInputs(prev => ({...prev, targetPlatform: template.name.toLowerCase()}));
                          setActiveTab('generate');
                        }}
                        className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1"
                      >
                        Create
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {activeTab === 'history' && (
                <div className="py-4">
                  <History toolName="Affiliate Social Swipes" />
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
                  onClick={handleGenerateSwipes}
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
                      <span>Generate Swipes</span>
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
