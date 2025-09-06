'use client';

import React, { useState } from 'react';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

export default function CarouselIdeasForProducts({ onBackClick }: { onBackClick: () => void }) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [inputs, setInputs] = useState({
    productName: '',
    productDescription: '',
    targetAudience: '',
    carouselGoal: '',
    contentStyle: '',
    callToAction: '',
    brandVoice: '',
    visualStyle: '',
    slideCount: '5'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateCarousel = async () => {
    // Validate required fields
    const requiredFields = [
      'productName',
      'productDescription',
      'targetAudience',
      'carouselGoal',
      'contentStyle',
      'callToAction',
      'brandVoice',
      'visualStyle'
    ];
    
    const missingFields = requiredFields.filter(field => !inputs[field as keyof typeof inputs]);
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsGenerating(true);
    
    try {
      // Dynamic import for ES modules
      const { aiToolsService } = await import('../../services/aiTools.js');
      
      // Map UI values to API format
      const requestData = {
        product_name: inputs.productName,
        product_description: inputs.productDescription,
        target_audience: inputs.targetAudience,
        carousel_goal: inputs.carouselGoal,
        content_style: inputs.contentStyle,
        call_to_action: inputs.callToAction,
        brand_voice: inputs.brandVoice,
        visual_style: inputs.visualStyle,
        number_of_slides: parseInt(inputs.slideCount)
      };

      console.log('Sending carousel ideas for products request:', requestData);
      const response = await aiToolsService.generateCarouselIdeas(requestData);
      console.log('Carousel ideas for products response:', response);
      setGeneratedContent(response);
      
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Carousel Ideas for Products',
          toolId: 'carousel-ideas-for-products',
          outputResult: response,
          prompt: JSON.stringify(requestData)
        });
        console.log('✅ Carousel ideas for products saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
      
    } catch (error: any) {
      console.error('Error generating carousel ideas for products:', error);
      alert('Failed to generate carousel ideas. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full h-full max-h-[calc(100vh-100px)] bg-white overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Glassmorphic Header */}
        <div className="flex items-center px-6 py-4 text-white bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 relative">
          <div className="absolute inset-0 bg-blue-600 opacity-10 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>
          <div className="mr-4 p-3 rounded-full bg-white/20 backdrop-blur-md shadow-inner border border-white/30 z-10">
            <i className="fas fa-box-open text-white text-xl"></i>
          </div>
          <div className="flex-1 z-10">
            <h3 className="text-xl font-semibold tracking-tight">Carousel Ideas for Your Products</h3>
            <p className="text-sm text-blue-50 line-clamp-1 mt-0.5">Create engaging carousel content specifically for your products</p>
          </div>
          <div className="flex items-center gap-3 z-10">
            <span className="text-xs bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/30 flex items-center">
              <i className="fas fa-clock mr-2"></i> 5 min
            </span>
            <button 
              className="p-2 hover:bg-white/30 rounded-full transition-all duration-200 hover:scale-105" 
              aria-label="Close"
              onClick={onBackClick}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
        
        {/* Modern Tab Navigation */}
        <div className="flex justify-between items-center px-6 py-2 border-b border-blue-100 bg-white sticky top-0 z-20 shadow-sm">
          <div className="flex space-x-1 relative">
            <button 
              onClick={() => setActiveTab('generate')}
              className={`px-4 py-2 text-base font-medium rounded-t-lg transition-all duration-200 relative ${activeTab === 'generate' ? 'text-blue-700 bg-blue-50/70' : 'text-blue-500 hover:text-blue-600'}`}
            >
              <span className="flex items-center gap-2">
                <i className="fas fa-magic"></i>
                Generate
              </span>
              {activeTab === 'generate' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>}
            </button>
            <button 
              onClick={() => setActiveTab('templates')}
              className={`px-4 py-2 text-base font-medium rounded-t-lg transition-all duration-200 relative ${activeTab === 'templates' ? 'text-blue-700 bg-blue-50/70' : 'text-blue-500 hover:text-blue-600'}`}
            >
              <span className="flex items-center gap-2">
                <i className="fas fa-layer-group"></i>
                Templates
              </span>
              {activeTab === 'templates' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>}
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 text-base font-medium rounded-t-lg transition-all duration-200 relative ${activeTab === 'history' ? 'text-blue-700 bg-blue-50/70' : 'text-blue-500 hover:text-blue-600'}`}
            >
              <span className="flex items-center gap-2">
                <i className="fas fa-history"></i>
                History
              </span>
              {activeTab === 'history' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>}
            </button>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-blue-50/50 to-white p-4">
          <div className="max-w-4xl mx-auto">
            {activeTab === 'generate' && (
              <div className="space-y-6 mt-2">
                {/* Product Information */}
                <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Product Information</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-blue-800 mb-2">Product Name</label>
                        <input
                          name="productName"
                          value={inputs.productName}
                          onChange={handleInputChange}
                          className="w-full p-3 bg-white border border-blue-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-base"
                          placeholder="Enter product name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-800 mb-2">Number of Slides</label>
                        <select
                          name="slideCount"
                          value={inputs.slideCount}
                          onChange={handleInputChange}
                          className="w-full p-3 bg-white border border-blue-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-base"
                        >
                          <option value="3">3 slides</option>
                          <option value="5">5 slides</option>
                          <option value="7">7 slides</option>
                          <option value="10">10 slides</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-2">Product Description</label>
                      <textarea
                        name="productDescription"
                        value={inputs.productDescription}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-white border border-blue-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-base h-20"
                        placeholder="Describe your product features and benefits"
                      />
                    </div>
                  </div>
                </div>

                {/* Content Strategy */}
                <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Content Strategy</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-2">Target Audience</label>
                      <textarea
                        name="targetAudience"
                        value={inputs.targetAudience}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-white border border-blue-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-base h-16"
                        placeholder="Who is your target audience?"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-blue-800 mb-2">Carousel Goal</label>
                        <select
                          name="carouselGoal"
                          value={inputs.carouselGoal}
                          onChange={handleInputChange}
                          className="w-full p-3 bg-white border border-blue-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-base"
                        >
                          <option value="">Select goal</option>
                          <option value="educate">Educate</option>
                          <option value="promote">Promote</option>
                          <option value="engage">Engage</option>
                          <option value="inspire">Inspire</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-800 mb-2">Content Style</label>
                        <select
                          name="contentStyle"
                          value={inputs.contentStyle}
                          onChange={handleInputChange}
                          className="w-full p-3 bg-white border border-blue-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-base"
                        >
                          <option value="">Select style</option>
                          <option value="professional">Professional</option>
                          <option value="casual">Casual</option>
                          <option value="fun">Fun & Playful</option>
                          <option value="inspirational">Inspirational</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Brand & Design */}
                <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Brand & Design</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-blue-800 mb-2">Brand Voice</label>
                        <select
                          name="brandVoice"
                          value={inputs.brandVoice}
                          onChange={handleInputChange}
                          className="w-full p-3 bg-white border border-blue-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-base"
                        >
                          <option value="">Select voice</option>
                          <option value="friendly">Friendly</option>
                          <option value="authoritative">Authoritative</option>
                          <option value="conversational">Conversational</option>
                          <option value="enthusiastic">Enthusiastic</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-800 mb-2">Visual Style</label>
                        <select
                          name="visualStyle"
                          value={inputs.visualStyle}
                          onChange={handleInputChange}
                          className="w-full p-3 bg-white border border-blue-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-base"
                        >
                          <option value="">Select style</option>
                          <option value="modern">Modern</option>
                          <option value="classic">Classic</option>
                          <option value="bold">Bold & Colorful</option>
                          <option value="minimal">Minimal</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-2">Call to Action</label>
                      <input
                        name="callToAction"
                        value={inputs.callToAction}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-white border border-blue-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-base"
                        placeholder="What action do you want viewers to take?"
                      />
                    </div>
                  </div>
                </div>

                {/* Generated Content Display */}
                {generatedContent && (
                  <div className="bg-white rounded-lg shadow-sm border border-green-200 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-green-800">Generated Carousel Ideas</h3>
                      <button 
                        onClick={() => {
                          const contentToCopy = JSON.stringify(generatedContent, null, 2);
                          navigator.clipboard.writeText(contentToCopy);
                        }}
                        className="px-3 py-1.5 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-all flex items-center gap-1"
                      >
                        <i className="fas fa-copy text-xs"></i>
                        Copy
                      </button>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                      <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                        {JSON.stringify(generatedContent, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'templates' && (
              <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-layer-group text-blue-500 text-xl"></i>
                </div>
                <h3 className="text-blue-900 font-medium text-lg">Template Library</h3>
                <p className="text-base text-blue-700 max-w-md">Browse and select from pre-made templates to jumpstart your content creation.</p>
                <button className="mt-2 px-5 py-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-all duration-200 text-base">
                  Browse Templates
                </button>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="py-4">
                <History toolName="Carousel Ideas for Products" />
              </div>
            )}
          </div>
        </div>
        
        {/* Footer with Action Button */}
        <div className="p-4 border-t border-blue-100 bg-white flex justify-between items-center">
          <button 
            onClick={onBackClick}
            className="px-4 py-2 flex items-center gap-2 text-blue-600 hover:bg-blue-50 rounded-full transition-all text-base"
          >
            <i className="fas fa-arrow-left"></i>
            Back to Tools
          </button>
          {activeTab === 'generate' && (
            <button 
              onClick={handleGenerateCarousel}
              disabled={isGenerating}
              className="px-5 py-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition flex items-center gap-1 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-magic"></i> Generate Carousel
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
