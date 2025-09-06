'use client';

import React, { useState } from 'react';
import api from '../../services/api.js';
import { ENDPOINTS } from '../../services/config.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface AffiliateMessagingInformationProps {
  onBackClick: () => void;
}

export default function AffiliateMessagingInformation({ onBackClick }: AffiliateMessagingInformationProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history' | 'result'>('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [error, setError] = useState<string>('');
  
  const [inputs, setInputs] = useState({
    productName: '',
    productCategory: '',
    productDescription: '',
    targetAudience: '',
    productBenefits: '',
    uniqueSellingPoints: '',
    commissionStructure: '',
    campaignDuration: '',
    messagingAngles: '',
    competitiveAdvantages: '',
    socialProof: '',
    promotionalOffers: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const generateMessaging = async () => {
    setIsLoading(true);
    setApiResponse(null);
    setError('');
    
    try {
      const requestData = {
        product_service_name: inputs.productName,
        product_category: inputs.productCategory,
        product_description: inputs.productDescription,
        target_audience: inputs.targetAudience,
        main_benefits_outcomes: inputs.productBenefits,
        unique_selling_points: inputs.uniqueSellingPoints,
        competitive_advantages: inputs.competitiveAdvantages,
        commission_structure: inputs.commissionStructure,
        campaign_duration: inputs.campaignDuration,
        promotional_offers_bonuses: inputs.promotionalOffers,
        social_proof_testimonials: inputs.socialProof,
        suggested_messaging_angles: inputs.messagingAngles
      };

      console.log('🚀 Sending affiliate messaging request:', requestData);
      
      const response = await api.post(ENDPOINTS.AFFILIATE_MESSAGING.GENERATE_INFO, requestData);
      
      console.log('✅ Affiliate messaging API response:', response.data);
      setApiResponse(response.data);
      
      // Save to tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Affiliate Messaging Information',
          toolId: 'affiliate-messaging-information',
          outputResult: response.data,
          prompt: JSON.stringify(requestData)
        });
        console.log('✅ Affiliate messaging information saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
      
    } catch (error: any) {
      console.error('❌ Affiliate messaging API error:', error);
      setError(error?.message || 'Failed to generate messaging information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const messagingTemplates = [
    { name: "Product Launch", icon: "fas fa-rocket", description: "Messaging angles for new product launches and debuts." },
    { name: "Seasonal Campaign", icon: "fas fa-calendar-alt", description: "Seasonal and holiday-focused affiliate messaging." },
    { name: "Problem-Solution Focus", icon: "fas fa-lightbulb", description: "Messaging that highlights customer problems and solutions." },
    { name: "Benefit-Driven", icon: "fas fa-star", description: "Focus on key benefits and transformation outcomes." },
    { name: "Social Proof Heavy", icon: "fas fa-users", description: "Testimonial and social proof focused messaging." },
    { name: "Urgency & Scarcity", icon: "fas fa-clock", description: "Time-sensitive and limited availability messaging." }
  ];

  // Format the API response for clean display (messaging_info array)
  const formatApiResponse = (response: any) => {
    if (response.error) {
      return (
        <div className="text-red-600">
          <i className="fas fa-exclamation-triangle mr-2"></i>
          Error: {response.error}
        </div>
      );
    }
    if (Array.isArray(response.messaging_info)) {
      return (
        <div className="space-y-4">
          {response.messaging_info.map((msg: any, idx: number) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">
                    {idx + 1}
                  </span>
                  <span className="font-medium text-gray-900">Messaging Angle {idx + 1}</span>
                </div>
                <span className="text-xs bg-green-100 px-2 py-1 rounded-full text-green-600">
                  {msg.angle}
                </span>
              </div>
              
              <div className="space-y-3">
                {msg.headline && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Headline</span>
                      <button 
                        onClick={() => navigator.clipboard.writeText(msg.headline)}
                        className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <i className="fas fa-copy"></i>
                      </button>
                    </div>
                    <p className="text-lg font-semibold text-blue-800 bg-blue-50 p-3 rounded-lg">
                      {msg.headline}
                    </p>
                  </div>
                )}
                
                {msg.description && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Description</span>
                      <button 
                        onClick={() => navigator.clipboard.writeText(msg.description)}
                        className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <i className="fas fa-copy"></i>
                      </button>
                    </div>
                    <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg leading-relaxed">
                      {msg.description}
                    </p>
                  </div>
                )}
                
                {msg.call_to_action && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Call to Action</span>
                      <button 
                        onClick={() => navigator.clipboard.writeText(msg.call_to_action)}
                        className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <i className="fas fa-copy"></i>
                      </button>
                    </div>
                    <p className="text-sm font-medium text-green-700 bg-green-50 p-3 rounded-lg">
                      {msg.call_to_action}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    }
    // fallback for other cases
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
          {typeof response === 'string' ? response : JSON.stringify(response, null, 2)}
        </div>
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
              <i className="fas fa-comment text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Affiliate Messaging Information</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Provide affiliates with messaging angles and promotional ideas</p>
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
                {apiResponse && !apiResponse.error && (
                  <button 
                    onClick={() => setActiveTab('result')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${activeTab === 'result' ? 'text-green-700 bg-green-50/70' : 'text-green-500 hover:text-green-600'}`}
                  >
                    <span className="flex items-center gap-2">
                      <i className="fas fa-file-alt text-xs"></i>
                      Generated Information
                    </span>
                    {activeTab === 'result' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 rounded-full"></span>}
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
              {/* Error Display */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Success notification - only show briefly after generation */}
              {apiResponse && !apiResponse.error && activeTab === 'generate' && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <i className="fas fa-check text-green-600 text-sm"></i>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-green-900">Messaging Generated Successfully!</h4>
                        <p className="text-xs text-green-700 mt-1">Your affiliate messaging information is ready to view.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveTab('result')}
                      className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
                    >
                      View Information
                      <i className="fas fa-arrow-right text-xs"></i>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'generate' && (
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                  {/* Product Information */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Product Information</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="productName">Product/Service Name</label>
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
                            <option value="digital-course">Digital Course</option>
                            <option value="software">Software/SaaS</option>
                            <option value="ebook">eBook/Guide</option>
                            <option value="physical-product">Physical Product</option>
                            <option value="coaching">Coaching/Consulting</option>
                            <option value="membership">Membership Site</option>
                            <option value="service">Service</option>
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
                          placeholder="Describe what your product/service does and its main features..."
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
                          placeholder="Who is this product for? Demographics, interests, pain points..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Key Messaging Points */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Key Messaging Points</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="productBenefits">Main Benefits & Outcomes</label>
                        <textarea 
                          id="productBenefits"
                          name="productBenefits"
                          value={inputs.productBenefits}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="What specific benefits and outcomes does your product deliver?"
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
                          placeholder="What makes your product unique compared to competitors?"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="competitiveAdvantages">Competitive Advantages</label>
                        <textarea 
                          id="competitiveAdvantages"
                          name="competitiveAdvantages"
                          value={inputs.competitiveAdvantages}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Why should customers choose your product over alternatives?"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Campaign Details */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Campaign Details</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="commissionStructure">Commission Structure</label>
                          <input
                            id="commissionStructure"
                            name="commissionStructure"
                            type="text"
                            value={inputs.commissionStructure}
                            onChange={handleInputChange}
                            placeholder="e.g., 30% commission, $50 per sale"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="campaignDuration">Campaign Duration</label>
                          <select
                            id="campaignDuration"
                            name="campaignDuration"
                            value={inputs.campaignDuration}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select duration</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="1-week">1 Week</option>
                            <option value="2-weeks">2 Weeks</option>
                            <option value="1-month">1 Month</option>
                            <option value="seasonal">Seasonal</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="promotionalOffers">Promotional Offers & Bonuses</label>
                        <textarea 
                          id="promotionalOffers"
                          name="promotionalOffers"
                          value={inputs.promotionalOffers}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Any special offers, discounts, bonuses, or limited-time deals..."
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="socialProof">Social Proof & Testimonials</label>
                        <textarea 
                          id="socialProof"
                          name="socialProof"
                          value={inputs.socialProof}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Customer reviews, testimonials, case studies, or success stories..."
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="messagingAngles">Suggested Messaging Angles</label>
                        <textarea 
                          id="messagingAngles"
                          name="messagingAngles"
                          value={inputs.messagingAngles}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Different ways affiliates can position and promote your product..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'result' && apiResponse && !apiResponse.error && (
                <div className="space-y-4 max-h-[65vh] overflow-y-auto">
                  {/* Header Section */}
                  <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <i className="fas fa-comment text-green-600 text-lg"></i>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">Affiliate Messaging Information</h4>
                        <p className="text-sm text-gray-600">Ready to share with affiliates</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          const messagingText = Array.isArray(apiResponse.messaging_info) ?
                            apiResponse.messaging_info.map((msg: any) => 
                              `${msg.angle}\n${msg.headline}\n${msg.description}\n${msg.call_to_action}\n`
                            ).join('\n---\n\n') :
                            JSON.stringify(apiResponse, null, 2);
                          navigator.clipboard.writeText(messagingText);
                        }}
                        className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2"
                      >
                        <i className="fas fa-copy text-xs"></i>
                        Copy All
                      </button>
                      <button className="px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-2">
                        <i className="fas fa-download text-xs"></i>
                        Export
                      </button>
                    </div>
                  </div>
                  
                  {/* Messaging Content */}
                  <div className="space-y-3">
                    {formatApiResponse(apiResponse)}
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && (
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {messagingTemplates.map((template, index) => (
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
                  <History toolName="Affiliate Messaging Information" />
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
                  onClick={generateMessaging}
                  disabled={isLoading}
                  className="px-5 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{isLoading ? 'Generating...' : 'Generate Messaging'}</span>
                  <i className={`fas ${isLoading ? 'fa-spinner fa-spin' : 'fa-arrow-right'} text-xs group-hover:translate-x-0.5 transition-transform`}></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
}
