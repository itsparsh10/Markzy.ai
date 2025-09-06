'use client'

import { useState } from 'react';
import { ArrowLeft, Briefcase, Users, Footprints, Lightbulb, Target, Search, ShoppingBag, MessageSquare, ThumbsUp, FileText, History as HistoryIcon, Route, Clock, X, Save, Wand2 } from 'lucide-react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

export default function WordBank({ onBackClick }: { onBackClick: () => void }) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [inputs, setInputs] = useState({
    brandName: '',
    industry: '',
    brandPersonality: '',
    targetAudience: '',
    brandValues: '',
    toneOfVoice: '',
    competitorAnalysis: '',
    keyMessages: '',
    uniqueSellingPoints: '',
    emotionalTriggers: '',
    actionWords: '',
    avoidWords: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateWordBank = async () => {
    // Validate required fields
    const requiredFields = ['brandName', 'industry', 'brandPersonality', 'toneOfVoice', 'keyMessages', 'actionWords', 'avoidWords', 'emotionalTriggers'];
    const missingFields = requiredFields.filter(field => !inputs[field as keyof typeof inputs]);
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const requestData = {
        brand_name: inputs.brandName,
        industry: inputs.industry,
        brand_personality: inputs.brandPersonality,
        tone_of_voice: inputs.toneOfVoice,
        key_messages: inputs.keyMessages,
        preferred_action_words: inputs.actionWords,
        words_to_avoid: inputs.avoidWords,
        emotional_triggers: inputs.emotionalTriggers
      };

      const response = await aiToolsService.generateWordBank(requestData);
      setResults(response);
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Word Bank',
          toolId: 'word-bank',
          outputResult: response,
          prompt: JSON.stringify(requestData)
        });
        console.log('✅ Word bank saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
    } catch (err: any) {
      console.error('Error generating word bank:', err);
      setError(err.response?.data?.message || err.message || 'Failed to generate word bank');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const renderTemplatesTab = () => {
    return (
      <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-palette text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Brand Voice Template</h4>
              <p className="text-xs text-blue-600">Template for defining brand personality, tone, and voice characteristics.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-bullseye text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Audience Language</h4>
              <p className="text-xs text-blue-600">Template for capturing audience-specific vocabulary and communication style.</p>
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
              <h4 className="font-medium text-blue-900">Emotional Keywords</h4>
              <p className="text-xs text-blue-600">Template for emotional triggers and persuasive language for your audience.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-ban text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Words to Avoid</h4>
              <p className="text-xs text-blue-600">Template for identifying language that doesn't align with your brand.</p>
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
        <p className="text-sm text-blue-700 max-w-md">View your previously generated word banks and brand language guides.</p>
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
              <i className="fas fa-language text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Word Bank</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create a consistent vocabulary reference for your brand</p>
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
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 text-red-700">
                        <i className="fas fa-exclamation-circle"></i>
                        <span className="text-sm font-medium">{error}</span>
                      </div>
                    </div>
                  )}

                  {/* Results Display */}
                  {results && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-green-900">Generated Word Bank</h4>
                        <button
                          onClick={() => copyToClipboard(JSON.stringify(results, null, 2))}
                          className="px-3 py-1.5 text-sm text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition-all flex items-center gap-1"
                        >
                          <i className="fas fa-copy text-xs"></i>
                          Copy All
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        {/* Summary */}
                        <div className="p-3 bg-white rounded-lg border border-green-100">
                          <h5 className="font-medium text-green-900 mb-2">Summary</h5>
                          <p className="text-sm text-green-800">{results.summary}</p>
                        </div>

                        {/* Vocabulary */}
                        {results.vocabulary && (
                          <div className="p-3 bg-white rounded-lg border border-green-100">
                            <h5 className="font-medium text-green-900 mb-2">Vocabulary Guidelines</h5>
                            <div className="space-y-3">
                              {results.vocabulary.preferred_action_words && (
                                <div>
                                  <h6 className="text-xs font-semibold text-green-700 mb-1">Preferred Action Words</h6>
                                  <div className="flex flex-wrap gap-1">
                                    {results.vocabulary.preferred_action_words.map((word: string, index: number) => (
                                      <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                        {word}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {results.vocabulary.words_to_avoid && (
                                <div>
                                  <h6 className="text-xs font-semibold text-red-700 mb-1">Words to Avoid</h6>
                                  <div className="flex flex-wrap gap-1">
                                    {results.vocabulary.words_to_avoid.map((word: string, index: number) => (
                                      <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                                        {word}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {results.vocabulary.emotional_triggers && (
                                <div>
                                  <h6 className="text-xs font-semibold text-blue-700 mb-1">Emotional Triggers</h6>
                                  <div className="flex flex-wrap gap-1">
                                    {results.vocabulary.emotional_triggers.map((word: string, index: number) => (
                                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                        {word}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Guidelines */}
                        {results.guidelines && (
                          <div className="p-3 bg-white rounded-lg border border-green-100">
                            <h5 className="font-medium text-green-900 mb-2">Usage Guidelines</h5>
                            <p className="text-sm text-green-800">{results.guidelines}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Brand Foundation</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="brandName">Brand Name</label>
                          <input
                            type="text"
                            id="brandName"
                            name="brandName"
                            value={inputs.brandName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                            placeholder="Enter your brand name"
                          />
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
                            <option value="manufacturing">Manufacturing</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="brandPersonality">Brand Personality</label>
                        <textarea 
                          id="brandPersonality"
                          name="brandPersonality"
                          value={inputs.brandPersonality}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Describe your brand's personality traits (e.g., friendly, professional, innovative, trustworthy)..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Voice & Tone</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="toneOfVoice">Tone of Voice</label>
                        <textarea 
                          id="toneOfVoice"
                          name="toneOfVoice"
                          value={inputs.toneOfVoice}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="How should your brand sound? (e.g., conversational, authoritative, warm, formal)..."
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="keyMessages">Key Messages</label>
                        <textarea 
                          id="keyMessages"
                          name="keyMessages"
                          value={inputs.keyMessages}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="What are the main messages you want to communicate consistently?..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Language Guidelines</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="actionWords">Preferred Action Words</label>
                          <textarea 
                            id="actionWords"
                            name="actionWords"
                            value={inputs.actionWords}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                            placeholder="Words that inspire action (e.g., discover, transform, achieve, create)..."
                          ></textarea>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="avoidWords">Words to Avoid</label>
                          <textarea 
                            id="avoidWords"
                            name="avoidWords"
                            value={inputs.avoidWords}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                            placeholder="Words that don't align with your brand or might confuse your audience..."
                          ></textarea>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="emotionalTriggers">Emotional Triggers</label>
                        <textarea 
                          id="emotionalTriggers"
                          name="emotionalTriggers"
                          value={inputs.emotionalTriggers}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="Words and phrases that resonate emotionally with your audience..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'templates' && renderTemplatesTab()}
              {activeTab === 'history' && (
                <div className="py-4">
                  <History toolName="Word Bank" />
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
                  onClick={handleGenerateWordBank}
                  disabled={isLoading}
                  className={`px-5 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin text-xs"></i>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Word Bank</span>
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
