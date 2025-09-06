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
      {Icon && <Icon className="w-6 h-6 mr-3 text-blue-600" />}
      {title}
    </h3>
    {children}
  </div>
);

export default function SEOMagic({ onBackClick }: { onBackClick: () => void }) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());
  
  const [inputs, setInputs] = useState({
    contentType: '',
    originalContent: '',
    targetKeywords: '',
    targetAudience: '',
    seoGoals: '',
    contentLength: '',
    competitiveDifficulty: '',
    websiteUrl: '',
    contentTone: '',
    additionalContext: ''
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
        content_length: inputs.contentLength,
        original_content: inputs.originalContent,
        target_keywords: inputs.targetKeywords,
        seo_goals: inputs.seoGoals,
        competitive_difficulty: inputs.competitiveDifficulty,
        website_url: inputs.websiteUrl || '',
        target_audience: inputs.targetAudience,
        content_tone: inputs.contentTone,
        additional_context: inputs.additionalContext,
      };

      const response = await aiToolsService.generateSEOMagic(requestData);
      setResults(response);
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'SEO Magic',
          toolId: 'seo-magic',
          outputResult: response,
          prompt: JSON.stringify(requestData)
        });
        console.log('✅ SEO Magic saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
      console.log('SEO Magic API Response:', response);
    } catch (err: any) {
      console.error('Error generating SEO optimization:', err);
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
      <div className="bg-blue-50 p-3 rounded-lg shadow-sm border border-blue-100 mb-6">
        <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center">
          Content Information
        </h3>
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
              <option value="blog">Blog Post</option>
              <option value="website">Website Page</option>
              <option value="product">Product Description</option>
              <option value="landing">Landing Page</option>
              <option value="article">Article</option>
              <option value="social">Social Media Post</option>
              <option value="email">Email Content</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-blue-900" htmlFor="contentLength">Content Length</label>
            <select
              id="contentLength"
              name="contentLength"
              value={inputs.contentLength}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
            >
              <option value="">Select length</option>
              <option value="brief">Brief (300-500 words)</option>
              <option value="standard">Standard (500-1000 words)</option>
              <option value="detailed">Detailed (1000-2000 words)</option>
              <option value="comprehensive">Comprehensive (2000+ words)</option>
              <option value="unchanged">Keep original length</option>
            </select>
          </div>
        </div>
        <div className="space-y-2 mt-4">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="originalContent">Original Content</label>
          <textarea 
            id="originalContent"
            name="originalContent"
            value={inputs.originalContent}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-32" 
            placeholder="Paste your content to optimize for SEO..."
          ></textarea>
        </div>
      </div>

      <div className="bg-blue-50 p-3 rounded-lg shadow-sm border border-blue-100 mb-6">
        <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center">
          SEO Strategy
        </h3>
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="targetKeywords">Target Keywords</label>
          <textarea 
            id="targetKeywords"
            name="targetKeywords"
            value={inputs.targetKeywords}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
            placeholder="Enter primary and secondary keywords, separated by commas"
          ></textarea>
        </div>
        <div className="space-y-2 mt-4">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="seoGoals">SEO Goals</label>
          <select
            id="seoGoals"
            name="seoGoals"
            value={inputs.seoGoals}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
          >
            <option value="">Select goal</option>
            <option value="ranking">Improve Search Rankings</option>
            <option value="traffic">Increase Organic Traffic</option>
            <option value="conversion">Optimize for Conversions</option>
            <option value="authority">Build Topical Authority</option>
            <option value="featured">Target Featured Snippets</option>
            <option value="local">Optimize for Local Search</option>
          </select>
        </div>
        <div className="space-y-2 mt-4">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="competitiveDifficulty">Competitive Difficulty</label>
          <select
            id="competitiveDifficulty"
            name="competitiveDifficulty"
            value={inputs.competitiveDifficulty}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
          >
            <option value="">Select difficulty</option>
            <option value="low">Low (Easy to rank)</option>
            <option value="medium">Medium</option>
            <option value="high">High (Competitive niche)</option>
            <option value="very-high">Very High (Highly competitive)</option>
          </select>
        </div>
        <div className="space-y-2 mt-4">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="websiteUrl">Website URL (optional)</label>
          <input
            type="text"
            id="websiteUrl"
            name="websiteUrl"
            value={inputs.websiteUrl}
            onChange={handleInputChange}
            placeholder="Enter your website URL for more targeted optimization"
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
          />
        </div>
      </div>

      <div className="bg-blue-50 p-3 rounded-lg shadow-sm border border-blue-100 mb-6">
        <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center">
          Audience & Content Preferences
        </h3>
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="targetAudience">Target Audience</label>
          <textarea 
            id="targetAudience"
            name="targetAudience"
            value={inputs.targetAudience}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
            placeholder="Describe your target audience and their search intent"
          ></textarea>
        </div>
        <div className="space-y-2 mt-4">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="contentTone">Content Tone</label>
          <select
            id="contentTone"
            name="contentTone"
            value={inputs.contentTone}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
          >
            <option value="">Select tone</option>
            <option value="professional">Professional</option>
            <option value="conversational">Conversational</option>
            <option value="educational">Educational</option>
            <option value="persuasive">Persuasive</option>
            <option value="technical">Technical</option>
            <option value="empathetic">Empathetic</option>
          </select>
        </div>
        <div className="space-y-2 mt-4">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="additionalContext">Additional Context</label>
          <textarea 
            id="additionalContext"
            name="additionalContext"
            value={inputs.additionalContext}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
            placeholder="Any additional information that would help create better SEO-optimized content"
          ></textarea>
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
              Optimizing...
            </>
          ) : (
            <>
              <Wand2 size={18} className="mr-2" />
              Optimize Content
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
            <FileText size={20} className="text-blue-500" /> SEO Optimization Results
          </h4>
          <div className="space-y-4">
            {results.optimized_content && (
              <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h5 className="font-semibold text-blue-700 mb-2">Optimized Content</h5>
                    <div className="text-gray-800 text-sm whitespace-pre-line max-h-60 overflow-y-auto" 
                         dangerouslySetInnerHTML={{ __html: results.optimized_content }}>
                    </div>
                  </div>
                  <button
                    className={`px-3 py-1.5 text-xs rounded flex items-center gap-1 border border-blue-200 ${copiedItems.has('optimized_content') ? 'bg-green-100 text-green-700 border-green-300' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                    onClick={() => copyToClipboard(results.optimized_content, 'optimized_content')}
                  >
                    {copiedItems.has('optimized_content') ? <Check size={14} /> : <Copy size={14} />}
                    {copiedItems.has('optimized_content') ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
            {results.seo_summary && (
              <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h5 className="font-semibold text-blue-700 mb-2">SEO Summary</h5>
                    <div className="text-gray-800 text-sm whitespace-pre-line">{results.seo_summary}</div>
                  </div>
                  <button
                    className={`px-3 py-1.5 text-xs rounded flex items-center gap-1 border border-blue-200 ${copiedItems.has('seo_summary') ? 'bg-green-100 text-green-700 border-green-300' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                    onClick={() => copyToClipboard(results.seo_summary, 'seo_summary')}
                  >
                    {copiedItems.has('seo_summary') ? <Check size={14} /> : <Copy size={14} />}
                    {copiedItems.has('seo_summary') ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
            {results.keyword_usage && results.keyword_usage.length > 0 && (
              <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h5 className="font-semibold text-blue-700 mb-2">Keyword Usage</h5>
                    <div className="space-y-2">
                      {results.keyword_usage.map((usage: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></span>
                          <span className="text-gray-800 text-sm">{usage}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    className={`px-3 py-1.5 text-xs rounded flex items-center gap-1 border border-blue-200 ${copiedItems.has('keyword_usage') ? 'bg-green-100 text-green-700 border-green-300' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                    onClick={() => copyToClipboard(results.keyword_usage.join('\n'), 'keyword_usage')}
                  >
                    {copiedItems.has('keyword_usage') ? <Check size={14} /> : <Copy size={14} />}
                    {copiedItems.has('keyword_usage') ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
            {results.onpage_recommendations && (
              <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h5 className="font-semibold text-blue-700 mb-2">On-Page Recommendations</h5>
                    <div className="text-gray-800 text-sm whitespace-pre-line">{results.onpage_recommendations}</div>
                  </div>
                  <button
                    className={`px-3 py-1.5 text-xs rounded flex items-center gap-1 border border-blue-200 ${copiedItems.has('onpage_recommendations') ? 'bg-green-100 text-green-700 border-green-300' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                    onClick={() => copyToClipboard(results.onpage_recommendations, 'onpage_recommendations')}
                  >
                    {copiedItems.has('onpage_recommendations') ? <Check size={14} /> : <Copy size={14} />}
                    {copiedItems.has('onpage_recommendations') ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
            {results.meta_title && (
              <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h5 className="font-semibold text-blue-700 mb-2">Meta Title</h5>
                    <div className="text-gray-800 text-sm whitespace-pre-line">{results.meta_title}</div>
                  </div>
                  <button
                    className={`px-3 py-1.5 text-xs rounded flex items-center gap-1 border border-blue-200 ${copiedItems.has('meta_title') ? 'bg-green-100 text-green-700 border-green-300' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                    onClick={() => copyToClipboard(results.meta_title, 'meta_title')}
                  >
                    {copiedItems.has('meta_title') ? <Check size={14} /> : <Copy size={14} />}
                    {copiedItems.has('meta_title') ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
            {results.meta_description && (
              <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h5 className="font-semibold text-blue-700 mb-2">Meta Description</h5>
                    <div className="text-gray-800 text-sm whitespace-pre-line">{results.meta_description}</div>
                  </div>
                  <button
                    className={`px-3 py-1.5 text-xs rounded flex items-center gap-1 border border-blue-200 ${copiedItems.has('meta_description') ? 'bg-green-100 text-green-700 border-green-300' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                    onClick={() => copyToClipboard(results.meta_description, 'meta_description')}
                  >
                    {copiedItems.has('meta_description') ? <Check size={14} /> : <Copy size={14} />}
                    {copiedItems.has('meta_description') ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
            {results.structured_data && (
              <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h5 className="font-semibold text-blue-700 mb-2">Structured Data</h5>
                    <div className="text-gray-800 text-sm whitespace-pre-line max-h-40 overflow-y-auto font-mono text-xs">{results.structured_data}</div>
                  </div>
                  <button
                    className={`px-3 py-1.5 text-xs rounded flex items-center gap-1 border border-blue-200 ${copiedItems.has('structured_data') ? 'bg-green-100 text-green-700 border-green-300' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                    onClick={() => copyToClipboard(results.structured_data, 'structured_data')}
                  >
                    {copiedItems.has('structured_data') ? <Check size={14} /> : <Copy size={14} />}
                    {copiedItems.has('structured_data') ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
            {results.call_to_action && (
              <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h5 className="font-semibold text-blue-700 mb-2">Call to Action</h5>
                    <div className="text-gray-800 text-sm whitespace-pre-line">{results.call_to_action}</div>
                  </div>
                  <button
                    className={`px-3 py-1.5 text-xs rounded flex items-center gap-1 border border-blue-200 ${copiedItems.has('call_to_action') ? 'bg-green-100 text-green-700 border-green-300' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                    onClick={() => copyToClipboard(results.call_to_action, 'call_to_action')}
                  >
                    {copiedItems.has('call_to_action') ? <Check size={14} /> : <Copy size={14} />}
                    {copiedItems.has('call_to_action') ? 'Copied!' : 'Copy'}
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
            <i className="fas fa-blog text-blue-600"></i>
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Blog Post Optimization</h4>
            <p className="text-xs text-blue-600">SEO template optimized for blog content and articles.</p>
          </div>
        </div>
        <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
      </div>
      
      <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
            <i className="fas fa-store text-blue-600"></i>
          </div>
          <div>
            <h4 className="font-medium text-blue-900">E-commerce Product Page</h4>
            <p className="text-xs text-blue-600">SEO template for product descriptions and e-commerce pages.</p>
          </div>
        </div>
        <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
      </div>
      
      <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
            <i className="fas fa-browser text-blue-600"></i>
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Landing Page Optimization</h4>
            <p className="text-xs text-blue-600">SEO template for high-converting landing pages.</p>
          </div>
        </div>
        <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
      </div>
      
      <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
            <i className="fas fa-map-marker-alt text-blue-600"></i>
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Local SEO Optimization</h4>
            <p className="text-xs text-blue-600">SEO template for local business and location-based content.</p>
          </div>
        </div>
        <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
      </div>
      
      <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
            <i className="fas fa-laptop-code text-blue-600"></i>
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Technical SEO Audit</h4>
            <p className="text-xs text-blue-600">Template for technical SEO analysis and recommendations.</p>
          </div>
        </div>
        <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
      </div>
    </div>
  );

  const renderHistoryTab = () => (
    <div className="py-4">
      <History toolName="SEO Magic" />
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
              <i className="fas fa-search text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">SEO Magic</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Optimize your content for search engines</p>
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
                  {renderGenerateTab()}
                  
                </div>
              )}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}