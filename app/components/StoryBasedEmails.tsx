'use client'

import { useState } from 'react';
import { ArrowLeft, Briefcase, Users, Footprints, Lightbulb, Target, Search, ShoppingBag, MessageSquare, ThumbsUp, FileText, History as HistoryIcon, Route, Clock, X, Save, Wand2, Copy, Check } from 'lucide-react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface InputFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  type?: 'text' | 'textarea' | 'select' | 'number';
  options?: string[];
  placeholder?: string;
  Icon?: React.ElementType;
  rows?: number;
}

const InputField: React.FC<InputFieldProps> = ({ label, id, value, onChange, type = 'text', options, placeholder, Icon, rows = 3 }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {Icon && <Icon className="inline-block w-4 h-4 mr-2 text-blue-600" />} {label}
    </label>
    {type === 'textarea' ? (
      <textarea
        id={id}
        name={id}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
      />
    ) : type === 'select' ? (
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options?.map(option => <option key={option} value={option}>{option}</option>)}
      </select>
    ) : (
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
      />
    )}
  </div>
);

export default function StoryBasedEmails({ onBackClick }: { onBackClick: () => void }) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [inputs, setInputs] = useState({
    businessType: '',
    targetAudience: '',
    brandStory: '',
    foundingStory: '',
    challengeStory: '',
    successStory: '',
    customerStory: '',
    emailSequenceType: '',
    emailTone: '',
    emailGoal: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateEmails = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      // Map form inputs to API field names
      const apiData = {
        business_type: inputs.businessType,
        email_sequence_type: inputs.emailSequenceType,
        target_audience: inputs.targetAudience,
        brand_story: inputs.brandStory,
        founding_story: inputs.foundingStory,
        challenge_story: inputs.challengeStory,
        email_tone: inputs.emailTone,
        primary_email_goal: inputs.emailGoal,
        success_story: inputs.successStory,
      };

      const response = await aiToolsService.generateStoryBasedEmails(apiData);
      setResults(response);
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Story Based Emails',
          toolId: 'story-based-emails',
          outputResult: response,
          prompt: JSON.stringify(apiData)
        });
        console.log('✅ Story based emails saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to generate emails');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const renderTemplatesTab = () => (
    <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
      <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
            <i className="fas fa-envelope text-blue-600"></i>
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Welcome Email Series</h4>
            <p className="text-xs text-blue-600">Story-based welcome emails to introduce your brand and build connection.</p>
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
            <h4 className="font-medium text-blue-900">Nurture Sequence</h4>
            <p className="text-xs text-blue-600">Build relationships through authentic storytelling and value delivery.</p>
          </div>
        </div>
        <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
      </div>
      
      <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
            <i className="fas fa-dollar-sign text-blue-600"></i>
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Sales Story Emails</h4>
            <p className="text-xs text-blue-600">Convert prospects using compelling story-driven sales sequences.</p>
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
            <h4 className="font-medium text-blue-900">Educational Story Series</h4>
            <p className="text-xs text-blue-600">Teach through stories that demonstrate expertise and build authority.</p>
          </div>
        </div>
        <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
      </div>
      
      <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
            <i className="fas fa-users text-blue-600"></i>
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Customer Success Stories</h4>
            <p className="text-xs text-blue-600">Share customer transformations and build social proof through stories.</p>
          </div>
        </div>
        <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
      </div>
    </div>
  );

  const renderHistoryTab = () => (
    <div className="py-4 flex flex-col items-center justify-center text-center space-y-2">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
        <i className="fas fa-history text-blue-500 text-xl"></i>
      </div>
      <h3 className="text-blue-900 font-medium">Email History</h3>
      <p className="text-sm text-blue-700 max-w-md">View your previously generated story-based email sequences.</p>
      <button className="mt-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 hover:bg-blue-100 transition-all duration-200 text-sm">
        <i className="fas fa-clock mr-2"></i>View History
      </button>
    </div>
  );

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Glassmorphic Header with blue gradient */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-envelope text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Story-Based Emails</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create compelling email sequences using storytelling</p>
            </div>
            <div className="flex items-center gap-3 z-10">
              <span className="text-xs bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/30 flex items-center font-semibold text-white/90">
                <i className="fas fa-clock mr-1"></i> 6 min
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
                      <div className="flex items-center gap-2 text-red-800">
                        <i className="fas fa-exclamation-triangle text-sm"></i>
                        <span className="text-sm font-medium">{error}</span>
                      </div>
                    </div>
                  )}

                  {/* Loading State */}
                  {loading && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-3 text-blue-800">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        <span className="text-sm font-medium">Generating your story-based email sequence...</span>
                      </div>
                    </div>
                  )}

                  {/* Results Display */}
                  {results && !loading && (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="text-lg font-semibold text-green-900 mb-3">{results.sequence_title}</h4>
                        <div className="space-y-4">
                          {results.emails && results.emails.map((email: any, index: number) => (
                            <div key={index} className="p-4 bg-white border border-green-200 rounded-lg">
                              <div className="flex items-center justify-between mb-3">
                                <h5 className="font-medium text-green-900">Email {index + 1}: {email.subject}</h5>
                                <button
                                  onClick={() => copyToClipboard(`${email.subject}\n\n${email.body}`, index)}
                                  className="flex items-center gap-1 px-2 py-1 text-xs text-green-700 bg-green-100 rounded hover:bg-green-200 transition-all"
                                >
                                  {copiedIndex === index ? (
                                    <>
                                      <Check className="w-3 h-3" />
                                      Copied!
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      Copy
                                    </>
                                  )}
                                </button>
                              </div>
                              <div className="space-y-2">
                                <div>
                                  <span className="text-xs font-semibold text-green-700">Subject:</span>
                                  <p className="text-sm text-green-900 mt-1">{email.subject}</p>
                                </div>
                                <div>
                                  <span className="text-xs font-semibold text-green-700">Body:</span>
                                  <p className="text-sm text-green-900 mt-1 whitespace-pre-wrap">{email.body}</p>
                                </div>
                                <div>
                                  <span className="text-xs font-semibold text-green-700">Story Type:</span>
                                  <p className="text-sm text-green-900 mt-1 capitalize">{email.story_type}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Form Inputs */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Business & Brand Information</h4>
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
                            <option value="coaching">Coaching</option>
                            <option value="consulting">Consulting</option>
                            <option value="ecommerce">E-commerce</option>
                            <option value="saas">SaaS</option>
                            <option value="agency">Agency</option>
                            <option value="freelance">Freelance</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="emailSequenceType">Email Sequence Type</label>
                          <select
                            id="emailSequenceType"
                            name="emailSequenceType"
                            value={inputs.emailSequenceType}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select sequence type</option>
                            <option value="welcome">Welcome Series</option>
                            <option value="nurture">Nurture Sequence</option>
                            <option value="sales">Sales Sequence</option>
                            <option value="educational">Educational Series</option>
                            <option value="onboarding">Onboarding</option>
                            <option value="reengagement">Re-engagement</option>
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
                          placeholder="Describe your target audience (demographics, interests, challenges, goals)..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Your Stories</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="brandStory">Brand Story</label>
                        <textarea 
                          id="brandStory"
                          name="brandStory"
                          value={inputs.brandStory}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Tell the story of your brand's mission and why you started..."
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="foundingStory">Founding Story</label>
                        <textarea 
                          id="foundingStory"
                          name="foundingStory"
                          value={inputs.foundingStory}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Share how and why you founded your business..."
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="challengeStory">Challenge/Struggle Story</label>
                        <textarea 
                          id="challengeStory"
                          name="challengeStory"
                          value={inputs.challengeStory}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Describe a challenge you overcame and what you learned..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Email Configuration</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="emailTone">Email Tone</label>
                          <select
                            id="emailTone"
                            name="emailTone"
                            value={inputs.emailTone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select tone</option>
                            <option value="conversational">Conversational</option>
                            <option value="professional">Professional</option>
                            <option value="friendly">Friendly</option>
                            <option value="inspirational">Inspirational</option>
                            <option value="educational">Educational</option>
                            <option value="humorous">Humorous</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="emailGoal">Primary Email Goal</label>
                          <select
                            id="emailGoal"
                            name="emailGoal"
                            value={inputs.emailGoal}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select primary goal</option>
                            <option value="build_trust">Build Trust</option>
                            <option value="educate">Educate</option>
                            <option value="sell">Sell Product/Service</option>
                            <option value="nurture">Nurture Relationship</option>
                            <option value="engage">Increase Engagement</option>
                            <option value="retention">Customer Retention</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="successStory">Success/Transformation Story</label>
                        <textarea 
                          id="successStory"
                          name="successStory"
                          value={inputs.successStory}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Share a success story or transformation you've experienced or helped create..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'templates' && renderTemplatesTab()}
              {activeTab === 'history' && (
                <div className="py-4">
                  <History toolName="Story Based Emails" />
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
                  className="px-4 py-2 text-sm text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  Save Draft
                </button>
                <button 
                  onClick={handleGenerateEmails}
                  disabled={loading}
                  className="px-5 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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
