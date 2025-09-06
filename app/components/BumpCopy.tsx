'use client';

import React, { useState } from 'react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface BumpCopyProps {
  onBackClick: () => void;
}

export default function BumpCopy({ onBackClick }: BumpCopyProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'result' | 'templates' | 'history'>('generate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCopy, setGeneratedCopy] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [toolHistory, setToolHistory] = useState<any[]>([]);
  const [inputs, setInputs] = useState({
    mainProduct: '',
    productPrice: '',
    bumpOffer: '',
    bumpPrice: '',
    bumpValue: '',
    targetAudience: '',
    mainBenefit: '',
    urgency: '',
    guarantee: '',
    offerType: 'discount'
  });



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleClearForm = () => {
    setInputs({
      mainProduct: '',
      productPrice: '',
      bumpOffer: '',
      bumpPrice: '',
      bumpValue: '',
      targetAudience: '',
      mainBenefit: '',
      urgency: '',
      guarantee: '',
      offerType: 'discount'
    });
    setGeneratedCopy('');
    setError('');
    setShowSuccess(false);
  };

  const handleGenerateBumpCopy = async () => {
    // Validate required fields
    const requiredFields = [
      'mainProduct',
      'productPrice', 
      'bumpOffer',
      'bumpPrice',
      'bumpValue',
      'targetAudience',
      'mainBenefit',
      'urgency',
      'guarantee'
    ];
    
    const missingFields = requiredFields.filter(field => !inputs[field as keyof typeof inputs]);
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedCopy('');

    try {
      // Map form inputs to API expected format
      const apiData = {
        main_product_service: inputs.mainProduct,
        main_product_price: inputs.productPrice,
        target_audience: inputs.targetAudience,
        bump_offer_product_service: inputs.bumpOffer,
        bump_offer_price: inputs.bumpPrice,
        offer_type: inputs.offerType,
        bump_offer_value: inputs.bumpValue,
        main_benefit_hook: inputs.mainBenefit,
        urgency_element: inputs.urgency,
        guarantee_element: inputs.guarantee
      };

      console.log('Sending bump copy request with data:', apiData);
      const response = await aiToolsService.generateBumpCopy(apiData);
      
      if (response && response.bump_copy) {
        setGeneratedCopy(response.bump_copy);
        setShowSuccess(true);
        setActiveTab('result');
        console.log('Generated bump copy:', response.bump_copy);
        
        // Save to tool history silently
        try {
          await saveToolHistorySilent({
            toolName: 'Bump Copy',
            toolId: 'bump-copy',
            outputResult: response,
            prompt: JSON.stringify(apiData)
          });
          console.log('✅ Bump copy saved to history');
        } catch (historyError) {
          console.warn('⚠️ Failed to save to history:', historyError);
        }
        
        // Auto-hide success message after 3 seconds
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (err: any) {
      console.error('Error generating bump copy:', err);
      setError(err.message || 'Failed to generate bump copy. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };



  const bumpTemplates = [
    { name: "Discount Bump", icon: "fas fa-percentage", description: "Additional discount on a complementary product or service." },
    { name: "Bonus Product", icon: "fas fa-gift", description: "Add-on product that enhances the main purchase value." },
    { name: "Upgrade Offer", icon: "fas fa-arrow-up", description: "Premium version or upgraded features for small additional cost." },
    { name: "Fast Action Bonus", icon: "fas fa-clock", description: "Time-sensitive offer that creates urgency to purchase now." },
    { name: "Bundle Deal", icon: "fas fa-boxes", description: "Package deal combining multiple related products or services." },
    { name: "Extended Service", icon: "fas fa-plus-circle", description: "Additional service or extended warranty/support options." }
  ];

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Glassmorphic Header with blue gradient */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-arrow-up text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Bump Copy</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create compelling checkout bump offers to increase average order value</p>
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
                {generatedCopy && !error && (
                  <button 
                    onClick={() => setActiveTab('result')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${activeTab === 'result' ? 'text-blue-700 bg-blue-50/70' : 'text-blue-500 hover:text-blue-600'}`}
                  >
                    <span className="flex items-center gap-2">
                      <i className="fas fa-plus-circle text-xs"></i>
                      Generated Copy
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
                  {generatedCopy && !error && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <i className="fas fa-check text-green-600 text-sm"></i>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-green-800">Generated Successfully!</h4>
                            <p className="text-xs text-green-600 mt-0.5">Your bump copy is ready to view.</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setActiveTab('result')}
                          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors duration-200"
                        >
                          View Copy
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Error Display */}
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <i className="fas fa-exclamation-triangle text-red-500"></i>
                        <span className="text-sm text-red-700 font-medium">Error</span>
                      </div>
                      <p className="text-xs text-red-600 mt-1">{error}</p>
                    </div>
                  )}

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Main Product Information</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="mainProduct">Main Product/Service</label>
                          <input
                            id="mainProduct"
                            name="mainProduct"
                            type="text"
                            value={inputs.mainProduct}
                            onChange={handleInputChange}
                            placeholder="What are you primarily selling?"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="productPrice">Main Product Price</label>
                          <input
                            id="productPrice"
                            name="productPrice"
                            type="text"
                            value={inputs.productPrice}
                            onChange={handleInputChange}
                            placeholder="e.g., $99, $199, etc."
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="targetAudience">Target Audience</label>
                        <textarea 
                          id="targetAudience"
                          name="targetAudience"
                          value={inputs.targetAudience}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="Who is your ideal customer?"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Bump Offer Details</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="bumpOffer">Bump Offer Product/Service</label>
                          <input
                            id="bumpOffer"
                            name="bumpOffer"
                            type="text"
                            value={inputs.bumpOffer}
                            onChange={handleInputChange}
                            placeholder="What additional product/service are you offering?"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="bumpPrice">Bump Offer Price</label>
                          <input
                            id="bumpPrice"
                            name="bumpPrice"
                            type="text"
                            value={inputs.bumpPrice}
                            onChange={handleInputChange}
                            placeholder="e.g., $29, $49, etc."
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="offerType">Offer Type</label>
                          <select
                            id="offerType"
                            name="offerType"
                            value={inputs.offerType}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="discount">Discount</option>
                            <option value="bonus">Bonus Product</option>
                            <option value="upgrade">Upgrade</option>
                            <option value="bundle">Bundle</option>
                            <option value="service">Extended Service</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="bumpValue">Bump Offer Value</label>
                          <input
                            id="bumpValue"
                            name="bumpValue"
                            type="text"
                            value={inputs.bumpValue}
                            onChange={handleInputChange}
                            placeholder="e.g., $150 value, $200 value"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Copy Elements</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="mainBenefit">Main Benefit Hook</label>
                        <textarea 
                          id="mainBenefit"
                          name="mainBenefit"
                          value={inputs.mainBenefit}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="What's the main benefit of the bump offer?"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="urgency">Urgency Element</label>
                        <textarea 
                          id="urgency"
                          name="urgency"
                          value={inputs.urgency}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="What creates urgency for this offer?"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="guarantee">Guarantee Element</label>
                        <textarea 
                          id="guarantee"
                          name="guarantee"
                          value={inputs.guarantee}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="What guarantee or risk reversal can you offer?"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && (
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {bumpTemplates.map((template, index) => (
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
              
              {activeTab === 'result' && generatedCopy && (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  <div className="bg-white border border-green-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                        <i className="fas fa-check-circle text-green-600"></i>
                        Generated Bump Copy
                      </h3>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => navigator.clipboard.writeText(generatedCopy)}
                          className="px-3 py-1.5 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-all flex items-center gap-1"
                        >
                          <i className="fas fa-copy text-xs"></i>
                          Copy
                        </button>
                        <button 
                          onClick={() => setGeneratedCopy('')}
                          className="px-3 py-1.5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-all flex items-center gap-1"
                        >
                          <i className="fas fa-times text-xs"></i>
                          Clear
                        </button>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 max-h-80 overflow-y-auto">
                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                          {generatedCopy}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'history' && (
                <div className="py-4">
                  <History toolName="Bump Copy" />
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
                <button 
                  onClick={handleClearForm}
                  className="px-4 py-2 text-sm text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-all shadow-sm hover:shadow"
                >
                  Clear Form
                </button>
                <button 
                  onClick={handleGenerateBumpCopy}
                  disabled={isGenerating}
                  className={`px-5 py-2 text-sm text-white rounded-lg transition-all flex items-center gap-2 shadow-md hover:shadow-lg ${
                    isGenerating 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <i className="fas fa-spinner fa-spin text-xs"></i>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Bump Copy</span>
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
