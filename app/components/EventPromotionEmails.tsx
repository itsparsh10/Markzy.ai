'use client';

import React, { useState } from 'react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface EventPromotionEmailsProps {
  onBackClick: () => void;
}

export default function EventPromotionEmails({ onBackClick }: EventPromotionEmailsProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputs, setInputs] = useState({
    eventName: '',
    eventType: '',
    eventDate: '',
    eventLocation: '',
    targetAudience: '',
    keyBenefits: '',
    registrationFee: '',
    urgencyFactor: '',
    organizer: '',
    tone: 'professional',
    emailType: 'announcement'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateEmails = async () => {
    setIsGenerating(true);
    setError(null);
    setGeneratedContent(null);

    try {
      // Validate required fields
      const requiredFields = [
        { key: 'eventName', label: 'Event Name' },
        { key: 'eventType', label: 'Event Type' },
        { key: 'eventDate', label: 'Event Date' },
        { key: 'eventLocation', label: 'Location/Platform' },
        { key: 'targetAudience', label: 'Target Audience' },
        { key: 'keyBenefits', label: 'Key Benefits & Features' },
        { key: 'organizer', label: 'Organizer/Host' },
        { key: 'registrationFee', label: 'Registration Fee' },
        { key: 'urgencyFactor', label: 'Urgency Factor' },
        { key: 'emailType', label: 'Email Type' }
      ];

      const missingFields = requiredFields.filter(field => !inputs[field.key as keyof typeof inputs]);
      if (missingFields.length > 0) {
        setError(`Please fill in the following required fields: ${missingFields.map(f => f.label).join(', ')}`);
        return;
      }

      // Map the form inputs to the API expected format
      const emailData = {
        event_name: inputs.eventName,
        event_type: inputs.eventType.charAt(0).toUpperCase() + inputs.eventType.slice(1), // Capitalize first letter
        event_date: inputs.eventDate,
        location_platform: inputs.eventLocation,
        target_audience: inputs.targetAudience,
        key_benefits_features: inputs.keyBenefits,
        organizer_host: inputs.organizer,
        registration_fee: inputs.registrationFee,
        email_type: inputs.emailType === 'announcement' ? 'Event Announcement' : 
                   inputs.emailType === 'registration' ? 'Registration Open' : 
                   inputs.emailType === 'reminder' ? 'Event Reminder' : 
                   inputs.emailType === 'last-chance' ? 'Last Chance' : 
                   inputs.emailType === 'follow-up' ? 'Post-Event Follow-up' : 'Event Announcement',
        urgency_factor: inputs.urgencyFactor === 'limited-seats' ? 'Limited seats available' : 
                      inputs.urgencyFactor === 'early-bird' ? 'Early Bird Pricing' : 
                      inputs.urgencyFactor === 'registration-deadline' ? 'Registration Deadline' : 
                      inputs.urgencyFactor === 'one-time-event' ? 'One-Time Event' : 'Limited seats available',
        tone_of_voice: inputs.tone.charAt(0).toUpperCase() + inputs.tone.slice(1) // Capitalize first letter
      };

      console.log('Event promotion email data being sent:', emailData);
      const response = await aiToolsService.generateEventPromotionEmails(emailData);
      setGeneratedContent(response);
      
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Event Promotion Emails',
          toolId: 'event-promotion-emails',
          outputResult: response,
          prompt: JSON.stringify(emailData)
        });
        console.log('✅ Event promotion emails saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
    } catch (err: any) {
      console.error('Error generating event promotion emails:', err);
      setError(err.message || 'Failed to generate emails. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const eventEmailTypes = [
    { name: "Save the Date", icon: "fas fa-calendar-check", description: "Early announcement to reserve the date in attendees' calendars." },
    { name: "Event Registration", icon: "fas fa-ticket-alt", description: "Main registration email with event details and benefits." },
    { name: "Early Bird Promotion", icon: "fas fa-clock", description: "Special pricing or perks for early registrants." },
    { name: "Event Reminder", icon: "fas fa-bell", description: "Reminder emails leading up to the event date." },
    { name: "Last Chance", icon: "fas fa-exclamation-triangle", description: "Final opportunity emails before registration closes." },
    { name: "Event Follow-up", icon: "fas fa-handshake", description: "Thank you and next steps after the event." }
  ];

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Glassmorphic Header with blue gradient */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-calendar-check text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Event Promotion Emails</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create compelling email campaigns to promote your events</p>
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
                    <h4 className="text-base font-medium text-blue-900 mb-3">Event Information</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="eventName">Event Name</label>
                          <input
                            id="eventName"
                            name="eventName"
                            type="text"
                            value={inputs.eventName}
                            onChange={handleInputChange}
                            placeholder="Enter your event name"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="eventType">Event Type</label>
                          <select
                            id="eventType"
                            name="eventType"
                            value={inputs.eventType}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Choose event type</option>
                            <option value="conference">Conference</option>
                            <option value="webinar">Webinar</option>
                            <option value="workshop">Workshop</option>
                            <option value="networking">Networking</option>
                            <option value="product-launch">Product Launch</option>
                            <option value="trade-show">Trade Show</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="eventDate">Event Date</label>
                          <input
                            id="eventDate"
                            name="eventDate"
                            type="date"
                            value={inputs.eventDate}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="eventLocation">Location/Platform</label>
                          <input
                            id="eventLocation"
                            name="eventLocation"
                            type="text"
                            value={inputs.eventLocation}
                            onChange={handleInputChange}
                            placeholder="e.g., Online via Zoom, NYC Convention Center"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Target Audience & Benefits</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="targetAudience">Target Audience</label>
                        <textarea 
                          id="targetAudience"
                          name="targetAudience"
                          value={inputs.targetAudience}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Describe who should attend this event..."
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="keyBenefits">Key Benefits & Features</label>
                        <textarea 
                          id="keyBenefits"
                          name="keyBenefits"
                          value={inputs.keyBenefits}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="List the main benefits attendees will get (one per line)..."
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="organizer">Organizer/Host</label>
                        <input
                          id="organizer"
                          name="organizer"
                          type="text"
                          value={inputs.organizer}
                          onChange={handleInputChange}
                          placeholder="Your name or organization name"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Promotion Strategy</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="registrationFee">Registration Fee</label>
                          <input
                            id="registrationFee"
                            name="registrationFee"
                            type="text"
                            value={inputs.registrationFee}
                            onChange={handleInputChange}
                            placeholder="e.g., Free, $99, $299"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="urgencyFactor">Urgency Factor</label>
                          <select
                            id="urgencyFactor"
                            name="urgencyFactor"
                            value={inputs.urgencyFactor}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Choose urgency level</option>
                            <option value="limited-seats">Limited Seats Available</option>
                            <option value="early-bird">Early Bird Pricing</option>
                            <option value="registration-deadline">Registration Deadline</option>
                            <option value="one-time-event">One-Time Event</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="emailType">Email Type</label>
                          <select
                            id="emailType"
                            name="emailType"
                            value={inputs.emailType}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="announcement">Event Announcement</option>
                            <option value="registration">Registration Open</option>
                            <option value="reminder">Event Reminder</option>
                            <option value="last-chance">Last Chance</option>
                            <option value="follow-up">Post-Event Follow-up</option>
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
                            <option value="enthusiastic">Enthusiastic</option>
                            <option value="friendly">Friendly</option>
                            <option value="urgent">Urgent</option>
                            <option value="informative">Informative</option>
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
                      Event Promotion Emails Generated Successfully!
                    </h4>
                    <button 
                      onClick={() => setGeneratedContent(null)}
                      className="text-green-600 hover:text-green-800 transition-colors"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Email Subject Line */}
                    {generatedContent.subject_line && (
                      <div className="bg-white p-4 rounded-lg border border-green-200">
                        <h5 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                          <i className="fas fa-envelope text-green-600"></i>
                          Email Subject Line
                        </h5>
                        <div className="p-3 bg-green-50 rounded border border-green-200 text-green-800 font-medium text-center">
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

                    {/* Complete Email Structure */}
                    <div className="bg-white p-6 rounded-lg border border-green-200 shadow-sm">
                      <h5 className="font-semibold text-green-900 mb-4 flex items-center gap-2 text-lg">
                        <i className="fas fa-envelope-open text-green-600"></i>
                        Complete Email Structure
                      </h5>
                      <div className="space-y-4">
                        {/* Greeting */}
                        {generatedContent.greeting && (
                          <div className="border-b border-green-100 pb-3">
                            <h6 className="font-medium text-green-800 mb-2">Greeting:</h6>
                            <p className="text-gray-800">{generatedContent.greeting}</p>
                          </div>
                        )}

                        {/* Body */}
                        {generatedContent.body && (
                          <div className="border-b border-green-100 pb-3">
                            <h6 className="font-medium text-green-800 mb-2">Email Body:</h6>
                            <div className="prose prose-sm max-w-none">
                              <div 
                                className="text-gray-800 leading-relaxed"
                                dangerouslySetInnerHTML={{ 
                                  __html: generatedContent.body
                                    .replace(/\n\n/g, '</p><p>')
                                    .replace(/\n/g, '<br>')
                                    .replace(/^(.*)/, '<p>$1')
                                    .replace(/(.*)$/, '$1</p>')
                                }} 
                              />
                            </div>
                          </div>
                        )}

                        {/* Bullet Points */}
                        {generatedContent.bullet_points && (
                          <div className="border-b border-green-100 pb-3">
                            <h6 className="font-medium text-green-800 mb-2">Key Benefits:</h6>
                            <div className="space-y-2">
                              {Array.isArray(generatedContent.bullet_points) ? 
                                generatedContent.bullet_points.map((point: string, index: number) => (
                                  <div key={index} className="flex items-start gap-3">
                                    <i className="fas fa-check-circle text-green-600 text-sm mt-1 flex-shrink-0"></i>
                                    <span className="text-gray-800 text-sm leading-relaxed">{point}</span>
                                  </div>
                                )) : 
                                <div className="text-gray-800 text-sm leading-relaxed">
                                  {generatedContent.bullet_points}
                                </div>
                              }
                            </div>
                          </div>
                        )}

                        {/* Call to Action */}
                        {generatedContent.call_to_action && (
                          <div className="border-b border-green-100 pb-3">
                            <h6 className="font-medium text-green-800 mb-2">Call to Action:</h6>
                            <div className="p-3 bg-green-50 rounded border border-green-200">
                              <p className="text-green-800 font-medium">{generatedContent.call_to_action}</p>
                            </div>
                          </div>
                        )}

                        {/* Closing */}
                        {generatedContent.closing && (
                          <div>
                            <h6 className="font-medium text-green-800 mb-2">Closing:</h6>
                            <p className="text-gray-800">{generatedContent.closing}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Individual Sections for Easy Copying */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Call to Action - Standalone */}
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

                      {/* Bullet Points - Standalone */}
                      {generatedContent.bullet_points && (
                        <div className="bg-white p-4 rounded-lg border border-green-200">
                          <h5 className="font-medium text-green-900 mb-3 flex items-center gap-2">
                            <i className="fas fa-star text-green-600"></i>
                            Key Benefits
                          </h5>
                          <div className="space-y-2">
                            {Array.isArray(generatedContent.bullet_points) ? 
                              generatedContent.bullet_points.map((point: string, index: number) => (
                                <div key={index} className="p-2 bg-green-50 rounded border border-green-200 text-green-800 flex items-start gap-3">
                                  <i className="fas fa-check-circle text-green-600 text-sm mt-0.5 flex-shrink-0"></i>
                                  <span className="text-sm leading-relaxed">{point}</span>
                                </div>
                              )) : 
                              <div className="p-3 bg-green-50 rounded border border-green-200 text-green-800 text-sm leading-relaxed">
                                {generatedContent.bullet_points}
                              </div>
                            }
                          </div>
                        </div>
                      )}
                    </div>

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
Subject Line: ${generatedContent.subject_line || ''}

Preheader: ${generatedContent.preheader || ''}

Complete Email:
${generatedContent.greeting || ''}

${generatedContent.body || ''}

                            ${Array.isArray(generatedContent.bullet_points) ? generatedContent.bullet_points.map((point: string) => `• ${point}`).join('\n') : ''}

${generatedContent.call_to_action || ''}

${generatedContent.closing || ''}
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
                  {eventEmailTypes.map((template, index) => (
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
                  <History toolName="Event Promotion Emails" />
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
                  onClick={handleGenerateEmails}
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
                      <span>Generate Emails</span>
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
