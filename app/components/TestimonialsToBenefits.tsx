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

export default function TestimonialsToBenefits({ onBackClick }: { onBackClick: () => void }) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAnalysis, setGeneratedAnalysis] = useState<{
    features?: string[];
    benefits?: string[];
    supporting_quotes?: string[];
  }>({});
  const [inputs, setInputs] = useState({
    productName: '',
    productType: '',
    targetAudience: '',
    testimonials: '',
    currentBenefits: '',
    additionalContext: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleAnalyzeTestimonials = async () => {
    try {
      setIsGenerating(true);
      
      const requestData = {
        product_name: inputs.productName,
        product_type: inputs.productType,
        target_audience: inputs.targetAudience,
        testimonials: inputs.testimonials,
        current_known_benefits: inputs.currentBenefits,
        additional_information: inputs.additionalContext
      };

      const response = await aiToolsService.generateTestimonialsToBenefits(requestData);
      setGeneratedAnalysis(response);
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Testimonials To Benefits',
          toolId: 'testimonials-to-benefits',
          outputResult: response,
          prompt: JSON.stringify(requestData)
        });
        console.log('✅ Testimonials to benefits saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
    } catch (error) {
      console.error('Error analyzing testimonials:', error);
      // You can add toast notification here if needed
    } finally {
      setIsGenerating(false);
    }
  };

  const renderGenerateTab = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-3 rounded-lg shadow-sm border border-blue-100 mb-6">
        <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center">
          Product Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-blue-900" htmlFor="productName">Product Name</label>
            <input
              id="productName"
              name="productName"
              value={inputs.productName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
              placeholder="Enter your product or service name"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-blue-900" htmlFor="productType">Product Type</label>
            <select
              id="productType"
              name="productType"
              value={inputs.productType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
            >
              <option value="">Select product type</option>
              <option value="physical">Physical Product</option>
              <option value="digital">Digital Product</option>
              <option value="service">Service</option>
              <option value="course">Online Course</option>
              <option value="software">Software/App</option>
              <option value="consulting">Consulting</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div className="space-y-2 mt-4">
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
      </div>

      <div className="bg-blue-50 p-3 rounded-lg shadow-sm border border-blue-100 mb-6">
        <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center">
          Customer Testimonials
        </h3>
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="testimonials">Testimonials & Reviews</label>
          <textarea 
            id="testimonials"
            name="testimonials"
            value={inputs.testimonials}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-32" 
            placeholder="Paste your customer testimonials, reviews, and feedback here. Include as many as you have - the more detailed, the better we can identify benefits and features."
          ></textarea>
        </div>
        <div className="space-y-2 mt-4">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="currentBenefits">Current Known Benefits (Optional)</label>
          <textarea 
            id="currentBenefits"
            name="currentBenefits"
            value={inputs.currentBenefits}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
            placeholder="List any benefits you already know about your product (optional - helps us avoid duplicates)"
          ></textarea>
        </div>
      </div>

      <div className="bg-blue-50 p-3 rounded-lg shadow-sm border border-blue-100 mb-6">
        <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center">
          Additional Context
        </h3>
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="additionalContext">Additional Information</label>
          <textarea 
            id="additionalContext"
            name="additionalContext"
            value={inputs.additionalContext}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
            placeholder="Any additional context about your product, industry, or specific benefits you want to highlight"
          ></textarea>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={handleAnalyzeTestimonials}
          disabled={isGenerating}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Analyzing...
            </>
          ) : (
            <>
              <Wand2 size={18} className="mr-2" />
              Generate Benefits & Features
            </>
          )}
        </button>
      </div>
      
      {/* Generated Analysis */}
      {(generatedAnalysis.features || generatedAnalysis.benefits || generatedAnalysis.supporting_quotes) && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
            <i className="fas fa-check-circle mr-2"></i>
            Analysis Results
          </h3>
          
          {/* Features */}
          {generatedAnalysis.features && generatedAnalysis.features.length > 0 && (
            <div className="mb-4">
              <h4 className="text-md font-semibold text-green-700 mb-2">Key Features</h4>
              <div className="bg-white border border-green-200 rounded-lg p-3">
                <ul className="space-y-1">
                  {generatedAnalysis.features.map((feature, index) => (
                    <li key={index} className="text-gray-800 flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      {feature}
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
          
          {/* Benefits */}
          {generatedAnalysis.benefits && generatedAnalysis.benefits.length > 0 && (
            <div className="mb-4">
              <h4 className="text-md font-semibold text-green-700 mb-2">Customer Benefits</h4>
              <div className="bg-white border border-green-200 rounded-lg p-3">
                <ul className="space-y-1">
                  {generatedAnalysis.benefits.map((benefit, index) => (
                    <li key={index} className="text-gray-800 flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      {benefit}
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
          
          {/* Supporting Quotes */}
          {generatedAnalysis.supporting_quotes && generatedAnalysis.supporting_quotes.length > 0 && (
            <div>
              <h4 className="text-md font-semibold text-green-700 mb-2">Supporting Quotes</h4>
              <div className="bg-white border border-green-200 rounded-lg p-3">
                <ul className="space-y-2">
                  {generatedAnalysis.supporting_quotes.map((quote, index) => (
                    <li key={index} className="text-gray-800 italic">
                      "{quote}"
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
              <i className="fas fa-star text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Feature Extraction</h4>
              <p className="text-xs text-blue-600">Template for extracting key features from customer testimonials.</p>
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
              <h4 className="font-medium text-blue-900">Benefit Analysis</h4>
              <p className="text-xs text-blue-600">Template for identifying customer benefits from feedback.</p>
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
              <h4 className="font-medium text-blue-900">Review Mining</h4>
              <p className="text-xs text-blue-600">Template for extracting insights from customer reviews.</p>
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
        <p className="text-sm text-blue-700 max-w-md">View your previously generated benefits and features analysis.</p>
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
              <i className="fas fa-star text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Testimonials to Benefits</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Extract features and benefits from customer testimonials</p>
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
              {activeTab === 'history' && (
                <div className="py-4">
                  <History toolName="Testimonials To Benefits" />
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
                  onClick={handleAnalyzeTestimonials}
                  disabled={isGenerating}
                  className="px-5 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <span>Analyze Testimonials</span>
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
