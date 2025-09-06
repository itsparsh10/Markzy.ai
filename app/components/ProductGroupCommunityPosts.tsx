'use client';

import React, { useState } from 'react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface ProductGroupCommunityPostsProps {
  onBackClick: () => void;
}

export default function ProductGroupCommunityPosts({ onBackClick }: ProductGroupCommunityPostsProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputs, setInputs] = useState({
    productName: '',
    productType: '',
    productDescription: '',
    communityType: '',
    communityPlatform: '',
    communitySize: '',
    engagementGoals: '',
    postType: '',
    audienceDemographics: '',
    contentThemes: '',
    callToAction: '',
    postFrequency: 'weekly'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGeneratePosts = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Prepare data for API
      const apiData = {
        product_name: inputs.productName,
        product_type: inputs.productType,
        product_description: inputs.productDescription,
        community_type: inputs.communityType,
        community_size: inputs.communitySize,
        post_type: inputs.postType,
        post_frequency: inputs.postFrequency,
        audience_demographics: inputs.audienceDemographics,
        engagement_goals: inputs.engagementGoals,
        content_themes: inputs.contentThemes,
        call_to_action: inputs.callToAction
      };

      const response = await aiToolsService.generateProductCommunityPosts(apiData);
      setResult(response);
      
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Product Group Community Posts',
          toolId: 'product-group-community-posts',
          outputResult: response,
          prompt: JSON.stringify(apiData)
        });
        console.log('✅ Product community posts saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
    } catch (err: any) {
      console.error('Error generating posts:', err);
      setError(err.message || 'Failed to generate posts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const communityTemplates = [
    { name: "Welcome Posts", icon: "fas fa-handshake", description: "Create welcoming posts for new community members." },
    { name: "Engagement Posts", icon: "fas fa-comments", description: "Generate posts to boost community engagement and discussion." },
    { name: "Educational Content", icon: "fas fa-graduation-cap", description: "Create educational posts related to your product." },
    { name: "Q&A Posts", icon: "fas fa-question-circle", description: "Generate question and answer posts for community interaction." },
    { name: "Success Stories", icon: "fas fa-trophy", description: "Create posts highlighting member achievements and success stories." },
    { name: "Event Announcements", icon: "fas fa-calendar-alt", description: "Create posts for community events and product updates." }
  ];

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Glassmorphic Header with blue gradient */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-users text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Product Group & Community Posts</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create engaging posts for your product's community</p>
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
              </div>
              <button className="px-3 py-1.5 text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all flex items-center gap-1 border border-blue-100">
                <i className="fas fa-save text-xs"></i> Save as Template
              </button>
            </div>
            
            {/* Tab Content */}
            <div className="p-4 pt-3">
              {activeTab === 'generate' && (
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                  {/* Error Display */}
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 text-red-700">
                        <i className="fas fa-exclamation-circle"></i>
                        <span className="font-medium">Error</span>
                      </div>
                      <p className="text-sm text-red-600 mt-1">{error}</p>
                    </div>
                  )}

                  {/* Loading State */}
                  {isLoading && (
                    <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
                      <div className="flex items-center justify-center gap-3 text-blue-700">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="font-medium">Generating your community posts...</span>
                      </div>
                      <p className="text-sm text-blue-600 mt-2">This may take a few moments</p>
                    </div>
                  )}

                  {/* Results Display */}
                  {result && !isLoading && (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 text-green-700 mb-3">
                          <i className="fas fa-check-circle"></i>
                          <span className="font-medium">Generated Community Posts</span>
                        </div>
                        
                        {/* Main Post Content */}
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-semibold text-green-800 mb-2">Main Post Content</h4>
                            <div className="bg-white p-3 rounded border border-green-100">
                              <p className="text-sm text-gray-800 whitespace-pre-wrap">{result.post_content}</p>
                            </div>
                          </div>

                          {/* Post Ideas */}
                          {result.post_ideas && result.post_ideas.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-green-800 mb-2">Additional Post Ideas</h4>
                              <div className="bg-white p-3 rounded border border-green-100">
                                <ul className="space-y-2">
                                  {result.post_ideas.map((idea: string, index: number) => (
                                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                      <span className="text-green-600 mt-1">•</span>
                                      <span>{idea}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}

                          {/* Strategy Summary */}
                          {result.strategy_summary && (
                            <div>
                              <h4 className="text-sm font-semibold text-green-800 mb-2">Strategy Summary</h4>
                              <div className="bg-white p-3 rounded border border-green-100">
                                <p className="text-sm text-gray-700">{result.strategy_summary}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-4 pt-3 border-t border-green-200">
                          <button 
                            onClick={() => {
                              if (result.post_content) {
                                navigator.clipboard.writeText(result.post_content);
                              }
                            }}
                            className="px-3 py-1.5 text-xs text-green-700 bg-green-100 hover:bg-green-200 rounded transition-all flex items-center gap-1"
                          >
                            <i className="fas fa-copy"></i>
                            Copy Post
                          </button>
                          <button 
                            onClick={() => setResult(null)}
                            className="px-3 py-1.5 text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 rounded transition-all flex items-center gap-1"
                          >
                            <i className="fas fa-times"></i>
                            Clear
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Product Information</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="productName">Product Name</label>
                          <input 
                            id="productName"
                            name="productName"
                            value={inputs.productName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all" 
                            placeholder="Enter your product name"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="productType">Product Type</label>
                          <select
                            id="productType"
                            name="productType"
                            value={inputs.productType}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select product type</option>
                            <option value="course">Online Course</option>
                            <option value="software">Software/App</option>
                            <option value="membership">Membership Site</option>
                            <option value="community">Community Platform</option>
                            <option value="coaching">Coaching Program</option>
                            <option value="service">Service</option>
                          </select>
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
                          placeholder="Briefly describe your product and what it offers to community members..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Community Details</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="communityType">Community Type</label>
                          <select
                            id="communityType"
                            name="communityType"
                            value={inputs.communityType}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select community type</option>
                            <option value="facebook">Facebook Group</option>
                            <option value="discord">Discord Server</option>
                            <option value="slack">Slack Workspace</option>
                            <option value="circle">Circle Community</option>
                            <option value="mighty">Mighty Networks</option>
                            <option value="private">Private Forum</option>
                            <option value="other">Other Platform</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="communitySize">Community Size</label>
                          <select
                            id="communitySize"
                            name="communitySize"
                            value={inputs.communitySize}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select community size</option>
                            <option value="small">Small (1-100 members)</option>
                            <option value="medium">Medium (100-1000 members)</option>
                            <option value="large">Large (1000-10000 members)</option>
                            <option value="xlarge">Very Large (10000+ members)</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="postType">Post Type</label>
                          <select
                            id="postType"
                            name="postType"
                            value={inputs.postType}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select post type</option>
                            <option value="welcome">Welcome Posts</option>
                            <option value="engagement">Engagement Posts</option>
                            <option value="educational">Educational Content</option>
                            <option value="qa">Q&A Posts</option>
                            <option value="success">Success Stories</option>
                            <option value="announcement">Announcements</option>
                            <option value="discussion">Discussion Starters</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="postFrequency">Post Frequency</label>
                          <select
                            id="postFrequency"
                            name="postFrequency"
                            value={inputs.postFrequency}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="biweekly">Bi-weekly</option>
                            <option value="monthly">Monthly</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Content Strategy</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="audienceDemographics">Audience Demographics</label>
                        <textarea 
                          id="audienceDemographics"
                          name="audienceDemographics"
                          value={inputs.audienceDemographics}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Describe your community members (age, profession, interests, goals, etc.)..."
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="engagementGoals">Engagement Goals</label>
                        <textarea 
                          id="engagementGoals"
                          name="engagementGoals"
                          value={inputs.engagementGoals}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="What do you want to achieve with these posts? (increase engagement, drive sales, build community, etc.)"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="contentThemes">Content Themes</label>
                        <textarea 
                          id="contentThemes"
                          name="contentThemes"
                          value={inputs.contentThemes}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="What topics and themes should the posts cover? (tutorials, tips, success stories, Q&A, etc.)"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="callToAction">Call to Action</label>
                        <textarea 
                          id="callToAction"
                          name="callToAction"
                          value={inputs.callToAction}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="What action should community members take after reading the posts?"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && (
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {communityTemplates.map((template, index) => (
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
                  <History toolName="Product Group Community Posts" />
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
                  onClick={handleGeneratePosts}
                  disabled={isLoading}
                  className={`px-5 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Posts</span>
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
