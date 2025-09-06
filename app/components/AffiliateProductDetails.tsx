'use client';

import React, { useState } from 'react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface AffiliateProductDetailsProps {
  onBackClick: () => void;
}

export default function AffiliateProductDetails({ onBackClick }: AffiliateProductDetailsProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'result' | 'templates' | 'history'>('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedDetails, setGeneratedDetails] = useState<any>(null);
  
  const [inputs, setInputs] = useState({
    productName: '',
    productType: '',
    productDescription: '',
    targetAudience: '',
    keyFeatures: '',
    benefits: '',
    pricing: '',
    specialOffers: '',
    technicalSpecs: '',
    supportInfo: '',
    brandName: '',
    commissionRate: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateDetails = async () => {
    // Validate required fields
    const requiredFields = [
      'productName',
      'brandName',
      'productType',
      'commissionRate',
      'productDescription',
      'targetAudience',
      'keyFeatures',
      'benefits',
      'pricing',
      'specialOffers',
      'technicalSpecs',
      'supportInfo'
    ];
    
    const missingFields = requiredFields.filter(field => !inputs[field as keyof typeof inputs]);
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedDetails(null);

    try {
      // Transform inputs to match API format
      const detailsData = {
        product_name: inputs.productName,
        brand_name: inputs.brandName,
        product_category: inputs.productType, // Changed from product_type to product_category
        commission_rate: inputs.commissionRate,
        product_description: inputs.productDescription,
        target_audience: inputs.targetAudience,
        key_features: inputs.keyFeatures,
        benefits_value_proposition: inputs.benefits,
        pricing_information: inputs.pricing,
        special_offers: inputs.specialOffers,
        technical_specifications: inputs.technicalSpecs,
        support_information: inputs.supportInfo
      };

      const response = await aiToolsService.generateAffiliateProductDetails(detailsData);
      setGeneratedDetails(response);
      setActiveTab('result'); // Switch to result tab after successful generation
      console.log('Generated product details:', response);
      
      // Save to tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Affiliate Product Details',
          toolId: 'affiliate-product-details',
          outputResult: response,
          prompt: JSON.stringify(detailsData)
        });
        console.log('✅ Affiliate product details saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }

    } catch (error: any) {
      console.error('Error generating product details:', error);
      setError(error.message || 'Failed to generate product details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const productTemplates = [
    { name: "Digital Product", icon: "fas fa-laptop", description: "Templates for software, courses, ebooks, and digital services." },
    { name: "Physical Product", icon: "fas fa-box", description: "Templates for tangible products, gadgets, and physical goods." },
    { name: "Service", icon: "fas fa-handshake", description: "Templates for consulting, coaching, and service-based offerings." },
    { name: "Subscription", icon: "fas fa-calendar-check", description: "Templates for recurring billing and subscription products." },
    { name: "Course/Training", icon: "fas fa-graduation-cap", description: "Templates for educational content and training programs." },
    { name: "Software/SaaS", icon: "fas fa-code", description: "Templates for software applications and SaaS products." }
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
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Affiliate Product Details</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create detailed product information for your affiliate partners</p>
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
                {generatedDetails && !error && (
                  <button 
                    onClick={() => setActiveTab('result')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${activeTab === 'result' ? 'text-blue-700 bg-blue-50/70' : 'text-blue-500 hover:text-blue-600'}`}
                  >
                    <span className="flex items-center gap-2">
                      <i className="fas fa-file-alt text-xs"></i>
                      Generated Details
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
                  {generatedDetails && !error && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <i className="fas fa-check text-green-600 text-sm"></i>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-green-900">Details Generated Successfully!</h4>
                            <p className="text-xs text-green-700 mt-1">Your affiliate product details are ready to view.</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setActiveTab('result')}
                          className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
                        >
                          View Details
                          <i className="fas fa-arrow-right text-xs"></i>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Error Display */}
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}

                  <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Basic Product Information</h4>
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
                            placeholder="Enter the product name"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="productCategory">Product Category</label>
                          <select
                            id="productCategory"
                            name="productType"
                            value={inputs.productType}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select category</option>
                            <option value="digital">Digital Product</option>
                            <option value="physical">Physical Product</option>
                            <option value="service">Service</option>
                            <option value="subscription">Subscription</option>
                            <option value="course">Course/Training</option>
                            <option value="software">Software/SaaS</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="brandName">Brand Name</label>
                          <input
                            id="brandName"
                            name="brandName"
                            type="text"
                            value={inputs.brandName}
                            onChange={handleInputChange}
                            placeholder="Enter the brand name"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="commissionRate">Commission Rate</label>
                          <input
                            id="commissionRate"
                            name="commissionRate"
                            type="text"
                            value={inputs.commissionRate}
                            onChange={handleInputChange}
                            placeholder="e.g., 30% or $50 per sale"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
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
                          placeholder="Provide a comprehensive description of what the product does and how it helps customers..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Product Features & Benefits</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="keyFeatures">Key Features</label>
                        <textarea 
                          id="keyFeatures"
                          name="keyFeatures"
                          value={inputs.keyFeatures}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="List the main features of the product (one per line)..."
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="benefits">Benefits & Value Proposition</label>
                        <textarea 
                          id="benefits"
                          name="benefits"
                          value={inputs.benefits}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Explain how the product benefits customers and what value it provides..."
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="targetAudience">Target Audience</label>
                        <textarea 
                          id="targetAudience"
                          name="targetAudience"
                          value={inputs.targetAudience}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Describe who this product is perfect for, including demographics and psychographics..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Pricing & Additional Information</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="pricing">Pricing Information</label>
                          <textarea 
                            id="pricing"
                            name="pricing"
                            value={inputs.pricing}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                            placeholder="Include price, payment plans, money-back guarantee, etc..."
                          ></textarea>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="specialOffers">Special Offers</label>
                          <textarea 
                            id="specialOffers"
                            name="specialOffers"
                            value={inputs.specialOffers}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                            placeholder="Discounts, bonuses, limited-time offers, etc..."
                          ></textarea>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="technicalSpecs">Technical Specifications</label>
                          <textarea 
                            id="technicalSpecs"
                            name="technicalSpecs"
                            value={inputs.technicalSpecs}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                            placeholder="System requirements, compatibility, dimensions, etc..."
                          ></textarea>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="supportInfo">Support Information</label>
                          <textarea 
                            id="supportInfo"
                            name="supportInfo"
                            value={inputs.supportInfo}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                            placeholder="Customer support details, training resources, documentation..."
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'result' && generatedDetails && !error && (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="text-base font-medium text-green-900 mb-3 flex items-center gap-2">
                      <i className="fas fa-check-circle text-green-600"></i>
                      Generated Product Details
                    </h4>
                    
                    {/* Product Overview */}
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded border border-green-200">
                        <h5 className="text-sm font-semibold text-green-900 mb-2">Product Overview</h5>
                        <div className="space-y-2 text-sm text-green-800">
                          <p><strong>Name:</strong> {generatedDetails.product_details.product_overview.name}</p>
                          <p><strong>Category:</strong> {generatedDetails.product_details.product_overview.category}</p>
                          <p><strong>Target Audience:</strong> {generatedDetails.product_details.product_overview.target_audience}</p>
                          
                          <div className="mt-3">
                            <strong>Key Features:</strong>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                              {generatedDetails.product_details.product_overview.key_features.map((feature: string, index: number) => (
                                <li key={index}>{feature}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="mt-3">
                            <strong>Benefits:</strong>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                              {generatedDetails.product_details.product_overview.benefits.map((benefit: string, index: number) => (
                                <li key={index}>{benefit}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Affiliate Angles */}
                      <div className="bg-white p-4 rounded border border-green-200">
                        <h5 className="text-sm font-semibold text-green-900 mb-2">Affiliate Angles</h5>
                        <div className="space-y-3 text-sm text-green-800">
                          <div>
                            <strong>Pain Points:</strong>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                              {generatedDetails.product_details.affiliate_angles.pain_points.map((point: string, index: number) => (
                                <li key={index}>{point}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <strong>Solutions:</strong>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                              {generatedDetails.product_details.affiliate_angles.solutions.map((solution: string, index: number) => (
                                <li key={index}>{solution}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Marketing Copy */}
                      <div className="bg-white p-4 rounded border border-green-200">
                        <h5 className="text-sm font-semibold text-green-900 mb-2">Marketing Copy</h5>
                        <div className="space-y-3 text-sm text-green-800">
                          <div>
                            <strong>Headlines:</strong>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                              {generatedDetails.product_details.marketing_copy.headlines.map((headline: string, index: number) => (
                                <li key={index}>{headline}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <strong>Call to Action:</strong>
                            <p className="mt-1 font-medium">{generatedDetails.product_details.marketing_copy.call_to_action}</p>
                          </div>
                        </div>
                      </div>

                      {/* Content Ideas */}
                      <div className="bg-white p-4 rounded border border-green-200">
                        <h5 className="text-sm font-semibold text-green-900 mb-2">Content Ideas</h5>
                        <div className="space-y-3 text-sm text-green-800">
                          <div>
                            <strong>Blog Topics:</strong>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                              {generatedDetails.product_details.content_ideas.blog_topics.map((topic: string, index: number) => (
                                <li key={index}>{topic}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <strong>Video Ideas:</strong>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                              {generatedDetails.product_details.content_ideas.video_ideas.map((idea: string, index: number) => (
                                <li key={index}>{idea}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex gap-2">
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
                  {productTemplates.map((template, index) => (
                    <div key={index} className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
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
                          setInputs(prev => ({...prev, productType: template.name.toLowerCase().replace(' ', '_')}));
                          setActiveTab('generate');
                        }}
                        className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1"
                      >
                        Create
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {activeTab === 'history' && (
                <div className="py-4">
                  <History toolName="Affiliate Product Details" />
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
                  onClick={handleGenerateDetails}
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
                      <span>Generate Details</span>
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
