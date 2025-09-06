'use client';

import React, { useState } from 'react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface ProductKeywordResearchProps {
  onBackClick: () => void;
}

export default function ProductKeywordResearch({ onBackClick }: ProductKeywordResearchProps) 
{
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputs, setInputs] = useState({
    productName: '',
    productDescription: '',
    primaryKeywords: '',
    targetAudience: '',
    productCategory: '',
    keyFeatures: '',
    competitorKeywords: '',
    geographicTargeting: '',
    contentGoals: '',
    searchIntent: '',
    keywordDifficulty: '',
    seasonalFactors: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateKeywords = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiData = {
        product_name: inputs.productName,
        product_category: inputs.productCategory,
        product_description: inputs.productDescription,
        key_features_benefits: inputs.keyFeatures,
        primary_keywords: inputs.primaryKeywords,
        target_audience: inputs.targetAudience,
        search_intent: inputs.searchIntent,
        keyword_difficulty_preference: inputs.keywordDifficulty,
        content_goals: inputs.contentGoals,
      };
      const response = await aiToolsService.generateProductKeywordResearch(apiData);
      setResult(response);
      
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Product Keyword Research',
          toolId: 'product-keyword-research',
          outputResult: response,
          prompt: JSON.stringify(apiData)
        });
        console.log('✅ Product keyword research saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
    } catch (err: any) {
      console.error('Error generating keywords:', err);
      setError(err.message || 'Failed to generate keywords. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };






  const keywordTemplates = [
    { name: "Product Keywords", icon: "fas fa-tag", description: "Generate primary product-focused keywords and variations." },
    { name: "Customer Intent Keywords", icon: "fas fa-user-check", description: "Find keywords based on customer search behavior and intent." },
    { name: "Problem-Solution Keywords", icon: "fas fa-lightbulb", description: "Discover keywords around problems your product solves." },
    { name: "Competitor Analysis", icon: "fas fa-chart-line", description: "Research keywords your competitors are targeting." },
    { name: "Long-tail Keywords", icon: "fas fa-list", description: "Generate specific, lower-competition long-tail keyword phrases." },
    { name: "Content Marketing Keywords", icon: "fas fa-edit", description: "Keywords for blog posts, guides, and educational content." }
  ];

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Glassmorphic Header with blue gradient */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-search text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Product Keyword Research</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Discover powerful keywords to optimize your product visibility</p>
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
                        <span className="font-medium">Generating your keyword research...</span>
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
                          <span className="font-medium">Generated Keyword Research</span>
                        </div>
                        
                        {/* Suggested Keywords */}
                        <div className="space-y-4">
                          {result.suggested_keywords && result.suggested_keywords.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-green-800 mb-2">Suggested Keywords</h4>
                              <div className="bg-white p-3 rounded border border-green-100">
                                <ul className="space-y-2">
                                  {result.suggested_keywords.map((keyword: string, index: number) => (
                                    <li key={index} className="text-sm text-gray-700 flex items-start gap-3">
                                      <span className="text-green-600 mt-1 font-bold">#{index + 1}</span>
                                      <span className="flex-1">{keyword}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}

                          {/* Keyword Strategy */}
                          {result.keyword_strategy && (
                            <div>
                              <h4 className="text-sm font-semibold text-green-800 mb-2">Keyword Strategy</h4>
                              <div className="bg-white p-3 rounded border border-green-100">
                                <p className="text-sm text-gray-700">{result.keyword_strategy}</p>
                              </div>
                            </div>
                          )}

                          {/* Summary */}
                          {result.summary && (
                            <div>
                              <h4 className="text-sm font-semibold text-green-800 mb-2">Summary</h4>
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
                              if (result.suggested_keywords) {
                                const keywordsText = result.suggested_keywords.map((keyword: string, index: number) => 
                                  `${index + 1}. ${keyword}`
                                ).join('\n\n');
                                navigator.clipboard.writeText(keywordsText);
                              }
                            }}
                            className="px-3 py-1.5 text-xs text-green-700 bg-green-100 hover:bg-green-200 rounded transition-all flex items-center gap-1"
                          >
                            <i className="fas fa-copy"></i>
                            Copy Keywords
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
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="productCategory">Product Category</label>
                          <select
                            id="productCategory"
                            name="productCategory"
                            value={inputs.productCategory}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select category</option>
                            <option value="electronics">Electronics</option>
                            <option value="clothing">Clothing & Fashion</option>
                            <option value="health">Health & Beauty</option>
                            <option value="home">Home & Garden</option>
                            <option value="sports">Sports & Outdoors</option>
                            <option value="books">Books & Media</option>
                            <option value="software">Software/Digital</option>
                            <option value="services">Services</option>
                            <option value="other">Other</option>
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
                          placeholder="Describe your product, its purpose, and main benefits..."
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
                          placeholder="List your product's main features and benefits (one per line)..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Keyword Strategy</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="primaryKeywords">Primary Keywords</label>
                        <textarea 
                          id="primaryKeywords"
                          name="primaryKeywords"
                          value={inputs.primaryKeywords}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="List main keywords you want to target (comma separated)..."
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
                          placeholder="Describe your ideal customers, their demographics, and search behavior..."
                        ></textarea>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="searchIntent">Search Intent</label>
                          <select
                            id="searchIntent"
                            name="searchIntent"
                            value={inputs.searchIntent}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select intent</option>
                            <option value="informational">Informational (Research)</option>
                            <option value="commercial">Commercial (Comparison)</option>
                            <option value="transactional">Transactional (Buy)</option>
                            <option value="navigational">Navigational (Brand)</option>
                            <option value="local">Local (Near me)</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="keywordDifficulty">Keyword Difficulty Preference</label>
                          <select
                            id="keywordDifficulty"
                            name="keywordDifficulty"
                            value={inputs.keywordDifficulty}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select difficulty</option>
                            <option value="low">Low Competition</option>
                            <option value="medium">Medium Competition</option>
                            <option value="high">High Competition</option>
                            <option value="mixed">Mixed</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Research Context</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="contentGoals">Content Goals</label>
                        <textarea 
                          id="contentGoals"
                          name="contentGoals"
                          value={inputs.contentGoals}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="How will you use these keywords? (SEO, PPC, content marketing, product listings)"
                        ></textarea>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="geographicTargeting">Geographic Targeting</label>
                          <input
                            id="geographicTargeting"
                            name="geographicTargeting"
                            type="text"
                            value={inputs.geographicTargeting}
                            onChange={handleInputChange}
                            placeholder="Target countries/regions (optional)"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="seasonalFactors">Seasonal Factors</label>
                          <input
                            id="seasonalFactors"
                            name="seasonalFactors"
                            type="text"
                            value={inputs.seasonalFactors}
                            onChange={handleInputChange}
                            placeholder="Any seasonal trends to consider?"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="competitorKeywords">Competitor Keywords (optional)</label>
                        <textarea 
                          id="competitorKeywords"
                          name="competitorKeywords"
                          value={inputs.competitorKeywords}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="Keywords your competitors are ranking for or targeting..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && (
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {keywordTemplates.map((template, index) => (
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
                  <History toolName="Product Keyword Research" />
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
                  onClick={handleGenerateKeywords}
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
                      <span>Generate Keywords</span>
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
