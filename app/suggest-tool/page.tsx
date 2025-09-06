"use client";

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

interface ToolSuggestion {
  id: string;
  toolName: string;
  description: string;
  category: string;
  useCase: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  createdAt: Date;
  userEmail: string;
  userName: string;
}

export default function SuggestTool() {
  const [suggestionForm, setSuggestionForm] = useState({
    toolName: '',
    description: '',
    category: '',
    useCase: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    userEmail: '',
    userName: ''
  });

  const toolCategories = [
    'Content Creation',
    'Social Media',
    'Email Marketing',
    'SEO & Analytics',
    'Sales & Funnels',
    'Brand Management',
    'Product Marketing',
    'Customer Research',
    'Automation',
    'Integration',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      const user = userData ? JSON.parse(userData) : null;

      const suggestionData = {
        ...suggestionForm,
        userEmail: user?.email || suggestionForm.userEmail,
        userName: user?.name || suggestionForm.userName,
        createdAt: new Date().toISOString()
      };

      const response = await fetch('/api/help-center/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(suggestionData)
      });

      if (response.ok) {
        alert('Thank you for your suggestion! We will review it and get back to you.');
        setSuggestionForm({
          toolName: '',
          description: '',
          category: '',
          useCase: '',
          priority: 'medium',
          userEmail: '',
          userName: ''
        });
      } else {
        alert('Failed to submit suggestion. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex h-screen bg-slate-50/30">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-slate-200/50 px-8 py-6">
          <div className="w-full">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center">
                <i className="fas fa-lightbulb text-slate-600 text-xl"></i>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Suggest a Tool</h1>
                <p className="text-slate-600">Help us improve Markzy by suggesting new features and AI tools</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full p-8">
          {/* Markzy Innovation Stats */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-slate-200/50 p-8 mb-8 shadow-lg">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-lg">
                <i className="fas fa-rocket text-white text-2xl"></i>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Markzy Innovation Hub</h2>
                <p className="text-slate-600 text-lg">Your ideas drive the future of AI marketing tools</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/80 p-6 rounded-2xl border border-blue-200/50 shadow-md text-center">
                <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-lightbulb text-white text-xl"></i>
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2">850+</div>
                <p className="text-slate-700 font-medium">Ideas Submitted</p>
                <p className="text-sm text-slate-500 mt-1">Community suggestions</p>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/80 p-6 rounded-2xl border border-emerald-200/50 shadow-md text-center">
                <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-check-circle text-white text-xl"></i>
                </div>
                <div className="text-3xl font-bold text-emerald-600 mb-2">127</div>
                <p className="text-slate-700 font-medium">Tools Implemented</p>
                <p className="text-sm text-slate-500 mt-1">From user suggestions</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100/80 p-6 rounded-2xl border border-purple-200/50 shadow-md text-center">
                <div className="w-14 h-14 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-clock text-white text-xl"></i>
                </div>
                <div className="text-3xl font-bold text-purple-600 mb-2">14</div>
                <p className="text-slate-700 font-medium">Days Avg</p>
                <p className="text-sm text-slate-500 mt-1">Review time</p>
              </div>
              
              <div className="bg-gradient-to-br from-amber-50 to-amber-100/80 p-6 rounded-2xl border border-amber-200/50 shadow-md text-center">
                <div className="w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-star text-white text-xl"></i>
                </div>
                <div className="text-3xl font-bold text-amber-600 mb-2">4.8</div>
                <p className="text-slate-700 font-medium">User Rating</p>
                <p className="text-sm text-slate-500 mt-1">Implementation quality</p>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-slate-200/50 p-8 mb-8 shadow-lg">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <i className="fas fa-comments text-white text-xl"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Share Your Markzy Ideas</h2>
                <p className="text-slate-600">We love hearing from our users! Your suggestions help us build better AI marketing tools.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100/80 rounded-2xl border border-blue-200/50 shadow-sm">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-ear-listen text-white text-lg"></i>
                </div>
                <h3 className="font-bold text-slate-800 mb-2">We Listen</h3>
                <p className="text-sm text-slate-600">Every Markzy suggestion is reviewed by our product team</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100/80 rounded-2xl border border-emerald-200/50 shadow-sm">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-rocket text-white text-lg"></i>
                </div>
                <h3 className="font-bold text-slate-800 mb-2">We Build</h3>
                <p className="text-sm text-slate-600">Popular suggestions become new Markzy features and tools</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100/80 rounded-2xl border border-purple-200/50 shadow-sm">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-bell text-white text-lg"></i>
                </div>
                <h3 className="font-bold text-slate-800 mb-2">We Update</h3>
                <p className="text-sm text-slate-600">You'll be notified when your Markzy idea is implemented</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-amber-100/80 rounded-2xl border border-amber-200/50 shadow-sm">
                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-gift text-white text-lg"></i>
                </div>
                <h3 className="font-bold text-slate-800 mb-2">We Reward</h3>
                <p className="text-sm text-slate-600">Contributors get early access to new Markzy features</p>
              </div>
            </div>
          </div>

          {/* Popular Request Categories */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-slate-200/50 p-8 mb-8 shadow-lg">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <i className="fas fa-fire text-white text-xl"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Most Requested Markzy Features</h2>
                <p className="text-slate-600">See what the Markzy community is asking for</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/80 p-6 rounded-2xl border border-blue-200/50 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                    <i className="fas fa-video text-white"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">AI Video Tools</h3>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">85 requests</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600">Video script generation, editing tools, and automated video creation for Markzy</p>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/80 p-6 rounded-2xl border border-emerald-200/50 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                    <i className="fas fa-chart-line text-white"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Advanced Analytics</h3>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">73 requests</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600">Deep insights, performance tracking, and ROI analysis for Markzy campaigns</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100/80 p-6 rounded-2xl border border-purple-200/50 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                    <i className="fas fa-mobile-alt text-white"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Mobile App</h3>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">67 requests</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600">Native mobile app for accessing Markzy tools on the go</p>
              </div>
              
              <div className="bg-gradient-to-br from-amber-50 to-amber-100/80 p-6 rounded-2xl border border-amber-200/50 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                    <i className="fas fa-link text-white"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">More Integrations</h3>
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">59 requests</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600">Connect Markzy with more platforms like Zapier, HubSpot, and Shopify</p>
              </div>
              
              <div className="bg-gradient-to-br from-rose-50 to-rose-100/80 p-6 rounded-2xl border border-rose-200/50 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center">
                    <i className="fas fa-users text-white"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Team Features</h3>
                    <span className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded-full">52 requests</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600">Collaboration tools, team workspaces, and shared Markzy projects</p>
              </div>
              
              <div className="bg-gradient-to-br from-teal-50 to-teal-100/80 p-6 rounded-2xl border border-teal-200/50 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center">
                    <i className="fas fa-language text-white"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Multi-Language</h3>
                    <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full">48 requests</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600">Support for multiple languages in Markzy content generation</p>
              </div>
            </div>
          </div>

          {/* Suggestion Form */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-slate-200/50 p-8 mb-8 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Submit Your Suggestion</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tool/Feature Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={suggestionForm.toolName}
                    onChange={(e) => setSuggestionForm({...suggestionForm, toolName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., AI Video Script Generator"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={suggestionForm.category}
                    onChange={(e) => setSuggestionForm({...suggestionForm, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select a category</option>
                    {toolCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={suggestionForm.description}
                  onChange={(e) => setSuggestionForm({...suggestionForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Describe what this tool/feature would do and how it would help users..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Use Case *
                </label>
                <textarea
                  required
                  rows={3}
                  value={suggestionForm.useCase}
                  onChange={(e) => setSuggestionForm({...suggestionForm, useCase: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Describe a specific scenario where this tool would be useful..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level
                  </label>
                  <select
                    value={suggestionForm.priority}
                    onChange={(e) => setSuggestionForm({...suggestionForm, priority: e.target.value as 'low' | 'medium' | 'high'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="low">Low - Nice to have</option>
                    <option value="medium">Medium - Would be helpful</option>
                    <option value="high">High - Critical for my workflow</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    value={suggestionForm.userEmail}
                    onChange={(e) => setSuggestionForm({...suggestionForm, userEmail: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <i className="fas fa-info-circle text-blue-600 mt-1"></i>
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Tips for Great Suggestions</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Be specific about what the tool should do</li>
                      <li>• Explain how it would solve a real problem</li>
                      <li>• Include examples of how you would use it</li>
                      <li>• Consider if other users would benefit from it</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Submit Suggestion
                </button>
              </div>
            </form>
          </div>

          {/* Recent Suggestions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recently Implemented Suggestions</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <i className="fas fa-check text-white"></i>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">AI Content Repurposer</h3>
                  <p className="text-sm text-gray-600">Turn one piece of content into multiple formats</p>
                  <p className="text-xs text-green-600">Implemented in March 2025</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <i className="fas fa-check text-white"></i>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Social Media Scheduler</h3>
                  <p className="text-sm text-gray-600">Schedule and automate social media posts</p>
                  <p className="text-xs text-blue-600">Implemented in February 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 