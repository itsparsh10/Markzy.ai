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

export default function SalesPage({ onBackClick }: { onBackClick: () => void }) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());
  
  const [inputs, setInputs] = useState({
    productType: '',
    salesPageType: '',
    productDescription: '',
    targetAudience: '',
    mainProblem: '',
    solutionBenefits: '',
    uniqueValue: '',
    socialProof: '',
    pricing: '',
    guarantee: '',
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
        product_service_type: inputs.productType,
        sales_page_style: inputs.salesPageType,
        product_service_description: inputs.productDescription,
        target_audience: inputs.targetAudience,
        main_problem_pain_point: inputs.mainProblem,
        solution_key_benefits: inputs.solutionBenefits,
        unique_value_proposition: inputs.uniqueValue,
        social_proof_testimonials: inputs.socialProof,
        pricing_offer_details: inputs.pricing,
        guarantee_risk_reversal: inputs.guarantee,
      };

      const response = await aiToolsService.generateSalesPage(requestData);
      setResults(response);
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Sales Page',
          toolId: 'sales-page',
          outputResult: response,
          prompt: JSON.stringify(requestData)
        });
        console.log('✅ Sales page saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
      console.log('Sales Page API Response:', response);
    } catch (err: any) {
      console.error('Error generating sales page:', err);
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
      <SectionCard title="Product & Sales Page Type" icon={Briefcase}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-blue-900" htmlFor="productType">Product/Service Type</label>
            <select
              id="productType"
              name="productType"
              value={inputs.productType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
            >
              <option value="">Select product type</option>
              <option value="digital-product">Digital Product</option>
              <option value="physical-product">Physical Product</option>
              <option value="service">Service/Consulting</option>
              <option value="course">Online Course</option>
              <option value="software">Software/SaaS</option>
              <option value="coaching">Coaching Program</option>
              <option value="membership">Membership/Subscription</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-blue-900" htmlFor="salesPageType">Sales Page Style</label>
            <select
              id="salesPageType"
              name="salesPageType"
              value={inputs.salesPageType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
            >
              <option value="">Select page style</option>
              <option value="long-form">Long-form Sales Page</option>
              <option value="short-form">Short-form Landing Page</option>
              <option value="video-sales">Video Sales Letter</option>
              <option value="webinar">Webinar Registration</option>
              <option value="product-demo">Product Demo Page</option>
              <option value="lead-magnet">Lead Magnet Opt-in</option>
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="productDescription">Product/Service Description</label>
          <textarea 
            id="productDescription"
            name="productDescription"
            value={inputs.productDescription}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
            placeholder="Describe what you're selling, its main features, and what makes it unique..."
          ></textarea>
        </div>
      </SectionCard>

      <SectionCard title="Target Audience & Problem" icon={Users}>
        <InputField
          label="Target Audience"
          id="targetAudience"
          value={inputs.targetAudience}
          onChange={handleInputChange}
          type="textarea"
          placeholder="Who is your ideal customer? (demographics, psychographics, current situation, goals)"
        />
        <InputField
          label="Main Problem/Pain Point"
          id="mainProblem"
          value={inputs.mainProblem}
          onChange={handleInputChange}
          type="textarea"
          placeholder="What specific problem does your product solve? What frustrations do customers face?"
        />
        <InputField
          label="Solution & Key Benefits"
          id="solutionBenefits"
          value={inputs.solutionBenefits}
          onChange={handleInputChange}
          type="textarea"
          placeholder="How does your product solve the problem? What are the main benefits and outcomes?"
        />
      </SectionCard>

      <SectionCard title="Value Proposition & Credibility" icon={ThumbsUp}>
        <p className="text-sm text-gray-600 mb-4">Define what makes your offer unique and build trust with potential customers.</p>
        <InputField
          label="Unique Value Proposition"
          id="uniqueValue"
          value={inputs.uniqueValue}
          onChange={handleInputChange}
          type="textarea"
          placeholder="What makes your product different from competitors? Why should customers choose you?"
          Icon={Target}
        />
        <InputField
          label="Social Proof & Testimonials"
          id="socialProof"
          value={inputs.socialProof}
          onChange={handleInputChange}
          type="textarea"
          placeholder="What testimonials, case studies, reviews, or credentials do you have? Include specific results if possible."
          Icon={MessageSquare}
        />
        <InputField
          label="Pricing & Offer Details"
          id="pricing"
          value={inputs.pricing}
          onChange={handleInputChange}
          type="textarea"
          placeholder="What's the price and payment options? Any bonuses, discounts, or special offers included?"
          Icon={ShoppingBag}
        />
        <InputField
          label="Guarantee/Risk Reversal"
          id="guarantee"
          value={inputs.guarantee}
          onChange={handleInputChange}
          type="textarea"
          placeholder="What guarantees or risk reversals do you offer? (money-back guarantee, free trial, etc.)"
          Icon={Lightbulb}
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
              Generate Sales Page
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
            <FileText size={20} className="text-blue-500" /> Sales Page Content
          </h4>
          <div className="space-y-4">
            {results.headline && (
              <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h5 className="font-semibold text-blue-700 mb-2">Headline</h5>
                    <div className="text-gray-800 text-sm whitespace-pre-line">{results.headline}</div>
                  </div>
                  <button
                    className={`px-3 py-1.5 text-xs rounded flex items-center gap-1 border border-blue-200 ${copiedItems.has('headline') ? 'bg-green-100 text-green-700 border-green-300' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                    onClick={() => copyToClipboard(results.headline, 'headline')}
                  >
                    {copiedItems.has('headline') ? <Check size={14} /> : <Copy size={14} />}
                    {copiedItems.has('headline') ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
            {results.subheadline && (
              <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h5 className="font-semibold text-blue-700 mb-2">Subheadline</h5>
                    <div className="text-gray-800 text-sm whitespace-pre-line">{results.subheadline}</div>
                  </div>
                  <button
                    className={`px-3 py-1.5 text-xs rounded flex items-center gap-1 border border-blue-200 ${copiedItems.has('subheadline') ? 'bg-green-100 text-green-700 border-green-300' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                    onClick={() => copyToClipboard(results.subheadline, 'subheadline')}
                  >
                    {copiedItems.has('subheadline') ? <Check size={14} /> : <Copy size={14} />}
                    {copiedItems.has('subheadline') ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
            {results.introduction && (
              <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h5 className="font-semibold text-blue-700 mb-2">Introduction</h5>
                    <div className="text-gray-800 text-sm whitespace-pre-line">{results.introduction}</div>
                  </div>
                  <button
                    className={`px-3 py-1.5 text-xs rounded flex items-center gap-1 border border-blue-200 ${copiedItems.has('introduction') ? 'bg-green-100 text-green-700 border-green-300' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                    onClick={() => copyToClipboard(results.introduction, 'introduction')}
                  >
                    {copiedItems.has('introduction') ? <Check size={14} /> : <Copy size={14} />}
                    {copiedItems.has('introduction') ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
            {results.problem_section && (
              <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h5 className="font-semibold text-blue-700 mb-2">Problem Section</h5>
                    <div className="text-gray-800 text-sm whitespace-pre-line">{results.problem_section}</div>
                  </div>
                  <button
                    className={`px-3 py-1.5 text-xs rounded flex items-center gap-1 border border-blue-200 ${copiedItems.has('problem_section') ? 'bg-green-100 text-green-700 border-green-300' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                    onClick={() => copyToClipboard(results.problem_section, 'problem_section')}
                  >
                    {copiedItems.has('problem_section') ? <Check size={14} /> : <Copy size={14} />}
                    {copiedItems.has('problem_section') ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
            {results.solution_section && (
              <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h5 className="font-semibold text-blue-700 mb-2">Solution Section</h5>
                    <div className="text-gray-800 text-sm whitespace-pre-line">{results.solution_section}</div>
                  </div>
                  <button
                    className={`px-3 py-1.5 text-xs rounded flex items-center gap-1 border border-blue-200 ${copiedItems.has('solution_section') ? 'bg-green-100 text-green-700 border-green-300' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                    onClick={() => copyToClipboard(results.solution_section, 'solution_section')}
                  >
                    {copiedItems.has('solution_section') ? <Check size={14} /> : <Copy size={14} />}
                    {copiedItems.has('solution_section') ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
            {results.value_proposition_section && (
              <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h5 className="font-semibold text-blue-700 mb-2">Value Proposition Section</h5>
                    <div className="text-gray-800 text-sm whitespace-pre-line">{results.value_proposition_section}</div>
                  </div>
                  <button
                    className={`px-3 py-1.5 text-xs rounded flex items-center gap-1 border border-blue-200 ${copiedItems.has('value_proposition_section') ? 'bg-green-100 text-green-700 border-green-300' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                    onClick={() => copyToClipboard(results.value_proposition_section, 'value_proposition_section')}
                  >
                    {copiedItems.has('value_proposition_section') ? <Check size={14} /> : <Copy size={14} />}
                    {copiedItems.has('value_proposition_section') ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
            {results.social_proof_section && (
              <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h5 className="font-semibold text-blue-700 mb-2">Social Proof Section</h5>
                    <div className="text-gray-800 text-sm whitespace-pre-line">{results.social_proof_section}</div>
                  </div>
                  <button
                    className={`px-3 py-1.5 text-xs rounded flex items-center gap-1 border border-blue-200 ${copiedItems.has('social_proof_section') ? 'bg-green-100 text-green-700 border-green-300' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                    onClick={() => copyToClipboard(results.social_proof_section, 'social_proof_section')}
                  >
                    {copiedItems.has('social_proof_section') ? <Check size={14} /> : <Copy size={14} />}
                    {copiedItems.has('social_proof_section') ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
            {results.offer_section && (
              <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h5 className="font-semibold text-blue-700 mb-2">Offer Section</h5>
                    <div className="text-gray-800 text-sm whitespace-pre-line">{results.offer_section}</div>
                  </div>
                  <button
                    className={`px-3 py-1.5 text-xs rounded flex items-center gap-1 border border-blue-200 ${copiedItems.has('offer_section') ? 'bg-green-100 text-green-700 border-green-300' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                    onClick={() => copyToClipboard(results.offer_section, 'offer_section')}
                  >
                    {copiedItems.has('offer_section') ? <Check size={14} /> : <Copy size={14} />}
                    {copiedItems.has('offer_section') ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
            {results.guarantee_section && (
              <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h5 className="font-semibold text-blue-700 mb-2">Guarantee Section</h5>
                    <div className="text-gray-800 text-sm whitespace-pre-line">{results.guarantee_section}</div>
                  </div>
                  <button
                    className={`px-3 py-1.5 text-xs rounded flex items-center gap-1 border border-blue-200 ${copiedItems.has('guarantee_section') ? 'bg-green-100 text-green-700 border-green-300' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                    onClick={() => copyToClipboard(results.guarantee_section, 'guarantee_section')}
                  >
                    {copiedItems.has('guarantee_section') ? <Check size={14} /> : <Copy size={14} />}
                    {copiedItems.has('guarantee_section') ? 'Copied!' : 'Copy'}
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

  const renderTemplatesTab = () => {
    return (
      <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-file-invoice-dollar text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Long-form Sales Page</h4>
              <p className="text-xs text-blue-600">Template for comprehensive sales pages with detailed problem-solution flow.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-bolt text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Short-form Landing Page</h4>
              <p className="text-xs text-blue-600">Template for concise, high-converting landing pages focused on action.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-video text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Video Sales Letter</h4>
              <p className="text-xs text-blue-600">Template for video-based sales pages with supporting copy and elements.</p>
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
              <h4 className="font-medium text-blue-900">Webinar Registration</h4>
              <p className="text-xs text-blue-600">Template for webinar sign-up pages that maximize registrations.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-hand-sparkles text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Lead Magnet Opt-in</h4>
              <p className="text-xs text-blue-600">Template for lead generation pages that capture email addresses effectively.</p>
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
              <h4 className="font-medium text-blue-900">Product Demo Page</h4>
              <p className="text-xs text-blue-600">Template for software/SaaS demo pages that convert trials to sales.</p>
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
        <History toolName="Sales Page" />
      </div>
    );
  };

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-file-invoice-dollar text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Sales Page</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Generate high-converting sales pages that drive results</p>
            </div>
            <div className="flex items-center gap-3 z-10">
              <span className="text-xs bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/30 flex items-center font-semibold text-white/90">
                <i className="fas fa-clock mr-1"></i> 7 min
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
