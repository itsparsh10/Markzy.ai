'use client';

import React, { useState } from 'react';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface CheckoutPageProps {
  onBackClick: () => void;
}

export default function CheckoutPage({ onBackClick }: CheckoutPageProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'result' | 'templates' | 'history'>('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [inputs, setInputs] = useState({
    productName: '',
    productType: '',
    price: '',
    productDescription: '',
    mainBenefits: '',
    urgency: '',
    guarantees: '',
    testimonials: '',
    pageStyle: 'professional',
    trustSignals: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  // Helper function to format text with bold headings
  const formatTextWithBold = (text: string) => {
    if (!text) return null;
    
    return text.split('\n').map((line, index) => {
      // Check if line is a heading (contains : or is all caps or starts with numbers)
      const isHeading = line.includes(':') && line.length < 100 || 
                       /^[A-Z\s\d\-\.]+:/.test(line) ||
                       /^\d+\./.test(line.trim()) ||
                       /^[A-Z\s]{3,}$/.test(line.trim());
      
      if (isHeading) {
        return (
          <div key={index} className="font-bold text-blue-900 mt-4 mb-2 text-sm border-b border-blue-100 pb-1">
            {line}
          </div>
        );
      }
      
      // Format bullet points
      if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
        return (
          <div key={index} className="mb-2 text-sm text-gray-700 leading-relaxed pl-4">
            <span className="text-blue-600 mr-2">•</span>
            {line.replace(/^[-•]\s*/, '')}
          </div>
        );
      }
      
      // Regular text
      if (line.trim()) {
        return (
          <div key={index} className="mb-2 text-sm text-gray-700 leading-relaxed">
            {line}
          </div>
        );
      }
      
      return <div key={index} className="mb-2"></div>;
    });
  };

  const formatContentForCopy = (content: any) => {
    if (typeof content === 'string') return content;
    
    // Handle checkout_page content directly (expected API response format)
    if (content.checkout_page && typeof content.checkout_page === 'string') {
      const header = "CHECKOUT PAGE RESULTS\n" + "=".repeat(25) + "\n\n";
      return header + content.checkout_page;
    }
    
    // Handle structured checkout page content
    if (content.sections && Array.isArray(content.sections)) {
      const header = "CHECKOUT PAGE RESULTS\n" + "=".repeat(25) + "\n\n";
      const sectionsList = content.sections.map((section: any, index: number) => 
        `SECTION ${index + 1}: ${section.title || section.heading}\n${section.content || section.description}\n`
      ).join('\n');
      const summary = `\nSUMMARY:\nGenerated checkout page with ${content.sections.length} sections optimized for conversion.`;
      return header + sectionsList + summary;
    }
    
    if (content.checkout_content || content.content || content.page_content || content.generated_content) {
      return content.checkout_content || content.content || content.page_content || content.generated_content;
    }
    
    return Object.entries(content)
      .filter(([key, value]) => typeof value === 'string' && value.length > 50)
      .map(([key, value]) => `${key.replace(/_/g, ' ').toUpperCase()}:\n${value}`)
      .join('\n\n') || JSON.stringify(content);
  };

  const formatCheckoutPageOutput = (content: any) => {
    // Handle structured checkout page response (main expected format)
    if (content.headline || content.subheadline || content.product_summary || content.benefits_section) {
      return (
        <div className="space-y-6">
          <div className="font-bold text-lg text-blue-900 mb-6 flex items-center gap-2 border-b border-blue-200 pb-3">
            <i className="fas fa-check-square text-blue-600"></i>
            Checkout Page Results
          </div>

          {/* Headline Section */}
          {content.headline && (
            <div className="bg-white border border-blue-100 rounded-lg p-4 hover:shadow-md transition-all duration-200">
              <h4 className="font-bold text-blue-900 text-base mb-2 flex items-center gap-2">
                <i className="fas fa-bullhorn text-blue-600 text-sm"></i>
                Headline
              </h4>
              <div className="text-lg font-semibold text-gray-800 bg-gray-50 p-3 rounded-lg border-l-4 border-blue-300">
                {content.headline}
              </div>
            </div>
          )}

          {/* Subheadline Section */}
          {content.subheadline && (
            <div className="bg-white border border-blue-100 rounded-lg p-4 hover:shadow-md transition-all duration-200">
              <h4 className="font-bold text-blue-900 text-base mb-2 flex items-center gap-2">
                <i className="fas fa-quote-left text-blue-600 text-sm"></i>
                Subheadline
              </h4>
              <div className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border-l-4 border-blue-300">
                {content.subheadline}
              </div>
            </div>
          )}

          {/* Product Summary */}
          {content.product_summary && (
            <div className="bg-white border border-blue-100 rounded-lg p-4 hover:shadow-md transition-all duration-200">
              <h4 className="font-bold text-blue-900 text-base mb-2 flex items-center gap-2">
                <i className="fas fa-box text-blue-600 text-sm"></i>
                Product Summary
              </h4>
              <div className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border-l-4 border-blue-300">
                {content.product_summary}
              </div>
            </div>
          )}

          {/* Benefits Section */}
          {content.benefits_section && Array.isArray(content.benefits_section) && (
            <div className="bg-white border border-blue-100 rounded-lg p-4 hover:shadow-md transition-all duration-200">
              <h4 className="font-bold text-blue-900 text-base mb-2 flex items-center gap-2">
                <i className="fas fa-star text-blue-600 text-sm"></i>
                Key Benefits
              </h4>
              <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-blue-300">
                {content.benefits_section.map((benefit: string, index: number) => (
                  <div key={index} className="flex items-start gap-2 mb-2 last:mb-0">
                    <span className="text-blue-600 mt-1">•</span>
                    <span className="text-sm text-gray-700 leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Urgency Section */}
          {content.urgency_section && (
            <div className="bg-white border border-orange-100 rounded-lg p-4 hover:shadow-md transition-all duration-200">
              <h4 className="font-bold text-orange-900 text-base mb-2 flex items-center gap-2">
                <i className="fas fa-clock text-orange-600 text-sm"></i>
                Urgency & Scarcity
              </h4>
              <div className="text-sm text-orange-800 leading-relaxed bg-orange-50 p-3 rounded-lg border-l-4 border-orange-300">
                {content.urgency_section}
              </div>
            </div>
          )}

          {/* Guarantees Section */}
          {content.guarantees_section && (
            <div className="bg-white border border-green-100 rounded-lg p-4 hover:shadow-md transition-all duration-200">
              <h4 className="font-bold text-green-900 text-base mb-2 flex items-center gap-2">
                <i className="fas fa-shield-alt text-green-600 text-sm"></i>
                Guarantees & Risk Reversal
              </h4>
              <div className="text-sm text-green-800 leading-relaxed bg-green-50 p-3 rounded-lg border-l-4 border-green-300">
                {content.guarantees_section}
              </div>
            </div>
          )}

          {/* Testimonials Section */}
          {content.testimonials_section && Array.isArray(content.testimonials_section) && (
            <div className="bg-white border border-purple-100 rounded-lg p-4 hover:shadow-md transition-all duration-200">
              <h4 className="font-bold text-purple-900 text-base mb-2 flex items-center gap-2">
                <i className="fas fa-users text-purple-600 text-sm"></i>
                Customer Testimonials
              </h4>
              <div className="bg-purple-50 p-3 rounded-lg border-l-4 border-purple-300 space-y-3">
                {content.testimonials_section.map((testimonial: string, index: number) => (
                  <div key={index} className="bg-white p-3 rounded border-l-2 border-purple-200">
                    <p className="text-sm text-gray-700 italic">"{testimonial}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trust Signals Section */}
          {content.trust_signals_section && Array.isArray(content.trust_signals_section) && (
            <div className="bg-white border border-blue-100 rounded-lg p-4 hover:shadow-md transition-all duration-200">
              <h4 className="font-bold text-blue-900 text-base mb-2 flex items-center gap-2">
                <i className="fas fa-certificate text-blue-600 text-sm"></i>
                Trust Signals
              </h4>
              <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-blue-300">
                {content.trust_signals_section.map((signal: string, index: number) => (
                  <div key={index} className="flex items-start gap-2 mb-2 last:mb-0">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span className="text-sm text-gray-700 leading-relaxed">{signal}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Call to Action */}
          {content.call_to_action && (
            <div className="bg-white border border-indigo-100 rounded-lg p-4 hover:shadow-md transition-all duration-200">
              <h4 className="font-bold text-indigo-900 text-base mb-2 flex items-center gap-2">
                <i className="fas fa-rocket text-indigo-600 text-sm"></i>
                Call to Action
              </h4>
              <div className="text-sm text-indigo-800 leading-relaxed bg-indigo-50 p-3 rounded-lg border-l-4 border-indigo-300 font-medium">
                {content.call_to_action}
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 flex items-center gap-2">
              <i className="fas fa-info-circle text-blue-600"></i>
              <span className="font-semibold">Generated complete checkout page</span> 
              with all essential conversion elements optimized for your product.
            </p>
          </div>
        </div>
      );
    }

    // Handle checkout_page content directly (text format)
    if (content.checkout_page && typeof content.checkout_page === 'string') {
      return formatTextWithBold(content.checkout_page);
    }

    // Handle sections array format
    if (content.sections && Array.isArray(content.sections)) {
      return (
        <div className="space-y-4">
          <div className="font-bold text-lg text-blue-900 mb-6 flex items-center gap-2 border-b border-blue-200 pb-3">
            <i className="fas fa-check-square text-blue-600"></i>
            Checkout Page Results
          </div>
          <div className="space-y-4">
            {content.sections.map((section: any, index: number) => (
              <div key={index} className="bg-white border border-blue-100 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-blue-900 text-base mb-2 flex items-center gap-2">
                      <i className="fas fa-shopping-cart text-blue-600 text-sm"></i>
                      {section.title || section.heading || `Section ${index + 1}`}
                    </h4>
                    <div className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border-l-4 border-blue-300">
                      {section.content || section.description}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 flex items-center gap-2">
              <i className="fas fa-info-circle text-blue-600"></i>
              <span className="font-semibold">Generated checkout page with {content.sections.length} sections</span> 
              optimized for conversion and user experience.
            </p>
          </div>
        </div>
      );
    }
    
    // Handle text-based content
    if (typeof content === 'string') {
      return formatTextWithBold(content);
    }
    
    // Handle object with text content
    if (content.checkout_content || content.content || content.page_content) {
      const textContent = content.checkout_content || content.content || content.page_content;
      if (typeof textContent === 'string') {
        return formatTextWithBold(textContent);
      }
    }
    
    // Fallback for other formats
    return (
      <div className="space-y-4">
        <div className="font-bold text-lg text-blue-900 mb-4 flex items-center gap-2">
          <i className="fas fa-check-square text-blue-600"></i>
          Checkout Page Content
        </div>
        <div className="whitespace-pre-wrap text-sm text-gray-800">
          {JSON.stringify(content, null, 2)}
        </div>
      </div>
    );
  };

  const handleGenerateCheckoutPage = async () => {
    // Validate required fields
    const requiredFields = [
      { key: 'productName', label: 'Product/Service Name' },
      { key: 'productType', label: 'Product Type' },
      { key: 'price', label: 'Price' },
      { key: 'productDescription', label: 'Product Description' },
      { key: 'mainBenefits', label: 'Main Benefits' }
    ];

    const missingFields = requiredFields.filter(field => !inputs[field.key as keyof typeof inputs]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.map(f => f.label).join(', ')}`);
      return;
    }

    setIsLoading(true);
    
    try {
      // Dynamic import for ES modules
      const { aiToolsService } = await import('../../services/aiTools.js');
      
      // Map UI values to API format using correct field names
      const requestData = {
        product_service_name: inputs.productName,
        product_type: inputs.productType,
        price: inputs.price,
        product_description: inputs.productDescription,
        main_benefits: inputs.mainBenefits,
        urgency_scarcity: inputs.urgency || 'Limited time offer',
        guarantees: inputs.guarantees || '30-day money-back guarantee',
        testimonials: inputs.testimonials || 'Customer testimonials not provided',
        page_style: inputs.pageStyle,
        trust_signals: inputs.trustSignals || 'Secure payment processing'
      };

      console.log('Sending checkout page request:', requestData);
      const response = await aiToolsService.generateCheckoutPage(requestData);
      console.log('Checkout page response:', response);
      setGeneratedContent(response);
      setActiveTab('result');
      
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Checkout Page',
          toolId: 'checkout-page',
          outputResult: response,
          prompt: JSON.stringify(requestData)
        });
        console.log('✅ Checkout page saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
      
    } catch (error: any) {
      // Error handling with user-friendly messages
      let errorMessage = 'Failed to generate checkout page. Please try again.';
      
      if (error.response?.data?.detail) {
        errorMessage = `API Error: ${error.response.data.detail}`;
      } else if (error.message && error.message.includes('Missing required fields')) {
        errorMessage = error.message;
      } else if (error.response?.status === 400) {
        errorMessage = 'The request was invalid. Please check all required fields.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication error. Please try logging out and back in.';
      }
      
      console.error('Error details:', error.response?.data || error.message);
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const checkoutTemplates = [
    { name: "Simple Checkout", icon: "fas fa-credit-card", description: "Clean, minimal checkout page focused on conversion." },
    { name: "Product Showcase", icon: "fas fa-star", description: "Highlight product features and benefits prominently." },
    { name: "Trust-Focused", icon: "fas fa-shield-alt", description: "Emphasize security, guarantees, and trust signals." },
    { name: "Urgency-Driven", icon: "fas fa-clock", description: "Create urgency with limited time offers and scarcity." },
    { name: "Social Proof Heavy", icon: "fas fa-users", description: "Feature testimonials and social proof prominently." },
    { name: "Bundle Offer", icon: "fas fa-gift", description: "Present bundle deals and upsells effectively." }
  ];

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Glassmorphic Header with blue gradient */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-check-square text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Checkout Page</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create optimized checkout pages that convert visitors to customers</p>
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
                {generatedContent && (
                  <button 
                    onClick={() => setActiveTab('result')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${activeTab === 'result' ? 'text-blue-700 bg-blue-50/70' : 'text-blue-500 hover:text-blue-600'}`}
                  >
                    <span className="flex items-center gap-2">
                      <i className="fas fa-plus-circle text-xs"></i>
                      Generated Plan
                    </span>
                    {activeTab === 'result' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>}
                  </button>
                )}
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
                  {/* Success Banner */}
                  {generatedContent && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <i className="fas fa-check text-green-600 text-sm"></i>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-green-800">Plan Generated Successfully!</h4>
                            <p className="text-xs text-green-600 mt-0.5">Your social media plan is ready to view.</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setActiveTab('result')}
                          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors duration-200"
                        >
                          View Plan
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Product Information</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="productName">Product/Service Name</label>
                          <input
                            id="productName"
                            name="productName"
                            type="text"
                            value={inputs.productName}
                            onChange={handleInputChange}
                            placeholder="Enter your product name"
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
                            <option value="">Select product type</option>
                            <option value="digital">Digital Product</option>
                            <option value="physical">Physical Product</option>
                            <option value="service">Service</option>
                            <option value="course">Online Course</option>
                            <option value="software">Software/SaaS</option>
                            <option value="membership">Membership</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="price">Price</label>
                          <input
                            id="price"
                            name="price"
                            type="text"
                            value={inputs.price}
                            onChange={handleInputChange}
                            placeholder="$99.00"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="pageStyle">Page Style</label>
                          <select
                            id="pageStyle"
                            name="pageStyle"
                            value={inputs.pageStyle}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="professional">Professional</option>
                            <option value="modern">Modern</option>
                            <option value="minimal">Minimal</option>
                            <option value="bold">Bold</option>
                            <option value="elegant">Elegant</option>
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
                          placeholder="Briefly describe what your product does and its main features..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Benefits & Value Proposition</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="mainBenefits">Main Benefits</label>
                        <textarea 
                          id="mainBenefits"
                          name="mainBenefits"
                          value={inputs.mainBenefits}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="List the key benefits customers will get from your product..."
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="urgency">Urgency/Scarcity</label>
                        <textarea 
                          id="urgency"
                          name="urgency"
                          value={inputs.urgency}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="Add urgency elements (limited time, limited quantity, bonus expiration, etc.)"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="guarantees">Guarantees & Risk Reversal</label>
                        <textarea 
                          id="guarantees"
                          name="guarantees"
                          value={inputs.guarantees}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="What guarantees do you offer? (money-back, satisfaction, etc.)"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Social Proof & Trust Signals</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="testimonials">Testimonials & Reviews</label>
                        <textarea 
                          id="testimonials"
                          name="testimonials"
                          value={inputs.testimonials}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Include customer testimonials, reviews, or case studies..."
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="trustSignals">Trust Signals</label>
                        <textarea 
                          id="trustSignals"
                          name="trustSignals"
                          value={inputs.trustSignals}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="Security badges, certifications, awards, media mentions, etc."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'result' && generatedContent && (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  <div className="bg-white border border-green-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                        <i className="fas fa-check-circle text-green-600"></i>
                        Generated Checkout Plan
                      </h3>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => navigator.clipboard.writeText(formatContentForCopy(generatedContent))}
                          className="px-3 py-1.5 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-all flex items-center gap-1"
                        >
                          <i className="fas fa-copy text-xs"></i>
                          Copy
                        </button>
                        <button 
                          onClick={() => setGeneratedContent(null)}
                          className="px-3 py-1.5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-all flex items-center gap-1"
                        >
                          <i className="fas fa-times text-xs"></i>
                          Clear
                        </button>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      {formatCheckoutPageOutput(generatedContent)}
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && (
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {checkoutTemplates.map((template, index) => (
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
                  <History toolName="Checkout Page" />
                </div>
              )}
            </div>
            
            {/* Results Display */}
            {generatedContent && (
              <div className="mt-4 px-4">
                <div className="bg-white border border-green-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                      <i className="fas fa-check-circle text-green-600"></i>
                      Generated Checkout Page
                    </h3>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          const contentToFormat = formatContentForCopy(generatedContent);
                          navigator.clipboard.writeText(contentToFormat);
                        }}
                        className="px-3 py-1.5 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-all flex items-center gap-1"
                      >
                        <i className="fas fa-copy text-xs"></i>
                        Copy
                      </button>
                      <button 
                        onClick={() => setGeneratedContent(null)}
                        className="px-3 py-1.5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-all flex items-center gap-1"
                      >
                        <i className="fas fa-times text-xs"></i>
                        Clear
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
                    {formatCheckoutPageOutput(generatedContent)}
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
                  onClick={handleGenerateCheckoutPage}
                  disabled={isLoading}
                  className="px-5 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Page</span>
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
