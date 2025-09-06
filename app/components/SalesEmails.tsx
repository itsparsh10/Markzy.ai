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

export default function SalesEmails({ onBackClick }: { onBackClick: () => void }) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());
  
  const [inputs, setInputs] = useState({
    productService: '',
    campaignType: '',
    productDescription: '',
    targetAudience: '',
    mainBenefits: '',
    painPoints: '',
    sequenceLength: '',
    emailTypes: '',
    callToAction: '',
    promotionDetails: '',
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
        product_service_type: inputs.productService,
        campaign_type: inputs.campaignType,
        product_service_description: inputs.productDescription,
        target_audience: inputs.targetAudience,
        main_benefits_value_proposition: inputs.mainBenefits,
        customer_pain_points_challenges: inputs.painPoints,
        sequence_length: inputs.sequenceLength || '5',
        email_types_to_include: inputs.emailTypes,
        call_to_action: inputs.callToAction,
        promotion_offer_details: inputs.promotionDetails,
      };

      const response = await aiToolsService.generateSalesEmails(requestData);
      setResults(response);
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Sales Emails',
          toolId: 'sales-emails',
          outputResult: response,
          prompt: JSON.stringify(requestData)
        });
        console.log('✅ Sales emails saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
      console.log('Sales Emails API Response:', response);
      console.log('Sequence length requested:', requestData.sequence_length);
      console.log('Number of emails returned:', response.sequence?.length || 0);
    } catch (err: any) {
      console.error('Error generating sales emails:', err);
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
      <SectionCard title="Product & Campaign Information" icon={Briefcase}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-blue-900" htmlFor="productService">Product/Service</label>
            <select
              id="productService"
              name="productService"
              value={inputs.productService}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
            >
              <option value="">Select product/service type</option>
              <option value="digital-product">Digital Product</option>
              <option value="physical-product">Physical Product</option>
              <option value="service">Service</option>
              <option value="course">Course/Training</option>
              <option value="software">Software/SaaS</option>
              <option value="coaching">Coaching/Consulting</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-blue-900" htmlFor="campaignType">Campaign Type</label>
            <select
              id="campaignType"
              name="campaignType"
              value={inputs.campaignType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
            >
              <option value="">Select campaign type</option>
              <option value="product-launch">Product Launch</option>
              <option value="promotion">Limited Time Promotion</option>
              <option value="evergreen">Evergreen Sales</option>
              <option value="re-engagement">Re-engagement</option>
              <option value="upsell">Upsell/Cross-sell</option>
              <option value="webinar">Webinar Promotion</option>
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

      <SectionCard title="Audience & Messaging" icon={Users}>
        <InputField
          label="Target Audience"
          id="targetAudience"
          value={inputs.targetAudience}
          onChange={handleInputChange}
          type="textarea"
          placeholder="Who is your ideal customer? (demographics, interests, profession, current situation)"
        />
        <InputField
          label="Main Benefits & Value Proposition"
          id="mainBenefits"
          value={inputs.mainBenefits}
          onChange={handleInputChange}
          type="textarea"
          placeholder="What are the key benefits and outcomes customers will get from your product/service?"
        />
        <InputField
          label="Customer Pain Points & Challenges"
          id="painPoints"
          value={inputs.painPoints}
          onChange={handleInputChange}
          type="textarea"
          placeholder="What problems or frustrations does your product solve for customers?"
        />
      </SectionCard>

      <SectionCard title="Email Sequence Strategy" icon={MessageSquare}>
        <p className="text-sm text-gray-600 mb-4">Configure your sales email sequence structure and messaging approach.</p>
        <InputField
          label="Sequence Length"
          id="sequenceLength"
          value={inputs.sequenceLength}
          onChange={handleInputChange}
          type="select"
          options={['3 emails', '5 emails', '7 emails', '10 emails', 'Custom length']}
          placeholder="How many emails in the sequence?"
          Icon={FileText}
        />
        <InputField
          label="Email Types to Include"
          id="emailTypes"
          value={inputs.emailTypes}
          onChange={handleInputChange}
          type="textarea"
          placeholder="What types of emails do you want? (e.g., announcement, benefits-focused, social proof, urgency, objection handling)"
          Icon={Lightbulb}
        />
        <InputField
          label="Call to Action"
          id="callToAction"
          value={inputs.callToAction}
          onChange={handleInputChange}
          type="textarea"
          placeholder="What specific action do you want readers to take? (buy now, sign up, book a call, etc.)"
          Icon={Target}
        />
        <InputField
          label="Promotion/Offer Details"
          id="promotionDetails"
          value={inputs.promotionDetails}
          onChange={handleInputChange}
          type="textarea"
          placeholder="Any special offers, discounts, bonuses, or limited-time elements? Include pricing if relevant."
          Icon={ThumbsUp}
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
              Generate Sales Emails
            </>
          )}
        </button>
      </div>
      {error && (
        <div className="mt-4 text-red-600 bg-red-50 border border-red-200 rounded p-3 text-sm">{error}</div>
      )}
      {results && (
        <div className="mt-8 space-y-6">
          {results.summary && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-base font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <FileText size={18} className="text-blue-500" /> Sequence Summary
              </h4>
              <div className="text-gray-900 text-sm whitespace-pre-line">{results.summary}</div>
            </div>
          )}
          {results.sequence && results.sequence.length > 0 && (
            <div>
              <h4 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
                <MessageSquare size={20} className="text-blue-500" /> Email Sequence
              </h4>
              <div className="space-y-4">
                {results.sequence.map((email: any, idx: number) => (
                  <div key={idx} className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">Email {idx + 1}</span>
                          <h5 className="font-semibold text-blue-700">{email.subject}</h5>
                        </div>
                        <div className="text-gray-800 text-sm whitespace-pre-line">{email.body}</div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          className={`px-3 py-1.5 text-xs rounded flex items-center gap-1 border border-blue-200 ${copiedItems.has(`subject-${idx}`) ? 'bg-green-100 text-green-700 border-green-300' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                          onClick={() => copyToClipboard(email.subject, `subject-${idx}`)}
                        >
                          {copiedItems.has(`subject-${idx}`) ? <Check size={14} /> : <Copy size={14} />}
                          {copiedItems.has(`subject-${idx}`) ? 'Copied!' : 'Copy Subject'}
                        </button>
                        <button
                          className={`px-3 py-1.5 text-xs rounded flex items-center gap-1 border border-blue-200 ${copiedItems.has(`body-${idx}`) ? 'bg-green-100 text-green-700 border-green-300' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                          onClick={() => copyToClipboard(email.body, `body-${idx}`)}
                        >
                          {copiedItems.has(`body-${idx}`) ? <Check size={14} /> : <Copy size={14} />}
                          {copiedItems.has(`body-${idx}`) ? 'Copied!' : 'Copy Body'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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
              <i className="fas fa-rocket text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Product Launch Sequence</h4>
              <p className="text-xs text-blue-600">Template for announcing and selling a new product or service launch.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-percent text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Limited Time Promotion</h4>
              <p className="text-xs text-blue-600">Template for time-sensitive sales and promotional campaigns.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-sync-alt text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Evergreen Sales Sequence</h4>
              <p className="text-xs text-blue-600">Template for ongoing sales campaigns without time constraints.</p>
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
              <h4 className="font-medium text-blue-900">Upsell/Cross-sell Sequence</h4>
              <p className="text-xs text-blue-600">Template for selling additional products to existing customers.</p>
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
              <h4 className="font-medium text-blue-900">Webinar Sales Sequence</h4>
              <p className="text-xs text-blue-600">Template for promoting and selling through webinar presentations.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-redo text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Re-engagement Campaign</h4>
              <p className="text-xs text-blue-600">Template for winning back inactive subscribers and past customers.</p>
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
        <History toolName="Sales Emails" />
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
              <i className="fas fa-envelope text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Sales Emails</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create compelling sales email sequences that convert</p>
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
