'use client'

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface ContactResult {
  contact_page_title: string;
  contact_intro: string;
  form_fields: string[];
  response_time_note: string;
  privacy_disclaimer: string;
  call_to_action: string;
  notes: string;
}

export default function WebsiteContact({ onBackClick }: { onBackClick: () => void }) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [inputs, setInputs] = useState({
    contactType: '',
    businessName: '',
    contactMethods: '',
    responseTime: '',
    contactObjective: '',
    userExperience: '',
    integrations: '',
    formFields: '',
    automationNeeds: '',
    followUpProcess: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ContactResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateContact = async () => {
    if (!inputs.contactType || !inputs.responseTime || !inputs.businessName || !inputs.contactObjective || !inputs.formFields) {
      alert('Please fill in all required fields: Contact Type, Response Time, Business Name, Contact Objective, and Required Form Fields');
      return;
    }

    setIsLoading(true);
    setResult(null);
    setCopied(false);

    try {
      const requestData = {
        contact_type: inputs.contactType,
        expected_response_time: inputs.responseTime,
        business_name: inputs.businessName,
        contact_objective: inputs.contactObjective,
        required_form_fields: inputs.formFields,
        contact_methods: inputs.contactMethods,
        user_experience: inputs.userExperience,
        integrations: inputs.integrations,
        automation_needs: inputs.automationNeeds,
        follow_up_process: inputs.followUpProcess,
      };

      const response = await aiToolsService.generateWebsiteContact(requestData);
      setResult(response);
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Website Contact',
          toolId: 'website-contact',
          outputResult: response,
          prompt: JSON.stringify(requestData)
        });
        console.log('✅ Website contact saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
    } catch (error) {
      console.error('Error generating contact page:', error);
      alert('Error generating contact page. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const renderTemplatesTab = () => {
    return (
      <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-envelope text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Basic Contact Form</h4>
              <p className="text-xs text-blue-600">Simple contact form with essential fields for general inquiries.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-calendar text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Appointment Booking</h4>
              <p className="text-xs text-blue-600">Contact form with appointment scheduling and calendar integration.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-handshake text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Business Inquiry</h4>
              <p className="text-xs text-blue-600">Professional contact form for B2B partnerships and collaborations.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-headset text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Customer Support</h4>
              <p className="text-xs text-blue-600">Support ticket form with priority levels and category selection.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-quote-left text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Quote Request</h4>
              <p className="text-xs text-blue-600">Detailed form for service quotes and project estimates.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-comments text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Feedback Form</h4>
              <p className="text-xs text-blue-600">Customer feedback and testimonial collection form.</p>
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
        <p className="text-sm text-blue-700 max-w-md">View your previously generated contact pages.</p>
      </div>
    );
  };

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Header */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-phone text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Website Contact</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create effective contact forms and pages</p>
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
                    <h4 className="text-base font-medium text-blue-900 mb-3">Contact Information</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="contactType">Contact Type</label>
                          <select
                            id="contactType"
                            name="contactType"
                            value={inputs.contactType}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select contact type</option>
                            <option value="general">General Inquiry</option>
                            <option value="support">Customer Support</option>
                            <option value="sales">Sales Contact</option>
                            <option value="appointment">Appointment Booking</option>
                            <option value="quote">Quote Request</option>
                            <option value="feedback">Feedback Form</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="responseTime">Expected Response Time</label>
                          <select
                            id="responseTime"
                            name="responseTime"
                            value={inputs.responseTime}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select response time</option>
                            <option value="immediate">Immediate (1-2 hours)</option>
                            <option value="same-day">Same Day (24 hours)</option>
                            <option value="next-day">Next Business Day</option>
                            <option value="2-3-days">2-3 Business Days</option>
                            <option value="weekly">Within a Week</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="businessName">Business Name</label>
                        <input 
                          type="text"
                          id="businessName"
                          name="businessName"
                          value={inputs.businessName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all" 
                          placeholder="Your business or organization name"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Contact Configuration</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="contactObjective">Contact Objective</label>
                        <textarea 
                          id="contactObjective"
                          name="contactObjective"
                          value={inputs.contactObjective}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="What do you want to achieve with this contact form?"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="formFields">Required Form Fields</label>
                        <textarea 
                          id="formFields"
                          name="formFields"
                          value={inputs.formFields}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="List the specific fields you need (e.g., name, email, phone, company, message)"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'templates' && renderTemplatesTab()}
              {activeTab === 'history' && (
                <div className="py-4">
                  <History toolName="Website Contact" />
                </div>
              )}
            </div>
            
            {/* Results Section */}
            {result && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold text-green-900 flex items-center gap-2">
                    <i className="fas fa-check-circle text-green-600"></i>
                    Contact Page Generated
                  </h4>
                  <button
                    onClick={() => handleCopy(JSON.stringify(result, null, 2))}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition-all"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy All
                      </>
                    )}
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <h5 className="font-medium text-green-900 mb-2">Page Title</h5>
                    <p className="text-green-800">{result.contact_page_title}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <h5 className="font-medium text-green-900 mb-2">Contact Introduction</h5>
                    <p className="text-green-800">{result.contact_intro}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <h5 className="font-medium text-green-900 mb-2">Form Fields</h5>
                    <div className="flex flex-wrap gap-2">
                      {result.form_fields.map((field: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <h5 className="font-medium text-green-900 mb-2">Response Time Note</h5>
                    <p className="text-green-800">{result.response_time_note}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <h5 className="font-medium text-green-900 mb-2">Privacy Disclaimer</h5>
                    <p className="text-green-800">{result.privacy_disclaimer}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <h5 className="font-medium text-green-900 mb-2">Call to Action</h5>
                    <p className="text-green-800">{result.call_to_action}</p>
                  </div>
                  
                  {result.notes && (
                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <h5 className="font-medium text-green-900 mb-2">Notes</h5>
                      <p className="text-green-800">{result.notes}</p>
                    </div>
                  )}
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
                  className={`px-5 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleGenerateContact}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Contact</span>
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
