'use client'

import { useState } from 'react';
import { ArrowLeft, Briefcase, Users, Footprints, Lightbulb, Target, Search, ShoppingBag, MessageSquare, ThumbsUp, FileText, History as HistoryIcon, Route, Clock, X, Save, Wand2, Copy, Check } from 'lucide-react';
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

interface Email {
  subject: string;
  preheader: string;
  body: string;
}

interface WebinarEmailResult {
  campaign_title: string;
  emails: Email[];
  notes: string;
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

export default function WebinarEmails({ onBackClick }: { onBackClick: () => void }) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [inputs, setInputs] = useState({
    webinarTitle: '',
    webinarDate: '',
    webinarTime: '',
    webinarDuration: '',
    webinarTopic: '',
    targetAudience: '',
    presenterName: '',
    presenterCredentials: '',
    keyTakeaways: '',
    registrationLink: '',
    webinarPlatform: '',
    emailSequenceType: '',
    brandTone: '',
    additionalInformation: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<WebinarEmailResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateEmails = async () => {
    if (!inputs.webinarTitle || !inputs.webinarDate || !inputs.webinarTime || !inputs.webinarDuration || !inputs.webinarTopic || !inputs.targetAudience || !inputs.presenterName || !inputs.presenterCredentials || !inputs.keyTakeaways || !inputs.emailSequenceType || !inputs.webinarPlatform || !inputs.registrationLink || !inputs.brandTone) {
      alert('Please fill in all required fields: Webinar Title, Date, Time, Duration, Topic, Target Audience, Presenter Name, Credentials, Key Takeaways, Email Sequence Type, Platform, Registration Link, and Brand Tone');
      return;
    }

    setIsLoading(true);
    setResult(null);
    setCopied(false);

    try {
      const requestData = {
        webinar_title: inputs.webinarTitle,
        webinar_date: inputs.webinarDate,
        webinar_time: inputs.webinarTime,
        duration: inputs.webinarDuration,
        webinar_topic_description: inputs.webinarTopic,
        presenter_name: inputs.presenterName,
        presenter_credentials: inputs.presenterCredentials,
        target_audience: inputs.targetAudience,
        key_takeaways: inputs.keyTakeaways,
        email_sequence_type: inputs.emailSequenceType,
        webinar_platform: inputs.webinarPlatform,
        registration_link: inputs.registrationLink,
        brand_tone: inputs.brandTone,
        additional_information: inputs.additionalInformation
      };

      const response = await aiToolsService.generateWebinarEmails(requestData);
      setResult(response);
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Webinar Emails',
          toolId: 'webinar-emails',
          outputResult: response,
          prompt: JSON.stringify(requestData)
        });
        console.log('✅ Webinar emails saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
    } catch (error) {
      console.error('Error generating webinar emails:', error);
      alert('Error generating webinar emails. Please try again.');
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

  const renderGenerateTab = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-3 rounded-lg shadow-sm border border-blue-100 mb-6">
        <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center">
          Webinar Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-blue-900" htmlFor="webinarTitle">Webinar Title</label>
            <input
              type="text"
              id="webinarTitle"
              name="webinarTitle"
              value={inputs.webinarTitle}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
              placeholder="Enter your webinar title"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-blue-900" htmlFor="webinarDate">Webinar Date</label>
            <input
              type="date"
              id="webinarDate"
              name="webinarDate"
              value={inputs.webinarDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-blue-900" htmlFor="webinarTime">Webinar Time</label>
            <input
              type="time"
              id="webinarTime"
              name="webinarTime"
              value={inputs.webinarTime}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-blue-900" htmlFor="webinarDuration">Duration</label>
            <select
              id="webinarDuration"
              name="webinarDuration"
              value={inputs.webinarDuration}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
            >
              <option value="">Select duration</option>
              <option value="30-minutes">30 minutes</option>
              <option value="45-minutes">45 minutes</option>
              <option value="1-hour">1 hour</option>
              <option value="90-minutes">90 minutes</option>
              <option value="2-hours">2 hours</option>
            </select>
          </div>
        </div>
        <div className="space-y-2 mt-4">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="webinarTopic">Webinar Topic & Description</label>
          <textarea 
            id="webinarTopic"
            name="webinarTopic"
            value={inputs.webinarTopic}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-24" 
            placeholder="Describe what your webinar will cover and the main topic..."
          ></textarea>
        </div>
      </div>

      <div className="bg-blue-50 p-3 rounded-lg shadow-sm border border-blue-100 mb-6">
        <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center">
          Presenter & Audience Information
        </h3>
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="presenterName">Presenter Name</label>
          <input
            type="text"
            id="presenterName"
            name="presenterName"
            value={inputs.presenterName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
            placeholder="Name of the presenter(s)"
          />
        </div>
        <div className="space-y-2 mt-4">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="presenterCredentials">Presenter Credentials & Background</label>
          <textarea 
            id="presenterCredentials"
            name="presenterCredentials"
            value={inputs.presenterCredentials}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
            placeholder="Brief background, credentials, and expertise of the presenter..."
          ></textarea>
        </div>
        <div className="space-y-2 mt-4">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="targetAudience">Target Audience</label>
          <textarea 
            id="targetAudience"
            name="targetAudience"
            value={inputs.targetAudience}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
            placeholder="Who is this webinar for? (professionals, students, business owners, etc.)"
          ></textarea>
        </div>
        <div className="space-y-2 mt-4">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="keyTakeaways">Key Takeaways & Benefits</label>
          <textarea 
            id="keyTakeaways"
            name="keyTakeaways"
            value={inputs.keyTakeaways}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-24" 
            placeholder="What will attendees learn or gain from this webinar? List the main benefits..."
          ></textarea>
        </div>
      </div>

      <div className="bg-blue-50 p-3 rounded-lg shadow-sm border border-blue-100 mb-6">
        <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center">
          Email Campaign Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-blue-900" htmlFor="emailSequenceType">Email Sequence Type</label>
            <select
              id="emailSequenceType"
              name="emailSequenceType"
              value={inputs.emailSequenceType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
            >
              <option value="">Select sequence type</option>
              <option value="full-sequence">Full Sequence (Announcement to Follow-up)</option>
              <option value="announcement-only">Announcement Only</option>
              <option value="reminder-series">Reminder Series</option>
              <option value="replay-sequence">Replay Sequence</option>
              <option value="registration-follow-up">Registration Follow-up</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-blue-900" htmlFor="webinarPlatform">Webinar Platform</label>
            <select
              id="webinarPlatform"
              name="webinarPlatform"
              value={inputs.webinarPlatform}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
            >
              <option value="">Select platform</option>
              <option value="zoom">Zoom</option>
              <option value="webex">WebEx</option>
              <option value="teams">Microsoft Teams</option>
              <option value="gotowebinar">GoToWebinar</option>
              <option value="demio">Demio</option>
              <option value="webinarjam">WebinarJam</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div className="space-y-2 mt-4">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="registrationLink">Registration Link</label>
          <input
            type="url"
            id="registrationLink"
            name="registrationLink"
            value={inputs.registrationLink}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
            placeholder="https://your-webinar-registration-link.com"
          />
        </div>
        <div className="space-y-2 mt-4">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="brandTone">Brand Tone</label>
          <select
            id="brandTone"
            name="brandTone"
            value={inputs.brandTone}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
          >
            <option value="">Select tone</option>
            <option value="professional">Professional</option>
            <option value="friendly">Friendly & Conversational</option>
            <option value="enthusiastic">Enthusiastic</option>
            <option value="authoritative">Authoritative</option>
            <option value="approachable">Approachable</option>
            <option value="urgent">Urgent & Action-oriented</option>
          </select>
        </div>
        <div className="space-y-2 mt-4">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="additionalInformation">Additional Information</label>
          <textarea 
            id="additionalInformation"
            name="additionalInformation"
            value={inputs.additionalInformation}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
            placeholder="Any special offers, bonuses, or additional details to include in the emails..."
          ></textarea>
        </div>
      </div>
    </div>
  );

  const renderTemplatesTab = () => (
    <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
      <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
            <i className="fas fa-bullhorn text-blue-600"></i>
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Webinar Announcement</h4>
            <p className="text-xs text-blue-600">Initial announcement email to introduce your webinar to your audience.</p>
          </div>
        </div>
        <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
      </div>
      
      <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
            <i className="fas fa-clock text-blue-600"></i>
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Reminder Sequence</h4>
            <p className="text-xs text-blue-600">Series of reminder emails leading up to the webinar date.</p>
          </div>
        </div>
        <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
      </div>
      
      <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
            <i className="fas fa-user-check text-blue-600"></i>
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Registration Confirmation</h4>
            <p className="text-xs text-blue-600">Thank you email sent immediately after registration with details.</p>
          </div>
        </div>
        <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
      </div>
      
      <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
            <i className="fas fa-play-circle text-blue-600"></i>
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Replay Delivery</h4>
            <p className="text-xs text-blue-600">Email to share the webinar recording with attendees and no-shows.</p>
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
            <h4 className="font-medium text-blue-900">Thank You & Follow-up</h4>
            <p className="text-xs text-blue-600">Post-webinar thank you with next steps and additional resources.</p>
          </div>
        </div>
        <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
      </div>
    </div>
  );

  const renderHistoryTab = () => (
    <div className="py-4">
      <History toolName="Webinar Emails" />
    </div>
  );

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Glassmorphic Header with blue gradient */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-laptop text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Webinar Emails</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create complete email campaigns for your webinars</p>
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
                  {renderGenerateTab()}
                </div>
              )}
              {activeTab === 'templates' && renderTemplatesTab()}
              {activeTab === 'history' && renderHistoryTab()}
            </div>
            
            {/* Results Section */}
            {result && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold text-green-900 flex items-center gap-2">
                    <i className="fas fa-check-circle text-green-600"></i>
                    Generated Email Campaign
                  </h4>
                  <button
                    onClick={() => handleCopy(result.campaign_title)}
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
                        Copy
                      </>
                    )}
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <h5 className="font-medium text-green-900 mb-2">Campaign Title</h5>
                    <p className="text-green-800">{result.campaign_title}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <h5 className="font-medium text-green-900 mb-3">Email Sequence</h5>
                    <div className="space-y-4">
                      {result.emails.map((email: Email, index: number) => (
                        <div key={index} className="border border-green-200 rounded-lg p-3 bg-green-50">
                          <div className="flex items-center justify-between mb-2">
                            <h6 className="font-medium text-green-900">Email {index + 1}</h6>
                            <button
                              onClick={() => handleCopy(`${email.subject}\n\n${email.preheader}\n\n${email.body}`)}
                              className="text-xs text-green-600 hover:text-green-800"
                            >
                              Copy Email
                            </button>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-medium text-green-800">Subject:</span>
                              <p className="text-green-700 ml-2">{email.subject}</p>
                            </div>
                            <div>
                              <span className="font-medium text-green-800">Preheader:</span>
                              <p className="text-green-700 ml-2">{email.preheader}</p>
                            </div>
                            <div>
                              <span className="font-medium text-green-800">Body:</span>
                              <div className="whitespace-pre-wrap text-green-700 ml-2 bg-white p-2 rounded border mt-1">
                                {email.body}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
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
                  onClick={handleGenerateEmails}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
