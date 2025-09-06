'use client';

import React, { useState } from 'react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface FreestyleSEOProps {
  onBackClick: () => void;
}

export default function FreestyleSEO({ onBackClick }: FreestyleSEOProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);
  const [inputs, setInputs] = useState({
    pageType: '',
    pageDescription: '',
    primaryKeyword: '',
    secondaryKeywords: '',
    targetAudience: '',
    businessType: '',
    contentFocus: '',
    location: '',
    competitorInfo: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      // Validate required fields
      const requiredFields = [
        'pageType',
        'pageDescription',
        'primaryKeyword',
        'targetAudience',
        'businessType',
        'contentFocus'
      ];
      
      const missingFields = requiredFields.filter(field => !inputs[field as keyof typeof inputs]);
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      // Map form inputs to API fields with proper value mapping
      const apiData = {
        page_type: inputs.pageType === 'homepage' ? 'Homepage' :
                   inputs.pageType === 'product' ? 'Product Page' :
                   inputs.pageType === 'category' ? 'Category Page' :
                   inputs.pageType === 'blog' ? 'Blog Post' :
                   inputs.pageType === 'service' ? 'Service Page' :
                   inputs.pageType === 'about' ? 'About Page' :
                   inputs.pageType === 'contact' ? 'Contact Page' :
                   inputs.pageType,
        page_description: inputs.pageDescription,
        primary_keyword: inputs.primaryKeyword,
        secondary_keywords: inputs.secondaryKeywords || '',
        target_audience: inputs.targetAudience,
        business_type: inputs.businessType === 'ecommerce' ? 'E-commerce' :
                      inputs.businessType === 'service' ? 'Service Business' :
                      inputs.businessType === 'saas' ? 'SaaS' :
                      inputs.businessType === 'local' ? 'Local Business' :
                      inputs.businessType === 'blog' ? 'Blog/Media' :
                      inputs.businessType === 'nonprofit' ? 'Non-profit' :
                      inputs.businessType,
        content_focus: inputs.contentFocus === 'informational' ? 'Informational' :
                      inputs.contentFocus === 'commercial' ? 'Commercial' :
                      inputs.contentFocus === 'transactional' ? 'Transactional' :
                      inputs.contentFocus === 'navigational' ? 'Navigational' :
                      inputs.contentFocus === 'local' ? 'Local Search' :
                      inputs.contentFocus,
        location: inputs.location || '',
        competitor_info: inputs.competitorInfo || ''
      };

      console.log('Sending SEO API data:', apiData);
      const response = await aiToolsService.generateFreestyleSEO(apiData);
      setResult(response);
      
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Freestyle SEO',
          toolId: 'freestyle-seo',
          outputResult: response,
          prompt: JSON.stringify(apiData)
        });
        console.log('✅ Freestyle SEO saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
    } catch (err: any) {
      console.error('Error generating SEO content:', err);
      setError(err.message || 'Failed to generate SEO content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // SEO template types with appropriate icons
  const seoTemplates = [
    { name: "Homepage SEO", icon: "fas fa-home", description: "Optimize your homepage for search engines and brand visibility." },
    { name: "Product Page SEO", icon: "fas fa-box", description: "Create SEO-friendly product page titles and descriptions." },
    { name: "Blog Post SEO", icon: "fas fa-edit", description: "Optimize blog content for better search rankings." },
    { name: "Service Page SEO", icon: "fas fa-cogs", description: "Enhance service pages for local and targeted search." },
    { name: "Category Page SEO", icon: "fas fa-layer-group", description: "Optimize category and collection pages for discovery." },
    { name: "Local Business SEO", icon: "fas fa-map-marker-alt", description: "Focus on local search optimization and visibility." }
  ];

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Glassmorphic Header with blue gradient */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-search text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Freestyle SEO</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create SEO titles and descriptions for any web page</p>
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
                          Generated SEO Content
                        </h4>
                        <button
                          onClick={() => {
                            const fullContent = `Title: ${result.seo_title}\n\nMeta Description: ${result.seo_description}\n\nKeywords: ${result.keywords_used?.join(', ') || ''}`;
                            copyToClipboard(fullContent);
                          }}
                          className="px-3 py-1.5 text-sm text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition-all flex items-center gap-1"
                        >
                          <i className="fas fa-copy text-xs"></i>
                          Copy All
                        </button>
                      </div>

                      <div className="space-y-4">
                        {/* SEO Title */}
                        <div className="p-3 bg-white rounded-lg border border-green-200">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-green-900 flex items-center gap-2">
                              <i className="fas fa-heading text-green-600 text-sm"></i>
                              SEO Title
                            </h5>
                            <button
                              onClick={() => copyToClipboard(result.seo_title)}
                              className="text-xs text-green-600 hover:text-green-800"
                            >
                              <i className="fas fa-copy"></i>
                            </button>
                          </div>
                          <p className="text-green-800 font-medium">{result.seo_title}</p>
                        </div>

                        {/* SEO Description */}
                        <div className="p-3 bg-white rounded-lg border border-green-200">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-green-900 flex items-center gap-2">
                              <i className="fas fa-align-left text-green-600 text-sm"></i>
                              SEO Description
                            </h5>
                            <button
                              onClick={() => copyToClipboard(result.seo_description)}
                              className="text-xs text-green-600 hover:text-green-800"
                            >
                              <i className="fas fa-copy"></i>
                            </button>
                          </div>
                          <p className="text-green-800">{result.seo_description}</p>
                        </div>

                        {/* Keywords Used */}
                        {result.keywords_used && result.keywords_used.length > 0 && (
                          <div className="p-3 bg-white rounded-lg border border-green-200">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-semibold text-green-900 flex items-center gap-2">
                                <i className="fas fa-tags text-green-600 text-sm"></i>
                                Keywords Used
                              </h5>
                              <button
                                onClick={() => copyToClipboard(result.keywords_used.join(', '))}
                                className="text-xs text-green-600 hover:text-green-800"
                              >
                                <i className="fas fa-copy"></i>
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {result.keywords_used.map((keyword: string, index: number) => (
                                <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Page Information</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="pageType">Page Type</label>
                          <select
                            id="pageType"
                            name="pageType"
                            value={inputs.pageType}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select page type</option>
                            <option value="homepage">Homepage</option>
                            <option value="product">Product Page</option>
                            <option value="category">Category Page</option>
                            <option value="blog">Blog Post</option>
                            <option value="service">Service Page</option>
                            <option value="about">About Page</option>
                            <option value="contact">Contact Page</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="businessType">Business Type</label>
                          <select
                            id="businessType"
                            name="businessType"
                            value={inputs.businessType}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select business type</option>
                            <option value="ecommerce">E-commerce</option>
                            <option value="service">Service Business</option>
                            <option value="saas">SaaS</option>
                            <option value="local">Local Business</option>
                            <option value="blog">Blog/Media</option>
                            <option value="nonprofit">Non-profit</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="pageDescription">Page Description</label>
                        <textarea 
                          id="pageDescription"
                          name="pageDescription"
                          value={inputs.pageDescription}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Describe what's on this web page and what it's about..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Keyword Strategy</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="primaryKeyword">Primary Keyword</label>
                        <input
                          id="primaryKeyword"
                          name="primaryKeyword"
                          type="text"
                          value={inputs.primaryKeyword}
                          onChange={handleInputChange}
                          placeholder="Enter your main keyword phrase"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="secondaryKeywords">Secondary Keywords</label>
                        <textarea
                          id="secondaryKeywords"
                          name="secondaryKeywords"
                          value={inputs.secondaryKeywords}
                          onChange={handleInputChange}
                          placeholder="List related keywords (comma separated)"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16"
                        ></textarea>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="targetAudience">Target Audience</label>
                          <input
                            id="targetAudience"
                            name="targetAudience"
                            type="text"
                            value={inputs.targetAudience}
                            onChange={handleInputChange}
                            placeholder="e.g., small business owners, parents"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="location">Location (if applicable)</label>
                          <input
                            id="location"
                            name="location"
                            type="text"
                            value={inputs.location}
                            onChange={handleInputChange}
                            placeholder="City, state, or region"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">SEO Focus & Competition</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="contentFocus">Content Focus</label>
                        <select
                          id="contentFocus"
                          name="contentFocus"
                          value={inputs.contentFocus}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                        >
                          <option value="">Choose focus</option>
                          <option value="informational">Informational</option>
                          <option value="commercial">Commercial</option>
                          <option value="transactional">Transactional</option>
                          <option value="navigational">Navigational</option>
                          <option value="local">Local Search</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="competitorInfo">Competitor Information (optional)</label>
                        <textarea
                          id="competitorInfo"
                          name="competitorInfo"
                          value={inputs.competitorInfo}
                          onChange={handleInputChange}
                          placeholder="Mention any competitors or similar businesses you want to outrank..."
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && (
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {seoTemplates.map((template, index) => (
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
                          onClick={() => {
                            setInputs(prev => ({...prev, pageType: template.name.toLowerCase().replace(' seo', '')}));
                            setActiveTab('generate');
                          }}
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
                  <History toolName="Freestyle SEO" />
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
                  className="px-5 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Generating...
                    </>
                  ) : (
                    <>
                      <span>Generate SEO</span>
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