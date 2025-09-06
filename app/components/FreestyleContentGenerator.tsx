'use client';

import React, { useState } from 'react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface FreestyleContentGeneratorProps {
  onBackClick: () => void;
}

export default function FreestyleContentGenerator({ onBackClick }: FreestyleContentGeneratorProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);
  const [inputs, setInputs] = useState({
    brandSelection: '',
    requestType: '',
    customRequest: '',
    targetAudience: '',
    contentGoal: '',
    tone: '',
    contentLength: '',
    specificRequirements: '',
    outputFormat: '',
    additionalContext: '',
    includeIntroduction: true,
    includeConclusion: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setInputs(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleGenerate = async () => {
    console.log('Generate button clicked!');
    console.log('Current inputs state:', inputs);
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      // Validate required fields
      const requiredFields = [
        'customRequest',
        'targetAudience',
        'contentGoal',
        'tone',
        'contentLength'
      ];
      
      const missingFields = requiredFields.filter(field => !inputs[field as keyof typeof inputs]);
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      // Map form inputs to API fields with proper value mapping
      const apiData = {
        content_title: inputs.customRequest.split(' ').slice(0, 5).join(' ') + '...',
        content_type: inputs.requestType === 'social' ? 'Social Media Post' :
                     inputs.requestType === 'email' ? 'Email Content' :
                     inputs.requestType === 'blog' ? 'Blog Article' :
                     inputs.requestType === 'ad' ? 'Advertisement' :
                     inputs.requestType === 'product' ? 'Product Description' :
                     inputs.requestType === 'sales' ? 'Sales Copy' :
                     'Custom Content',
        tone_style: inputs.tone === 'professional' ? 'Professional' :
                   inputs.tone === 'friendly' ? 'Friendly' :
                   inputs.tone === 'casual' ? 'Casual' :
                   inputs.tone === 'authoritative' ? 'Authoritative' :
                   inputs.tone === 'playful' ? 'Playful' :
                   inputs.tone === 'inspiring' ? 'Inspiring' :
                   inputs.tone,
        target_audience: inputs.targetAudience,
        content_purpose: inputs.contentGoal === 'awareness' ? 'Build brand awareness and visibility' :
                        inputs.contentGoal === 'engagement' ? 'Drive audience engagement and interaction' :
                        inputs.contentGoal === 'traffic' ? 'Increase website traffic and conversions' :
                        inputs.contentGoal === 'leads' ? 'Generate leads and capture contact information' :
                        inputs.contentGoal === 'sales' ? 'Drive sales and revenue growth' :
                        inputs.contentGoal === 'education' ? 'Educate and inform the audience' :
                        inputs.contentGoal,
        key_points: inputs.specificRequirements || inputs.customRequest,
        content_length: inputs.contentLength === 'short' ? 'Short (1-2 sentences)' :
                      inputs.contentLength === 'medium' ? 'Medium (300-800 words)' :
                      inputs.contentLength === 'long' ? 'Long (800+ words)' :
                      inputs.contentLength,
        include_introduction: inputs.includeIntroduction,
        include_conclusion: inputs.includeConclusion,
        additional_notes: inputs.additionalContext || ''
      };

      console.log('Sending API data:', apiData);
      console.log('Checkbox values - Include Introduction:', inputs.includeIntroduction, 'Include Conclusion:', inputs.includeConclusion);
      const response = await aiToolsService.generateFreestyleContent(apiData);
      console.log('API response received:', response);
      setResult(response);
      
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Freestyle Content Generator',
          toolId: 'freestyle-content-generator',
          outputResult: response,
          prompt: JSON.stringify(apiData)
        });
        console.log('✅ Freestyle content generator saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
    } catch (err: any) {
      console.error('Error generating freestyle content:', err);
      setError(err.message || 'Failed to generate content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const freestyleTemplates = [
    { name: "Social Media Content", icon: "fas fa-hashtag", description: "Generate custom social media posts, captions, and hashtags." },
    { name: "Email Content", icon: "fas fa-envelope", description: "Create email newsletters, sequences, and marketing emails." },
    { name: "Blog Content", icon: "fas fa-edit", description: "Generate blog posts, articles, and written content." },
    { name: "Ad Copy", icon: "fas fa-bullhorn", description: "Create advertising copy for various platforms and formats." },
    { name: "Product Descriptions", icon: "fas fa-tag", description: "Generate compelling product descriptions and features." },
    { name: "Sales Copy", icon: "fas fa-dollar-sign", description: "Create sales pages, landing pages, and conversion copy." }
  ];

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Glassmorphic Header with blue gradient */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-magic text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Freestyle</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create any type of content with AI assistance</p>
            </div>
            <div className="flex items-center gap-3 z-10">
              <span className="text-xs bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/30 flex items-center font-semibold text-white/90">
                <i className="fas fa-clock mr-1"></i> 2 min
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
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 text-red-700">
                        <i className="fas fa-exclamation-circle text-sm"></i>
                        <span className="text-sm font-medium">{error}</span>
                      </div>
                    </div>
                  )}

                  {/* Results Display */}
                  {result && (
                    <div className="space-y-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-green-900 flex items-center gap-2">
                          <i className="fas fa-check-circle text-green-600"></i>
                          Generated Content
                        </h4>
                        <button
                          onClick={() => {
                            const fullContent = `Title: ${result.title}\n\nIntroduction: ${result.introduction}\n\nBody: ${result.body}\n\nConclusion: ${result.conclusion}\n\nKey Points:\n${result.key_points?.map((point: string, index: number) => `${index + 1}. ${point}`).join('\n') || ''}`;
                            copyToClipboard(fullContent);
                          }}
                          className="px-3 py-1.5 text-sm text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition-all flex items-center gap-1"
                        >
                          <i className="fas fa-copy text-xs"></i>
                          Copy All
                        </button>
                      </div>

                      <div className="space-y-4">
                        {/* Title */}
                        <div className="p-3 bg-white rounded-lg border border-green-200">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-green-900 flex items-center gap-2">
                              <i className="fas fa-heading text-green-600 text-sm"></i>
                              Title
                            </h5>
                            <button
                              onClick={() => copyToClipboard(result.title)}
                              className="text-xs text-green-600 hover:text-green-800"
                            >
                              <i className="fas fa-copy"></i>
                            </button>
                          </div>
                          <p className="text-green-800 font-medium">{result.title}</p>
                        </div>

                        {/* Introduction */}
                        {result.introduction && (
                          <div className="p-3 bg-white rounded-lg border border-green-200">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-semibold text-green-900 flex items-center gap-2">
                                <i className="fas fa-play text-green-600 text-sm"></i>
                                Introduction
                              </h5>
                              <button
                                onClick={() => copyToClipboard(result.introduction)}
                                className="text-xs text-green-600 hover:text-green-800"
                              >
                                <i className="fas fa-copy"></i>
                              </button>
                            </div>
                            <p className="text-green-800">{result.introduction}</p>
                          </div>
                        )}

                        {/* Body */}
                        {result.body && (
                          <div className="p-3 bg-white rounded-lg border border-green-200">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-semibold text-green-900 flex items-center gap-2">
                                <i className="fas fa-align-left text-green-600 text-sm"></i>
                                Body
                              </h5>
                              <button
                                onClick={() => copyToClipboard(result.body)}
                                className="text-xs text-green-600 hover:text-green-800"
                              >
                                <i className="fas fa-copy"></i>
                              </button>
                            </div>
                            <p className="text-green-800">{result.body}</p>
                          </div>
                        )}

                        {/* Conclusion */}
                        {result.conclusion && (
                          <div className="p-3 bg-white rounded-lg border border-green-200">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-semibold text-green-900 flex items-center gap-2">
                                <i className="fas fa-flag-checkered text-green-600 text-sm"></i>
                                Conclusion
                              </h5>
                              <button
                                onClick={() => copyToClipboard(result.conclusion)}
                                className="text-xs text-green-600 hover:text-green-800"
                              >
                                <i className="fas fa-copy"></i>
                              </button>
                            </div>
                            <p className="text-green-800">{result.conclusion}</p>
                          </div>
                        )}

                        {/* Key Points */}
                        {result.key_points && result.key_points.length > 0 && (
                          <div className="p-3 bg-white rounded-lg border border-green-200">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-semibold text-green-900 flex items-center gap-2">
                                <i className="fas fa-list text-green-600 text-sm"></i>
                                Key Points
                              </h5>
                              <button
                                onClick={() => copyToClipboard(result.key_points.join('\n\n'))}
                                className="text-xs text-green-600 hover:text-green-800"
                              >
                                <i className="fas fa-copy"></i>
                              </button>
                            </div>
                            <div className="space-y-2">
                              {result.key_points.map((point: string, index: number) => (
                                <div key={index} className="p-2 bg-green-50 rounded border-l-4 border-green-300">
                                  <p className="text-green-800 text-sm">
                                    <span className="font-medium">{index + 1}.</span> {point}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Brand & Request Setup</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="brandSelection">Select Brand</label>
                          <select
                            id="brandSelection"
                            name="brandSelection"
                            value={inputs.brandSelection}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Choose your brand</option>
                            <option value="brand1">Brand 1</option>
                            <option value="brand2">Brand 2</option>
                            <option value="brand3">Brand 3</option>
                            <option value="new">Add New Brand</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="requestType">Request Type</label>
                          <select
                            id="requestType"
                            name="requestType"
                            value={inputs.requestType}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select content type</option>
                            <option value="social">Social Media</option>
                            <option value="email">Email</option>
                            <option value="blog">Blog/Article</option>
                            <option value="ad">Advertisement</option>
                            <option value="product">Product Description</option>
                            <option value="sales">Sales Copy</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="customRequest">
                          Your Custom Request <span className="text-red-500">*</span>
                        </label>
                        <textarea 
                          id="customRequest"
                          name="customRequest"
                          value={inputs.customRequest}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Describe exactly what you need AI to create for you. Be as specific as possible..."
                          required
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Content Parameters</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="targetAudience">
                          Target Audience <span className="text-red-500">*</span>
                        </label>
                        <textarea 
                          id="targetAudience"
                          name="targetAudience"
                          value={inputs.targetAudience}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Who is this content for? (demographics, interests, pain points)..."
                          required
                        ></textarea>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="contentGoal">
                            Content Goal <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="contentGoal"
                            name="contentGoal"
                            value={inputs.contentGoal}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                            required
                          >
                            <option value="">Select goal</option>
                            <option value="awareness">Build Awareness</option>
                            <option value="engagement">Drive Engagement</option>
                            <option value="traffic">Increase Traffic</option>
                            <option value="leads">Generate Leads</option>
                            <option value="sales">Drive Sales</option>
                            <option value="education">Educate Audience</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="tone">
                            Tone of Voice <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="tone"
                            name="tone"
                            value={inputs.tone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                            required
                          >
                            <option value="">Select tone</option>
                            <option value="professional">Professional</option>
                            <option value="friendly">Friendly</option>
                            <option value="casual">Casual</option>
                            <option value="authoritative">Authoritative</option>
                            <option value="playful">Playful</option>
                            <option value="inspiring">Inspiring</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Output Specifications</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="contentLength">
                            Content Length <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="contentLength"
                            name="contentLength"
                            value={inputs.contentLength}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                            required
                          >
                            <option value="">Select length</option>
                            <option value="short">Short (1-2 sentences)</option>
                            <option value="medium">Medium (1-2 paragraphs)</option>
                            <option value="long">Long (multiple paragraphs)</option>
                            <option value="custom">Custom length</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="outputFormat">Output Format</label>
                          <select
                            id="outputFormat"
                            name="outputFormat"
                            value={inputs.outputFormat}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select format</option>
                            <option value="paragraph">Paragraphs</option>
                            <option value="bullets">Bullet Points</option>
                            <option value="numbered">Numbered List</option>
                            <option value="headline">Headlines</option>
                            <option value="script">Script Format</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="specificRequirements">Specific Requirements</label>
                        <textarea 
                          id="specificRequirements"
                          name="specificRequirements"
                          value={inputs.specificRequirements}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Any specific requirements, keywords, calls-to-action, or constraints..."
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="additionalContext">Additional Context</label>
                        <textarea 
                          id="additionalContext"
                          name="additionalContext"
                          value={inputs.additionalContext}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Any additional context, background information, or examples that might help..."
                        ></textarea>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-xs font-semibold text-blue-900">
                            <input
                              type="checkbox"
                              id="includeIntroduction"
                              name="includeIntroduction"
                              checked={inputs.includeIntroduction}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
                            />
                            Include Introduction
                          </label>
                          <p className="text-xs text-blue-600 ml-6">Add an engaging introduction to your content</p>
                        </div>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-xs font-semibold text-blue-900">
                            <input
                              type="checkbox"
                              id="includeConclusion"
                              name="includeConclusion"
                              checked={inputs.includeConclusion}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
                            />
                            Include Conclusion
                          </label>
                          <p className="text-xs text-blue-600 ml-6">Add a strong conclusion to wrap up your content</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && (
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {freestyleTemplates.map((template, index) => (
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
                  <History toolName="Freestyle Content Generator" />
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
                  type="button"
                  onClick={() => {
                    console.log('Button clicked!');
                    handleGenerate();
                  }}
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
                      <span>Generate Content</span>
                      <i className="fas fa-arrow-right text-xs"></i>
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
