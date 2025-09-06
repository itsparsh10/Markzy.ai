'use client'

import { useState } from 'react';
import { ArrowLeft, Briefcase, Users as UsersIcon, BarChart3, DollarSign, ShoppingCart, Heart, FileText, History as HistoryIcon, Clock, X, Save, Wand2 } from 'lucide-react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

// Helper Components (Copied from CustomerJourney.tsx for now)
interface InputFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  type?: 'text' | 'textarea' | 'select' | 'number';
  options?: string[];
  placeholder?: string;
  Icon?: React.ElementType;
  rows?: number; // Added rows prop
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

export default function CustomerOverview({ onBackClick }: { onBackClick: () => void }) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const [inputs, setInputs] = useState({
    industry: '',
    businessSize: '',
    primaryProductServiceCategory: '',
    keyCustomerSegments: '',
    totalCustomers: '',
    avgCltv: '',
    primarySalesChannels: '',
    keyEngagementChannels: '',
    avgCac: '',
    feedbackSources: '',
    satisfactionScore: '',
    commonPraisesComplaints: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateOverview = async () => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      // Validate required fields
      const requiredFields = [
        'industry', 'businessSize', 'primaryProductServiceCategory'
      ];
      
      const missingFields = requiredFields.filter(field => !inputs[field as keyof typeof inputs]);
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      const requestData = {
        industry: inputs.industry,
        business_size: inputs.businessSize,
        primary_product_service_category: inputs.primaryProductServiceCategory
      };

      const response = await aiToolsService.generateCustomerOverview(requestData);
      setResults(response);
      
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Customer Overview',
          toolId: 'customer-overview',
          outputResult: response,
          prompt: JSON.stringify(requestData)
        });
        console.log('✅ Customer overview saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
    } catch (err: any) {
      console.error('Error generating customer overview:', err);
      setError(err.message || 'Failed to generate customer overview. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exportResults = () => {
    if (!results) return;
    
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'customer-overview.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderGenerateTab = () => (
    <div className="space-y-6">
      <SectionCard title="Business Context" icon={Briefcase}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Industry"
            id="industry"
            value={inputs.industry}
            onChange={handleInputChange}
            type="select"
            options={['Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'E-commerce', 'Manufacturing', 'Services', 'Other']}
            placeholder="Select your industry"
          />
          <InputField
            label="Business Size"
            id="businessSize"
            value={inputs.businessSize}
            onChange={handleInputChange}
            type="select"
            options={['Startup (1-10 employees)', 'Small (11-50 employees)', 'Medium (51-200 employees)', 'Large (201+ employees)']}
            placeholder="Select business size"
          />
        </div>
        <InputField
          label="Primary Product/Service Category"
          id="primaryProductServiceCategory"
          value={inputs.primaryProductServiceCategory}
          onChange={handleInputChange}
          type="text"
          placeholder="e.g., Enterprise Software, Fashion Apparel, Financial Consulting"
        />
      </SectionCard>

      <SectionCard title="Customer Data Points" icon={UsersIcon}>
        <InputField
          label="Key Customer Segments"
          id="keyCustomerSegments"
          value={inputs.keyCustomerSegments}
          onChange={handleInputChange}
          type="textarea"
          placeholder="Describe your main customer groups (e.g., Young Professionals, Small Business Owners)"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Total Number of Customers (Approx.)"
            id="totalCustomers"
            value={inputs.totalCustomers}
            onChange={handleInputChange}
            type="number"
            placeholder="e.g., 1500"
          />
          <InputField
            label="Average Customer Lifetime Value (CLTV)"
            id="avgCltv"
            value={inputs.avgCltv}
            onChange={handleInputChange}
            type="text"
            placeholder="e.g., $500 or High/Medium/Low"
            Icon={DollarSign}
          />
        </div>
      </SectionCard>

      <SectionCard title="Sales & Engagement Metrics" icon={BarChart3}>
         <InputField
          label="Primary Sales Channels"
          id="primarySalesChannels"
          value={inputs.primarySalesChannels}
          onChange={handleInputChange}
          type="textarea"
          placeholder="e.g., Online Store, Direct Sales Team, Retail Partners, Marketplaces"
          Icon={ShoppingCart}
        />
        <InputField
          label="Key Customer Engagement Channels"
          id="keyEngagementChannels"
          value={inputs.keyEngagementChannels}
          onChange={handleInputChange}
          type="textarea"
          placeholder="e.g., Email Marketing, Social Media, In-App Messaging, Community Forum"
        />
        <InputField
          label="Average Customer Acquisition Cost (CAC)"
          id="avgCac"
          value={inputs.avgCac}
          onChange={handleInputChange}
          type="text"
          placeholder="e.g., $50 or High/Medium/Low"
        />
      </SectionCard>

      <SectionCard title="Customer Feedback & Sentiment" icon={Heart}>
        <InputField
          label="Primary Sources of Customer Feedback"
          id="feedbackSources"
          value={inputs.feedbackSources}
          onChange={handleInputChange}
          type="textarea"
          placeholder="e.g., Surveys, Online Reviews, Support Tickets, Social Media Comments"
        />
        <InputField
          label="Overall Customer Satisfaction Score (e.g., CSAT, NPS)"
          id="satisfactionScore"
          value={inputs.satisfactionScore}
          onChange={handleInputChange}
          type="text"
          placeholder="e.g., 85% CSAT, NPS 50, 4.5/5 Stars"
        />
        <InputField
          label="Common Praises or Complaints"
          id="commonPraisesComplaints"
          value={inputs.commonPraisesComplaints}
          onChange={handleInputChange}
          type="textarea"
          placeholder="Summarize key positive feedback and areas for improvement"
        />
      </SectionCard>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center text-sm"
        >
          <Wand2 size={18} className="mr-2" />
          Generate Overview
        </button>
      </div>
    </div>
  );

  const renderTemplatesTab = () => (
    <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
      <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
            <i className="fas fa-users text-blue-600"></i>
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Demographics Overview</h4>
            <p className="text-xs text-blue-600">Template for summarizing key demographic data of your customer base.</p>
          </div>
        </div>
        <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
      </div>
      <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
            <i className="fas fa-chart-bar text-blue-600"></i>
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Engagement Metrics</h4>
            <p className="text-xs text-blue-600">Template for outlining customer engagement and interaction metrics.</p>
          </div>
        </div>
        <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
      </div>
      <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
            <i className="fas fa-heart text-blue-600"></i>
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Feedback & Sentiment</h4>
            <p className="text-xs text-blue-600">Template for capturing customer feedback, satisfaction, and sentiment analysis.</p>
          </div>
        </div>
        <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
      </div>
      <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
            <i className="fas fa-layer-group text-blue-600"></i>
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Customer Segments</h4>
            <p className="text-xs text-blue-600">Template for breaking down your customer base into actionable segments.</p>
          </div>
        </div>
        <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
      </div>
    </div>
  );

  const renderHistoryTab = () => (
    <div className="p-6 text-center">
      {HistoryIcon && <HistoryIcon size={48} className="mx-auto text-gray-400 mb-4" />}
      <h3 className="text-xl font-semibold text-gray-700">History</h3>
      <p className="text-gray-500">View your previously generated customer overviews.</p>
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
              <i className="fas fa-users text-blue-100 text-3xl"></i>
        </div>
        <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Customer Overview</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Get a comprehensive view of your customer base</p>
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
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Business Information</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="industry">Industry</label>
                          <select
                            id="industry"
                            name="industry"
                            value={inputs.industry}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select your industry</option>
                            <option value="technology">Technology</option>
                            <option value="healthcare">Healthcare</option>
                            <option value="finance">Finance</option>
                            <option value="education">Education</option>
                            <option value="retail">Retail</option>
                            <option value="manufacturing">Manufacturing</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="businessSize">Business Size</label>
                          <select
                            id="businessSize"
                            name="businessSize"
                            value={inputs.businessSize}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select business size</option>
                            <option value="startup">Startup (1-10)</option>
                            <option value="small">Small (11-50)</option>
                            <option value="medium">Medium (51-200)</option>
                            <option value="large">Large (201-1000)</option>
                            <option value="enterprise">Enterprise (1000+)</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="primaryProductServiceCategory">Primary Product/Service Category</label>
                        <input
                          id="primaryProductServiceCategory"
                          name="primaryProductServiceCategory"
                          value={inputs.primaryProductServiceCategory}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          placeholder="e.g., SaaS, E-commerce, Consulting"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Rest of the sections with similar styling */}
                </div>
              )}
              {activeTab === 'templates' && (
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
                        <i className="fas fa-users text-blue-600"></i>
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-900">Demographics Overview</h4>
                        <p className="text-xs text-blue-600">Template for summarizing key demographic data of your customer base.</p>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
                  </div>
                  <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
                        <i className="fas fa-chart-bar text-blue-600"></i>
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-900">Engagement Metrics</h4>
                        <p className="text-xs text-blue-600">Template for outlining customer engagement and interaction metrics.</p>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
                  </div>
                  <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
                        <i className="fas fa-heart text-blue-600"></i>
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-900">Feedback & Sentiment</h4>
                        <p className="text-xs text-blue-600">Template for capturing customer feedback, satisfaction, and sentiment analysis.</p>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
                  </div>
                  <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
                        <i className="fas fa-layer-group text-blue-600"></i>
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-900">Customer Segments</h4>
                        <p className="text-xs text-blue-600">Template for breaking down your customer base into actionable segments.</p>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
                  </div>
                </div>
              )}
              {activeTab === 'history' && (
                <div className="py-4">
                  <History toolName="Customer Overview" />
                </div>
              )}
            </div>
            
            {/* Results Display */}
            {error && (
              <div className="mx-4 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700">
                  <i className="fas fa-exclamation-circle text-sm"></i>
                  <span className="text-sm font-medium">Error</span>
                </div>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            )}

            {results && (
              <div className="mx-4 mb-4">
                <div className="bg-white rounded-xl border border-blue-200 shadow-lg overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                          <i className="fas fa-users text-white text-lg"></i>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">Customer Overview</h3>
                          <p className="text-blue-100 text-sm">Comprehensive customer base analysis</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={exportResults}
                          className="px-3 py-1.5 text-xs text-white bg-white/20 hover:bg-white/30 rounded-lg transition-all flex items-center gap-1 backdrop-blur-sm"
                        >
                          <i className="fas fa-download text-xs"></i>
                          Export
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-6">
                    {results.summary && (
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-2 mb-2">
                          <i className="fas fa-chart-line text-blue-600 text-sm"></i>
                          <h4 className="text-sm font-semibold text-blue-900">Overview Summary</h4>
                        </div>
                        <p className="text-sm text-blue-800 leading-relaxed">{results.summary}</p>
                      </div>
                    )}

                    {results.segments && Array.isArray(results.segments) && results.segments.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                          <i className="fas fa-layer-group text-blue-600 text-sm"></i>
                          <h4 className="text-base font-semibold text-gray-900">Customer Segments</h4>
                        </div>
                        
                        {results.segments.map((segment: any, index: number) => (
                          segment && (
                            <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                              <div className="p-5">
                                {/* Segment Header */}
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                      <span className="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full border border-blue-200">
                                        {segment.segment_name}
                                      </span>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => copyToClipboard(segment.description)}
                                    className="px-3 py-1.5 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all flex items-center gap-1 border border-blue-200"
                                  >
                                    <i className="fas fa-copy text-xs"></i>
                                    Copy
                                  </button>
                                </div>
                                
                                {/* Segment Content */}
                                <div className="space-y-4">
                                  <div className="bg-white rounded-lg border border-gray-100 p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                      <i className="fas fa-file-alt text-gray-500 text-sm"></i>
                                      <h5 className="text-sm font-semibold text-gray-900">Description</h5>
                                    </div>
                                    <p className="text-sm text-gray-700 leading-relaxed">{segment.description}</p>
                                  </div>
                                  
                                  {segment.key_needs && Array.isArray(segment.key_needs) && segment.key_needs.length > 0 && (
                                    <div className="bg-white rounded-lg border border-gray-100 p-4">
                                      <div className="flex items-center gap-2 mb-3">
                                        <i className="fas fa-bullseye text-gray-500 text-sm"></i>
                                        <h5 className="text-sm font-semibold text-gray-900">Key Needs</h5>
                                      </div>
                                      <div className="space-y-2">
                                        {segment.key_needs.map((need: string, needIndex: number) => (
                                          <div key={needIndex} className="flex items-start gap-2">
                                            <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                                            <p className="text-sm text-gray-700">{need}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                </div>
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
                <button 
                  onClick={handleGenerateOverview}
                  disabled={isLoading}
                  className="px-5 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin text-xs"></i>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Overview</span>
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
