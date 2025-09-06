'use client';

import React, { useState } from 'react';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface FreestyleProps {
  onBackClick: () => void;
}

export default function Freestyle({ onBackClick }: FreestyleProps) {
  // State for active tab
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  
  // State for form inputs
  const [formData, setFormData] = useState({
    contentTitle: '',
    contentType: '',
    targetAudience: '',
    contentPurpose: '',
    toneStyle: 'professional',
    keyPoints: '',
    contentLength: 'medium',
    includeIntroduction: true,
    includeConclusion: true,
    additionalNotes: ''
  });

  // State for generated content
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Content template types with appropriate icons
  const contentTypes = [
    { name: "Blog Post", icon: "fas fa-file-alt", description: "Create engaging blog content on any topic." },
    { name: "Social Media Post", icon: "fas fa-heart", description: "Generate catchy social media content that grabs attention." },
    { name: "Product Description", icon: "fas fa-shopping-cart", description: "Write compelling product descriptions that sell." },
    { name: "Creative Writing", icon: "fas fa-pen", description: "Stories, poems, and other creative content." }
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
    setIsGenerating(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate sample content based on inputs
      const sample = generateSampleContent(formData);
      setGeneratedContent(sample);
      
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Freestyle',
          toolId: 'freestyle',
          outputResult: sample,
          prompt: JSON.stringify(formData)
        });
        console.log('✅ Freestyle content saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to generate sample content
  const generateSampleContent = (data: any) => {
    const { contentTitle, contentType, contentPurpose, toneStyle } = data;
    return `# ${contentTitle}\n\nThis is a sample ${contentType} written in a ${toneStyle} tone.\n\nThe purpose of this content is: ${contentPurpose}.\n\n[Generated content would appear here]`;
  };

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Glassmorphic Header with blue gradient */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-pencil-alt text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Freestyle Content Generator</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create custom content for any purpose with AI assistance</p>
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
                  {/* Input Fields */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-blue-900" htmlFor="contentTitle">Content Title</label>
                    <div className="relative group">
                      <input 
                        id="contentTitle" 
                        name="contentTitle"
                        className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all" 
                        placeholder="Enter a title for your content"
                        type="text"
                        value={formData.contentTitle}
                        onChange={handleInputChange}
                      />
                      <div className="absolute top-1/2 right-3 transform -translate-y-1/2 text-blue-300 opacity-0 group-focus-within:opacity-100 transition-opacity">
                        <i className="fas fa-heading text-xs"></i>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-blue-900" htmlFor="contentType">Content Type</label>
                      <div className="relative group">
                        <select
                          id="contentType"
                          name="contentType"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          value={formData.contentType}
                          onChange={handleInputChange}
                        >
                          <option value="">Select content type</option>
                          <option value="blog_post">Blog Post</option>
                          <option value="social_media">Social Media Post</option>
                          <option value="email">Email</option>
                          <option value="article">Article</option>
                          <option value="product_description">Product Description</option>
                          <option value="creative">Creative Writing</option>
                          <option value="other">Other</option>
                        </select>
                        <div className="absolute top-1/2 right-3 transform -translate-y-1/2 text-blue-300 pointer-events-none">
                          <i className="fas fa-chevron-down text-xs"></i>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-blue-900" htmlFor="toneStyle">Tone & Style</label>
                      <div className="relative group">
                        <select
                          id="toneStyle"
                          name="toneStyle"
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          value={formData.toneStyle}
                          onChange={handleInputChange}
                        >
                          <option value="professional">Professional</option>
                          <option value="conversational">Conversational</option>
                          <option value="humorous">Humorous</option>
                          <option value="inspirational">Inspirational</option>
                          <option value="formal">Formal</option>
                          <option value="persuasive">Persuasive</option>
                          <option value="educational">Educational</option>
                        </select>
                        <div className="absolute top-1/2 right-3 transform -translate-y-1/2 text-blue-300 pointer-events-none">
                          <i className="fas fa-chevron-down text-xs"></i>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-blue-900" htmlFor="targetAudience">Target Audience</label>
                    <div className="relative group">
                      <input 
                        id="targetAudience" 
                        name="targetAudience"
                        className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all" 
                        placeholder="Who is this content for?"
                        type="text"
                        value={formData.targetAudience}
                        onChange={handleInputChange}
                      />
                      <div className="absolute top-1/2 right-3 transform -translate-y-1/2 text-blue-300 opacity-0 group-focus-within:opacity-100 transition-opacity">
                        <i className="fas fa-users text-xs"></i>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-blue-900" htmlFor="contentPurpose">Content Purpose</label>
                    <div className="relative group">
                      <textarea 
                        id="contentPurpose" 
                        name="contentPurpose"
                        className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all resize-none h-16" 
                        placeholder="What do you want to achieve with this content?"
                        value={formData.contentPurpose}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-blue-900" htmlFor="keyPoints">Key Points to Include</label>
                    <div className="relative group">
                      <textarea 
                        id="keyPoints" 
                        name="keyPoints"
                        className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all resize-none h-20" 
                        placeholder="List any specific points you want to include in the content"
                        value={formData.keyPoints}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-blue-900" htmlFor="contentLength">Content Length</label>
                    <div className="relative group">
                      <select
                        id="contentLength"
                        name="contentLength"
                        className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                        value={formData.contentLength}
                        onChange={handleInputChange}
                      >
                        <option value="short">Short (&lt; 300 words)</option>
                        <option value="medium">Medium (300-800 words)</option>
                        <option value="long">Long (&gt; 800 words)</option>
                      </select>
                      <div className="absolute top-1/2 right-3 transform -translate-y-1/2 text-blue-300 pointer-events-none">
                        <i className="fas fa-chevron-down text-xs"></i>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="includeIntroduction"
                        name="includeIntroduction"
                        checked={formData.includeIntroduction}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                      />
                      <label htmlFor="includeIntroduction" className="text-sm text-blue-900">
                        Include introduction
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="includeConclusion"
                        name="includeConclusion"
                        checked={formData.includeConclusion}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                      />
                      <label htmlFor="includeConclusion" className="text-sm text-blue-900">
                        Include conclusion
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-blue-900" htmlFor="additionalNotes">Additional Notes</label>
                    <div className="relative group">
                      <textarea 
                        id="additionalNotes" 
                        name="additionalNotes"
                        className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all resize-none h-16" 
                        placeholder="Any other instructions or notes for content generation"
                        value={formData.additionalNotes}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && (
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {contentTypes.map((contentType, index) => (
                    <div key={index} className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
                            <i className={`${contentType.icon} text-blue-600`}></i>
                          </div>
                          <div>
                            <h4 className="font-medium text-blue-900">{contentType.name}</h4>
                            <p className="text-xs text-blue-600">{contentType.description}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            setFormData(prev => ({...prev, contentType: contentType.name}));
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
                  <History toolName="Freestyle" />
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
                  className="px-5 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                >
                  <span>Generate Content</span>
                  <i className="fas fa-arrow-right text-xs group-hover:translate-x-0.5 transition-transform"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
