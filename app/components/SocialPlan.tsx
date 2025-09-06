'use client';

import React, { useState } from 'react';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface SocialPlanProps {
  onBackClick: () => void;
}

interface GeneratedPlanResponse {
  plan?: string;
  social_media_plan?: string;
  daily_posts?: any[];
  strategy?: string;
  notes?: string;
}

export default function SocialPlan({ onBackClick }: SocialPlanProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history' | 'result'>('generate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlanResponse | null>(null);
  const [error, setError] = useState<string>('');
  
  // State for form inputs
  const [inputs, setInputs] = useState({
    businessType: '',
    industry: '',
    targetAudience: '',
    primaryPlatforms: '',
    contentGoals: '',
    brandPersonality: '',
    contentTypes: '',
    postingSchedule: '',
    engagementStrategy: '',
    contentThemes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = {
      'Business Type': inputs.businessType,
      'Industry': inputs.industry,
      'Target Audience': inputs.targetAudience,
      'Primary Platforms': inputs.primaryPlatforms,
      'Content Goals': inputs.contentGoals,
      'Brand Personality': inputs.brandPersonality,
      'Content Types': inputs.contentTypes,
      'Posting Schedule': inputs.postingSchedule,
      'Engagement Strategy': inputs.engagementStrategy,
      'Content Themes': inputs.contentThemes
    };
    
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);
      
    if (missingFields.length > 0) {
      setError(`Please fill in the required fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedPlan(null);
    
    try {
      // Dynamic import for the service to handle ES modules in client component
      const { aiToolsService } = await import('../../services/aiTools.js');
      
      // Map UI values to API expected format
      const planData = {
        business_type: getBusinessTypeValue(inputs.businessType),
        industry: getIndustryValue(inputs.industry),
        target_audience: inputs.targetAudience,
        primary_platforms: getPlatformsValue(inputs.primaryPlatforms),
        posting_schedule: getPostingScheduleValue(inputs.postingSchedule),
        content_goals: inputs.contentGoals,
        brand_personality_voice: inputs.brandPersonality,
        preferred_content_types: inputs.contentTypes,
        content_themes_topics: inputs.contentThemes,
        engagement_strategy: inputs.engagementStrategy
      };

      console.log('Sending social plan request:', planData);
      const response = await aiToolsService.generateSocialPlan(planData);
      console.log('Social plan response:', response);
      setGeneratedPlan(response);
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Social Media Plan',
          toolId: 'social-media-plan',
          outputResult: response,
          prompt: JSON.stringify(planData)
        });
        console.log('✅ Social media plan saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
      
    } catch (error: any) {
      console.error('Error generating social plan:', error);
      
      // Extract meaningful error message to show to user
      let errorMessage = 'Failed to generate social plan. Please try again.';
      
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
      setIsGenerating(false);
    }
  };

  // Helper functions to map UI values to API format
  const getBusinessTypeValue = (value: string) => {
    const mapping: Record<string, string> = {
      'b2c': 'B2C (Business to Consumer)',
      'b2b': 'B2B (Business to Business)',
      'service': 'Service-based',
      'ecommerce': 'E-commerce',
      'saas': 'SaaS/Software',
      'nonprofit': 'Non-profit',
      'personal': 'Personal Brand',
      'education': 'Online Education'
    };
    return mapping[value] || value;
  };

  const getIndustryValue = (value: string) => {
    const mapping: Record<string, string> = {
      'technology': 'Technology',
      'healthcare': 'Healthcare',
      'finance': 'Finance',
      'education': 'Education',
      'retail': 'Retail',
      'food': 'Food & Beverage',
      'fitness': 'Fitness & Wellness',
      'beauty': 'Beauty & Fashion',
      'consulting': 'Consulting',
      'other': 'Other'
    };
    return mapping[value] || value;
  };

  const getPlatformsValue = (value: string) => {
    const mapping: Record<string, string> = {
      'instagram-facebook': 'Instagram, Facebook',
      'linkedin': 'LinkedIn',
      'twitter': 'Twitter/X',
      'tiktok': 'TikTok',
      'youtube': 'YouTube',
      'pinterest': 'Pinterest',
      'multi-platform': 'Instagram, YouTube, LinkedIn'
    };
    return mapping[value] || value;
  };

  const getPostingScheduleValue = (value: string) => {
    const mapping: Record<string, string> = {
      'daily': 'Daily',
      '5-times-week': '5 posts per week',
      '3-times-week': '3 posts per week',
      'twice-week': 'Twice per week',
      'once-week': 'Once per week'
    };
    return mapping[value] || value;
  };

  const renderTemplatesTab = () => {
    const templates = [
      { name: "Brand Awareness Plan", icon: "fas fa-eye", description: "Build brand recognition and reach new audiences over 30 days." },
      { name: "Engagement Booster", icon: "fas fa-heart", description: "Focus on increasing likes, comments, and shares." },
      { name: "Content Marketing Plan", icon: "fas fa-file-alt", description: "Educational and value-driven content strategy." },
      { name: "Community Building", icon: "fas fa-users", description: "Foster a loyal community around your brand." },
      { name: "Thought Leadership", icon: "fas fa-lightbulb", description: "Establish authority and expertise in your industry." },
      { name: "Customer Stories Plan", icon: "fas fa-quote-left", description: "Share testimonials and user-generated content." }
    ];

    return (
      <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
        {templates.map((template, index) => (
          <div key={index} className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
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
              <i className="fas fa-share-alt text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">30 Day Social Plan</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Get 30 days of content ideas to grow your social audience</p>
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
                {generatedPlan && (
                  <button 
                    onClick={() => setActiveTab('result')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${activeTab === 'result' ? 'text-blue-700 bg-blue-50/70' : 'text-blue-500 hover:text-blue-600'}`}
                  >
                    <span className="flex items-center gap-2">
                      <i className="fas fa-check-circle text-xs"></i>
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
              {/* Error Display */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Success notification - only show briefly after generation */}
              {generatedPlan && activeTab === 'generate' && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <i className="fas fa-check text-green-600 text-sm"></i>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-green-900">Plan Generated Successfully!</h4>
                        <p className="text-xs text-green-700 mt-1">Your social media plan is ready to view.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveTab('result')}
                      className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
                    >
                      View Plan
                      <i className="fas fa-arrow-right text-xs"></i>
                    </button>
                  </div>
                </div>
              )}              {activeTab === 'generate' && (
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Business & Brand Information</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="businessType">Business Type</label>
                          <select
                            id="businessType"
                            name="businessType"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                            value={inputs.businessType}
                            onChange={handleInputChange}
                          >
                            <option value="">Select business type</option>
                            <option value="b2c">B2C (Business to Consumer)</option>
                            <option value="b2b">B2B (Business to Business)</option>
                            <option value="service">Service-based</option>
                            <option value="ecommerce">E-commerce</option>
                            <option value="saas">SaaS/Software</option>
                            <option value="nonprofit">Non-profit</option>
                            <option value="personal">Personal Brand</option>
                            <option value="education">Online Education</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="industry">Industry</label>
                          <select
                            id="industry"
                            name="industry"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                            value={inputs.industry}
                            onChange={handleInputChange}
                          >
                            <option value="">Select your industry</option>
                            <option value="technology">Technology</option>
                            <option value="healthcare">Healthcare</option>
                            <option value="finance">Finance</option>
                            <option value="education">Education</option>
                            <option value="retail">Retail</option>
                            <option value="food">Food & Beverage</option>
                            <option value="fitness">Fitness & Wellness</option>
                            <option value="beauty">Beauty & Fashion</option>
                            <option value="consulting">Consulting</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="targetAudience">Target Audience</label>
                        <textarea 
                          id="targetAudience" 
                          name="targetAudience"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Who is your ideal audience? Include demographics, interests, pain points, and behaviors..."
                          value={inputs.targetAudience}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Social Media Strategy</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="primaryPlatforms">Primary Platforms</label>
                          <select
                            id="primaryPlatforms"
                            name="primaryPlatforms"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                            value={inputs.primaryPlatforms}
                            onChange={handleInputChange}
                          >
                            <option value="">Select main platforms</option>
                            <option value="instagram-facebook">Instagram + Facebook</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="twitter">Twitter/X</option>
                            <option value="tiktok">TikTok</option>
                            <option value="youtube">YouTube</option>
                            <option value="pinterest">Pinterest</option>
                            <option value="multi-platform">Multi-platform</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="postingSchedule">Posting Schedule</label>
                          <select
                            id="postingSchedule"
                            name="postingSchedule"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                            value={inputs.postingSchedule}
                            onChange={handleInputChange}
                          >
                            <option value="">Select frequency</option>
                            <option value="daily">Daily</option>
                            <option value="5-times-week">5 times per week</option>
                            <option value="3-times-week">3 times per week</option>
                            <option value="twice-week">Twice per week</option>
                            <option value="once-week">Once per week</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="contentGoals">Content Goals</label>
                        <textarea 
                          id="contentGoals" 
                          name="contentGoals"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="What do you want to achieve with your social media? (e.g., brand awareness, lead generation, engagement)"
                          value={inputs.contentGoals}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="brandPersonality">Brand Personality & Voice</label>
                        <textarea 
                          id="brandPersonality" 
                          name="brandPersonality"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="How should your brand sound and feel? (e.g., friendly, professional, humorous, inspiring)"
                          value={inputs.brandPersonality}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Content Strategy</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="contentTypes">Preferred Content Types</label>
                        <textarea 
                          id="contentTypes" 
                          name="contentTypes"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="What types of content work best for you? (e.g., educational posts, behind-the-scenes, user stories, tips)"
                          value={inputs.contentTypes}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="contentThemes">Content Themes & Topics</label>
                        <textarea 
                          id="contentThemes" 
                          name="contentThemes"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="What topics align with your brand? (e.g., industry trends, company culture, customer success stories)"
                          value={inputs.contentThemes}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="engagementStrategy">Engagement Strategy</label>
                        <textarea 
                          id="engagementStrategy" 
                          name="engagementStrategy"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="How will you encourage interaction? (e.g., questions, polls, contests, user-generated content)"
                          value={inputs.engagementStrategy}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && renderTemplatesTab()}
              
              {activeTab === 'result' && generatedPlan && (
                <div className="space-y-4 max-h-[65vh] overflow-y-auto">
                  {/* Header Section */}
                  <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <i className="fas fa-calendar-alt text-blue-600 text-lg"></i>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">30-Day Social Media Plan</h4>
                        <p className="text-sm text-gray-600">Ready to implement</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          const planText = typeof generatedPlan === 'string' ? 
                            generatedPlan : 
                            JSON.stringify(generatedPlan, null, 2);
                          navigator.clipboard.writeText(planText);
                        }}
                        className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2"
                      >
                        <i className="fas fa-copy text-xs"></i>
                        Copy All
                      </button>
                      <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2">
                        <i className="fas fa-download text-xs"></i>
                        Export
                      </button>
                    </div>
                  </div>
                  
                  {/* Plan Content */}
                  <div className="space-y-3">
                    {generatedPlan?.plan && Array.isArray(generatedPlan.plan) ? (
                      (generatedPlan.plan as any[]).map((dayPlan: any, index: number) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">
                                {dayPlan.day || index + 1}
                              </span>
                              <span className="font-medium text-gray-900">Day {dayPlan.day || index + 1}</span>
                            </div>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                              {dayPlan.content_format || 'Social Post'}
                            </span>
                          </div>
                          
                          <div className="space-y-3">
                            {dayPlan.post_idea && (
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium text-gray-700">Post Idea</span>
                                  <button 
                                    onClick={() => navigator.clipboard.writeText(dayPlan.post_idea)}
                                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                                  >
                                    <i className="fas fa-copy"></i>
                                  </button>
                                </div>
                                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                  {dayPlan.post_idea}
                                </p>
                              </div>
                            )}
                            
                            {dayPlan.caption && (
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium text-gray-700">Caption</span>
                                  <button 
                                    onClick={() => navigator.clipboard.writeText(dayPlan.caption)}
                                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                                  >
                                    <i className="fas fa-copy"></i>
                                  </button>
                                </div>
                                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg italic">
                                  "{dayPlan.caption}"
                                </p>
                              </div>
                            )}
                            
                            {dayPlan.hashtags && Array.isArray(dayPlan.hashtags) && (
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium text-gray-700">Hashtags</span>
                                  <button 
                                    onClick={() => navigator.clipboard.writeText(dayPlan.hashtags.join(' '))}
                                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                                  >
                                    <i className="fas fa-copy"></i>
                                  </button>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {dayPlan.hashtags.map((hashtag: string, hashtagIndex: number) => (
                                    <span key={hashtagIndex} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                      #{hashtag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {dayPlan.call_to_action && (
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium text-gray-700">Call to Action</span>
                                  <button 
                                    onClick={() => navigator.clipboard.writeText(dayPlan.call_to_action)}
                                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                                  >
                                    <i className="fas fa-copy"></i>
                                  </button>
                                </div>
                                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                  {dayPlan.call_to_action}
                                </p>
                              </div>
                            )}
                            
                            {dayPlan.engagement_tactic && (
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium text-gray-700">Engagement Tactic</span>
                                  <button 
                                    onClick={() => navigator.clipboard.writeText(dayPlan.engagement_tactic)}
                                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                                  >
                                    <i className="fas fa-copy"></i>
                                  </button>
                                </div>
                                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                  {dayPlan.engagement_tactic}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                          {typeof generatedPlan === 'string' ? generatedPlan : JSON.stringify(generatedPlan, null, 2)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'history' && (
                <div className="py-4">
                  <History toolName="Social Media Plan" />
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
                  onClick={handleSubmit}
                  disabled={isGenerating}
                  className={`px-5 py-2 text-sm text-white rounded-lg transition-all flex items-center gap-2 shadow-md hover:shadow-lg ${
                    isGenerating 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Plan</span>
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
