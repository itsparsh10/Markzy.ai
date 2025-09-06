'use client';

import React, { useState } from 'react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface ContentPillarsProps {
  onBackClick: () => void;
}

interface GeneratedPillars {
  pillars?: Array<{
    name: string;
    description: string;
    importance: string;
  }>;
  summary?: string;
}

export default function ContentPillars({ onBackClick }: ContentPillarsProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history' | 'result'>('generate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPillars, setGeneratedPillars] = useState<GeneratedPillars | null>(null);
  const [error, setError] = useState<string>('');
  const [inputs, setInputs] = useState({
    businessName: '',
    industry: '',
    businessDescription: '',
    targetAudience: '',
    brandValues: '',
    expertiseAreas: '',
    contentGoals: '',
    audienceProblems: '',
    uniqueValue: '',
    competitors: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGeneratePillars = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!inputs.businessName || !inputs.industry || !inputs.businessDescription || !inputs.targetAudience) {
      setError('Please fill in Business Name, Industry, Business Description, and Target Audience');
      return;
    }

    setIsGenerating(true);
    setError('');
    
    try {
      // Map UI values to API expected format
      const pillarsData = {
        business_name: inputs.businessName,
        industry: inputs.industry,
        business_description: inputs.businessDescription,
        target_audience: inputs.targetAudience,
        brand_values: inputs.brandValues,
        areas_of_expertise: inputs.expertiseAreas,
        content_goals: inputs.contentGoals,
        audience_problems: inputs.audienceProblems,
        unique_value_proposition: inputs.uniqueValue,
        main_competitors: inputs.competitors
      };

      console.log('Generating content pillars with data:', pillarsData);
      const response = await aiToolsService.generateContentPillars(pillarsData);
      setGeneratedPillars(response);
      
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Content Pillars',
          toolId: 'content-pillars',
          outputResult: response,
          prompt: JSON.stringify(pillarsData)
        });
        console.log('✅ Content pillars saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
      setActiveTab('result');
      
    } catch (error: any) {
      console.error('Error generating content pillars:', error);
      
      let errorMessage = 'Failed to generate content pillars. Please try again.';
      
      if (error.response?.data?.detail) {
        errorMessage = `API Error: ${error.response.data.detail}`;
      } else if (error.message && error.message.includes('Missing required fields')) {
        errorMessage = error.message;
      } else if (error.response?.status === 400) {
        errorMessage = 'The request was invalid. Please check all required fields.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication error. Please try logging out and back in.';
      }
      
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const pillarTemplates = [
    { name: "Educational Content", icon: "fas fa-graduation-cap", description: "Content pillars focused on teaching and educating your audience." },
    { name: "Behind-the-Scenes", icon: "fas fa-eye", description: "Show the human side of your brand and build connections." },
    { name: "Industry Insights", icon: "fas fa-chart-line", description: "Share expertise and thought leadership in your field." },
    { name: "Customer Success", icon: "fas fa-trophy", description: "Highlight customer stories and case studies." },
    { name: "Product/Service Focus", icon: "fas fa-box", description: "Content that showcases your offerings and features." },
    { name: "Community Building", icon: "fas fa-users", description: "Content that brings your audience together and encourages engagement." }
  ];

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Glassmorphic Header with blue gradient */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-columns text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Content Pillars</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Discover the best content themes that define your business</p>
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
                {generatedPillars && !error && (
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
                <button 
                  onClick={() => setActiveTab('result')}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${activeTab === 'result' ? 'text-blue-700 bg-blue-50/70' : 'text-blue-500 hover:text-blue-600'}`}
                >
                  <span className="flex items-center gap-2">
                    <i className="fas fa-columns text-xs"></i>
                    Results
                  </span>
                  {activeTab === 'result' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>}
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
                  {generatedPillars && !error && (
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
                    <h4 className="text-base font-medium text-blue-900 mb-3">Business Information</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="businessName">Business Name</label>
                          <input
                            id="businessName"
                            name="businessName"
                            type="text"
                            value={inputs.businessName}
                            onChange={handleInputChange}
                            placeholder="Enter your business name"
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
                            <option value="">Select your industry</option>
                            <option value="health">Health & Wellness</option>
                            <option value="finance">Finance & Investing</option>
                            <option value="ecommerce">E-commerce & Retail</option>
                            <option value="education">Education & Training</option>
                            <option value="technology">Technology & Software</option>
                            <option value="creative">Creative & Design</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="businessDescription">Business Description</label>
                        <textarea 
                          id="businessDescription"
                          name="businessDescription"
                          value={inputs.businessDescription}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Briefly describe your business, products, and services..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Target Audience & Brand</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="targetAudience">Target Audience</label>
                        <textarea 
                          id="targetAudience"
                          name="targetAudience"
                          value={inputs.targetAudience}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Describe your target audience (demographics, interests, behavior, pain points)..."
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="brandValues">Brand Values & Mission</label>
                        <textarea 
                          id="brandValues"
                          name="brandValues"
                          value={inputs.brandValues}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="What does your brand stand for? Your mission and core values..."
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="expertiseAreas">Areas of Expertise</label>
                        <textarea 
                          id="expertiseAreas"
                          name="expertiseAreas"
                          value={inputs.expertiseAreas}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="What topics or areas do you have expertise in?"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Content Strategy & Goals</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="contentGoals">Content Goals</label>
                          <textarea 
                            id="contentGoals"
                            name="contentGoals"
                            value={inputs.contentGoals}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                            placeholder="What do you want to achieve with your content?"
                          ></textarea>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="audienceProblems">Audience Problems</label>
                          <textarea 
                            id="audienceProblems"
                            name="audienceProblems"
                            value={inputs.audienceProblems}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                            placeholder="What problems does your audience face?"
                          ></textarea>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="uniqueValue">Unique Value Proposition</label>
                          <textarea 
                            id="uniqueValue"
                            name="uniqueValue"
                            value={inputs.uniqueValue}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                            placeholder="What makes you different from competitors?"
                          ></textarea>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="competitors">Main Competitors</label>
                          <textarea 
                            id="competitors"
                            name="competitors"
                            value={inputs.competitors}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                            placeholder="Who are your main competitors?"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700">{error}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'result' && generatedPillars && (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="text-base font-medium text-green-900 mb-2">✅ Content Pillars Generated Successfully!</h4>
                    <p className="text-sm text-green-700">Your content pillar strategy is ready for implementation.</p>
                  </div>
                  
                  {/* Display the generated pillars content */}
                  <div className="p-4 bg-white border border-blue-200 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-blue-900">📋 Your Content Pillars</h4>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => navigator.clipboard.writeText(JSON.stringify(generatedPillars, null, 2))}
                          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-all"
                        >
                          📋 Copy Pillars
                        </button>
                        <button className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-all">
                          📄 Export
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Summary */}
                      {generatedPillars.summary && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <h5 className="text-sm font-semibold text-blue-900 mb-2">📝 Strategy Summary</h5>
                          <p className="text-sm text-blue-800 leading-relaxed">
                            {String(generatedPillars.summary)}
                          </p>
                        </div>
                      )}

                      {/* Content Pillars */}
                      {generatedPillars.pillars && Array.isArray(generatedPillars.pillars) && (
                        <div className="space-y-3">
                          <h5 className="font-medium text-blue-800 text-lg">📋 Content Pillars</h5>
                          {generatedPillars.pillars.map((pillar, index) => (
                            <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                              <div className="flex items-start justify-between mb-2">
                                <h6 className="font-semibold text-blue-900">
                                  {pillar.name ? String(pillar.name) : `Pillar ${index + 1}`}
                                </h6>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  pillar.importance === 'High' 
                                    ? 'bg-red-100 text-red-800' 
                                    : pillar.importance === 'Medium'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {pillar.importance ? String(pillar.importance) : 'Medium'}
                                </span>
                              </div>
                              <p className="text-sm text-blue-700 leading-relaxed">
                                {pillar.description ? String(pillar.description) : 'No description available'}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Handle other response formats */}
                      {!generatedPillars.pillars && typeof generatedPillars === 'object' && (
                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                          <h5 className="text-sm font-semibold text-gray-900 mb-2">📊 Full Response</h5>
                          <pre className="text-sm text-gray-700 overflow-x-auto">
                            {JSON.stringify(generatedPillars, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'result' && !generatedPillars && (
                <div className="py-4 flex flex-col items-center justify-center text-center space-y-2">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-columns text-blue-500 text-xl"></i>
                  </div>
                  <h3 className="text-blue-900 font-medium">No Pillars Generated</h3>
                  <p className="text-sm text-blue-700 max-w-md">Generate content pillars first to see the results here.</p>
                  <button 
                    onClick={() => setActiveTab('generate')}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm"
                  >
                    Generate Pillars
                  </button>
                </div>
              )}
              
              {activeTab === 'templates' && (
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {pillarTemplates.map((template, index) => (
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
                  <History toolName="Content Pillars" />
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
                  onClick={handleGeneratePillars}
                  disabled={isGenerating}
                  className="px-5 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center">
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Generating...
                    </span>
                  ) : (
                    <>
                      <span>Generate Pillars</span>
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
