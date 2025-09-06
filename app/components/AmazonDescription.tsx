'use client';

import React, { useState } from 'react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface AmazonDescriptionProps {
  onBackClick: () => void;
}

export default function AmazonDescription({ onBackClick }: AmazonDescriptionProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'result' | 'templates' | 'history'>('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [inputs, setInputs] = useState({
    productName: '',
    productCategory: '',
    productDescription: '',
    keyFeatures: '',
    targetAudience: '',
    mainBenefits: '',
    uniqueSellingPoints: '',
    productUse: '',
    specifications: '',
    keywords: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateDescription = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Map form inputs to API format
      const apiData = {
        product_name: inputs.productName,
        product_category: inputs.productCategory,
        product_description: inputs.productDescription,
        key_features: inputs.keyFeatures,
        main_benefits: inputs.mainBenefits,
        unique_selling_points: inputs.uniqueSellingPoints,
        target_audience: inputs.targetAudience,
        product_use_cases: inputs.productUse,
        specifications: inputs.specifications,
        keywords_for_seo: inputs.keywords
      };

      const response = await aiToolsService.generateAmazonDescription(apiData);
      setResult(response);
      setActiveTab('result'); // Switch to result tab after successful generation
      
      // Save to tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Amazon Description',
          toolId: 'amazon-description',
          outputResult: response,
          prompt: JSON.stringify(apiData)
        });
        console.log('✅ Amazon description saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }

    } catch (err: any) {
      console.error('Error generating Amazon description:', err);
      setError(err.message || 'Failed to generate Amazon description. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const amazonTemplates = [
    { name: "Electronics Product", icon: "fas fa-mobile-alt", description: "Template for electronic devices and gadgets with technical specifications." },
    { name: "Home & Kitchen", icon: "fas fa-home", description: "Template for home and kitchen products with practical benefits." },
    { name: "Beauty & Personal Care", icon: "fas fa-heart", description: "Template for beauty and personal care items with lifestyle focus." },
    { name: "Books & Media", icon: "fas fa-book", description: "Template for books, courses, and digital media products." },
    { name: "Clothing & Fashion", icon: "fas fa-tshirt", description: "Template for apparel and fashion accessories." },
    { name: "Health & Fitness", icon: "fas fa-dumbbell", description: "Template for health, fitness, and wellness products." }
  ];

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Glassmorphic Header with blue gradient */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-shopping-bag text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Amazon Description</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Generate optimized Amazon product descriptions and details</p>
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
                      <i className="fas fa-file-text text-xs"></i>
                      Generated Description
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
                            <h4 className="text-sm font-medium text-green-900">Description Generated Successfully!</h4>
                            <p className="text-xs text-green-700 mt-1">Your Amazon product description is ready to view.</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setActiveTab('result')}
                          className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
                        >
                          View Description
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
                        <h4 className="text-base font-medium text-green-900">Generated Amazon Description</h4>
                        <button 
                          onClick={() => setResult(null)}
                          className="text-green-600 hover:text-green-800 transition-colors"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                      
                      {/* Title */}
                      {result.amazon_description?.title && (
                        <div className="space-y-2">
                          <h5 className="text-sm font-semibold text-green-800">Product Title</h5>
                          <p className="text-sm text-green-700 bg-white p-3 rounded border">{result.amazon_description.title}</p>
                        </div>
                      )}

                      {/* Bullet Points */}
                      {result.amazon_description?.bullets && result.amazon_description.bullets.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="text-sm font-semibold text-green-800">Key Features (Bullet Points)</h5>
                          <div className="bg-white p-3 rounded border space-y-2">
                            {result.amazon_description.bullets.map((bullet: string, index: number) => (
                              <div key={index} className="flex items-start gap-2">
                                <span className="text-green-600 text-xs mt-1">•</span>
                                <span className="text-sm text-green-700">{bullet}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Description */}
                      {result.amazon_description?.description && (
                        <div className="space-y-2">
                          <h5 className="text-sm font-semibold text-green-800">Product Description</h5>
                          <p className="text-sm text-green-700 bg-white p-3 rounded border leading-relaxed">{result.amazon_description.description}</p>
                        </div>
                      )}

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
                  {/* Product Information */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Product Information</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="productName">Product Name</label>
                          <input
                            id="productName"
                            name="productName"
                            type="text"
                            value={inputs.productName}
                            onChange={handleInputChange}
                            placeholder="Enter your product name"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="productCategory">Product Category</label>
                          <select
                            id="productCategory"
                            name="productCategory"
                            value={inputs.productCategory}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select category</option>
                            <option value="electronics">Electronics</option>
                            <option value="home-kitchen">Home & Kitchen</option>
                            <option value="beauty">Beauty & Personal Care</option>
                            <option value="books">Books & Media</option>
                            <option value="clothing">Clothing & Fashion</option>
                            <option value="health">Health & Fitness</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="productDescription">Product Description</label>
                        <textarea 
                          id="productDescription"
                          name="productDescription"
                          value={inputs.productDescription}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Describe your product, its main purpose and what makes it special..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Features & Benefits */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Features & Benefits</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="keyFeatures">Key Features</label>
                        <textarea 
                          id="keyFeatures"
                          name="keyFeatures"
                          value={inputs.keyFeatures}
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
                          value={inputs.mainBenefits}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="What benefits does this product provide to customers?"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="uniqueSellingPoints">Unique Selling Points</label>
                        <textarea 
                          id="uniqueSellingPoints"
                          name="uniqueSellingPoints"
                          value={inputs.uniqueSellingPoints}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="What makes your product different from competitors?"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Additional Details</h4>
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
                            placeholder="Who is this product for?"
                          ></textarea>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="productUse">Product Use Cases</label>
                          <textarea 
                            id="productUse"
                            name="productUse"
                            value={inputs.productUse}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                            placeholder="How can this product be used?"
                          ></textarea>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="specifications">Specifications (optional)</label>
                        <textarea 
                          id="specifications"
                          name="specifications"
                          value={inputs.specifications}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="Technical specifications, dimensions, materials, etc."
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="keywords">Keywords for SEO</label>
                        <input
                          id="keywords"
                          name="keywords"
                          type="text"
                          value={inputs.keywords}
                          onChange={handleInputChange}
                          placeholder="Enter relevant keywords separated by commas"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                        />
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'result' && result && !error && (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-medium text-green-900 flex items-center gap-2">
                        <i className="fas fa-check-circle text-green-600"></i>
                        Generated Amazon Description
                      </h4>
                    </div>
                    
                    {/* Title */}
                    {result.amazon_description?.title && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-semibold text-green-800">Product Title</h5>
                        <p className="text-sm text-green-700 bg-white p-3 rounded border">{result.amazon_description.title}</p>
                      </div>
                    )}

                    {/* Bullet Points */}
                    {result.amazon_description?.bullets && result.amazon_description.bullets.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-semibold text-green-800">Key Features (Bullet Points)</h5>
                        <div className="bg-white p-3 rounded border space-y-2">
                          {result.amazon_description.bullets.map((bullet: string, index: number) => (
                            <div key={index} className="flex items-start gap-2">
                              <span className="text-green-600 text-xs mt-1">•</span>
                              <span className="text-sm text-green-700">{bullet}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    {result.amazon_description?.description && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-semibold text-green-800">Product Description</h5>
                        <p className="text-sm text-green-700 bg-white p-3 rounded border leading-relaxed">{result.amazon_description.description}</p>
                      </div>
                    )}

                    {/* Search Terms */}
                    {result.amazon_description?.search_terms && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-semibold text-green-800">Search Terms</h5>
                        <p className="text-sm text-green-700 bg-white p-3 rounded border">{result.amazon_description.search_terms}</p>
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
                  {amazonTemplates.map((template, index) => (
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
                  <History toolName="Amazon Description" />
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
                  onClick={handleGenerateDescription}
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
