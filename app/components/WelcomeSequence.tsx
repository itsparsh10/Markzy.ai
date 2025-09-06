'use client'

import { useState } from 'react';
import { ArrowLeft, Briefcase, Users, Footprints, Lightbulb, Target, Search, ShoppingBag, MessageSquare, ThumbsUp, FileText, History as HistoryIcon, Route, Clock, X, Save, Wand2 } from 'lucide-react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface WelcomeSequenceResult {
  overview: string;
  sequence: Array<{
    step: number;
    title: string;
    content: string;
    call_to_action: string;
  }>;
  tips: string;
}

export default function WelcomeSequence({ onBackClick }: { onBackClick: () => void }) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<WelcomeSequenceResult | null>(null);
  const [inputs, setInputs] = useState({
    businessName: '',
    industry: '',
    sequenceType: '',
    targetAudience: '',
    sequenceLength: '',
    mainGoal: '',
    keyMessages: '',
    callToAction: '',
    deliveryMethod: '',
    brandPersonality: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateWelcomeSequence = async () => {
    // Validate required fields
    const requiredFields = ['businessName', 'industry', 'sequenceType', 'targetAudience', 'sequenceLength', 'deliveryMethod', 'mainGoal', 'keyMessages', 'callToAction'];
    const missingFields = requiredFields.filter(field => !inputs[field as keyof typeof inputs]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const requestData = {
        business_name: inputs.businessName,
        industry: inputs.industry,
        sequence_type: inputs.sequenceType,
        target_audience: inputs.targetAudience,
        sequence_length: inputs.sequenceLength,
        delivery_method: inputs.deliveryMethod,
        main_goal: inputs.mainGoal,
        key_messages: inputs.keyMessages,
        primary_call_to_action: inputs.callToAction
      };

      const response = await aiToolsService.generateWelcomeSequence(requestData);
      setResult(response);
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Welcome Sequence',
          toolId: 'welcome-sequence',
          outputResult: response,
          prompt: JSON.stringify(requestData)
        });
        console.log('✅ Welcome sequence saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
    } catch (error) {
      console.error('Error generating welcome sequence:', error);
      alert('Failed to generate welcome sequence. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const renderTemplatesTab = () => {
    return (
      <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-envelope-open text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Email Welcome Series</h4>
              <p className="text-xs text-blue-600">Template for creating engaging email welcome sequences for new subscribers.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-user-plus text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Customer Onboarding</h4>
              <p className="text-xs text-blue-600">Template for welcoming new customers and guiding them through your product.</p>
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
              <h4 className="font-medium text-blue-900">Course Welcome Sequence</h4>
              <p className="text-xs text-blue-600">Template for welcoming students to online courses and educational programs.</p>
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
              <h4 className="font-medium text-blue-900">Service Welcome Package</h4>
              <p className="text-xs text-blue-600">Template for welcoming new service clients and setting expectations.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-mobile-alt text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">App Onboarding Flow</h4>
              <p className="text-xs text-blue-600">Template for creating welcome sequences for mobile app users.</p>
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
        <p className="text-sm text-blue-700 max-w-md">View your previously generated welcome sequences.</p>
      </div>
    );
  };

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Glassmorphic Header with blue gradient */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-envelope-open-text text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Welcome Sequence</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create engaging welcome sequences for new users</p>
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
                    Generate
                  </span>
                  {activeTab === 'generate' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>}
                </button>
                <button 
                  onClick={() => setActiveTab('templates')}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${activeTab === 'templates' ? 'text-blue-700 bg-blue-50/70' : 'text-blue-500 hover:text-blue-600'}`}
                >
                  <span className="flex items-center gap-2">
                    Templates
                  </span>
                  {activeTab === 'templates' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>}
                </button>
                <button 
                  onClick={() => setActiveTab('history')}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${activeTab === 'history' ? 'text-blue-700 bg-blue-50/70' : 'text-blue-500 hover:text-blue-600'}`}
                >
                  <span className="flex items-center gap-2">
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
                    <h4 className="text-base font-medium text-blue-900 mb-3">Business & Sequence Information</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="businessName">Business Name *</label>
                          <input
                            id="businessName"
                            name="businessName"
                            value={inputs.businessName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                            placeholder="Enter your business name"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="industry">Industry *</label>
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
                            <option value="consulting">Consulting</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="sequenceType">Sequence Type *</label>
                        <select
                          id="sequenceType"
                          name="sequenceType"
                          value={inputs.sequenceType}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                        >
                          <option value="">Select sequence type</option>
                          <option value="email">Email Welcome Series</option>
                          <option value="onboarding">Customer Onboarding</option>
                          <option value="course">Course Welcome</option>
                          <option value="service">Service Welcome</option>
                          <option value="app">App Onboarding</option>
                          <option value="newsletter">Newsletter Welcome</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="targetAudience">Target Audience *</label>
                        <textarea 
                          id="targetAudience"
                          name="targetAudience"
                          value={inputs.targetAudience}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Describe who will receive this welcome sequence (new subscribers, customers, users, etc.)..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Sequence Strategy & Content</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="sequenceLength">Sequence Length *</label>
                          <select
                            id="sequenceLength"
                            name="sequenceLength"
                            value={inputs.sequenceLength}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select length</option>
                            <option value="3">3-part sequence</option>
                            <option value="5">5-part sequence</option>
                            <option value="7">7-part sequence</option>
                            <option value="10">10-part sequence</option>
                            <option value="custom">Custom length</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="deliveryMethod">Delivery Method *</label>
                          <select
                            id="deliveryMethod"
                            name="deliveryMethod"
                            value={inputs.deliveryMethod}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select delivery</option>
                            <option value="daily">Daily</option>
                            <option value="every-other">Every Other Day</option>
                            <option value="weekly">Weekly</option>
                            <option value="immediate">Immediate Sequence</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="mainGoal">Main Goal of Sequence *</label>
                        <textarea 
                          id="mainGoal"
                          name="mainGoal"
                          value={inputs.mainGoal}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="What do you want to achieve with this welcome sequence? (e.g., build trust, educate, onboard, convert)"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="keyMessages">Key Messages to Convey *</label>
                        <textarea 
                          id="keyMessages"
                          name="keyMessages"
                          value={inputs.keyMessages}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="What important information, values, or benefits do you want to communicate?"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="callToAction">Primary Call to Action *</label>
                        <input
                          id="callToAction"
                          name="callToAction"
                          value={inputs.callToAction}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          placeholder="What action do you want recipients to take? (e.g., book a call, browse products, complete profile)"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Results Section */}
                  {result && (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="text-base font-medium text-green-900 mb-3">Generated Welcome Sequence</h4>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="block text-xs font-semibold text-green-900">Overview</label>
                            <button
                              onClick={() => copyToClipboard(result.overview)}
                              className="text-xs text-green-600 hover:text-green-800 transition-colors"
                            >
                              <i className="fas fa-copy mr-1"></i>Copy
                            </button>
                          </div>
                          <div className="p-3 bg-white rounded border border-green-200 text-sm text-green-900">
                            {result.overview}
                          </div>
                        </div>

                        {result.sequence && result.sequence.length > 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="block text-xs font-semibold text-green-900">Email Sequence</label>
                              <button
                                onClick={() => copyToClipboard(result.sequence.map(step => `Step ${step.step}: ${step.title}\n\n${step.content}\n\nCall to Action: ${step.call_to_action}`).join('\n\n---\n\n'))}
                                className="text-xs text-green-600 hover:text-green-800 transition-colors"
                              >
                                <i className="fas fa-copy mr-1"></i>Copy All
                              </button>
                            </div>
                            <div className="space-y-3">
                              {result.sequence.map((step, index) => (
                                <div key={index} className="p-3 bg-white rounded border border-green-200">
                                  <div className="flex items-center justify-between mb-2">
                                    <h5 className="text-sm font-semibold text-green-900">Step {step.step}: {step.title}</h5>
                                    <button
                                      onClick={() => copyToClipboard(`Step ${step.step}: ${step.title}\n\n${step.content}\n\nCall to Action: ${step.call_to_action}`)}
                                      className="text-xs text-green-600 hover:text-green-800 transition-colors"
                                    >
                                      <i className="fas fa-copy mr-1"></i>Copy Step
                                    </button>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="text-sm text-green-900">
                                      <strong>Content:</strong><br />
                                      {step.content}
                                    </div>
                                    <div className="text-sm text-green-900">
                                      <strong>Call to Action:</strong><br />
                                      {step.call_to_action}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {result.tips && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="block text-xs font-semibold text-green-900">Tips & Best Practices</label>
                              <button
                                onClick={() => copyToClipboard(result.tips)}
                                className="text-xs text-green-600 hover:text-green-800 transition-colors"
                              >
                                <i className="fas fa-copy mr-1"></i>Copy
                              </button>
                            </div>
                            <div className="p-3 bg-white rounded border border-green-200 text-sm text-green-900">
                              {result.tips}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'templates' && renderTemplatesTab()}
              {activeTab === 'history' && (
                <div className="py-4">
                  <History toolName="Welcome Sequence" />
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
                  onClick={handleGenerateWelcomeSequence}
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
                      <span>Generate Welcome Sequence</span>
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
