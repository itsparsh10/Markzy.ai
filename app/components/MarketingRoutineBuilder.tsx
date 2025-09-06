'use client';

import React, { useState } from 'react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface MarketingRoutineBuilderProps {
  onBackClick: () => void;
}

export default function MarketingRoutineBuilder({ onBackClick }: MarketingRoutineBuilderProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    businessGoal: '',
    timeAvailable: '',
    marketingExperience: '',
    businessType: '',
    targetAudience: '',
    currentChannels: '',
    biggestChallenge: '',
    preferredActivities: '',
    budget: ''
  });

  // Routine template types with appropriate icons
  const routineTypes = [
    { name: "Daily Quick Win", icon: "fas fa-sun", description: "15-30 minute daily marketing activities for consistent growth." },
    { name: "Weekly Deep Dive", icon: "fas fa-calendar-week", description: "Comprehensive weekly marketing strategy and execution." },
    { name: "Content Creation", icon: "fas fa-pen", description: "Structured routine for creating and distributing content." },
    { name: "Social Media Focus", icon: "fas fa-hashtag", description: "Daily social media engagement and posting routine." },
    { name: "Email Marketing", icon: "fas fa-envelope", description: "Weekly email marketing strategy and campaign routine." },
    { name: "Lead Generation", icon: "fas fa-magnet", description: "Systematic approach to generating and nurturing leads." }
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
        'businessGoal',
        'timeAvailable',
        'marketingExperience',
        'businessType',
        'targetAudience',
        'currentChannels',
        'biggestChallenge'
      ];
      
      const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      // Map form inputs to API fields with proper value mapping
      const apiData = {
        primary_business_goal: formData.businessGoal === 'increase-awareness' ? 'Increase Brand Awareness' :
                              formData.businessGoal === 'generate-leads' ? 'Generate More Leads' :
                              formData.businessGoal === 'boost-sales' ? 'Boost Sales & Revenue' :
                              formData.businessGoal === 'grow-audience' ? 'Grow Social Media Following' :
                              formData.businessGoal === 'improve-retention' ? 'Improve Customer Retention' :
                              formData.businessGoal === 'launch-product' ? 'Launch New Product/Service' :
                              formData.businessGoal,
        business_type: formData.businessType === 'ecommerce' ? 'E-commerce' :
                      formData.businessType === 'saas' ? 'SaaS/Software' :
                      formData.businessType === 'consulting' ? 'Consulting/Services' :
                      formData.businessType === 'local-business' ? 'Local Business' :
                      formData.businessType === 'content-creator' ? 'Content Creator' :
                      formData.businessType === 'b2b' ? 'B2B Company' :
                      formData.businessType === 'nonprofit' ? 'Nonprofit' :
                      formData.businessType,
        target_audience: formData.targetAudience,
        time_available: formData.timeAvailable === '15-30-min' ? '15-30 minutes daily' :
                       formData.timeAvailable === '30-60-min' ? '30-60 minutes daily' :
                       formData.timeAvailable === '1-2-hours' ? '1-2 hours daily' :
                       formData.timeAvailable === '2-4-hours' ? '2-4 hours daily' :
                       formData.timeAvailable === '4-plus-hours' ? '4+ hours daily' :
                       formData.timeAvailable,
        marketing_experience: formData.marketingExperience === 'beginner' ? 'Beginner' :
                             formData.marketingExperience === 'intermediate' ? 'Intermediate' :
                             formData.marketingExperience === 'advanced' ? 'Advanced' :
                             formData.marketingExperience === 'expert' ? 'Expert' :
                             formData.marketingExperience,
        current_marketing_channels: formData.currentChannels,
        biggest_marketing_challenge: formData.biggestChallenge,
        preferred_activities: formData.preferredActivities || '',
        budget: formData.budget || ''
      };

      console.log('Sending marketing routine API data:', apiData);
      const response = await aiToolsService.generateMarketingRoutine(apiData);
      setResult(response);
      
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Marketing Routine Builder',
          toolId: 'marketing-routine-builder',
          outputResult: response,
          prompt: JSON.stringify(apiData)
        });
        console.log('✅ Marketing routine builder saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
    } catch (err: any) {
      console.error('Error generating marketing routine:', err);
      setError(err.message || 'Failed to generate marketing routine. Please try again.');
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
              <i className="fas fa-tasks text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Marketing Routine Builder</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create a personalized marketing routine that fits your schedule</p>
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
                          Marketing Routine Generated
                        </h4>
                        <button
                          onClick={() => {
                            const fullContent = `Routine Title: ${result.routine_title}\n\nSummary: ${result.summary}\n\nDaily Tasks:\n${result.daily_tasks?.map((task: string, index: number) => `${index + 1}. ${task}`).join('\n') || ''}\n\nWeekly Tasks:\n${result.weekly_tasks?.map((task: string, index: number) => `${index + 1}. ${task}`).join('\n') || ''}\n\nTips:\n${result.tips?.map((tip: string, index: number) => `${index + 1}. ${tip}`).join('\n') || ''}`;
                            copyToClipboard(fullContent);
                          }}
                          className="px-3 py-1.5 text-sm text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition-all flex items-center gap-1"
                        >
                          <i className="fas fa-copy text-xs"></i>
                          Copy All
                        </button>
                      </div>

                      <div className="space-y-4">
                        {/* Routine Title */}
                        <div className="p-3 bg-white rounded-lg border border-green-200">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-green-900 flex items-center gap-2">
                              <i className="fas fa-tasks text-green-600 text-sm"></i>
                              Routine Title
                            </h5>
                            <button
                              onClick={() => copyToClipboard(result.routine_title)}
                              className="text-xs text-green-600 hover:text-green-800"
                            >
                              <i className="fas fa-copy"></i>
                            </button>
                          </div>
                          <p className="text-green-800 font-medium">{result.routine_title}</p>
                        </div>

                        {/* Summary */}
                        <div className="p-3 bg-white rounded-lg border border-green-200">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-green-900 flex items-center gap-2">
                              <i className="fas fa-align-left text-green-600 text-sm"></i>
                              Routine Summary
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

                        {/* Daily Tasks */}
                        {result.daily_tasks && result.daily_tasks.length > 0 && (
                          <div className="p-3 bg-white rounded-lg border border-green-200">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-semibold text-green-900 flex items-center gap-2">
                                <i className="fas fa-calendar-day text-green-600 text-sm"></i>
                                Daily Tasks
                              </h5>
                              <button
                                onClick={() => copyToClipboard(result.daily_tasks.join('\n'))}
                                className="text-xs text-green-600 hover:text-green-800"
                              >
                                <i className="fas fa-copy"></i>
                              </button>
                            </div>
                            <div className="space-y-2">
                              {result.daily_tasks.map((task: string, index: number) => (
                                <div key={index} className="p-2 bg-green-50 rounded border-l-4 border-green-300">
                                  <p className="text-green-800 text-sm">
                                    <span className="font-medium">Task {index + 1}:</span> {task}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Weekly Tasks */}
                        {result.weekly_tasks && result.weekly_tasks.length > 0 && (
                          <div className="p-3 bg-white rounded-lg border border-green-200">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-semibold text-green-900 flex items-center gap-2">
                                <i className="fas fa-calendar-week text-green-600 text-sm"></i>
                                Weekly Tasks
                              </h5>
                              <button
                                onClick={() => copyToClipboard(result.weekly_tasks.join('\n'))}
                                className="text-xs text-green-600 hover:text-green-800"
                              >
                                <i className="fas fa-copy"></i>
                              </button>
                            </div>
                            <div className="space-y-2">
                              {result.weekly_tasks.map((task: string, index: number) => (
                                <div key={index} className="p-2 bg-green-50 rounded border-l-4 border-green-300">
                                  <p className="text-green-800 text-sm">
                                    <span className="font-medium">Task {index + 1}:</span> {task}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Tips */}
                        {result.tips && result.tips.length > 0 && (
                          <div className="p-3 bg-white rounded-lg border border-green-200">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-semibold text-green-900 flex items-center gap-2">
                                <i className="fas fa-lightbulb text-green-600 text-sm"></i>
                                Pro Tips
                              </h5>
                              <button
                                onClick={() => copyToClipboard(result.tips.join('\n'))}
                                className="text-xs text-green-600 hover:text-green-800"
                              >
                                <i className="fas fa-copy"></i>
                              </button>
                            </div>
                            <div className="space-y-2">
                              {result.tips.map((tip: string, index: number) => (
                                <div key={index} className="p-2 bg-green-50 rounded border-l-4 border-green-300">
                                  <p className="text-green-800 text-sm">
                                    <span className="font-medium">Tip {index + 1}:</span> {tip}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Business & Goal Information</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="businessGoal">Primary Business Goal</label>
                          <select
                            id="businessGoal"
                            name="businessGoal"
                            value={formData.businessGoal}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select your main goal</option>
                            <option value="increase-awareness">Increase Brand Awareness</option>
                            <option value="generate-leads">Generate More Leads</option>
                            <option value="boost-sales">Boost Sales & Revenue</option>
                            <option value="grow-audience">Grow Social Media Following</option>
                            <option value="improve-retention">Improve Customer Retention</option>
                            <option value="launch-product">Launch New Product/Service</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="timeAvailable">Time Available</label>
                          <select
                            id="timeAvailable"
                            name="timeAvailable"
                            value={formData.timeAvailable}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select time commitment</option>
                            <option value="15-30-min">15-30 minutes daily</option>
                            <option value="30-60-min">30-60 minutes daily</option>
                            <option value="1-2-hours">1-2 hours daily</option>
                            <option value="2-4-hours">2-4 hours daily</option>
                            <option value="4-plus-hours">4+ hours daily</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="businessType">Business Type</label>
                          <select
                            id="businessType"
                            name="businessType"
                            value={formData.businessType}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select business type</option>
                            <option value="ecommerce">E-commerce</option>
                            <option value="saas">SaaS/Software</option>
                            <option value="consulting">Consulting/Services</option>
                            <option value="local-business">Local Business</option>
                            <option value="content-creator">Content Creator</option>
                            <option value="b2b">B2B Company</option>
                            <option value="nonprofit">Nonprofit</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="marketingExperience">Marketing Experience</label>
                          <select
                            id="marketingExperience"
                            name="marketingExperience"
                            value={formData.marketingExperience}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select experience level</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                            <option value="expert">Expert</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="targetAudience">Target Audience</label>
                        <textarea 
                          id="targetAudience"
                          name="targetAudience"
                          value={formData.targetAudience}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="Describe your ideal customers and target audience..."
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="currentChannels">Current Marketing Channels</label>
                        <textarea 
                          id="currentChannels"
                          name="currentChannels"
                          value={formData.currentChannels}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="What marketing channels are you currently using? (social media, email, content, etc.)"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="biggestChallenge">Biggest Marketing Challenge</label>
                        <textarea 
                          id="biggestChallenge"
                          name="biggestChallenge"
                          value={formData.biggestChallenge}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="What's your biggest challenge in marketing right now?"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && (
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {routineTypes.map((routineType, index) => (
                    <div key={index} className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
                            <i className={`${routineType.icon} text-blue-600`}></i>
                          </div>
                          <div>
                            <h4 className="font-medium text-blue-900">{routineType.name}</h4>
                            <p className="text-xs text-blue-600">{routineType.description}</p>
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
                  <History toolName="Marketing Routine Builder" />
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
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>Build Routine</span>
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
