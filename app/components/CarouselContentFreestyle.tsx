'use client';

import React, { useState } from 'react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface CarouselContentFreestyleProps {
  onBackClick: () => void;
}

export default function CarouselContentFreestyle({ onBackClick }: CarouselContentFreestyleProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'result' | 'templates' | 'history'>('generate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCarousel, setGeneratedCarousel] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [inputs, setInputs] = useState({
    platform: '',
    slideCount: '',
    mainTopic: '',
    targetAudience: '',
    carouselGoal: '',
    contentStyle: '',
    callToAction: '',
    brandVoice: '',
    visualStyle: '',
    carouselType: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleClearForm = () => {
    setInputs({
      platform: '',
      slideCount: '',
      mainTopic: '',
      targetAudience: '',
      carouselGoal: '',
      contentStyle: '',
      callToAction: '',
      brandVoice: '',
      visualStyle: '',
      carouselType: ''
    });
    setGeneratedCarousel(null);
    setError('');
    setShowSuccess(false);
  };

  const handleGenerateCarousel = async () => {
    // Validate required fields
    const requiredFields = [
      'platform',
      'slideCount',
      'mainTopic',
      'targetAudience',
      'carouselGoal',
      'contentStyle',
      'callToAction',
      'brandVoice',
      'visualStyle',
      'carouselType'
    ];
    
    const missingFields = requiredFields.filter(field => !inputs[field as keyof typeof inputs]);
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedCarousel(null);

    try {
      // Map form inputs to API expected format
      const apiData = {
        carousel_goal: inputs.carouselGoal,
        carousel_type: inputs.carouselType,
        content_style: inputs.contentStyle,
        brand_voice: inputs.brandVoice,
        visual_style: inputs.visualStyle,
        call_to_action: inputs.callToAction,
        platform: inputs.platform,
        number_of_slides: parseInt(inputs.slideCount),
        main_topic: inputs.mainTopic,
        target_audience: inputs.targetAudience
      };

      console.log('Sending carousel freestyle request with data:', apiData);
      const response = await aiToolsService.generateCarouselFreestyle(apiData);
      
      if (response) {
        setGeneratedCarousel(response);
        
        // Save tool history silently
        try {
          await saveToolHistorySilent({
            toolName: 'Carousel Content Freestyle',
            toolId: 'carousel-content-freestyle',
            outputResult: response,
            prompt: JSON.stringify(apiData)
          });
          console.log('✅ Carousel content saved to history');
        } catch (historyError) {
          console.warn('⚠️ Failed to save to history:', historyError);
        }
        setShowSuccess(true);
        setActiveTab('result');
        console.log('Generated carousel:', response);
        
        // Auto-hide success message after 3 seconds
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (err: any) {
      console.error('Error generating carousel:', err);
      setError(err.message || 'Failed to generate carousel. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const carouselTemplates = [
    { name: "Product Showcase", icon: "fas fa-box", description: "Highlight product features and benefits across multiple slides." },
    { name: "How-To Tutorial", icon: "fas fa-graduation-cap", description: "Step-by-step guides and educational content carousels." },
    { name: "Before & After", icon: "fas fa-exchange-alt", description: "Show transformation and results through visual comparison." },
    { name: "Tips & Tricks", icon: "fas fa-lightbulb", description: "Share valuable insights and actionable tips for your audience." },
    { name: "Behind the Scenes", icon: "fas fa-camera", description: "Give followers a peek into your business or process." },
    { name: "Story Series", icon: "fas fa-book-open", description: "Tell compelling stories that engage and inspire your audience." }
  ];

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Glassmorphic Header with blue gradient */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-images text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Carousel Content Freestyle</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create engaging carousel content for social media platforms</p>
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
                {generatedCarousel && !error && (
                  <button 
                    onClick={() => setActiveTab('result')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${activeTab === 'result' ? 'text-blue-700 bg-blue-50/70' : 'text-blue-500 hover:text-blue-600'}`}
                  >
                    <span className="flex items-center gap-2">
                      <i className="fas fa-plus-circle text-xs"></i>
                      Generated Plan
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
                  {generatedCarousel && !error && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <i className="fas fa-check text-green-600 text-sm"></i>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-green-800">Plan Generated Successfully!</h4>
                            <p className="text-xs text-green-600 mt-0.5">Your social media plan is ready to view.</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setActiveTab('result')}
                          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors duration-200"
                        >
                          View Plan
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
                      <p className="text-sm text-red-600 mt-1">{error}</p>
                    </div>
                  )}

                  {/* Generated Carousel Display */}
                  {generatedCarousel && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <i className="fas fa-images text-green-500"></i>
                          <span className="text-sm font-medium text-green-700">Generated Carousel Content</span>
                        </div>
                        <button 
                          onClick={() => {
                            const carouselText = JSON.stringify(generatedCarousel, null, 2);
                            navigator.clipboard.writeText(carouselText);
                          }}
                          className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all flex items-center gap-1"
                        >
                          <i className="fas fa-copy"></i>
                          Copy
                        </button>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-green-100 max-h-96 overflow-y-auto">
                        <div className="space-y-4">
                          {/* Slides */}
                          {generatedCarousel.slides && generatedCarousel.slides.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-blue-900 mb-3">Carousel Slides</h4>
                              <div className="space-y-4">
                                {generatedCarousel.slides.map((slide: any, index: number) => (
                                  <div key={index} className="border border-blue-100 rounded-lg p-3 bg-blue-50/30">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                        Slide {index + 1}
                                      </span>
                                    </div>
                                    <h5 className="font-medium text-blue-900 mb-2">{slide.title}</h5>
                                    <p className="text-sm text-gray-700 leading-relaxed">{slide.content}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Call to Action */}
                          {generatedCarousel.call_to_action && (
                            <div className="border-t border-green-100 pt-3">
                              <h5 className="font-medium text-blue-800 mb-2">Call to Action</h5>
                              <p className="text-sm text-gray-700 bg-blue-50 p-2 rounded border border-blue-100">
                                {generatedCarousel.call_to_action}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Carousel Settings</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="platform">Platform</label>
                          <select
                            id="platform"
                            name="platform"
                            value={inputs.platform}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select Platform</option>
                            <option value="instagram">Instagram</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="facebook">Facebook</option>
                            <option value="twitter">Twitter</option>
                            <option value="pinterest">Pinterest</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="slideCount">Number of Slides</label>
                          <select
                            id="slideCount"
                            name="slideCount"
                            value={inputs.slideCount}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select Number</option>
                            <option value="3">3 Slides</option>
                            <option value="5">5 Slides</option>
                            <option value="7">7 Slides</option>
                            <option value="10">10 Slides</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="mainTopic">Main Topic</label>
                        <input 
                          id="mainTopic"
                          name="mainTopic"
                          type="text"
                          value={inputs.mainTopic}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all" 
                          placeholder="Enter the main topic for your carousel"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Content Strategy</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="targetAudience">Target Audience</label>
                        <textarea 
                          id="targetAudience"
                          name="targetAudience"
                          value={inputs.targetAudience}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Who is your target audience for this carousel? Describe their interests, demographics, and needs..."
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="carouselGoal">Carousel Goal</label>
                        <textarea 
                          id="carouselGoal"
                          name="carouselGoal"
                          value={inputs.carouselGoal}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="What do you want to achieve with this carousel? (educate, promote, engage, inspire, etc.)"
                        ></textarea>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="carouselType">Carousel Type</label>
                          <select
                            id="carouselType"
                            name="carouselType"
                            value={inputs.carouselType}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select Type</option>
                            <option value="educational">Educational</option>
                            <option value="promotional">Promotional</option>
                            <option value="storytelling">Storytelling</option>
                            <option value="behind-the-scenes">Behind the Scenes</option>
                            <option value="tips">Tips & Tricks</option>
                            <option value="showcase">Product Showcase</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="contentStyle">Content Style</label>
                          <select
                            id="contentStyle"
                            name="contentStyle"
                            value={inputs.contentStyle}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select Style</option>
                            <option value="professional">Professional</option>
                            <option value="casual">Casual</option>
                            <option value="fun">Fun & Playful</option>
                            <option value="inspirational">Inspirational</option>
                            <option value="minimalist">Minimalist</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Brand & Design</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="brandVoice">Brand Voice</label>
                          <select
                            id="brandVoice"
                            name="brandVoice"
                            value={inputs.brandVoice}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select Voice</option>
                            <option value="friendly">Friendly</option>
                            <option value="authoritative">Authoritative</option>
                            <option value="conversational">Conversational</option>
                            <option value="enthusiastic">Enthusiastic</option>
                            <option value="professional">Professional</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="visualStyle">Visual Style</label>
                          <select
                            id="visualStyle"
                            name="visualStyle"
                            value={inputs.visualStyle}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select Style</option>
                            <option value="modern">Modern</option>
                            <option value="classic">Classic</option>
                            <option value="bold">Bold & Colorful</option>
                            <option value="minimal">Minimal</option>
                            <option value="organic">Organic</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="callToAction">Call to Action</label>
                        <input
                          id="callToAction"
                          name="callToAction"
                          type="text"
                          value={inputs.callToAction}
                          onChange={handleInputChange}
                          placeholder="What action do you want viewers to take? (follow, visit website, comment, etc.)"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'result' && generatedCarousel && (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  <div className="bg-white border border-green-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                        <i className="fas fa-check-circle text-green-600"></i>
                        Generated Carousel Plan
                      </h3>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => navigator.clipboard.writeText(JSON.stringify(generatedCarousel, null, 2))}
                          className="px-3 py-1.5 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-all flex items-center gap-1"
                        >
                          <i className="fas fa-copy text-xs"></i>
                          Copy
                        </button>
                        <button 
                          onClick={() => setGeneratedCarousel(null)}
                          className="px-3 py-1.5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-all flex items-center gap-1"
                        >
                          <i className="fas fa-times text-xs"></i>
                          Clear
                        </button>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                      {generatedCarousel.slides && generatedCarousel.slides.length > 0 ? (
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-800 mb-2">Carousel Slides</h4>
                          {generatedCarousel.slides.map((slide: any, index: number) => (
                            <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                                  Slide {index + 1}
                                </span>
                                {slide.slide_title && (
                                  <h5 className="font-medium text-gray-800">{slide.slide_title}</h5>
                                )}
                              </div>
                              {slide.slide_content && (
                                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mb-2">
                                  {slide.slide_content}
                                </div>
                              )}
                              {slide.visual_description && (
                                <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                                  <strong>Visual:</strong> {slide.visual_description}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {typeof generatedCarousel === 'string' ? generatedCarousel : JSON.stringify(generatedCarousel, null, 2)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && (
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {carouselTemplates.map((template, index) => (
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
                  <History toolName="Carousel Content Freestyle" />
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
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all shadow-sm hover:shadow"
                >
                  Clear Form
                </button>
                <button className="px-4 py-2 text-sm text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-all shadow-sm hover:shadow">
                  Save Draft
                </button>
                <button 
                  onClick={handleGenerateCarousel}
                  disabled={isGenerating}
                  className="px-5 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <i className="fas fa-spinner fa-spin text-xs"></i>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Carousel</span>
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
