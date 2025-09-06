'use client'

import { useState } from 'react';
import { ArrowLeft, Briefcase, Users, Footprints, Lightbulb, Target, Search, ShoppingBag, MessageSquare, ThumbsUp, FileText, History as HistoryIcon, Route, Clock, X, Save, Wand2, Copy, Check } from 'lucide-react';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import { aiToolsService } from '../../services/aiTools.js';
import History from './History/History';

export default function RepurposingForSubstack({ onBackClick }: { onBackClick: () => void }) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());
  
  const [inputs, setInputs] = useState({
    originalContent: '',
    contentType: '',
    substackAudience: '',
    contentGoal: '',
    substackTone: '',
    contentLength: '',
    communityElements: '',
    callToAction: '',
    newsletterFocus: '',
    engagementStrategy: ''
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
        target_length: inputs.contentLength,
        original_content: inputs.originalContent,
        substack_audience: inputs.substackAudience,
        content_goal: inputs.contentGoal,
        substack_tone: inputs.substackTone,
        community_elements: inputs.communityElements,
        engagement_strategy: inputs.engagementStrategy,
      };

      const response = await aiToolsService.generateRepurposeSubstack(requestData);
      setResults(response);
      
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Repurposing For Substack',
          toolId: 'repurposing-for-substack',
          outputResult: response,
          prompt: JSON.stringify(requestData)
        });
        console.log('✅ Repurposing for Substack saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
      console.log('Repurpose Substack API Response:', response);
    } catch (err: any) {
      console.error('Error generating repurpose substack content:', err);
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
    <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h4 className="text-base font-medium text-blue-900 mb-3">Original Content</h4>
        <div className="space-y-4">
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
                <option value="blog-post">Blog Post</option>
                <option value="article">Article</option>
                <option value="social-media">Social Media Post</option>
                <option value="video">Video Content</option>
                <option value="podcast">Podcast</option>
                <option value="newsletter">Newsletter</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-blue-900" htmlFor="contentLength">Target Length</label>
              <select
                id="contentLength"
                name="contentLength"
                value={inputs.contentLength}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
              >
                <option value="">Select length</option>
                <option value="short">Short (300-500 words)</option>
                <option value="medium">Medium (500-1000 words)</option>
                <option value="long">Long (1000+ words)</option>
                <option value="series">Multi-part series</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-blue-900" htmlFor="originalContent">Original Content</label>
            <textarea 
              id="originalContent"
              name="originalContent"
              value={inputs.originalContent}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-24" 
              placeholder="Paste your original content here that you want to repurpose for Substack..."
            ></textarea>
          </div>
        </div>
      </div>

      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h4 className="text-base font-medium text-blue-900 mb-3">Substack Strategy</h4>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-blue-900" htmlFor="substackAudience">Substack Audience</label>
            <textarea 
              id="substackAudience"
              name="substackAudience"
              value={inputs.substackAudience}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
              placeholder="Describe your Substack audience and their interests..."
            ></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-blue-900" htmlFor="contentGoal">Content Goal</label>
              <select
                id="contentGoal"
                name="contentGoal"
                value={inputs.contentGoal}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
              >
                <option value="">Select goal</option>
                <option value="educate">Educate</option>
                <option value="entertain">Entertain</option>
                <option value="inspire">Inspire</option>
                <option value="inform">Inform</option>
                <option value="engage">Build Community</option>
                <option value="convert">Drive Conversions</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-blue-900" htmlFor="substackTone">Substack Tone</label>
              <select
                id="substackTone"
                name="substackTone"
                value={inputs.substackTone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
              >
                <option value="">Select tone</option>
                <option value="conversational">Conversational</option>
                <option value="professional">Professional</option>
                <option value="personal">Personal</option>
                <option value="analytical">Analytical</option>
                <option value="storytelling">Storytelling</option>
                <option value="casual">Casual</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h4 className="text-base font-medium text-blue-900 mb-3">Community & Engagement</h4>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-blue-900" htmlFor="communityElements">Community Elements</label>
            <textarea 
              id="communityElements"
              name="communityElements"
              value={inputs.communityElements}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
              placeholder="What community-focused elements should be added? (polls, discussions, Q&A sections, etc.)"
            ></textarea>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-blue-900" htmlFor="engagementStrategy">Engagement Strategy</label>
            <textarea 
              id="engagementStrategy"
              name="engagementStrategy"
              value={inputs.engagementStrategy}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
              placeholder="How do you want to encourage reader engagement and build community?"
            ></textarea>
          </div>
        </div>
      </div>
      
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
      {results && (
        <div className="mt-8 space-y-6">
          <h4 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
            <FileText size={20} className="text-blue-500" /> Repurposed Substack Content
          </h4>
          <div className="space-y-4">
            {results.strategy_summary && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h5 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                  <Lightbulb size={16} className="text-green-500" /> Strategy Summary
                </h5>
                <div className="text-gray-800 text-sm whitespace-pre-line">{results.strategy_summary}</div>
                <div className="flex justify-end mt-2 space-x-2">
                  <button
                    className={`px-3 py-1.5 text-xs rounded flex items-center gap-1 border border-green-200 ${copiedItems.has('strategy_summary') ? 'bg-green-100 text-green-700 border-green-300' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
                    onClick={() => copyToClipboard(results.strategy_summary, 'strategy_summary')}
                  >
                    {copiedItems.has('strategy_summary') ? <Check size={14} /> : <Copy size={14} />}
                    {copiedItems.has('strategy_summary') ? 'Copied!' : 'Copy Summary'}
                  </button>
                </div>
              </div>
            )}
            {results.substack_content && (
              <div className="bg-white border border-green-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h5 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                      <MessageSquare size={16} className="text-green-500" /> Substack Content
                    </h5>
                    <div className="text-gray-800 text-sm whitespace-pre-line">{results.substack_content}</div>
                  </div>
                  <button
                    className={`px-3 py-1.5 text-xs rounded flex items-center gap-1 border border-green-200 ${copiedItems.has('substack_content') ? 'bg-green-100 text-green-700 border-green-300' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
                    onClick={() => copyToClipboard(results.substack_content, 'substack_content')}
                  >
                    {copiedItems.has('substack_content') ? <Check size={14} /> : <Copy size={14} />}
                    {copiedItems.has('substack_content') ? 'Copied!' : 'Copy Content'}
                  </button>
                </div>
              </div>
            )}
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
            <i className="fas fa-newspaper text-blue-600"></i>
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Newsletter Format</h4>
            <p className="text-xs text-blue-600">Convert content into engaging newsletter format for Substack.</p>
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
            <h4 className="font-medium text-blue-900">Community Discussion</h4>
            <p className="text-xs text-blue-600">Transform content into community-focused discussion pieces.</p>
          </div>
        </div>
        <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
      </div>
    </div>
  );

  const renderHistoryTab = () => (
    <div className="py-4">
      <History toolName="Repurposing For Substack" />
    </div>
  );

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-recycle text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Repurposing for Substack</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Transform your content for Substack audience with community elements</p>
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
              {activeTab === 'generate' && renderGenerateTab()}
              {activeTab === 'templates' && renderTemplatesTab()}
              {activeTab === 'history' && renderHistoryTab()}
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
