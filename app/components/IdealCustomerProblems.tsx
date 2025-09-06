'use client';

import React, { useState } from 'react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface IdealCustomerProblemsProps {
  onBackClick: () => void;
}

export default function IdealCustomerProblems({ onBackClick }: IdealCustomerProblemsProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    productService: '',
    targetCustomer: '',
    industry: '',
    customerGoals: '',
    currentSituation: '',
    painPoints: '',
    obstacles: '',
    emotionalImpact: '',
    urgencyLevel: ''
  });

  // Problem template types with appropriate icons
  const problemTypes = [
    { name: "Awareness Problems", icon: "fas fa-eye-slash", description: "Identify problems customers don't know they have." },
    { name: "Process Problems", icon: "fas fa-cogs", description: "Discover inefficiencies in current workflows." },
    { name: "Resource Problems", icon: "fas fa-exclamation-triangle", description: "Find gaps in available tools or resources." },
    { name: "Knowledge Problems", icon: "fas fa-brain", description: "Uncover lack of information or expertise." },
    { name: "Time Problems", icon: "fas fa-clock", description: "Identify time-related challenges and constraints." },
    { name: "Budget Problems", icon: "fas fa-dollar-sign", description: "Explore financial limitations and cost concerns." }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      // Validate required fields
      const requiredFields = [
        'productService',
        'industry',
        'targetCustomer',
        'customerGoals',
        'currentSituation',
        'painPoints',
        'urgencyLevel'
      ];
      
      const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      // Map form inputs to API fields with proper value mapping
      const apiData = {
        product_service: formData.productService,
        industry: formData.industry === 'technology' ? 'Technology' :
                 formData.industry === 'healthcare' ? 'Healthcare' :
                 formData.industry === 'finance' ? 'Finance' :
                 formData.industry === 'education' ? 'Education' :
                 formData.industry === 'retail' ? 'Retail' :
                 formData.industry === 'manufacturing' ? 'Manufacturing' :
                 formData.industry === 'consulting' ? 'Consulting' :
                 formData.industry === 'saas' ? 'SaaS' :
                 formData.industry,
        target_customer: formData.targetCustomer,
        customer_goals: formData.customerGoals,
        current_situation: formData.currentSituation,
        known_pain_points: formData.painPoints,
        obstacles: formData.obstacles || '',
        emotional_impact: formData.emotionalImpact || '',
        problem_urgency: formData.urgencyLevel === 'high' ? 'High - Immediate action needed' :
                        formData.urgencyLevel === 'medium' ? 'Medium - Important but not urgent' :
                        formData.urgencyLevel === 'low' ? 'Low - Nice to solve eventually' :
                        formData.urgencyLevel
      };

      console.log('Sending customer problems API data:', apiData);
      const response = await aiToolsService.generateCustomerProblems(apiData);
      setResult(response);
      
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Ideal Customer Problems',
          toolId: 'ideal-customer-problems',
          outputResult: response,
          prompt: JSON.stringify(apiData)
        });
        console.log('✅ Ideal customer problems saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
    } catch (err: any) {
      console.error('Error generating customer problems:', err);
      setError(err.message || 'Failed to generate customer problems. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Glassmorphic Header with blue gradient */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-question-circle text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Ideal Customer Problems</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Identify and understand your customers' key challenges</p>
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
                          Customer Problem Analysis
                        </h4>
                        <button
                          onClick={() => {
                            const fullContent = `Summary: ${result.summary}\n\nPain Points:\n${result.pain_points?.map((point: string, index: number) => `${index + 1}. ${point}`).join('\n') || ''}\n\nUrgency Level: ${result.urgency_level}\n\nRecommended Next Steps: ${result.recommended_next_steps}`;
                            copyToClipboard(fullContent);
                          }}
                          className="px-3 py-1.5 text-sm text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition-all flex items-center gap-1"
                        >
                          <i className="fas fa-copy text-xs"></i>
                          Copy All
                        </button>
                      </div>

                      <div className="space-y-4">
                        {/* Summary */}
                        <div className="p-3 bg-white rounded-lg border border-green-200">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-green-900 flex items-center gap-2">
                              <i className="fas fa-align-left text-green-600 text-sm"></i>
                              Problem Summary
                            </h5>
                            <button
                              onClick={() => copyToClipboard(result.summary)}
                              className="text-xs text-green-600 hover:text-green-800"
                            >
                              <i className="fas fa-copy"></i>
                            </button>
                          </div>
                          <p className="text-green-800">{result.summary}</p>
                        </div>

                        {/* Pain Points */}
                        {result.pain_points && result.pain_points.length > 0 && (
                          <div className="p-3 bg-white rounded-lg border border-green-200">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-semibold text-green-900 flex items-center gap-2">
                                <i className="fas fa-exclamation-triangle text-green-600 text-sm"></i>
                                Pain Points
                              </h5>
                              <button
                                onClick={() => copyToClipboard(result.pain_points.join('\n'))}
                                className="text-xs text-green-600 hover:text-green-800"
                              >
                                <i className="fas fa-copy"></i>
                              </button>
                            </div>
                            <div className="space-y-2">
                              {result.pain_points.map((point: string, index: number) => (
                                <div key={index} className="p-2 bg-green-50 rounded border-l-4 border-green-300">
                                  <p className="text-green-800 text-sm">
                                    <span className="font-medium">Pain Point {index + 1}:</span> {point}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Urgency Level */}
                        <div className="p-3 bg-white rounded-lg border border-green-200">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-green-900 flex items-center gap-2">
                              <i className="fas fa-clock text-green-600 text-sm"></i>
                              Urgency Level
                            </h5>
                            <button
                              onClick={() => copyToClipboard(result.urgency_level)}
                              className="text-xs text-green-600 hover:text-green-800"
                            >
                              <i className="fas fa-copy"></i>
                            </button>
                          </div>
                          <p className="text-green-800 font-medium">{result.urgency_level}</p>
                        </div>

                        {/* Recommended Next Steps */}
                        <div className="p-3 bg-white rounded-lg border border-green-200">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-green-900 flex items-center gap-2">
                              <i className="fas fa-lightbulb text-green-600 text-sm"></i>
                              Recommended Next Steps
                            </h5>
                            <button
                              onClick={() => copyToClipboard(result.recommended_next_steps)}
                              className="text-xs text-green-600 hover:text-green-800"
                            >
                              <i className="fas fa-copy"></i>
                            </button>
                          </div>
                          <p className="text-green-800">{result.recommended_next_steps}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Product & Customer Information</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="productService">Product/Service</label>
                          <input
                            id="productService"
                            name="productService"
                            value={formData.productService}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                            placeholder="What product or service do you offer?"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="industry">Industry</label>
                          <select
                            id="industry"
                            name="industry"
                            value={formData.industry}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select your industry</option>
                            <option value="technology">Technology</option>
                            <option value="healthcare">Healthcare</option>
                            <option value="finance">Finance</option>
                            <option value="education">Education</option>
                            <option value="retail">Retail</option>
                            <option value="manufacturing">Manufacturing</option>
                            <option value="consulting">Consulting</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="targetCustomer">Target Customer</label>
                        <textarea 
                          id="targetCustomer"
                          name="targetCustomer"
                          value={formData.targetCustomer}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="Describe your ideal customer (demographics, role, company size, etc.)..."
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="customerGoals">Customer Goals & Objectives</label>
                        <textarea 
                          id="customerGoals"
                          name="customerGoals"
                          value={formData.customerGoals}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="What are your customers trying to achieve?"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="currentSituation">Current Situation</label>
                        <textarea 
                          id="currentSituation"
                          name="currentSituation"
                          value={formData.currentSituation}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="Describe their current situation and how they handle things now..."
                        ></textarea>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="painPoints">Known Pain Points</label>
                          <textarea 
                            id="painPoints"
                            name="painPoints"
                            value={formData.painPoints}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                            placeholder="What problems do they already know about?"
                          ></textarea>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="urgencyLevel">Problem Urgency</label>
                          <select
                            id="urgencyLevel"
                            name="urgencyLevel"
                            value={formData.urgencyLevel}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select urgency level</option>
                            <option value="high">High - Immediate action needed</option>
                            <option value="medium">Medium - Important but not urgent</option>
                            <option value="low">Low - Nice to solve eventually</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && (
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {problemTypes.map((problemType, index) => (
                    <div key={index} className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
                            <i className={`${problemType.icon} text-blue-600`}></i>
                          </div>
                          <div>
                            <h4 className="font-medium text-blue-900">{problemType.name}</h4>
                            <p className="text-xs text-blue-600">{problemType.description}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
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
                  <History toolName="Ideal Customer Problems" />
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
                  className="px-5 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <span>Analyze Problems</span>
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
