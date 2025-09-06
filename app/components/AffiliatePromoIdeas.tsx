'use client';

import React, { useState } from 'react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface AffiliatePromoIdeasProps {
  onBackClick: () => void;
}

export default function AffiliatePromoIdeas({ onBackClick }: AffiliatePromoIdeasProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'result' | 'templates' | 'history'>('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedIdeas, setGeneratedIdeas] = useState<any>(null);
  
  const [inputs, setInputs] = useState({
    productName: '',
    productType: '',
    productDescription: '',
    targetAudience: '',
    keyBenefits: '',
    uniqueSellingPoints: '',
    promoType: '',
    campaignDuration: '',
    specialOffers: '',
    contentFormats: '',
    affiliateCommission: '',
    brandGuidelines: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateIdeas = async () => {
    // Validate required fields
    const requiredFields = [
      'productName',
      'productType',
      'productDescription',
      'targetAudience',
      'keyBenefits',
      'uniqueSellingPoints',
      'promoType',
      'campaignDuration',
      'specialOffers',
      'contentFormats',
      'affiliateCommission',
      'brandGuidelines'
    ];
    
    const missingFields = requiredFields.filter(field => !inputs[field as keyof typeof inputs]);
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedIdeas(null);

    try {
      // Transform inputs to match API format
      const ideasData = {
        product_name: inputs.productName,
        product_type: inputs.productType,
        product_description: inputs.productDescription,
        target_audience: inputs.targetAudience,
        key_benefits_value_points: inputs.keyBenefits,
        unique_selling_points: inputs.uniqueSellingPoints,
        promotion_type: inputs.promoType,
        campaign_duration: inputs.campaignDuration,
        special_offers_incentives: inputs.specialOffers,
        content_formats: inputs.contentFormats,
        affiliate_commission: inputs.affiliateCommission,
        brand_guidelines_requirements: inputs.brandGuidelines
      };

      const response = await aiToolsService.generateAffiliatePromoIdeas(ideasData);
      setGeneratedIdeas(response);
      setActiveTab('result'); // Switch to result tab after successful generation
      console.log('Generated promo ideas:', response);
      
      // Save to tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Affiliate Promo Ideas',
          toolId: 'affiliate-promo-ideas',
          outputResult: response,
          prompt: JSON.stringify(ideasData)
        });
        console.log('✅ Affiliate promo ideas saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }

    } catch (error: any) {
      console.error('Error generating promo ideas:', error);
      setError(error.message || 'Failed to generate promo ideas. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const promoTemplates = [
    { name: "Blog Post Ideas", icon: "fas fa-blog", description: "Comprehensive blog post strategies for affiliate promotion." },
    { name: "YouTube Ideas", icon: "fas fa-video", description: "Video content ideas for YouTube affiliate marketing." },
    { name: "Podcast Ideas", icon: "fas fa-podcast", description: "Podcast episode concepts and affiliate integration." },
    { name: "Virtual Event Ideas", icon: "fas fa-calendar-alt", description: "Webinar and virtual event promotional strategies." },
    { name: "Social Media Campaign", icon: "fas fa-hashtag", description: "Multi-platform social media promotional campaigns." },
    { name: "Email Marketing Ideas", icon: "fas fa-envelope", description: "Email sequence and newsletter promotional concepts." }
  ];

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Glassmorphic Header with blue gradient */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-lightbulb text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Affiliate Promo Ideas</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create engaging content ideas for affiliate promotions</p>
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
                {generatedIdeas && !error && (
                  <button 
                    onClick={() => setActiveTab('result')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${activeTab === 'result' ? 'text-blue-700 bg-blue-50/70' : 'text-blue-500 hover:text-blue-600'}`}
                  >
                    <span className="flex items-center gap-2">
                      <i className="fas fa-lightbulb text-xs"></i>
                      Generated Ideas
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
                  {generatedIdeas && !error && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <i className="fas fa-check text-green-600 text-sm"></i>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-green-900">Ideas Generated Successfully!</h4>
                            <p className="text-xs text-green-700 mt-1">Your affiliate promo ideas are ready to view.</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setActiveTab('result')}
                          className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
                        >
                          View Ideas
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
                    <h4 className="text-base font-medium text-blue-900 mb-3">Product & Campaign Information</h4>
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
                            <option value="software">Software/SaaS</option>
                            <option value="course">Course/Training</option>
                            <option value="membership">Membership</option>
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
                          placeholder="Describe your product and its key benefits..."
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

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Promotional Strategy</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="keyBenefits">Key Benefits & Value Points</label>
                        <textarea 
                          id="keyBenefits"
                          name="keyBenefits"
                          value={inputs.keyBenefits}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="List the main benefits and value propositions (one per line)..."
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
                          placeholder="What makes this product unique compared to competitors..."
                        ></textarea>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="promoType">Promotion Type</label>
                          <select
                            id="promoType"
                            name="promoType"
                            value={inputs.promoType}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select promotion type</option>
                            <option value="launch">Product Launch</option>
                            <option value="seasonal">Seasonal Campaign</option>
                            <option value="limited-time">Limited Time Offer</option>
                            <option value="ongoing">Ongoing Promotion</option>
                            <option value="bundle">Bundle/Package Deal</option>
                          </select>
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
                            <option value="1-week">1 Week</option>
                            <option value="2-weeks">2 Weeks</option>
                            <option value="1-month">1 Month</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="seasonal">Seasonal</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Campaign Details & Guidelines</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="specialOffers">Special Offers & Incentives</label>
                        <textarea 
                          id="specialOffers"
                          name="specialOffers"
                          value={inputs.specialOffers}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Discounts, bonuses, limited-time offers, or special incentives..."
                        ></textarea>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="contentFormats">Content Formats</label>
                          <textarea 
                            id="contentFormats"
                            name="contentFormats"
                            value={inputs.contentFormats}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                            placeholder="Blog posts, videos, social media, email, webinars, etc..."
                          ></textarea>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="affiliateCommission">Affiliate Commission</label>
                          <input
                            id="affiliateCommission"
                            name="affiliateCommission"
                            type="text"
                            value={inputs.affiliateCommission}
                            onChange={handleInputChange}
                            placeholder="e.g., 30% commission or $50 per sale"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="brandGuidelines">Brand Guidelines & Requirements</label>
                        <textarea 
                          id="brandGuidelines"
                          name="brandGuidelines"
                          value={inputs.brandGuidelines}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Any specific brand guidelines, messaging requirements, or restrictions..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'result' && generatedIdeas && !error && (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="text-base font-medium text-green-900 mb-3 flex items-center gap-2">
                      <i className="fas fa-check-circle text-green-600"></i>
                      Generated Promo Ideas ({generatedIdeas.promo_ideas.length} ideas)
                    </h4>
                    
                    <div className="space-y-4">
                      {generatedIdeas.promo_ideas.map((idea: any, index: number) => (
                        <div key={index} className="bg-white p-4 rounded border border-green-200">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="text-sm font-semibold text-green-900">Idea #{index + 1}</h5>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                              {idea.content_formats.join(', ')}
                            </span>
                          </div>
                          
                          <div className="space-y-3 text-sm text-green-800">
                            <div>
                              <strong>Headline:</strong>
                              <p className="mt-1 font-medium">{idea.headline}</p>
                            </div>
                            
                            <div>
                              <strong>Description:</strong>
                              <p className="mt-1 whitespace-pre-wrap">{idea.description}</p>
                            </div>
                            
                            <div>
                              <strong>Content Formats:</strong>
                              <div className="mt-1 flex flex-wrap gap-1">
                                {idea.content_formats.map((format: string, formatIndex: number) => (
                                  <span key={formatIndex} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                    {format}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <strong>Call to Action:</strong>
                              <p className="mt-1 font-medium text-green-700">{idea.call_to_action}</p>
                            </div>
                          </div>
                          
                          <div className="mt-3 flex gap-2">
                            <button className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded hover:bg-green-200 transition-all">
                              <i className="fas fa-copy mr-1"></i>Copy Idea
                            </button>
                            <button className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded hover:bg-blue-200 transition-all">
                              <i className="fas fa-edit mr-1"></i>Edit
                            </button>
                            <button className="px-2 py-1 text-xs text-purple-700 bg-purple-100 rounded hover:bg-purple-200 transition-all">
                              <i className="fas fa-expand mr-1"></i>Expand
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <button className="px-3 py-1.5 text-xs text-green-700 bg-green-100 rounded hover:bg-green-200 transition-all">
                        <i className="fas fa-copy mr-1"></i>Copy All Ideas
                      </button>
                      <button className="px-3 py-1.5 text-xs text-blue-700 bg-blue-100 rounded hover:bg-blue-200 transition-all">
                        <i className="fas fa-download mr-1"></i>Export
                      </button>
                      <button className="px-3 py-1.5 text-xs text-purple-700 bg-purple-100 rounded hover:bg-purple-200 transition-all">
                        <i className="fas fa-calendar mr-1"></i>Schedule
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && (
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {promoTemplates.map((template, index) => (
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
                          setInputs(prev => ({...prev, contentFormats: template.name}));
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
                  <History toolName="Affiliate Promo Ideas" />
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
                  onClick={handleGenerateIdeas}
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
                      <span>Generate Ideas</span>
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
