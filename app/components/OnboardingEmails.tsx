'use client';

import React, { useState } from 'react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface OnboardingEmailsProps {
  onBackClick: () => void;
}

export default function OnboardingEmails({ onBackClick }: OnboardingEmailsProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [inputs, setInputs] = useState({
    productName: '',
    productType: '',
    keyFeatures: '',
    onboardingGoals: '',
    customerType: '',
    timeFrame: '',
    supportResources: '',
    successMetrics: '',
    callToAction: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      // Map form inputs to API request format
      const requestData = {
        product_service_name: inputs.productName,
        product_type: inputs.productType,
        key_features_benefits: inputs.keyFeatures,
        onboarding_goals: inputs.onboardingGoals,
        customer_type: inputs.customerType,
        onboarding_timeframe: inputs.timeFrame,
        support_resources: inputs.supportResources,
        success_metrics: inputs.successMetrics,
        next_steps_cta: inputs.callToAction
      };

      const response = await aiToolsService.generateOnboardingEmails(requestData);
      setResult(response);
      
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Onboarding Emails',
          toolId: 'onboarding-emails',
          outputResult: response,
          prompt: JSON.stringify(requestData)
        });
        console.log('✅ Onboarding emails saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
    } catch (err: any) {
      console.error('Error generating onboarding emails:', err);
      setError(err.message || 'Failed to generate onboarding emails. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Template types with appropriate icons
  const templateTypes = [
    { name: "SaaS Welcome Series", icon: "fas fa-laptop-code", description: "Complete onboarding sequence for software products." },
    { name: "E-commerce Guide", icon: "fas fa-shopping-cart", description: "Help customers navigate your online store effectively." },
    { name: "Course Onboarding", icon: "fas fa-graduation-cap", description: "Guide students through course materials and platform." },
    { name: "Service Introduction", icon: "fas fa-handshake", description: "Introduce clients to your service delivery process." },
    { name: "App Tutorial Series", icon: "fas fa-mobile-alt", description: "Step-by-step app features and usage guidance." },
    { name: "Membership Welcome", icon: "fas fa-users", description: "Welcome new members and explain community benefits." }
  ];

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Glassmorphic Header with blue gradient */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-smile text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Onboarding Emails</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Help customers get started after purchase</p>
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
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Product Information</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="productName">Product/Service Name</label>
                          <input
                            id="productName"
                            name="productName"
                            type="text"
                            value={inputs.productName}
                            onChange={handleInputChange}
                            placeholder="Enter your product or service name"
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
                            <option value="saas">SaaS Software</option>
                            <option value="course">Online Course</option>
                            <option value="membership">Membership Site</option>
                            <option value="ecommerce">E-commerce Product</option>
                            <option value="service">Service</option>
                            <option value="app">Mobile App</option>
                            <option value="digital">Digital Product</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="keyFeatures">Key Features & Benefits</label>
                        <textarea 
                          id="keyFeatures"
                          name="keyFeatures"
                          value={inputs.keyFeatures}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="List the main features and benefits customers should know about..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Onboarding Strategy</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="onboardingGoals">Onboarding Goals</label>
                        <textarea 
                          id="onboardingGoals"
                          name="onboardingGoals"
                          value={inputs.onboardingGoals}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="What do you want customers to achieve during onboarding?"
                        ></textarea>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="customerType">Customer Type</label>
                          <select
                            id="customerType"
                            name="customerType"
                            value={inputs.customerType}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select customer type</option>
                            <option value="beginners">Beginners</option>
                            <option value="experienced">Experienced Users</option>
                            <option value="businesses">Businesses</option>
                            <option value="individuals">Individuals</option>
                            <option value="mixed">Mixed Audience</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="timeFrame">Onboarding Timeframe</label>
                          <select
                            id="timeFrame"
                            name="timeFrame"
                            value={inputs.timeFrame}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select timeframe</option>
                            <option value="1-week">1 Week</option>
                            <option value="2-weeks">2 Weeks</option>
                            <option value="1-month">1 Month</option>
                            <option value="ongoing">Ongoing</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Support & Success</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="supportResources">Support Resources</label>
                        <textarea 
                          id="supportResources"
                          name="supportResources"
                          value={inputs.supportResources}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="List available resources (docs, videos, support, etc.)..."
                        ></textarea>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="successMetrics">Success Metrics</label>
                          <textarea 
                            id="successMetrics"
                            name="successMetrics"
                            value={inputs.successMetrics}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                            placeholder="How do you measure onboarding success?"
                          ></textarea>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="callToAction">Next Steps/CTA</label>
                          <textarea 
                            id="callToAction"
                            name="callToAction"
                            value={inputs.callToAction}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                            placeholder="What actions should customers take?"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && (
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {templateTypes.map((template, index) => (
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
                  <History toolName="Onboarding Emails" />
                </div>
              )}
            </div>
            
            {/* Results Display */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                <div className="flex items-center gap-2 text-red-700">
                  <i className="fas fa-exclamation-circle"></i>
                  <span className="font-medium">Error</span>
                </div>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            )}
            
            {result && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-green-700">
                    <i className="fas fa-check-circle"></i>
                    <span className="font-medium">Generated Onboarding Email</span>
                  </div>
                  <button
                    onClick={() => {
                      const textToCopy = `Subject: ${result.email_subject}\n\nBody:\n${result.email_body}`;
                      navigator.clipboard.writeText(textToCopy);
                    }}
                    className="px-3 py-1 text-xs text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition-all flex items-center gap-1"
                  >
                    <i className="fas fa-copy"></i>
                    Copy All
                  </button>
                </div>
                
                {result.email_subject && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-green-800 mb-2">Email Subject</h4>
                    <div className="p-3 bg-white rounded-lg border border-green-200">
                      <p className="text-sm text-green-900">{result.email_subject}</p>
                      <button
                        onClick={() => navigator.clipboard.writeText(result.email_subject)}
                        className="mt-2 px-2 py-1 text-xs text-green-600 hover:text-green-700 transition-all flex items-center gap-1"
                      >
                        <i className="fas fa-copy"></i>
                        Copy
                      </button>
                    </div>
                  </div>
                )}
                
                {result.email_body && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-green-800 mb-2">Email Body</h4>
                    <div className="p-3 bg-white rounded-lg border border-green-200">
                      <p className="text-sm text-green-900 whitespace-pre-wrap">{result.email_body}</p>
                      <button
                        onClick={() => navigator.clipboard.writeText(result.email_body)}
                        className="mt-2 px-2 py-1 text-xs text-green-600 hover:text-green-700 transition-all flex items-center gap-1"
                      >
                        <i className="fas fa-copy"></i>
                        Copy
                      </button>
                    </div>
                  </div>
                )}
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
                      <span>Generate Emails</span>
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
