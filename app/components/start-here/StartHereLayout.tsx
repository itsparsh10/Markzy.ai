'use client';
import React, { useState } from 'react';
import MainLayout from '../MainLayout';
import BrandVoiceTraining from './sections/BrandVoiceTraining';
import Link from 'next/link';

export default function StartHereLayout() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      emoji: "🎯",
      number: "1",
      title: "Train Your Brand Voice",
      description: "Teach our AI your unique brand voice and tone",
      color: "blue",
      icon: "fas fa-microphone-alt",
      component: <BrandVoiceTraining />,
      status: "active"
    },
    {
      emoji: "🛠️",
      number: "2", 
      title: "Explore AI Tools",
      description: "Discover 100+ marketing tools organized by category",
      color: "purple",
      icon: "fas fa-toolbox",
      href: "/all-tools",
      status: "next"
    },
    {
      emoji: "📚",
      number: "3",
      title: "Learn Best Practices",
      description: "Access our knowledge base and marketing guides",
      color: "green", 
      icon: "fas fa-graduation-cap",
      href: "/knowledge-base",
      status: "next"
    },
    {
      emoji: "🚀",
      number: "4",
      title: "Start Creating",
      description: "Begin creating high-converting marketing content",
      color: "orange",
      icon: "fas fa-rocket", 
      href: "/dashboard",
      status: "next"
    }
  ];

  return (
    <MainLayout>
      <div className="flex-1 bg-gray-50 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 flex items-center justify-center shadow-lg">
              <i className="fas fa-play text-white text-lg"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Getting Started</h1>
              <p className="text-sm text-gray-500">Your marketing success journey begins here</p>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Hero Section */}
          <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 rounded-3xl p-8 mb-8 text-white shadow-2xl overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12"></div>
              <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white rounded-full"></div>
            </div>
            
            <div className="relative flex items-start gap-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 flex-shrink-0 shadow-lg border border-white/20">
                <i className="fas fa-rocket text-4xl text-yellow-300 drop-shadow-lg"></i>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium border border-white/20">
                    ✨ Welcome Aboard
                  </span>
                  <span className="px-3 py-1 bg-yellow-500/20 backdrop-blur-sm rounded-full text-xs font-medium border border-yellow-300/20">
                    🎯 Step-by-Step Guide
                  </span>
                </div>
                <h2 className="text-4xl font-bold mb-4 leading-tight">Welcome to Markzy!</h2>
                <p className="text-green-100 text-xl mb-6 leading-relaxed">Follow our simple 4-step process to unlock the full potential of AI-powered marketing and start creating content that converts.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                      <i className="fas fa-brain text-white text-sm"></i>
                    </div>
                    <span className="font-medium">AI-Powered Tools</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center">
                      <i className="fas fa-magic text-white text-sm"></i>
                    </div>
                    <span className="font-medium">100+ Marketing Tools</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
                      <i className="fas fa-chart-line text-white text-sm"></i>
                    </div>
                    <span className="font-medium">Proven Results</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute top-4 right-4 w-16 h-16 bg-yellow-400/20 rounded-full animate-pulse"></div>
            <div className="absolute bottom-4 right-8 w-12 h-12 bg-cyan-400/20 rounded-full animate-pulse delay-1000"></div>
          </div>

          {/* Progress Steps */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <i className="fas fa-route text-white text-xl"></i>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Your Success Roadmap</h3>
                <p className="text-gray-500">Complete these steps to master markzy</p>
              </div>
            </div>

            {/* Step Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <div 
                  key={index}
                  className={`group relative border-2 rounded-2xl p-6 transition-all duration-300 cursor-pointer ${
                    activeStep === index 
                      ? `border-${step.color}-200 bg-${step.color}-50 shadow-lg` 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                  onClick={() => step.href ? null : setActiveStep(index)}
                >
                  {/* Step Number Badge */}
                  <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg ${
                    step.status === 'active' ? 'bg-green-500' :
                    step.status === 'completed' ? 'bg-blue-500' : 'bg-gray-400'
                  }`}>
                    {step.status === 'completed' ? (
                      <i className="fas fa-check text-xs"></i>
                    ) : (
                      step.number
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="text-center">
                    <div className={`w-16 h-16 bg-${step.color}-100 rounded-2xl flex items-center justify-center mb-4 mx-auto transition-transform group-hover:scale-110`}>
                      <div className="text-2xl">{step.emoji}</div>
                    </div>
                    
                    <h4 className="font-bold text-gray-800 mb-2">{step.title}</h4>
                    <p className="text-sm text-gray-600 mb-4">{step.description}</p>
                    
                    {/* Status Badge */}
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                      step.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : step.status === 'completed'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      <i className={`${step.icon} text-xs`}></i>
                      <span className="capitalize">{step.status === 'active' ? 'Start Here' : step.status}</span>
                    </div>

                    {/* Action Button */}
                    {step.href ? (
                      <Link 
                        href={step.href}
                        className={`mt-4 block w-full px-4 py-2 bg-${step.color}-600 text-white rounded-lg hover:bg-${step.color}-700 transition-colors text-sm font-medium`}
                      >
                        Explore Now
                      </Link>
                    ) : (
                      <button 
                        className={`mt-4 w-full px-4 py-2 bg-${step.color}-600 text-white rounded-lg hover:bg-${step.color}-700 transition-colors text-sm font-medium`}
                        onClick={() => setActiveStep(index)}
                      >
                        Get Started
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Step Content */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
            {steps[activeStep].component && (
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 bg-${steps[activeStep].color}-100 rounded-2xl flex items-center justify-center`}>
                    <div className="text-2xl">{steps[activeStep].emoji}</div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{steps[activeStep].title}</h3>
                    <p className="text-gray-500">{steps[activeStep].description}</p>
                  </div>
                </div>
                {steps[activeStep].component}
              </div>
            )}
          </div>

          {/* Quick Tips Section */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 mt-8 border border-amber-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <i className="fas fa-lightbulb text-white text-xl"></i>
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">💡 Pro Tips for Success</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check-circle text-green-500 mt-0.5 flex-shrink-0"></i>
                    <span>Complete the Brand Voice Training first - it helps all other tools create better content for your specific brand</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check-circle text-green-500 mt-0.5 flex-shrink-0"></i>
                    <span>Bookmark your favorite tools in the All Tools section for quick access later</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check-circle text-green-500 mt-0.5 flex-shrink-0"></i>
                    <span>Check the Knowledge Base regularly for new templates and best practices</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
