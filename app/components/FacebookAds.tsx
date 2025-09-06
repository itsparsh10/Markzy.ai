'use client';

import React, { useState } from 'react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface FacebookAdsProps {
  onBackClick: () => void;
}

export default function FacebookAds({ onBackClick }: FacebookAdsProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);
  const [inputs, setInputs] = useState({
    campaignObjective: '',
    targetAudience: '',
    productService: '',
    keyBenefits: '',
    callToAction: '',
    adFormat: '',
    specialOffer: '',
    adBudget: '',
    adPlacement: '',
    tone: 'professional'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      // Validate required fields
      const requiredFields = [
        'campaignObjective',
        'adFormat', 
        'targetAudience',
        'productService',
        'keyBenefits',
        'callToAction'
      ];
      
      const missingFields = requiredFields.filter(field => !inputs[field as keyof typeof inputs]);
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      // Map form inputs to API fields with proper value mapping
      const apiData = {
        campaign_objective: inputs.campaignObjective === 'awareness' ? 'Brand Awareness' :
                          inputs.campaignObjective === 'traffic' ? 'Traffic' :
                          inputs.campaignObjective === 'engagement' ? 'Engagement' :
                          inputs.campaignObjective === 'leads' ? 'Lead Generation' :
                          inputs.campaignObjective === 'conversions' ? 'Conversions' :
                          inputs.campaignObjective === 'catalog-sales' ? 'Catalog Sales' :
                          inputs.campaignObjective,
        ad_format: inputs.adFormat === 'single-image' ? 'Single Image' :
                  inputs.adFormat === 'carousel' ? 'Carousel' :
                  inputs.adFormat === 'video' ? 'Video' :
                  inputs.adFormat === 'slideshow' ? 'Slideshow' :
                  inputs.adFormat === 'collection' ? 'Collection' :
                  inputs.adFormat,
        target_audience: inputs.targetAudience,
        product_service: inputs.productService,
        key_benefits_value_proposition: inputs.keyBenefits,
        special_offer: inputs.specialOffer || '',
        call_to_action: inputs.callToAction === 'learn-more' ? 'Learn More' :
                       inputs.callToAction === 'shop-now' ? 'Shop Now' :
                       inputs.callToAction === 'sign-up' ? 'Sign Up' :
                       inputs.callToAction === 'get-quote' ? 'Get Quote' :
                       inputs.callToAction === 'download' ? 'Download' :
                       inputs.callToAction === 'book-now' ? 'Book Now' :
                       inputs.callToAction,
        daily_budget_range: inputs.adBudget ? `$${inputs.adBudget}/day` : '',
        tone_of_voice: inputs.tone === 'professional' ? 'Professional' :
                      inputs.tone === 'friendly' ? 'Friendly' :
                      inputs.tone === 'urgent' ? 'Urgent' :
                      inputs.tone === 'inspiring' ? 'Inspiring' :
                      inputs.tone === 'casual' ? 'Casual' :
                      inputs.tone,
        ad_placement: inputs.adPlacement === 'automatic' ? 'Automatic Placements' :
                     inputs.adPlacement === 'facebook-feed' ? 'Facebook Feed' :
                     inputs.adPlacement === 'instagram-feed' ? 'Instagram Feed' :
                     inputs.adPlacement === 'stories' ? 'Stories' :
                     inputs.adPlacement === 'messenger' ? 'Messenger' :
                     inputs.adPlacement || 'Facebook Feed, Instagram Stories'
      };

      console.log('Sending API data:', apiData);
      const response = await aiToolsService.generateFacebookAds(apiData);
      setResult(response);
      
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Facebook Ads',
          toolId: 'facebook-ads',
          outputResult: response,
          prompt: JSON.stringify(apiData)
        });
        console.log('✅ Facebook ads saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
    } catch (err: any) {
      console.error('Error generating Facebook ads:', err);
      setError(err.message || 'Failed to generate Facebook ads. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const adTemplates = [
    { name: "Lead Generation Ad", icon: "fas fa-user-plus", description: "Generate leads with compelling offers and clear value propositions." },
    { name: "Conversion Ad", icon: "fas fa-shopping-cart", description: "Drive sales and conversions with persuasive product-focused ads." },
    { name: "Brand Awareness Ad", icon: "fas fa-bullhorn", description: "Increase brand visibility and reach new audiences effectively." },
    { name: "Traffic Ad", icon: "fas fa-mouse-pointer", description: "Drive quality traffic to your website or landing pages." },
    { name: "Engagement Ad", icon: "fas fa-heart", description: "Boost engagement and build community around your brand." },
    { name: "Video Ad", icon: "fas fa-play-circle", description: "Create compelling video ad scripts and concepts." }
  ];

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Glassmorphic Header with blue gradient */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fab fa-facebook-f text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Facebook Ads</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create high-converting Facebook ad copy and campaigns</p>
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
                  {/* Error Display */}
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 text-red-700">
                        <i className="fas fa-exclamation-circle text-sm"></i>
                        <span className="text-sm font-medium">{error}</span>
                      </div>
                    </div>
                  )}

                  {/* Results Display */}
                  {result && (
                    <div className="space-y-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-green-900 flex items-center gap-2">
                          <i className="fas fa-check-circle text-green-600"></i>
                          Generated Facebook Ad
                        </h4>
                        <button
                          onClick={() => {
                            const fullContent = `Headline: ${result.headline}\n\nPrimary Text: ${result.primary_text}\n\nDescription: ${result.description}\n\nCall to Action: ${result.call_to_action}\n\nSpecial Offer: ${result.special_offer}\n\nAd Variations:\n${result.ad_variations?.map((variation: string, index: number) => `${index + 1}. ${variation}`).join('\n') || ''}`;
                            copyToClipboard(fullContent);
                          }}
                          className="px-3 py-1.5 text-sm text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition-all flex items-center gap-1"
                        >
                          <i className="fas fa-copy text-xs"></i>
                          Copy All
                        </button>
                      </div>

                      <div className="space-y-4">
                        {/* Headline */}
                        <div className="p-3 bg-white rounded-lg border border-green-200">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-green-900 flex items-center gap-2">
                              <i className="fas fa-heading text-green-600 text-sm"></i>
                              Headline
                            </h5>
                            <button
                              onClick={() => copyToClipboard(result.headline)}
                              className="text-xs text-green-600 hover:text-green-800"
                            >
                              <i className="fas fa-copy"></i>
                            </button>
                          </div>
                          <p className="text-green-800 font-medium">{result.headline}</p>
                        </div>

                        {/* Primary Text */}
                        <div className="p-3 bg-white rounded-lg border border-green-200">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-green-900 flex items-center gap-2">
                              <i className="fas fa-align-left text-green-600 text-sm"></i>
                              Primary Text
                            </h5>
                            <button
                              onClick={() => copyToClipboard(result.primary_text)}
                              className="text-xs text-green-600 hover:text-green-800"
                            >
                              <i className="fas fa-copy"></i>
                            </button>
                          </div>
                          <p className="text-green-800">{result.primary_text}</p>
                        </div>

                        {/* Description */}
                        <div className="p-3 bg-white rounded-lg border border-green-200">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-green-900 flex items-center gap-2">
                              <i className="fas fa-info-circle text-green-600 text-sm"></i>
                              Description
                            </h5>
                            <button
                              onClick={() => copyToClipboard(result.description)}
                              className="text-xs text-green-600 hover:text-green-800"
                            >
                              <i className="fas fa-copy"></i>
                            </button>
                          </div>
                          <p className="text-green-800">{result.description}</p>
                        </div>

                        {/* Call to Action */}
                        <div className="p-3 bg-white rounded-lg border border-green-200">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-green-900 flex items-center gap-2">
                              <i className="fas fa-bullhorn text-green-600 text-sm"></i>
                              Call to Action
                            </h5>
                            <button
                              onClick={() => copyToClipboard(result.call_to_action)}
                              className="text-xs text-green-600 hover:text-green-800"
                            >
                              <i className="fas fa-copy"></i>
                            </button>
                          </div>
                          <p className="text-green-800 font-medium">{result.call_to_action}</p>
                        </div>

                        {/* Special Offer */}
                        {result.special_offer && (
                          <div className="p-3 bg-white rounded-lg border border-green-200">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-semibold text-green-900 flex items-center gap-2">
                                <i className="fas fa-gift text-green-600 text-sm"></i>
                                Special Offer
                              </h5>
                              <button
                                onClick={() => copyToClipboard(result.special_offer)}
                                className="text-xs text-green-600 hover:text-green-800"
                              >
                                <i className="fas fa-copy"></i>
                              </button>
                            </div>
                            <p className="text-green-800">{result.special_offer}</p>
                          </div>
                        )}

                        {/* Ad Variations */}
                        {result.ad_variations && result.ad_variations.length > 0 && (
                          <div className="p-3 bg-white rounded-lg border border-green-200">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-semibold text-green-900 flex items-center gap-2">
                                <i className="fas fa-list text-green-600 text-sm"></i>
                                Ad Variations
                              </h5>
                              <button
                                onClick={() => copyToClipboard(result.ad_variations.join('\n\n'))}
                                className="text-xs text-green-600 hover:text-green-800"
                              >
                                <i className="fas fa-copy"></i>
                              </button>
                            </div>
                            <div className="space-y-2">
                              {result.ad_variations.map((variation: string, index: number) => (
                                <div key={index} className="p-2 bg-green-50 rounded border-l-4 border-green-300">
                                  <p className="text-green-800 text-sm">
                                    <span className="font-medium">Variation {index + 1}:</span> {variation}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Campaign Setup</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="campaignObjective">Campaign Objective</label>
                          <select
                            id="campaignObjective"
                            name="campaignObjective"
                            value={inputs.campaignObjective}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Choose your objective</option>
                            <option value="awareness">Brand Awareness</option>
                            <option value="traffic">Traffic</option>
                            <option value="engagement">Engagement</option>
                            <option value="leads">Lead Generation</option>
                            <option value="conversions">Conversions</option>
                            <option value="catalog-sales">Catalog Sales</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="adFormat">Ad Format</label>
                          <select
                            id="adFormat"
                            name="adFormat"
                            value={inputs.adFormat}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Choose format</option>
                            <option value="single-image">Single Image</option>
                            <option value="carousel">Carousel</option>
                            <option value="video">Video</option>
                            <option value="slideshow">Slideshow</option>
                            <option value="collection">Collection</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="targetAudience">Target Audience</label>
                        <textarea 
                          id="targetAudience"
                          name="targetAudience"
                          value={inputs.targetAudience}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Describe your target audience (demographics, interests, behaviors)..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Product & Messaging</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="productService">Product/Service</label>
                        <input 
                          id="productService"
                          name="productService"
                          type="text"
                          value={inputs.productService}
                          onChange={handleInputChange}
                          placeholder="What are you promoting?"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="keyBenefits">Key Benefits & Value Proposition</label>
                        <textarea 
                          id="keyBenefits"
                          name="keyBenefits"
                          value={inputs.keyBenefits}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="List the main benefits and unique value propositions..."
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="specialOffer">Special Offer (Optional)</label>
                        <input 
                          id="specialOffer"
                          name="specialOffer"
                          type="text"
                          value={inputs.specialOffer}
                          onChange={handleInputChange}
                          placeholder="e.g., 20% off, Free shipping, Limited time offer"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Ad Settings & Optimization</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="callToAction">Call to Action</label>
                          <select
                            id="callToAction"
                            name="callToAction"
                            value={inputs.callToAction}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Choose CTA</option>
                            <option value="learn-more">Learn More</option>
                            <option value="shop-now">Shop Now</option>
                            <option value="sign-up">Sign Up</option>
                            <option value="get-quote">Get Quote</option>
                            <option value="download">Download</option>
                            <option value="book-now">Book Now</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="tone">Tone of Voice</label>
                          <select
                            id="tone"
                            name="tone"
                            value={inputs.tone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="professional">Professional</option>
                            <option value="friendly">Friendly</option>
                            <option value="urgent">Urgent</option>
                            <option value="inspiring">Inspiring</option>
                            <option value="casual">Casual</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="adBudget">Daily Budget Range</label>
                          <select
                            id="adBudget"
                            name="adBudget"
                            value={inputs.adBudget}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select budget range</option>
                            <option value="10-25">$10 - $25</option>
                            <option value="25-50">$25 - $50</option>
                            <option value="50-100">$50 - $100</option>
                            <option value="100-250">$100 - $250</option>
                            <option value="250+">$250+</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="adPlacement">Ad Placement</label>
                          <select
                            id="adPlacement"
                            name="adPlacement"
                            value={inputs.adPlacement}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select placement</option>
                            <option value="automatic">Automatic Placements</option>
                            <option value="facebook-feed">Facebook Feed</option>
                            <option value="instagram-feed">Instagram Feed</option>
                            <option value="stories">Stories</option>
                            <option value="messenger">Messenger</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && (
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {adTemplates.map((template, index) => (
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
                  <History toolName="Facebook Ads" />
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
                  className="px-5 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin text-xs"></i>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Ad</span>
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
