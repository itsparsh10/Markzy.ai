'use client';

import React, { useState } from 'react';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface BrandEmailsProps {
  onBackClick: () => void;
}

export default function BrandEmails({ onBackClick }: BrandEmailsProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'result' | 'templates' | 'history'>('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [toolHistory, setToolHistory] = useState<any[]>([]);
  const [inputs, setInputs] = useState({
    brandName: '',
    brandStory: '',
    brandValues: '',
    companyHistory: '',
    missionStatement: '',
    foundingStory: '',
    teamBackground: '',
    emailPurpose: '',
    tone: 'professional',
    emailLength: 'medium'
  });



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  // Helper function to format text with bold headings
  const formatTextWithBold = (text: string) => {
    if (!text) return null;
    
    // Split text into sentences for better paragraph formatting
    const sentences = text.split(/(?<=[.!?])\s+/);
    let formattedContent: JSX.Element[] = [];
    let currentParagraph: string[] = [];
    
    sentences.forEach((sentence, index) => {
      // Check if sentence is a heading (contains : or is all caps or starts with numbers)
      const isHeading = sentence.includes(':') && sentence.length < 100 || 
                       /^[A-Z\s\d\-\.]+:/.test(sentence) ||
                       /^\d+\./.test(sentence.trim()) ||
                       /^[A-Z\s]{3,}$/.test(sentence.trim()) ||
                       /^#+\s/.test(sentence.trim()); // Markdown headers
      
      if (isHeading) {
        // Add current paragraph if it exists
        if (currentParagraph.length > 0) {
          formattedContent.push(
            <div key={`para-${index}`} className="mb-4 text-sm text-gray-700 leading-relaxed">
              {currentParagraph.join(' ')}
            </div>
          );
          currentParagraph = [];
        }
        
        // Add heading
        formattedContent.push(
          <div key={`heading-${index}`} className="font-bold text-blue-900 mt-6 mb-3 text-base border-b border-blue-100 pb-1">
            {sentence.replace(/^#+\s/, '')} {/* Remove markdown # */}
          </div>
        );
      } else {
        // Add to current paragraph
        currentParagraph.push(sentence.trim());
        
        // If paragraph gets too long, split it
        if (currentParagraph.join(' ').length > 300) {
          formattedContent.push(
            <div key={`para-${index}`} className="mb-4 text-sm text-gray-700 leading-relaxed">
              {currentParagraph.join(' ')}
            </div>
          );
          currentParagraph = [];
        }
      }
    });
    
    // Add any remaining paragraph
    if (currentParagraph.length > 0) {
      formattedContent.push(
        <div key="final-para" className="mb-4 text-sm text-gray-700 leading-relaxed">
          {currentParagraph.join(' ')}
        </div>
      );
    }
    
    return formattedContent.length > 0 ? formattedContent : (
      <div className="mb-4 text-sm text-gray-700 leading-relaxed">
        {text}
      </div>
    );
  };

  const formatContentForCopy = (content: any) => {
    if (typeof content === 'string') return content;
    
    if (content.email || content.brand_emails || content.email_content || content.content || content.generated_content || content.email_copy) {
      return content.email || content.brand_emails || content.email_content || content.content || content.generated_content || content.email_copy;
    }
    
    return Object.entries(content)
      .filter(([key, value]) => typeof value === 'string' && value.length > 50)
      .map(([key, value]) => `${key.replace(/_/g, ' ').toUpperCase()}:\n${value}`)
      .join('\n\n') || JSON.stringify(content);
  };

  const formatEmailOutput = (content: any) => {
    // ✅ Case: only one email field
    if (
      typeof content === 'object' &&
      content !== null &&
      Object.keys(content).length === 1 &&
      'email' in content &&
      typeof content.email === 'string'
    ) {
      return (
        <div className="space-y-4">
          <div className="border border-blue-100 rounded-lg p-4 bg-blue-50/30">
            <h4 className="font-bold text-blue-900 capitalize mb-3 flex items-center gap-2 text-base border-b border-blue-200 pb-2">
              <i className="fas fa-mail-bulk text-blue-600 text-sm"></i>
              Email
            </h4>
            <div className="prose prose-sm max-w-none">
              {formatTextWithBold(content.email)}
            </div>
          </div>
          <div className="text-xs text-gray-500 italic mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <i className="fas fa-info-circle mr-1"></i>
            Your brand email is ready. Copy the content above for your email campaigns.
          </div>
        </div>
      );
    }

    // 🔄 Check for known content fields
    let emailText = '';
    let label = '';
    if (content.email) { emailText = content.email; label = 'Email'; }
    else if (content.brand_emails) { emailText = content.brand_emails; label = 'Brand Emails'; }
    else if (content.email_content) { emailText = content.email_content; label = 'Email Content'; }
    else if (content.content) { emailText = content.content; label = 'Content'; }
    else if (content.generated_content) { emailText = content.generated_content; label = 'Generated Content'; }
    else if (content.email_copy) { emailText = content.email_copy; label = 'Email Copy'; }

    if (emailText) {
      return (
        <div className="space-y-4">
          <div className="border border-blue-100 rounded-lg p-4 bg-blue-50/30">
            <h4 className="font-bold text-blue-900 capitalize mb-3 flex items-center gap-2 text-base border-b border-blue-200 pb-2">
              <i className="fas fa-mail-bulk text-blue-600 text-sm"></i>
              {label}
            </h4>
            <div className="prose prose-sm max-w-none">
              {formatTextWithBold(emailText)}
            </div>
          </div>
          <div className="text-xs text-gray-500 italic mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <i className="fas fa-info-circle mr-1"></i>
            Your brand email is ready. Copy the content above for your email campaigns.
          </div>
        </div>
      );
    }

    // 🧠 Handle any remaining structured content
    const inputFields = [
      'brand_name', 'email_purpose', 'brand_story', 'mission_statement', 'brand_values',
      'company_history', 'tone_of_voice', 'email_length', 'founding_story', 'team_background',
      'email', 'brand_emails', 'email_content', 'content', 'generated_content', 'email_copy'
    ];

    const contentFields = Object.entries(content || {})
      .filter(([key, value]) =>
        typeof value === 'string' &&
        value.length > 50 &&
        !inputFields.includes(key)
      );

    if (contentFields.length > 0) {
      return (
        <div className="space-y-6">
          <div className="font-bold text-lg text-blue-900 mb-4 flex items-center gap-2">
            <i className="fas fa-envelope text-blue-600"></i>
            Generated Brand Emails
          </div>
          {contentFields.map(([key, value]) => (
            <div key={key} className="border border-blue-100 rounded-lg p-4 bg-blue-50/30">
              <h4 className="font-bold text-blue-900 capitalize mb-3 flex items-center gap-2 text-base border-b border-blue-200 pb-2">
                <i className="fas fa-mail-bulk text-blue-600 text-sm"></i>
                {key.replace(/_/g, ' ')}
              </h4>
              <div className="space-y-2 prose prose-sm max-w-none">
                {formatTextWithBold(value as string)}
              </div>
            </div>
          ))}
        </div>
      );
    }

    // ❌ Fallback
    return (
      <div className="space-y-2">
        <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
          <p>Content is being processed. Please try generating again.</p>
        </div>
      </div>
    );
  };

  const handleGenerate = async () => {
    // Validation
    if (!inputs.brandName || !inputs.emailPurpose || !inputs.brandStory || !inputs.missionStatement || !inputs.brandValues || !inputs.companyHistory) {
      alert('Please fill in all required fields: Brand Name, Email Purpose, Brand Story, Mission Statement, Brand Values, and Company History');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Dynamic import for ES modules
      const { aiToolsService } = await import('../../services/aiTools.js');
      
      // Map UI values to API format
      const requestData = {
        brand_name: inputs.brandName,
        email_purpose: inputs.emailPurpose,
        brand_story: inputs.brandStory,
        mission_statement: inputs.missionStatement,
        brand_values: inputs.brandValues,
        company_history: inputs.companyHistory,
        tone_of_voice: inputs.tone,
        email_length: inputs.emailLength,
        founding_story: inputs.foundingStory || '',
        team_background: inputs.teamBackground || ''
      };

      console.log('Sending brand emails request:', requestData);
      const response = await aiToolsService.generateBrandEmails(requestData);
      console.log('Brand emails response:', response);
      setGeneratedContent(response);
      setActiveTab('result');
      
      // Save to tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Brand Emails',
          toolId: 'brand-emails',
          outputResult: response,
          prompt: JSON.stringify(requestData)
        });
        console.log('✅ Brand emails saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
      
    } catch (error: any) {
      // Error handling with user-friendly messages
      let errorMessage = 'Failed to generate brand emails. Please try again.';
      
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
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };



  const emailTemplates = [
    { name: "Brand Story Email", icon: "fas fa-book-open", description: "Share your brand's origin story and journey in an engaging email format." },
    { name: "Values & Mission", icon: "fas fa-heart", description: "Communicate your brand values and mission to build deeper connections." },
    { name: "Behind the Scenes", icon: "fas fa-eye", description: "Give subscribers a peek behind the curtain of your business operations." },
    { name: "Founder's Letter", icon: "fas fa-user-tie", description: "Personal message from the founder sharing vision and passion." },
    { name: "Company Milestones", icon: "fas fa-trophy", description: "Celebrate achievements and milestones with your audience." },
    { name: "Team Introduction", icon: "fas fa-users", description: "Introduce your team members and their roles in your brand story." }
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
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Brand Emails</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create emails that share your brand's story and journey</p>
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
                {generatedContent && !error && (
                  <button 
                    onClick={() => setActiveTab('result')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${activeTab === 'result' ? 'text-blue-700 bg-blue-50/70' : 'text-blue-500 hover:text-blue-600'}`}
                  >
                    <span className="flex items-center gap-2">
                      <i className="fas fa-envelope text-xs"></i>
                      Generated Emails
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
                  {generatedContent && !error && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <i className="fas fa-check text-green-600 text-sm"></i>
                          </div>
                          <div>
                            <h4 className="text-green-800 font-semibold">Emails Generated Successfully!</h4>
                            <p className="text-green-600 text-sm">Your brand emails are ready to view.</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveTab('result')}
                          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center gap-2"
                        >
                          <i className="fas fa-eye text-xs"></i>
                          View Emails
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Brand Information</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="brandName">Brand/Company Name</label>
                          <input
                            id="brandName"
                            name="brandName"
                            type="text"
                            value={inputs.brandName}
                            onChange={handleInputChange}
                            placeholder="Enter your brand name"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="emailPurpose">Email Purpose</label>
                          <select
                            id="emailPurpose"
                            name="emailPurpose"
                            value={inputs.emailPurpose}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select email purpose</option>
                            <option value="welcome">Welcome Sequence</option>
                            <option value="brand-story">Brand Story</option>
                            <option value="newsletter">Newsletter Content</option>
                            <option value="standalone">Standalone Email</option>
                            <option value="nurture">Nurture Campaign</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="brandStory">Brand Story & Background</label>
                        <textarea 
                          id="brandStory"
                          name="brandStory"
                          value={inputs.brandStory}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Tell the story of how your brand started, your journey, key moments..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Brand Values & Mission</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="missionStatement">Mission Statement</label>
                        <textarea 
                          id="missionStatement"
                          name="missionStatement"
                          value={inputs.missionStatement}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="What is your brand's mission and purpose?"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="brandValues">Brand Values</label>
                        <textarea 
                          id="brandValues"
                          name="brandValues"
                          value={inputs.brandValues}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="What values does your brand stand for? What do you believe in?"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="companyHistory">Company History & Milestones</label>
                        <textarea 
                          id="companyHistory"
                          name="companyHistory"
                          value={inputs.companyHistory}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Key milestones, achievements, growth moments in your brand's history..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Personal Touch & Email Settings</h4>
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
                            <option value="personal">Personal</option>
                            <option value="inspiring">Inspiring</option>
                            <option value="conversational">Conversational</option>
                            <option value="authoritative">Authoritative</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="emailLength">Email Length</label>
                          <select
                            id="emailLength"
                            name="emailLength"
                            value={inputs.emailLength}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="short">Short (1-2 paragraphs)</option>
                            <option value="medium">Medium (3-4 paragraphs)</option>
                            <option value="long">Long (detailed story)</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="foundingStory">Founding Story (Optional)</label>
                        <textarea 
                          id="foundingStory"
                          name="foundingStory"
                          value={inputs.foundingStory}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="The personal story behind why you started this brand..."
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="teamBackground">Team Background (Optional)</label>
                        <textarea 
                          id="teamBackground"
                          name="teamBackground"
                          value={inputs.teamBackground}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="Information about your team, their expertise, passion..."
                        ></textarea>
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
              
              {activeTab === 'result' && generatedContent && (
                <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
                  {/* Welcome Email */}
                  {generatedContent.welcomeEmail && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-blue-800 mb-2 flex items-center gap-2">
                        <i className="fas fa-handshake text-blue-600"></i>
                        Welcome Email
                      </h3>
                      <div className="bg-white p-4 rounded-lg border border-blue-100">
                        <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">{generatedContent.welcomeEmail}</div>
                      </div>
                    </div>
                  )}

                  {/* Newsletter Template */}
                  {generatedContent.newsletterTemplate && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center gap-2">
                        <i className="fas fa-newspaper text-green-600"></i>
                        Newsletter Template
                      </h3>
                      <div className="bg-white p-4 rounded-lg border border-green-100">
                        <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">{generatedContent.newsletterTemplate}</div>
                      </div>
                    </div>
                  )}

                  {/* Brand Story Email */}
                  {generatedContent.brandStoryEmail && (
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-purple-800 mb-2 flex items-center gap-2">
                        <i className="fas fa-book-open text-purple-600"></i>
                        Brand Story Email
                      </h3>
                      <div className="bg-white p-4 rounded-lg border border-purple-100">
                        <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">{generatedContent.brandStoryEmail}</div>
                      </div>
                    </div>
                  )}

                  {/* Product Launch Email */}
                  {generatedContent.productLaunchEmail && (
                    <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-indigo-800 mb-2 flex items-center gap-2">
                        <i className="fas fa-rocket text-indigo-600"></i>
                        Product Launch Email
                      </h3>
                      <div className="bg-white p-4 rounded-lg border border-indigo-100">
                        <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">{generatedContent.productLaunchEmail}</div>
                      </div>
                    </div>
                  )}

                  {/* Promotional Email */}
                  {generatedContent.promotionalEmail && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                        <i className="fas fa-percentage text-yellow-600"></i>
                        Promotional Email
                      </h3>
                      <div className="bg-white p-4 rounded-lg border border-yellow-100">
                        <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">{generatedContent.promotionalEmail}</div>
                      </div>
                    </div>
                  )}

                  {/* Follow-up Email */}
                  {generatedContent.followUpEmail && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-red-800 mb-2 flex items-center gap-2">
                        <i className="fas fa-reply text-red-600"></i>
                        Follow-up Email
                      </h3>
                      <div className="bg-white p-4 rounded-lg border border-red-100">
                        <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">{generatedContent.followUpEmail}</div>
                      </div>
                    </div>
                  )}

                  {/* Email Subject Lines */}
                  {generatedContent.subjectLines && generatedContent.subjectLines.length > 0 && (
                    <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-teal-800 mb-2 flex items-center gap-2">
                        <i className="fas fa-heading text-teal-600"></i>
                        Subject Line Variations
                      </h3>
                      <div className="bg-white p-3 rounded-lg border border-teal-100">
                        <div className="grid gap-2">
                          {generatedContent.subjectLines.map((subject: string, index: number) => (
                            <div key={index} className="p-3 bg-teal-25 border border-teal-100 rounded-lg">
                              <p className="text-gray-800 font-medium">{subject}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-4">
                    <button
                      onClick={() => navigator.clipboard.writeText(JSON.stringify(generatedContent, null, 2))}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
                    >
                      <i className="fas fa-copy"></i>
                      Copy Emails
                    </button>
                    <button
                      onClick={() => {
                        const element = document.createElement('a');
                        const file = new Blob([JSON.stringify(generatedContent, null, 2)], { type: 'application/json' });
                        element.href = URL.createObjectURL(file);
                        element.download = 'brand_emails.json';
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200"
                    >
                      <i className="fas fa-download"></i>
                      Download
                    </button>
                    <button
                      onClick={() => setActiveTab('generate')}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200"
                    >
                      <i className="fas fa-edit"></i>
                      Edit & Regenerate
                    </button>
                  </div>
                </div>
              )}
              
              {activeTab === 'history' && (
                <div className="py-4">
                  <History toolName="Brand Emails" />
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
                      Your Brand Email
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
                  <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                    {formatEmailOutput(generatedContent)}
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
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className={`px-5 py-2 text-sm text-white rounded-lg transition-all flex items-center gap-2 shadow-md hover:shadow-lg ${
                    isLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600'
                  }`}
                >
                  {isLoading ? (
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
