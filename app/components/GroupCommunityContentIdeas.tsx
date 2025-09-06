'use client';

import React, { useState } from 'react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface GroupCommunityContentIdeasProps {
  onBackClick: () => void;
}

export default function GroupCommunityContentIdeas({ onBackClick }: GroupCommunityContentIdeasProps) {
  // State for active tab
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);
  
  // State for form inputs
  const [inputs, setInputs] = useState({
    communityName: '',
    communityType: '',
    communityPurpose: '',
    targetAudience: '',
    engagementGoals: '',
    contentThemes: '',
    communitySize: '',
    postingFrequency: ''
  });

  // Community template types with appropriate icons
  const communityTemplates = [
    { name: "Welcome & Onboarding", icon: "fas fa-handshake", description: "Create welcoming content for new community members." },
    { name: "Discussion Starters", icon: "fas fa-comments", description: "Generate engaging topics to spark conversations." },
    { name: "Educational Content", icon: "fas fa-graduation-cap", description: "Share valuable knowledge and insights." },
    { name: "Community Challenges", icon: "fas fa-trophy", description: "Create fun challenges to boost engagement." },
    { name: "Member Spotlights", icon: "fas fa-star", description: "Highlight and celebrate community members." },
    { name: "Q&A Sessions", icon: "fas fa-question-circle", description: "Facilitate question and answer discussions." }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      // Validate required fields
      const requiredFields = [
        'communityName',
        'communityType',
        'communityPurpose',
        'targetAudience',
        'engagementGoals',
        'communitySize',
        'contentThemes',
        'postingFrequency'
      ];
      
      const missingFields = requiredFields.filter(field => !inputs[field as keyof typeof inputs]);
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      // Map form inputs to API fields with proper value mapping
      const apiData = {
        community_name: inputs.communityName,
        community_type: inputs.communityType === 'facebook-group' ? 'Facebook Group' :
                       inputs.communityType === 'discord-server' ? 'Discord Server' :
                       inputs.communityType === 'slack-workspace' ? 'Slack Workspace' :
                       inputs.communityType === 'circle-community' ? 'Circle Community' :
                       inputs.communityType === 'mighty-networks' ? 'Mighty Networks' :
                       inputs.communityType === 'linkedin-group' ? 'LinkedIn Group' :
                       inputs.communityType,
        community_purpose: inputs.communityPurpose,
        target_audience: inputs.targetAudience,
        engagement_goals: inputs.engagementGoals === 'increase-activity' ? 'Increase Daily Activity' :
                         inputs.engagementGoals === 'build-relationships' ? 'Build Member Relationships' :
                         inputs.engagementGoals === 'share-knowledge' ? 'Share Knowledge & Tips' :
                         inputs.engagementGoals === 'support-members' ? 'Provide Member Support' :
                         inputs.engagementGoals === 'grow-community' ? 'Grow Community Size' :
                         inputs.engagementGoals === 'drive-sales' ? 'Drive Product/Service Sales' :
                         inputs.engagementGoals,
        community_size: inputs.communitySize === 'small' ? 'Small (Under 100 members)' :
                       inputs.communitySize === 'medium' ? 'Medium (100-1,000 members)' :
                       inputs.communitySize === 'large' ? 'Large (1,000-10,000 members)' :
                       inputs.communitySize === 'enterprise' ? 'Enterprise (10,000+ members)' :
                       inputs.communitySize,
        content_themes_topics: inputs.contentThemes,
        posting_frequency: inputs.postingFrequency === 'multiple-daily' ? 'Multiple times daily' :
                          inputs.postingFrequency === 'daily' ? 'Daily' :
                          inputs.postingFrequency === 'few-times-week' ? 'Few times per week' :
                          inputs.postingFrequency === 'weekly' ? 'Weekly' :
                          inputs.postingFrequency === 'bi-weekly' ? 'Bi-weekly' :
                          inputs.postingFrequency
      };

      console.log('Sending community content ideas API data:', apiData);
      const response = await aiToolsService.generateGroupCommunityContentIdeas(apiData);
      setResult(response);
      
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Group Community Content Ideas',
          toolId: 'group-community-content-ideas',
          outputResult: response,
          prompt: JSON.stringify(apiData)
        });
        console.log('✅ Group community content ideas saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
    } catch (err: any) {
      console.error('Error generating community content ideas:', err);
      setError(err.message || 'Failed to generate community content ideas. Please try again.');
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
              <i className="fas fa-users text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Group & Community Content Ideas</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Generate engaging content ideas to build community engagement</p>
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
                          Generated Content Ideas
                        </h4>
                        <button
                          onClick={() => {
                            const fullContent = `Idea Title: ${result.idea_title}\n\nIdea Description: ${result.idea_description}\n\nEngagement Prompt: ${result.engagement_prompt}\n\nThemes/Topics:\n${result.themes_topics?.map((theme: string, index: number) => `${index + 1}. ${theme}`).join('\n') || ''}`;
                            copyToClipboard(fullContent);
                          }}
                          className="px-3 py-1.5 text-sm text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition-all flex items-center gap-1"
                        >
                          <i className="fas fa-copy text-xs"></i>
                          Copy All
                        </button>
                      </div>

                      <div className="space-y-4">
                        {/* Idea Title */}
                        <div className="p-3 bg-white rounded-lg border border-green-200">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-green-900 flex items-center gap-2">
                              <i className="fas fa-lightbulb text-green-600 text-sm"></i>
                              Content Idea Title
                            </h5>
                            <button
                              onClick={() => copyToClipboard(result.idea_title)}
                              className="text-xs text-green-600 hover:text-green-800"
                            >
                              <i className="fas fa-copy"></i>
                            </button>
                          </div>
                          <p className="text-green-800 font-medium">{result.idea_title}</p>
                        </div>

                        {/* Idea Description */}
                        <div className="p-3 bg-white rounded-lg border border-green-200">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-green-900 flex items-center gap-2">
                              <i className="fas fa-align-left text-green-600 text-sm"></i>
                              Idea Description
                            </h5>
                            <button
                              onClick={() => copyToClipboard(result.idea_description)}
                              className="text-xs text-green-600 hover:text-green-800"
                            >
                              <i className="fas fa-copy"></i>
                            </button>
                          </div>
                          <p className="text-green-800">{result.idea_description}</p>
                        </div>

                        {/* Engagement Prompt */}
                        <div className="p-3 bg-white rounded-lg border border-green-200">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-green-900 flex items-center gap-2">
                              <i className="fas fa-comments text-green-600 text-sm"></i>
                              Engagement Prompt
                            </h5>
                            <button
                              onClick={() => copyToClipboard(result.engagement_prompt)}
                              className="text-xs text-green-600 hover:text-green-800"
                            >
                              <i className="fas fa-copy"></i>
                            </button>
                          </div>
                          <p className="text-green-800">{result.engagement_prompt}</p>
                        </div>

                        {/* Themes/Topics */}
                        {result.themes_topics && result.themes_topics.length > 0 && (
                          <div className="p-3 bg-white rounded-lg border border-green-200">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-semibold text-green-900 flex items-center gap-2">
                                <i className="fas fa-tags text-green-600 text-sm"></i>
                                Themes & Topics
                              </h5>
                              <button
                                onClick={() => copyToClipboard(result.themes_topics.join(', '))}
                                className="text-xs text-green-600 hover:text-green-800"
                              >
                                <i className="fas fa-copy"></i>
                              </button>
                            </div>
                            <div className="space-y-2">
                              {result.themes_topics.map((theme: string, index: number) => (
                                <div key={index} className="p-2 bg-green-50 rounded border-l-4 border-green-300">
                                  <p className="text-green-800 text-sm">
                                    <span className="font-medium">Theme {index + 1}:</span> {theme}
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
                    <h4 className="text-base font-medium text-blue-900 mb-3">Community Information</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="communityName">Community/Group Name</label>
                          <input 
                            id="communityName" 
                            name="communityName"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all" 
                            placeholder="Enter your community or group name"
                            type="text"
                            value={inputs.communityName}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="communityType">Community Type</label>
                          <select
                            id="communityType"
                            name="communityType"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                            value={inputs.communityType}
                            onChange={handleInputChange}
                          >
                            <option value="">Select community type</option>
                            <option value="facebook-group">Facebook Group</option>
                            <option value="discord-server">Discord Server</option>
                            <option value="slack-workspace">Slack Workspace</option>
                            <option value="circle-community">Circle Community</option>
                            <option value="mighty-networks">Mighty Networks</option>
                            <option value="linkedin-group">LinkedIn Group</option>
                            <option value="other">Other Platform</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="communityPurpose">Community Purpose</label>
                        <textarea 
                          id="communityPurpose" 
                          name="communityPurpose"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="What is the main purpose of your community?"
                          value={inputs.communityPurpose}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Audience & Goals</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="targetAudience">Target Audience</label>
                        <textarea 
                          id="targetAudience" 
                          name="targetAudience"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Describe your community members and their interests..."
                          value={inputs.targetAudience}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="engagementGoals">Engagement Goals</label>
                          <select
                            id="engagementGoals"
                            name="engagementGoals"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                            value={inputs.engagementGoals}
                            onChange={handleInputChange}
                          >
                            <option value="">Choose primary goal</option>
                            <option value="increase-activity">Increase Daily Activity</option>
                            <option value="build-relationships">Build Member Relationships</option>
                            <option value="share-knowledge">Share Knowledge & Tips</option>
                            <option value="support-members">Provide Member Support</option>
                            <option value="grow-community">Grow Community Size</option>
                            <option value="drive-sales">Drive Product/Service Sales</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="communitySize">Community Size</label>
                          <select
                            id="communitySize"
                            name="communitySize"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                            value={inputs.communitySize}
                            onChange={handleInputChange}
                          >
                            <option value="">Choose size</option>
                            <option value="small">Small (Under 100 members)</option>
                            <option value="medium">Medium (100-1,000 members)</option>
                            <option value="large">Large (1,000-10,000 members)</option>
                            <option value="enterprise">Enterprise (10,000+ members)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Content Strategy</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="contentThemes">Content Themes & Topics</label>
                        <textarea 
                          id="contentThemes" 
                          name="contentThemes"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="List the main themes or topics you want to cover (one per line)..."
                          value={inputs.contentThemes}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="postingFrequency">Posting Frequency</label>
                        <select
                          id="postingFrequency"
                          name="postingFrequency"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          value={inputs.postingFrequency}
                          onChange={handleInputChange}
                        >
                          <option value="">Choose frequency</option>
                          <option value="multiple-daily">Multiple times daily</option>
                          <option value="daily">Daily</option>
                          <option value="few-times-week">Few times per week</option>
                          <option value="weekly">Weekly</option>
                          <option value="bi-weekly">Bi-weekly</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && (
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {communityTemplates.map((template, index) => (
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
                            setInputs(prev => ({...prev, engagementGoals: template.name}));
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
                  <History toolName="Group Community Content Ideas" />
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
                      Generating...
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
