'use client'

import { useState } from 'react';
import { Copy, Check, X, Wand2 } from 'lucide-react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface SocialPost {
  platform: string;
  content: string;
  hashtags: string;
  call_to_action: string;
}

interface SocialContentFromTranscriptsResults {
  posts: SocialPost[];
  summary: string;
}

export default function SocialContentFromTranscripts({ onBackClick }: { onBackClick: () => void }) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [inputs, setInputs] = useState({
    transcriptType: '',
    transcriptContent: '',
    platformTargets: '',
    contentGoals: '',
    audienceDescription: '',
    brandTone: '',
    contentLength: '',
    callToAction: '',
    hashtagStrategy: '',
    contentFormat: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<SocialContentFromTranscriptsResults | null>(null);
  const [copiedSections, setCopiedSections] = useState<{[key: string]: boolean}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError('');
    setResults(null);

    try {
      // Validate required fields
      const requiredFields = ['transcriptType', 'transcriptContent', 'platformTargets', 'contentGoals', 'audienceDescription', 'brandTone', 'contentLength', 'callToAction', 'hashtagStrategy', 'contentFormat'];
      const missingFields = requiredFields.filter(field => !inputs[field as keyof typeof inputs]);
      
      if (missingFields.length > 0) {
        setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
        setIsGenerating(false);
        return;
      }

      const data = {
        transcript_type: inputs.transcriptType,
        content_format: inputs.contentFormat,
        transcript_content: inputs.transcriptContent,
        target_platforms: inputs.platformTargets,
        content_goals: inputs.contentGoals,
        target_audience: inputs.audienceDescription,
        brand_tone: inputs.brandTone,
        content_length: inputs.contentLength,
        call_to_action: inputs.callToAction,
        hashtag_strategy: inputs.hashtagStrategy,
      };

      console.log('Form inputs:', inputs);
      console.log('Sending data to API:', data);
      const response = await aiToolsService.generateSocialContentFromTranscripts(data);
      console.log('API Response:', response);
      
      if (response && response.posts && response.summary) {
        setResults(response);
        // Save tool history silently
        try {
          await saveToolHistorySilent({
            toolName: 'Social Content From Transcripts',
            toolId: 'social-content-from-transcripts',
            outputResult: response,
            prompt: JSON.stringify(data)
          });
          console.log('✅ Social content from transcripts saved to history');
        } catch (historyError) {
          console.warn('⚠️ Failed to save to history:', historyError);
        }
      } else {
        setError('Invalid response format from API');
      }
    } catch (err: any) {
      console.error('Error generating social content from transcripts:', err);
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Failed to generate social content. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSections(prev => ({ ...prev, [section]: true }));
      setTimeout(() => {
        setCopiedSections(prev => ({ ...prev, [section]: false }));
      }, 2000);
    } catch (err: any) {
      console.error('Failed to copy text:', err);
    }
  };

  const renderTemplatesTab = () => {
    return (
      <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-instagram text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Instagram Posts</h4>
              <p className="text-xs text-blue-600">Create engaging Instagram captions from your transcript content.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-twitter text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Twitter Threads</h4>
              <p className="text-xs text-blue-600">Transform transcript into engaging Twitter thread content.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-linkedin text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">LinkedIn Posts</h4>
              <p className="text-xs text-blue-600">Create professional LinkedIn content from transcript insights.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-quote-left text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Quote Cards</h4>
              <p className="text-xs text-blue-600">Extract powerful quotes from transcripts for visual posts.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-list text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Listicle Posts</h4>
              <p className="text-xs text-blue-600">Convert transcript content into engaging listicle format.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-play text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Video Captions</h4>
              <p className="text-xs text-blue-600">Create compelling captions for video content from transcripts.</p>
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
              <i className="fas fa-comments text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Social Content from Transcripts</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create conversation-worthy captions from your transcripts</p>
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
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Transcript Content</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="transcriptType">Transcript Type</label>
                          <select
                            id="transcriptType"
                            name="transcriptType"
                            value={inputs.transcriptType}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select transcript type</option>
                            <option value="podcast">Podcast</option>
                            <option value="video">Video</option>
                            <option value="interview">Interview</option>
                            <option value="webinar">Webinar</option>
                            <option value="presentation">Presentation</option>
                            <option value="workshop">Workshop</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="contentFormat">Content Format</label>
                          <select
                            id="contentFormat"
                            name="contentFormat"
                            value={inputs.contentFormat}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select format</option>
                            <option value="single-post">Single Post</option>
                            <option value="carousel">Carousel</option>
                            <option value="thread">Thread</option>
                            <option value="story">Story</option>
                            <option value="video-caption">Video Caption</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="transcriptContent">Transcript Content</label>
                        <textarea 
                          id="transcriptContent"
                          name="transcriptContent"
                          value={inputs.transcriptContent}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-32" 
                          placeholder="Paste your transcript content here..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Social Media Strategy</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="platformTargets">Target Platforms</label>
                        <select
                          id="platformTargets"
                          name="platformTargets"
                          value={inputs.platformTargets}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                        >
                          <option value="">Select platforms</option>
                          <option value="instagram">Instagram</option>
                          <option value="twitter">Twitter</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="facebook">Facebook</option>
                          <option value="tiktok">TikTok</option>
                          <option value="youtube">YouTube</option>
                          <option value="multiple">Multiple Platforms</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="contentGoals">Content Goals</label>
                        <textarea 
                          id="contentGoals"
                          name="contentGoals"
                          value={inputs.contentGoals}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="What do you want to achieve with this social content?"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="audienceDescription">Target Audience</label>
                        <textarea 
                          id="audienceDescription"
                          name="audienceDescription"
                          value={inputs.audienceDescription}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Describe your target audience for this content"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Content Customization</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="brandTone">Brand Tone</label>
                          <select
                            id="brandTone"
                            name="brandTone"
                            value={inputs.brandTone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select tone</option>
                            <option value="professional">Professional</option>
                            <option value="casual">Casual</option>
                            <option value="friendly">Friendly</option>
                            <option value="inspirational">Inspirational</option>
                            <option value="educational">Educational</option>
                            <option value="entertaining">Entertaining</option>
                          </select>
                        </div>
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
                            <option value="short">Short (1-2 sentences)</option>
                            <option value="medium">Medium (3-5 sentences)</option>
                            <option value="long">Long (paragraph)</option>
                            <option value="extended">Extended (multiple paragraphs)</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="callToAction">Call to Action</label>
                        <textarea 
                          id="callToAction"
                          name="callToAction"
                          value={inputs.callToAction}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="What action do you want your audience to take?"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="hashtagStrategy">Hashtag Strategy</label>
                        <textarea 
                          id="hashtagStrategy"
                          name="hashtagStrategy"
                          value={inputs.hashtagStrategy}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="Any specific hashtags or themes to include?"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  
                  {/* Error Display */}
                  {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center">
                        <X className="w-5 h-5 text-red-500 mr-2" />
                        <p className="text-red-700 text-sm">{error}</p>
                      </div>
                    </div>
                  )}

                  {/* Results Display */}
                  {results && (
                    <div className="mt-6 space-y-4">
                      <h3 className="text-lg font-semibold text-blue-900 mb-4">Generated Social Content</h3>
                      
                      {/* Summary */}
                      <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-blue-900">Summary</h4>
                          <button
                            onClick={() => copyToClipboard(results.summary, 'summary')}
                            className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                          >
                            {copiedSections.summary ? (
                              <Check className="w-4 h-4 mr-1" />
                            ) : (
                              <Copy className="w-4 h-4 mr-1" />
                            )}
                            {copiedSections.summary ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                        <p className="text-gray-700">{results.summary}</p>
                      </div>

                      {/* Social Posts */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-blue-900">Generated Posts</h4>
                        {results.posts.map((post, index) => (
                          <div key={index} className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                  {post.platform}
                                </span>
                                <span className="text-sm text-gray-500">Post {index + 1}</span>
                              </div>
                              <button
                                onClick={() => copyToClipboard(`${post.content}\n\n${post.hashtags}\n\n${post.call_to_action}`, `post-${index}`)}
                                className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                              >
                                {copiedSections[`post-${index}`] ? (
                                  <Check className="w-4 h-4 mr-1" />
                                ) : (
                                  <Copy className="w-4 h-4 mr-1" />
                                )}
                                {copiedSections[`post-${index}`] ? 'Copied!' : 'Copy All'}
                              </button>
                            </div>
                            
                            <div className="space-y-3">
                              {/* Content */}
                              <div>
                                <label className="block text-xs font-semibold text-blue-900 mb-1">Content</label>
                                <p className="text-gray-700 text-sm">{post.content}</p>
                              </div>
                              
                              {/* Hashtags */}
                              {post.hashtags && (
                                <div>
                                  <label className="block text-xs font-semibold text-blue-900 mb-1">Hashtags</label>
                                  <p className="text-gray-700 text-sm">{post.hashtags}</p>
                                </div>
                              )}
                              
                              {/* Call to Action */}
                              {post.call_to_action && (
                                <div>
                                  <label className="block text-xs font-semibold text-blue-900 mb-1">Call to Action</label>
                                  <p className="text-gray-700 text-sm">{post.call_to_action}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'templates' && renderTemplatesTab()}
              {activeTab === 'history' && (
                <div className="py-4">
                  <History toolName="Social Content From Transcripts" />
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
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="px-5 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 disabled:bg-blue-400 transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <span>Generate Content</span>
                      <Wand2 size={16} className="group-hover:translate-x-0.5 transition-transform" />
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
