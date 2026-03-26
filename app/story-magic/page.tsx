"use client";

import React from 'react';
import Link from 'next/link';
import Sidebar from '../components/Sidebar';

export default function StoryMagic() {
  // Sample questions data for the UI
  const sampleQuestions = [
    { id: 1, question: "What inspired you to start your business?", status: "incomplete" },
    { id: 2, question: "What problem does your business solve?", status: "incomplete" },
    { id: 3, question: "What makes your approach unique?", status: "incomplete" },
  ];

  return (
    <div className="min-h-screen w-full flex overflow-x-hidden bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 flex flex-col overflow-hidden w-full min-w-0">
        {/* Modern header with blue accent */}
        <header className="w-full bg-white border-b border-gray-200 px-3 sm:px-4 md:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0 shadow-sm">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-md transition-all hover:shadow-lg hover:bg-blue-700">
              <i className="fas fa-book-open text-white text-lg"></i>
            </div>
            <div>
              <span className="font-semibold text-gray-800 text-lg sm:text-xl">Story Magic</span>
              <div className="text-xs text-blue-600 font-medium">Craft your brand story</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full hover:bg-blue-200 transition-colors font-medium flex items-center gap-1.5">
              <i className="fas fa-lightbulb"></i>
              <span>Tips</span>
            </button>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm">
              <i className="fas fa-save text-xs"></i>
              <span className="font-medium">Save Story</span>
            </button>
          </div>
        </header>
        
        {/* Content area */}
        <div className="flex-1 flex flex-col overflow-hidden w-full">
          {/* Welcome Banner - Blue gradient banner */}
          <div className="w-full bg-gradient-to-r from-blue-700 to-blue-500 py-6 px-3 sm:px-4 md:px-8 flex-shrink-0 shadow-md">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="md:max-w-2xl">
                  <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <span>Create Your Brand Story</span>
                    <span className="text-yellow-300">✨</span>
                  </h2>
                  <p className="text-blue-50 text-sm leading-relaxed">
                    Answer the questions below to craft a compelling narrative that connects with your audience. 
                    Your story will be used to generate personalized marketing content across all channels.
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-white border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center">
                        <i className="fas fa-bolt text-white"></i>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Completion Status</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full w-0 bg-white rounded-full"></div>
                          </div>
                          <span className="text-xs">0/3</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="flex-1 overflow-auto w-full">
            <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 py-8">
              {/* Story Header with tab navigation */}
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Your Brand Story</h3>
                  <p className="text-gray-500 text-sm mt-1">Share what makes your business special</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-md text-sm font-medium">
                    <i className="fas fa-exclamation-circle mr-1"></i>
                    Answers Needed
                  </span>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors shadow-sm flex items-center gap-1">
                    <i className="fas fa-pen"></i>
                    <span>Create Business Story</span>
                  </button>
                </div>
              </div>

              {/* Tab navigation */}
              <div className="mb-6 border-b border-gray-200 overflow-x-auto">
                <div className="flex min-w-max space-x-6 sm:space-x-8">
                  <button className="border-b-2 border-blue-600 text-blue-600 pb-2 px-1 font-medium">
                    Questions
                  </button>
                  <button className="text-gray-500 hover:text-gray-700 pb-2 px-1 font-medium">
                    Preview
                  </button>
                  <button className="text-gray-500 hover:text-gray-700 pb-2 px-1 font-medium">
                    History
                  </button>
                </div>
              </div>
              
              {/* Questions list */}
              <div className="mb-8">
                {sampleQuestions.map((q, index) => (
                  <div key={q.id} className="mb-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 mb-1">{q.question}</h4>
                        <p className="text-gray-500 text-sm">Your answer will help establish your brand's origin story and values.</p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <i className="fas fa-pen-to-square mr-1 text-blue-500"></i>
                          Answer
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Story building tools section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Story Building Tools</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-100 flex items-start">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-4 text-blue-600">
                      <i className="fas fa-lightbulb"></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-1">Story Inspiration</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Not sure where to start? Get inspired by example stories from successful brands in your industry.
                      </p>
                      <button className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1">
                        <span>Browse examples</span>
                        <i className="fas fa-arrow-right text-xs"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-100 flex items-start">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-4 text-blue-600">
                      <i className="fas fa-wand-magic-sparkles"></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-1">AI Story Assistant</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Let our AI help you craft the perfect brand story based on your business goals and target audience.
                      </p>
                      <button className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1">
                        <span>Generate suggestions</span>
                        <i className="fas fa-arrow-right text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Info box at bottom */}
          <div className="w-full bg-blue-50 p-5 border-t border-blue-100 flex-shrink-0">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-shrink-0 bg-blue-100 rounded-full p-3">
                  <i className="fas fa-info text-blue-600"></i>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-blue-800 mb-1">How your story powers your marketing</h4>
                  <p className="text-sm text-blue-700">
                    Your brand story is the foundation for authentic marketing. Once completed, you'll be able to generate social posts, emails, and website content that truly reflects your brand's voice and journey. A compelling story can increase engagement by up to 22% according to our research.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <button className="text-blue-700 hover:text-blue-800 text-sm font-medium bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded-md transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
