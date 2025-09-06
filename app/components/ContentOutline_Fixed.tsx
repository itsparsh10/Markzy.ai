'use client';

import React, { useState } from 'react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface ContentOutlineProps {
  onBackClick: () => void;
}

interface GeneratedOutline {
  outline?: Array<{
    title: string;
    description: string;
  }>;
  summary?: string;
  call_to_action?: string;
}

export default function ContentOutline({ onBackClick }: ContentOutlineProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history' | 'result'>('generate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutline, setGeneratedOutline] = useState<GeneratedOutline | null>(null);
  const [error, setError] = useState<string>('');
  const [inputs, setInputs] = useState({
    contentTitle: '',
    contentType: '',
    targetAudience: '',
    mainObjective: '',
    keyPoints: '',
    contentLength: '',
    toneOfVoice: '',
    callToAction: '',
    keywords: '',
    contentStructure: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateOutline = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!inputs.contentTitle || !inputs.contentType || !inputs.mainObjective || !inputs.targetAudience) {
      setError('Please fill in Content Title, Content Type, Main Objective, and Target Audience');
      return;
    }

    setIsGenerating(true);
    setError('');
    
    try {
      // Map UI values to API expected format
      const outlineData = {
        content_title: inputs.contentTitle,
        content_type: inputs.contentType,
        expected_length: inputs.contentLength,
        main_objective: inputs.mainObjective,
        target_audience: inputs.targetAudience,
        tone_of_voice: inputs.toneOfVoice,
        content_structure: inputs.contentStructure,
        key_points: inputs.keyPoints,
        keywords: inputs.keywords,
        call_to_action: inputs.callToAction
      };

      console.log('Generating content outline with data:', outlineData);
      const response = await aiToolsService.generateContentOutline(outlineData);
      setGeneratedOutline(response);
      
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Content Outline',
          toolId: 'content-outline',
          outputResult: response,
          prompt: JSON.stringify(outlineData)
        });
        console.log('✅ Content outline saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
      setActiveTab('result');
      
    } catch (error: any) {
      console.error('Error generating content outline:', error);
      
      let errorMessage = 'Failed to generate content outline. Please try again.';
      
      if (error.response?.data?.detail) {
        errorMessage = `API Error: ${error.response.data.detail}`;
      } else if (error.message && error.message.includes('Missing required fields')) {
        errorMessage = error.message;
      } else if (error.response?.status === 400) {
        errorMessage = 'The request was invalid. Please check all required fields.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication error. Please try logging out and back in.';
      }
      
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const outlineTemplates = [
    { name: "Blog Post Outline", icon: "fas fa-blog", description: "Structured outline for blog posts with intro, body, and conclusion." },
    { name: "Podcast Episode Outline", icon: "fas fa-microphone", description: "Episode structure with segments, talking points, and timing." },
    { name: "Video Script Outline", icon: "fas fa-video", description: "Video content outline with scenes, key messages, and CTAs." },
    { name: "Email Newsletter Outline", icon: "fas fa-envelope", description: "Newsletter structure with sections and content blocks." },
    { name: "Course Module Outline", icon: "fas fa-graduation-cap", description: "Educational content outline with lessons and objectives." },
    { name: "Social Media Series", icon: "fas fa-share-alt", description: "Multi-post social media content series outline." }
  ];

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Glassmorphic Header with blue gradient */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-list text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Content Outline</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create structured outlines for blog posts, podcasts, and content</p>
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
                {generatedOutline && !error && (
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
                  {generatedOutline && !error && (
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
                    <h4 className="text-base font-medium text-blue-900 mb-3">Content Basic Information</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="contentTitle">Content Title or Topic</label>
                        <input
                          id="contentTitle"
                          name="contentTitle"
                          type="text"
                          value={inputs.contentTitle}
                          onChange={handleInputChange}
                          placeholder="Enter your content title or main topic"
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
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          >
                            <option value="">Select content type</option>
                            <option value="Blog Post">Blog Post</option>
                            <option value="Article">Article</option>
                            <option value="Email Newsletter">Email Newsletter</option>
                            <option value="Podcast Episode">Podcast Episode</option>
                            <option value="Video Script">Video Script</option>
                            <option value="Social Media Series">Social Media Series</option>
                            <option value="Course Module">Course Module</option>
                            <option value="White Paper">White Paper</option>
                            <option value="Guide">Guide</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="contentLength">Expected Content Length</label>
                          <select 
                            id="contentLength"
                            name="contentLength"
                            value={inputs.contentLength}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          >
                            <option value="">Select length</option>
                            <option value="Short (300-500 words)">Short (300-500 words)</option>
                            <option value="Medium (500-1000 words)">Medium (500-1000 words)</option>
                            <option value="Long (1000-2000 words)">Long (1000-2000 words)</option>
                            <option value="Extended (2000+ words)">Extended (2000+ words)</option>
                            <option value="Series (Multiple parts)">Series (Multiple parts)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Target Audience & Objectives</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="targetAudience">Target Audience</label>
                        <input
                          id="targetAudience"
                          name="targetAudience"
                          type="text"
                          value={inputs.targetAudience}
                          onChange={handleInputChange}
                          placeholder="e.g., Marketing professionals, small business owners"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="mainObjective">Main Objective</label>
                        <textarea 
                          id="mainObjective"
                          name="mainObjective"
                          value={inputs.mainObjective}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="What is the main goal of this content? What should readers learn or do?"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Content Structure & Tone</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="toneOfVoice">Tone of Voice</label>
                          <select 
                            id="toneOfVoice"
                            name="toneOfVoice"
                            value={inputs.toneOfVoice}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          >
                            <option value="">Select tone</option>
                            <option value="Professional">Professional</option>
                            <option value="Conversational">Conversational</option>
                            <option value="Educational">Educational</option>
                            <option value="Informative">Informative</option>
                            <option value="Persuasive">Persuasive</option>
                            <option value="Inspiring">Inspiring</option>
                            <option value="Authoritative">Authoritative</option>
                            <option value="Friendly">Friendly</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="contentStructure">Content Structure</label>
                          <select 
                            id="contentStructure"
                            name="contentStructure"
                            value={inputs.contentStructure}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          >
                            <option value="">Select structure</option>
                            <option value="Introduction-Body-Conclusion">Introduction-Body-Conclusion</option>
                            <option value="Problem-Solution">Problem-Solution</option>
                            <option value="How-To Guide">How-To Guide</option>
                            <option value="List Format">List Format</option>
                            <option value="Case Study">Case Study</option>
                            <option value="Comparison">Comparison</option>
                            <option value="Storytelling">Storytelling</option>
                            <option value="Q&A Format">Q&A Format</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="keyPoints">Key Points to Cover</label>
                        <textarea 
                          id="keyPoints"
                          name="keyPoints"
                          value={inputs.keyPoints}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="List the main points, topics, or sections to include..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Additional Elements</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="keywords">Keywords & SEO</label>
                        <textarea 
                          id="keywords"
                          name="keywords"
                          value={inputs.keywords}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="List relevant keywords and phrases to include..."
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
                          placeholder="What should readers do after consuming this content?"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700">{error}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'result' && generatedOutline && (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  <div className="bg-white border border-green-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                        <i className="fas fa-check-circle text-green-600"></i>
                        Generated Content Plan
                      </h3>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => navigator.clipboard.writeText(JSON.stringify(generatedOutline, null, 2))}
                          className="px-3 py-1.5 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-all flex items-center gap-1"
                        >
                          <i className="fas fa-copy text-xs"></i>
                          Copy
                        </button>
                        <button 
                          onClick={() => setGeneratedOutline(null)}
                          className="px-3 py-1.5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-all flex items-center gap-1"
                        >
                          <i className="fas fa-times text-xs"></i>
                          Clear
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Summary */}
                      {generatedOutline.summary && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <h5 className="text-sm font-semibold text-blue-900 mb-2">📝 Summary</h5>
                          <p className="text-sm text-blue-800 leading-relaxed">
                            {String(generatedOutline.summary)}
                          </p>
                        </div>
                      )}

                      {/* Outline Sections */}
                      {generatedOutline.outline && Array.isArray(generatedOutline.outline) && (
                        <div className="space-y-3">
                          <h5 className="font-medium text-blue-800 text-lg">📋 Content Structure</h5>
                          {generatedOutline.outline.map((section, index) => (
                            <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                              <div className="flex items-start justify-between mb-2">
                                <h6 className="font-semibold text-blue-900">
                                  {section.title ? String(section.title) : `Section ${index + 1}`}
                                </h6>
                                <span className="text-xs bg-blue-200 px-2 py-1 rounded-full text-blue-800">
                                  Step {index + 1}
                                </span>
                              </div>
                              <p className="text-sm text-blue-700 leading-relaxed">
                                {section.description ? String(section.description) : 'No description available'}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Call to Action */}
                      {generatedOutline.call_to_action && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <h5 className="text-sm font-semibold text-green-900 mb-2">🎯 Call to Action</h5>
                          <p className="text-sm text-green-800 leading-relaxed">
                            {String(generatedOutline.call_to_action)}
                          </p>
                        </div>
                      )}

                      {/* Handle other response formats */}
                      {!generatedOutline.outline && typeof generatedOutline === 'object' && (
                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                          <h5 className="text-sm font-semibold text-gray-900 mb-2">📊 Full Response</h5>
                          <pre className="text-sm text-gray-700 overflow-x-auto">
                            {JSON.stringify(generatedOutline, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'result' && !generatedOutline && (
                <div className="py-4 flex flex-col items-center justify-center text-center space-y-2">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-list text-blue-500 text-xl"></i>
                  </div>
                  <h3 className="text-blue-900 font-medium">No Outline Generated</h3>
                  <p className="text-sm text-blue-700 max-w-md">Generate a content outline first to see the results here.</p>
                  <button 
                    onClick={() => setActiveTab('generate')}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm"
                  >
                    Generate Outline
                  </button>
                </div>
              )}
              
              {activeTab === 'templates' && (
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {outlineTemplates.map((template, index) => (
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
                  <History toolName="Content Outline" />
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
                  onClick={handleGenerateOutline}
                  disabled={isGenerating}
                  className="px-5 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center">
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Generating...
                    </span>
                  ) : (
                    <>
                      <span>Generate Outline</span>
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
