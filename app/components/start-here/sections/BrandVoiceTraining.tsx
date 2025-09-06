'use client';
import React, { useState } from 'react';

const voiceAttributes = [
  { id: 'professional', label: 'Professional', icon: 'fas fa-briefcase' },
  { id: 'friendly', label: 'Friendly', icon: 'fas fa-smile' },
  { id: 'casual', label: 'Casual', icon: 'fas fa-coffee' },
  { id: 'authoritative', label: 'Authoritative', icon: 'fas fa-crown' },
  { id: 'playful', label: 'Playful', icon: 'fas fa-heart' },
  { id: 'inspiring', label: 'Inspiring', icon: 'fas fa-star' }
];

const industries = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'Retail',
  'Real Estate', 'Food & Beverage', 'Travel', 'Fitness', 'Other'
];

export default function BrandVoiceTraining() {
  const [selectedVoice, setSelectedVoice] = useState<string[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [brandDescription, setBrandDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [brandValues, setBrandValues] = useState('');
  const [competitorExample, setCompetitorExample] = useState('');
  const [contentSample, setContentSample] = useState('');

  const handleVoiceToggle = (voiceId: string) => {
    setSelectedVoice(prev => 
      prev.includes(voiceId) 
        ? prev.filter(id => id !== voiceId)
        : [...prev, voiceId]
    );
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-5 py-2 rounded-full text-sm font-medium mb-6 shadow-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            Brand Voice Setup
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent mb-6">
            Train Your Brand Voice
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Help our AI understand your unique brand personality to create content that truly represents your voice and resonates with your audience.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center font-semibold shadow-md">1</div>
              <span className="ml-3 font-medium text-gray-900">Basic Info</span>
            </div>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full"></div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-400 to-indigo-500 text-white rounded-full flex items-center justify-center font-semibold shadow-md">2</div>
              <span className="ml-3 font-medium text-gray-700">Voice Style</span>
            </div>
            <div className="w-16 h-1 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-full"></div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-500 text-white rounded-full flex items-center justify-center font-semibold shadow-md">3</div>
              <span className="ml-3 font-medium text-gray-700">Content Sample</span>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="space-y-12">
          
          {/* Industry Selection */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-building text-white"></i>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">What industry are you in?</h3>
                <p className="text-gray-600 text-sm">This helps us understand your market context and industry-specific language.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {industries.map((industry) => (
                <button
                  key={industry}
                  onClick={() => setSelectedIndustry(industry)}
                  className={`p-4 rounded-xl border transition-all duration-200 text-sm font-medium hover:shadow-sm hover:scale-105 ${
                    selectedIndustry === industry
                      ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-md ring-1 ring-blue-200'
                      : 'border-gray-200 hover:border-blue-300 text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/50'
                  }`}
                >
                  {industry}
                </button>
              ))}
            </div>
          </div>

          {/* Target Audience */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <i className="fas fa-users text-white"></i>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">Who is your target audience?</h3>
                <p className="text-gray-600 text-sm">Describe your ideal customers - their demographics, interests, and pain points.</p>
              </div>
            </div>
            <textarea
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g., Small business owners aged 30-50 who struggle with marketing and need simple, effective solutions. They value authenticity and practical advice over complex strategies..."
              className="w-full h-24 p-4 border border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 resize-none text-gray-700 placeholder:text-gray-400 transition-colors"
              maxLength={300}
            />
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-gray-500">
                {targetAudience.length}/300 characters
              </span>
              {targetAudience.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-indigo-600">
                  <i className="fas fa-check-circle"></i>
                  Looking good!
                </div>
              )}
            </div>
          </div>

          {/* Voice Attributes */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <i className="fas fa-palette text-white"></i>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">How would you describe your brand voice?</h3>
                <p className="text-gray-600 text-sm">Select up to 3 attributes that best represent how you want to sound to your audience.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {voiceAttributes.map((voice) => (
                <button
                  key={voice.id}
                  onClick={() => handleVoiceToggle(voice.id)}
                  disabled={selectedVoice.length >= 3 && !selectedVoice.includes(voice.id)}
                  className={`p-6 rounded-xl border transition-all duration-200 hover:shadow-sm hover:scale-105 ${
                    selectedVoice.includes(voice.id)
                      ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 shadow-md ring-1 ring-purple-200'
                      : 'border-gray-200 hover:border-purple-300 text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-purple-50/50 disabled:opacity-50'
                  }`}
                >
                  <i className={`${voice.icon} text-2xl mb-4 block ${selectedVoice.includes(voice.id) ? 'text-purple-600' : 'text-gray-400'}`}></i>
                  <span className="font-medium block mt-2">{voice.label}</span>
                </button>
              ))}
            </div>
            {selectedVoice.length > 0 && (
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                <div className="flex items-center gap-2 mb-2">
                  <i className="fas fa-check-circle text-purple-600"></i>
                  <span className="font-medium text-purple-800">Selected voice attributes:</span>
                </div>
                <p className="text-sm text-purple-700">
                  {selectedVoice.join(', ')}
                  <span className="text-purple-500 ml-2">({selectedVoice.length}/3)</span>
                </p>
              </div>
            )}
          </div>

          {/* Brand Description */}
          <div className="border-b border-gray-100 pb-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Tell us about your brand</h3>
            <p className="text-gray-600 mb-6">Share your brand's story, mission, values, and what makes you unique in the market.</p>
            <textarea
              value={brandDescription}
              onChange={(e) => setBrandDescription(e.target.value)}
              placeholder="Describe your brand's mission, values, personality, and what makes you different from competitors. Include your brand's origin story, core beliefs, and the transformation you provide to customers..."
              className="w-full h-32 p-4 border border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 resize-none text-gray-700 placeholder:text-gray-400"
              maxLength={800}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">
                {brandDescription.length}/800 characters
              </span>
            </div>
          </div>

          {/* Brand Values */}
          <div className="border-b border-gray-100 pb-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">What are your core brand values?</h3>
            <p className="text-gray-600 mb-6">List 3-5 core values that guide your business decisions and shape your brand identity.</p>
            <textarea
              value={brandValues}
              onChange={(e) => setBrandValues(e.target.value)}
              placeholder="e.g., Authenticity, Innovation, Customer Success, Sustainability, Transparency..."
              className="w-full h-20 p-4 border border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 resize-none text-gray-700 placeholder:text-gray-400"
              maxLength={200}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">
                {brandValues.length}/200 characters
              </span>
            </div>
          </div>

          {/* Content Sample */}
          <div className="border-b border-gray-100 pb-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Share a sample of your existing content</h3>
            <p className="text-gray-600 mb-6">Paste an example of content you've written that represents your brand voice well (social post, email, blog excerpt, etc.).</p>
            <textarea
              value={contentSample}
              onChange={(e) => setContentSample(e.target.value)}
              placeholder="Paste a sample of your writing here - this could be from a social media post, email newsletter, blog article, or any other content that represents your authentic voice..."
              className="w-full h-32 p-4 border border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 resize-none text-gray-700 placeholder:text-gray-400"
              maxLength={1000}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">
                {contentSample.length}/1000 characters
              </span>
            </div>
          </div>

          {/* Competitor Example (Optional) */}
          <div className="border-b border-gray-100 pb-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Competitor or inspiration example <span className="text-sm font-normal text-gray-500">(Optional)</span></h3>
            <p className="text-gray-600 mb-6">Share an example of content from a competitor or brand you admire. Tell us what you like or dislike about their voice.</p>
            <textarea
              value={competitorExample}
              onChange={(e) => setCompetitorExample(e.target.value)}
              placeholder="Paste competitor content and explain what you like/dislike about their approach. This helps us understand what you want to emulate or avoid..."
              className="w-full h-24 p-4 border border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 resize-none text-gray-700 placeholder:text-gray-400"
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">
                {competitorExample.length}/500 characters
              </span>
            </div>
          </div>

          {/* AI Preview */}
          {selectedVoice.length > 0 && brandDescription.trim() && selectedIndustry && (
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 border border-blue-200/50 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <i className="fas fa-robot text-white text-lg"></i>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">AI Voice Profile Preview</h4>
                  <p className="text-sm text-gray-600">Here's how your AI will understand your brand</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="font-medium text-gray-700">Industry:</span>
                    <span className="text-gray-600">{selectedIndustry}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="font-medium text-gray-700">Voice Style:</span>
                    <span className="text-gray-600">{selectedVoice.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span className="font-medium text-gray-700">Target Audience:</span>
                    <span className="text-gray-600">{targetAudience.slice(0, 50)}...</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <span className="font-medium text-gray-700">Brand Values:</span>
                    <span className="text-gray-600">{brandValues.slice(0, 50)}...</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-white/70 rounded-xl border border-white/50 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <i className="fas fa-lightbulb text-amber-500"></i>
                    <p className="text-sm font-medium text-gray-700">Sample AI-generated content preview:</p>
                  </div>
                  <p className="text-gray-700 italic">
                    "Your AI will generate content that sounds {selectedVoice.join(' and ')} while speaking to {targetAudience.split(' ').slice(0, 5).join(' ')}... in the {selectedIndustry.toLowerCase()} industry."
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="text-center pt-8">
            <button 
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-12 py-4 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
              disabled={selectedVoice.length === 0 || !selectedIndustry || !brandDescription.trim() || !targetAudience.trim()}
            >
              <div className="flex items-center justify-center gap-3">
                <i className="fas fa-magic group-hover:animate-pulse"></i>
                <span>Train My Brand Voice AI</span>
                <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
              </div>
            </button>
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
              <i className="fas fa-shield-alt text-green-500"></i>
              <p>This will create a secure, custom AI model trained on your brand voice</p>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="pt-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent mb-4">
                Why Brand Voice Training Matters
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Invest 5 minutes in training to save hours of editing and create consistently amazing content
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                  <i className="fas fa-bullseye text-3xl text-white"></i>
                </div>
                <h4 className="font-semibold text-gray-900 mb-3 text-lg">Brand Consistency</h4>
                <p className="text-gray-600 text-sm leading-relaxed">Maintain a consistent voice across all marketing channels and touchpoints, building stronger brand recognition.</p>
              </div>
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                  <i className="fas fa-clock text-3xl text-white"></i>
                </div>
                <h4 className="font-semibold text-gray-900 mb-3 text-lg">Time Savings</h4>
                <p className="text-gray-600 text-sm leading-relaxed">Reduce editing time by 70% with AI that already understands your style, tone, and messaging preferences.</p>
              </div>
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                  <i className="fas fa-heart text-3xl text-white"></i>
                </div>
                <h4 className="font-semibold text-gray-900 mb-3 text-lg">Audience Connection</h4>
                <p className="text-gray-600 text-sm leading-relaxed">Create content that resonates deeply with your target audience and builds authentic relationships.</p>
              </div>
            </div>
            
            {/* Additional stats */}
            <div className="mt-16 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">70%</div>
                  <p className="text-sm text-gray-600">Less editing time required</p>
                </div>
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">95%</div>
                  <p className="text-sm text-gray-600">Brand voice accuracy</p>
                </div>
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">3x</div>
                  <p className="text-sm text-gray-600">Faster content creation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
