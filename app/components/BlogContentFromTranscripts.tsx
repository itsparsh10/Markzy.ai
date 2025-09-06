'use client';

import React, { useState } from 'react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface BlogContentFromTranscriptsProps {
  onBackClick: () => void;
}

export default function BlogContentFromTranscripts({ onBackClick }: BlogContentFromTranscriptsProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'result' | 'templates' | 'history'>('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [inputs, setInputs] = useState({
    transcriptContent: '',
    contentType: '',
    targetAudience: '',
    blogTone: '',
    keyTopics: '',
    callToAction: '',
    seoKeywords: '',
    contentPurpose: '',
    brandVoice: '',
    contentLength: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateBlogContent = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Map form inputs to API format
      const apiData = {
        transcript: inputs.transcriptContent,
        content_type: inputs.contentType,
        desired_blog_length: inputs.contentLength,
        target_audience: inputs.targetAudience,
        content_purpose: inputs.contentPurpose,
        key_topics_to_highlight: inputs.keyTopics,
        blog_tone: inputs.blogTone,
        brand_voice: inputs.brandVoice,
        seo_keywords: inputs.seoKeywords,
        call_to_action: inputs.callToAction
      };

      const response = await aiToolsService.generateBlogFromTranscript(apiData);
      setResult(response);
      setActiveTab('result'); // Switch to result tab after successful generation
      
      // Save to tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Blog Content from Transcripts',
          toolId: 'blog-content-from-transcripts',
          outputResult: response,
          prompt: JSON.stringify(apiData)
        });
        console.log('✅ Blog content from transcripts saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }

    } catch (err: any) {
      console.error('Error generating blog content:', err);
      setError(err.message || 'Failed to generate blog content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const blogTemplates = [
    { name: "How-To Guide", icon: "fas fa-list-ol", description: "Transform transcripts into step-by-step tutorial blog posts." },
    { name: "Expert Interview", icon: "fas fa-microphone", description: "Convert interview transcripts into engaging blog articles." },
    { name: "Case Study", icon: "fas fa-chart-line", description: "Turn success stories and results into detailed case studies." },
    { name: "Educational Content", icon: "fas fa-graduation-cap", description: "Create informative blog posts from educational transcripts." },
    { name: "Behind the Scenes", icon: "fas fa-camera", description: "Share insights and process stories from transcript content." },
    { name: "FAQ Blog Post", icon: "fas fa-question-circle", description: "Transform Q&A sessions into comprehensive FAQ articles." }
  ];

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Glassmorphic Header with blue gradient */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-file-alt text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Blog Content from Transcripts</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Turn your transcripts into fresh content ideas, outlines, and blog posts</p>
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
                {result && !error && (
                  <button 
                    onClick={() => setActiveTab('result')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${activeTab === 'result' ? 'text-blue-700 bg-blue-50/70' : 'text-blue-500 hover:text-blue-600'}`}
                  >
                    <span className="flex items-center gap-2">
                      <i className="fas fa-file-alt text-xs"></i>
                      Generated Content
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
                  {result && !error && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <i className="fas fa-check text-green-600 text-sm"></i>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-green-900">Content Generated Successfully!</h4>
                            <p className="text-xs text-green-700 mt-1">Your blog content is ready to view.</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setActiveTab('result')}
                          className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
                        >
                          View Content
                          <i className="fas fa-arrow-right text-xs"></i>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                    {/* Error Display */}
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 text-red-700">
                        <i className="fas fa-exclamation-triangle text-sm"></i>
                        <span className="text-sm font-medium">{error}</span>
                      </div>
                    </div>
                  )}

                  {/* Result Display */}
                  {result && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-medium text-green-900">Generated Blog Content</h4>
                        <button 
                          onClick={() => setResult(null)}
                          className="text-green-600 hover:text-green-800 transition-colors"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                      
                      {/* Parse and display the blog content */}
                      {result.blog_content_raw && (() => {
                        try {
                          const blogData = JSON.parse(result.blog_content_raw);
                          return (
                            <div className="space-y-4">
                              {/* Title */}
                              {blogData.title && (
                                <div className="space-y-2">
                                  <h5 className="text-sm font-semibold text-green-800">Blog Title</h5>
                                  <p className="text-sm text-green-700 bg-white p-3 rounded border font-medium">{blogData.title}</p>
                                </div>
                              )}

                              {/* Outline */}
                              {blogData.outline && blogData.outline.length > 0 && (
                                <div className="space-y-2">
                                  <h5 className="text-sm font-semibold text-green-800">Blog Outline</h5>
                                  <div className="bg-white p-3 rounded border space-y-2">
                                    {blogData.outline.map((item: string, index: number) => (
                                      <div key={index} className="flex items-start gap-2">
                                        <span className="text-green-600 text-xs mt-1 font-bold">{index + 1}.</span>
                                        <span className="text-sm text-green-700">{item}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Blog Post */}
                              {blogData.blog_post && (
                                <div className="space-y-2">
                                  <h5 className="text-sm font-semibold text-green-800">Blog Post Content</h5>
                                  <div className="bg-white p-3 rounded border">
                                    <div className="text-sm text-green-700 leading-relaxed whitespace-pre-wrap">{blogData.blog_post}</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        } catch (parseError) {
                          return (
                            <div className="space-y-2">
                              <h5 className="text-sm font-semibold text-green-800">Raw Blog Content</h5>
                              <div className="bg-white p-3 rounded border">
                                <div className="text-sm text-green-700 leading-relaxed whitespace-pre-wrap">{result.blog_content_raw}</div>
                              </div>
                            </div>
                          );
                        }
                      })()}

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-2">
                        <button className="px-3 py-1.5 text-xs text-green-700 bg-green-100 hover:bg-green-200 rounded transition-colors flex items-center gap-1">
                          <i className="fas fa-copy text-xs"></i>
                          Copy All
                        </button>
                        <button className="px-3 py-1.5 text-xs text-green-700 bg-green-100 hover:bg-green-200 rounded transition-colors flex items-center gap-1">
                          <i className="fas fa-download text-xs"></i>
                          Export
                        </button>
                        <button className="px-3 py-1.5 text-xs text-green-700 bg-green-100 hover:bg-green-200 rounded transition-colors flex items-center gap-1">
                          <i className="fas fa-save text-xs"></i>
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                  {/* Transcript Content */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Transcript Content</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="transcriptContent">Paste Your Transcript</label>
                        <textarea 
                          id="transcriptContent"
                          name="transcriptContent"
                          value={inputs.transcriptContent}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-32" 
                          placeholder="Paste your transcript content here (from videos, podcasts, interviews, webinars, etc.)"
                        ></textarea>
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
                            <option value="podcast">Podcast Episode</option>
                            <option value="interview">Interview</option>
                            <option value="webinar">Webinar</option>
                            <option value="video">Video Content</option>
                            <option value="meeting">Meeting/Discussion</option>
                            <option value="presentation">Presentation</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="contentLength">Desired Blog Length</label>
                          <select
                            id="contentLength"
                            name="contentLength"
                            value={inputs.contentLength}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select length</option>
                            <option value="short">Short (500-800 words)</option>
                            <option value="medium">Medium (800-1500 words)</option>
                            <option value="long">Long (1500+ words)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Strategy */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Content Strategy</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="targetAudience">Target Audience</label>
                          <textarea 
                            id="targetAudience"
                            name="targetAudience"
                            value={inputs.targetAudience}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                            placeholder="Who is this blog post for?"
                          ></textarea>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="contentPurpose">Content Purpose</label>
                          <textarea 
                            id="contentPurpose"
                            name="contentPurpose"
                            value={inputs.contentPurpose}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                            placeholder="What's the goal of this blog post?"
                          ></textarea>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="keyTopics">Key Topics to Highlight</label>
                        <textarea 
                          id="keyTopics"
                          name="keyTopics"
                          value={inputs.keyTopics}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="Which main topics or points should be emphasized in the blog post?"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Blog Formatting */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Blog Formatting & Style</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="blogTone">Blog Tone</label>
                          <select
                            id="blogTone"
                            name="blogTone"
                            value={inputs.blogTone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select tone</option>
                            <option value="professional">Professional</option>
                            <option value="conversational">Conversational</option>
                            <option value="educational">Educational</option>
                            <option value="inspiring">Inspiring</option>
                            <option value="casual">Casual</option>
                            <option value="authoritative">Authoritative</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="brandVoice">Brand Voice</label>
                          <input
                            id="brandVoice"
                            name="brandVoice"
                            type="text"
                            value={inputs.brandVoice}
                            onChange={handleInputChange}
                            placeholder="e.g., friendly, expert, approachable"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="seoKeywords">SEO Keywords (optional)</label>
                        <input
                          id="seoKeywords"
                          name="seoKeywords"
                          type="text"
                          value={inputs.seoKeywords}
                          onChange={handleInputChange}
                          placeholder="Enter relevant keywords separated by commas"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="callToAction">Call to Action (optional)</label>
                        <textarea 
                          id="callToAction"
                          name="callToAction"
                          value={inputs.callToAction}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="What action do you want readers to take after reading?"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'result' && result && !error && (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-4">
                    <h4 className="text-base font-medium text-green-900 mb-3 flex items-center gap-2">
                      <i className="fas fa-check-circle text-green-600"></i>
                      Generated Blog Content
                    </h4>
                    
                    {/* Blog Title */}
                    {result.blog_content?.title && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-semibold text-green-800">Blog Title</h5>
                        <p className="text-sm text-green-700 bg-white p-3 rounded border font-medium">{result.blog_content.title}</p>
                      </div>
                    )}

                    {/* Blog Content */}
                    {result.blog_content?.content && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-semibold text-green-800">Blog Content</h5>
                        <div className="text-sm text-green-700 bg-white p-4 rounded border leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
                          {result.blog_content.content}
                        </div>
                      </div>
                    )}

                    {/* SEO Keywords */}
                    {result.blog_content?.seo_keywords && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-semibold text-green-800">SEO Keywords</h5>
                        <p className="text-sm text-green-700 bg-white p-3 rounded border">{result.blog_content.seo_keywords}</p>
                      </div>
                    )}

                    {/* Meta Description */}
                    {result.blog_content?.meta_description && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-semibold text-green-800">Meta Description</h5>
                        <p className="text-sm text-green-700 bg-white p-3 rounded border">{result.blog_content.meta_description}</p>
                      </div>
                    )}
                    
                    <div className="flex gap-2 pt-2">
                      <button className="px-3 py-1.5 text-xs text-green-700 bg-green-100 rounded hover:bg-green-200 transition-all">
                        <i className="fas fa-copy mr-1"></i>Copy All
                      </button>
                      <button className="px-3 py-1.5 text-xs text-blue-700 bg-blue-100 rounded hover:bg-blue-200 transition-all">
                        <i className="fas fa-download mr-1"></i>Export
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && (
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {blogTemplates.map((template, index) => (
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
                  <History toolName="Blog Content from Transcripts" />
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
                  onClick={handleGenerateBlogContent}
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
                      <span>Generate Blog Content</span>
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
