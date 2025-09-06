'use client';

import React, { useState } from 'react';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface CarouselIdeasProps {
  onBackClick: () => void;
}

export default function CarouselIdeas({ onBackClick }: CarouselIdeasProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'result' | 'templates' | 'history'>('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [inputs, setInputs] = useState({
    carouselTopic: '',
    targetAudience: '',
    contentPillars: '',
    brandTone: '',
    slideCount: '5',
    visualStylePreferences: '',
    callToAction: '',
    contentGoals: '',
    industry: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  // Helper function to format text with bold headings
  const formatTextWithBold = (text: string) => {
    if (!text) return null;
    
    return text.split('\n').map((line, index) => {
      // Check if line is a heading (contains : or is all caps or starts with numbers)
      const isHeading = line.includes(':') && line.length < 100 || 
                       /^[A-Z\s\d\-\.]+:/.test(line) ||
                       /^\d+\./.test(line.trim()) ||
                       /^[A-Z\s]{3,}$/.test(line.trim());
      
      if (isHeading) {
        return (
          <div key={index} className="font-bold text-blue-900 mt-4 mb-2 text-sm border-b border-blue-100 pb-1">
            {line}
          </div>
        );
      }
      
      // Format bullet points
      if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
        return (
          <div key={index} className="mb-2 text-sm text-gray-700 leading-relaxed pl-4">
            <span className="text-blue-600 mr-2">•</span>
            {line.replace(/^[-•]\s*/, '')}
          </div>
        );
      }
      
      // Regular text
      if (line.trim()) {
        return (
          <div key={index} className="mb-2 text-sm text-gray-700 leading-relaxed">
            {line}
          </div>
        );
      }
      
      return <div key={index} className="mb-2"></div>;
    });
  };

  const formatContentForCopy = (content: any) => {
    if (typeof content === 'string') return content;
    
    // Handle slides array format (direct API response)
    if (content.slides && Array.isArray(content.slides)) {
      const header = "CAROUSEL IDEAS RESULTS\n" + "=".repeat(25) + "\n\n";
      const slidesList = content.slides.map((slide: any, index: number) => 
        `SLIDE ${index + 1}: ${slide.title}\n${slide.content}\n`
      ).join('\n');
      const callToAction = content.call_to_action ? `\nCALL TO ACTION:\n${content.call_to_action}\n` : '';
      const summary = `\nSUMMARY:\nGenerated ${content.slides.length} carousel slides for your topic and audience.`;
      return header + slidesList + callToAction + summary;
    }

    // Handle structured carousel ideas array format
    if (content.carousel_ideas && Array.isArray(content.carousel_ideas)) {
      const header = "CAROUSEL IDEAS RESULTS\n" + "=".repeat(25) + "\n\n";
      const ideasList = content.carousel_ideas.map((item: any, index: number) => 
        `${index + 1}. TITLE: "${item.title || item.idea_title}"\n   DESCRIPTION: ${item.description || item.content}\n`
      ).join('\n');
      const summary = `\nSUMMARY:\nGenerated ${content.carousel_ideas.length} carousel ideas for your topic and audience.`;
      return header + ideasList + summary;
    }
    
    if (content.carousel_content || content.content || content.ideas || content.generated_content) {
      return content.carousel_content || content.content || content.ideas || content.generated_content;
    }
    
    return Object.entries(content)
      .filter(([key, value]) => typeof value === 'string' && value.length > 50)
      .map(([key, value]) => `${key.replace(/_/g, ' ').toUpperCase()}:\n${value}`)
      .join('\n\n') || JSON.stringify(content);
  };

  const formatCarouselIdeasOutput = (content: any) => {
    // Handle slides array format (direct API response)
    if (content.slides && Array.isArray(content.slides)) {
      return (
        <div className="space-y-4">
          <div className="font-bold text-lg text-blue-900 mb-6 flex items-center gap-2 border-b border-blue-200 pb-3">
            <i className="fas fa-layer-group text-blue-600"></i>
            Carousel Ideas Results
          </div>
          <div className="space-y-4">
            {content.slides.map((slide: any, index: number) => (
              <div key={index} className="bg-white border border-blue-100 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-blue-900 text-base mb-2 flex items-center gap-2">
                      <i className="fas fa-lightbulb text-blue-600 text-sm"></i>
                      {slide.title}
                    </h4>
                    <div className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border-l-4 border-blue-300">
                      {slide.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {content.call_to_action && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h5 className="font-semibold text-green-800 text-sm mb-2 flex items-center gap-2">
                <i className="fas fa-bullhorn text-green-600"></i>
                Call to Action:
              </h5>
              <p className="text-sm text-green-700">{content.call_to_action}</p>
            </div>
          )}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 flex items-center gap-2">
              <i className="fas fa-info-circle text-blue-600"></i>
              <span className="font-semibold">Generated {content.slides.length} carousel slides</span> 
              tailored to your topic, audience, and content goals.
            </p>
          </div>
        </div>
      );
    }

    // Handle structured carousel ideas array format
    if (content.carousel_ideas && Array.isArray(content.carousel_ideas)) {
      return (
        <div className="space-y-4">
          <div className="font-bold text-lg text-blue-900 mb-6 flex items-center gap-2 border-b border-blue-200 pb-3">
            <i className="fas fa-layer-group text-blue-600"></i>
            Carousel Ideas Results
          </div>
          <div className="space-y-4">
            {content.carousel_ideas.map((item: any, index: number) => (
              <div key={index} className="bg-white border border-blue-100 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-blue-900 text-base mb-2 flex items-center gap-2">
                      <i className="fas fa-lightbulb text-blue-600 text-sm"></i>
                      {item.title || item.idea_title || `Carousel Idea ${index + 1}`}
                    </h4>
                    <div className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border-l-4 border-blue-300">
                      {item.description || item.content || item.idea_description}
                    </div>
                    {item.slides && (
                      <div className="mt-3">
                        <h5 className="font-semibold text-blue-800 text-sm mb-2 flex items-center gap-1">
                          <i className="fas fa-images text-blue-600 text-xs"></i>
                          Slide Breakdown:
                        </h5>
                        <div className="space-y-2">
                          {item.slides.map((slide: any, slideIndex: number) => (
                            <div key={slideIndex} className="bg-white border border-gray-200 rounded p-2 text-xs">
                              <span className="font-medium text-blue-700">Slide {slideIndex + 1}:</span> {slide}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 flex items-center gap-2">
              <i className="fas fa-info-circle text-blue-600"></i>
              <span className="font-semibold">Generated {content.carousel_ideas.length} carousel ideas</span> 
              tailored to your topic, audience, and content goals.
            </p>
          </div>
        </div>
      );
    }
    
    // Handle text-based content
    if (typeof content === 'string') {
      return formatTextWithBold(content);
    }
    
    // Handle object with text content
    if (content.carousel_content || content.content || content.ideas) {
      const textContent = content.carousel_content || content.content || content.ideas;
      if (typeof textContent === 'string') {
        return formatTextWithBold(textContent);
      }
    }
    
    // Fallback for other formats
    return (
      <div className="space-y-4">
        <div className="font-bold text-lg text-blue-900 mb-4 flex items-center gap-2">
          <i className="fas fa-layer-group text-blue-600"></i>
          Carousel Ideas
        </div>
        <div className="whitespace-pre-wrap text-sm text-gray-800">
          {JSON.stringify(content, null, 2)}
        </div>
      </div>
    );
  };

  const handleGenerateIdeas = async () => {
    // Validate required fields
    const requiredFields = [
      { key: 'carouselTopic', label: 'Carousel Topic' },
      { key: 'industry', label: 'Industry' },
      { key: 'targetAudience', label: 'Target Audience' },
      { key: 'contentPillars', label: 'Content Pillars' },
      { key: 'brandTone', label: 'Brand Tone' },
      { key: 'callToAction', label: 'Call to Action' },
      { key: 'contentGoals', label: 'Content Goals' }
    ];

    const missingFields = requiredFields.filter(field => !inputs[field.key as keyof typeof inputs]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.map(f => f.label).join(', ')}`);
      return;
    }

    setIsLoading(true);
    
    try {
      // Dynamic import for ES modules
      const { aiToolsService } = await import('../../services/aiTools.js');
      
      // Map UI values to API format
      const requestData = {
        carousel_topic: inputs.carouselTopic,
        industry: inputs.industry,
        target_audience: inputs.targetAudience,
        content_pillars: inputs.contentPillars,
        brand_tone: inputs.brandTone,
        number_of_slides: parseInt(inputs.slideCount),
        visual_style_preferences: inputs.visualStylePreferences || 'Modern and engaging design',
        call_to_action: inputs.callToAction,
        content_goals: inputs.contentGoals
      };

      console.log('Sending carousel ideas request:', requestData);
      const response = await aiToolsService.generateCarouselIdeas(requestData);
      console.log('Carousel ideas response:', response);
      setGeneratedContent(response);
      setActiveTab('result');
      
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Carousel Ideas',
          toolId: 'carousel-ideas',
          outputResult: response,
          prompt: JSON.stringify(requestData)
        });
        console.log('✅ Carousel ideas saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
      
    } catch (error: any) {
      // Error handling with user-friendly messages
      let errorMessage = 'Failed to generate carousel ideas. Please try again.';
      
      if (error.response?.data?.detail) {
        errorMessage = `API Error: ${error.response.data.detail}`;
      } else if (error.message && error.message.includes('Missing required fields')) {
        errorMessage = error.message;
      } else if (error.response?.status === 400) {
        errorMessage = 'The request was invalid. Please check all required fields.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication error. Please try logging out and back in.';
      }
      
      console.error('Error details:', error.response?.data || error.message);
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const carouselTemplates = [
    { name: "Educational Carousel", icon: "fas fa-graduation-cap", description: "Create educational content that teaches your audience something new." },
    { name: "Behind the Scenes", icon: "fas fa-camera", description: "Show the process behind your products or services." },
    { name: "Tips & Tricks", icon: "fas fa-lightbulb", description: "Share actionable tips related to your industry or niche." },
    { name: "Product Showcase", icon: "fas fa-star", description: "Highlight features and benefits of your products." },
    { name: "Before & After", icon: "fas fa-exchange-alt", description: "Show transformations or results from your work." },
    { name: "Quote Collection", icon: "fas fa-quote-left", description: "Inspirational or motivational quotes for your audience." }
  ];

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Glassmorphic Header with blue gradient */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-layer-group text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Carousel Ideas</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Generate engaging carousel content ideas for social media</p>
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
                {generatedContent && (
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
                  {generatedContent && (
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

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Carousel Topic & Audience</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="carouselTopic">Carousel Topic</label>
                          <input
                            id="carouselTopic"
                            name="carouselTopic"
                            type="text"
                            value={inputs.carouselTopic}
                            onChange={handleInputChange}
                            placeholder="What topic do you want to cover?"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="industry">Industry</label>
                          <select
                            id="industry"
                            name="industry"
                            value={inputs.industry}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select industry</option>
                            <option value="technology">Technology</option>
                            <option value="health">Health & Wellness</option>
                            <option value="business">Business</option>
                            <option value="education">Education</option>
                            <option value="lifestyle">Lifestyle</option>
                            <option value="finance">Finance</option>
                            <option value="other">Other</option>
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
                          placeholder="Who is your target audience? Describe their interests, demographics, and pain points..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Content Strategy</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="contentPillars">Content Pillars</label>
                        <textarea 
                          id="contentPillars"
                          name="contentPillars"
                          value={inputs.contentPillars}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="What are your main content themes or pillars? (e.g., education, inspiration, behind-the-scenes)"
                        ></textarea>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="brandTone">Brand Tone</label>
                          <select
                            id="brandTone"
                            name="brandTone"
                            value={inputs.brandTone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select tone</option>
                            <option value="professional">Professional</option>
                            <option value="friendly">Friendly</option>
                            <option value="inspirational">Inspirational</option>
                            <option value="educational">Educational</option>
                            <option value="playful">Playful</option>
                            <option value="authoritative">Authoritative</option>
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
                            <option value="3">3 slides</option>
                            <option value="5">5 slides</option>
                            <option value="7">7 slides</option>
                            <option value="10">10 slides</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Visual & Engagement Details</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="visualStylePreferences">Visual Style Preferences</label>
                        <textarea 
                          id="visualStylePreferences"
                          name="visualStylePreferences"
                          value={inputs.visualStylePreferences}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="Describe your preferred visual style, colors, fonts, or design elements..."
                        ></textarea>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="callToAction">Call to Action</label>
                          <input
                            id="callToAction"
                            name="callToAction"
                            type="text"
                            value={inputs.callToAction}
                            onChange={handleInputChange}
                            placeholder="What action do you want viewers to take?"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="contentGoals">Content Goals</label>
                          <select
                            id="contentGoals"
                            name="contentGoals"
                            value={inputs.contentGoals}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select goal</option>
                            <option value="education">Educate audience</option>
                            <option value="engagement">Increase engagement</option>
                            <option value="awareness">Build brand awareness</option>
                            <option value="sales">Drive sales</option>
                            <option value="community">Build community</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'result' && generatedContent && (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  <div className="bg-white border border-green-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                        <i className="fas fa-check-circle text-green-600"></i>
                        Generated Carousel Plan
                      </h3>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => navigator.clipboard.writeText(formatContentForCopy(generatedContent))}
                          className="px-3 py-1.5 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-all flex items-center gap-1"
                        >
                          <i className="fas fa-copy text-xs"></i>
                          Copy
                        </button>
                        <button 
                          onClick={() => setGeneratedContent(null)}
                          className="px-3 py-1.5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-all flex items-center gap-1"
                        >
                          <i className="fas fa-times text-xs"></i>
                          Clear
                        </button>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      {formatCarouselIdeasOutput(generatedContent)}
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
                  <History toolName="Carousel Ideas" />
                </div>
              )}
            </div>
            
            {/* Results Display */}
            {generatedContent && (
              <div className="mt-4 px-4">
                <div className="bg-white border border-green-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                      <i className="fas fa-check-circle text-green-600"></i>
                      Generated Carousel Ideas
                    </h3>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          const contentToFormat = formatContentForCopy(generatedContent);
                          navigator.clipboard.writeText(contentToFormat);
                        }}
                        className="px-3 py-1.5 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-all flex items-center gap-1"
                      >
                        <i className="fas fa-copy text-xs"></i>
                        Copy
                      </button>
                      <button 
                        onClick={() => setGeneratedContent(null)}
                        className="px-3 py-1.5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-all flex items-center gap-1"
                      >
                        <i className="fas fa-times text-xs"></i>
                        Clear
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
                    {formatCarouselIdeasOutput(generatedContent)}
                  </div>
                </div>
              </div>
            )}
            
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
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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
