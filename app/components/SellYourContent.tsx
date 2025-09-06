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

export default function SellYourContent({ onBackClick }: { onBackClick: () => void }) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());
  
  const [inputs, setInputs] = useState({
    transcriptType: '',
    transcriptContent: '',
    contentPurpose: '',
    targetAudience: '',
    contentFormat: '',
    contentLength: '',
    monetizationGoals: '',
    contentTone: '',
    additionalContext: '',
    platformsToSell: ''
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
        transcript_type: inputs.transcriptType,
        content_purpose: inputs.contentPurpose,
        transcript_content: inputs.transcriptContent,
        target_audience: inputs.targetAudience,
        monetization_goals: inputs.monetizationGoals,
        platforms_to_sell_on: inputs.platformsToSell,
        content_format: inputs.contentFormat,
        content_length: inputs.contentLength,
        content_tone: inputs.contentTone,
        additional_context: inputs.additionalContext,
      };

      const response = await aiToolsService.generateSellTranscriptContent(requestData);
      setResults(response);
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Sell Your Content',
          toolId: 'sell-your-content',
          outputResult: response,
          prompt: JSON.stringify(requestData)
        });
        console.log('✅ Sell your content saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
      console.log('Sell Transcript Content API Response:', response);
    } catch (err: any) {
      console.error('Error generating sell transcript content:', err);
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
          Transcript Information
        </h3>
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
              <option value="podcast">Podcast</option>
              <option value="video">Video</option>
              <option value="interview">Interview</option>
              <option value="presentation">Presentation</option>
              <option value="webinar">Webinar</option>
              <option value="workshop">Workshop</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-blue-900" htmlFor="contentPurpose">Content Purpose</label>
            <select
              id="contentPurpose"
              name="contentPurpose"
              value={inputs.contentPurpose}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
            >
              <option value="">Select purpose</option>
              <option value="educate">Educate/Teach</option>
              <option value="entertain">Entertain</option>
              <option value="inform">Inform</option>
              <option value="inspire">Inspire</option>
              <option value="sell">Sell Products/Services</option>
              <option value="promote">Promote Brand</option>
            </select>
          </div>
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
          Audience & Monetization
        </h3>
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="targetAudience">Target Audience</label>
          <textarea 
            id="targetAudience"
            name="targetAudience"
            value={inputs.targetAudience}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
            placeholder="Describe your target audience (demographics, interests, needs, etc.)"
          ></textarea>
        </div>
        <div className="space-y-2 mt-4">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="monetizationGoals">Monetization Goals</label>
          <textarea 
            id="monetizationGoals"
            name="monetizationGoals"
            value={inputs.monetizationGoals}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
            placeholder="What are your goals for monetizing this content? (e.g., create a paid course, sell an ebook, membership content)"
          ></textarea>
        </div>
        <div className="space-y-2 mt-4">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="platformsToSell">Platforms to Sell On</label>
          <select
            id="platformsToSell"
            name="platformsToSell"
            value={inputs.platformsToSell}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
          >
            <option value="">Select platform</option>
            <option value="own-website">Your Own Website</option>
            <option value="amazon">Amazon</option>
            <option value="udemy">Udemy</option>
            <option value="teachable">Teachable</option>
            <option value="kajabi">Kajabi</option>
            <option value="gumroad">Gumroad</option>
            <option value="patreon">Patreon</option>
            <option value="substack">Substack</option>
            <option value="multiple">Multiple Platforms</option>
          </select>
        </div>
      </div>

      <div className="bg-blue-50 p-3 rounded-lg shadow-sm border border-blue-100 mb-6">
        <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center">
          Content Preferences
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-blue-900" htmlFor="contentFormat">Content Format</label>
            <select
              id="contentFormat"
              name="contentFormat"
              value={inputs.contentFormat}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
            >
              <option value="">Select format</option>
              <option value="ebook">E-book</option>
              <option value="course">Online Course</option>
              <option value="membership">Membership Content</option>
              <option value="newsletter">Paid Newsletter</option>
              <option value="guide">Guide/Manual</option>
              <option value="templates">Templates/Workbooks</option>
              <option value="audio">Audio Content</option>
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
              <option value="brief">Brief (under 10 pages)</option>
              <option value="short">Short (10-30 pages)</option>
              <option value="medium">Medium (30-100 pages)</option>
              <option value="comprehensive">Comprehensive (100+ pages)</option>
              <option value="series">Content Series</option>
            </select>
          </div>
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
            <option value="academic">Academic</option>
            <option value="motivational">Motivational</option>
            <option value="instructional">Instructional</option>
            <option value="entertaining">Entertaining</option>
            <option value="authoritative">Authoritative</option>
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
            placeholder="Any additional information that would help create better monetizable content from your transcript"
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
              Generating...
            </>
          ) : (
            <>
              <Wand2 size={18} className="mr-2" />
              Generate Content
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
            <FileText size={20} className="text-blue-500" /> Monetizable Content Strategy
          </h4>
          <div className="space-y-4">
            {results.product_title && (
              <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h5 className="font-semibold text-blue-700 mb-2">Product Title</h5>
                    <div className="text-gray-800 text-sm whitespace-pre-line">{results.product_title}</div>
                  </div>
                  <button
                    className={`px-3 py-1.5 text-xs rounded flex items-center gap-1 border border-blue-200 ${copiedItems.has('product_title') ? 'bg-green-100 text-green-700 border-green-300' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                    onClick={() => copyToClipboard(results.product_title, 'product_title')}
                  >
                    {copiedItems.has('product_title') ? <Check size={14} /> : <Copy size={14} />}
                    {copiedItems.has('product_title') ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
            {results.product_summary && (
              <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h5 className="font-semibold text-blue-700 mb-2">Product Summary</h5>
                    <div className="text-gray-800 text-sm whitespace-pre-line">{results.product_summary}</div>
                  </div>
                  <button
                    className={`px-3 py-1.5 text-xs rounded flex items-center gap-1 border border-blue-200 ${copiedItems.has('product_summary') ? 'bg-green-100 text-green-700 border-green-300' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                    onClick={() => copyToClipboard(results.product_summary, 'product_summary')}
                  >
                    {copiedItems.has('product_summary') ? <Check size={14} /> : <Copy size={14} />}
                    {copiedItems.has('product_summary') ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
            {results.key_sections && results.key_sections.length > 0 && (
              <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h5 className="font-semibold text-blue-700 mb-2">Key Sections</h5>
                    <div className="space-y-2">
                      {results.key_sections.map((section: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></span>
                          <span className="text-gray-800 text-sm">{section}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    className={`px-3 py-1.5 text-xs rounded flex items-center gap-1 border border-blue-200 ${copiedItems.has('key_sections') ? 'bg-green-100 text-green-700 border-green-300' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                    onClick={() => copyToClipboard(results.key_sections.join('\n'), 'key_sections')}
                  >
                    {copiedItems.has('key_sections') ? <Check size={14} /> : <Copy size={14} />}
                    {copiedItems.has('key_sections') ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
            {results.target_audience_section && (
              <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h5 className="font-semibold text-blue-700 mb-2">Target Audience</h5>
                    <div className="text-gray-800 text-sm whitespace-pre-line">{results.target_audience_section}</div>
                  </div>
                  <button
                    className={`px-3 py-1.5 text-xs rounded flex items-center gap-1 border border-blue-200 ${copiedItems.has('target_audience_section') ? 'bg-green-100 text-green-700 border-green-300' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                    onClick={() => copyToClipboard(results.target_audience_section, 'target_audience_section')}
                  >
                    {copiedItems.has('target_audience_section') ? <Check size={14} /> : <Copy size={14} />}
                    {copiedItems.has('target_audience_section') ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
            {results.value_proposition && (
              <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h5 className="font-semibold text-blue-700 mb-2">Value Proposition</h5>
                    <div className="text-gray-800 text-sm whitespace-pre-line">{results.value_proposition}</div>
                  </div>
                  <button
                    className={`px-3 py-1.5 text-xs rounded flex items-center gap-1 border border-blue-200 ${copiedItems.has('value_proposition') ? 'bg-green-100 text-green-700 border-green-300' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                    onClick={() => copyToClipboard(results.value_proposition, 'value_proposition')}
                  >
                    {copiedItems.has('value_proposition') ? <Check size={14} /> : <Copy size={14} />}
                    {copiedItems.has('value_proposition') ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
            {results.monetization_strategy && (
              <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h5 className="font-semibold text-blue-700 mb-2">Monetization Strategy</h5>
                    <div className="text-gray-800 text-sm whitespace-pre-line">{results.monetization_strategy}</div>
                  </div>
                  <button
                    className={`px-3 py-1.5 text-xs rounded flex items-center gap-1 border border-blue-200 ${copiedItems.has('monetization_strategy') ? 'bg-green-100 text-green-700 border-green-300' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                    onClick={() => copyToClipboard(results.monetization_strategy, 'monetization_strategy')}
                  >
                    {copiedItems.has('monetization_strategy') ? <Check size={14} /> : <Copy size={14} />}
                    {copiedItems.has('monetization_strategy') ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
            {results.platform_recommendations && (
              <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h5 className="font-semibold text-blue-700 mb-2">Platform Recommendations</h5>
                    <div className="text-gray-800 text-sm whitespace-pre-line">{results.platform_recommendations}</div>
                  </div>
                  <button
                    className={`px-3 py-1.5 text-xs rounded flex items-center gap-1 border border-blue-200 ${copiedItems.has('platform_recommendations') ? 'bg-green-100 text-green-700 border-green-300' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                    onClick={() => copyToClipboard(results.platform_recommendations, 'platform_recommendations')}
                  >
                    {copiedItems.has('platform_recommendations') ? <Check size={14} /> : <Copy size={14} />}
                    {copiedItems.has('platform_recommendations') ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
            {results.promotional_blurb && (
              <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h5 className="font-semibold text-blue-700 mb-2">Promotional Blurb</h5>
                    <div className="text-gray-800 text-sm whitespace-pre-line">{results.promotional_blurb}</div>
                  </div>
                  <button
                    className={`px-3 py-1.5 text-xs rounded flex items-center gap-1 border border-blue-200 ${copiedItems.has('promotional_blurb') ? 'bg-green-100 text-green-700 border-green-300' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                    onClick={() => copyToClipboard(results.promotional_blurb, 'promotional_blurb')}
                  >
                    {copiedItems.has('promotional_blurb') ? <Check size={14} /> : <Copy size={14} />}
                    {copiedItems.has('promotional_blurb') ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
            {results.additional_assets && (
              <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h5 className="font-semibold text-blue-700 mb-2">Additional Assets</h5>
                    <div className="text-gray-800 text-sm whitespace-pre-line">{results.additional_assets}</div>
                  </div>
                  <button
                    className={`px-3 py-1.5 text-xs rounded flex items-center gap-1 border border-blue-200 ${copiedItems.has('additional_assets') ? 'bg-green-100 text-green-700 border-green-300' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                    onClick={() => copyToClipboard(results.additional_assets, 'additional_assets')}
                  >
                    {copiedItems.has('additional_assets') ? <Check size={14} /> : <Copy size={14} />}
                    {copiedItems.has('additional_assets') ? 'Copied!' : 'Copy'}
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
            <i className="fas fa-book text-blue-600"></i>
          </div>
          <div>
            <h4 className="font-medium text-blue-900">E-book Creator</h4>
            <p className="text-xs text-blue-600">Convert transcript into formatted e-book ready for sale.</p>
          </div>
        </div>
        <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
      </div>
      
      <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
            <i className="fas fa-graduation-cap text-blue-600"></i>
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Course Creator</h4>
            <p className="text-xs text-blue-600">Transform transcript into structured online course modules.</p>
          </div>
        </div>
        <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
      </div>
      
      <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
            <i className="fas fa-newspaper text-blue-600"></i>
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Newsletter Series</h4>
            <p className="text-xs text-blue-600">Convert transcript into engaging newsletter series for subscribers.</p>
          </div>
        </div>
        <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
      </div>
      
      <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
            <i className="fas fa-file-alt text-blue-600"></i>
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Workbook Creator</h4>
            <p className="text-xs text-blue-600">Create actionable workbooks and templates from your transcript.</p>
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
            <h4 className="font-medium text-blue-900">Membership Content</h4>
            <p className="text-xs text-blue-600">Format transcript into exclusive membership site content.</p>
          </div>
        </div>
        <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
      </div>
    </div>
  );

  const renderHistoryTab = () => (
    <div className="py-4">
      <History toolName="Sell Your Content" />
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
              <i className="fas fa-dollar-sign text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Sell Your Content (Transcripts)</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Transform transcripts into valuable monetized content</p>
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