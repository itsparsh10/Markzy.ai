'use client'

import { useState } from 'react';
import { ArrowLeft, Briefcase, Users, Footprints, Lightbulb, Target, Search, ShoppingBag, MessageSquare, ThumbsUp, FileText, History as HistoryIcon, Route, Clock, X, Save, Wand2, Copy, Check } from 'lucide-react';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import { aiToolsService } from '../../services/aiTools.js';
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

export default function RepurposeWebinarTranscripts({ onBackClick }: { onBackClick: () => void }) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());
  
  const [inputs, setInputs] = useState({
    contentType: '',
    videoTitle: '',
    transcriptContent: '',
    videoDuration: '',
    targetAudience: '',
    keyTopics: '',
    mainTakeaways: '',
    callToAction: '',
    repurposeGoals: '',
    outputFormats: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateContent = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const requestData = {
        content_type: inputs.contentType,
        video_duration: inputs.videoDuration,
        video_title_topic: inputs.videoTitle,
        transcript_text: inputs.transcriptContent,
        key_topics_covered: inputs.keyTopics,
        main_takeaways_insights: inputs.mainTakeaways,
        target_audience: inputs.targetAudience,
        call_to_action: inputs.callToAction,
        repurposing_goals: inputs.repurposeGoals,
      };

      const response = await aiToolsService.generateRepurposeVideo(requestData);
      setResults(response);
      
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Repurpose Webinar Transcripts',
          toolId: 'repurpose-webinar-transcripts',
          outputResult: response,
          prompt: JSON.stringify(requestData)
        });
        console.log('✅ Repurpose webinar transcripts saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
      console.log('Repurpose Video API Response:', response);
    } catch (err: any) {
      console.error('Error generating repurpose video content:', err);
      setError(err.response?.data?.message || err.message || 'Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems(prev => new Set(Array.from(prev).concat(itemId)));
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const renderGenerateTab = () => (
    <div className="space-y-6">
      <SectionCard title="Video Content Information" icon={Briefcase}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-blue-900" htmlFor="contentType">Content Type</label>
            <select
              id="contentType"
              name="contentType"
              value={inputs.contentType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
            >
              <option value="">Select content type</option>
              <option value="webinar">Webinar</option>
              <option value="demo">Product Demo</option>
              <option value="sales-video">Sales Video</option>
              <option value="presentation">Presentation</option>
              <option value="training">Training Session</option>
              <option value="interview">Interview</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-blue-900" htmlFor="videoDuration">Video Duration</label>
            <select
              id="videoDuration"
              name="videoDuration"
              value={inputs.videoDuration}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
            >
              <option value="">Select duration</option>
              <option value="short">Under 15 minutes</option>
              <option value="medium">15-30 minutes</option>
              <option value="long">30-60 minutes</option>
              <option value="extended">Over 60 minutes</option>
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="videoTitle">Video Title/Topic</label>
          <textarea 
            id="videoTitle"
            name="videoTitle"
            value={inputs.videoTitle}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
            placeholder="What was the main title or topic of your video content?"
          ></textarea>
        </div>
      </SectionCard>

      <SectionCard title="Transcript Content" icon={FileText}>
        <InputField
          label="Transcript Text"
          id="transcriptContent"
          value={inputs.transcriptContent}
          onChange={handleInputChange}
          type="textarea"
          rows={8}
          placeholder="Paste your video transcript here. This will be used to generate various marketing assets."
        />
        <InputField
          label="Key Topics Covered"
          id="keyTopics"
          value={inputs.keyTopics}
          onChange={handleInputChange}
          type="textarea"
          placeholder="List the main topics, themes, or subjects discussed in the video"
          Icon={Lightbulb}
        />
        <InputField
          label="Main Takeaways & Insights"
          id="mainTakeaways"
          value={inputs.mainTakeaways}
          onChange={handleInputChange}
          type="textarea"
          placeholder="What are the key insights, lessons, or value points from this content?"
          Icon={Target}
        />
      </SectionCard>

      <SectionCard title="Repurposing Strategy" icon={Users}>
        <InputField
          label="Target Audience"
          id="targetAudience"
          value={inputs.targetAudience}
          onChange={handleInputChange}
          type="textarea"
          placeholder="Who was the original audience and who do you want to reach with repurposed content?"
          Icon={Users}
        />
        <InputField
          label="Call to Action"
          id="callToAction"
          value={inputs.callToAction}
          onChange={handleInputChange}
          type="textarea"
          placeholder="What action did you want viewers to take? (sign up, purchase, download, etc.)"
          Icon={ThumbsUp}
        />
        <InputField
          label="Repurposing Goals"
          id="repurposeGoals"
          value={inputs.repurposeGoals}
          onChange={handleInputChange}
          type="select"
          options={['Social Media Content', 'Blog Posts', 'Email Sequences', 'Lead Magnets', 'Sales Materials', 'Educational Content', 'All Formats']}
          placeholder="What type of content do you want to create?"
          Icon={Search}
        />
      </SectionCard>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center text-sm"
          onClick={handleGenerateContent}
          disabled={loading}
        >
          {loading ? (
            <>
              <Wand2 size={18} className="mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 size={18} className="mr-2" />
              Repurpose Content
            </>
          )}
        </button>
      </div>
      {error && (
        <div className="mt-4 text-red-600 bg-red-50 border border-red-200 rounded p-3 text-sm">{error}</div>
      )}
      {results && results.strategy_summary && (
        <div className="mt-8 mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-base font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <FileText size={18} className="text-blue-500" /> Summary
          </h4>
          <div className="text-gray-900 text-sm whitespace-pre-line">{results.strategy_summary}</div>
        </div>
      )}
      {results && results.repurposed_assets && (
        <div className="mt-8">
          <h4 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
            <Wand2 size={20} className="text-blue-500" /> Repurposed Assets
          </h4>
          <div className="space-y-4">
            {results.repurposed_assets.map((item: any, idx: number) => (
              <div key={idx} className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <div className="font-semibold text-blue-700">{item.asset}</div>
                  <div className="text-gray-800 text-sm mt-1 whitespace-pre-line">{item.description}</div>
                </div>
                <button
                  className={`ml-0 md:ml-4 mt-2 md:mt-0 px-3 py-1.5 text-xs rounded flex items-center gap-1 border border-blue-200 ${copiedItems.has(`${idx}`) ? 'bg-green-100 text-green-700 border-green-300' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                  onClick={() => copyToClipboard(item.description, `${idx}`)}
                >
                  {copiedItems.has(`${idx}`) ? <Check size={14} /> : <Copy size={14} />}
                  {copiedItems.has(`${idx}`) ? 'Copied!' : 'Copy'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderTemplatesTab = () => (
    <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
      <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
            <i className="fas fa-video text-blue-600"></i>
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Webinar Repurposing</h4>
            <p className="text-xs text-blue-600">Template for repurposing educational webinar content into multiple formats.</p>
          </div>
        </div>
        <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
      </div>
      <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
            <i className="fas fa-desktop text-blue-600"></i>
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Product Demo Repurposing</h4>
            <p className="text-xs text-blue-600">Template for converting product demonstrations into sales materials.</p>
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
            <h4 className="font-medium text-blue-900">Sales Video Repurposing</h4>
            <p className="text-xs text-blue-600">Template for transforming sales presentations into marketing content.</p>
          </div>
        </div>
        <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
      </div>
      <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
            <i className="fas fa-chalkboard-teacher text-blue-600"></i>
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Training Content Repurposing</h4>
            <p className="text-xs text-blue-600">Template for converting training sessions into educational materials.</p>
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
      <h3 className="text-blue-900 font-medium">History</h3>
      <p className="text-sm text-blue-700 max-w-md">View your previously repurposed video content.</p>
    </div>
  );

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-film text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Repurpose Webinar/Demo/Sales Video</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Transform video transcripts into marketing assets</p>
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
          <div className="flex-1 overflow-y-auto bg-gradient-to-b from-blue-50/50 to-white">
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
            <div className="p-4 pt-3">
              {activeTab === 'generate' && (
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                  {renderGenerateTab()}
                </div>
              )}
              {activeTab === 'templates' && renderTemplatesTab()}
              {activeTab === 'history' && (
                <div className="py-4">
                  <History toolName="Repurpose Webinar Transcripts" />
                </div>
              )}
            </div>
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
