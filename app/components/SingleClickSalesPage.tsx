'use client'

import { useState } from 'react';
import { Copy, Check, X, Wand2 } from 'lucide-react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface SingleClickSalesPageResults {
  headline: string;
  subheadline: string;
  introduction: string;
  benefit_section: string;
  features_section: string;
  pricing_section: string;
  urgency_section: string;
  guarantee_section: string;
  call_to_action: string;
}

export default function SingleClickSalesPage({ onBackClick }: { onBackClick: () => void }) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [inputs, setInputs] = useState({
    productName: '',
    productType: '',
    productDescription: '',
    targetAudience: '',
    mainBenefit: '',
    keyFeatures: '',
    pricing: '',
    urgency: '',
    guarantee: '',
    callToAction: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<SingleClickSalesPageResults | null>(null);
  const [copiedSections, setCopiedSections] = useState<{[key: string]: boolean}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError('');
    setResults(null);

    try {
      const data = {
        product_name: inputs.productName,
        product_type: inputs.productType,
        product_description: inputs.productDescription,
        target_audience: inputs.targetAudience,
        main_benefit: inputs.mainBenefit,
        key_features: inputs.keyFeatures,
        pricing: inputs.pricing,
        call_to_action: inputs.callToAction,
        urgency_scarcity: inputs.urgency,
        guarantee_risk_reversal: inputs.guarantee,
      };

      const response = await aiToolsService.generateSingleClickSalesPage(data);
      setResults(response);
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Single Click Sales Page',
          toolId: 'single-click-sales-page',
          outputResult: response,
          prompt: JSON.stringify(data)
        });
        console.log('✅ Single click sales page saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
    } catch (err: any) {
      console.error('Error generating single click sales page:', err);
      setError(err.response?.data?.message || err.message || 'Failed to generate sales page');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSections(prev => ({ ...prev, [section]: true }));
      setTimeout(() => {
        setCopiedSections(prev => ({ ...prev, [section]: false }));
      }, 2000);
    } catch (err: any) {
      console.error('Failed to copy text:', err);
    }
  };

  const renderTemplatesTab = () => {
    return (
      <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-bolt text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Quick Product Sales Page</h4>
              <p className="text-xs text-blue-600">Instant sales page template for physical products.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-laptop text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Digital Product Sales Page</h4>
              <p className="text-xs text-blue-600">One-click template for digital products and services.</p>
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
              <h4 className="font-medium text-blue-900">Service Sales Page</h4>
              <p className="text-xs text-blue-600">Quick sales page template for consulting and services.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-graduation-cap text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Course Sales Page</h4>
              <p className="text-xs text-blue-600">Instant template for online courses and training programs.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-rocket text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Launch Sales Page</h4>
              <p className="text-xs text-blue-600">Quick template for product launches and new releases.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
      </div>
    );
  };

  const renderHistoryTab = () => {
    return (
      <div className="py-4">
        <History toolName="Single Click Sales Page" />
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
              <i className="fas fa-bolt text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Single Click Sales Page</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create a draft sales page in a click—no messing around with multiple sections</p>
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
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="productType">Product Type</label>
                          <select
                            id="productType"
                            name="productType"
                            value={inputs.productType}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select product type</option>
                            <option value="digital">Digital Product</option>
                            <option value="physical">Physical Product</option>
                            <option value="service">Service</option>
                            <option value="course">Online Course</option>
                            <option value="software">Software/App</option>
                            <option value="consulting">Consulting</option>
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
                          placeholder="Briefly describe what your product does and its main value..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Sales Page Content</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="targetAudience">Target Audience</label>
                        <textarea 
                          id="targetAudience"
                          name="targetAudience"
                          value={inputs.targetAudience}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="Who is this product for? Describe your ideal customer..."
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="mainBenefit">Main Benefit</label>
                        <textarea 
                          id="mainBenefit"
                          name="mainBenefit"
                          value={inputs.mainBenefit}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="What's the main benefit or transformation your product provides?"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="keyFeatures">Key Features</label>
                        <textarea 
                          id="keyFeatures"
                          name="keyFeatures"
                          value={inputs.keyFeatures}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="List the key features or components of your product..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Pricing & Action</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="pricing">Pricing</label>
                          <input
                            id="pricing"
                            name="pricing"
                            type="text"
                            value={inputs.pricing}
                            onChange={handleInputChange}
                            placeholder="e.g., $97, Free, $29/month"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="callToAction">Call to Action</label>
                          <input
                            id="callToAction"
                            name="callToAction"
                            type="text"
                            value={inputs.callToAction}
                            onChange={handleInputChange}
                            placeholder="e.g., Get Instant Access, Buy Now, Start Free Trial"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="urgency">Urgency/Scarcity (optional)</label>
                        <input
                          id="urgency"
                          name="urgency"
                          type="text"
                          value={inputs.urgency}
                          onChange={handleInputChange}
                          placeholder="e.g., Limited time offer, Only 100 spots available"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="guarantee">Guarantee/Risk Reversal (optional)</label>
                        <input
                          id="guarantee"
                          name="guarantee"
                          type="text"
                          value={inputs.guarantee}
                          onChange={handleInputChange}
                          placeholder="e.g., 30-day money-back guarantee, 100% satisfaction guaranteed"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Error Display */}
                  {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center">
                        <X className="w-5 h-5 text-red-500 mr-2" />
                        <p className="text-red-700 text-sm">{error}</p>
                      </div>
                    </div>
                  )}

                  {/* Results Display */}
                  {results && (
                    <div className="mt-6 space-y-4">
                      <h3 className="text-lg font-semibold text-blue-900 mb-4">Generated Sales Page</h3>
                      
                      <div className="space-y-4">
                        {/* Headline */}
                        <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-blue-900">Headline</h4>
                            <button
                              onClick={() => copyToClipboard(results.headline, 'headline')}
                              className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                            >
                              {copiedSections.headline ? (
                                <Check className="w-4 h-4 mr-1" />
                              ) : (
                                <Copy className="w-4 h-4 mr-1" />
                              )}
                              {copiedSections.headline ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                          <p className="text-gray-700">{results.headline}</p>
                        </div>

                        {/* Subheadline */}
                        <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-blue-900">Subheadline</h4>
                            <button
                              onClick={() => copyToClipboard(results.subheadline, 'subheadline')}
                              className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                            >
                              {copiedSections.subheadline ? (
                                <Check className="w-4 h-4 mr-1" />
                              ) : (
                                <Copy className="w-4 h-4 mr-1" />
                              )}
                              {copiedSections.subheadline ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                          <p className="text-gray-700">{results.subheadline}</p>
                        </div>

                        {/* Introduction */}
                        <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-blue-900">Introduction</h4>
                            <button
                              onClick={() => copyToClipboard(results.introduction, 'introduction')}
                              className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                            >
                              {copiedSections.introduction ? (
                                <Check className="w-4 h-4 mr-1" />
                              ) : (
                                <Copy className="w-4 h-4 mr-1" />
                              )}
                              {copiedSections.introduction ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                          <p className="text-gray-700">{results.introduction}</p>
                        </div>

                        {/* Benefit Section */}
                        <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-blue-900">Benefit Section</h4>
                            <button
                              onClick={() => copyToClipboard(results.benefit_section, 'benefit_section')}
                              className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                            >
                              {copiedSections.benefit_section ? (
                                <Check className="w-4 h-4 mr-1" />
                              ) : (
                                <Copy className="w-4 h-4 mr-1" />
                              )}
                              {copiedSections.benefit_section ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                          <p className="text-gray-700">{results.benefit_section}</p>
                        </div>

                        {/* Features Section */}
                        <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-blue-900">Features Section</h4>
                            <button
                              onClick={() => copyToClipboard(results.features_section, 'features_section')}
                              className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                            >
                              {copiedSections.features_section ? (
                                <Check className="w-4 h-4 mr-1" />
                              ) : (
                                <Copy className="w-4 h-4 mr-1" />
                              )}
                              {copiedSections.features_section ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                          <p className="text-gray-700">{results.features_section}</p>
                        </div>

                        {/* Pricing Section */}
                        <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-blue-900">Pricing Section</h4>
                            <button
                              onClick={() => copyToClipboard(results.pricing_section, 'pricing_section')}
                              className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                            >
                              {copiedSections.pricing_section ? (
                                <Check className="w-4 h-4 mr-1" />
                              ) : (
                                <Copy className="w-4 h-4 mr-1" />
                              )}
                              {copiedSections.pricing_section ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                          <p className="text-gray-700">{results.pricing_section}</p>
                        </div>

                        {/* Urgency Section */}
                        {results.urgency_section && (
                          <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-blue-900">Urgency Section</h4>
                              <button
                                onClick={() => copyToClipboard(results.urgency_section, 'urgency_section')}
                                className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                              >
                                {copiedSections.urgency_section ? (
                                  <Check className="w-4 h-4 mr-1" />
                                ) : (
                                  <Copy className="w-4 h-4 mr-1" />
                                )}
                                {copiedSections.urgency_section ? 'Copied!' : 'Copy'}
                              </button>
                            </div>
                            <p className="text-gray-700">{results.urgency_section}</p>
                          </div>
                        )}

                        {/* Guarantee Section */}
                        {results.guarantee_section && (
                          <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-blue-900">Guarantee Section</h4>
                              <button
                                onClick={() => copyToClipboard(results.guarantee_section, 'guarantee_section')}
                                className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                              >
                                {copiedSections.guarantee_section ? (
                                  <Check className="w-4 h-4 mr-1" />
                                ) : (
                                  <Copy className="w-4 h-4 mr-1" />
                                )}
                                {copiedSections.guarantee_section ? 'Copied!' : 'Copy'}
                              </button>
                            </div>
                            <p className="text-gray-700">{results.guarantee_section}</p>
                          </div>
                        )}

                        {/* Call to Action */}
                        <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-blue-900">Call to Action</h4>
                            <button
                              onClick={() => copyToClipboard(results.call_to_action, 'call_to_action')}
                              className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                            >
                              {copiedSections.call_to_action ? (
                                <Check className="w-4 h-4 mr-1" />
                              ) : (
                                <Copy className="w-4 h-4 mr-1" />
                              )}
                              {copiedSections.call_to_action ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                          <p className="text-gray-700">{results.call_to_action}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'templates' && renderTemplatesTab()}
              {activeTab === 'history' && (
                <div className="py-4">
                  <History toolName="Single Click Sales Page" />
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
                  disabled={isGenerating}
                  className="px-5 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 disabled:bg-blue-400 transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <span>Generate Sales Page</span>
                      <Wand2 size={16} className="group-hover:translate-x-0.5 transition-transform" />
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
