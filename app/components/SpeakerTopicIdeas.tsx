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

const SectionCard: React.FC<{ title: string; icon?: React.ElementType; children: React.ReactNode }> = ({ title, icon: Icon, children }) => (
  <div className="bg-blue-50 p-3 rounded-lg shadow-sm border border-blue-100 mb-6">
    <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center">
      {title}
    </h3>
    {children}
  </div>
);

export default function SpeakerTopicIdeas({ onBackClick }: { onBackClick: () => void }) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [inputs, setInputs] = useState({
    expertise: '',
    targetAudience: '',
    eventType: '',
    speakingExperience: '',
    keyMessages: '',
    sessionFormat: '',
    sessionDuration: '',
    uniqueAngle: '',
  });

  // API state management
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<any>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

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
        areas_of_expertise: inputs.expertise,
        speaking_experience: inputs.speakingExperience,
        unique_perspective: inputs.uniqueAngle,
        event_type: inputs.eventType,
        session_duration: inputs.sessionDuration,
        target_audience: inputs.targetAudience,
        session_format: inputs.sessionFormat,
        key_messages: inputs.keyMessages,
      };

      console.log('Generating speaker topic ideas with data:', apiData);
      const response = await aiToolsService.generateSpeakerTopicIdeas(apiData);
      console.log('API Response:', response);
      setResults(response);
      // Save tool history to MongoDB
      try {
        // Save tool history
        try {
          const userId = localStorage.getItem('userId');
          if (userId) {
            const historyData = {
              userId: userId,
              toolName: 'Speaker Topic Ideas',
              toolId: 'speaker-topic-ideas',
              outputResult: response
            };
            await fetch('/api/save-history', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(historyData)
            });
          }
        } catch (historyError) {
          console.warn('⚠️ Failed to save tool history:', historyError);
        }
      } catch (historyError) {
        console.warn('⚠️ Failed to save tool history:', historyError);
      }
    } catch (err: any) {
      console.error('Error generating speaker topic ideas:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to generate topics. Please try again.');
    } finally {
      setIsGenerating(false);
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

  const renderGenerateTab = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-3 rounded-lg shadow-sm border border-blue-100 mb-6">
        <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center">
          Speaker Background & Expertise
        </h3>
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="expertise">Areas of Expertise</label>
          <textarea 
            id="expertise"
            name="expertise"
            value={inputs.expertise}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
            placeholder="What are your main areas of expertise, skills, and knowledge? (e.g., marketing, leadership, technology, etc.)"
          ></textarea>
        </div>
        <div className="space-y-2 mt-4">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="speakingExperience">Speaking Experience</label>
          <select
            id="speakingExperience"
            name="speakingExperience"
            value={inputs.speakingExperience}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
          >
            <option value="">Select your speaking experience level</option>
            <option value="Beginner">Beginner (New to speaking)</option>
            <option value="Intermediate">Intermediate (Some experience)</option>
            <option value="Experienced">Experienced (Regular speaker)</option>
            <option value="Expert">Expert (Professional speaker)</option>
          </select>
        </div>
        <div className="space-y-2 mt-4">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="uniqueAngle">Unique Perspective/Angle</label>
          <textarea 
            id="uniqueAngle"
            name="uniqueAngle"
            value={inputs.uniqueAngle}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
            placeholder="What unique perspective, story, or approach do you bring to your topics?"
          ></textarea>
        </div>
      </div>

      <div className="bg-blue-50 p-3 rounded-lg shadow-sm border border-blue-100 mb-6">
        <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center">
          Event & Audience Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-blue-900" htmlFor="eventType">Event Type</label>
            <select
              id="eventType"
              name="eventType"
              value={inputs.eventType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
            >
              <option value="">Select event type</option>
              <option value="Conference">Conference</option>
              <option value="Summit">Summit</option>
              <option value="Workshop">Workshop</option>
              <option value="Webinar">Webinar</option>
              <option value="Corporate Event">Corporate Event</option>
              <option value="Meetup">Meetup/Networking</option>
              <option value="Podcast">Podcast</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-blue-900" htmlFor="sessionDuration">Session Duration</label>
            <select
              id="sessionDuration"
              name="sessionDuration"
              value={inputs.sessionDuration}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
            >
              <option value="">Select duration</option>
              <option value="15-30min">15-30 minutes</option>
              <option value="30-45min">30-45 minutes</option>
              <option value="45-60min">45-60 minutes</option>
              <option value="60-90min">60-90 minutes</option>
              <option value="Half-day">Half-day workshop</option>
              <option value="Full-day">Full-day workshop</option>
            </select>
          </div>
        </div>
        <div className="space-y-2 mt-4">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="targetAudience">Target Audience</label>
          <textarea 
            id="targetAudience"
            name="targetAudience"
            value={inputs.targetAudience}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
            placeholder="Who will be in your audience? (job roles, experience level, industry, challenges, etc.)"
          ></textarea>
        </div>
      </div>

      <div className="bg-blue-50 p-3 rounded-lg shadow-sm border border-blue-100 mb-6">
        <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center">
          Session Structure & Goals
        </h3>
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="sessionFormat">Preferred Session Format</label>
          <select
            id="sessionFormat"
            name="sessionFormat"
            value={inputs.sessionFormat}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
          >
            <option value="">Select format</option>
            <option value="Keynote Presentation">Keynote Presentation</option>
            <option value="Interactive Workshop">Interactive Workshop</option>
            <option value="Panel Discussion">Panel Discussion</option>
            <option value="Fireside Chat">Fireside Chat</option>
            <option value="Case Study Presentation">Case Study Presentation</option>
            <option value="Hands-on Training">Hands-on Training</option>
            <option value="Q&A Session">Q&A Session</option>
          </select>
        </div>
        <div className="space-y-2 mt-4">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="keyMessages">Key Messages & Takeaways</label>
          <textarea 
            id="keyMessages"
            name="keyMessages"
            value={inputs.keyMessages}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
            placeholder="What are the main messages you want to convey? What should attendees learn or take away?"
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
            <i className="fas fa-microphone text-blue-600"></i>
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Keynote Topics</h4>
            <p className="text-xs text-blue-600">Generate compelling keynote presentation topics and titles.</p>
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
            <h4 className="font-medium text-blue-900">Workshop Ideas</h4>
            <p className="text-xs text-blue-600">Create interactive workshop topics and session outlines.</p>
          </div>
        </div>
        <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
      </div>
      
      <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
            <i className="fas fa-comments text-blue-600"></i>
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Panel Discussion</h4>
            <p className="text-xs text-blue-600">Generate panel topics and discussion points for collaborative sessions.</p>
          </div>
        </div>
        <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
      </div>
      
      <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
            <i className="fas fa-chart-line text-blue-600"></i>
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Case Study Topics</h4>
            <p className="text-xs text-blue-600">Create compelling case study presentations from your experience.</p>
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
            <h4 className="font-medium text-blue-900">Webinar Topics</h4>
            <p className="text-xs text-blue-600">Generate engaging webinar topics and session structures.</p>
          </div>
        </div>
        <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
      </div>
    </div>
  );

  const renderHistoryTab = () => (
    <div className="py-4">
      <History toolName="Speaker Topic Ideas" />
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
              <i className="fas fa-bullhorn text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Speaker Topic Ideas</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Generate compelling speaking topics for events and presentations</p>
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
                  {renderGenerateTab()}
                </div>
              )}
              {activeTab === 'templates' && renderTemplatesTab()}
              {activeTab === 'history' && renderHistoryTab()}
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
                      <span>Generating Topics...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Topics</span>
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
                        Generated Speaker Topic
                      </h4>
                      
                      {/* Topic Title */}
                      {results.topic_title && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-sm font-semibold text-green-800">Topic Title</h5>
                            <button
                              onClick={() => copyToClipboard(results.topic_title, 0)}
                              className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-all flex items-center gap-1"
                            >
                              {copiedIndex === 0 ? (
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
                          <div className="p-3 bg-white border border-green-200 rounded text-sm text-green-900 font-medium">
                            {results.topic_title}
                          </div>
                        </div>
                      )}

                      {/* Topic Description */}
                      {results.topic_description && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-sm font-semibold text-green-800">Topic Description</h5>
                            <button
                              onClick={() => copyToClipboard(results.topic_description, 1)}
                              className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-all flex items-center gap-1"
                            >
                              {copiedIndex === 1 ? (
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
                          <div className="p-3 bg-white border border-green-200 rounded text-sm text-green-900">
                            {results.topic_description}
                          </div>
                        </div>
                      )}

                      {/* Key Takeaways */}
                      {results.key_takeaways && results.key_takeaways.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-sm font-semibold text-green-800">Key Takeaways</h5>
                            <button
                              onClick={() => copyToClipboard(results.key_takeaways.join('\n'), 2)}
                              className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-all flex items-center gap-1"
                            >
                              {copiedIndex === 2 ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  Copy All
                                </>
                              )}
                            </button>
                          </div>
                          <div className="p-3 bg-white border border-green-200 rounded">
                            <ul className="space-y-2">
                              {results.key_takeaways.map((takeaway: string, index: number) => (
                                <li key={index} className="text-sm text-green-900 flex items-start gap-2">
                                  <span className="text-green-600 mt-1">•</span>
                                  <span>{takeaway}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Suggested Format */}
                      {results.suggested_format && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-sm font-semibold text-green-800">Suggested Format</h5>
                            <button
                              onClick={() => copyToClipboard(results.suggested_format, 3)}
                              className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-all flex items-center gap-1"
                            >
                              {copiedIndex === 3 ? (
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
                          <div className="p-3 bg-white border border-green-200 rounded text-sm text-green-900">
                            {results.suggested_format}
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
