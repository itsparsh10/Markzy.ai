'use client'

import { useState } from 'react';
import { ArrowLeft, Briefcase, Users, Footprints, Lightbulb, Target, Search, ShoppingBag, MessageSquare, ThumbsUp, FileText, History as HistoryIcon, Route, Clock, X, Save, Wand2, Check, Copy } from 'lucide-react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQsResult {
  faq_title: string;
  faq_intro: string;
  faqs: FAQItem[];
  product_features_section: string;
  support_policy_section: string;
  notes: string;
}

export default function WebsiteFAQs({ onBackClick }: { onBackClick: () => void }) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [inputs, setInputs] = useState({
    businessType: '',
    industry: '',
    targetAudience: '',
    commonQuestions: '',
    supportTopics: '',
    productFeatures: '',
    pricingModel: '',
    customerConcerns: '',
    companyPolicies: '',
    technicalQuestions: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<FAQsResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateFAQs = async () => {
    if (!inputs.businessType || !inputs.industry || !inputs.targetAudience || !inputs.commonQuestions || !inputs.productFeatures || !inputs.supportTopics) {
      alert('Please fill in all required fields: Business Type, Industry, Target Audience, Common Questions, Product Features, and Support Topics');
      return;
    }

    setIsLoading(true);
    setResult(null);
    setCopied(false);

    try {
      const requestData = {
        business_type: inputs.businessType,
        industry: inputs.industry,
        target_audience: inputs.targetAudience,
        common_customer_questions: inputs.commonQuestions,
        product_service_features: inputs.productFeatures,
        support_policy_topics: inputs.supportTopics,
        pricing_model: inputs.pricingModel,
        customer_concerns: inputs.customerConcerns,
        company_policies: inputs.companyPolicies,
        technical_questions: inputs.technicalQuestions,
      };

      const response = await aiToolsService.generateWebsiteFAQs(requestData);
      setResult(response);
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Website FAQs',
          toolId: 'website-faqs',
          outputResult: response,
          prompt: JSON.stringify(requestData)
        });
        console.log('✅ Website FAQs saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
    } catch (error) {
      console.error('Error generating FAQs:', error);
      alert('Error generating FAQs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const renderTemplatesTab = () => {
    return (
      <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-store text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">E-commerce FAQs</h4>
              <p className="text-xs text-blue-600">Common questions for online stores and product-based businesses.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-laptop text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">SaaS FAQs</h4>
              <p className="text-xs text-blue-600">Questions for software and subscription-based services.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-handshake text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Service Business FAQs</h4>
              <p className="text-xs text-blue-600">Questions for consultants and service providers.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-graduation-cap text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Educational FAQs</h4>
              <p className="text-xs text-blue-600">Questions for courses and educational institutions.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-heart text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Healthcare FAQs</h4>
              <p className="text-xs text-blue-600">Questions for medical practices and healthcare providers.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-utensils text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Restaurant FAQs</h4>
              <p className="text-xs text-blue-600">Questions for restaurants and food service businesses.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
      </div>
    );
  };

  const renderHistoryTab = () => {
    return (
      <div className="py-4 flex flex-col items-center justify-center text-center space-y-2">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <i className="fas fa-history text-blue-500 text-xl"></i>
        </div>
        <h3 className="text-blue-900 font-medium">History</h3>
        <p className="text-sm text-blue-700 max-w-md">View your previously generated FAQ pages.</p>
      </div>
    );
  };

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Header */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-question-circle text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Website FAQs</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create comprehensive FAQ sections for your website</p>
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
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Business Information</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="businessType">Business Type</label>
                          <select
                            id="businessType"
                            name="businessType"
                            value={inputs.businessType}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select your business type</option>
                            <option value="ecommerce">E-commerce</option>
                            <option value="saas">SaaS</option>
                            <option value="service">Service Business</option>
                            <option value="consulting">Consulting</option>
                            <option value="education">Education</option>
                            <option value="healthcare">Healthcare</option>
                            <option value="restaurant">Restaurant</option>
                            <option value="other">Other</option>
                          </select>
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
                            <option value="technology">Technology</option>
                            <option value="healthcare">Healthcare</option>
                            <option value="finance">Finance</option>
                            <option value="education">Education</option>
                            <option value="retail">Retail</option>
                            <option value="food">Food & Beverage</option>
                            <option value="manufacturing">Manufacturing</option>
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
                          placeholder="Describe your typical customers and their characteristics..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">FAQ Content Areas</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="commonQuestions">Common Customer Questions</label>
                        <textarea 
                          id="commonQuestions"
                          name="commonQuestions"
                          value={inputs.commonQuestions}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="What questions do customers frequently ask about your business?"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="productFeatures">Product/Service Features</label>
                        <textarea 
                          id="productFeatures"
                          name="productFeatures"
                          value={inputs.productFeatures}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Describe your main products or services and their key features..."
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="supportTopics">Support & Policy Topics</label>
                        <textarea 
                          id="supportTopics"
                          name="supportTopics"
                          value={inputs.supportTopics}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="What support topics, policies, or procedures should be covered?"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'templates' && renderTemplatesTab()}
              {activeTab === 'history' && (
                <div className="py-4">
                  <History toolName="Website FAQs" />
                </div>
              )}
            </div>
            
            {/* Results Section */}
            {result && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold text-green-900 flex items-center gap-2">
                    <i className="fas fa-check-circle text-green-600"></i>
                    FAQs Generated
                  </h4>
                  <button
                    onClick={() => handleCopy(JSON.stringify(result, null, 2))}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition-all"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy All
                      </>
                    )}
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <h5 className="font-medium text-green-900 mb-2">FAQ Title</h5>
                    <p className="text-green-800">{result.faq_title}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <h5 className="font-medium text-green-900 mb-2">FAQ Introduction</h5>
                    <p className="text-green-800">{result.faq_intro}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <h5 className="font-medium text-green-900 mb-2">FAQ Items</h5>
                    <div className="space-y-3">
                      {result.faqs.map((faq: FAQItem, index: number) => (
                        <div key={index} className="border border-green-200 rounded-lg p-3 bg-green-50">
                          <div className="flex items-start gap-2 mb-2">
                            <span className="flex-shrink-0 w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium">
                              {index + 1}
                            </span>
                            <h6 className="font-medium text-green-900">{faq.question}</h6>
                          </div>
                          <p className="text-green-800 ml-7">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <h5 className="font-medium text-green-900 mb-2">Product Features Section</h5>
                    <p className="text-green-800">{result.product_features_section}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <h5 className="font-medium text-green-900 mb-2">Support & Policy Section</h5>
                    <p className="text-green-800">{result.support_policy_section}</p>
                  </div>
                  
                  {result.notes && (
                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <h5 className="font-medium text-green-900 mb-2">Notes</h5>
                      <p className="text-green-800">{result.notes}</p>
                    </div>
                  )}
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
                  className={`px-5 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleGenerateFAQs}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate FAQs</span>
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
