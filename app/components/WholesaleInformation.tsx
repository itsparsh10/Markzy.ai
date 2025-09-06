'use client'

import { useState } from 'react';
import { ArrowLeft, Briefcase, Users, Footprints, Lightbulb, Target, Search, ShoppingBag, MessageSquare, ThumbsUp, FileText, History as HistoryIcon, Route, Clock, X, Save, Wand2 } from 'lucide-react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface WholesaleInformationResult {
  summary: string;
  pricing: {
    unit_price: string;
    wholesale_price: string;
    bulk_discounts: string;
  };
  terms: {
    minimum_order_quantity: string;
    shipping_terms: string;
    payment_terms: string;
  };
  recommendations: string;
}

export default function WholesaleInformation({ onBackClick }: { onBackClick: () => void }) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<WholesaleInformationResult | null>(null);
  const [inputs, setInputs] = useState({
    businessName: '',
    productName: '',
    productCategory: '',
    productDescription: '',
    targetWholesalers: '',
    minimumOrderQuantity: '',
    unitPrice: '',
    wholesalePrice: '',
    bulkDiscounts: '',
    shippingTerms: '',
    paymentTerms: '',
    leadTime: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateWholesalePackage = async () => {
    // Validate required fields
    const requiredFields = ['businessName', 'productName', 'productDescription', 'minimumOrderQuantity', 'unitPrice', 'wholesalePrice', 'bulkDiscounts', 'shippingTerms', 'paymentTerms'];
    const missingFields = requiredFields.filter(field => !inputs[field as keyof typeof inputs]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const requestData = {
        business_name: inputs.businessName,
        product_name: inputs.productName,
        product_description: inputs.productDescription,
        minimum_order_quantity: inputs.minimumOrderQuantity,
        unit_price: inputs.unitPrice,
        wholesale_price: inputs.wholesalePrice,
        bulk_discounts: inputs.bulkDiscounts,
        shipping_terms: inputs.shippingTerms,
        payment_terms: inputs.paymentTerms
      };

      const response = await aiToolsService.generateWholesaleInformation(requestData);
      setResult(response);
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Wholesale Information',
          toolId: 'wholesale-information',
          outputResult: response,
          prompt: JSON.stringify(requestData)
        });
        console.log('✅ Wholesale information saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
    } catch (error) {
      console.error('Error generating wholesale package:', error);
      alert('Failed to generate wholesale package. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const renderTemplatesTab = () => {
    return (
      <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-boxes text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Product Catalog Template</h4>
              <p className="text-xs text-blue-600">Template for comprehensive wholesale product information and pricing.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-handshake text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Terms & Conditions</h4>
              <p className="text-xs text-blue-600">Template for wholesale terms, payment conditions, and shipping policies.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-calculator text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Pricing Sheet</h4>
              <p className="text-xs text-blue-600">Template for wholesale pricing, bulk discounts, and quantity breaks.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-truck text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Shipping Information</h4>
              <p className="text-xs text-blue-600">Template for shipping policies, delivery times, and logistics details.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
      </div>
    );
  };

  const renderHistoryTab = () => {
    return (
      <div className="py-4 flex flex-col items-center justify-center text-center space-y-2">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <i className="fas fa-history text-blue-500 text-xl"></i>
        </div>
        <h3 className="text-blue-900 font-medium">History</h3>
        <p className="text-sm text-blue-700 max-w-md">View your previously generated wholesale information packages.</p>
      </div>
    );
  };

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Glassmorphic Header with blue gradient */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-boxes text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Wholesale Information</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create comprehensive wholesale packages for your products</p>
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
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Business & Product Information</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="businessName">Business Name *</label>
                          <input
                            type="text"
                            id="businessName"
                            name="businessName"
                            value={inputs.businessName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                            placeholder="Enter your business name"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="productName">Product Name *</label>
                          <input
                            type="text"
                            id="productName"
                            name="productName"
                            value={inputs.productName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                            placeholder="Enter product name"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="productDescription">Product Description *</label>
                        <textarea 
                          id="productDescription"
                          name="productDescription"
                          value={inputs.productDescription}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Describe your product's features, benefits, and specifications..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Pricing & Terms</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="minimumOrderQuantity">Minimum Order Quantity *</label>
                          <input
                            type="number"
                            id="minimumOrderQuantity"
                            name="minimumOrderQuantity"
                            value={inputs.minimumOrderQuantity}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                            placeholder="e.g., 50"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="unitPrice">Unit Price *</label>
                          <input
                            type="text"
                            id="unitPrice"
                            name="unitPrice"
                            value={inputs.unitPrice}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                            placeholder="e.g., $25.00"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="wholesalePrice">Wholesale Price *</label>
                          <input
                            type="text"
                            id="wholesalePrice"
                            name="wholesalePrice"
                            value={inputs.wholesalePrice}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                            placeholder="e.g., $15.00"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="bulkDiscounts">Bulk Discounts *</label>
                        <textarea 
                          id="bulkDiscounts"
                          name="bulkDiscounts"
                          value={inputs.bulkDiscounts}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="e.g., 100+ units: 10% off, 500+ units: 15% off, 1000+ units: 20% off"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Shipping & Payment Terms</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="shippingTerms">Shipping Terms *</label>
                          <textarea 
                            id="shippingTerms"
                            name="shippingTerms"
                            value={inputs.shippingTerms}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                            placeholder="Describe shipping costs, delivery times, and policies..."
                          ></textarea>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="paymentTerms">Payment Terms *</label>
                          <textarea 
                            id="paymentTerms"
                            name="paymentTerms"
                            value={inputs.paymentTerms}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                            placeholder="e.g., Net 30, 2/10 Net 30, Credit card, Wire transfer..."
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Results Section */}
                  {result && (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="text-base font-medium text-green-900 mb-3">Generated Wholesale Package</h4>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="block text-xs font-semibold text-green-900">Summary</label>
                            <button
                              onClick={() => copyToClipboard(result.summary)}
                              className="text-xs text-green-600 hover:text-green-800 transition-colors"
                            >
                              <i className="fas fa-copy mr-1"></i>Copy
                            </button>
                          </div>
                          <div className="p-3 bg-white rounded border border-green-200 text-sm text-green-900">
                            {result.summary}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="block text-xs font-semibold text-green-900">Pricing Information</label>
                            <button
                              onClick={() => copyToClipboard(`Unit Price: ${result.pricing.unit_price}\nWholesale Price: ${result.pricing.wholesale_price}\nBulk Discounts: ${result.pricing.bulk_discounts}`)}
                              className="text-xs text-green-600 hover:text-green-800 transition-colors"
                            >
                              <i className="fas fa-copy mr-1"></i>Copy All
                            </button>
                          </div>
                          <div className="p-3 bg-white rounded border border-green-200">
                            <div className="space-y-2 text-sm text-green-900">
                              <div><strong>Unit Price:</strong> {result.pricing.unit_price}</div>
                              <div><strong>Wholesale Price:</strong> {result.pricing.wholesale_price}</div>
                              <div><strong>Bulk Discounts:</strong> {result.pricing.bulk_discounts}</div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="block text-xs font-semibold text-green-900">Terms & Conditions</label>
                            <button
                              onClick={() => copyToClipboard(`Minimum Order Quantity: ${result.terms.minimum_order_quantity}\n\nShipping Terms: ${result.terms.shipping_terms}\n\nPayment Terms: ${result.terms.payment_terms}`)}
                              className="text-xs text-green-600 hover:text-green-800 transition-colors"
                            >
                              <i className="fas fa-copy mr-1"></i>Copy All
                            </button>
                          </div>
                          <div className="p-3 bg-white rounded border border-green-200">
                            <div className="space-y-2 text-sm text-green-900">
                              <div><strong>Minimum Order Quantity:</strong> {result.terms.minimum_order_quantity}</div>
                              <div><strong>Shipping Terms:</strong> {result.terms.shipping_terms}</div>
                              <div><strong>Payment Terms:</strong> {result.terms.payment_terms}</div>
                            </div>
                          </div>
                        </div>

                        {result.recommendations && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="block text-xs font-semibold text-green-900">Recommendations</label>
                              <button
                                onClick={() => copyToClipboard(result.recommendations)}
                                className="text-xs text-green-600 hover:text-green-800 transition-colors"
                              >
                                <i className="fas fa-copy mr-1"></i>Copy
                              </button>
                            </div>
                            <div className="p-3 bg-white rounded border border-green-200 text-sm text-green-900">
                              {result.recommendations}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'templates' && renderTemplatesTab()}
              {activeTab === 'history' && (
                <div className="py-4">
                  <History toolName="Wholesale Information" />
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
                  onClick={handleGenerateWholesalePackage}
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
                      <span>Generate Package</span>
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
