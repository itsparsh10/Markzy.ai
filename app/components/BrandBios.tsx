'use client';

import React, { useState } from 'react';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface BrandBiosProps {
  onBackClick: () => void;
}

export default function BrandBios({ onBackClick }: BrandBiosProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'result' | 'templates' | 'history'>('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [toolHistory, setToolHistory] = useState<any[]>([]);
  const [inputs, setInputs] = useState({
    brandName: '',
    brandMission: '',
    foundingStory: '',
    keyValues: '',
    targetAudience: '',
    uniqueSellingPoints: '',
    achievements: '',
    brandPersonality: '',
    tone: 'professional',
    bioLength: 'medium'
  });



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    // Validation
    if (!inputs.brandName || !inputs.brandMission || !inputs.foundingStory || !inputs.keyValues || !inputs.uniqueSellingPoints || !inputs.targetAudience || !inputs.achievements || !inputs.brandPersonality) {
      alert('Please fill in all required fields: Brand Name, Mission, Founding Story, Key Values, Unique Selling Points, Target Audience, Achievements, and Brand Personality');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Dynamic import for ES modules
      const { aiToolsService } = await import('../../services/aiTools.js');
      
      // Map UI values to API format
      const requestData = {
        brand_name: inputs.brandName,
        brand_mission: inputs.brandMission,
        founding_story: inputs.foundingStory,
        key_values: inputs.keyValues,
        unique_selling_points: inputs.uniqueSellingPoints,
        target_audience: inputs.targetAudience,
        achievements: inputs.achievements,
        brand_personality: inputs.brandPersonality,
        bio_tone: inputs.tone,
        bio_length: inputs.bioLength
      };

      console.log('Sending brand bios request:', requestData);
      const response = await aiToolsService.generateBrandBios(requestData);
      console.log('Brand bios response:', response);
      setGeneratedContent(response);
      setActiveTab('result');
      
      // Save to tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Brand Bios',
          toolId: 'brand-bios',
          outputResult: response,
          prompt: JSON.stringify(requestData)
        });
        console.log('✅ Brand bios saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
      
    } catch (error: any) {
      // Error handling with user-friendly messages
      let errorMessage = 'Failed to generate brand bios. Please try again.';
      
      if (error.response?.data?.detail) {
        errorMessage = `API Error: ${error.response.data.detail}`;
      } else if (error.message && error.message.includes('Missing required fields')) {
        errorMessage = error.message;
      } else if (error.response?.status === 400) {
        errorMessage = 'The request was invalid. Please check all required fields.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication error. Please try logging out and back in.';
      }
      
      console.error('Error details:', error.response?.data || error.message);
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };



  const bioTemplates = [
    { name: "Social Media Bio", icon: "fas fa-hashtag", description: "Short, engaging bios for social media platforms like Instagram, Twitter, LinkedIn." },
    { name: "Website About Page", icon: "fas fa-globe", description: "Comprehensive brand story for your website's about page." },
    { name: "Press Kit Bio", icon: "fas fa-newspaper", description: "Professional bio for media and press communications." },
    { name: "Conference Speaker Bio", icon: "fas fa-microphone", description: "Speaker bio for events, conferences, and presentations." },
    { name: "Team Member Bio", icon: "fas fa-user", description: "Individual team member or founder bio for website or materials." },
    { name: "Investor Pitch Bio", icon: "fas fa-chart-line", description: "Focused bio highlighting achievements and credibility for investors." }
  ];

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Glassmorphic Header with blue gradient */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-id-card text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Brand Bios</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create compelling brand bios for various platforms and purposes</p>
            </div>
            <div className="flex items-center gap-3 z-10">
              <span className="text-xs bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/30 flex items-center font-semibold text-white/90">
                <i className="fas fa-clock mr-1"></i> 3 min
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
                {generatedContent && !error && (
                  <button 
                    onClick={() => setActiveTab('result')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${activeTab === 'result' ? 'text-blue-700 bg-blue-50/70' : 'text-blue-500 hover:text-blue-600'}`}
                  >
                    <span className="flex items-center gap-2">
                      <i className="fas fa-user-tie text-xs"></i>
                      Generated Bios
                    </span>
                    {activeTab === 'result' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>}
                  </button>
                )}
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
                  {/* Success Banner */}
                  {generatedContent && !error && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <i className="fas fa-check text-green-600 text-sm"></i>
                          </div>
                          <div>
                            <h4 className="text-green-800 font-semibold">Bios Generated Successfully!</h4>
                            <p className="text-green-600 text-sm">Your brand bios are ready to view.</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveTab('result')}
                          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center gap-2"
                        >
                          <i className="fas fa-eye text-xs"></i>
                          View Bios
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Brand Information</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="brandName">Brand/Company Name</label>
                        <input
                          id="brandName"
                          name="brandName"
                          type="text"
                          value={inputs.brandName}
                          onChange={handleInputChange}
                          placeholder="Enter your brand or company name"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="brandMission">Brand Mission/Purpose</label>
                        <textarea 
                          id="brandMission"
                          name="brandMission"
                          value={inputs.brandMission}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="What is your brand's mission or purpose? What problem do you solve?"
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
                          placeholder="How was your brand founded? What inspired you to start?"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Brand Identity & Values</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="keyValues">Key Values & Principles</label>
                        <textarea 
                          id="keyValues"
                          name="keyValues"
                          value={inputs.keyValues}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="What are your brand's core values and guiding principles?"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="uniqueSellingPoints">Unique Selling Points</label>
                        <textarea 
                          id="uniqueSellingPoints"
                          name="uniqueSellingPoints"
                          value={inputs.uniqueSellingPoints}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="What makes your brand unique? What sets you apart from competitors?"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="targetAudience">Target Audience</label>
                        <textarea 
                          id="targetAudience"
                          name="targetAudience"
                          value={inputs.targetAudience}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="Who is your target audience? Who do you serve?"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Achievements & Personality</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="tone">Bio Tone</label>
                          <select
                            id="tone"
                            name="tone"
                            value={inputs.tone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="professional">Professional</option>
                            <option value="friendly">Friendly</option>
                            <option value="inspiring">Inspiring</option>
                            <option value="conversational">Conversational</option>
                            <option value="authoritative">Authoritative</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="bioLength">Bio Length</label>
                          <select
                            id="bioLength"
                            name="bioLength"
                            value={inputs.bioLength}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="short">Short (1-2 sentences)</option>
                            <option value="medium">Medium (1-2 paragraphs)</option>
                            <option value="long">Long (detailed bio)</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="achievements">Key Achievements & Milestones</label>
                        <textarea 
                          id="achievements"
                          name="achievements"
                          value={inputs.achievements}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="What are your brand's notable achievements, awards, or milestones?"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="brandPersonality">Brand Personality</label>
                        <textarea 
                          id="brandPersonality"
                          name="brandPersonality"
                          value={inputs.brandPersonality}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="How would you describe your brand's personality? (e.g., innovative, reliable, fun, etc.)"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && (
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {bioTemplates.map((template, index) => (
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
                          onClick={() => setActiveTab('generate')}
                          className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1"
                        >
                          Create
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {activeTab === 'result' && generatedContent && (
                <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
                  {/* Social Media Bio */}
                  {generatedContent.socialMediaBio && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-blue-800 mb-2 flex items-center gap-2">
                        <i className="fas fa-hashtag text-blue-600"></i>
                        Social Media Bio
                      </h3>
                      <div className="bg-white p-4 rounded-lg border border-blue-100">
                        <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">{generatedContent.socialMediaBio}</div>
                      </div>
                    </div>
                  )}

                  {/* Website About Page */}
                  {generatedContent.websiteAbout && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center gap-2">
                        <i className="fas fa-globe text-green-600"></i>
                        Website About Page
                      </h3>
                      <div className="bg-white p-4 rounded-lg border border-green-100">
                        <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">{generatedContent.websiteAbout}</div>
                      </div>
                    </div>
                  )}

                  {/* Press Kit Bio */}
                  {generatedContent.pressKitBio && (
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-purple-800 mb-2 flex items-center gap-2">
                        <i className="fas fa-newspaper text-purple-600"></i>
                        Press Kit Bio
                      </h3>
                      <div className="bg-white p-4 rounded-lg border border-purple-100">
                        <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">{generatedContent.pressKitBio}</div>
                      </div>
                    </div>
                  )}

                  {/* LinkedIn Company Page */}
                  {generatedContent.linkedinBio && (
                    <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-indigo-800 mb-2 flex items-center gap-2">
                        <i className="fab fa-linkedin text-indigo-600"></i>
                        LinkedIn Company Bio
                      </h3>
                      <div className="bg-white p-4 rounded-lg border border-indigo-100">
                        <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">{generatedContent.linkedinBio}</div>
                      </div>
                    </div>
                  )}

                  {/* Email Signature Bio */}
                  {generatedContent.emailSignature && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                        <i className="fas fa-envelope text-yellow-600"></i>
                        Email Signature
                      </h3>
                      <div className="bg-white p-3 rounded-lg border border-yellow-100">
                        <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">{generatedContent.emailSignature}</div>
                      </div>
                    </div>
                  )}

                  {/* Short Elevator Pitch */}
                  {generatedContent.elevatorPitch && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-red-800 mb-2 flex items-center gap-2">
                        <i className="fas fa-rocket text-red-600"></i>
                        Elevator Pitch
                      </h3>
                      <div className="bg-white p-3 rounded-lg border border-red-100">
                        <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">{generatedContent.elevatorPitch}</div>
                      </div>
                    </div>
                  )}

                  {/* Brand Values */}
                  {generatedContent.brandValues && generatedContent.brandValues.length > 0 && (
                    <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-teal-800 mb-2 flex items-center gap-2">
                        <i className="fas fa-heart text-teal-600"></i>
                        Brand Values
                      </h3>
                      <div className="bg-white p-3 rounded-lg border border-teal-100">
                        <div className="grid gap-2">
                          {generatedContent.brandValues.map((value: string, index: number) => (
                            <div key={index} className="p-3 bg-teal-25 border border-teal-100 rounded-lg">
                              <p className="text-gray-800 font-medium">{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-4">
                    <button
                      onClick={() => navigator.clipboard.writeText(JSON.stringify(generatedContent, null, 2))}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
                    >
                      <i className="fas fa-copy"></i>
                      Copy Bios
                    </button>
                    <button
                      onClick={() => {
                        const element = document.createElement('a');
                        const file = new Blob([JSON.stringify(generatedContent, null, 2)], { type: 'application/json' });
                        element.href = URL.createObjectURL(file);
                        element.download = 'brand_bios.json';
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200"
                    >
                      <i className="fas fa-download"></i>
                      Download
                    </button>
                    <button
                      onClick={() => setActiveTab('generate')}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200"
                    >
                      <i className="fas fa-edit"></i>
                      Edit & Regenerate
                    </button>
                  </div>
                </div>
              )}
              
              {activeTab === 'history' && (
                <div className="py-4">
                  <History toolName="Brand Bios" />
                </div>
              )}
            </div>
            
            {/* Results Display */}
            {generatedContent && (
              <div className="mt-4 px-4">
                <div className="bg-white border border-green-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                      <i className="fas fa-check-circle text-green-600"></i>
                      Generated Brand Bios
                    </h3>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => navigator.clipboard.writeText(generatedContent.brand_bios || generatedContent.content || JSON.stringify(generatedContent))}
                        className="px-3 py-1.5 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-all flex items-center gap-1"
                      >
                        <i className="fas fa-copy text-xs"></i>
                        Copy
                      </button>
                      <button 
                        onClick={() => setGeneratedContent(null)}
                        className="px-3 py-1.5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-all flex items-center gap-1"
                      >
                        <i className="fas fa-times text-xs"></i>
                        Clear
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                    {generatedContent.brand_bios ? (
                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                          {generatedContent.brand_bios}
                        </div>
                      </div>
                    ) : generatedContent.content ? (
                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                          {generatedContent.content}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {Object.entries(generatedContent).map(([key, value]) => (
                          <div key={key} className="border-b border-gray-200 pb-3 last:border-b-0">
                            <h4 className="font-semibold text-gray-900 capitalize mb-2">
                              {key.replace(/_/g, ' ')}
                            </h4>
                            <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                              {typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className={`px-5 py-2 text-sm text-white rounded-lg transition-all flex items-center gap-2 shadow-md hover:shadow-lg ${
                    isLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin text-xs"></i>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Bios</span>
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
