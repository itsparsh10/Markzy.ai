'use client'

import { useState } from 'react';
import { ArrowLeft, Briefcase, Users, Footprints, Lightbulb, Target, Search, ShoppingBag, MessageSquare, ThumbsUp, FileText, History as HistoryIcon, Route, Clock, X, Save, Wand2, Tag, Zap, Star } from 'lucide-react';
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

export default function ProductNameIdeas({ onBackClick }: { onBackClick: () => void }) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputs, setInputs] = useState({
    productType: '',
    productDescription: '',
    targetAudience: '',
    keyFeatures: '',
    brandPersonality: '',
    competitorNames: '',
    nameStyle: '',
    keywords: '',
    avoidWords: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateNames = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const { aiToolsService } = await import('../../services/aiTools.js');
      
      // Debug: Check what functions are available
      console.log('aiToolsService functions:', Object.keys(aiToolsService));
      console.log('generateProductNameIdeas available:', typeof aiToolsService.generateProductNameIdeas);
      
      const apiData = {
        product_type: inputs.productType,
        name_style_preference: inputs.nameStyle,
        product_description: inputs.productDescription,
        target_audience: inputs.targetAudience,
        brand_personality_tone: inputs.brandPersonality,
        key_features_benefits: inputs.keyFeatures,
        keywords_to_include: inputs.keywords,
        competitor_names: inputs.competitorNames,
        words_to_avoid: inputs.avoidWords
      };
      
      const response = await aiToolsService.generateProductNameIdeas(apiData);
      setResult(response);
      
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Product Name Ideas',
          toolId: 'product-name-ideas',
          outputResult: response,
          prompt: JSON.stringify(apiData)
        });
        console.log('✅ Product name ideas saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
    } catch (err: any) {
      console.error('Error generating product names:', err);
      setError(err.message || 'Failed to generate product names. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderGenerateTab = () => (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <i className="fas fa-exclamation-circle"></i>
            <span className="font-medium">Error</span>
          </div>
          <p className="text-sm text-red-600 mt-1">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <div className="flex items-center justify-center gap-3 text-blue-700">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="font-medium">Generating your product names...</span>
          </div>
          <p className="text-sm text-blue-600 mt-2">This may take a few moments</p>
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="space-y-6">
          {/* Name Ideas Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Tag className="w-5 h-5 text-blue-600" />
                Generated Product Names
              </h3>
              <button
                onClick={() => {
                  const namesText = result.name_ideas?.join('\n') || '';
                  navigator.clipboard.writeText(namesText);
                }}
                className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 border border-blue-200 rounded-lg hover:bg-blue-50 transition-all flex items-center gap-2"
              >
                <i className="fas fa-copy text-xs"></i>
                Copy All
              </button>
            </div>
            
            {result.name_ideas && result.name_ideas.length > 0 ? (
              <div className="space-y-3">
                {result.name_ideas.map((name: string, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">{name}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(name)}
                      className="text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <i className="fas fa-copy text-sm"></i>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No name ideas generated yet.</p>
            )}
          </div>

          {/* Rationale Section */}
          {result.rationale && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  Naming Strategy & Rationale
                </h3>
                <button
                  onClick={() => navigator.clipboard.writeText(result.rationale)}
                  className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 border border-blue-200 rounded-lg hover:bg-blue-50 transition-all flex items-center gap-2"
                >
                  <i className="fas fa-copy text-xs"></i>
                  Copy
                </button>
              </div>
              
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed">{result.rationale}</p>
              </div>
            </div>
          )}

          {/* Clear Results Button */}
          <div className="flex justify-center">
            <button
              onClick={() => setResult(null)}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear Results
            </button>
          </div>
        </div>
      )}

      <SectionCard title="Business & Product Information" icon={Briefcase}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <option value="digital">Digital Product</option>
              <option value="physical">Physical Product</option>
              <option value="software">Software/App</option>
              <option value="service">Service</option>
              <option value="course">Course/Training</option>
              <option value="ebook">E-book</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-blue-900" htmlFor="nameStyle">Name Style Preference</label>
            <select
              id="nameStyle"
              name="nameStyle"
              value={inputs.nameStyle}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
            >
              <option value="">Select name style</option>
              <option value="descriptive">Descriptive</option>
              <option value="creative">Creative/Abstract</option>
              <option value="playful">Playful/Fun</option>
              <option value="professional">Professional</option>
              <option value="techy">Tech/Modern</option>
              <option value="elegant">Elegant/Luxury</option>
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="productDescription">Product Description</label>
          <textarea 
            id="productDescription"
            name="productDescription"
            value={inputs.productDescription}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
            placeholder="Describe what your product does, its main purpose, and key benefits..."
          ></textarea>
        </div>
      </SectionCard>

      <SectionCard title="Target Audience & Brand" icon={Users}>
        <InputField
          label="Target Audience Demographics & Psychographics"
          id="targetAudience"
          value={inputs.targetAudience}
          onChange={handleInputChange}
          type="textarea"
          placeholder="Who is your ideal customer? (demographics, interests, profession, etc.)"
        />
        <InputField
          label="Brand Personality & Tone"
          id="brandPersonality"
          value={inputs.brandPersonality}
          onChange={handleInputChange}
          type="textarea"
          placeholder="How would you describe your brand's personality? (e.g., friendly, professional, innovative, trustworthy)"
        />
        <InputField
          label="Key Features & Benefits"
          id="keyFeatures"
          value={inputs.keyFeatures}
          onChange={handleInputChange}
          type="textarea"
          placeholder="What are the main features or benefits that make your product unique?"
        />
      </SectionCard>

      <SectionCard title="Naming Preferences" icon={Footprints}>
        <p className="text-sm text-gray-600 mb-4">Provide guidance for the naming direction you want to explore. Consider your brand voice, target market, and competitive landscape.</p>
        <InputField
          label="Keywords to Include"
          id="keywords"
          value={inputs.keywords}
          onChange={handleInputChange}
          type="textarea"
          placeholder="Any specific words, themes, or concepts you'd like included in the name?"
          Icon={Search}
        />
        <InputField
          label="Competitor Names (for reference)"
          id="competitorNames"
          value={inputs.competitorNames}
          onChange={handleInputChange}
          type="textarea"
          placeholder="List any competitor product names to avoid similarity and find differentiation"
          Icon={Lightbulb}
        />
        <InputField
          label="Words to Avoid"
          id="avoidWords"
          value={inputs.avoidWords}
          onChange={handleInputChange}
          type="textarea"
          placeholder="Any words, phrases, or concepts you want to avoid in the product name?"
          Icon={ShoppingBag}
        />
      </SectionCard>
    </div>
  );

  const renderTemplatesTab = () => {
    return (
      <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-laptop text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Tech Product Names</h4>
              <p className="text-xs text-blue-600">Template for software, apps, and digital products with modern tech appeal.</p>
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
              <h4 className="font-medium text-blue-900">Creative & Artistic Names</h4>
              <p className="text-xs text-blue-600">Template for creative products, art, design, and lifestyle brands.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-briefcase text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Professional Service Names</h4>
              <p className="text-xs text-blue-600">Template for consulting, business services, and professional offerings.</p>
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
              <h4 className="font-medium text-blue-900">Educational Product Names</h4>
              <p className="text-xs text-blue-600">Template for courses, training programs, and educational content.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-shopping-bag text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">E-commerce Product Names</h4>
              <p className="text-xs text-blue-600">Template for physical products, retail items, and consumer goods.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-star text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Premium & Luxury Names</h4>
              <p className="text-xs text-blue-600">Template for high-end, luxury, and premium product positioning.</p>
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
        <History toolName="Product Name Ideas" />
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
              <i className="fas fa-tag text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Product Name Ideas</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Generate creative and memorable names for your product</p>
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
                <button 
                  onClick={handleGenerateNames}
                  disabled={isLoading}
                  className={`px-5 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 size={18} className="mr-2" />
                      <span>Generate Product Names</span>
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
