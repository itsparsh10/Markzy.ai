'use client'

import { useState } from 'react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

export default function SocialMediaFreestyle({ onBackClick }: { onBackClick: () => void }) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [inputs, setInputs] = useState({
    platform: '',
    contentType: '',
    topic: '',
    contentIdea: '',
    targetAudience: '',
    brandVoice: '',
    postGoal: '',
    contentLength: '',
    includeCTA: '',
    hashtagPreference: '',
    visualElements: '',
    specialRequests: '',
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
        target_platform: inputs.platform,
        content_type: inputs.contentType,
        topic_subject: inputs.topic,
        content_idea_request: inputs.contentIdea,
        target_audience: inputs.targetAudience,
        brand_voice_tone: inputs.brandVoice,
        post_goal: inputs.postGoal,
        content_length: inputs.contentLength,
        include_call_to_action: inputs.includeCTA,
        hashtag_preference: inputs.hashtagPreference,
        visual_elements: inputs.visualElements,
        special_requests: inputs.specialRequests,
      };

      console.log('Generating social media freestyle content with data:', apiData);
      const response = await aiToolsService.generateSocialMediaFreestyle(apiData);
      console.log('API Response:', response);
      setResults(response);
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Social Media Freestyle',
          toolId: 'social-media-freestyle',
          outputResult: response,
          prompt: JSON.stringify(apiData)
        });
        console.log('✅ Social media freestyle saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
    } catch (err: any) {
      console.error('Error generating social media freestyle content:', err);
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
              <i className="fas fa-question text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Question Post</h4>
              <p className="text-xs text-blue-600">Engage your audience with thought-provoking questions.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-lightbulb text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Tips & Advice</h4>
              <p className="text-xs text-blue-600">Share valuable tips and advice with your audience.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-chart-line text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Behind the Scenes</h4>
              <p className="text-xs text-blue-600">Show the human side of your brand with BTS content.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-star text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">User-Generated Content</h4>
              <p className="text-xs text-blue-600">Encourage and showcase customer content.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-calendar text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Trending Topics</h4>
              <p className="text-xs text-blue-600">Jump on trending topics relevant to your brand.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-gift text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Product Showcase</h4>
              <p className="text-xs text-blue-600">Highlight your products in an engaging way.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
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
              <i className="fas fa-hashtag text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Social Media Freestyle</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create custom social media content for any idea</p>
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
                    <h4 className="text-base font-medium text-blue-900 mb-3">Platform & Content Type</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="platform">Target Platform</label>
                          <select
                            id="platform"
                            name="platform"
                            value={inputs.platform}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select platform</option>
                            <option value="Instagram">Instagram</option>
                            <option value="Twitter">Twitter</option>
                            <option value="LinkedIn">LinkedIn</option>
                            <option value="Facebook">Facebook</option>
                            <option value="TikTok">TikTok</option>
                            <option value="YouTube">YouTube</option>
                            <option value="Pinterest">Pinterest</option>
                            <option value="Snapchat">Snapchat</option>
                          </select>
                        </div>
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
                            <option value="Post">Regular Post</option>
                            <option value="Story">Story</option>
                            <option value="Reel">Reel/Short Video</option>
                            <option value="Carousel">Carousel</option>
                            <option value="Video">Video</option>
                            <option value="Thread">Thread</option>
                            <option value="Live">Live Stream</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="topic">Topic/Subject</label>
                        <input
                          id="topic"
                          name="topic"
                          type="text"
                          value={inputs.topic}
                          onChange={handleInputChange}
                          placeholder="What's the main topic or subject of your post?"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="contentIdea">Content Idea/Request</label>
                        <textarea 
                          id="contentIdea"
                          name="contentIdea"
                          value={inputs.contentIdea}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-24" 
                          placeholder="Describe your content idea or what you want to create..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Audience & Brand Voice</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="targetAudience">Target Audience</label>
                        <textarea 
                          id="targetAudience"
                          name="targetAudience"
                          value={inputs.targetAudience}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Who are you targeting with this content?"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="brandVoice">Brand Voice/Tone</label>
                        <select
                          id="brandVoice"
                          name="brandVoice"
                          value={inputs.brandVoice}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                        >
                          <option value="">Select brand voice</option>
                          <option value="Professional">Professional</option>
                          <option value="Casual & Friendly">Casual & Friendly</option>
                          <option value="Humorous">Humorous</option>
                          <option value="Inspirational">Inspirational</option>
                          <option value="Educational">Educational</option>
                          <option value="Conversational">Conversational</option>
                          <option value="Authoritative">Authoritative</option>
                          <option value="Playful">Playful</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="postGoal">Post Goal</label>
                        <textarea 
                          id="postGoal"
                          name="postGoal"
                          value={inputs.postGoal}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="What do you want to achieve with this post?"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Content Specifications</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="contentLength">Content Length</label>
                          <select
                            id="contentLength"
                            name="contentLength"
                            value={inputs.contentLength}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select length</option>
                            <option value="Short (1-2 lines)">Short (1-2 lines)</option>
                            <option value="Medium (3-5 lines)">Medium (3-5 lines)</option>
                            <option value="Long (paragraph)">Long (paragraph)</option>
                            <option value="Detailed (multiple paragraphs)">Detailed (multiple paragraphs)</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="includeCTA">Include Call-to-Action</label>
                          <select
                            id="includeCTA"
                            name="includeCTA"
                            value={inputs.includeCTA}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select CTA preference</option>
                            <option value="Yes, include CTA">Yes, include CTA</option>
                            <option value="No CTA needed">No CTA needed</option>
                            <option value="Subtle CTA">Subtle CTA</option>
                            <option value="Strong CTA">Strong CTA</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="hashtagPreference">Hashtag Preference</label>
                        <textarea 
                          id="hashtagPreference"
                          name="hashtagPreference"
                          value={inputs.hashtagPreference}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="Any specific hashtags to include or hashtag strategy?"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="visualElements">Visual Elements</label>
                        <textarea 
                          id="visualElements"
                          name="visualElements"
                          value={inputs.visualElements}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="Describe any visual elements or image suggestions needed"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="specialRequests">Special Requests</label>
                        <textarea 
                          id="specialRequests"
                          name="specialRequests"
                          value={inputs.specialRequests}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="Any other specific requirements or requests?"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'templates' && renderTemplatesTab()}
              {activeTab === 'history' && (
                <div className="py-4">
                  <History toolName="Social Media Freestyle" />
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
                      <span>Generating Content...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Content</span>
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
                        Generated Content
                      </h4>
                      
                      {/* Post Content */}
                      {results.post_content && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-sm font-semibold text-green-800">Post Content</h5>
                            <button
                              onClick={() => copyToClipboard(results.post_content, 'Post content')}
                              className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-all flex items-center gap-1"
                            >
                              <i className="fas fa-copy text-xs"></i>
                              Copy
                            </button>
                          </div>
                          <div className="p-3 bg-white border border-green-200 rounded text-sm text-green-900">
                            {results.post_content}
                          </div>
                        </div>
                      )}

                      {/* Hashtags */}
                      {results.hashtags && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-sm font-semibold text-green-800">Hashtags</h5>
                            <button
                              onClick={() => copyToClipboard(results.hashtags, 'Hashtags')}
                              className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-all flex items-center gap-1"
                            >
                              <i className="fas fa-copy text-xs"></i>
                              Copy
                            </button>
                          </div>
                          <div className="p-3 bg-white border border-green-200 rounded text-sm text-green-900">
                            {results.hashtags}
                          </div>
                        </div>
                      )}

                      {/* Call to Action */}
                      {results.call_to_action && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-sm font-semibold text-green-800">Call to Action</h5>
                            <button
                              onClick={() => copyToClipboard(results.call_to_action, 'Call to action')}
                              className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-all flex items-center gap-1"
                            >
                              <i className="fas fa-copy text-xs"></i>
                              Copy
                            </button>
                          </div>
                          <div className="p-3 bg-white border border-green-200 rounded text-sm text-green-900">
                            {results.call_to_action}
                          </div>
                        </div>
                      )}

                      {/* Visual Elements */}
                      {results.visual_elements && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-sm font-semibold text-green-800">Visual Elements</h5>
                            <button
                              onClick={() => copyToClipboard(results.visual_elements, 'Visual elements')}
                              className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-all flex items-center gap-1"
                            >
                              <i className="fas fa-copy text-xs"></i>
                              Copy
                            </button>
                          </div>
                          <div className="p-3 bg-white border border-green-200 rounded text-sm text-green-900">
                            {results.visual_elements}
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
