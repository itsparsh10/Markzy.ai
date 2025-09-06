'use client'

import { useState } from 'react';
import { Wand2, Copy, Check, FileText } from 'lucide-react';
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

export default function SEOTitleDescriptionProduct({ onBackClick }: { onBackClick: () => void }) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());
  
  const [inputs, setInputs] = useState({
    productName: '',
    productCategory: '',
    productDescription: '',
    primaryKeyword: '',
    secondaryKeywords: '',
    targetAudience: '',
    uniqueSellingPoints: '',
    competitorAnalysis: '',
    brandName: '',
    priceRange: '',
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
        product_name: inputs.productName,
        product_category: inputs.productCategory,
        product_description: inputs.productDescription,
      };

      const response = await aiToolsService.generateSEOProductPageDesc(requestData);
      setResults(response);
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'SEO Title Description Product',
          toolId: 'seo-title-description-product',
          outputResult: response,
          prompt: JSON.stringify(requestData)
        });
        console.log('✅ SEO Title Description Product saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
      console.log('SEO Product Page Description API Response:', response);
    } catch (err: any) {
      console.error('Error generating SEO product page description:', err);
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
      <SectionCard title="Product Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-blue-900" htmlFor="productName">Product Name</label>
            <input
              id="productName"
              name="productName"
              value={inputs.productName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
              placeholder="Enter your product name..."
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-blue-900" htmlFor="productCategory">Product Category</label>
            <select
              id="productCategory"
              name="productCategory"
              value={inputs.productCategory}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
            >
              <option value="">Select product category</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing & Fashion</option>
              <option value="health">Health & Beauty</option>
              <option value="home">Home & Garden</option>
              <option value="sports">Sports & Outdoors</option>
              <option value="books">Books & Media</option>
              <option value="toys">Toys & Games</option>
              <option value="automotive">Automotive</option>
              <option value="jewelry">Jewelry & Accessories</option>
              <option value="digital">Digital Products</option>
              <option value="other">Other</option>
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
            placeholder="Describe your product, its features, benefits, and what makes it special..."
          ></textarea>
        </div>
      </SectionCard>

      <SectionCard title="SEO Keywords & Targeting">
        <InputField
          label="Primary Keyword"
          id="primaryKeyword"
          value={inputs.primaryKeyword}
          onChange={handleInputChange}
          placeholder="Enter your main target keyword (e.g., 'wireless headphones', 'organic skincare')"
        />
        <InputField
          label="Secondary Keywords"
          id="secondaryKeywords"
          value={inputs.secondaryKeywords}
          onChange={handleInputChange}
          type="textarea"
          placeholder="Enter related keywords separated by commas (e.g., 'bluetooth earbuds, noise cancelling headphones, wireless audio')"
        />
        <InputField
          label="Target Audience"
          id="targetAudience"
          value={inputs.targetAudience}
          onChange={handleInputChange}
          type="textarea"
          placeholder="Describe who would buy this product (demographics, interests, needs, search behavior)"
        />
      </SectionCard>

      <SectionCard title="Product Positioning & Competition">
        <p className="text-sm text-gray-600 mb-4">Help us understand what makes your product unique and how it compares to competitors.</p>
        <InputField
          label="Unique Selling Points"
          id="uniqueSellingPoints"
          value={inputs.uniqueSellingPoints}
          onChange={handleInputChange}
          type="textarea"
          placeholder="What makes your product different? (e.g., eco-friendly materials, patented technology, best price)"
        />
        <InputField
          label="Competitor Analysis"
          id="competitorAnalysis"
          value={inputs.competitorAnalysis}
          onChange={handleInputChange}
          type="textarea"
          placeholder="Who are your main competitors? How does your product compare? (optional)"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Brand Name"
            id="brandName"
            value={inputs.brandName}
            onChange={handleInputChange}
            placeholder="Your brand name"
          />
          <InputField
            label="Price Range"
            id="priceRange"
            value={inputs.priceRange}
            onChange={handleInputChange}
            type="select"
            options={['Budget ($)', 'Mid-range ($$)', 'Premium ($$$)', 'Luxury ($$$$)']}
            placeholder="Select price range"
          />
        </div>
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
              Generate SEO Title & Description
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
            <FileText size={20} className="text-blue-500" /> SEO Title & Description Results
          </h4>
          <div className="space-y-4">
            {results.seo_title && (
              <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h5 className="font-semibold text-blue-700 mb-2">SEO Title</h5>
                    <div className="text-gray-800 text-sm whitespace-pre-line">{results.seo_title}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Character count: {results.title_character_count || results.seo_title.length}
                    </div>
                  </div>
                  <button
                    className={`px-3 py-1.5 text-xs rounded flex items-center gap-1 border border-blue-200 ${copiedItems.has('seo_title') ? 'bg-green-100 text-green-700 border-green-300' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                    onClick={() => copyToClipboard(results.seo_title, 'seo_title')}
                  >
                    {copiedItems.has('seo_title') ? <Check size={14} /> : <Copy size={14} />}
                    {copiedItems.has('seo_title') ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
            {results.seo_description && (
              <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h5 className="font-semibold text-blue-700 mb-2">SEO Description</h5>
                    <div className="text-gray-800 text-sm whitespace-pre-line">{results.seo_description}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Character count: {results.description_character_count || results.seo_description.length}
                    </div>
                  </div>
                  <button
                    className={`px-3 py-1.5 text-xs rounded flex items-center gap-1 border border-blue-200 ${copiedItems.has('seo_description') ? 'bg-green-100 text-green-700 border-green-300' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                    onClick={() => copyToClipboard(results.seo_description, 'seo_description')}
                  >
                    {copiedItems.has('seo_description') ? <Check size={14} /> : <Copy size={14} />}
                    {copiedItems.has('seo_description') ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
            {results.keywords_used && results.keywords_used.length > 0 && (
              <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h5 className="font-semibold text-blue-700 mb-2">Keywords Used</h5>
                    <div className="space-y-2">
                      {results.keywords_used.map((keyword: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></span>
                          <span className="text-gray-800 text-sm">{keyword}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    className={`px-3 py-1.5 text-xs rounded flex items-center gap-1 border border-blue-200 ${copiedItems.has('keywords_used') ? 'bg-green-100 text-green-700 border-green-300' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                    onClick={() => copyToClipboard(results.keywords_used.join(', '), 'keywords_used')}
                  >
                    {copiedItems.has('keywords_used') ? <Check size={14} /> : <Copy size={14} />}
                    {copiedItems.has('keywords_used') ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
            {results.additional_recommendations && (
              <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h5 className="font-semibold text-blue-700 mb-2">Additional Recommendations</h5>
                    <div className="text-gray-800 text-sm whitespace-pre-line">{results.additional_recommendations}</div>
                  </div>
                  <button
                    className={`px-3 py-1.5 text-xs rounded flex items-center gap-1 border border-blue-200 ${copiedItems.has('additional_recommendations') ? 'bg-green-100 text-green-700 border-green-300' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                    onClick={() => copyToClipboard(results.additional_recommendations, 'additional_recommendations')}
                  >
                    {copiedItems.has('additional_recommendations') ? <Check size={14} /> : <Copy size={14} />}
                    {copiedItems.has('additional_recommendations') ? 'Copied!' : 'Copy'}
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
              <i className="fas fa-shopping-bag text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">E-commerce Product</h4>
              <p className="text-xs text-blue-600">Template for standard e-commerce product pages with focus on conversions.</p>
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
              <h4 className="font-medium text-blue-900">Digital Product</h4>
              <p className="text-xs text-blue-600">Template for software, apps, courses, and other digital products.</p>
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
              <h4 className="font-medium text-blue-900">Health & Beauty</h4>
              <p className="text-xs text-blue-600">Template for health, beauty, and wellness product SEO optimization.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-tshirt text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Fashion & Clothing</h4>
              <p className="text-xs text-blue-600">Template for fashion, clothing, and accessory product SEO.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-home text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Home & Garden</h4>
              <p className="text-xs text-blue-600">Template for home improvement, furniture, and garden product SEO.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-microchip text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Electronics & Tech</h4>
              <p className="text-xs text-blue-600">Template for electronics, gadgets, and technology product SEO.</p>
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
        <History toolName="SEO Title Description Product" />
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
              <i className="fas fa-search text-blue-100 text-3xl"></i>
        </div>
        <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">SEO Title & Description for Product Pages</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Optimize your product pages for search engines</p>
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
