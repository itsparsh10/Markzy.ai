'use client';

import React, { useState } from 'react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface EtsyEcommerceDescriptionProps {
  onBackClick: () => void;
}

export default function EtsyEcommerceDescription({ onBackClick }: EtsyEcommerceDescriptionProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputs, setInputs] = useState({
    productName: '',
    productType: '',
    digitalFormat: '',
    targetAudience: '',
    productFeatures: '',
    productBenefits: '',
    usageInstructions: '',
    keywords: '',
    productCategory: '',
    tone: 'friendly',
    priceRange: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateDescription = async () => {
    setIsGenerating(true);
    setError(null);
    setGeneratedContent(null);

    try {
      // Validate required fields
      const requiredFields = [
        { key: 'productName', label: 'Product Name' },
        { key: 'productType', label: 'Product Type' },
        { key: 'digitalFormat', label: 'Digital Format' },
        { key: 'productCategory', label: 'Product Category' },
        { key: 'targetAudience', label: 'Target Audience' },
        { key: 'productFeatures', label: 'Product Features' },
        { key: 'productBenefits', label: 'Product Benefits' },
        { key: 'usageInstructions', label: 'Usage Instructions' },
        { key: 'keywords', label: 'SEO Keywords' }
      ];

      const missingFields = requiredFields.filter(field => !inputs[field.key as keyof typeof inputs]);
      if (missingFields.length > 0) {
        setError(`Please fill in the following required fields: ${missingFields.map(f => f.label).join(', ')}`);
        return;
      }

      // Map the form inputs to the API expected format
      const descriptionData = {
        product_name: inputs.productName,
        product_type: inputs.productType,
        digital_format: inputs.digitalFormat,
        product_category: inputs.productCategory,
        target_audience: inputs.targetAudience,
        product_features: inputs.productFeatures,
        product_benefits: inputs.productBenefits,
        usage_instructions: inputs.usageInstructions,
        seo_keywords: inputs.keywords,
        tone_of_voice: inputs.tone.charAt(0).toUpperCase() + inputs.tone.slice(1) // Capitalize first letter
      };

      console.log('Etsy description data being sent:', descriptionData);
      const response = await aiToolsService.generateEtsyDescription(descriptionData);
      setGeneratedContent(response);
      
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Etsy Ecommerce Description',
          toolId: 'etsy-ecommerce-description',
          outputResult: response,
          prompt: JSON.stringify(descriptionData)
        });
        console.log('✅ Etsy ecommerce description saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
    } catch (err: any) {
      console.error('Error generating Etsy description:', err);
      setError(err.message || 'Failed to generate description. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const etsyTemplates = [
    { name: "Digital Download", icon: "fas fa-download", description: "Templates for instant digital download products." },
    { name: "Printable Art", icon: "fas fa-palette", description: "Art prints and decorative digital files." },
    { name: "Business Templates", icon: "fas fa-briefcase", description: "Professional templates for business use." },
    { name: "Educational Resources", icon: "fas fa-graduation-cap", description: "Learning materials and educational content." },
    { name: "Craft Patterns", icon: "fas fa-cut", description: "DIY and craft instruction files." },
    { name: "Digital Planners", icon: "fas fa-calendar-alt", description: "Organizational and planning digital tools." }
  ];

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Glassmorphic Header with blue gradient */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-file-alt text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Etsy Ecommerce Description</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Generate compelling product descriptions for your Etsy digital products</p>
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
                    <h4 className="text-base font-medium text-blue-900 mb-3">Product Information</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="productName">Product Name</label>
                          <input
                            id="productName"
                            name="productName"
                            type="text"
                            value={inputs.productName}
                            onChange={handleInputChange}
                            placeholder="Enter your digital product name"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
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
                            <option value="">Select Product Type</option>
                            <option value="digital-download">Digital Download</option>
                            <option value="printable">Printable</option>
                            <option value="template">Template</option>
                            <option value="digital-art">Digital Art</option>
                            <option value="planner">Digital Planner</option>
                            <option value="pattern">Pattern/Tutorial</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="digitalFormat">Digital Format</label>
                          <select
                            id="digitalFormat"
                            name="digitalFormat"
                            value={inputs.digitalFormat}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select format</option>
                            <option value="pdf">PDF</option>
                            <option value="jpg">JPG</option>
                            <option value="png">PNG</option>
                            <option value="svg">SVG</option>
                            <option value="eps">EPS</option>
                            <option value="ai">AI</option>
                            <option value="psd">PSD</option>
                          </select>
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
                            <option value="">Select category</option>
                            <option value="art-collectibles">Art & Collectibles</option>
                            <option value="craft-supplies">Craft Supplies & Tools</option>
                            <option value="paper-party">Paper & Party Supplies</option>
                            <option value="home-living">Home & Living</option>
                            <option value="wedding">Weddings</option>
                            <option value="business">Business & Industrial</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Product Details & Benefits</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="targetAudience">Target Audience</label>
                        <textarea 
                          id="targetAudience"
                          name="targetAudience"
                          value={inputs.targetAudience}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Who is this product perfect for? (e.g., small business owners, DIY enthusiasts, wedding planners)"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="productFeatures">Product Features</label>
                        <textarea 
                          id="productFeatures"
                          name="productFeatures"
                          value={inputs.productFeatures}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="List key features (e.g., high resolution, editable text, multiple sizes, instant download)"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="productBenefits">Product Benefits</label>
                        <textarea 
                          id="productBenefits"
                          name="productBenefits"
                          value={inputs.productBenefits}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="What benefits will customers get? How will this help them?"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Usage & Optimization</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="usageInstructions">Usage Instructions</label>
                        <textarea 
                          id="usageInstructions"
                          name="usageInstructions"
                          value={inputs.usageInstructions}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="How to use this product? What software is needed? Any special instructions?"
                        ></textarea>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="keywords">SEO Keywords</label>
                          <textarea 
                            id="keywords"
                            name="keywords"
                            value={inputs.keywords}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                            placeholder="Keywords for Etsy SEO (comma separated)"
                          ></textarea>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="tone">Tone of Voice</label>
                          <select
                            id="tone"
                            name="tone"
                            value={inputs.tone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="friendly">Friendly</option>
                            <option value="professional">Professional</option>
                            <option value="casual">Casual</option>
                            <option value="enthusiastic">Enthusiastic</option>
                            <option value="elegant">Elegant</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                  <div className="flex items-center gap-2 text-red-700">
                    <i className="fas fa-exclamation-triangle text-sm"></i>
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                </div>
              )}

              {/* Generated Content Display */}
              {generatedContent && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-green-900 flex items-center gap-2">
                      <i className="fas fa-check-circle text-green-600"></i>
                      Etsy Description Generated Successfully!
                    </h4>
                    <button 
                      onClick={() => setGeneratedContent(null)}
                      className="text-green-600 hover:text-green-800 transition-colors"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Main Product Description */}
                    {generatedContent.description && (
                      <div className="bg-white p-6 rounded-lg border border-green-200 shadow-sm">
                        <h5 className="font-semibold text-green-900 mb-4 flex items-center gap-2 text-lg">
                          <i className="fas fa-align-left text-green-600"></i>
                          Complete Product Description
                        </h5>
                        <div className="prose prose-sm max-w-none">
                          <div 
                            className="text-gray-800 leading-relaxed"
                            dangerouslySetInnerHTML={{ 
                              __html: generatedContent.description
                                .replace(/\n\n/g, '</p><p>')
                                .replace(/\n/g, '<br>')
                                .replace(/^(.*)/, '<p>$1')
                                .replace(/(.*)$/, '$1</p>')
                            }} 
                          />
                        </div>
                      </div>
                    )}

                    {/* Product Title */}
                    {generatedContent.title && (
                      <div className="bg-white p-4 rounded-lg border border-green-200">
                        <h5 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                          <i className="fas fa-tag text-green-600"></i>
                          Suggested Product Title
                        </h5>
                        <div className="p-3 bg-green-50 rounded border border-green-200 text-green-800 font-medium text-center">
                          {generatedContent.title}
                        </div>
                      </div>
                    )}

                    {/* Bullet Points */}
                    {generatedContent.bullet_points && (
                      <div className="bg-white p-4 rounded-lg border border-green-200">
                        <h5 className="font-medium text-green-900 mb-3 flex items-center gap-2">
                          <i className="fas fa-star text-green-600"></i>
                          Key Features & Highlights
                        </h5>
                        <div className="space-y-2">
                          {Array.isArray(generatedContent.bullet_points) ? 
                            generatedContent.bullet_points.map((feature: string, index: number) => (
                              <div key={index} className="p-3 bg-green-50 rounded border border-green-200 text-green-800 flex items-start gap-3">
                                <i className="fas fa-check-circle text-green-600 text-sm mt-0.5 flex-shrink-0"></i>
                                <span className="text-sm leading-relaxed">{feature}</span>
                              </div>
                            )) : 
                            <div className="p-3 bg-green-50 rounded border border-green-200 text-green-800 text-sm leading-relaxed">
                              {generatedContent.bullet_points}
                            </div>
                          }
                        </div>
                      </div>
                    )}

                    {/* SEO Keywords */}
                    {generatedContent.seo_keywords && (
                      <div className="bg-white p-4 rounded-lg border border-green-200">
                        <h5 className="font-medium text-green-900 mb-3 flex items-center gap-2">
                          <i className="fas fa-search text-green-600"></i>
                          SEO Keywords for Etsy
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {Array.isArray(generatedContent.seo_keywords) ? 
                            generatedContent.seo_keywords.map((keyword: string, index: number) => (
                              <span key={index} className="px-3 py-1.5 bg-green-100 text-green-800 text-sm rounded-full border border-green-200 font-medium">
                                {keyword}
                              </span>
                            )) : 
                            <div className="p-3 bg-green-50 rounded border border-green-200 text-green-800 text-sm">
                              {generatedContent.seo_keywords}
                            </div>
                          }
                        </div>
                      </div>
                    )}

                    {/* Copy to Clipboard Button */}
                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-green-900 flex items-center gap-2">
                          <i className="fas fa-copy text-green-600"></i>
                          Quick Actions
                        </h5>
                        <button 
                          onClick={() => {
                            const content = `
Product Title: ${generatedContent.title || ''}

Product Description:
${generatedContent.description || ''}

Key Features:
${Array.isArray(generatedContent.bullet_points) ? generatedContent.bullet_points.join('\n• ') : generatedContent.bullet_points || ''}

SEO Keywords:
${Array.isArray(generatedContent.seo_keywords) ? generatedContent.seo_keywords.join(', ') : generatedContent.seo_keywords || ''}
                            `.trim();
                            navigator.clipboard.writeText(content);
                          }}
                          className="px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
                        >
                          <i className="fas fa-copy text-xs"></i>
                          Copy All Content
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && (
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {etsyTemplates.map((template, index) => (
                    <div key={index} className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
                            <i className={`${template.icon} text-blue-600`}></i>
                          </div>
                          <div>
                            <h4 className="font-medium text-blue-900">{template.name}</h4>
                            <p className="text-xs text-blue-600">{template.description}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setActiveTab('generate')}
                          className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1"
                        >
                          Create
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {activeTab === 'history' && (
                <div className="py-4">
                  <History toolName="Etsy Ecommerce Description" />
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
                  onClick={handleGenerateDescription}
                  disabled={isGenerating}
                  className="px-5 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <i className="fas fa-spinner fa-spin text-xs"></i>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Description</span>
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
