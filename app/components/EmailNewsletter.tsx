'use client';

import React, { useState } from 'react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface EmailNewsletterProps {
  onBackClick: () => void;
}

export default function EmailNewsletter({ onBackClick }: EmailNewsletterProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputs, setInputs] = useState({
    newsletterName: '',
    companyName: '',
    industry: '',
    targetAudience: '',
    newsletterGoal: '',
    contentType: '',
    frequency: '',
    tone: 'professional',
    mainTopics: '',
    callToAction: '',
    brandColors: '',
    additionalSections: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateNewsletter = async () => {
    setIsGenerating(true);
    setError(null);
    setGeneratedContent(null);

    try {
      // Validate required fields
      const requiredFields = [
        { key: 'newsletterName', label: 'Newsletter Name' },
        { key: 'companyName', label: 'Company/Brand Name' },
        { key: 'industry', label: 'Industry' },
        { key: 'frequency', label: 'Newsletter Frequency' },
        { key: 'targetAudience', label: 'Target Audience' },
        { key: 'newsletterGoal', label: 'Newsletter Goal' },
        { key: 'contentType', label: 'Content Type Focus' },
        { key: 'mainTopics', label: 'Main Topics' },
        { key: 'callToAction', label: 'Primary Call to Action' }
      ];

      const missingFields = requiredFields.filter(field => !inputs[field.key as keyof typeof inputs]);
      if (missingFields.length > 0) {
        setError(`Please fill in the following required fields: ${missingFields.map(f => f.label).join(', ')}`);
        return;
      }

      // Map the form inputs to the API expected format (matching the curl example)
      const newsletterData = {
        newsletter_name: inputs.newsletterName,
        company_brand_name: inputs.companyName,
        industry: inputs.industry.charAt(0).toUpperCase() + inputs.industry.slice(1), // Capitalize first letter
        newsletter_frequency: inputs.frequency.charAt(0).toUpperCase() + inputs.frequency.slice(1), // Capitalize first letter
        target_audience: inputs.targetAudience,
        newsletter_goal: inputs.newsletterGoal === 'inform' ? 'Educate' : 
                        inputs.newsletterGoal === 'promote' ? 'Promote' : 
                        inputs.newsletterGoal === 'engage' ? 'Engage' : 
                        inputs.newsletterGoal === 'nurture' ? 'Nurture' : 
                        inputs.newsletterGoal === 'retain' ? 'Retain' : 'Educate',
        content_type_focus: inputs.contentType,
        main_topics: inputs.mainTopics,
        tone_of_voice: inputs.tone.charAt(0).toUpperCase() + inputs.tone.slice(1), // Capitalize first letter
        brand_colors: inputs.brandColors || "",
        primary_call_to_action: inputs.callToAction,
        additional_sections: inputs.additionalSections || ""
      };

      console.log('Newsletter data being sent:', newsletterData);
      const response = await aiToolsService.generateEmailNewsletter(newsletterData);
      setGeneratedContent(response);
      
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Email Newsletter',
          toolId: 'email-newsletter',
          outputResult: response,
          prompt: JSON.stringify(newsletterData)
        });
        console.log('✅ Email newsletter saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
    } catch (err: any) {
      console.error('Error generating newsletter:', err);
      setError(err.message || 'Failed to generate newsletter. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const newsletterTemplates = [
    { name: "Weekly Business Update", icon: "fas fa-briefcase", description: "Professional weekly newsletter for business updates and insights." },
    { name: "Product Updates & Features", icon: "fas fa-rocket", description: "Highlight new features, updates, and product announcements." },
    { name: "Industry News & Trends", icon: "fas fa-chart-line", description: "Curated industry news and trending topics for your audience." },
    { name: "Educational Content", icon: "fas fa-graduation-cap", description: "Educational newsletter with tips, tutorials, and how-to guides." },
    { name: "Company Culture & Team", icon: "fas fa-users", description: "Internal newsletter showcasing company culture and team highlights." },
    { name: "Customer Success Stories", icon: "fas fa-star", description: "Feature customer testimonials, case studies, and success stories." }
  ];

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
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Email Newsletter</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create engaging newsletters to keep your audience informed</p>
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
                    <h4 className="text-base font-medium text-blue-900 mb-3">Newsletter & Brand Information</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="newsletterName">Newsletter Name</label>
                          <input
                            id="newsletterName"
                            name="newsletterName"
                            type="text"
                            value={inputs.newsletterName}
                            onChange={handleInputChange}
                            placeholder="Enter your newsletter name"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="companyName">Company/Brand Name</label>
                          <input
                            id="companyName"
                            name="companyName"
                            type="text"
                            value={inputs.companyName}
                            onChange={handleInputChange}
                            placeholder="Your company or brand name"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                      </div>
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
                            <option value="marketing">Marketing</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="frequency">Newsletter Frequency</label>
                          <select
                            id="frequency"
                            name="frequency"
                            value={inputs.frequency}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select frequency</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="biweekly">Bi-weekly</option>
                            <option value="monthly">Monthly</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Content Strategy</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="targetAudience">Target Audience</label>
                        <textarea 
                          id="targetAudience"
                          name="targetAudience"
                          value={inputs.targetAudience}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Describe your newsletter subscribers and target audience..."
                        ></textarea>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="newsletterGoal">Newsletter Goal</label>
                          <select
                            id="newsletterGoal"
                            name="newsletterGoal"
                            value={inputs.newsletterGoal}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select primary goal</option>
                            <option value="inform">Inform & educate</option>
                            <option value="promote">Promote products/services</option>
                            <option value="engage">Build engagement</option>
                            <option value="nurture">Nurture leads</option>
                            <option value="retain">Customer retention</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="contentType">Content Type Focus</label>
                          <select
                            id="contentType"
                            name="contentType"
                            value={inputs.contentType}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select content focus</option>
                            <option value="news">News & updates</option>
                            <option value="educational">Educational content</option>
                            <option value="promotional">Promotional offers</option>
                            <option value="curated">Curated content</option>
                            <option value="mixed">Mixed content</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="mainTopics">Main Topics to Cover</label>
                        <textarea 
                          id="mainTopics"
                          name="mainTopics"
                          value={inputs.mainTopics}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="List the main topics, themes, or content areas you want to include..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Design & Call to Action</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="tone">Tone of Voice</label>
                          <select
                            id="tone"
                            name="tone"
                            value={inputs.tone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="professional">Professional</option>
                            <option value="friendly">Friendly</option>
                            <option value="casual">Casual</option>
                            <option value="authoritative">Authoritative</option>
                            <option value="conversational">Conversational</option>
                            <option value="inspiring">Inspiring</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="brandColors">Brand Colors (optional)</label>
                          <input
                            id="brandColors"
                            name="brandColors"
                            type="text"
                            value={inputs.brandColors}
                            onChange={handleInputChange}
                            placeholder="e.g., #3B82F6, blue and white"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="callToAction">Primary Call to Action</label>
                        <input
                          id="callToAction"
                          name="callToAction"
                          type="text"
                          value={inputs.callToAction}
                          onChange={handleInputChange}
                          placeholder="What action should readers take? (e.g., visit website, try product)"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="additionalSections">Additional Sections (optional)</label>
                        <textarea 
                          id="additionalSections"
                          name="additionalSections"
                          value={inputs.additionalSections}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="Any specific sections you want to include? (e.g., team spotlight, customer features, upcoming events)"
                        ></textarea>
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
                      Newsletter Generated Successfully!
                    </h4>
                    <button 
                      onClick={() => setGeneratedContent(null)}
                      className="text-green-600 hover:text-green-800 transition-colors"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Subject Line */}
                    {generatedContent.subject_line && (
                      <div className="bg-white p-4 rounded-lg border border-green-200">
                        <h5 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                          <i className="fas fa-envelope text-green-600"></i>
                          Subject Line
                        </h5>
                        <div className="p-3 bg-green-50 rounded border border-green-200 text-green-800 font-medium">
                          {generatedContent.subject_line}
                        </div>
                      </div>
                    )}

                    {/* Preheader */}
                    {generatedContent.preheader && (
                      <div className="bg-white p-4 rounded-lg border border-green-200">
                        <h5 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                          <i className="fas fa-eye text-green-600"></i>
                          Preheader Text
                        </h5>
                        <div className="p-3 bg-green-50 rounded border border-green-200 text-green-800">
                          {generatedContent.preheader}
                        </div>
                      </div>
                    )}

                    {/* Header */}
                    {generatedContent.header && (
                      <div className="bg-white p-4 rounded-lg border border-green-200">
                        <h5 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                          <i className="fas fa-heading text-green-600"></i>
                          Email Header
                        </h5>
                        <div className="p-3 bg-green-50 rounded border border-green-200 text-green-800">
                          {generatedContent.header}
                        </div>
                      </div>
                    )}

                    {/* Newsletter Sections */}
                    {generatedContent.sections && generatedContent.sections.length > 0 && (
                      <div className="bg-white p-4 rounded-lg border border-green-200">
                        <h5 className="font-medium text-green-900 mb-3 flex items-center gap-2">
                          <i className="fas fa-list text-green-600"></i>
                          Newsletter Sections
                        </h5>
                        <div className="space-y-3">
                          {generatedContent.sections.map((section: any, index: number) => (
                            <div key={index} className="border border-green-200 rounded-lg overflow-hidden">
                              <div className="bg-green-100 px-3 py-2 border-b border-green-200">
                                <h6 className="font-medium text-green-900 text-sm">{section.title}</h6>
                              </div>
                              <div className="p-3 bg-white">
                                <p className="text-green-800 text-sm leading-relaxed">{section.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Call to Action */}
                    {generatedContent.call_to_action && (
                      <div className="bg-white p-4 rounded-lg border border-green-200">
                        <h5 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                          <i className="fas fa-hand-pointer text-green-600"></i>
                          Call to Action
                        </h5>
                        <div className="p-3 bg-green-50 rounded border border-green-200 text-green-800">
                          {generatedContent.call_to_action}
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    {generatedContent.footer && (
                      <div className="bg-white p-4 rounded-lg border border-green-200">
                        <h5 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                          <i className="fas fa-ellipsis-h text-green-600"></i>
                          Email Footer
                        </h5>
                        <div className="p-3 bg-green-50 rounded border border-green-200 text-green-800 text-sm">
                          {generatedContent.footer}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && (
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {newsletterTemplates.map((template, index) => (
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
                  <History toolName="Email Newsletter" />
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
                  onClick={handleGenerateNewsletter}
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
                      <span>Generate Newsletter</span>
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
