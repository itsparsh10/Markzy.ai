'use client';

import React, { useState } from 'react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface PodcastPitchPrepProps {
  onBackClick: () => void;
}

export default function PodcastPitchPrep({ onBackClick }: PodcastPitchPrepProps) {
  // State for active tab
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history' | 'result'>('generate');
  
  // State for form inputs
  const [inputs, setInputs] = useState({
    podcastName: '',
    hostName: '',
    podcastNiche: '',
    audienceSize: '',
    yourExpertise: '',
    topicProposal: '',
    uniqueAngle: '',
    personalStory: '',
    callToAction: '',
    availableDates: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  // Podcast template types with appropriate icons
  const podcastTypes = [
    { name: "Business Podcast", icon: "fas fa-briefcase", description: "Create pitches for business and entrepreneurship podcasts." },
    { name: "Marketing Podcast", icon: "fas fa-bullhorn", description: "Pitch to marketing and advertising focused shows." },
    { name: "Tech Podcast", icon: "fas fa-laptop-code", description: "Target technology and innovation podcasts." },
    { name: "Lifestyle Podcast", icon: "fas fa-heart", description: "Pitch to lifestyle and personal development shows." },
    { name: "Industry Expert", icon: "fas fa-user-tie", description: "Position yourself as an industry thought leader." },
    { name: "Story-based Pitch", icon: "fas fa-book-open", description: "Lead with compelling personal or business stories." }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Map form data to API format
      const apiData = {
        podcast_name: inputs.podcastName,
        host_name: inputs.hostName,
        podcast_niche: inputs.podcastNiche,
        audience_size: inputs.audienceSize,
        expertise_background: inputs.yourExpertise,
        proposed_topic: inputs.topicProposal,
        unique_value: inputs.uniqueAngle,
        personal_story: inputs.personalStory,
        available_dates: inputs.availableDates,
        call_to_action: inputs.callToAction
      };

      const response = await aiToolsService.generatePodcastPitchPrep(apiData);
      setResult(response);
      
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Podcast Pitch Prep',
          toolId: 'podcast-pitch-prep',
          outputResult: response,
          prompt: JSON.stringify(apiData)
        });
        console.log('✅ Podcast pitch prep saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
      setActiveTab('result');
    } catch (err: any) {
      console.error('Error generating podcast pitch:', err);
      setError(err.message || 'Failed to generate podcast pitch. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const renderTemplatesTab = () => {
    return (
      <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
        {podcastTypes.map((podcastType, index) => (
          <div key={index} className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
                <i className={`${podcastType.icon} text-blue-600`}></i>
              </div>
              <div>
                <h4 className="font-medium text-blue-900">{podcastType.name}</h4>
                <p className="text-xs text-blue-600">{podcastType.description}</p>
              </div>
            </div>
            <button 
              onClick={() => {
                setInputs(prev => ({...prev, podcastNiche: podcastType.name.toLowerCase().replace(' podcast', '')}));
                setActiveTab('generate');
              }}
              className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1"
            >
              Create
            </button>
          </div>
        ))}
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
              <i className="fas fa-microphone text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Podcast Pitch Prep</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create personalized pitches for podcast guest appearances</p>
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
                <button 
                  onClick={() => setActiveTab('result')}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${activeTab === 'result' ? 'text-blue-700 bg-blue-50/70' : 'text-blue-500 hover:text-blue-600'}`}
                >
                  <span className="flex items-center gap-2">
                    <i className="fas fa-check-circle text-xs"></i>
                    Result
                  </span>
                  {activeTab === 'result' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>}
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
                    <h4 className="text-base font-medium text-blue-900 mb-3">Podcast & Host Information</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="podcastName">Podcast Name</label>
                          <input 
                            id="podcastName" 
                            name="podcastName"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all" 
                            placeholder="Enter the podcast name"
                            type="text"
                            value={inputs.podcastName}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="hostName">Host Name</label>
                          <input 
                            id="hostName" 
                            name="hostName"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all" 
                            placeholder="Enter the host's name"
                            type="text"
                            value={inputs.hostName}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="podcastNiche">Podcast Niche/Topic</label>
                          <select
                            id="podcastNiche"
                            name="podcastNiche"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                            value={inputs.podcastNiche}
                            onChange={handleInputChange}
                          >
                            <option value="">Select podcast niche</option>
                            <option value="business">Business & Entrepreneurship</option>
                            <option value="marketing">Marketing & Sales</option>
                            <option value="technology">Technology & Innovation</option>
                            <option value="health">Health & Wellness</option>
                            <option value="education">Education & Learning</option>
                            <option value="lifestyle">Lifestyle & Personal Development</option>
                            <option value="finance">Finance & Investing</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="audienceSize">Audience Size (if known)</label>
                          <input 
                            id="audienceSize" 
                            name="audienceSize"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all" 
                            placeholder="e.g., 10k downloads/month"
                            type="text"
                            value={inputs.audienceSize}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Your Expertise & Pitch Content</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="yourExpertise">Your Expertise & Background</label>
                        <textarea 
                          id="yourExpertise" 
                          name="yourExpertise"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Describe your expertise, achievements, and what makes you qualified to speak on this topic..."
                          value={inputs.yourExpertise}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="topicProposal">Proposed Topic/Angle</label>
                        <textarea 
                          id="topicProposal" 
                          name="topicProposal"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="What specific topic would you like to discuss? What angle would you bring?"
                          value={inputs.topicProposal}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="uniqueAngle">Unique Value/Angle</label>
                        <textarea 
                          id="uniqueAngle" 
                          name="uniqueAngle"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="What unique perspective, insights, or value can you bring to their audience?"
                          value={inputs.uniqueAngle}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Additional Details</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="personalStory">Personal Story/Hook</label>
                          <textarea 
                            id="personalStory" 
                            name="personalStory"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                            placeholder="Brief compelling story or hook that relates to the topic..."
                            value={inputs.personalStory}
                            onChange={handleInputChange}
                          ></textarea>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="availableDates">Available Dates</label>
                          <textarea 
                            id="availableDates" 
                            name="availableDates"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                            placeholder="When are you available for recording? Include time zones..."
                            value={inputs.availableDates}
                            onChange={handleInputChange}
                          ></textarea>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="callToAction">Call to Action (optional)</label>
                        <input 
                          id="callToAction" 
                          name="callToAction"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all" 
                          placeholder="How can listeners connect with you? (website, social, etc.)"
                          type="text"
                          value={inputs.callToAction}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && renderTemplatesTab()}
              
              {activeTab === 'history' && (
                <div className="py-4">
                  <History toolName="Podcast Pitch Prep" />
                </div>
              )}
              
              {activeTab === 'result' && (
                <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
                  {isLoading && (
                    <div className="flex items-center justify-center py-8">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="text-blue-600">Generating podcast pitch...</span>
                      </div>
                    </div>
                  )}
                  
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-exclamation-circle text-red-500"></i>
                        <span className="text-red-700 font-medium">Error</span>
                      </div>
                      <p className="text-red-600 mt-1">{error}</p>
                    </div>
                  )}
                  
                  {result && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-blue-900">Generated Podcast Pitch</h3>
                        <button 
                          onClick={() => setActiveTab('generate')}
                          className="px-3 py-1.5 text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all flex items-center gap-1 border border-blue-100"
                        >
                          <i className="fas fa-plus text-xs"></i> Generate New
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-white border border-blue-200 rounded-lg shadow-sm">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-medium text-blue-900">Subject Line</h4>
                            <button 
                              onClick={() => copyToClipboard(result.subject_line)}
                              className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-all"
                            >
                              <i className="fas fa-copy mr-1"></i>Copy
                            </button>
                          </div>
                          <div className="p-3 bg-blue-50 rounded border border-blue-100">
                            <p className="text-sm text-blue-900">{result.subject_line}</p>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white border border-blue-200 rounded-lg shadow-sm">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-medium text-blue-900">Pitch Text</h4>
                            <button 
                              onClick={() => copyToClipboard(result.pitch_text)}
                              className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-all"
                            >
                              <i className="fas fa-copy mr-1"></i>Copy
                            </button>
                          </div>
                          <div className="p-3 bg-blue-50 rounded border border-blue-100">
                            <p className="text-sm text-blue-900 whitespace-pre-wrap">{result.pitch_text}</p>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white border border-blue-200 rounded-lg shadow-sm">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-medium text-blue-900">Summary</h4>
                            <button 
                              onClick={() => copyToClipboard(result.summary)}
                              className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-all"
                            >
                              <i className="fas fa-copy mr-1"></i>Copy
                            </button>
                          </div>
                          <div className="p-3 bg-blue-50 rounded border border-blue-100">
                            <p className="text-sm text-blue-900">{result.summary}</p>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white border border-blue-200 rounded-lg shadow-sm">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-medium text-blue-900">Complete Pitch</h4>
                            <button 
                              onClick={() => copyToClipboard(`Subject: ${result.subject_line}\n\n${result.pitch_text}\n\nSummary: ${result.summary}`)}
                              className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-all"
                            >
                              <i className="fas fa-copy mr-1"></i>Copy All
                            </button>
                          </div>
                          <div className="p-3 bg-blue-50 rounded border border-blue-100">
                            <div className="text-sm text-blue-900">
                              <p className="font-semibold mb-2">Subject: {result.subject_line}</p>
                              <div className="whitespace-pre-wrap">{result.pitch_text}</div>
                              <p className="font-semibold mt-3 mb-1">Summary:</p>
                              <p>{result.summary}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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
                  onClick={handleSubmit}
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
                      <span>Generate Pitch</span>
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
