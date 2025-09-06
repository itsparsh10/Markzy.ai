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
      {Icon && <Icon className="w-6 h-6 mr-3 text-blue-600" />}
      {title}
    </h3>
    {children}
  </div>
);

export default function TranscriptFreestyle({ onBackClick }: { onBackClick: () => void }) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{
    custom_output?: string;
    output_format?: string;
  }>({});
  const [inputs, setInputs] = useState({
    transcriptSource: '',
    transcriptContent: '',
    outputGoal: '',
    targetFormat: '',
    audienceType: '',
    specificRequest: '',
    additionalRequirements: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleProcessTranscript = async () => {
    try {
      setIsGenerating(true);
      
      const requestData = {
        transcript_type: inputs.transcriptSource,
        transcript_content: inputs.transcriptContent,
        output_goal: inputs.outputGoal,
        target_format: inputs.targetFormat,
        target_audience: inputs.audienceType,
        specific_request: inputs.specificRequest,
        additional_requirements: inputs.additionalRequirements
      };

      const response = await aiToolsService.generateTranscriptFreestyle(requestData);
      setGeneratedContent(response);
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Transcript Freestyle',
          toolId: 'transcript-freestyle',
          outputResult: response,
          prompt: JSON.stringify(requestData)
        });
        console.log('✅ Transcript freestyle saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
    } catch (error) {
      console.error('Error processing transcript:', error);
      // You can add toast notification here if needed
    } finally {
      setIsGenerating(false);
    }
  };

  const renderGenerateTab = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-3 rounded-lg shadow-sm border border-blue-100 mb-6">
        <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center">
          Transcript Source
        </h3>
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="transcriptSource">Transcript Type</label>
          <select
            id="transcriptSource"
            name="transcriptSource"
            value={inputs.transcriptSource}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
          >
            <option value="">Select transcript source</option>
            <option value="podcast">Podcast</option>
            <option value="video">Video</option>
            <option value="webinar">Webinar</option>
            <option value="interview">Interview</option>
            <option value="presentation">Presentation</option>
            <option value="meeting">Meeting</option>
            <option value="workshop">Workshop</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="space-y-2 mt-4">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="transcriptContent">Transcript Content</label>
          <textarea 
            id="transcriptContent"
            name="transcriptContent"
            value={inputs.transcriptContent}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-32" 
            placeholder="Paste your transcript content here..."
          ></textarea>
        </div>
      </div>

      <div className="bg-blue-50 p-3 rounded-lg shadow-sm border border-blue-100 mb-6">
        <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center">
          Output Requirements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-blue-900" htmlFor="outputGoal">Output Goal</label>
            <select
              id="outputGoal"
              name="outputGoal"
              value={inputs.outputGoal}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
            >
              <option value="">Select your goal</option>
              <option value="summary">Summary/Key Points</option>
              <option value="content">Content Creation</option>
              <option value="quotes">Extract Quotes</option>
              <option value="insights">Key Insights</option>
              <option value="actionable">Actionable Steps</option>
              <option value="marketing">Marketing Material</option>
              <option value="educational">Educational Content</option>
              <option value="custom">Custom Request</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-blue-900" htmlFor="targetFormat">Target Format</label>
            <select
              id="targetFormat"
              name="targetFormat"
              value={inputs.targetFormat}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
            >
              <option value="">Select format</option>
              <option value="blog-post">Blog Post</option>
              <option value="social-media">Social Media Posts</option>
              <option value="email">Email Content</option>
              <option value="script">Video/Audio Script</option>
              <option value="outline">Content Outline</option>
              <option value="bullets">Bullet Points</option>
              <option value="article">Article</option>
              <option value="infographic">Infographic Content</option>
            </select>
          </div>
        </div>
        <div className="space-y-2 mt-4">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="audienceType">Target Audience</label>
          <input
            id="audienceType"
            name="audienceType"
            value={inputs.audienceType}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
            placeholder="Who is this content for? (e.g., business owners, marketers, students)"
          />
        </div>
      </div>

      <div className="bg-blue-50 p-3 rounded-lg shadow-sm border border-blue-100 mb-6">
        <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center">
          Custom Request
        </h3>
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="specificRequest">Specific Request</label>
          <textarea 
            id="specificRequest"
            name="specificRequest"
            value={inputs.specificRequest}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-24" 
            placeholder="What specific output do you want from this transcript? Be as detailed as possible..."
          ></textarea>
        </div>
        <div className="space-y-2 mt-4">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="additionalRequirements">Additional Requirements</label>
          <textarea 
            id="additionalRequirements"
            name="additionalRequirements"
            value={inputs.additionalRequirements}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
            placeholder="Any specific tone, style, length requirements, or other considerations?"
          ></textarea>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={handleProcessTranscript}
          disabled={isGenerating}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <Wand2 size={18} className="mr-2" />
              Generate Custom Content
            </>
          )}
        </button>
      </div>
      
      {/* Generated Content */}
      {generatedContent.custom_output && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
            <i className="fas fa-check-circle mr-2"></i>
            Generated Content
          </h3>
          
          {/* Custom Output */}
          <div className="mb-4">
            <h4 className="text-md font-semibold text-green-700 mb-2">Custom Output</h4>
            <div className="bg-white border border-green-200 rounded-lg p-3">
              <p className="text-gray-800 whitespace-pre-wrap">{generatedContent.custom_output}</p>
              <div className="flex justify-end mt-2 space-x-2">
                <button className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50 transition-all">
                  <i className="fas fa-copy mr-1"></i>Copy
                </button>
                <button className="text-xs text-green-600 hover:text-green-800 px-2 py-1 rounded hover:bg-green-50 transition-all">
                  <i className="fas fa-save mr-1"></i>Save
                </button>
              </div>
            </div>
          </div>
          
          {/* Output Format */}
          {generatedContent.output_format && (
            <div>
              <h4 className="text-md font-semibold text-green-700 mb-2">Output Format</h4>
              <div className="bg-white border border-green-200 rounded-lg p-3">
                <span className="text-gray-800 font-medium">{generatedContent.output_format}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderTemplatesTab = () => {
    return (
      <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-list text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Key Points Extraction</h4>
              <p className="text-xs text-blue-600">Template for extracting the main points and takeaways from transcripts.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-quote-right text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Quote Extraction</h4>
              <p className="text-xs text-blue-600">Template for finding and formatting the best quotes from transcripts.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-lightbulb text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Insights & Themes</h4>
              <p className="text-xs text-blue-600">Template for identifying key insights and recurring themes.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-tasks text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Action Items</h4>
              <p className="text-xs text-blue-600">Template for extracting actionable steps and recommendations.</p>
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
        <p className="text-sm text-blue-700 max-w-md">View your previously processed transcript freestyle requests.</p>
        <button className="mt-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 hover:bg-blue-100 transition-all duration-200 text-sm">
          <i className="fas fa-clock mr-2"></i>View History
        </button>
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
              <i className="fas fa-file-alt text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Transcript Freestyle</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Get custom output from your transcript content</p>
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
                  <History toolName="Transcript Freestyle" />
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
                  onClick={handleProcessTranscript}
                  disabled={isGenerating}
                  className="px-5 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Process Transcript</span>
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
