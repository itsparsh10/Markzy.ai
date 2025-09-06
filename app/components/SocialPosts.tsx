'use client'

import { useState } from 'react';
import { ArrowLeft, Briefcase, Users, Footprints, Lightbulb, Target, Search, ShoppingBag, MessageSquare, ThumbsUp, FileText, History as HistoryIcon, Route, Clock, X, Save, Wand2 } from 'lucide-react';
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

const SectionCard: React.FC<{ title: string; icon?: React.ElementType; children: React.ReactNode }> = ({ title, icon: Icon, children }) => (
  <div className="bg-blue-50 p-3 rounded-lg shadow-sm border border-blue-100 mb-6">
    <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center">
      {title}
    </h3>
    {children}
  </div>
);

export default function SocialPosts({ onBackClick }: { onBackClick: () => void }) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [inputs, setInputs] = useState({
    productService: '',
    targetAudience: '',
    keyBenefits: '',
    platformFocus: '',
    contentTone: '',
    postGoals: '',
    callToAction: '',
    brandPersonality: '',
  });

  // API state management
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError('');
    setResults(null);

    try {
      // Map component inputs to API field names
      const apiData = {
        primary_platform: inputs.platformFocus,
        content_tone: inputs.contentTone,
        post_goals: inputs.postGoals,
        brand_personality: inputs.brandPersonality,
        call_to_action: inputs.callToAction,
        product_service_description: inputs.productService,
        target_audience: inputs.targetAudience,
        key_benefits_features: inputs.keyBenefits,
      };

      console.log('Generating social posts with data:', apiData);
      const response = await aiToolsService.generateSocialPosts(apiData);
      console.log('API Response:', response);
      setResults(response);
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Social Posts',
          toolId: 'social-posts',
          outputResult: response,
          prompt: JSON.stringify(apiData)
        });
        console.log('✅ Social posts saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
    } catch (err: any) {
      console.error('Error generating social posts:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to generate posts. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
      console.log(`${label} copied to clipboard`);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const renderGenerateTab = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-3 rounded-lg shadow-sm border border-blue-100 mb-6">
        <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center">
          Product & Audience Information
        </h3>
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="productService">Product/Service Description</label>
          <textarea 
            id="productService"
            name="productService"
            value={inputs.productService}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
            placeholder="Describe your product or service that you want to promote on social media..."
          ></textarea>
        </div>
        <div className="space-y-2 mt-4">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="targetAudience">Target Audience</label>
          <textarea 
            id="targetAudience"
            name="targetAudience"
            value={inputs.targetAudience}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
            placeholder="Who is your ideal customer? (demographics, interests, pain points, etc.)"
          ></textarea>
        </div>
        <div className="space-y-2 mt-4">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="keyBenefits">Key Benefits & Features</label>
          <textarea 
            id="keyBenefits"
            name="keyBenefits"
            value={inputs.keyBenefits}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
            placeholder="What are the main benefits and features your audience should know about?"
          ></textarea>
        </div>
      </div>

      <div className="bg-blue-50 p-3 rounded-lg shadow-sm border border-blue-100 mb-6">
        <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center">
          Social Media Strategy
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-blue-900" htmlFor="platformFocus">Primary Platform Focus</label>
            <select
              id="platformFocus"
              name="platformFocus"
              value={inputs.platformFocus}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
            >
              <option value="">Select primary platform</option>
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
              <option value="Twitter">Twitter</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Pinterest">Pinterest</option>
              <option value="TikTok">TikTok</option>
              <option value="Multiple">Multiple Platforms</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-blue-900" htmlFor="contentTone">Content Tone</label>
            <select
              id="contentTone"
              name="contentTone"
              value={inputs.contentTone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
            >
              <option value="">Select tone</option>
              <option value="Professional">Professional</option>
              <option value="Friendly">Friendly & Casual</option>
              <option value="Inspiring">Inspiring</option>
              <option value="Educational">Educational</option>
              <option value="Entertaining">Entertaining</option>
              <option value="Authoritative">Authoritative</option>
            </select>
          </div>
        </div>
        <div className="space-y-2 mt-4">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="postGoals">Post Goals & Objectives</label>
          <textarea 
            id="postGoals"
            name="postGoals"
            value={inputs.postGoals}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
            placeholder="What do you want to achieve with these posts? (awareness, engagement, sales, leads, etc.)"
          ></textarea>
        </div>
      </div>

      <div className="bg-blue-50 p-3 rounded-lg shadow-sm border border-blue-100 mb-6">
        <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center">
          Brand Voice & Call-to-Action
        </h3>
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="brandPersonality">Brand Personality</label>
          <textarea 
            id="brandPersonality"
            name="brandPersonality"
            value={inputs.brandPersonality}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
            placeholder="How would you describe your brand's personality and voice?"
          ></textarea>
        </div>
        <div className="space-y-2 mt-4">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="callToAction">Desired Call-to-Action</label>
          <textarea 
            id="callToAction"
            name="callToAction"
            value={inputs.callToAction}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
            placeholder="What action do you want your audience to take? (visit website, buy now, learn more, etc.)"
          ></textarea>
        </div>
      </div>
    </div>
  );

  const renderTemplatesTab = () => (
    <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
      <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
            <i className="fas fa-thumbs-up text-blue-600"></i>
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Engagement Posts</h4>
            <p className="text-xs text-blue-600">Create posts designed to increase likes, comments, and shares.</p>
          </div>
        </div>
        <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
      </div>
      
      <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
            <i className="fas fa-shopping-cart text-blue-600"></i>
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Sales Posts</h4>
            <p className="text-xs text-blue-600">Generate posts focused on driving conversions and sales.</p>
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
            <h4 className="font-medium text-blue-900">Educational Posts</h4>
            <p className="text-xs text-blue-600">Create informative posts that educate your audience.</p>
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
            <h4 className="font-medium text-blue-900">Brand Story Posts</h4>
            <p className="text-xs text-blue-600">Share your brand's story and build emotional connections.</p>
          </div>
        </div>
        <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
      </div>
      
      <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
            <i className="fas fa-question-circle text-blue-600"></i>
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Question Posts</h4>
            <p className="text-xs text-blue-600">Generate engaging questions to spark conversations.</p>
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
      <h3 className="text-blue-900 font-medium">Post History</h3>
      <p className="text-sm text-blue-700 max-w-md">View your previously generated social media posts.</p>
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
              <i className="fas fa-thumbs-up text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Social Posts</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create engaging social media posts for all platforms</p>
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
                  {renderGenerateTab()}
                </div>
              )}
              {activeTab === 'templates' && renderTemplatesTab()}
              {activeTab === 'history' && (
                <div className="py-4">
                  <History toolName="Social Posts" />
                </div>
              )}
            </div>
            
            {/* Generate Button and Results */}
            {activeTab === 'generate' && (
              <div className="px-4 py-3 border-t border-blue-100">
                {/* Error Display */}
                {error && (
                  <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-red-700">
                      <i className="fas fa-exclamation-triangle text-sm"></i>
                      <span className="text-sm font-medium">{error}</span>
                    </div>
                  </div>
                )}

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full px-5 py-3 text-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <i className="fas fa-spinner fa-spin text-sm"></i>
                      <span>Generating Posts...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Posts</span>
                      <i className="fas fa-arrow-right text-xs"></i>
                    </>
                  )}
                </button>

                {/* Results Display */}
                {results && (
                  <div className="mt-4 space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="text-base font-medium text-green-900 mb-3 flex items-center gap-2">
                        <i className="fas fa-check-circle text-green-600"></i>
                        Generated Social Post
                      </h4>
                      
                      {/* Platform */}
                      {results.platform && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-sm font-semibold text-green-800">Platform</h5>
                          </div>
                          <div className="p-3 bg-white border border-green-200 rounded text-sm text-green-900">
                            {results.platform}
                          </div>
                        </div>
                      )}

                      {/* Post Text */}
                      {results.post_text && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-sm font-semibold text-green-800">Post Text</h5>
                            <button
                              onClick={() => copyToClipboard(results.post_text, 'Post text')}
                              className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-all flex items-center gap-1"
                            >
                              <i className="fas fa-copy text-xs"></i>
                              Copy
                            </button>
                          </div>
                          <div className="p-3 bg-white border border-green-200 rounded text-sm text-green-900">
                            {results.post_text}
                          </div>
                        </div>
                      )}

                      {/* Suggested Hashtags */}
                      {results.suggested_hashtags && results.suggested_hashtags.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-sm font-semibold text-green-800">Suggested Hashtags</h5>
                            <button
                              onClick={() => copyToClipboard(results.suggested_hashtags.join(' '), 'Hashtags')}
                              className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-all flex items-center gap-1"
                            >
                              <i className="fas fa-copy text-xs"></i>
                              Copy All
                            </button>
                          </div>
                          <div className="p-3 bg-white border border-green-200 rounded">
                            <div className="flex flex-wrap gap-2">
                              {results.suggested_hashtags.map((hashtag: string, index: number) => (
                                <span key={index} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                  {hashtag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Call to Action */}
                      {results.call_to_action && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-sm font-semibold text-green-800">Call to Action</h5>
                            <button
                              onClick={() => copyToClipboard(results.call_to_action, 'Call to action')}
                              className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-all flex items-center gap-1"
                            >
                              <i className="fas fa-copy text-xs"></i>
                              Copy
                            </button>
                          </div>
                          <div className="p-3 bg-white border border-green-200 rounded text-sm text-green-900">
                            {results.call_to_action}
                          </div>
                        </div>
                      )}

                      {/* Post Ideas */}
                      {results.post_ideas && results.post_ideas.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-sm font-semibold text-green-800">Additional Post Ideas</h5>
                            <button
                              onClick={() => copyToClipboard(results.post_ideas.join('\n'), 'Post ideas')}
                              className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-all flex items-center gap-1"
                            >
                              <i className="fas fa-copy text-xs"></i>
                              Copy All
                            </button>
                          </div>
                          <div className="p-3 bg-white border border-green-200 rounded">
                            <ul className="space-y-2">
                              {results.post_ideas.map((idea: string, index: number) => (
                                <li key={index} className="text-sm text-green-900 flex items-start gap-2">
                                  <span className="text-green-600 mt-1">•</span>
                                  <span>{idea}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
