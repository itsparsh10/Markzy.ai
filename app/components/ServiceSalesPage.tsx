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

interface ServiceSalesPageResults {
  headline: string;
  subheadline: string;
  introduction: string;
  service_overview: string;
  client_profile_section: string;
  delivery_and_pricing_section: string;
  outcomes_section: string;
  process_section: string;
  competitive_advantage_section: string;
  testimonials_section: string;
  call_to_action: string;
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

export default function ServiceSalesPage({ onBackClick }: { onBackClick: () => void }) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [inputs, setInputs] = useState({
    serviceType: '',
    serviceName: '',
    serviceDescription: '',
    targetClient: '',
    serviceDelivery: '',
    pricingModel: '',
    serviceOutcomes: '',
    competitiveAdvantage: '',
    clientTestimonials: '',
    serviceProcess: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<ServiceSalesPageResults | null>(null);
  const [copiedSections, setCopiedSections] = useState<{[key: string]: boolean}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError('');
    setResults(null);

    try {
      const data = {
        service_type: inputs.serviceType,
        service_name: inputs.serviceName,
        service_description: inputs.serviceDescription,
        target_client_profile: inputs.targetClient,
        service_delivery_method: inputs.serviceDelivery,
        pricing_model: inputs.pricingModel,
        service_outcomes_results: inputs.serviceOutcomes,
        service_process: inputs.serviceProcess,
        competitive_advantage: inputs.competitiveAdvantage,
        client_testimonials: inputs.clientTestimonials,
      };

      const response = await aiToolsService.generateServiceSalesPage(data);
      setResults(response);
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Service Sales Page',
          toolId: 'service-sales-page',
          outputResult: response,
          prompt: JSON.stringify(data)
        });
        console.log('✅ Service sales page saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
    } catch (err: any) {
      console.error('Error generating service sales page:', err);
      setError(err.response?.data?.message || err.message || 'Failed to generate service sales page');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSections(prev => ({ ...prev, [section]: true }));
      setTimeout(() => {
        setCopiedSections(prev => ({ ...prev, [section]: false }));
      }, 2000);
    } catch (err: any) {
      console.error('Failed to copy text:', err);
    }
  };

