'use client';

import React, { useState } from 'react';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface BrandKeywordResearchProps {
  onBackClick: () => void;
}

export default function BrandKeywordResearch({ onBackClick }: BrandKeywordResearchProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'result' | 'templates' | 'history'>('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [toolHistory, setToolHistory] = useState<any[]>([]);
  const [inputs, setInputs] = useState({
    brandName: '',
    industry: '',
    businessType: '',
    targetAudience: '',
    products: '',
    competitors: '',
    brandValues: '',
    keywordFocus: '',
    contentGoals: ''
  });



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  // Helper function to format text with bold headings
  const formatTextWithBold = (text: string) => {
    if (!text) return null;
    
    return text.split('\n').map((line, index) => {
      // Check if line is a heading (contains : or is all caps or starts with numbers)
      const isHeading = line.includes(':') && line.length < 100 || 
                       /^[A-Z\s\d\-\.]+:/.test(line) ||
                       /^\d+\./.test(line.trim()) ||
                       /^[A-Z\s]{3,}$/.test(line.trim());
      
      if (isHeading) {
        return (
          <div key={index} className="font-bold text-blue-900 mt-4 mb-2 text-sm border-b border-blue-100 pb-1">
            {line}
          </div>
        );
      }
      
      // Format bullet points
      if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
        return (
          <div key={index} className="ml-4 mb-1 text-sm text-gray-700 flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>{line.replace(/^[-•]\s*/, '')}</span>
          </div>
        );
      }
      
      // Regular text
      if (line.trim()) {
        return (
          <div key={index} className="mb-2 text-sm text-gray-700 leading-relaxed">
            {line}
          </div>
        );
      }
      
      return <div key={index} className="mb-2"></div>;
    });
  };

  const formatContentForCopy = (content: any) => {
    if (typeof content === 'string') return content;
    
    // Handle structured keywords array format
    if (content.keywords && Array.isArray(content.keywords)) {
      const header = "BRAND KEYWORD RESEARCH RESULTS\n" + "=".repeat(35) + "\n\n";
      const keywordsList = content.keywords.map((item: any, index: number) => 
        `${index + 1}. KEYWORD: "${item.keyword}"\n   STRATEGY: ${item.rationale}\n`
      ).join('\n');
      const summary = `\nSUMMARY:\nGenerated ${content.keywords.length} strategic keywords tailored to your brand, industry, and target audience.`;
      return header + keywordsList + summary;
    }
    
    if (content.keywords_research || content.content || content.keyword_research || content.generated_content) {
      return content.keywords_research || content.content || content.keyword_research || content.generated_content;
    }
    
    return Object.entries(content)
      .filter(([key, value]) => typeof value === 'string' && value.length > 50)
      .map(([key, value]) => `${key.replace(/_/g, ' ').toUpperCase()}:\n${value}`)
      .join('\n\n') || JSON.stringify(content);
  };

  const formatKeywordResearchOutput = (content: any) => {
    // Handle structured keywords array format
    if (content.keywords && Array.isArray(content.keywords)) {
      return (
        <div className="space-y-4">
          <div className="font-bold text-lg text-blue-900 mb-6 flex items-center gap-2 border-b border-blue-200 pb-3">
            <i className="fas fa-search text-blue-600"></i>
            Brand Keyword Research Results
          </div>
          <div className="space-y-4">
            {content.keywords.map((item: any, index: number) => (
              <div key={index} className="bg-white border border-blue-100 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-blue-900 text-base mb-2 flex items-center gap-2">
                      <i className="fas fa-key text-blue-600 text-sm"></i>
                      "{item.keyword}"
                    </h4>
                    <div className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border-l-4 border-blue-300">
                      <span className="font-semibold text-gray-800">Strategy:</span> {item.rationale}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <i className="fas fa-lightbulb text-blue-600"></i>
              <span className="font-bold text-blue-900">Summary</span>
            </div>
            <p className="text-sm text-blue-800">
              Generated <strong>{content.keywords.length} strategic keywords</strong> tailored to your brand, industry, and target audience. Each keyword includes a specific rationale for how it can help grow your business.
            </p>
          </div>
        </div>
      );
    }

    // Check for main content fields
    if (content.keywords_research) {
      return (
        <div className="space-y-2">
          <div className="font-bold text-lg text-blue-900 mb-4 flex items-center gap-2">
            <i className="fas fa-search text-blue-600"></i>
            Brand Keyword Research Results
          </div>
          {formatTextWithBold(content.keywords_research)}
        </div>
      );
    }

    if (content.content) {
      return (
        <div className="space-y-2">
          <div className="font-bold text-lg text-blue-900 mb-4 flex items-center gap-2">
            <i className="fas fa-search text-blue-600"></i>
            Keyword Research Analysis
          </div>
          {formatTextWithBold(content.content)}
        </div>
      );
    }

    if (content.keyword_research) {
      return (
        <div className="space-y-2">
          <div className="font-bold text-lg text-blue-900 mb-4 flex items-center gap-2">
            <i className="fas fa-search text-blue-600"></i>
            Keyword Research Report
          </div>
          {formatTextWithBold(content.keyword_research)}
        </div>
      );
    }

    if (content.generated_content) {
      return (
        <div className="space-y-2">
          <div className="font-bold text-lg text-blue-900 mb-4 flex items-center gap-2">
            <i className="fas fa-search text-blue-600"></i>
            Generated Keyword Research
          </div>
          {formatTextWithBold(content.generated_content)}
        </div>
      );
    }

    // Handle multiple fields or structured data
    return (
      <div className="space-y-6">
        <div className="font-bold text-lg text-blue-900 mb-4 flex items-center gap-2">
          <i className="fas fa-search text-blue-600"></i>
          Brand Keyword Research Results
        </div>
        {Object.entries(content)
          .filter(([key, value]) => typeof value === 'string' && value.length > 50)
          .map(([key, value]) => (
            <div key={key} className="border border-blue-100 rounded-lg p-4 bg-blue-50/30">
              <h4 className="font-bold text-blue-900 capitalize mb-3 flex items-center gap-2 text-base border-b border-blue-200 pb-2">
                <i className="fas fa-tag text-blue-600 text-sm"></i>
                {key.replace(/_/g, ' ')}
              </h4>
              <div className="space-y-2">
                {formatTextWithBold(value as string)}
              </div>
            </div>
          ))}
        
        {/* Show additional metadata if any */}
        {Object.entries(content)
          .filter(([key, value]) => typeof value !== 'string' || value.length <= 50)
          .length > 0 && (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <i className="fas fa-info-circle text-gray-600"></i>
              Additional Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(content)
                .filter(([key, value]) => typeof value !== 'string' || value.length <= 50)
                .map(([key, value]) => (
                  <div key={key} className="bg-white rounded p-2 border border-gray-200">
                    <span className="font-semibold text-gray-700 text-xs uppercase tracking-wide">
                      {key.replace(/_/g, ' ')}:
                    </span>
                    <span className="ml-2 text-sm text-gray-600">
                      {typeof value === 'string' ? value : JSON.stringify(value)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleGenerate = async () => {
    // Validation
    if (!inputs.brandName || !inputs.businessType || !inputs.industry || !inputs.keywordFocus || !inputs.targetAudience || !inputs.products || !inputs.brandValues || !inputs.competitors || !inputs.contentGoals) {
      alert('Please fill in all required fields: Brand Name, Business Type, Industry, Keyword Focus, Target Audience, Products/Services, Brand Values, Competitors, and Content Goals');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Dynamic import for ES modules
      const { aiToolsService } = await import('../../services/aiTools.js');
      
      // Map UI values to API format
      const requestData = {
        brand_name: inputs.brandName,
        business_type: inputs.businessType,
        industry: inputs.industry,
        keyword_focus: inputs.keywordFocus,
        target_audience: inputs.targetAudience,
        products_services: inputs.products,
        brand_values: inputs.brandValues,
        main_competitors: inputs.competitors,
        content_goals: inputs.contentGoals
      };

      console.log('Sending brand keywords request:', requestData);
      const response = await aiToolsService.generateBrandKeywords(requestData);
      console.log('Brand keywords response:', response);
      setGeneratedContent(response);
      setActiveTab('result');
      
      // Save to tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Brand Keyword Research',
          toolId: 'brand-keyword-research',
          outputResult: response,
          prompt: JSON.stringify(requestData)
        });
        console.log('✅ Brand keyword research saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
      
    } catch (error: any) {
      // Error handling with user-friendly messages
      let errorMessage = 'Failed to generate brand keywords. Please try again.';
      
      if (error.response?.data?.detail) {
        errorMessage = `API Error: ${error.response.data.detail}`;
      } else if (error.message && error.message.includes('Missing required fields')) {
        errorMessage = error.message;
      } else if (error.response?.status === 400) {
        errorMessage = 'The request was invalid. Please check all required fields.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication error. Please try logging out and back in.';
      }
      
      console.error('Error details:', error.response?.data || error.message);
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };



  const keywordTemplates = [
    { name: "E-commerce Brand", icon: "fas fa-shopping-cart", description: "Keyword research focused on product discovery and online sales." },
    { name: "Service Business", icon: "fas fa-handshake", description: "Keywords for service-based businesses and professional services." },
    { name: "Content Creator", icon: "fas fa-edit", description: "Keywords for bloggers, influencers, and content creators." },
    { name: "Local Business", icon: "fas fa-map-marker-alt", description: "Location-based keywords for local businesses and services." },
    { name: "B2B Company", icon: "fas fa-building", description: "Business-to-business focused keyword strategies." },
    { name: "SaaS Product", icon: "fas fa-cloud", description: "Software and technology product keyword research." }
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
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Brand Keyword Research</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Discover keywords your brand should be using for better visibility</p>
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
                {generatedContent && !error && (
                  <button 
                    onClick={() => setActiveTab('result')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${activeTab === 'result' ? 'text-blue-700 bg-blue-50/70' : 'text-blue-500 hover:text-blue-600'}`}
                  >
                    <span className="flex items-center gap-2">
                      <i className="fas fa-search text-xs"></i>
                      Generated Keywords
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
                  {generatedContent && !error && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <i className="fas fa-check text-green-600 text-sm"></i>
                          </div>
                          <div>
                            <h4 className="text-green-800 font-semibold">Keywords Generated Successfully!</h4>
                            <p className="text-green-600 text-sm">Your brand keyword research is ready to view.</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveTab('result')}
                          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center gap-2"
                        >
                          <i className="fas fa-eye text-xs"></i>
                          View Keywords
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Brand Information</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="brandName">Brand Name</label>
                          <input
                            id="brandName"
                            name="brandName"
                            type="text"
                            value={inputs.brandName}
                            onChange={handleInputChange}
                            placeholder="Enter your brand name"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="industry">Industry</label>
                          <select
                            id="industry"
                            name="industry"
                            value={inputs.industry}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select industry</option>
                            <option value="technology">Technology</option>
                            <option value="health">Health & Wellness</option>
                            <option value="finance">Finance</option>
                            <option value="education">Education</option>
                            <option value="retail">Retail</option>
                            <option value="food">Food & Beverage</option>
                            <option value="travel">Travel</option>
                            <option value="fashion">Fashion</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <option value="b2b">B2B</option>
                            <option value="nonprofit">Non-profit</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="keywordFocus">Keyword Focus</label>
                          <select
                            id="keywordFocus"
                            name="keywordFocus"
                            value={inputs.keywordFocus}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select focus</option>
                            <option value="seo">SEO Keywords</option>
                            <option value="ppc">PPC Keywords</option>
                            <option value="content">Content Keywords</option>
                            <option value="social">Social Media Keywords</option>
                            <option value="all">All Types</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Target Audience & Products</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="targetAudience">Target Audience</label>
                        <textarea 
                          id="targetAudience"
                          name="targetAudience"
                          value={inputs.targetAudience}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Describe your target audience (demographics, interests, behavior, pain points)..."
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="products">Products/Services</label>
                        <textarea 
                          id="products"
                          name="products"
                          value={inputs.products}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="List your main products or services..."
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="brandValues">Brand Values & Messaging</label>
                        <textarea 
                          id="brandValues"
                          name="brandValues"
                          value={inputs.brandValues}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="What does your brand stand for? Key messages and values..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Competitive & Content Strategy</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="competitors">Main Competitors</label>
                        <textarea 
                          id="competitors"
                          name="competitors"
                          value={inputs.competitors}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="List your main competitors or similar brands..."
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="contentGoals">Content Goals</label>
                        <textarea 
                          id="contentGoals"
                          name="contentGoals"
                          value={inputs.contentGoals}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="What are your content marketing goals? What do you want to achieve with these keywords?"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && (
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {keywordTemplates.map((template, index) => (
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
              
              {activeTab === 'result' && generatedContent && (
                <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
                  {/* Primary Keywords */}
                  {generatedContent.primaryKeywords && generatedContent.primaryKeywords.length > 0 && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-blue-800 mb-2 flex items-center gap-2">
                        <i className="fas fa-star text-blue-600"></i>
                        Primary Keywords
                      </h3>
                      <div className="bg-white p-3 rounded-lg border border-blue-100">
                        <div className="flex flex-wrap gap-2">
                          {generatedContent.primaryKeywords.map((keyword: string, index: number) => (
                            <span key={index} className="px-3 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full border border-blue-200">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Secondary Keywords */}
                  {generatedContent.secondaryKeywords && generatedContent.secondaryKeywords.length > 0 && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center gap-2">
                        <i className="fas fa-list text-green-600"></i>
                        Secondary Keywords
                      </h3>
                      <div className="bg-white p-3 rounded-lg border border-green-100">
                        <div className="flex flex-wrap gap-2">
                          {generatedContent.secondaryKeywords.map((keyword: string, index: number) => (
                            <span key={index} className="px-3 py-2 bg-green-100 text-green-800 text-sm rounded-full border border-green-200">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Long-tail Keywords */}
                  {generatedContent.longTailKeywords && generatedContent.longTailKeywords.length > 0 && (
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-purple-800 mb-2 flex items-center gap-2">
                        <i className="fas fa-search-plus text-purple-600"></i>
                        Long-tail Keywords
                      </h3>
                      <div className="bg-white p-3 rounded-lg border border-purple-100">
                        <div className="grid gap-2">
                          {generatedContent.longTailKeywords.map((keyword: string, index: number) => (
                            <div key={index} className="p-2 bg-purple-25 border border-purple-100 rounded-lg">
                              <p className="text-gray-800 text-sm">{keyword}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Local Keywords */}
                  {generatedContent.localKeywords && generatedContent.localKeywords.length > 0 && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                        <i className="fas fa-map-marker-alt text-yellow-600"></i>
                        Local Keywords
                      </h3>
                      <div className="bg-white p-3 rounded-lg border border-yellow-100">
                        <div className="flex flex-wrap gap-2">
                          {generatedContent.localKeywords.map((keyword: string, index: number) => (
                            <span key={index} className="px-3 py-2 bg-yellow-100 text-yellow-800 text-sm rounded-full border border-yellow-200">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Competitor Keywords */}
                  {generatedContent.competitorKeywords && generatedContent.competitorKeywords.length > 0 && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-red-800 mb-2 flex items-center gap-2">
                        <i className="fas fa-chart-line text-red-600"></i>
                        Competitor Keywords
                      </h3>
                      <div className="bg-white p-3 rounded-lg border border-red-100">
                        <div className="flex flex-wrap gap-2">
                          {generatedContent.competitorKeywords.map((keyword: string, index: number) => (
                            <span key={index} className="px-3 py-2 bg-red-100 text-red-800 text-sm rounded-full border border-red-200">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Keyword Strategy */}
                  {generatedContent.keywordStrategy && (
                    <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-indigo-800 mb-2 flex items-center gap-2">
                        <i className="fas fa-lightbulb text-indigo-600"></i>
                        Keyword Strategy
                      </h3>
                      <div className="bg-white p-4 rounded-lg border border-indigo-100">
                        <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">{generatedContent.keywordStrategy}</div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-4">
                    <button
                      onClick={() => navigator.clipboard.writeText(JSON.stringify(generatedContent, null, 2))}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
                    >
                      <i className="fas fa-copy"></i>
                      Copy Keywords
                    </button>
                    <button
                      onClick={() => {
                        const element = document.createElement('a');
                        const file = new Blob([JSON.stringify(generatedContent, null, 2)], { type: 'application/json' });
                        element.href = URL.createObjectURL(file);
                        element.download = 'brand_keywords.json';
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200"
                    >
                      <i className="fas fa-download"></i>
                      Download
                    </button>
                    <button
                      onClick={() => setActiveTab('generate')}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200"
                    >
                      <i className="fas fa-edit"></i>
                      Edit & Regenerate
                    </button>
                  </div>
                </div>
              )}
              
              {activeTab === 'history' && (
                <div className="py-4">
                  <History toolName="Brand Keyword Research" />
                </div>
              )}
            </div>
            
            {/* Results Display */}
            {generatedContent && (
              <div className="mt-4 px-4">
                <div className="bg-white border border-green-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                      <i className="fas fa-check-circle text-green-600"></i>
                      Generated Keywords Research
                    </h3>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          const contentToFormat = formatContentForCopy(generatedContent);
                          navigator.clipboard.writeText(contentToFormat);
                        }}
                        className="px-3 py-1.5 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-all flex items-center gap-1"
                      >
                        <i className="fas fa-copy text-xs"></i>
                        Copy
                      </button>
                      <button 
                        onClick={() => setGeneratedContent(null)}
                        className="px-3 py-1.5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-all flex items-center gap-1"
                      >
                        <i className="fas fa-times text-xs"></i>
                        Clear
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
                    {formatKeywordResearchOutput(generatedContent)}
                  </div>
                </div>
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
                <button 
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className={`px-5 py-2 text-sm text-white rounded-lg transition-all flex items-center gap-2 shadow-md hover:shadow-lg ${
                    isLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin text-xs"></i>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Keywords</span>
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
