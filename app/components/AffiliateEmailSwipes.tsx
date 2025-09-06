'use client';

import React, { useState } from 'react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';
interface AffiliateEmailSwipesProps {
  onBackClick: () => void;
}

interface HistoryItem {
  _id: string;
  toolName: string;
  toolId: string;
  outputResult: any;
  prompt?: string;
  generatedDate: string;
  userId: string;
}

export default function AffiliateEmailSwipes({ onBackClick }: AffiliateEmailSwipesProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history' | 'result'>('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedSwipe, setGeneratedSwipe] = useState<any>(null);
  
  const [inputs, setInputs] = useState({
    productName: '',
    productDescription: '',
    targetAudience: '',
    keyBenefits: '',
    uniqueSellingPoints: '',
    affiliateLink: '',
    callToAction: '',
    emailType: '',
    brandName: '',
    tone: 'professional'
  });

  // Real-time validation state
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});

  const validateField = (fieldName: string, value: string) => {
    const requiredFields = [
      'productName',
      'brandName', 
      'productDescription',
      'targetAudience',
      'keyBenefits',
      'uniqueSellingPoints',
      'emailType',
      'affiliateLink',
      'callToAction'
    ];

    if (requiredFields.includes(fieldName) && !value.trim()) {
      setFieldErrors(prev => ({
        ...prev,
        [fieldName]: 'This field is required'
      }));
    } else if (fieldName === 'affiliateLink' && value && !value.match(/^https?:\/\/.+/)) {
      setFieldErrors(prev => ({
        ...prev,
        [fieldName]: 'Please enter a valid URL starting with http:// or https://'
      }));
    } else {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
    
    // Validate field in real-time
    validateField(name, value);
    
    // Clear main error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const handleGenerateSwipe = async () => {
    // Validate required fields
    const requiredFields = [
      'productName',
      'brandName', 
      'productDescription',
      'targetAudience',
      'keyBenefits',
      'uniqueSellingPoints',
      'emailType',
      'affiliateLink',
      'callToAction'
    ];
    
    const missingFields = requiredFields.filter(field => !inputs[field as keyof typeof inputs]);
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedSwipe(null);

    try {
      // Transform inputs to match API format
      const swipeData = {
        product_name: inputs.productName,
        brand_name: inputs.brandName,
        product_description: inputs.productDescription,
        target_audience: inputs.targetAudience,
        key_benefits: inputs.keyBenefits,
        unique_selling_points: inputs.uniqueSellingPoints,
        email_type: inputs.emailType,
        affiliate_link: inputs.affiliateLink,
        tone_of_voice: inputs.tone,
        call_to_action: inputs.callToAction
      };

      const response = await aiToolsService.generateAffiliateEmailSwipe(swipeData);
      setGeneratedSwipe(response);
      setActiveTab('result');
      console.log('Generated swipe:', response);
      
      // Save to tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Affiliate Email Swipes',
          toolId: 'affiliate-email-swipes',
          outputResult: response,
          prompt: JSON.stringify(swipeData)
        });
        console.log('✅ Affiliate email swipe saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }

    } catch (error: any) {
      console.error('Error generating swipe:', error);
      setError(error.message || 'Failed to generate email swipe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const emailTemplates = [
    { name: "Announcement Email", icon: "fas fa-bullhorn", description: "Introduce the product to your affiliate's audience with excitement." },
    { name: "Product Benefits Email", icon: "fas fa-star", description: "Focus on the key benefits and value proposition of the product." },
    { name: "Product Features Email", icon: "fas fa-list", description: "Highlight specific features and functionalities of the product." },
    { name: "Last Chance Email", icon: "fas fa-clock", description: "Create urgency with limited-time offers and scarcity messaging." },
    { name: "Social Proof Email", icon: "fas fa-users", description: "Use testimonials and reviews to build trust and credibility." },
    { name: "Problem-Solution Email", icon: "fas fa-lightbulb", description: "Address pain points and position your product as the solution." }
  ];

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Glassmorphic Header with blue gradient */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-envelope text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Affiliate Email Swipes</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create compelling email templates for your affiliate partners</p>
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
                {generatedSwipe && (
                  <button 
                    onClick={() => setActiveTab('result')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${activeTab === 'result' ? 'text-blue-700 bg-blue-50/70' : 'text-blue-500 hover:text-blue-600'}`}
                  >
                    <span className="flex items-center gap-2">
                      <i className="fas fa-check-circle text-xs"></i>
                      Generated Swipe
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
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Success notification - only show briefly after generation */}
              {generatedSwipe && activeTab === 'generate' && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <i className="fas fa-check text-green-600 text-sm"></i>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-green-900">Email Swipe Generated Successfully!</h4>
                        <p className="text-xs text-green-700 mt-1">Your affiliate email swipe is ready to view.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveTab('result')}
                      className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
                    >
                      View Swipe
                      <i className="fas fa-arrow-right text-xs"></i>
                    </button>
                  </div>
                </div>
              )}
              
              {activeTab === 'generate' && (
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Product Information</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="productName">Product Name *</label>
                          <input
                            id="productName"
                            name="productName"
                            type="text"
                            value={inputs.productName}
                            onChange={handleInputChange}
                            placeholder="Enter the product name"
                            className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-100 bg-white transition-all ${
                              fieldErrors.productName 
                                ? 'border-red-300 focus:border-red-400' 
                                : 'border-blue-200 focus:border-blue-400'
                            }`}
                          />
                          {fieldErrors.productName && (
                            <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                              <i className="fas fa-exclamation-triangle"></i>
                              {fieldErrors.productName}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="brandName">Brand Name *</label>
                          <input
                            id="brandName"
                            name="brandName"
                            type="text"
                            value={inputs.brandName}
                            onChange={handleInputChange}
                            placeholder="Enter the brand name"
                            className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-100 bg-white transition-all ${
                              fieldErrors.brandName 
                                ? 'border-red-300 focus:border-red-400' 
                                : 'border-blue-200 focus:border-blue-400'
                            }`}
                          />
                          {fieldErrors.brandName && (
                            <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                              <i className="fas fa-exclamation-triangle"></i>
                              {fieldErrors.brandName}
                            </p>
                          )}
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
                          placeholder="Describe what the product does and its main purpose..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Audience & Messaging</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="targetAudience">Target Audience</label>
                        <textarea 
                          id="targetAudience"
                          name="targetAudience"
                          value={inputs.targetAudience}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Describe who this product is for and their characteristics..."
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="keyBenefits">Key Benefits</label>
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
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Email Settings</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="emailType">Email Type</label>
                          <select
                            id="emailType"
                            name="emailType"
                            value={inputs.emailType}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select email type</option>
                            <option value="announcement">Announcement Email</option>
                            <option value="benefits">Product Benefits Email</option>
                            <option value="features">Product Features Email</option>
                            <option value="urgency">Last Chance Email</option>
                            <option value="social-proof">Social Proof Email</option>
                            <option value="problem-solution">Problem-Solution Email</option>
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
                            <option value="enthusiastic">Enthusiastic</option>
                            <option value="casual">Casual</option>
                            <option value="urgent">Urgent</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="affiliateLink">Affiliate Link</label>
                          <input
                            id="affiliateLink"
                            name="affiliateLink"
                            type="url"
                            value={inputs.affiliateLink}
                            onChange={handleInputChange}
                            placeholder="https://youraffiliatelink.com"
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
                            placeholder="e.g., Get Started Today, Learn More"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'result' && generatedSwipe && (
                <div className="space-y-4 max-h-[65vh] overflow-y-auto">
                  {/* Header Section */}
                  <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <i className="fas fa-envelope text-blue-600 text-lg"></i>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">Affiliate Email Swipe</h4>
                        <p className="text-sm text-gray-600">Ready to use</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          const swipeData = JSON.parse(generatedSwipe.swipe);
                          const fullText = `Subject: ${swipeData.subject}\n\nPreview: ${swipeData.preview_text}\n\nBody:\n${swipeData.body}\n\nCall to Action: ${swipeData.call_to_action}`;
                          navigator.clipboard.writeText(fullText);
                        }}
                        className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2"
                      >
                        <i className="fas fa-copy"></i>
                        Copy All
                      </button>
                      <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2">
                        <i className="fas fa-download"></i>
                        Export
                      </button>
                    </div>
                  </div>

                  {/* Email Content */}
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <i className="fas fa-subject text-gray-600"></i>
                          <span className="text-sm font-semibold text-gray-700">Subject Line</span>
                        </div>
                        <button 
                          onClick={() => navigator.clipboard.writeText(JSON.parse(generatedSwipe.swipe).subject)}
                          className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          <i className="fas fa-copy"></i>
                        </button>
                      </div>
                      <p className="text-sm text-gray-800 font-medium bg-gray-50 p-3 rounded-lg">
                        {JSON.parse(generatedSwipe.swipe).subject}
                      </p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <i className="fas fa-eye text-gray-600"></i>
                          <span className="text-sm font-semibold text-gray-700">Preview Text</span>
                        </div>
                        <button 
                          onClick={() => navigator.clipboard.writeText(JSON.parse(generatedSwipe.swipe).preview_text)}
                          className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          <i className="fas fa-copy"></i>
                        </button>
                      </div>
                      <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg">
                        {JSON.parse(generatedSwipe.swipe).preview_text}
                      </p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <i className="fas fa-align-left text-gray-600"></i>
                          <span className="text-sm font-semibold text-gray-700">Email Body</span>
                        </div>
                        <button 
                          onClick={() => navigator.clipboard.writeText(JSON.parse(generatedSwipe.swipe).body)}
                          className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          <i className="fas fa-copy"></i>
                        </button>
                      </div>
                      <div className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                        {JSON.parse(generatedSwipe.swipe).body}
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <i className="fas fa-mouse-pointer text-gray-600"></i>
                          <span className="text-sm font-semibold text-gray-700">Call to Action</span>
                        </div>
                        <button 
                          onClick={() => navigator.clipboard.writeText(JSON.parse(generatedSwipe.swipe).call_to_action)}
                          className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          <i className="fas fa-copy"></i>
                        </button>
                      </div>
                      <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg font-medium">
                        {JSON.parse(generatedSwipe.swipe).call_to_action}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && (
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {emailTemplates.map((template, index) => (
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
                          setInputs(prev => ({...prev, emailType: template.name.toLowerCase().replace(' email', '')}));
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
                  <History toolName="Affiliate Email Swipes" />
                </div>
              )}
              
              {/* Error Display */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 text-red-800">
                    <i className="fas fa-exclamation-triangle text-red-600"></i>
                    <span className="text-sm font-medium">Error: {error}</span>
                  </div>
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
                  onClick={handleGenerateSwipe}
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
                      <span>Generate Email</span>
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
