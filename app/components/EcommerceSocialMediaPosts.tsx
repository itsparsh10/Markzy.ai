'use client';

import React, { useState } from 'react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface EcommerceSocialMediaPostsProps {
  onBackClick: () => void;
}

export default function EcommerceSocialMediaPosts({ onBackClick }: EcommerceSocialMediaPostsProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [inputs, setInputs] = useState({
    productName: '',
    productType: '',
    productDescription: '',
    targetAudience: '',
    keyFeatures: '',
    tone: '',
    platform: 'instagram',
    postType: 'product_showcase',
    includeEmojis: false,
    includeHashtags: true,
    specialOffer: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedPosts, setGeneratedPosts] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setInputs(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setInputs(prev => ({ ...prev, [name]: value }));
    }
  };

  const generateEcommercePosts = async () => {
    // Validate required fields
    if (!inputs.productName || !inputs.productType || !inputs.productDescription || !inputs.targetAudience || !inputs.keyFeatures || !inputs.tone) {
      setError('Please fill in all required fields: Product Name, Product Type, Product Description, Target Audience, Key Features, and Content Tone');
      return;
    }

    setIsLoading(true);
    setError('');
    setGeneratedPosts(null);

    try {
      const requestData = {
        product_name: inputs.productName,
        product_type: inputs.productType,
        product_description: inputs.productDescription,
        target_audience: inputs.targetAudience,
        key_features_benefits: inputs.keyFeatures,
        content_tone: inputs.tone,
        platform: inputs.platform.charAt(0).toUpperCase() + inputs.platform.slice(1), // Capitalize first letter
        post_type: inputs.postType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()), // Convert to Title Case
        special_offer: inputs.specialOffer || '',
        include_hashtags: inputs.includeHashtags,
        include_emojis: inputs.includeEmojis
      };

      console.log('🚀 Sending ecommerce posts request:', requestData);
      
      const response = await aiToolsService.generateEcommercePosts(requestData);
      
      console.log('✅ Ecommerce posts API response:', response);
      setGeneratedPosts(response);
      
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Ecommerce Social Media Posts',
          toolId: 'ecommerce-social-media-posts',
          outputResult: response,
          prompt: JSON.stringify(requestData)
        });
        console.log('✅ Ecommerce social media posts saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
      setActiveTab('generate'); // Stay on generate tab to show results
      
    } catch (error: any) {
      console.error('❌ Ecommerce posts API error:', error);
      setError(error?.message || 'Failed to generate ecommerce posts');
    } finally {
      setIsLoading(false);
    }
  };

  const postTemplates = [
    { name: "Product Showcase", icon: "fas fa-shopping-bag", description: "Generate posts highlighting product features and benefits." },
    { name: "Lifestyle Content", icon: "fas fa-camera", description: "Generate lifestyle-focused posts showing products in use." },
    { name: "User-Generated Content", icon: "fas fa-users", description: "Generate posts featuring customer testimonials and reviews." },
    { name: "Promotional Posts", icon: "fas fa-tag", description: "Generate posts for sales, discounts, and special offers." },
    { name: "Behind-the-Scenes", icon: "fas fa-cog", description: "Generate posts showing your brand's story and process." },
    { name: "Educational Content", icon: "fas fa-graduation-cap", description: "Generate informative posts about your products and industry." }
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
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Ecommerce Social Media Posts</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create engaging social media content for your products</p>
            </div>
            <div className="flex items-center gap-3 z-10">
              <span className="text-xs bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/30 flex items-center font-semibold text-white/90">
                <i className="fas fa-clock mr-1"></i> 4 min
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
                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <i className="fas fa-exclamation-triangle text-red-600 mr-2"></i>
                        <span className="text-red-800 text-sm font-medium">{error}</span>
                      </div>
                    </div>
                  )}

                  {/* Generated Posts */}
                  {generatedPosts && (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="text-base font-medium text-green-900 mb-3 flex items-center">
                        <i className="fas fa-check-circle text-green-600 mr-2"></i>
                        Generated Social Media Post
                      </h4>
                      <div className="bg-white rounded-lg border border-green-200 p-4">
                        <div className="prose prose-sm max-w-none">
                          <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">
                            {generatedPosts.post_text}
                          </pre>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button 
                            onClick={() => setGeneratedPosts(null)}
                            className="px-3 py-1.5 text-sm text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition-all"
                          >
                            <i className="fas fa-times mr-1"></i>
                            Clear Results
                          </button>
                          <button 
                            onClick={() => {
                              setInputs({
                                productName: '',
                                productType: '',
                                productDescription: '',
                                targetAudience: '',
                                keyFeatures: '',
                                tone: '',
                                platform: 'instagram',
                                postType: 'product_showcase',
                                includeEmojis: false,
                                includeHashtags: true,
                                specialOffer: ''
                              });
                              setGeneratedPosts(null);
                              setError('');
                            }}
                            className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                          >
                            <i className="fas fa-refresh mr-1"></i>
                            Reset Form
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
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
                            <option value="Clothing">Clothing</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Home & Garden">Home & Garden</option>
                            <option value="Beauty">Beauty</option>
                            <option value="Sports">Sports</option>
                            <option value="Toys">Toys</option>
                            <option value="Books">Books</option>
                            <option value="Other">Other</option>
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
                          placeholder="Describe your product briefly (key features, benefits, target audience)"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Target Audience & Content Details</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="targetAudience">Target Audience</label>
                        <textarea 
                          id="targetAudience"
                          name="targetAudience"
                          value={inputs.targetAudience}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Who is your target audience? Describe their demographics, interests, and behavior..."
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="keyFeatures">Key Features & Benefits</label>
                        <textarea 
                          id="keyFeatures"
                          name="keyFeatures"
                          value={inputs.keyFeatures}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20"
                          placeholder="List key features and benefits to highlight in your posts..."
                        ></textarea>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="tone">Content Tone</label>
                          <select
                            id="tone"
                            name="tone"
                            value={inputs.tone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select content tone</option>
                            <option value="Professional">Professional</option>
                            <option value="Casual">Casual</option>
                            <option value="Humorous">Humorous</option>
                            <option value="Inspirational">Inspirational</option>
                            <option value="Educational">Educational</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="platform">Platform</label>
                          <select
                            id="platform"
                            name="platform"
                            value={inputs.platform}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="instagram">Instagram</option>
                            <option value="facebook">Facebook</option>
                            <option value="twitter">Twitter</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="tiktok">TikTok</option>
                            <option value="pinterest">Pinterest</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Post Settings & Options</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="postType">Post Type</label>
                          <select
                            id="postType"
                            name="postType"
                            value={inputs.postType}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="product_showcase">Product Showcase</option>
                            <option value="lifestyle">Lifestyle Content</option>
                            <option value="promotional">Promotional</option>
                            <option value="educational">Educational</option>
                            <option value="behind_scenes">Behind the Scenes</option>
                            <option value="user_generated">User Generated Content</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="specialOffer">Special Offer (optional)</label>
                          <input
                            id="specialOffer"
                            name="specialOffer"
                            type="text"
                            value={inputs.specialOffer}
                            onChange={handleInputChange}
                            placeholder="e.g., 20% off, Free shipping, BOGO"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <input
                            id="includeEmojis"
                            name="includeEmojis"
                            type="checkbox"
                            checked={inputs.includeEmojis}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="includeEmojis" className="ml-2 block text-xs font-semibold text-blue-900">
                            Include Emojis
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="includeHashtags"
                            name="includeHashtags"
                            type="checkbox"
                            checked={inputs.includeHashtags}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="includeHashtags" className="ml-2 block text-xs font-semibold text-blue-900">
                            Include Hashtags
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && (
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {postTemplates.map((template, index) => (
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
                          onClick={() => {
                            setInputs(prev => ({...prev, postType: template.name.toLowerCase().replace(' ', '_')}));
                            setActiveTab('generate');
                          }}
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
                  <History toolName="Ecommerce Social Media Posts" />
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
                  onClick={() => {
                    setInputs({
                      productName: '',
                      productType: '',
                      productDescription: '',
                      targetAudience: '',
                      keyFeatures: '',
                      tone: '',
                      platform: 'instagram',
                      postType: 'product_showcase',
                      includeEmojis: false,
                      includeHashtags: true,
                      specialOffer: ''
                    });
                    setGeneratedPosts(null);
                    setError('');
                  }}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all shadow-sm hover:shadow"
                >
                  <i className="fas fa-refresh mr-1"></i>
                  Reset
                </button>
                <button className="px-4 py-2 text-sm text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-all shadow-sm hover:shadow">
                  Save Draft
                </button>
                <button 
                  onClick={generateEcommercePosts}
                  disabled={isLoading}
                  className="px-5 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin text-xs"></i>
                      <span>Creating Posts...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Posts</span>
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
