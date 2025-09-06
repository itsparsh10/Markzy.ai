'use client';

import React, { useState } from 'react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface PostPurchaseEmailProps {
  onBackClick: () => void;
}

export default function PostPurchaseEmail({ onBackClick }: PostPurchaseEmailProps) {
  // State for active tab
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history' | 'result'>('generate');
  
  // State for form inputs
  const [inputs, setInputs] = useState({
    productName: '',
    productType: '',
    customerName: '',
    purchaseDetails: '',
    accessInstructions: '',
    nextSteps: '',
    supportContact: '',
    emailTone: 'professional',
    includeOnboarding: '',
    additionalResources: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  // Email template types with appropriate icons
  const emailTypes = [
    { name: "Digital Product Delivery", icon: "fas fa-download", description: "Email template for delivering digital products and access instructions." },
    { name: "Physical Product Confirmation", icon: "fas fa-shipping-fast", description: "Confirmation email for physical product orders with shipping details." },
    { name: "Service Purchase Welcome", icon: "fas fa-handshake", description: "Welcome email for service-based purchases with next steps." },
    { name: "Course Access Email", icon: "fas fa-graduation-cap", description: "Grant access to online courses and learning materials." },
    { name: "Subscription Confirmation", icon: "fas fa-calendar-check", description: "Confirm subscription purchases with billing and access details." },
    { name: "Software License Delivery", icon: "fas fa-key", description: "Deliver software licenses and installation instructions." }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Map form data to API format
      const apiData = {
        product_service_name: inputs.productName,
        product_type: inputs.productType,
        customer_name: inputs.customerName,
        email_tone: inputs.emailTone,
        purchase_details: inputs.purchaseDetails,
        access_instructions: inputs.accessInstructions,
        next_steps: inputs.nextSteps,
        support_contact: inputs.supportContact,
        include_onboarding: inputs.includeOnboarding === 'yes',
        additional_resources: inputs.additionalResources
      };

      const response = await aiToolsService.generatePostPurchaseEmail(apiData);
      setResult(response);
      
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Post Purchase Email',
          toolId: 'post-purchase-email',
          outputResult: response,
          prompt: JSON.stringify(apiData)
        });
        console.log('✅ Post-purchase email saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
      setActiveTab('result');
    } catch (err: any) {
      console.error('Error generating post-purchase email:', err);
      setError(err.message || 'Failed to generate post-purchase email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const renderTemplatesTab = () => {
    return (
      <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
        {emailTypes.map((emailType, index) => (
          <div key={index} className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
                <i className={`${emailType.icon} text-blue-600`}></i>
              </div>
              <div>
                <h4 className="font-medium text-blue-900">{emailType.name}</h4>
                <p className="text-xs text-blue-600">{emailType.description}</p>
              </div>
            </div>
            <button 
              onClick={() => {
                setInputs(prev => ({...prev, productType: emailType.name.toLowerCase().replace(' ', '_')}));
                setActiveTab('generate');
              }}
              className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1"
            >
              Create
            </button>
          </div>
        ))}
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
              <i className="fas fa-envelope-open-text text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Post-Purchase Email</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Send customers purchase details and next steps after buying</p>
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
                <button 
                  onClick={() => setActiveTab('result')}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${activeTab === 'result' ? 'text-blue-700 bg-blue-50/70' : 'text-blue-500 hover:text-blue-600'}`}
                >
                  <span className="flex items-center gap-2">
                    <i className="fas fa-check-circle text-xs"></i>
                    Result
                  </span>
                  {activeTab === 'result' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>}
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
                    <h4 className="text-base font-medium text-blue-900 mb-3">Product & Purchase Information</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="productName">Product/Service Name</label>
                          <input 
                            id="productName" 
                            name="productName"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all" 
                            placeholder="Enter the product or service name"
                            type="text"
                            value={inputs.productName}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="productType">Product Type</label>
                          <select
                            id="productType"
                            name="productType"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                            value={inputs.productType}
                            onChange={handleInputChange}
                          >
                            <option value="">Select product type</option>
                            <option value="digital">Digital Product</option>
                            <option value="physical">Physical Product</option>
                            <option value="service">Service</option>
                            <option value="course">Online Course</option>
                            <option value="subscription">Subscription</option>
                            <option value="software">Software/App</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="customerName">Customer Name (optional)</label>
                          <input 
                            id="customerName" 
                            name="customerName"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all" 
                            placeholder="Customer's first name"
                            type="text"
                            value={inputs.customerName}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="emailTone">Email Tone</label>
                          <select
                            id="emailTone"
                            name="emailTone"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                            value={inputs.emailTone}
                            onChange={handleInputChange}
                          >
                            <option value="professional">Professional</option>
                            <option value="friendly">Friendly</option>
                            <option value="casual">Casual</option>
                            <option value="enthusiastic">Enthusiastic</option>
                            <option value="grateful">Grateful</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Purchase Details & Access</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="purchaseDetails">Purchase Details</label>
                        <textarea 
                          id="purchaseDetails" 
                          name="purchaseDetails"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Briefly describe what the customer purchased, pricing, order details, etc."
                          value={inputs.purchaseDetails}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="accessInstructions">Access Instructions</label>
                        <textarea 
                          id="accessInstructions" 
                          name="accessInstructions"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="How can the customer access their purchase? Include login details, download links, shipping info, etc."
                          value={inputs.accessInstructions}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="nextSteps">Next Steps</label>
                        <textarea 
                          id="nextSteps" 
                          name="nextSteps"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="What should the customer do next? Getting started guide, onboarding steps, etc."
                          value={inputs.nextSteps}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Support & Additional Information</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="supportContact">Support Contact Information</label>
                          <textarea 
                            id="supportContact" 
                            name="supportContact"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                            placeholder="How can customers reach you for support? Email, phone, help desk, etc."
                            value={inputs.supportContact}
                            onChange={handleInputChange}
                          ></textarea>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="includeOnboarding">Include Onboarding?</label>
                          <select
                            id="includeOnboarding"
                            name="includeOnboarding"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                            value={inputs.includeOnboarding}
                            onChange={handleInputChange}
                          >
                            <option value="">Select option</option>
                            <option value="yes">Yes, include onboarding steps</option>
                            <option value="no">No, just purchase confirmation</option>
                            <option value="separate">Send separate onboarding email</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="additionalResources">Additional Resources (optional)</label>
                        <textarea 
                          id="additionalResources" 
                          name="additionalResources"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Any additional resources, links, or information to include in the email..."
                          value={inputs.additionalResources}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && renderTemplatesTab()}
              
              {activeTab === 'history' && (
                <div className="py-4">
                  <History toolName="Post Purchase Email" />
                </div>
              )}
              
              {activeTab === 'result' && (
                <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
                  {isLoading && (
                    <div className="flex items-center justify-center py-8">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="text-blue-600">Generating post-purchase email...</span>
                      </div>
                    </div>
                  )}
                  
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-exclamation-circle text-red-500"></i>
                        <span className="text-red-700 font-medium">Error</span>
                      </div>
                      <p className="text-red-600 mt-1">{error}</p>
                    </div>
                  )}
                  
                  {result && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-blue-900">Generated Post-Purchase Email</h3>
                        <button 
                          onClick={() => setActiveTab('generate')}
                          className="px-3 py-1.5 text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all flex items-center gap-1 border border-blue-100"
                        >
                          <i className="fas fa-plus text-xs"></i> Generate New
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-white border border-blue-200 rounded-lg shadow-sm">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-medium text-blue-900">Email Subject</h4>
                            <button 
                              onClick={() => copyToClipboard(result.email_subject)}
                              className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-all"
                            >
                              <i className="fas fa-copy mr-1"></i>Copy
                            </button>
                          </div>
                          <div className="p-3 bg-blue-50 rounded border border-blue-100">
                            <p className="text-sm text-blue-900">{result.email_subject}</p>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white border border-blue-200 rounded-lg shadow-sm">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-medium text-blue-900">Email Body</h4>
                            <button 
                              onClick={() => copyToClipboard(result.email_body)}
                              className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-all"
                            >
                              <i className="fas fa-copy mr-1"></i>Copy
                            </button>
                          </div>
                          <div className="p-3 bg-blue-50 rounded border border-blue-100">
                            <p className="text-sm text-blue-900 whitespace-pre-wrap">{result.email_body}</p>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white border border-blue-200 rounded-lg shadow-sm">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-medium text-blue-900">Complete Email</h4>
                            <button 
                              onClick={() => copyToClipboard(`Subject: ${result.email_subject}\n\n${result.email_body}`)}
                              className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-all"
                            >
                              <i className="fas fa-copy mr-1"></i>Copy All
                            </button>
                          </div>
                          <div className="p-3 bg-blue-50 rounded border border-blue-100">
                            <div className="text-sm text-blue-900">
                              <p className="font-semibold mb-2">Subject: {result.email_subject}</p>
                              <div className="whitespace-pre-wrap">{result.email_body}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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
                  onClick={handleSubmit}
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
                      <span>Generate Email</span>
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
