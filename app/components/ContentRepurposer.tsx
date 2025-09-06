'use client';

import React, { useState } from 'react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface ContentRepurposerProps {
  onBackClick: () => void;
}

export default function ContentRepurposer({ onBackClick }: ContentRepurposerProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history' | 'result'>('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const [inputs, setInputs] = useState({
    originalContent: '',
    contentType: '',
    originalPlatform: '',
    targetPlatforms: '',
    contentGoal: '',
    targetAudience: '',
    keyMessages: '',
    contentLength: '',
    tone: 'professional',
    callToAction: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateRepurposed = async () => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      // Validate required fields
      const requiredFields = [
        'originalContent', 'contentType', 'originalPlatform', 'targetPlatforms',
        'contentGoal', 'targetAudience', 'keyMessages', 'contentLength', 'tone', 'callToAction'
      ];
      
      const missingFields = requiredFields.filter(field => !inputs[field as keyof typeof inputs]);
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      const requestData = {
        original_content_type: inputs.contentType,
        original_platform: inputs.originalPlatform,
        original_content: inputs.originalContent,
        target_platforms: inputs.targetPlatforms,
        content_goal: inputs.contentGoal,
        preferred_content_length: inputs.contentLength,
        key_messages: inputs.keyMessages,
        target_audience: inputs.targetAudience,
        tone_of_voice: inputs.tone,
        call_to_action: inputs.callToAction
      };

      const response = await aiToolsService.generateContentRepurposed(requestData);
      setResults(response);
      setActiveTab('result');
      
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Content Repurposer',
          toolId: 'content-repurposer',
          outputResult: response,
          prompt: JSON.stringify(requestData)
        });
        console.log('✅ Content repurposer saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
    } catch (err: any) {
      console.error('Error generating repurposed content:', err);
      setError(err.message || 'Failed to generate repurposed content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exportResults = () => {
    if (!results) return;
    
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'content-repurposed.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const repurposingTemplates = [
    { name: "Blog to Social Media", icon: "fas fa-blog", description: "Transform blog posts into social media content across platforms." },
    { name: "Video to Multiple Formats", icon: "fas fa-video", description: "Repurpose videos into blog posts, social posts, and podcasts." },
    { name: "Podcast to Content Suite", icon: "fas fa-microphone", description: "Turn podcast episodes into blogs, quotes, and social content." },
    { name: "Webinar to Educational Content", icon: "fas fa-chalkboard-teacher", description: "Transform webinars into courses, blogs, and infographics." },
    { name: "Email to Blog Content", icon: "fas fa-envelope", description: "Convert email newsletters into blog posts and articles." },
    { name: "Long-form to Short-form", icon: "fas fa-compress-alt", description: "Break down long content into bite-sized pieces." }
  ];

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Glassmorphic Header with blue gradient */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-sync-alt text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Content Repurposer</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Transform your existing content into new formats for wider reach</p>
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
                {results && !error && (
                  <button 
                    onClick={() => setActiveTab('result')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${activeTab === 'result' ? 'text-blue-700 bg-blue-50/70' : 'text-blue-500 hover:text-blue-600'}`}
                  >
                    <span className="flex items-center gap-2">
                      <i className="fas fa-plus-circle text-xs"></i>
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
              {activeTab === 'generate' && (
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                  {/* Success Banner */}
                  {results && !error && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <i className="fas fa-check text-green-600 text-sm"></i>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-green-800">Plan Generated Successfully!</h4>
                            <p className="text-xs text-green-600 mt-0.5">Your social media plan is ready to view.</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setActiveTab('result')}
                          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors duration-200"
                        >
                          View Plan
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Original Content Information</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="contentType">Original Content Type</label>
                          <select
                            id="contentType"
                            name="contentType"
                            value={inputs.contentType}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select content type</option>
                            <option value="blog">Blog Post</option>
                            <option value="video">Video</option>
                            <option value="podcast">Podcast Episode</option>
                            <option value="webinar">Webinar</option>
                            <option value="email">Email Newsletter</option>
                            <option value="social">Social Media Post</option>
                            <option value="whitepaper">Whitepaper/Report</option>
                            <option value="case-study">Case Study</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="originalPlatform">Original Platform</label>
                          <select
                            id="originalPlatform"
                            name="originalPlatform"
                            value={inputs.originalPlatform}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select original platform</option>
                            <option value="blog">Blog/Website</option>
                            <option value="youtube">YouTube</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="instagram">Instagram</option>
                            <option value="twitter">Twitter</option>
                            <option value="email">Email</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="originalContent">Original Content</label>
                        <textarea 
                          id="originalContent"
                          name="originalContent"
                          value={inputs.originalContent}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-24" 
                          placeholder="Paste your original content here or provide a detailed summary..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Repurposing Strategy</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="targetPlatforms">Target Platforms</label>
                        <textarea 
                          id="targetPlatforms"
                          name="targetPlatforms"
                          value={inputs.targetPlatforms}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="Which platforms do you want to repurpose this content for? (e.g., Instagram, LinkedIn, TikTok, blog posts)"
                        ></textarea>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="contentGoal">Content Goal</label>
                          <select
                            id="contentGoal"
                            name="contentGoal"
                            value={inputs.contentGoal}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select goal</option>
                            <option value="awareness">Brand Awareness</option>
                            <option value="engagement">Engagement</option>
                            <option value="leads">Lead Generation</option>
                            <option value="sales">Drive Sales</option>
                            <option value="education">Education</option>
                            <option value="community">Community Building</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="contentLength">Preferred Content Length</label>
                          <select
                            id="contentLength"
                            name="contentLength"
                            value={inputs.contentLength}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select length</option>
                            <option value="short">Short (Twitter, Instagram captions)</option>
                            <option value="medium">Medium (LinkedIn posts, short blogs)</option>
                            <option value="long">Long (Detailed blog posts, articles)</option>
                            <option value="mixed">Mix of lengths</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="keyMessages">Key Messages to Emphasize</label>
                        <textarea 
                          id="keyMessages"
                          name="keyMessages"
                          value={inputs.keyMessages}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="What are the main takeaways or messages you want to highlight in the repurposed content?"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Audience & Style</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="targetAudience">Target Audience</label>
                          <textarea 
                            id="targetAudience"
                            name="targetAudience"
                            value={inputs.targetAudience}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                            placeholder="Describe your target audience for the repurposed content..."
                          ></textarea>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="tone">Tone of Voice</label>
                          <select
                            id="tone"
                            name="tone"
                            value={inputs.tone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="professional">Professional</option>
                            <option value="casual">Casual</option>
                            <option value="friendly">Friendly</option>
                            <option value="educational">Educational</option>
                            <option value="inspiring">Inspiring</option>
                            <option value="humorous">Humorous</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="callToAction">Call to Action</label>
                        <input
                          id="callToAction"
                          name="callToAction"
                          type="text"
                          value={inputs.callToAction}
                          onChange={handleInputChange}
                          placeholder="What action do you want your audience to take?"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && (
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {repurposingTemplates.map((template, index) => (
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
                  <History toolName="Content Repurposer" />
                </div>
              )}
              
              {activeTab === 'result' && results && (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  <div className="bg-white border border-green-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                        <i className="fas fa-check-circle text-green-600"></i>
                        Generated Content Plan
                      </h3>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => navigator.clipboard.writeText(JSON.stringify(results, null, 2))}
                          className="px-3 py-1.5 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-all flex items-center gap-1"
                        >
                          <i className="fas fa-copy text-xs"></i>
                          Copy
                        </button>
                        <button 
                          onClick={exportResults}
                          className="px-3 py-1.5 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all flex items-center gap-1"
                        >
                          <i className="fas fa-download text-xs"></i>
                          Export
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Summary */}
                      {results.summary && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <h5 className="text-sm font-semibold text-blue-900 mb-2">📝 Summary</h5>
                          <p className="text-sm text-blue-800 leading-relaxed">
                            {String(results.summary)}
                          </p>
                        </div>
                      )}

                      {/* Repurposed Content */}
                      {results.repurposed && Array.isArray(results.repurposed) && results.repurposed.length > 0 && (
                        <div className="space-y-3">
                          <h5 className="font-medium text-blue-800 text-lg">📋 Platform Content</h5>
                          {results.repurposed.map((item: any, index: number) => (
                            item && (
                              <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
                                      {item.platform}
                                    </span>
                                    <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                                      {item.format}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => navigator.clipboard.writeText(item.content)}
                                    className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-100 rounded transition-all"
                                  >
                                    <i className="fas fa-copy"></i>
                                  </button>
                                </div>
                                <p className="text-sm text-blue-700 leading-relaxed mb-2">
                                  {item.content}
                                </p>
                                {item.call_to_action && (
                                  <div className="text-xs text-green-600 bg-green-50 p-2 rounded border-l-2 border-green-300">
                                    <strong>CTA:</strong> {item.call_to_action}
                                  </div>
                                )}
                              </div>
                            )
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'result' && !results && (
                <div className="py-4 flex flex-col items-center justify-center text-center space-y-2">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-sync-alt text-blue-500 text-xl"></i>
                  </div>
                  <h3 className="text-blue-900 font-medium">No Content Generated</h3>
                  <p className="text-sm text-blue-700 max-w-md">Generate repurposed content first to see the results here.</p>
                  <button 
                    onClick={() => setActiveTab('generate')}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm"
                  >
                    Generate Content
                  </button>
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
                  onClick={handleGenerateRepurposed}
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
                      <span>Repurpose Content</span>
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
