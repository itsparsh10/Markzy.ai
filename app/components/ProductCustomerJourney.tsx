'use client';

import React, { useState } from 'react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface ProductCustomerJourneyProps {
  onBackClick: () => void;
}

export default function ProductCustomerJourney({ onBackClick }: ProductCustomerJourneyProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history' | 'result'>('generate');
  const [formData, setFormData] = useState({
    productName: '',
    productCategory: '',
    productDescription: '',
    targetCustomer: '',
    priceRange: '',
    customerGoals: '',
    customerPainPoints: '',
    awarenessStage: '',
    considerationStage: '',
    decisionStage: '',
    postPurchaseStage: '',
    competitorAnalysis: ''
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
        product_category: formData.productCategory,
        product_description: formData.productDescription,
        target_customer: formData.targetCustomer,
        price_range: formData.priceRange,
        customer_goals: formData.customerGoals,
        customer_pain_points: formData.customerPainPoints,
        awareness_stage: formData.awarenessStage,
        consideration_stage: formData.considerationStage,
        decision_stage: formData.decisionStage,
        post_purchase_experience: formData.postPurchaseStage
      };

      const response = await aiToolsService.generateProductCustomerJourney(apiData);
      setResult(response);
      
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Product Customer Journey',
          toolId: 'product-customer-journey',
          outputResult: response,
          prompt: JSON.stringify(apiData)
        });
        console.log('✅ Product customer journey saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
      setActiveTab('result');
    } catch (err: any) {
      console.error('Error generating product customer journey:', err);
      setError(err.message || 'Failed to generate product customer journey. Please try again.');
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

  const productJourneyTemplates = [
    { name: "Digital Product Journey", icon: "fas fa-laptop", description: "Map the customer journey for digital products like courses or software." },
    { name: "Physical Product Journey", icon: "fas fa-box", description: "Track customer experience for physical product purchases." },
    { name: "Subscription Product Journey", icon: "fas fa-sync-alt", description: "Design journey for recurring subscription products." },
    { name: "Luxury Product Journey", icon: "fas fa-gem", description: "Premium product customer journey with extended consideration." },
    { name: "Impulse Product Journey", icon: "fas fa-bolt", description: "Quick decision journey for impulse purchase products." },
    { name: "B2B Product Journey", icon: "fas fa-building", description: "Complex B2B product sales journey mapping." }
  ];

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Glassmorphic Header with blue gradient */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-route text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Product Customer Journey</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create a customer journey for a specific product in your business</p>
            </div>
            <div className="flex items-center gap-3 z-10">
              <span className="text-xs bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/30 flex items-center font-semibold text-white/90">
                <i className="fas fa-clock mr-1"></i> 6 min
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
                  {/* Product Information Section */}
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
                            value={formData.productName}
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
                            value={formData.productCategory}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select category</option>
                            <option value="digital">Digital Product</option>
                            <option value="physical">Physical Product</option>
                            <option value="subscription">Subscription</option>
                            <option value="service">Service</option>
                            <option value="software">Software/App</option>
                            <option value="course">Course/Training</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="productDescription">Product Description</label>
                        <textarea 
                          id="productDescription"
                          name="productDescription"
                          value={formData.productDescription}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Describe your product, its features, and benefits..."
                        ></textarea>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="targetCustomer">Target Customer</label>
                          <textarea 
                            id="targetCustomer"
                            name="targetCustomer"
                            value={formData.targetCustomer}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                            placeholder="Who is this product for?"
                          ></textarea>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="priceRange">Price Range</label>
                          <select
                            id="priceRange"
                            name="priceRange"
                            value={formData.priceRange}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select price range</option>
                            <option value="under-50">Under $50</option>
                            <option value="50-200">$50 - $200</option>
                            <option value="200-500">$200 - $500</option>
                            <option value="500-1000">$500 - $1,000</option>
                            <option value="1000-plus">$1,000+</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Analysis Section */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Customer Analysis</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="customerGoals">Customer Goals & Motivations</label>
                        <textarea 
                          id="customerGoals"
                          name="customerGoals"
                          value={formData.customerGoals}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="What drives customers to seek this product?"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="customerPainPoints">Customer Pain Points</label>
                        <textarea 
                          id="customerPainPoints"
                          name="customerPainPoints"
                          value={formData.customerPainPoints}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="What problems does this product solve?"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Journey Stages Section */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Product Journey Stages</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="awarenessStage">Awareness Stage</label>
                        <textarea 
                          id="awarenessStage"
                          name="awarenessStage"
                          value={formData.awarenessStage}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="How do customers discover this specific product?"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="considerationStage">Consideration Stage</label>
                        <textarea 
                          id="considerationStage"
                          name="considerationStage"
                          value={formData.considerationStage}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="How do customers evaluate this product vs alternatives?"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="decisionStage">Decision Stage</label>
                        <textarea 
                          id="decisionStage"
                          name="decisionStage"
                          value={formData.decisionStage}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="What convinces customers to purchase this product?"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="postPurchaseStage">Post-Purchase Experience</label>
                        <textarea 
                          id="postPurchaseStage"
                          name="postPurchaseStage"
                          value={formData.postPurchaseStage}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="How do customers use and experience this product?"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && (
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {productJourneyTemplates.map((template, index) => (
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
                  <History toolName="Product Customer Journey" />
                </div>
              )}
              
              {activeTab === 'result' && (
                <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
                  {isLoading && (
                    <div className="flex items-center justify-center py-8">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="text-blue-600">Generating product customer journey...</span>
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
                        <h3 className="text-lg font-semibold text-blue-900">Generated Product Customer Journey</h3>
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
                            <h4 className="font-medium text-blue-900">Journey Summary</h4>
                            <button 
                              onClick={() => copyToClipboard(result.summary)}
                              className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-all"
                            >
                              <i className="fas fa-copy mr-1"></i>Copy
                            </button>
                          </div>
                          <div className="p-3 bg-blue-50 rounded border border-blue-100">
                            <p className="text-sm text-blue-900">{result.summary}</p>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white border border-blue-200 rounded-lg shadow-sm">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-medium text-blue-900">Journey Stages</h4>
                            <button 
                              onClick={() => copyToClipboard(`Awareness: ${result.journey_stages.awareness}\n\nConsideration: ${result.journey_stages.consideration}\n\nDecision: ${result.journey_stages.decision}\n\nPost-Purchase: ${result.journey_stages.post_purchase}`)}
                              className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-all"
                            >
                              <i className="fas fa-copy mr-1"></i>Copy All
                            </button>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-semibold text-blue-700 mb-1">Awareness Stage</label>
                              <div className="p-3 bg-blue-50 rounded border border-blue-100">
                                <p className="text-sm text-blue-900">{result.journey_stages.awareness}</p>
                                <button 
                                  onClick={() => copyToClipboard(result.journey_stages.awareness)}
                                  className="mt-2 px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-all"
                                >
                                  <i className="fas fa-copy mr-1"></i>Copy Stage
                                </button>
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-xs font-semibold text-blue-700 mb-1">Consideration Stage</label>
                              <div className="p-3 bg-blue-50 rounded border border-blue-100">
                                <p className="text-sm text-blue-900">{result.journey_stages.consideration}</p>
                                <button 
                                  onClick={() => copyToClipboard(result.journey_stages.consideration)}
                                  className="mt-2 px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-all"
                                >
                                  <i className="fas fa-copy mr-1"></i>Copy Stage
                                </button>
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-xs font-semibold text-blue-700 mb-1">Decision Stage</label>
                              <div className="p-3 bg-blue-50 rounded border border-blue-100">
                                <p className="text-sm text-blue-900">{result.journey_stages.decision}</p>
                                <button 
                                  onClick={() => copyToClipboard(result.journey_stages.decision)}
                                  className="mt-2 px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-all"
                                >
                                  <i className="fas fa-copy mr-1"></i>Copy Stage
                                </button>
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-xs font-semibold text-blue-700 mb-1">Post-Purchase Stage</label>
                              <div className="p-3 bg-blue-50 rounded border border-blue-100">
                                <p className="text-sm text-blue-900">{result.journey_stages.post_purchase}</p>
                                <button 
                                  onClick={() => copyToClipboard(result.journey_stages.post_purchase)}
                                  className="mt-2 px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-all"
                                >
                                  <i className="fas fa-copy mr-1"></i>Copy Stage
                                </button>
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
                      <span>Generate Journey</span>
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
