'use client';

import React, { useState } from 'react';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface OptInThankYouPageProps {
  onBackClick: () => void;
}

export default function OptInThankYouPage({ onBackClick }: OptInThankYouPageProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history' | 'result'>('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedPage, setGeneratedPage] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    leadMagnetTitle: '',
    leadMagnetType: '',
    deliveryMethod: '',
    accessInstructions: '',
    brandName: '',
    nextSteps: '',
    socialMediaLinks: '',
    additionalResources: '',
    tone: 'professional',
    pageStyle: 'standard'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const requiredFields = [
      'leadMagnetTitle', 'leadMagnetType', 'deliveryMethod', 'accessInstructions',
      'brandName', 'nextSteps', 'tone', 'pageStyle'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedPage(null);
    
    try {
      // Dynamic import for ES modules
      const { aiToolsService } = await import('../../services/aiTools.js');
      
      // Map UI values to API format
      const requestData = {
        lead_magnet_title: formData.leadMagnetTitle,
        lead_magnet_type: formData.leadMagnetType,
        delivery_method: formData.deliveryMethod,
        brand_name: formData.brandName,
        how_to_access_instructions: formData.accessInstructions,
        next_steps: formData.nextSteps,
        tone_of_voice: formData.tone,
        page_style: formData.pageStyle,
        social_media_links: formData.socialMediaLinks || '',
        additional_resources: formData.additionalResources || ''
      };

      console.log('Sending opt-in thank you page request:', requestData);
      const response = await aiToolsService.generateOptInThankYouPage(requestData);
      console.log('Opt-in thank you page response:', response);
      setGeneratedPage(response);
      
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Opt In Thank You Page',
          toolId: 'opt-in-thank-you-page',
          outputResult: response,
          prompt: JSON.stringify(requestData)
        });
        console.log('✅ Opt-in thank you page saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
      setActiveTab('result');
      
    } catch (error: any) {
      console.error('Error generating opt-in thank you page:', error);
      
      // Extract meaningful error message to show to user
      let errorMessage = 'Failed to generate thank you page. Please try again.';
      
      if (error.response?.data?.detail) {
        errorMessage = `API Error: ${error.response.data.detail}`;
      } else if (error.message && error.message.includes('Missing required fields')) {
        errorMessage = error.message;
      } else if (error.response?.status === 400) {
        errorMessage = 'The request was invalid. Please check all required fields are filled correctly.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication error. Please try logging out and back in.';
      }
      
      console.error('Error details:', error.response?.data || error.message || 'Unknown error');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const thankYouPageTemplates = [
    { name: "PDF Download", icon: "fas fa-file-pdf", description: "Thank you page for PDF lead magnets and downloads." },
    { name: "Email Course", icon: "fas fa-graduation-cap", description: "Thank you page for email course signups." },
    { name: "Webinar Registration", icon: "fas fa-video", description: "Confirmation page for webinar registrations." },
    { name: "Checklist Download", icon: "fas fa-check-square", description: "Thank you page for checklist and template downloads." },
    { name: "Resource Library", icon: "fas fa-folder-open", description: "Access page for exclusive resource libraries." },
    { name: "Community Access", icon: "fas fa-users", description: "Welcome page for community and group access." }
  ];

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Glassmorphic Header with blue gradient */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-hand-sparkles text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Opt-In Thank You Page</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create thank you pages that confirm and guide new subscribers</p>
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
                    <i className="fas fa-hand-sparkles text-xs"></i>
                    Results
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
                  {/* Lead Magnet Information */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Lead Magnet Information</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="leadMagnetTitle">Lead Magnet Title</label>
                          <input
                            id="leadMagnetTitle"
                            name="leadMagnetTitle"
                            type="text"
                            value={formData.leadMagnetTitle}
                            onChange={handleInputChange}
                            placeholder="Enter your lead magnet title"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="leadMagnetType">Lead Magnet Type</label>
                          <select
                            id="leadMagnetType"
                            name="leadMagnetType"
                            value={formData.leadMagnetType}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select type</option>
                            <option value="pdf">PDF Download</option>
                            <option value="email-course">Email Course</option>
                            <option value="checklist">Checklist</option>
                            <option value="template">Template</option>
                            <option value="webinar">Webinar</option>
                            <option value="video-series">Video Series</option>
                            <option value="resource-library">Resource Library</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="deliveryMethod">Delivery Method</label>
                          <select
                            id="deliveryMethod"
                            name="deliveryMethod"
                            value={formData.deliveryMethod}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">How is it delivered?</option>
                            <option value="immediate-download">Immediate Download</option>
                            <option value="email-delivery">Email Delivery</option>
                            <option value="member-portal">Member Portal Access</option>
                            <option value="manual-delivery">Manual Delivery</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="brandName">Brand Name</label>
                          <input
                            id="brandName"
                            name="brandName"
                            type="text"
                            value={formData.brandName}
                            onChange={handleInputChange}
                            placeholder="Your brand/company name"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Access & Instructions */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Access Instructions</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="accessInstructions">How to Access Instructions</label>
                        <textarea 
                          id="accessInstructions"
                          name="accessInstructions"
                          value={formData.accessInstructions}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Explain how subscribers can access their lead magnet..."
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="nextSteps">Next Steps</label>
                        <textarea 
                          id="nextSteps"
                          name="nextSteps"
                          value={formData.nextSteps}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="What should they do next? Check email, join community, etc."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Additional Content */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Additional Content</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="tone">Tone of Voice</label>
                          <select
                            id="tone"
                            name="tone"
                            value={formData.tone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="professional">Professional</option>
                            <option value="friendly">Friendly</option>
                            <option value="excited">Excited</option>
                            <option value="warm">Warm</option>
                            <option value="casual">Casual</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="pageStyle">Page Style</label>
                          <select
                            id="pageStyle"
                            name="pageStyle"
                            value={formData.pageStyle}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="standard">Standard</option>
                            <option value="minimal">Minimal</option>
                            <option value="detailed">Detailed</option>
                            <option value="social-focused">Social Focused</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="socialMediaLinks">Social Media Links (Optional)</label>
                        <textarea 
                          id="socialMediaLinks"
                          name="socialMediaLinks"
                          value={formData.socialMediaLinks}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="Include social media handles or links to connect..."
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="additionalResources">Additional Resources (Optional)</label>
                        <textarea 
                          id="additionalResources"
                          name="additionalResources"
                          value={formData.additionalResources}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="Mention other helpful resources, blog posts, or tools..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && (
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {thankYouPageTemplates.map((template, index) => (
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
                  <History toolName="Opt In Thank You Page" />
                </div>
              )}
              
              {activeTab === 'result' && (
                <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <i className="fas fa-exclamation-triangle text-red-500"></i>
                        <span className="text-red-700 font-medium">Error</span>
                      </div>
                      <p className="text-red-600 text-sm mt-1">{error}</p>
                    </div>
                  )}
                  
                  {isLoading && (
                    <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                      <p className="text-blue-700 font-medium">Generating thank you page...</p>
                      <p className="text-sm text-blue-600">This may take a few moments</p>
                    </div>
                  )}
                  
                  {generatedPage && !isLoading && (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <i className="fas fa-check-circle text-green-500"></i>
                          <span className="text-green-700 font-medium">Generated Successfully!</span>
                        </div>
                        <p className="text-green-600 text-sm">Here's your thank you page copy:</p>
                      </div>
                      
                      {/* Headline */}
                      <div className="p-4 bg-white border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-blue-900">Headline</h4>
                          <button 
                            onClick={() => navigator.clipboard.writeText(generatedPage.headline)}
                            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
                            title="Copy to clipboard"
                          >
                            <i className="fas fa-copy text-sm"></i>
                          </button>
                        </div>
                        <p className="text-blue-800 text-lg font-semibold">{generatedPage.headline}</p>
                      </div>
                      
                      {/* Instructions */}
                      <div className="p-4 bg-white border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-blue-900">Access Instructions</h4>
                          <button 
                            onClick={() => navigator.clipboard.writeText(generatedPage.instructions)}
                            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
                            title="Copy to clipboard"
                          >
                            <i className="fas fa-copy text-sm"></i>
                          </button>
                        </div>
                        <p className="text-blue-700">{generatedPage.instructions}</p>
                      </div>
                      
                      {/* Next Steps */}
                      <div className="p-4 bg-white border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-blue-900">Next Steps</h4>
                          <button 
                            onClick={() => navigator.clipboard.writeText(generatedPage.next_steps)}
                            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
                            title="Copy to clipboard"
                          >
                            <i className="fas fa-copy text-sm"></i>
                          </button>
                        </div>
                        <p className="text-blue-700">{generatedPage.next_steps}</p>
                      </div>
                      
                      {/* Social Links */}
                      {generatedPage.social_links && (
                        <div className="p-4 bg-white border border-blue-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-blue-900">Social Media Links</h4>
                            <button 
                              onClick={() => navigator.clipboard.writeText(generatedPage.social_links)}
                              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
                              title="Copy to clipboard"
                            >
                              <i className="fas fa-copy text-sm"></i>
                            </button>
                          </div>
                          <p className="text-blue-700">{generatedPage.social_links}</p>
                        </div>
                      )}
                      
                      {/* Additional Resources */}
                      {generatedPage.additional_resources && (
                        <div className="p-4 bg-white border border-blue-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-blue-900">Additional Resources</h4>
                            <button 
                              onClick={() => navigator.clipboard.writeText(generatedPage.additional_resources)}
                              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
                              title="Copy to clipboard"
                            >
                              <i className="fas fa-copy text-sm"></i>
                            </button>
                          </div>
                          <p className="text-blue-700">{generatedPage.additional_resources}</p>
                        </div>
                      )}
                      
                      {/* Full Copy */}
                      <div className="p-4 bg-white border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-blue-900">Complete Thank You Page</h4>
                          <button 
                            onClick={() => navigator.clipboard.writeText(generatedPage.full_copy)}
                            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
                            title="Copy to clipboard"
                          >
                            <i className="fas fa-copy text-sm"></i>
                          </button>
                        </div>
                        <div className="bg-gray-50 p-3 rounded border">
                          <pre className="text-sm text-blue-700 whitespace-pre-wrap font-sans">{generatedPage.full_copy}</pre>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Next Steps</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Review and customize the copy to match your brand voice</li>
                          <li>• Add your own social media links and contact information</li>
                          <li>• Create the thank you page with the generated copy</li>
                          <li>• Test the page to ensure all links work correctly</li>
                        </ul>
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
                  className={`px-5 py-2 text-sm text-white rounded-lg transition-all flex items-center gap-2 shadow-md hover:shadow-lg ${
                    isLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
