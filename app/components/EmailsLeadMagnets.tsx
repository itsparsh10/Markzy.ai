'use client';

import React, { useState } from 'react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface EmailsLeadMagnetsProps {
  onBackClick: () => void;
}

export default function EmailsLeadMagnets({ onBackClick }: EmailsLeadMagnetsProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [inputs, setInputs] = useState({
    transcriptContent: '',
    transcriptType: '',
    targetAudience: '',
    emailGoal: '',
    leadMagnetType: '',
    contentTheme: '',
    callToAction: '',
    emailSequenceLength: '',
    tone: 'professional'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedContent, setGeneratedContent] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const generateEmailsLeadMagnets = async () => {
    // Validate required fields
    if (!inputs.transcriptContent || !inputs.transcriptType || !inputs.targetAudience || !inputs.contentTheme || !inputs.callToAction || !inputs.leadMagnetType) {
      setError('Please fill in all required fields: Transcript Content, Transcript Type, Target Audience, Content Theme, Call to Action, and Lead Magnet Type');
      return;
    }

    setIsLoading(true);
    setError('');
    setGeneratedContent(null);

    try {
      const requestData = {
        transcript_content: inputs.transcriptContent,
        content_type: 'Both', // Default to both emails and lead magnet
        target_audience: inputs.targetAudience,
        industry_niche: inputs.contentTheme,
        tone_style: inputs.tone.charAt(0).toUpperCase() + inputs.tone.slice(1), // Capitalize first letter
        call_to_action: inputs.callToAction,
        key_takeaways: `Key insights from ${inputs.transcriptType} content about ${inputs.contentTheme}`,
        email_subject_lines: `Email content for ${inputs.transcriptType} about ${inputs.contentTheme}`,
        lead_magnet_type: inputs.leadMagnetType.charAt(0).toUpperCase() + inputs.leadMagnetType.slice(1) // Capitalize first letter
      };

      console.log('🚀 Sending emails lead magnets request:', requestData);
      
      const response = await aiToolsService.generateEmailsLeadMagnets(requestData);
      
      console.log('✅ Emails lead magnets API response:', response);
      setGeneratedContent(response);
      
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Emails Lead Magnets',
          toolId: 'emails-lead-magnets',
          outputResult: response,
          prompt: JSON.stringify(requestData)
        });
        console.log('✅ Emails lead magnets saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
      setActiveTab('generate'); // Stay on generate tab to show results
      
    } catch (error: any) {
      console.error('❌ Emails lead magnets API error:', error);
      setError(error?.message || 'Failed to generate emails and lead magnets');
    } finally {
      setIsLoading(false);
    }
  };

  const emailTemplates = [
    { name: "Webinar Replay Email", icon: "fas fa-video", description: "Transform webinar transcripts into engaging email sequences." },
    { name: "Podcast Email Series", icon: "fas fa-microphone", description: "Create email content from podcast episode transcripts." },
    { name: "Lead Magnet Download", icon: "fas fa-download", description: "Generate lead magnets and delivery emails from content." },
    { name: "Course Content Emails", icon: "fas fa-graduation-cap", description: "Turn educational transcripts into email course content." },
    { name: "Interview Highlights", icon: "fas fa-comments", description: "Extract key insights from interview transcripts for emails." },
    { name: "Content Nurture Sequence", icon: "fas fa-envelope-open-text", description: "Create nurturing email sequences from valuable content." }
  ];

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Glassmorphic Header with blue gradient */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-envelope text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Emails & Lead Magnets</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create emails and lead magnets from transcripts</p>
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
                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <i className="fas fa-exclamation-triangle text-red-600 mr-2"></i>
                        <span className="text-red-800 text-sm font-medium">{error}</span>
                      </div>
                    </div>
                  )}

                  {/* Generated Content */}
                  {generatedContent && (
                    <div className="space-y-4">
                      {/* Emails Section */}
                      {generatedContent.emails && generatedContent.emails.length > 0 && (
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <h4 className="text-base font-medium text-green-900 mb-3 flex items-center">
                            <i className="fas fa-envelope text-green-600 mr-2"></i>
                            Generated Emails ({generatedContent.emails.length})
                          </h4>
                          <div className="space-y-3">
                            {generatedContent.emails.map((email: any, index: number) => (
                              <div key={index} className="bg-white rounded-lg border border-green-200 p-4">
                                <div className="mb-2">
                                  <span className="text-xs font-semibold text-green-700">Subject:</span>
                                  <p className="text-sm font-medium text-gray-900">{email.subject}</p>
                                </div>
                                <div className="mb-2">
                                  <span className="text-xs font-semibold text-green-700">Preview:</span>
                                  <p className="text-sm text-gray-700">{email.preview_text}</p>
                                </div>
                                <div>
                                  <span className="text-xs font-semibold text-green-700">Body:</span>
                                  <div className="text-sm text-gray-800 mt-1 prose prose-sm max-w-none">
                                    <div dangerouslySetInnerHTML={{ __html: email.body }} />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Lead Magnet Section */}
                      {generatedContent.lead_magnet && (
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <h4 className="text-base font-medium text-blue-900 mb-3 flex items-center">
                            <i className="fas fa-download text-blue-600 mr-2"></i>
                            Generated Lead Magnet
                          </h4>
                          <div className="bg-white rounded-lg border border-blue-200 p-4">
                            <div className="mb-2">
                              <span className="text-xs font-semibold text-blue-700">Title:</span>
                              <p className="text-sm font-medium text-gray-900">{generatedContent.lead_magnet.title}</p>
                            </div>
                            <div className="mb-2">
                              <span className="text-xs font-semibold text-blue-700">Description:</span>
                              <p className="text-sm text-gray-700">{generatedContent.lead_magnet.description}</p>
                            </div>
                            <div className="mb-2">
                              <span className="text-xs font-semibold text-blue-700">Content:</span>
                              <p className="text-sm text-gray-800">{generatedContent.lead_magnet.content}</p>
                            </div>
                            <div>
                              <span className="text-xs font-semibold text-blue-700">Format:</span>
                              <p className="text-sm text-gray-700">{generatedContent.lead_magnet.delivery_format}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Subject Lines Section */}
                      {generatedContent.subject_lines && generatedContent.subject_lines.length > 0 && (
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                          <h4 className="text-base font-medium text-purple-900 mb-3 flex items-center">
                            <i className="fas fa-tag text-purple-600 mr-2"></i>
                            Additional Subject Lines
                          </h4>
                          <div className="bg-white rounded-lg border border-purple-200 p-4">
                            <ul className="space-y-1">
                              {generatedContent.subject_lines.map((subject: string, index: number) => (
                                <li key={index} className="text-sm text-gray-800">• {subject}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setGeneratedContent(null)}
                          className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                        >
                          <i className="fas fa-times mr-1"></i>
                          Clear Results
                        </button>
                        <button 
                          onClick={() => {
                            setInputs({
                              transcriptContent: '',
                              transcriptType: '',
                              targetAudience: '',
                              emailGoal: '',
                              leadMagnetType: '',
                              contentTheme: '',
                              callToAction: '',
                              emailSequenceLength: '',
                              tone: 'professional'
                            });
                            setGeneratedContent(null);
                            setError('');
                          }}
                          className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                        >
                          <i className="fas fa-refresh mr-1"></i>
                          Reset Form
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Transcript Information</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="transcriptType">Transcript Type</label>
                          <select
                            id="transcriptType"
                            name="transcriptType"
                            value={inputs.transcriptType}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select transcript type</option>
                            <option value="webinar">Webinar</option>
                            <option value="podcast">Podcast</option>
                            <option value="interview">Interview</option>
                            <option value="presentation">Presentation</option>
                            <option value="course">Course/Training</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="contentTheme">Content Theme</label>
                          <input
                            id="contentTheme"
                            name="contentTheme"
                            type="text"
                            value={inputs.contentTheme}
                            onChange={handleInputChange}
                            placeholder="Main topic or theme of content"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="transcriptContent">Transcript Content</label>
                        <textarea 
                          id="transcriptContent"
                          name="transcriptContent"
                          value={inputs.transcriptContent}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-32" 
                          placeholder="Paste your transcript content here..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Email & Lead Magnet Strategy</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="targetAudience">Target Audience</label>
                        <textarea 
                          id="targetAudience"
                          name="targetAudience"
                          value={inputs.targetAudience}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Describe your target audience for these emails..."
                        ></textarea>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="emailGoal">Email Goal</label>
                          <select
                            id="emailGoal"
                            name="emailGoal"
                            value={inputs.emailGoal}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select email goal</option>
                            <option value="nurture">Nurture leads</option>
                            <option value="educate">Educate audience</option>
                            <option value="promote">Promote product/service</option>
                            <option value="engage">Increase engagement</option>
                            <option value="convert">Drive conversions</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="leadMagnetType">Lead Magnet Type</label>
                          <select
                            id="leadMagnetType"
                            name="leadMagnetType"
                            value={inputs.leadMagnetType}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select lead magnet type</option>
                            <option value="checklist">Checklist</option>
                            <option value="guide">Guide/eBook</option>
                            <option value="template">Template</option>
                            <option value="worksheet">Worksheet</option>
                            <option value="cheatsheet">Cheat Sheet</option>
                            <option value="video">Video Series</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Email Sequence Details</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="emailSequenceLength">Email Sequence Length</label>
                          <select
                            id="emailSequenceLength"
                            name="emailSequenceLength"
                            value={inputs.emailSequenceLength}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select sequence length</option>
                            <option value="3">3 emails</option>
                            <option value="5">5 emails</option>
                            <option value="7">7 emails</option>
                            <option value="10">10 emails</option>
                          </select>
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
                            <option value="professional">Professional</option>
                            <option value="friendly">Friendly</option>
                            <option value="casual">Casual</option>
                            <option value="authoritative">Authoritative</option>
                            <option value="conversational">Conversational</option>
                          </select>
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
                          placeholder="What action do you want readers to take?"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && (
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {emailTemplates.map((template, index) => (
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
                  <History toolName="Emails Lead Magnets" />
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
                <button 
                  onClick={() => {
                    setInputs({
                      transcriptContent: '',
                      transcriptType: '',
                      targetAudience: '',
                      emailGoal: '',
                      leadMagnetType: '',
                      contentTheme: '',
                      callToAction: '',
                      emailSequenceLength: '',
                      tone: 'professional'
                    });
                    setGeneratedContent(null);
                    setError('');
                  }}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all shadow-sm hover:shadow"
                >
                  <i className="fas fa-refresh mr-1"></i>
                  Reset
                </button>
                <button className="px-4 py-2 text-sm text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-all shadow-sm hover:shadow">
                  Save Draft
                </button>
                <button 
                  onClick={generateEmailsLeadMagnets}
                  disabled={isLoading}
                  className="px-5 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin text-xs"></i>
                      <span>Generating Content...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Content</span>
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
