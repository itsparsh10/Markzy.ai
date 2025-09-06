'use client';

import React, { useState } from 'react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface ProductDescriptionProps {
  onBackClick: () => void;
}

export default function ProductDescription({ onBackClick }: ProductDescriptionProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history' | 'result'>('generate');
  const [formData, setFormData] = useState({
    productName: '',
    productType: '',
    targetAudience: '',
    keyFeatures: '',
    mainBenefits: '',
    uniqueSellingPoints: '',
    useCases: '',
    specifications: '',
    platform: '',
    descriptionLength: '',
    tone: 'professional'
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
        product_name: formData.productName,
        product_type: formData.productType,
        platform_website: formData.platform,
        description_length: formData.descriptionLength,
        target_audience: formData.targetAudience,
        key_features: formData.keyFeatures,
        main_benefits: formData.mainBenefits,
        unique_selling_points: formData.uniqueSellingPoints,
        use_cases: formData.useCases,
        tone_of_voice: formData.tone,
        specifications: formData.specifications
      };

      const response = await aiToolsService.generateProductDescription(apiData);
      setResult(response);
      
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Product Description',
          toolId: 'product-description',
          outputResult: response,
          prompt: JSON.stringify(apiData)
        });
        console.log('✅ Product description saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
      setActiveTab('result');
    } catch (err: any) {
      console.error('Error generating product description:', err);
      setError(err.message || 'Failed to generate product description. Please try again.');
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

  const productDescriptionTemplates = [
    { name: "E-commerce Product", icon: "fas fa-shopping-cart", description: "Optimized product descriptions for online stores and marketplaces." },
    { name: "SaaS Product", icon: "fas fa-cloud", description: "Technical product descriptions for software and digital tools." },
    { name: "Physical Product", icon: "fas fa-box", description: "Detailed descriptions for tangible products with specifications." },
    { name: "Digital Product", icon: "fas fa-download", description: "Descriptions for digital downloads, courses, and templates." },
    { name: "Service Description", icon: "fas fa-handshake", description: "Professional service and consulting descriptions." },
    { name: "Subscription Product", icon: "fas fa-sync-alt", description: "Recurring subscription and membership descriptions." }
  ];

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Glassmorphic Header with blue gradient */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-tag text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Product Description</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create compelling product descriptions for your website</p>
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
                  {/* Product Basics Section */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Product Basics</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="productName">Product Name</label>
                          <input
                            id="productName"
                            name="productName"
                            type="text"
                            value={formData.productName}
                            onChange={handleInputChange}
                            placeholder="Enter your product name"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="productType">Product Type</label>
                          <select
                            id="productType"
                            name="productType"
                            value={formData.productType}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select product type</option>
                            <option value="physical">Physical Product</option>
                            <option value="digital">Digital Product</option>
                            <option value="software">Software/App</option>
                            <option value="service">Service</option>
                            <option value="subscription">Subscription</option>
                            <option value="course">Course/Training</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="platform">Platform/Website</label>
                          <select
                            id="platform"
                            name="platform"
                            value={formData.platform}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select platform</option>
                            <option value="shopify">Shopify</option>
                            <option value="wordpress">WordPress</option>
                            <option value="squarespace">Squarespace</option>
                            <option value="wix">Wix</option>
                            <option value="custom">Custom Website</option>
                            <option value="marketplace">Marketplace</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="descriptionLength">Description Length</label>
                          <select
                            id="descriptionLength"
                            name="descriptionLength"
                            value={formData.descriptionLength}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select length</option>
                            <option value="short">Short (50-100 words)</option>
                            <option value="medium">Medium (100-200 words)</option>
                            <option value="long">Long (200+ words)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Product Details Section */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Product Details</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="targetAudience">Target Audience</label>
                        <textarea 
                          id="targetAudience"
                          name="targetAudience"
                          value={formData.targetAudience}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="Who is this product for?"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="keyFeatures">Key Features</label>
                        <textarea 
                          id="keyFeatures"
                          name="keyFeatures"
                          value={formData.keyFeatures}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="List the main features of your product (one per line)"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="mainBenefits">Main Benefits</label>
                        <textarea 
                          id="mainBenefits"
                          name="mainBenefits"
                          value={formData.mainBenefits}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="What benefits do customers get from this product?"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="uniqueSellingPoints">Unique Selling Points</label>
                        <textarea 
                          id="uniqueSellingPoints"
                          name="uniqueSellingPoints"
                          value={formData.uniqueSellingPoints}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="What makes this product different from competitors?"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information Section */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Additional Information</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="useCases">Use Cases</label>
                          <textarea 
                            id="useCases"
                            name="useCases"
                            value={formData.useCases}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                            placeholder="When/how would customers use this?"
                          ></textarea>
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
                            <option value="professional">Professional</option>
                            <option value="friendly">Friendly</option>
                            <option value="casual">Casual</option>
                            <option value="luxury">Luxury</option>
                            <option value="technical">Technical</option>
                            <option value="conversational">Conversational</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="specifications">Specifications/Technical Details (Optional)</label>
                        <textarea 
                          id="specifications"
                          name="specifications"
                          value={formData.specifications}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="Technical specs, dimensions, requirements, etc."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && (
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {productDescriptionTemplates.map((template, index) => (
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
                  <History toolName="Product Description" />
                </div>
              )}
              
              {activeTab === 'result' && (
                <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
                  {isLoading && (
                    <div className="flex items-center justify-center py-8">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="text-blue-600">Generating product description...</span>
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
                  
                  {result && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-blue-900">Generated Product Description</h3>
                        <button 
                          onClick={() => setActiveTab('generate')}
                          className="px-3 py-1.5 text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all flex items-center gap-1 border border-blue-100"
                        >
                          <i className="fas fa-plus text-xs"></i> Generate New
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-white border border-blue-200 rounded-lg shadow-sm">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-medium text-blue-900">Product Title</h4>
                            <button 
                              onClick={() => copyToClipboard(result.title)}
                              className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-all"
                            >
                              <i className="fas fa-copy mr-1"></i>Copy
                            </button>
                          </div>
                          <div className="p-3 bg-blue-50 rounded border border-blue-100">
                            <p className="text-sm text-blue-900">{result.title}</p>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white border border-blue-200 rounded-lg shadow-sm">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-medium text-blue-900">Product Description</h4>
                            <button 
                              onClick={() => copyToClipboard(result.description)}
                              className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-all"
                            >
                              <i className="fas fa-copy mr-1"></i>Copy
                            </button>
                          </div>
                          <div className="p-3 bg-blue-50 rounded border border-blue-100">
                            <p className="text-sm text-blue-900">{result.description}</p>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white border border-blue-200 rounded-lg shadow-sm">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-medium text-blue-900">Key Features</h4>
                            <button 
                              onClick={() => copyToClipboard(result.features.join('\n• '))}
                              className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-all"
                            >
                              <i className="fas fa-copy mr-1"></i>Copy All
                            </button>
                          </div>
                          <div className="p-3 bg-blue-50 rounded border border-blue-100">
                            <ul className="text-sm text-blue-900 space-y-1">
                              {result.features.map((feature: string, index: number) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-blue-600 mr-2">•</span>
                                  <span>{feature}</span>
                                  <button 
                                    onClick={() => copyToClipboard(feature)}
                                    className="ml-auto px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-all"
                                  >
                                    <i className="fas fa-copy mr-1"></i>Copy
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white border border-blue-200 rounded-lg shadow-sm">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-medium text-blue-900">Main Benefits</h4>
                            <button 
                              onClick={() => copyToClipboard(result.main_benefits)}
                              className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-all"
                            >
                              <i className="fas fa-copy mr-1"></i>Copy
                            </button>
                          </div>
                          <div className="p-3 bg-blue-50 rounded border border-blue-100">
                            <p className="text-sm text-blue-900">{result.main_benefits}</p>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white border border-blue-200 rounded-lg shadow-sm">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-medium text-blue-900">Unique Selling Points</h4>
                            <button 
                              onClick={() => copyToClipboard(result.unique_selling_points)}
                              className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-all"
                            >
                              <i className="fas fa-copy mr-1"></i>Copy
                            </button>
                          </div>
                          <div className="p-3 bg-blue-50 rounded border border-blue-100">
                            <p className="text-sm text-blue-900">{result.unique_selling_points}</p>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white border border-blue-200 rounded-lg shadow-sm">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-medium text-blue-900">Use Cases</h4>
                            <button 
                              onClick={() => copyToClipboard(result.use_cases)}
                              className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-all"
                            >
                              <i className="fas fa-copy mr-1"></i>Copy
                            </button>
                          </div>
                          <div className="p-3 bg-blue-50 rounded border border-blue-100">
                            <p className="text-sm text-blue-900">{result.use_cases}</p>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white border border-blue-200 rounded-lg shadow-sm">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-medium text-blue-900">Specifications</h4>
                            <button 
                              onClick={() => copyToClipboard(result.specifications)}
                              className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-all"
                            >
                              <i className="fas fa-copy mr-1"></i>Copy
                            </button>
                          </div>
                          <div className="p-3 bg-blue-50 rounded border border-blue-100">
                            <p className="text-sm text-blue-900">{result.specifications}</p>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white border border-blue-200 rounded-lg shadow-sm">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-medium text-blue-900">Complete Description</h4>
                            <button 
                              onClick={() => copyToClipboard(`${result.title}\n\n${result.description}\n\nKey Features:\n${result.features.map((f: string) => `• ${f}`).join('\n')}\n\nMain Benefits: ${result.main_benefits}\n\nUnique Selling Points: ${result.unique_selling_points}\n\nUse Cases: ${result.use_cases}\n\nSpecifications: ${result.specifications}`)}
                              className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-all"
                            >
                              <i className="fas fa-copy mr-1"></i>Copy All
                            </button>
                          </div>
                          <div className="p-3 bg-blue-50 rounded border border-blue-100">
                            <div className="text-sm text-blue-900 space-y-3">
                              <div>
                                <p className="font-semibold mb-2">{result.title}</p>
                                <p>{result.description}</p>
                              </div>
                              <div>
                                <p className="font-semibold mb-2">Key Features:</p>
                                <ul className="space-y-1">
                                  {result.features.map((feature: string, index: number) => (
                                    <li key={index} className="flex items-start">
                                      <span className="text-blue-600 mr-2">•</span>
                                      <span>{feature}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <p className="font-semibold mb-1">Main Benefits:</p>
                                <p>{result.main_benefits}</p>
                              </div>
                              <div>
                                <p className="font-semibold mb-1">Unique Selling Points:</p>
                                <p>{result.unique_selling_points}</p>
                              </div>
                              <div>
                                <p className="font-semibold mb-1">Use Cases:</p>
                                <p>{result.use_cases}</p>
                              </div>
                              <div>
                                <p className="font-semibold mb-1">Specifications:</p>
                                <p>{result.specifications}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
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
                      <span>Generate Description</span>
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
