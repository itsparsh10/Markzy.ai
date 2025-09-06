'use client';

import React, { useState } from 'react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface OptInDeliveryEmailProps {
  onBackClick: () => void;
}

export default function OptInDeliveryEmail({ onBackClick }: OptInDeliveryEmailProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  
  // State for form inputs
  const [formData, setFormData] = useState({
    leadMagnetTitle: '',
    leadMagnetType: '',
    deliveryMethod: '',
    brandName: '',
    targetAudience: '',
    valueProposition: '',
    nextSteps: '',
    toneStyle: 'friendly',
    includeWelcome: true,
    includeTips: true,
    additionalResources: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);

  // Email template types with appropriate icons
  const emailTypes = [
    { name: "PDF Delivery", icon: "fas fa-file-pdf", description: "Perfect for delivering PDF guides, checklists, and reports." },
    { name: "Video Course Access", icon: "fas fa-play-circle", description: "Send access details for video training series or courses." },
    { name: "Checklist Delivery", icon: "fas fa-tasks", description: "Deliver actionable checklists and step-by-step guides." },
    { name: "Template Package", icon: "fas fa-folder", description: "Send template collections and design resources." },
    { name: "Toolkit Access", icon: "fas fa-toolbox", description: "Provide access to comprehensive toolkits and resources." },
    { name: "Webinar Replay", icon: "fas fa-video", description: "Deliver recorded webinar content and materials." }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      // Map form inputs to API request format
      const requestData = {
        lead_magnet_title: formData.leadMagnetTitle,
        lead_magnet_type: formData.leadMagnetType,
        delivery_method: formData.deliveryMethod,
        brand_name: formData.brandName,
        target_audience: formData.targetAudience,
        tone_style: formData.toneStyle,
        value_proposition: formData.valueProposition,
        next_steps: formData.nextSteps,
        include_welcome_message: formData.includeWelcome,
        include_usage_tips: formData.includeTips,
        additional_resources: formData.additionalResources
      };

      const response = await aiToolsService.generateOptInDeliveryEmail(requestData);
      setResult(response);
      
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Opt In Delivery Email',
          toolId: 'opt-in-delivery-email',
          outputResult: response,
          prompt: JSON.stringify(requestData)
        });
        console.log('✅ Opt-in delivery email saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
    } catch (err: any) {
      console.error('Error generating opt-in delivery email:', err);
      setError(err.message || 'Failed to generate opt-in delivery email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Glassmorphic Header with blue gradient */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-paper-plane text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Opt-In Delivery Email</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create delivery emails for your lead magnets and freebies</p>
            </div>
            <div className="flex items-center gap-3 z-10">
              <span className="text-xs bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/30 flex items-center font-semibold text-white/90">
                <i className="fas fa-clock mr-1"></i> 3 min
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
                  {/* Input Fields */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Lead Magnet Information</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="lead-magnet-title">Lead Magnet Title</label>
                        <div className="relative group">
                          <input 
                            id="lead-magnet-title" 
                            name="leadMagnetTitle"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all" 
                            placeholder="Enter the name of your lead magnet"
                            type="text"
                            value={formData.leadMagnetTitle}
                            onChange={handleInputChange}
                          />
                          <div className="absolute top-1/2 right-3 transform -translate-y-1/2 text-blue-300 opacity-0 group-focus-within:opacity-100 transition-opacity">
                            <i className="fas fa-gift text-xs"></i>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="lead-magnet-type">Lead Magnet Type</label>
                          <div className="relative group">
                            <select
                              id="lead-magnet-type"
                              name="leadMagnetType"
                              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                              value={formData.leadMagnetType}
                              onChange={handleInputChange}
                            >
                              <option value="">Select type</option>
                              <option value="pdf-guide">PDF Guide</option>
                              <option value="checklist">Checklist</option>
                              <option value="video-course">Video Course</option>
                              <option value="template">Template</option>
                              <option value="toolkit">Toolkit</option>
                              <option value="webinar">Webinar Replay</option>
                              <option value="ebook">eBook</option>
                            </select>
                            <div className="absolute top-1/2 right-3 transform -translate-y-1/2 text-blue-300 pointer-events-none">
                              <i className="fas fa-chevron-down text-xs"></i>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="delivery-method">Delivery Method</label>
                          <div className="relative group">
                            <select
                              id="delivery-method"
                              name="deliveryMethod"
                              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                              value={formData.deliveryMethod}
                              onChange={handleInputChange}
                            >
                              <option value="">How will it be delivered?</option>
                              <option value="direct-download">Direct Download Link</option>
                              <option value="email-attachment">Email Attachment</option>
                              <option value="member-portal">Member Portal Access</option>
                              <option value="cloud-storage">Cloud Storage Link</option>
                            </select>
                            <div className="absolute top-1/2 right-3 transform -translate-y-1/2 text-blue-300 pointer-events-none">
                              <i className="fas fa-chevron-down text-xs"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Brand & Audience Details</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="brand-name">Brand Name</label>
                          <div className="relative group">
                            <input 
                              id="brand-name" 
                              name="brandName"
                              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all" 
                              placeholder="Your business/brand name"
                              type="text"
                              value={formData.brandName}
                              onChange={handleInputChange}
                            />
                            <div className="absolute top-1/2 right-3 transform -translate-y-1/2 text-blue-300 opacity-0 group-focus-within:opacity-100 transition-opacity">
                              <i className="fas fa-building text-xs"></i>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="tone-style">Tone & Style</label>
                          <div className="relative group">
                            <select
                              id="tone-style"
                              name="toneStyle"
                              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                              value={formData.toneStyle}
                              onChange={handleInputChange}
                            >
                              <option value="friendly">Friendly</option>
                              <option value="professional">Professional</option>
                              <option value="casual">Casual</option>
                              <option value="enthusiastic">Enthusiastic</option>
                              <option value="supportive">Supportive</option>
                            </select>
                            <div className="absolute top-1/2 right-3 transform -translate-y-1/2 text-blue-300 pointer-events-none">
                              <i className="fas fa-chevron-down text-xs"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="target-audience">Target Audience</label>
                        <div className="relative group">
                          <textarea 
                            id="target-audience" 
                            name="targetAudience"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all resize-none h-16" 
                            placeholder="Describe who this lead magnet is for..."
                            value={formData.targetAudience}
                            onChange={handleInputChange}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Email Content Details</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="value-proposition">Value Proposition</label>
                        <div className="relative group">
                          <textarea 
                            id="value-proposition" 
                            name="valueProposition"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all resize-none h-16" 
                            placeholder="What value will they get from this lead magnet?"
                            value={formData.valueProposition}
                            onChange={handleInputChange}
                          ></textarea>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="next-steps">Next Steps</label>
                        <div className="relative group">
                          <textarea 
                            id="next-steps" 
                            name="nextSteps"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all resize-none h-16" 
                            placeholder="What should they do after receiving the lead magnet?"
                            value={formData.nextSteps}
                            onChange={handleInputChange}
                          ></textarea>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="include-welcome"
                            name="includeWelcome"
                            checked={formData.includeWelcome}
                            onChange={handleInputChange}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                          />
                          <label htmlFor="include-welcome" className="text-sm text-blue-900">
                            Include welcome message
                          </label>
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="include-tips"
                            name="includeTips"
                            checked={formData.includeTips}
                            onChange={handleInputChange}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                          />
                          <label htmlFor="include-tips" className="text-sm text-blue-900">
                            Include usage tips
                          </label>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="additional-resources">Additional Resources</label>
                        <div className="relative group">
                          <textarea 
                            id="additional-resources" 
                            name="additionalResources"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all resize-none h-16" 
                            placeholder="Any additional resources or links to include..."
                            value={formData.additionalResources}
                            onChange={handleInputChange}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && (
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {emailTypes.map((emailType, index) => (
                    <div key={index} className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group">
                      <div className="flex items-center justify-between">
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
                            setFormData(prev => ({...prev, leadMagnetType: emailType.name.toLowerCase().replace(' ', '-')}));
                            setActiveTab('generate');
                          }}
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
                  <History toolName="Opt In Delivery Email" />
                </div>
              )}
            </div>
            
            {/* Results Display */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                <div className="flex items-center gap-2 text-red-700">
                  <i className="fas fa-exclamation-circle"></i>
                  <span className="font-medium">Error</span>
                </div>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            )}
            
            {result && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-green-700">
                    <i className="fas fa-check-circle"></i>
                    <span className="font-medium">Generated Delivery Email</span>
                  </div>
                  <button
                    onClick={() => {
                      const textToCopy = `Subject: ${result.email_subject}\n\nBody:\n${result.email_body}`;
                      navigator.clipboard.writeText(textToCopy);
                    }}
                    className="px-3 py-1 text-xs text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition-all flex items-center gap-1"
                  >
                    <i className="fas fa-copy"></i>
                    Copy All
                  </button>
                </div>
                
                {result.email_subject && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-green-800 mb-2">Email Subject</h4>
                    <div className="p-3 bg-white rounded-lg border border-green-200">
                      <p className="text-sm text-green-900">{result.email_subject}</p>
                      <button
                        onClick={() => navigator.clipboard.writeText(result.email_subject)}
                        className="mt-2 px-2 py-1 text-xs text-green-600 hover:text-green-700 transition-all flex items-center gap-1"
                      >
                        <i className="fas fa-copy"></i>
                        Copy
                      </button>
                    </div>
                  </div>
                )}
                
                {result.email_body && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-green-800 mb-2">Email Body</h4>
                    <div className="p-3 bg-white rounded-lg border border-green-200">
                      <p className="text-sm text-green-900 whitespace-pre-wrap">{result.email_body}</p>
                      <button
                        onClick={() => navigator.clipboard.writeText(result.email_body)}
                        className="mt-2 px-2 py-1 text-xs text-green-600 hover:text-green-700 transition-all flex items-center gap-1"
                      >
                        <i className="fas fa-copy"></i>
                        Copy
                      </button>
                    </div>
                  </div>
                )}
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
                  onClick={handleSubmit}
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
