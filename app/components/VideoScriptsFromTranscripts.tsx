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

export default function VideoScriptsFromTranscripts({ onBackClick }: { onBackClick: () => void }) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<{
    script_title?: string;
    script_content?: string;
    video_format?: string;
    key_points?: string[];
  }>({});
  const [inputs, setInputs] = useState({
    transcriptType: '',
    transcriptContent: '',
    videoFormat: '',
    targetDuration: '',
    videoStyle: '',
    targetAudience: '',
    callToAction: '',
    keyMessages: '',
    platformOptimization: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateVideoScript = async () => {
    try {
      setIsGenerating(true);
      
      const requestData = {
        transcript_type: inputs.transcriptType,
        desired_video_format: inputs.videoFormat,
        transcript_content: inputs.transcriptContent,
        target_duration: inputs.targetDuration,
        target_audience: inputs.targetAudience,
        video_style: inputs.videoStyle,
        key_messages: inputs.keyMessages,
        call_to_action: inputs.callToAction,
        platform_optimization: inputs.platformOptimization
      };

      const response = await aiToolsService.generateVideoScriptsFromTranscripts(requestData);
      setGeneratedScript(response);
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Video Scripts From Transcripts',
          toolId: 'video-scripts-from-transcripts',
          outputResult: response,
          prompt: JSON.stringify(requestData)
        });
        console.log('✅ Video scripts from transcripts saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
    } catch (error) {
      console.error('Error generating video script:', error);
      // You can add toast notification here if needed
    } finally {
      setIsGenerating(false);
    }
  };

  const renderGenerateTab = () => (
    <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h4 className="text-base font-medium text-blue-900 mb-3">Transcript Information</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-blue-900" htmlFor="transcriptType">Transcript Type</label>
              <select
                id="transcriptType"
                name="transcriptType"
                value={inputs.transcriptType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
              >
                <option value="">Select transcript type</option>
                <option value="podcast">Podcast Episode</option>
                <option value="webinar">Webinar Recording</option>
                <option value="interview">Interview</option>
                <option value="presentation">Presentation</option>
                <option value="training">Training Session</option>
                <option value="meeting">Meeting Recording</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-blue-900" htmlFor="videoFormat">Desired Video Format</label>
              <select
                id="videoFormat"
                name="videoFormat"
                value={inputs.videoFormat}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
              >
                <option value="">Select video format</option>
                <option value="youtube">YouTube Video</option>
                <option value="webinar">Webinar</option>
                <option value="sales">Sales Video</option>
                <option value="training">Training Video</option>
                <option value="explainer">Explainer Video</option>
                <option value="testimonial">Testimonial Video</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
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
      </div>
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h4 className="text-base font-medium text-blue-900 mb-3">Video Specifications</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-blue-900" htmlFor="targetDuration">Target Duration</label>
              <select
                id="targetDuration"
                name="targetDuration"
                value={inputs.targetDuration}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
              >
                <option value="">Select duration</option>
                <option value="short">Short (1-3 minutes)</option>
                <option value="medium">Medium (3-10 minutes)</option>
                <option value="long">Long (10-30 minutes)</option>
                <option value="extended">Extended (30+ minutes)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-blue-900" htmlFor="videoStyle">Video Style</label>
              <select
                id="videoStyle"
                name="videoStyle"
                value={inputs.videoStyle}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
              >
                <option value="">Select style</option>
                <option value="conversational">Conversational</option>
                <option value="professional">Professional</option>
                <option value="educational">Educational</option>
                <option value="entertaining">Entertaining</option>
                <option value="motivational">Motivational</option>
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
              placeholder="Describe your target audience and their interests..."
            ></textarea>
          </div>
        </div>
      </div>
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h4 className="text-base font-medium text-blue-900 mb-3">Content Focus</h4>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-blue-900" htmlFor="keyMessages">Key Messages to Highlight</label>
            <textarea 
              id="keyMessages"
              name="keyMessages"
              value={inputs.keyMessages}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
              placeholder="What are the main points or messages you want to emphasize in the video?"
            ></textarea>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-blue-900" htmlFor="callToAction">Call to Action</label>
            <input
              type="text"
              id="callToAction"
              name="callToAction"
              value={inputs.callToAction}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
              placeholder="What action do you want viewers to take? (e.g., subscribe, visit website, buy product)"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-blue-900" htmlFor="platformOptimization">Platform Optimization</label>
            <select
              id="platformOptimization"
              name="platformOptimization"
              value={inputs.platformOptimization}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
            >
              <option value="">Select platform</option>
              <option value="youtube">YouTube</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="linkedin">LinkedIn</option>
              <option value="vimeo">Vimeo</option>
              <option value="website">Website Embed</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={handleGenerateVideoScript}
          disabled={isGenerating}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Generating...
            </>
          ) : (
            <>
              <Wand2 size={18} className="mr-2" />
              Generate Video Script
            </>
          )}
        </button>
      </div>
      
      {/* Generated Script */}
      {generatedScript.script_title && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
            <i className="fas fa-check-circle mr-2"></i>
            Generated Video Script
          </h3>
          
          {/* Script Title */}
          <div className="mb-4">
            <h4 className="text-md font-semibold text-green-700 mb-2">Script Title</h4>
            <div className="bg-white border border-green-200 rounded-lg p-3">
              <p className="text-gray-800 font-medium">{generatedScript.script_title}</p>
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
          
          {/* Script Content */}
          {generatedScript.script_content && (
            <div className="mb-4">
              <h4 className="text-md font-semibold text-green-700 mb-2">Script Content</h4>
              <div className="bg-white border border-green-200 rounded-lg p-3">
                <p className="text-gray-800 whitespace-pre-wrap">{generatedScript.script_content}</p>
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
          )}
          
          {/* Video Format */}
          {generatedScript.video_format && (
            <div className="mb-4">
              <h4 className="text-md font-semibold text-green-700 mb-2">Video Format</h4>
              <div className="bg-white border border-green-200 rounded-lg p-3">
                <span className="text-gray-800 font-medium">{generatedScript.video_format}</span>
              </div>
            </div>
          )}
          
          {/* Key Points */}
          {generatedScript.key_points && generatedScript.key_points.length > 0 && (
            <div>
              <h4 className="text-md font-semibold text-green-700 mb-2">Key Points</h4>
              <div className="bg-white border border-green-200 rounded-lg p-3">
                <ul className="space-y-1">
                  {generatedScript.key_points.map((point, index) => (
                    <li key={index} className="text-gray-800 flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
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
              <i className="fas fa-video text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">YouTube Video Script</h4>
              <p className="text-xs text-blue-600">Template for creating engaging YouTube video scripts from transcripts.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-presentation text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Webinar Script</h4>
              <p className="text-xs text-blue-600">Template for converting transcripts into structured webinar presentations.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-bullhorn text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Sales Video Script</h4>
              <p className="text-xs text-blue-600">Template for creating compelling sales videos from your content.</p>
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
              <h4 className="font-medium text-blue-900">Educational Video</h4>
              <p className="text-xs text-blue-600">Template for creating instructional and educational video content.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
    </div>
  );
  };

  const renderHistoryTab = () => {
    return (
      <div className="py-4">
        <History toolName="Video Scripts From Transcripts" />
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
              <i className="fas fa-video text-blue-100 text-3xl"></i>
        </div>
        <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Video Scripts from Transcripts</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Transform your transcripts into engaging video scripts</p>
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
              {activeTab === 'generate' && renderGenerateTab()}
              {activeTab === 'templates' && renderTemplatesTab()}
              {activeTab === 'history' && renderHistoryTab()}
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
                  onClick={handleGenerateVideoScript}
                  disabled={isGenerating}
                  className="px-5 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Video Script</span>
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
