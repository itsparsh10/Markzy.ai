'use client';

import React, { useState } from 'react';
import GlobalHistorySection from './shared/GlobalHistorySection';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface BlogGeneratorProps {
  onBackClick: () => void;
}

interface HistoryItem {
  _id: string;
  toolName: string;
  toolId: string;
  outputResult: any;
  generatedDate: string;
  userId: string;
}

export default function BlogGenerator({ onBackClick }: BlogGeneratorProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'result' | 'templates' | 'history'>('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputs, setInputs] = useState({
    blogTopic: '',
    blogType: '',
    targetAudience: '',
    blogLength: '',
    blogTone: '',
    keyPoints: '',
    callToAction: '',
    seoKeywords: '',
    brandVoice: '',
    contentStructure: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  // Helper function to format text with bold headings
  const formatTextWithBold = (text: string) => {
    if (!text) return null;
    
    return text.split('\n').map((line, index) => {
      // Check if line is a heading (contains : or is all caps or starts with numbers)
      const isHeading = line.includes(':') && line.length < 100 || 
                       /^[A-Z\s\d\-\.]+:/.test(line) ||
                       /^\d+\./.test(line.trim()) ||
                       /^[A-Z\s]{3,}$/.test(line.trim()) ||
                       /^#+\s/.test(line.trim()); // Markdown headers
      
      if (isHeading) {
        return (
          <div key={index} className="font-bold text-blue-900 mt-4 mb-2 text-base border-b border-blue-100 pb-1">
            {line.replace(/^#+\s/, '')} {/* Remove markdown # */}
          </div>
        );
      }
      
      // Format bullet points
      if (line.trim().startsWith('-') || line.trim().startsWith('•') || line.trim().startsWith('*')) {
        return (
          <div key={index} className="ml-4 mb-1 text-sm text-gray-700 flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>{line.replace(/^[-•*]\s*/, '')}</span>
          </div>
        );
      }
      
      // Regular text
      if (line.trim()) {
        return (
          <div key={index} className="mb-2 text-sm text-gray-700 leading-relaxed">
            {line}
          </div>
        );
      }
      
      return <div key={index} className="mb-2"></div>;
    });
  };

  const formatContentForCopy = (content: any) => {
    if (typeof content === 'string') return content;
    
    if (content.blog_content || content.content || content.blog_post || content.generated_content) {
      return content.blog_content || content.content || content.blog_post || content.generated_content;
    }
    
    return Object.entries(content)
      .filter(([key, value]) => typeof value === 'string' && value.length > 50)
      .map(([key, value]) => `${key.replace(/_/g, ' ').toUpperCase()}:\n${value}`)
      .join('\n\n') || JSON.stringify(content);
  };

  const formatBlogOutput = (content: any) => {
    // Check for main content fields
    if (content.blog_content) {
      return (
        <div className="space-y-2">
          <div className="font-bold text-lg text-blue-900 mb-4 flex items-center gap-2">
            <i className="fas fa-edit text-blue-600"></i>
            Generated Blog Post
          </div>
          <div className="prose prose-sm max-w-none">
            {formatTextWithBold(content.blog_content)}
          </div>
        </div>
      );
    }

    if (content.content) {
      return (
        <div className="space-y-2">
          <div className="font-bold text-lg text-blue-900 mb-4 flex items-center gap-2">
            <i className="fas fa-edit text-blue-600"></i>
            Blog Content
          </div>
          <div className="prose prose-sm max-w-none">
            {formatTextWithBold(content.content)}
          </div>
        </div>
      );
    }

    if (content.blog_post) {
      return (
        <div className="space-y-2">
          <div className="font-bold text-lg text-blue-900 mb-4 flex items-center gap-2">
            <i className="fas fa-edit text-blue-600"></i>
            Blog Post
          </div>
          <div className="prose prose-sm max-w-none">
            {formatTextWithBold(content.blog_post)}
          </div>
        </div>
      );
    }

    if (content.generated_content) {
      return (
        <div className="space-y-2">
          <div className="font-bold text-lg text-blue-900 mb-4 flex items-center gap-2">
            <i className="fas fa-edit text-blue-600"></i>
            Generated Content
          </div>
          <div className="prose prose-sm max-w-none">
            {formatTextWithBold(content.generated_content)}
          </div>
        </div>
      );
    }

    // Filter out common input parameters that shouldn't be displayed as content
    const inputFields = [
      'blog_topic', 'blog_type', 'blog_length', 'target_audience', 'blog_tone',
      'key_points_to_cover', 'seo_keywords', 'brand_voice', 'call_to_action',
      'content_structure', 'products_services', 'brand_name', 'business_type',
      'industry', 'keyword_focus', 'main_competitors', 'content_goals', 'brand_values'
    ];

    // Handle multiple fields or structured data
    const contentFields = Object.entries(content)
      .filter(([key, value]) => 
        typeof value === 'string' && 
        value.length > 50 && 
        !inputFields.includes(key)
      );

    if (contentFields.length > 0) {
      return (
        <div className="space-y-6">
          <div className="font-bold text-lg text-blue-900 mb-4 flex items-center gap-2">
            <i className="fas fa-edit text-blue-600"></i>
            Generated Blog Post
          </div>
          {contentFields.map(([key, value]) => (
            <div key={key} className="border border-blue-100 rounded-lg p-4 bg-blue-50/30">
              <h4 className="font-bold text-blue-900 capitalize mb-3 flex items-center gap-2 text-base border-b border-blue-200 pb-2">
                <i className="fas fa-file-alt text-blue-600 text-sm"></i>
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

    // Fallback for any unexpected content structure
    return (
      <div className="space-y-2">
        <div className="font-bold text-lg text-blue-900 mb-4 flex items-center gap-2">
          <i className="fas fa-edit text-blue-600"></i>
          Generated Content
        </div>
        <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
          <p>Content is being processed. Please try generating again.</p>
        </div>
      </div>
    );
  };

  const handleGenerate = async () => {
    // Validation
    if (!inputs.blogTopic || !inputs.blogType || !inputs.targetAudience || !inputs.blogLength || !inputs.blogTone) {
      alert('Please fill in all required fields: Blog Topic, Blog Type, Target Audience, Blog Length, and Blog Tone');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Dynamic import for ES modules
      const { aiToolsService } = await import('../../services/aiTools.js');
      
      // Map UI values to API format
      const requestData = {
        blog_topic: inputs.blogTopic,
        blog_type: inputs.blogType,
        blog_length: inputs.blogLength,
        target_audience: inputs.targetAudience,
        blog_tone: inputs.blogTone,
        key_points_to_cover: inputs.keyPoints || 'General topics related to the blog subject',
        seo_keywords: inputs.seoKeywords || 'relevant keywords',
        brand_voice: inputs.brandVoice || 'professional',
        call_to_action: inputs.callToAction || 'Learn more about our services'
      };

      console.log('Sending blog generator request:', requestData);
      const response = await aiToolsService.generateBlogPost(requestData);
      console.log('Blog generator response:', response);
      setGeneratedContent(response);
      setActiveTab('result'); // Switch to result tab after successful generation
      
      // Save to tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Blog Generator',
          toolId: 'blog-generator',
          outputResult: response,
          prompt: JSON.stringify(requestData)
        });
        console.log('✅ Blog generator saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
      
    } catch (error: any) {
      // Error handling with user-friendly messages
      let errorMessage = 'Failed to generate blog post. Please try again.';
      
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

  const blogTemplates = [
    { name: "How-To Guide", icon: "fas fa-list-ol", description: "Step-by-step tutorials and instructional content for your audience." },
    { name: "Listicle", icon: "fas fa-list", description: "Engaging list-based articles that are easy to read and share." },
    { name: "Educational Article", icon: "fas fa-graduation-cap", description: "In-depth educational content to establish thought leadership." },
    { name: "Case Study", icon: "fas fa-chart-line", description: "Success stories and detailed analysis of results." },
    { name: "Opinion Piece", icon: "fas fa-comment", description: "Share your perspective on industry trends and topics." },
    { name: "Resource Roundup", icon: "fas fa-bookmark", description: "Curated lists of tools, resources, and recommendations." }
  ];

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Glassmorphic Header with blue gradient */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-edit text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Blog Generator</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create comprehensive blog posts for your website</p>
            </div>
            <div className="flex items-center gap-3 z-10">
              <span className="text-xs bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/30 flex items-center font-semibold text-white/90">
                <i className="fas fa-clock mr-1"></i> 6 min
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
                      <i className="fas fa-blog text-xs"></i>
                      Generated Blog
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
                            <h4 className="text-green-800 font-semibold">Blog Generated Successfully!</h4>
                            <p className="text-green-600 text-sm">Your blog post is ready to view.</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveTab('result')}
                          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center gap-2"
                        >
                          <i className="fas fa-eye text-xs"></i>
                          View Blog
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Blog Topic & Type */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Blog Topic & Type</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="blogTopic">Blog Topic</label>
                        <input
                          id="blogTopic"
                          name="blogTopic"
                          type="text"
                          value={inputs.blogTopic}
                          onChange={handleInputChange}
                          placeholder="What is your blog post about?"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="blogType">Blog Type</label>
                          <select
                            id="blogType"
                            name="blogType"
                            value={inputs.blogType}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select blog type</option>
                            <option value="how-to">How-To Guide</option>
                            <option value="listicle">Listicle</option>
                            <option value="educational">Educational Article</option>
                            <option value="case-study">Case Study</option>
                            <option value="opinion">Opinion Piece</option>
                            <option value="roundup">Resource Roundup</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="blogLength">Blog Length</label>
                          <select
                            id="blogLength"
                            name="blogLength"
                            value={inputs.blogLength}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select length</option>
                            <option value="short">Short (500-800 words)</option>
                            <option value="medium">Medium (800-1500 words)</option>
                            <option value="long">Long (1500+ words)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Strategy */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Content Strategy</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="targetAudience">Target Audience</label>
                          <textarea 
                            id="targetAudience"
                            name="targetAudience"
                            value={inputs.targetAudience}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                            placeholder="Who is this blog post for?"
                          ></textarea>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="blogTone">Blog Tone</label>
                          <select
                            id="blogTone"
                            name="blogTone"
                            value={inputs.blogTone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select tone</option>
                            <option value="professional">Professional</option>
                            <option value="conversational">Conversational</option>
                            <option value="educational">Educational</option>
                            <option value="inspiring">Inspiring</option>
                            <option value="casual">Casual</option>
                            <option value="authoritative">Authoritative</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="keyPoints">Key Points to Cover</label>
                        <textarea 
                          id="keyPoints"
                          name="keyPoints"
                          value={inputs.keyPoints}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="What key points should be covered in this blog post?"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  {/* SEO & Optimization */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">SEO & Optimization</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="seoKeywords">SEO Keywords</label>
                          <input
                            id="seoKeywords"
                            name="seoKeywords"
                            type="text"
                            value={inputs.seoKeywords}
                            onChange={handleInputChange}
                            placeholder="Enter keywords separated by commas"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="brandVoice">Brand Voice</label>
                          <input
                            id="brandVoice"
                            name="brandVoice"
                            type="text"
                            value={inputs.brandVoice}
                            onChange={handleInputChange}
                            placeholder="e.g., friendly, expert, approachable"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="callToAction">Call to Action (optional)</label>
                        <textarea 
                          id="callToAction"
                          name="callToAction"
                          value={inputs.callToAction}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="What action do you want readers to take?"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && (
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {blogTemplates.map((template, index) => (
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
                          onClick={() => {
                            setInputs(prev => ({...prev, blogType: template.name.toLowerCase().replace(' ', '-')}));
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
              
              {activeTab === 'result' && generatedContent && (
                <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
                  {/* Blog Title */}
                  {generatedContent.title && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center gap-2">
                        <i className="fas fa-heading text-green-600"></i>
                        Blog Title
                      </h3>
                      <div className="bg-white p-3 rounded-lg border border-green-100">
                        <p className="text-gray-800 text-base font-medium leading-relaxed">{generatedContent.title}</p>
                      </div>
                    </div>
                  )}

                  {/* Blog Content */}
                  {generatedContent.content && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-blue-800 mb-2 flex items-center gap-2">
                        <i className="fas fa-file-alt text-blue-600"></i>
                        Blog Content
                      </h3>
                      <div className="bg-white p-4 rounded-lg border border-blue-100">
                        <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">{generatedContent.content}</div>
                      </div>
                    </div>
                  )}

                  {/* Meta Description */}
                  {generatedContent.metaDescription && (
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-purple-800 mb-2 flex items-center gap-2">
                        <i className="fas fa-tag text-purple-600"></i>
                        Meta Description
                      </h3>
                      <div className="bg-white p-3 rounded-lg border border-purple-100">
                        <p className="text-gray-800 leading-relaxed">{generatedContent.metaDescription}</p>
                      </div>
                    </div>
                  )}

                  {/* SEO Keywords */}
                  {generatedContent.seoKeywords && generatedContent.seoKeywords.length > 0 && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                        <i className="fas fa-search text-yellow-600"></i>
                        SEO Keywords
                      </h3>
                      <div className="bg-white p-3 rounded-lg border border-yellow-100">
                        <div className="flex flex-wrap gap-2">
                          {generatedContent.seoKeywords.map((keyword: string, index: number) => (
                            <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full border border-yellow-200">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Blog Tags */}
                  {generatedContent.tags && generatedContent.tags.length > 0 && (
                    <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-indigo-800 mb-2 flex items-center gap-2">
                        <i className="fas fa-tags text-indigo-600"></i>
                        Blog Tags
                      </h3>
                      <div className="bg-white p-3 rounded-lg border border-indigo-100">
                        <div className="flex flex-wrap gap-2">
                          {generatedContent.tags.map((tag: string, index: number) => (
                            <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full border border-indigo-200">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Call to Action */}
                  {generatedContent.callToAction && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-red-800 mb-2 flex items-center gap-2">
                        <i className="fas fa-bullhorn text-red-600"></i>
                        Call to Action
                      </h3>
                      <div className="bg-white p-3 rounded-lg border border-red-100">
                        <p className="text-gray-800 leading-relaxed">{generatedContent.callToAction}</p>
                      </div>
                    </div>
                  )}

                  {/* Reading Time & Word Count */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <h3 className="text-base font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <i className="fas fa-clock text-gray-600"></i>
                        Estimated Reading Time
                      </h3>
                      <div className="bg-white p-3 rounded-lg border border-gray-100">
                        <p className="text-gray-800 text-lg font-medium">
                          {generatedContent.content ? Math.ceil(generatedContent.content.split(' ').length / 200) : 0} min read
                        </p>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <h3 className="text-base font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <i className="fas fa-file-word text-gray-600"></i>
                        Word Count
                      </h3>
                      <div className="bg-white p-3 rounded-lg border border-gray-100">
                        <p className="text-gray-800 text-lg font-medium">
                          {generatedContent.content ? generatedContent.content.split(' ').length : 0} words
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-4">
                    <button
                      onClick={() => navigator.clipboard.writeText(generatedContent.content || '')}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
                    >
                      <i className="fas fa-copy"></i>
                      Copy Content
                    </button>
                    <button
                      onClick={() => {
                        const element = document.createElement('a');
                        const file = new Blob([generatedContent.content || ''], { type: 'text/plain' });
                        element.href = URL.createObjectURL(file);
                        element.download = `${generatedContent.title?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'blog_post'}.txt`;
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
                  <History toolName="Blog Generator" />
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
                      Generated Blog Post
                    </h3>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          const contentToFormat = formatContentForCopy(generatedContent);
                          navigator.clipboard.writeText(contentToFormat);
                        }}
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
                  <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
                    {formatBlogOutput(generatedContent)}
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
                      <span>Generate Blog Post</span>
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