  const renderGenerateTab = () => (
    <div className="space-y-6">
      <SectionCard title="Service Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-blue-900" htmlFor="serviceType">Service Type</label>
            <select
              id="serviceType"
              name="serviceType"
              value={inputs.serviceType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
            >
              <option value="">Select service type</option>
              <option value="consulting">Consulting</option>
              <option value="coaching">Coaching</option>
              <option value="design">Design Services</option>
              <option value="marketing">Marketing Services</option>
              <option value="development">Development Services</option>
              <option value="legal">Legal Services</option>
              <option value="financial">Financial Services</option>
              <option value="other">Other Professional Service</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-blue-900" htmlFor="serviceName">Service Name</label>
            <input
              type="text"
              id="serviceName"
              name="serviceName"
              value={inputs.serviceName}
              onChange={handleInputChange}
              placeholder="Enter your service name or package title"
              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="serviceDescription">Service Description</label>
          <textarea 
            id="serviceDescription"
            name="serviceDescription"
            value={inputs.serviceDescription}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
            placeholder="Describe what your service includes, key features, and main benefits..."
          ></textarea>
        </div>
      </SectionCard>

      <SectionCard title="Target Client & Delivery">
        <InputField
          label="Target Client Profile"
          id="targetClient"
          value={inputs.targetClient}
          onChange={handleInputChange}
          type="textarea"
          placeholder="Describe your ideal client (industry, size, challenges, demographics)"
        />
        <InputField
          label="Service Delivery Method"
          id="serviceDelivery"
          value={inputs.serviceDelivery}
          onChange={handleInputChange}
          type="select"
          options={['In-person', 'Virtual/Online', 'Hybrid', 'On-site at client location', 'Self-paced program']}
          placeholder="How is the service delivered?"
        />
        <InputField
          label="Pricing Model"
          id="pricingModel"
          value={inputs.pricingModel}
          onChange={handleInputChange}
          type="select"
          options={['One-time fee', 'Hourly rate', 'Monthly retainer', 'Project-based', 'Performance-based', 'Package pricing']}
          placeholder="Select your pricing structure"
        />
      </SectionCard>

      <SectionCard title="Service Value & Process">
        <p className="text-sm text-gray-600 mb-4">Help potential clients understand the value and process of working with you.</p>
        <InputField
          label="Service Outcomes & Results"
          id="serviceOutcomes"
          value={inputs.serviceOutcomes}
          onChange={handleInputChange}
          type="textarea"
          placeholder="What specific results or outcomes do clients achieve? Include measurable benefits when possible."
        />
        <InputField
          label="Service Process"
          id="serviceProcess"
          value={inputs.serviceProcess}
          onChange={handleInputChange}
          type="textarea"
          placeholder="Briefly outline your service process or methodology (e.g., discovery, strategy, implementation, review)"
        />
        <InputField
          label="Competitive Advantage"
          id="competitiveAdvantage"
          value={inputs.competitiveAdvantage}
          onChange={handleInputChange}
          type="textarea"
          placeholder="What makes your service unique? Why should clients choose you over competitors?"
        />
        <InputField
          label="Client Testimonials (Optional)"
          id="clientTestimonials"
          value={inputs.clientTestimonials}
          onChange={handleInputChange}
          type="textarea"
          placeholder="Share key client testimonials or success stories that highlight your service value"
        />
      </SectionCard>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center text-sm"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Generating...
            </>
          ) : (
            <>
              <Wand2 size={18} className="mr-2" />
              Generate Service Sales Page
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderTemplatesTab = () => {
    return (
      <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-handshake text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Consulting Services</h4>
              <p className="text-xs text-blue-600">Template for consulting and advisory service sales pages.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-user-tie text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Coaching Services</h4>
              <p className="text-xs text-blue-600">Template for personal and business coaching service pages.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-paint-brush text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Design Services</h4>
              <p className="text-xs text-blue-600">Template for creative and design service sales pages.</p>
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
              <h4 className="font-medium text-blue-900">Marketing Services</h4>
              <p className="text-xs text-blue-600">Template for marketing and advertising service sales pages.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-code text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Development Services</h4>
              <p className="text-xs text-blue-600">Template for web development and technical service pages.</p>
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
        <History toolName="Service Sales Page" />
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
              <i className="fas fa-concierge-bell text-blue-100 text-3xl"></i>
        </div>
        <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Service Sales Page</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create a dedicated landing page for your services or packages</p>
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
                  
                  {/* Error Display */}
                  {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center">
                        <X className="w-5 h-5 text-red-500 mr-2" />
                        <p className="text-red-700 text-sm">{error}</p>
                      </div>
                    </div>
                  )}

                  {/* Results Display */}
                  {results && (
                    <div className="mt-6 space-y-4">
                      <h3 className="text-lg font-semibold text-blue-900 mb-4">Generated Service Sales Page</h3>
                      
                      <div className="space-y-4">
                        {/* Headline */}
                        <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-blue-900">Headline</h4>
                            <button
                              onClick={() => copyToClipboard(results.headline, 'headline')}
                              className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                            >
                              {copiedSections.headline ? (
                                <Check className="w-4 h-4 mr-1" />
                              ) : (
                                <Copy className="w-4 h-4 mr-1" />
                              )}
                              {copiedSections.headline ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                          <p className="text-gray-700">{results.headline}</p>
                        </div>

                        {/* Subheadline */}
                        <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-blue-900">Subheadline</h4>
                            <button
                              onClick={() => copyToClipboard(results.subheadline, 'subheadline')}
                              className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                            >
                              {copiedSections.subheadline ? (
                                <Check className="w-4 h-4 mr-1" />
                              ) : (
                                <Copy className="w-4 h-4 mr-1" />
                              )}
                              {copiedSections.subheadline ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                          <p className="text-gray-700">{results.subheadline}</p>
                        </div>

                        {/* Introduction */}
                        <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-blue-900">Introduction</h4>
                            <button
                              onClick={() => copyToClipboard(results.introduction, 'introduction')}
                              className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                            >
                              {copiedSections.introduction ? (
                                <Check className="w-4 h-4 mr-1" />
                              ) : (
                                <Copy className="w-4 h-4 mr-1" />
                              )}
                              {copiedSections.introduction ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                          <p className="text-gray-700">{results.introduction}</p>
                        </div>

                        {/* Service Overview */}
                        <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-blue-900">Service Overview</h4>
                            <button
                              onClick={() => copyToClipboard(results.service_overview, 'service_overview')}
                              className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                            >
                              {copiedSections.service_overview ? (
                                <Check className="w-4 h-4 mr-1" />
                              ) : (
                                <Copy className="w-4 h-4 mr-1" />
                              )}
                              {copiedSections.service_overview ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                          <p className="text-gray-700">{results.service_overview}</p>
                        </div>

                        {/* Client Profile Section */}
                        <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-blue-900">Client Profile Section</h4>
                            <button
                              onClick={() => copyToClipboard(results.client_profile_section, 'client_profile_section')}
                              className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                            >
                              {copiedSections.client_profile_section ? (
                                <Check className="w-4 h-4 mr-1" />
                              ) : (
                                <Copy className="w-4 h-4 mr-1" />
                              )}
                              {copiedSections.client_profile_section ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                          <p className="text-gray-700">{results.client_profile_section}</p>
                        </div>

                        {/* Delivery & Pricing Section */}
                        <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-blue-900">Delivery & Pricing Section</h4>
                            <button
                              onClick={() => copyToClipboard(results.delivery_and_pricing_section, 'delivery_and_pricing_section')}
                              className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                            >
                              {copiedSections.delivery_and_pricing_section ? (
                                <Check className="w-4 h-4 mr-1" />
                              ) : (
                                <Copy className="w-4 h-4 mr-1" />
                              )}
                              {copiedSections.delivery_and_pricing_section ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                          <p className="text-gray-700">{results.delivery_and_pricing_section}</p>
                        </div>

                        {/* Outcomes Section */}
                        <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-blue-900">Outcomes Section</h4>
                            <button
                              onClick={() => copyToClipboard(results.outcomes_section, 'outcomes_section')}
                              className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                            >
                              {copiedSections.outcomes_section ? (
                                <Check className="w-4 h-4 mr-1" />
                              ) : (
                                <Copy className="w-4 h-4 mr-1" />
                              )}
                              {copiedSections.outcomes_section ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                          <p className="text-gray-700">{results.outcomes_section}</p>
                        </div>

                        {/* Process Section */}
                        <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-blue-900">Process Section</h4>
                            <button
                              onClick={() => copyToClipboard(results.process_section, 'process_section')}
                              className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                            >
                              {copiedSections.process_section ? (
                                <Check className="w-4 h-4 mr-1" />
                              ) : (
                                <Copy className="w-4 h-4 mr-1" />
                              )}
                              {copiedSections.process_section ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                          <p className="text-gray-700">{results.process_section}</p>
                        </div>

                        {/* Competitive Advantage Section */}
                        <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-blue-900">Competitive Advantage Section</h4>
                            <button
                              onClick={() => copyToClipboard(results.competitive_advantage_section, 'competitive_advantage_section')}
                              className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                            >
                              {copiedSections.competitive_advantage_section ? (
                                <Check className="w-4 h-4 mr-1" />
                              ) : (
                                <Copy className="w-4 h-4 mr-1" />
                              )}
                              {copiedSections.competitive_advantage_section ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                          <p className="text-gray-700">{results.competitive_advantage_section}</p>
                        </div>

                        {/* Testimonials Section */}
                        <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-blue-900">Testimonials Section</h4>
                            <button
                              onClick={() => copyToClipboard(results.testimonials_section, 'testimonials_section')}
                              className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                            >
                              {copiedSections.testimonials_section ? (
                                <Check className="w-4 h-4 mr-1" />
                              ) : (
                                <Copy className="w-4 h-4 mr-1" />
                              )}
                              {copiedSections.testimonials_section ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                          <p className="text-gray-700">{results.testimonials_section}</p>
                        </div>

                        {/* Call to Action */}
                        <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-blue-900">Call to Action</h4>
                            <button
                              onClick={() => copyToClipboard(results.call_to_action, 'call_to_action')}
                              className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                            >
                              {copiedSections.call_to_action ? (
                                <Check className="w-4 h-4 mr-1" />
                              ) : (
                                <Copy className="w-4 h-4 mr-1" />
                              )}
                              {copiedSections.call_to_action ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                          <p className="text-gray-700">{results.call_to_action}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'templates' && renderTemplatesTab()}
              {activeTab === 'history' && (
                <div className="py-4">
                  <History toolName="Service Sales Page" />
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
                <button className="px-5 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg">
                  <span>Generate Page</span>
                  <i className="fas fa-arrow-right text-xs group-hover:translate-x-0.5 transition-transform"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
