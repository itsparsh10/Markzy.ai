'use client'

import { useState } from 'react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface GeneralGroupCommunityPostsProps {
  onBackClick: () => void;
}

export default function GeneralGroupCommunityPosts({ onBackClick }: GeneralGroupCommunityPostsProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [inputs, setInputs] = useState({
    groupType: '',
    communityName: '',
    communityPurpose: '',
    targetAudience: '',
    communityGuidelines: '',
    engagementGoals: '',
    contentThemes: '',
    postFrequency: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<any>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Community post template types with appropriate icons
  const postTypes = [
    { name: "Welcome Post", icon: "fas fa-hand-peace", description: "Create warm welcome posts for new community members." },
    { name: "Engagement Post", icon: "fas fa-comments", description: "Generate posts to spark discussion and interaction." },
    { name: "Guidelines Post", icon: "fas fa-list-ul", description: "Outline community rules and best practices." },
    { name: "Q&A Post", icon: "fas fa-question-circle", description: "Create question and answer style posts." },
    { name: "Challenge Post", icon: "fas fa-trophy", description: "Design community challenges and activities." },
    { name: "Resource Sharing", icon: "fas fa-share-alt", description: "Share valuable resources with the community." }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGeneratePosts = async () => {
    // Validate required fields
    const requiredFields = ['groupType', 'communityName', 'communityPurpose', 'targetAudience', 'engagementGoals', 'postFrequency', 'contentThemes'];
    const missingFields = requiredFields.filter(field => !inputs[field as keyof typeof inputs]);
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsLoading(true);
    setError('');
    setResults(null);

    try {
      // Map form inputs to API field names
      const apiData = {
        group_type: inputs.groupType,
        community_name: inputs.communityName,
        community_purpose: inputs.communityPurpose,
        target_audience: inputs.targetAudience,
        engagement_goals: inputs.engagementGoals,
        post_frequency: inputs.postFrequency,
        content_themes: inputs.contentThemes
      };

      console.log('Sending API data:', apiData); // Debug log

      const response = await aiToolsService.generateGeneralGroupCommunityPosts(apiData);
      setResults(response);
      
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'General Group Community Posts',
          toolId: 'general-group-community-posts',
          outputResult: response,
          prompt: JSON.stringify(apiData)
        });
        console.log('✅ General group community posts saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
    } catch (err: any) {
      console.error('Error generating community posts:', err);
      setError(err.response?.data?.message || err.message || 'Failed to generate community posts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const renderTemplatesTab = () => {
    return (
      <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
        {postTypes.map((postType, index) => (
          <div key={index} className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
                  <i className={`${postType.icon} text-blue-600`}></i>
                </div>
                <div>
                  <h4 className="font-medium text-blue-900">{postType.name}</h4>
                  <p className="text-xs text-blue-600">{postType.description}</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setInputs(prev => ({...prev, groupType: postType.name}));
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
    );
  };

  const renderResults = () => {
    if (!results) return null;

    return (
      <div className="space-y-4 mt-4">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-green-800 mb-3 flex items-center gap-2">
            <i className="fas fa-check-circle text-green-600"></i>
            Community Post Generated Successfully!
          </h4>
          
          {/* Post Title */}
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-green-800 flex items-center gap-2">
                  <i className="fas fa-heading text-green-600"></i>
                  Post Title
                </h5>
                <button
                  onClick={() => copyToClipboard(results.post_title, 'title')}
                  className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all flex items-center gap-1"
                >
                  {copiedField === 'title' ? (
                    <>
                      <i className="fas fa-check"></i>
                      Copied!
                    </>
                  ) : (
                    <>
                      <i className="fas fa-copy"></i>
                      Copy
                    </>
                  )}
                </button>
              </div>
              <p className="text-green-900 font-medium">{results.post_title}</p>
            </div>

            {/* Post Body */}
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-green-800 flex items-center gap-2">
                  <i className="fas fa-file-alt text-green-600"></i>
                  Post Body
                </h5>
                <button
                  onClick={() => copyToClipboard(results.post_body, 'body')}
                  className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all flex items-center gap-1"
                >
                  {copiedField === 'body' ? (
                    <>
                      <i className="fas fa-check"></i>
                      Copied!
                    </>
                  ) : (
                    <>
                      <i className="fas fa-copy"></i>
                      Copy
                    </>
                  )}
                </button>
              </div>
              <p className="text-green-900 whitespace-pre-wrap">{results.post_body}</p>
            </div>

            {/* Engagement Prompt */}
            {results.engagement_prompt && (
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-green-800 flex items-center gap-2">
                    <i className="fas fa-comments text-green-600"></i>
                    Engagement Prompt
                  </h5>
                  <button
                    onClick={() => copyToClipboard(results.engagement_prompt, 'prompt')}
                    className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all flex items-center gap-1"
                  >
                    {copiedField === 'prompt' ? (
                      <>
                        <i className="fas fa-check"></i>
                        Copied!
                      </>
                    ) : (
                      <>
                        <i className="fas fa-copy"></i>
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <p className="text-green-900">{results.engagement_prompt}</p>
              </div>
            )}

            {/* Content Themes */}
            {results.content_themes && results.content_themes.length > 0 && (
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-green-800 flex items-center gap-2">
                    <i className="fas fa-tags text-green-600"></i>
                    Content Themes
                  </h5>
                  <button
                    onClick={() => copyToClipboard(results.content_themes.join(', '), 'themes')}
                    className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all flex items-center gap-1"
                  >
                    {copiedField === 'themes' ? (
                      <>
                        <i className="fas fa-check"></i>
                        Copied!
                      </>
                    ) : (
                      <>
                        <i className="fas fa-copy"></i>
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {results.content_themes.map((theme: string, index: number) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
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
              <i className="fas fa-comments text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">General Group & Community Posts</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create engaging content for your community and groups</p>
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
                  {/* Error Display */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 text-red-800">
                        <i className="fas fa-exclamation-circle text-red-600"></i>
                        <span className="font-medium">Error:</span>
                        <span>{error}</span>
                      </div>
                    </div>
                  )}

                  {/* Results Display */}
                  {renderResults()}

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Community Information</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="groupType">Group Type</label>
                          <div className="relative group">
                            <select
                              id="groupType"
                              name="groupType"
                              value={inputs.groupType}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                            >
                              <option value="">Select group type</option>
                              <option value="Professional Networking Group">Professional Networking Group</option>
                              <option value="Facebook Group">Facebook Group</option>
                              <option value="LinkedIn Group">LinkedIn Group</option>
                              <option value="Discord Server">Discord Server</option>
                              <option value="Slack Community">Slack Community</option>
                              <option value="Online Forum">Online Forum</option>
                              <option value="Membership Site">Membership Site</option>
                              <option value="WhatsApp Group">WhatsApp Group</option>
                              <option value="Telegram Channel">Telegram Channel</option>
                              <option value="Reddit Community">Reddit Community</option>
                            </select>
                            <div className="absolute top-1/2 right-3 transform -translate-y-1/2 text-blue-300 pointer-events-none">
                              <i className="fas fa-chevron-down text-xs"></i>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="communityName">Community Name</label>
                          <div className="relative group">
                            <input
                              id="communityName"
                              name="communityName"
                              value={inputs.communityName}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                              placeholder="Enter your community name"
                            />
                            <div className="absolute top-1/2 right-3 transform -translate-y-1/2 text-blue-300 opacity-0 group-focus-within:opacity-100 transition-opacity">
                              <i className="fas fa-users text-xs"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="communityPurpose">Community Purpose</label>
                        <div className="relative group">
                                                      <textarea 
                              id="communityPurpose"
                              name="communityPurpose"
                              value={inputs.communityPurpose}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                              placeholder="e.g., To share marketing strategies, industry news, and support each other's growth"
                            ></textarea>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="targetAudience">Target Audience</label>
                        <div className="relative group">
                                                      <textarea 
                              id="targetAudience"
                              name="targetAudience"
                              value={inputs.targetAudience}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                              placeholder="e.g., Digital marketers, growth hackers, entrepreneurs"
                            ></textarea>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="engagementGoals">Engagement Goals</label>
                          <div className="relative group">
                            <select
                              id="engagementGoals"
                              name="engagementGoals"
                              value={inputs.engagementGoals}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                            >
                              <option value="">Select primary goal</option>
                              <option value="Increase member participation and knowledge sharing">Increase member participation and knowledge sharing</option>
                              <option value="Build relationships and networking">Build relationships and networking</option>
                              <option value="Share knowledge and resources">Share knowledge and resources</option>
                              <option value="Support members and provide value">Support members and provide value</option>
                              <option value="Promote discussion and engagement">Promote discussion and engagement</option>
                              <option value="Create a sense of community">Create a sense of community</option>
                              <option value="Facilitate learning and growth">Facilitate learning and growth</option>
                            </select>
                            <div className="absolute top-1/2 right-3 transform -translate-y-1/2 text-blue-300 pointer-events-none">
                              <i className="fas fa-chevron-down text-xs"></i>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="postFrequency">Post Frequency</label>
                          <div className="relative group">
                            <select
                              id="postFrequency"
                              name="postFrequency"
                              value={inputs.postFrequency}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                            >
                              <option value="">Select frequency</option>
                              <option value="Daily">Daily</option>
                              <option value="Few times a week">Few times a week</option>
                              <option value="Weekly">Weekly</option>
                              <option value="Bi-weekly">Bi-weekly</option>
                              <option value="Monthly">Monthly</option>
                            </select>
                            <div className="absolute top-1/2 right-3 transform -translate-y-1/2 text-blue-300 pointer-events-none">
                              <i className="fas fa-chevron-down text-xs"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="contentThemes">Content Themes</label>
                        <div className="relative group">
                                                      <textarea 
                              id="contentThemes"
                              name="contentThemes"
                              value={inputs.contentThemes}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                              placeholder="e.g., Marketing tips, case studies, Q&A, industry trends, member spotlights"
                            ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && renderTemplatesTab()}
              
              {activeTab === 'history' && (
                <div className="py-4">
                  <History toolName="General Group Community Posts" />
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
                  onClick={handleGeneratePosts}
                  disabled={isLoading}
                  className="px-5 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin text-xs"></i>
                      Generating...
                    </>
                  ) : (
                    <>
                      <span>Generate Posts</span>
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
