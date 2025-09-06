'use client';

import React, { useState } from 'react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface PinterestTitlesDescriptionsProps {
  onBackClick: () => void;
}

export default function PinterestTitlesDescriptions({ onBackClick }: PinterestTitlesDescriptionsProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history' | 'result'>('generate');
  const [formData, setFormData] = useState({
    webPageUrl: '',
    primaryKeyword: '',
    secondaryKeywords: '',
    targetAudience: '',
    contentType: '',
    pinStyle: '',
    callToAction: '',
    brandName: '',
    tone: 'inspiring',
    pinCount: '5'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Map form data to API format
      const apiData = {
        primary_keyword: formData.primaryKeyword,
        secondary_keywords: formData.secondaryKeywords,
        target_audience: formData.targetAudience,
        pin_style: formData.pinStyle,
        tone_of_voice: formData.tone,
        brand_name: formData.brandName,
        call_to_action: formData.callToAction,
        web_page_url: formData.webPageUrl,
        content_type: formData.contentType,
        number_of_pins: parseInt(formData.pinCount)
      };

      const response = await aiToolsService.generatePinterestTitlesDescriptions(apiData);
      setResult(response);
      
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Pinterest Titles Descriptions',
          toolId: 'pinterest-titles-descriptions',
          outputResult: response,
          prompt: JSON.stringify(apiData)
        });
        console.log('✅ Pinterest titles and descriptions saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
      setActiveTab('result');
    } catch (err: any) {
      console.error('Error generating Pinterest content:', err);
      setError(err.message || 'Failed to generate Pinterest content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const pinterestTemplates = [
    { name: "Blog Post Promotion", icon: "fas fa-blog", description: "Pinterest pins to drive traffic to your blog posts." },
    { name: "Product Showcase", icon: "fas fa-shopping-bag", description: "Product pins with compelling titles and descriptions." },
    { name: "Infographic Pins", icon: "fas fa-chart-bar", description: "Educational and informative Pinterest content." },
    { name: "Recipe & Food", icon: "fas fa-utensils", description: "Food and recipe pins with appetizing descriptions." },
    { name: "DIY & Crafts", icon: "fas fa-cut", description: "Creative DIY and craft project pins." },
    { name: "Lifestyle Content", icon: "fas fa-heart", description: "Lifestyle and inspiration focused pins." }
  ];

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Glassmorphic Header with blue gradient */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fab fa-pinterest text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Pinterest Titles & Descriptions</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create Pinterest content to improve traffic and visibility</p>
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
                <button 
                  onClick={() => setActiveTab('result')}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${activeTab === 'result' ? 'text-blue-700 bg-blue-50/70' : 'text-blue-500 hover:text-blue-600'}`}
                >
                  <span className="flex items-center gap-2">
                    <i className="fas fa-check-circle text-xs"></i>
                    Result
                  </span>
                  {activeTab === 'result' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>}
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
                  {/* Content Source */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Content Source</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="webPageUrl">Web Page URL</label>
                        <input
                          id="webPageUrl"
                          name="webPageUrl"
                          type="url"
                          value={formData.webPageUrl}
                          onChange={handleInputChange}
                          placeholder="https://yourwebsite.com/page-to-promote"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="contentType">Content Type</label>
                          <select
                            id="contentType"
                            name="contentType"
                            value={formData.contentType}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select content type</option>
                            <option value="blog-post">Blog Post</option>
                            <option value="product">Product</option>
                            <option value="recipe">Recipe</option>
                            <option value="diy-tutorial">DIY Tutorial</option>
                            <option value="infographic">Infographic</option>
                            <option value="inspiration">Inspiration</option>
                            <option value="tips-guide">Tips & Guide</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="pinCount">Number of Pins</label>
                          <select
                            id="pinCount"
                            name="pinCount"
                            value={formData.pinCount}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="3">3 Pins</option>
                            <option value="5">5 Pins</option>
                            <option value="10">10 Pins</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Keywords & Targeting */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Keywords & Targeting</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="primaryKeyword">Primary Keyword</label>
                        <input
                          id="primaryKeyword"
                          name="primaryKeyword"
                          type="text"
                          value={formData.primaryKeyword}
                          onChange={handleInputChange}
                          placeholder="Main keyword for Pinterest optimization"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="secondaryKeywords">Secondary Keywords</label>
                        <textarea 
                          id="secondaryKeywords"
                          name="secondaryKeywords"
                          value={formData.secondaryKeywords}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="Related keywords (one per line)"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="targetAudience">Target Audience</label>
                        <textarea 
                          id="targetAudience"
                          name="targetAudience"
                          value={formData.targetAudience}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="Describe your ideal Pinterest audience..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Pinterest Optimization */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Pinterest Optimization</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="pinStyle">Pin Style</label>
                          <select
                            id="pinStyle"
                            name="pinStyle"
                            value={formData.pinStyle}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select pin style</option>
                            <option value="standard">Standard</option>
                            <option value="carousel">Carousel</option>
                            <option value="video">Video Pin</option>
                            <option value="story">Story Pin</option>
                            <option value="product">Product Pin</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="tone">Tone of Voice</label>
                          <select
                            id="tone"
                            name="tone"
                            value={formData.tone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="inspiring">Inspiring</option>
                            <option value="informative">Informative</option>
                            <option value="friendly">Friendly</option>
                            <option value="professional">Professional</option>
                            <option value="trendy">Trendy</option>
                            <option value="helpful">Helpful</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="brandName">Brand Name (Optional)</label>
                          <input
                            id="brandName"
                            name="brandName"
                            type="text"
                            value={formData.brandName}
                            onChange={handleInputChange}
                            placeholder="Your brand name"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="callToAction">Call to Action</label>
                          <input
                            id="callToAction"
                            name="callToAction"
                            type="text"
                            value={formData.callToAction}
                            onChange={handleInputChange}
                            placeholder="e.g., Click to read more, Save for later"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && (
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {pinterestTemplates.map((template, index) => (
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
                  <History toolName="Pinterest Titles Descriptions" />
                </div>
              )}
              
              {activeTab === 'result' && (
                <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
                  {isLoading && (
                    <div className="flex items-center justify-center py-8">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="text-blue-600">Generating Pinterest content...</span>
                      </div>
                    </div>
                  )}
                  
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-exclamation-circle text-red-500"></i>
                        <span className="text-red-700 font-medium">Error</span>
                      </div>
                      <p className="text-red-600 mt-1">{error}</p>
                    </div>
                  )}
                  
                  {result && result.pins && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-blue-900">Generated Pinterest Pins</h3>
                        <button 
                          onClick={() => setActiveTab('generate')}
                          className="px-3 py-1.5 text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all flex items-center gap-1 border border-blue-100"
                        >
                          <i className="fas fa-plus text-xs"></i> Generate New
                        </button>
                      </div>
                      
                      {result.pins.map((pin: any, index: number) => (
                        <div key={index} className="p-4 bg-white border border-blue-200 rounded-lg shadow-sm">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-medium text-blue-900">Pin {index + 1}</h4>
                            <button 
                              onClick={() => copyToClipboard(`${pin.title}\n\n${pin.description}\n\nKeywords: ${pin.keywords}\n\nCTA: ${pin.cta}`)}
                              className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-all"
                            >
                              <i className="fas fa-copy mr-1"></i>Copy All
                            </button>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-semibold text-blue-700 mb-1">Title</label>
                              <div className="p-3 bg-blue-50 rounded border border-blue-100">
                                <p className="text-sm text-blue-900">{pin.title}</p>
                                <button 
                                  onClick={() => copyToClipboard(pin.title)}
                                  className="mt-2 px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-all"
                                >
                                  <i className="fas fa-copy mr-1"></i>Copy Title
                                </button>
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-xs font-semibold text-blue-700 mb-1">Description</label>
                              <div className="p-3 bg-blue-50 rounded border border-blue-100">
                                <p className="text-sm text-blue-900">{pin.description}</p>
                                <button 
                                  onClick={() => copyToClipboard(pin.description)}
                                  className="mt-2 px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-all"
                                >
                                  <i className="fas fa-copy mr-1"></i>Copy Description
                                </button>
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-xs font-semibold text-blue-700 mb-1">Keywords</label>
                              <div className="p-3 bg-blue-50 rounded border border-blue-100">
                                <p className="text-sm text-blue-900">{pin.keywords}</p>
                                <button 
                                  onClick={() => copyToClipboard(pin.keywords)}
                                  className="mt-2 px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-all"
                                >
                                  <i className="fas fa-copy mr-1"></i>Copy Keywords
                                </button>
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-xs font-semibold text-blue-700 mb-1">Call to Action</label>
                              <div className="p-3 bg-blue-50 rounded border border-blue-100">
                                <p className="text-sm text-blue-900">{pin.cta}</p>
                                <button 
                                  onClick={() => copyToClipboard(pin.cta)}
                                  className="mt-2 px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-all"
                                >
                                  <i className="fas fa-copy mr-1"></i>Copy CTA
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                      <span>Generate Pinterest Content</span>
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
