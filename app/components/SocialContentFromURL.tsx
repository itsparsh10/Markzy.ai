'use client'

import { useState } from 'react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

export default function SocialContentFromURL({ onBackClick }: { onBackClick: () => void }) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [inputs, setInputs] = useState({
    websiteUrl: '',
    contentType: '',
    socialPlatforms: '',
    targetAudience: '',
    contentTone: '',
    postCount: '',
    contentFocus: '',
    includeHashtags: '',
    callToAction: '',
    additionalNotes: ''
  });

  // API state management
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError('');
    setResults(null);

    try {
      // Map component inputs to API field names
      const apiData = {
        website_url: inputs.websiteUrl,
        content_type: inputs.contentType,
        target_platforms: inputs.socialPlatforms,
        target_audience: inputs.targetAudience,
        content_tone: inputs.contentTone,
        content_focus: inputs.contentFocus,
        number_of_posts: inputs.postCount ? parseInt(inputs.postCount) : 3,
        include_hashtags: inputs.includeHashtags,
        call_to_action: inputs.callToAction,
        additional_notes: inputs.additionalNotes,
      };

      console.log('Generating social content from URL with data:', apiData);
      const response = await aiToolsService.generateSocialContentFromURL(apiData);
      console.log('API Response:', response);
      setResults(response);
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Social Content From URL',
          toolId: 'social-content-from-url',
          outputResult: response,
          prompt: JSON.stringify(apiData)
        });
        console.log('✅ Social content from URL saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
    } catch (err: any) {
      console.error('Error generating social content from URL:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
      console.log(`${label} copied to clipboard`);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const renderTemplatesTab = () => {
    return (
      <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-share-alt text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Blog Post to Social</h4>
              <p className="text-xs text-blue-600">Convert blog posts into engaging social media content.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-shopping-cart text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Product Page to Social</h4>
              <p className="text-xs text-blue-600">Transform product pages into compelling social posts.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-newspaper text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">News Article to Social</h4>
              <p className="text-xs text-blue-600">Convert news articles into shareable social content.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-video text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Video Content to Social</h4>
              <p className="text-xs text-blue-600">Create social posts from video content and descriptions.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-home text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Landing Page to Social</h4>
              <p className="text-xs text-blue-600">Transform landing pages into promotional social content.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
      </div>
    );
  };

  const renderHistoryTab = () => {
    return (
      <div className="py-4 flex flex-col items-center justify-center text-center space-y-2">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <i className="fas fa-history text-blue-500 text-xl"></i>
        </div>
        <h3 className="text-blue-900 font-medium">Social Content History</h3>
        <p className="text-sm text-blue-700 max-w-md">View your previously generated social media content from URLs.</p>
        <button className="mt-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 hover:bg-blue-100 transition-all duration-200 text-sm">
          <i className="fas fa-clock mr-2"></i>View History
        </button>
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
              <i className="fas fa-share-alt text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Social Content from a Page URL</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Turn web pages into engaging social media posts</p>
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
                    <h4 className="text-base font-medium text-blue-900 mb-3">URL & Content Information</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="websiteUrl">Website URL</label>
                        <input
                          id="websiteUrl"
                          name="websiteUrl"
                          type="url"
                          value={inputs.websiteUrl}
                          onChange={handleInputChange}
                          placeholder="https://example.com/page-to-convert"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="contentType">Content Type</label>
                          <select
                            id="contentType"
                            name="contentType"
                            value={inputs.contentType}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select content type</option>
                            <option value="Blog Post">Blog Post</option>
                            <option value="Product Page">Product Page</option>
                            <option value="Landing Page">Landing Page</option>
                            <option value="News Article">News Article</option>
                            <option value="Service Page">Service Page</option>
                            <option value="About Page">About Page</option>
                            <option value="Case Study">Case Study</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="socialPlatforms">Target Platforms</label>
                          <select
                            id="socialPlatforms"
                            name="socialPlatforms"
                            value={inputs.socialPlatforms}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select platforms</option>
                            <option value="All Platforms">All Platforms</option>
                            <option value="Facebook">Facebook</option>
                            <option value="Instagram">Instagram</option>
                            <option value="Twitter">Twitter</option>
                            <option value="LinkedIn">LinkedIn</option>
                            <option value="Pinterest">Pinterest</option>
                            <option value="TikTok">TikTok</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Social Media Strategy</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="targetAudience">Target Audience</label>
                        <textarea 
                          id="targetAudience"
                          name="targetAudience"
                          value={inputs.targetAudience}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="Who are you trying to reach with these social posts?"
                        ></textarea>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="contentTone">Content Tone</label>
                          <select
                            id="contentTone"
                            name="contentTone"
                            value={inputs.contentTone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select tone</option>
                            <option value="Professional">Professional</option>
                            <option value="Casual & Friendly">Casual & Friendly</option>
                            <option value="Educational">Educational</option>
                            <option value="Inspirational">Inspirational</option>
                            <option value="Entertaining">Entertaining</option>
                            <option value="Promotional">Promotional</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="postCount">Number of Posts</label>
                          <select
                            id="postCount"
                            name="postCount"
                            value={inputs.postCount}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select count</option>
                            <option value="3">3 posts</option>
                            <option value="5">5 posts</option>
                            <option value="10">10 posts</option>
                            <option value="15">15 posts</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="contentFocus">Content Focus</label>
                        <select
                          id="contentFocus"
                          name="contentFocus"
                          value={inputs.contentFocus}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                        >
                          <option value="">Select focus</option>
                          <option value="Key Highlights">Key Highlights</option>
                          <option value="Tips & Insights">Tips & Insights</option>
                          <option value="Quotes & Takeaways">Quotes & Takeaways</option>
                          <option value="Engagement Questions">Engagement Questions</option>
                          <option value="Behind the Scenes">Behind the Scenes</option>
                          <option value="Testimonials/Reviews">Testimonials/Reviews</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Post Configuration</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="includeHashtags">Include Hashtags</label>
                          <select
                            id="includeHashtags"
                            name="includeHashtags"
                            value={inputs.includeHashtags}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select option</option>
                            <option value="yes">Yes, include hashtags</option>
                            <option value="no">No hashtags</option>
                            <option value="minimal">Minimal hashtags</option>
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
                            placeholder="e.g., Visit our website, Learn more, Get started"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="additionalNotes">Additional Notes</label>
                        <textarea 
                          id="additionalNotes"
                          name="additionalNotes"
                          value={inputs.additionalNotes}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="Any specific requirements or preferences for the social posts?"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'templates' && renderTemplatesTab()}
              {activeTab === 'history' && (
                <div className="py-4">
                  <History toolName="Social Content From URL" />
                </div>
              )}
            </div>
            
            {/* Generate Button and Results */}
            {activeTab === 'generate' && (
              <div className="px-4 py-3 border-t border-blue-100">
                {/* Error Display */}
                {error && (
                  <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-red-700">
                      <i className="fas fa-exclamation-triangle text-sm"></i>
                      <span className="text-sm font-medium">{error}</span>
                    </div>
                  </div>
                )}

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full px-5 py-3 text-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <i className="fas fa-spinner fa-spin text-sm"></i>
                      <span>Generating Social Content...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Social Content</span>
                      <i className="fas fa-arrow-right text-xs"></i>
                    </>
                  )}
                </button>

                {/* Results Display */}
                {results && (
                  <div className="mt-4 space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="text-base font-medium text-green-900 mb-3 flex items-center gap-2">
                        <i className="fas fa-check-circle text-green-600"></i>
                        Generated Social Content
                      </h4>
                      
                      {/* Posts */}
                      {results.posts && results.posts.length > 0 && (
                        <div className="mb-4">
                          <h5 className="text-sm font-semibold text-green-800 mb-3">Social Media Posts</h5>
                          <div className="space-y-3">
                            {results.posts.map((post: any, index: number) => (
                              <div key={index} className="p-3 bg-white border border-green-200 rounded">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
                                    {post.platform}
                                  </span>
                                  <button
                                    onClick={() => copyToClipboard(post.content, `Post ${index + 1} content`)}
                                    className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-all flex items-center gap-1"
                                  >
                                    <i className="fas fa-copy text-xs"></i>
                                    Copy
                                  </button>
                                </div>
                                <div className="text-sm text-green-900 mb-2">
                                  {post.content}
                                </div>
                                {post.hashtags && (
                                  <div className="text-xs text-green-700 mb-2">
                                    <strong>Hashtags:</strong> {post.hashtags}
                                  </div>
                                )}
                                {post.call_to_action && (
                                  <div className="text-xs text-green-700">
                                    <strong>CTA:</strong> {post.call_to_action}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Summary */}
                      {results.summary && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-sm font-semibold text-green-800">Summary</h5>
                            <button
                              onClick={() => copyToClipboard(results.summary, 'Summary')}
                              className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-all flex items-center gap-1"
                            >
                              <i className="fas fa-copy text-xs"></i>
                              Copy
                            </button>
                          </div>
                          <div className="p-3 bg-white border border-green-200 rounded text-sm text-green-900">
                            {results.summary}
                          </div>
                        </div>
                      )}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
