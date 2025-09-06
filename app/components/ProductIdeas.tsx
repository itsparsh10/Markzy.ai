'use client';

import React, { useState } from 'react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface ProductIdeasProps {
  onBackClick: () => void;
}

export default function ProductIdeas({ onBackClick }: ProductIdeasProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputs, setInputs] = useState({
    skillsExperience: '',
    industry: '',
    targetAudience: '',
    businessModel: '',
    investmentLevel: '',
    timeCommitment: '',
    interests: '',
    marketTrends: '',
    problemsToSolve: '',
    competitorAnalysis: '',
    uniqueStrengths: '',
    preferredFormat: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateIdeas = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Prepare data for API
      const apiData = {
        skills_experience: inputs.skillsExperience,
        industry_niche: inputs.industry,
        preferred_business_model: inputs.businessModel,
        target_audience: inputs.targetAudience,
        problems_to_solve: inputs.problemsToSolve,
        market_trends: inputs.marketTrends,
        personal_interests: inputs.interests,
        investment_level: inputs.investmentLevel,
        time_commitment: inputs.timeCommitment,
        unique_strengths: inputs.uniqueStrengths,
        competitor_research: inputs.competitorAnalysis
      };

      const response = await aiToolsService.generateProductIdeas(apiData);
      setResult(response);
      
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Product Ideas',
          toolId: 'product-ideas',
          outputResult: response,
          prompt: JSON.stringify(apiData)
        });
        console.log('✅ Product ideas saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
    } catch (err: any) {
      console.error('Error generating ideas:', err);
      setError(err.message || 'Failed to generate ideas. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const productIdeaTemplates = [
    { name: "Digital Products", icon: "fas fa-laptop", description: "Generate ideas for digital products like courses, ebooks, and software." },
    { name: "Physical Products", icon: "fas fa-box", description: "Brainstorm physical product ideas based on market needs." },
    { name: "Service-Based Ideas", icon: "fas fa-handshake", description: "Develop service offerings and consulting opportunities." },
    { name: "Subscription Models", icon: "fas fa-sync-alt", description: "Create recurring revenue product and service ideas." },
    { name: "Marketplace Products", icon: "fas fa-store", description: "Ideas for products to sell on existing marketplaces." },
    { name: "Problem-Solution Fit", icon: "fas fa-lightbulb", description: "Generate products that solve specific market problems." }
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
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Product Ideas</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Generate fresh product ideas based on your skills and market opportunities</p>
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
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 text-red-700">
                        <i className="fas fa-exclamation-circle"></i>
                        <span className="font-medium">Error</span>
                      </div>
                      <p className="text-sm text-red-600 mt-1">{error}</p>
                    </div>
                  )}

                  {/* Loading State */}
                  {isLoading && (
                    <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
                      <div className="flex items-center justify-center gap-3 text-blue-700">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="font-medium">Generating your product ideas...</span>
                      </div>
                      <p className="text-sm text-blue-600 mt-2">This may take a few moments</p>
                    </div>
                  )}

                  {/* Results Display */}
                  {result && !isLoading && (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 text-green-700 mb-3">
                          <i className="fas fa-check-circle"></i>
                          <span className="font-medium">Generated Product Ideas</span>
                        </div>
                        
                        {/* Product Ideas */}
                        <div className="space-y-4">
                          {result.product_ideas && result.product_ideas.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-green-800 mb-2">Product Ideas</h4>
                              <div className="bg-white p-3 rounded border border-green-100">
                                <ul className="space-y-3">
                                  {result.product_ideas.map((idea: string, index: number) => (
                                    <li key={index} className="text-sm text-gray-700 flex items-start gap-3">
                                      <span className="text-green-600 mt-1 font-bold">#{index + 1}</span>
                                      <span className="flex-1">{idea}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}

                          {/* Summary */}
                          {result.summary && (
                            <div>
                              <h4 className="text-sm font-semibold text-green-800 mb-2">Opportunity Summary</h4>
                              <div className="bg-white p-3 rounded border border-green-100">
                                <p className="text-sm text-gray-700">{result.summary}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-4 pt-3 border-t border-green-200">
                          <button 
                            onClick={() => {
                              if (result.product_ideas) {
                                const ideasText = result.product_ideas.map((idea: string, index: number) => 
                                  `${index + 1}. ${idea}`
                                ).join('\n\n');
                                navigator.clipboard.writeText(ideasText);
                              }
                            }}
                            className="px-3 py-1.5 text-xs text-green-700 bg-green-100 hover:bg-green-200 rounded transition-all flex items-center gap-1"
                          >
                            <i className="fas fa-copy"></i>
                            Copy Ideas
                          </button>
                          <button 
                            onClick={() => setResult(null)}
                            className="px-3 py-1.5 text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 rounded transition-all flex items-center gap-1"
                          >
                            <i className="fas fa-times"></i>
                            Clear
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Skills & Experience</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="skillsExperience">Your Skills & Experience</label>
                        <textarea 
                          id="skillsExperience"
                          name="skillsExperience"
                          value={inputs.skillsExperience}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="List your key skills, expertise areas, professional background, and unique experiences..."
                        ></textarea>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="industry">Industry/Niche</label>
                          <select
                            id="industry"
                            name="industry"
                            value={inputs.industry}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select your industry</option>
                            <option value="technology">Technology</option>
                            <option value="health">Health & Wellness</option>
                            <option value="education">Education & Training</option>
                            <option value="business">Business & Finance</option>
                            <option value="creative">Creative & Design</option>
                            <option value="lifestyle">Lifestyle & Personal</option>
                            <option value="other">Other/Multiple</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="businessModel">Preferred Business Model</label>
                          <select
                            id="businessModel"
                            name="businessModel"
                            value={inputs.businessModel}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select model</option>
                            <option value="one-time">One-time Purchase</option>
                            <option value="subscription">Subscription/Recurring</option>
                            <option value="marketplace">Marketplace Selling</option>
                            <option value="service">Service-Based</option>
                            <option value="licensing">Licensing/Royalties</option>
                            <option value="mixed">Mixed Model</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Market & Opportunity</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="targetAudience">Target Audience</label>
                        <textarea 
                          id="targetAudience"
                          name="targetAudience"
                          value={inputs.targetAudience}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Who would you like to serve? Demographics, interests, buying behavior..."
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="problemsToSolve">Problems to Solve</label>
                        <textarea 
                          id="problemsToSolve"
                          name="problemsToSolve"
                          value={inputs.problemsToSolve}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="What problems or pain points do you want to solve for people?"
                        ></textarea>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="marketTrends">Market Trends</label>
                          <textarea 
                            id="marketTrends"
                            name="marketTrends"
                            value={inputs.marketTrends}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                            placeholder="Current trends or opportunities you've noticed..."
                          ></textarea>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="interests">Personal Interests</label>
                          <textarea 
                            id="interests"
                            name="interests"
                            value={inputs.interests}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                            placeholder="Your hobbies, passions, and personal interests..."
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Business Constraints & Preferences</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="investmentLevel">Investment Level</label>
                          <select
                            id="investmentLevel"
                            name="investmentLevel"
                            value={inputs.investmentLevel}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select investment level</option>
                            <option value="minimal">Minimal ($0-500)</option>
                            <option value="low">Low ($500-2500)</option>
                            <option value="moderate">Moderate ($2500-10000)</option>
                            <option value="high">High ($10000+)</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="timeCommitment">Time Commitment</label>
                          <select
                            id="timeCommitment"
                            name="timeCommitment"
                            value={inputs.timeCommitment}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select time commitment</option>
                            <option value="part-time">Part-time (5-20 hrs/week)</option>
                            <option value="full-time">Full-time (40+ hrs/week)</option>
                            <option value="side-hustle">Side Hustle (1-10 hrs/week)</option>
                            <option value="seasonal">Seasonal/Project-based</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="uniqueStrengths">Unique Strengths & Advantages</label>
                        <textarea 
                          id="uniqueStrengths"
                          name="uniqueStrengths"
                          value={inputs.uniqueStrengths}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="What unique advantages, connections, or resources do you have?"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="competitorAnalysis">Competitor Research (optional)</label>
                        <textarea 
                          id="competitorAnalysis"
                          name="competitorAnalysis"
                          value={inputs.competitorAnalysis}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="Any competitors or market gaps you've identified..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && (
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {productIdeaTemplates.map((template, index) => (
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
                  <History toolName="Product Ideas" />
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
                  className={`px-5 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
