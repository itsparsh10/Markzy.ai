"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function Commercial() {
  const router = useRouter();
  const [activePlan, setActivePlan] = useState('pro'); // 'basic', 'pro', 'premium'

  // Service card data
  const serviceCards = [
    { icon: 'fas fa-user-tie', title: 'Virtual Assistant or OBM' },
    { icon: 'fas fa-podcast', title: 'Social Media or Podcast Manager' },
    { icon: 'fas fa-chart-line', title: 'Business Coach or Consultant' },
    { icon: 'fas fa-bullhorn', title: 'PR or Brand Strategist' },
    { icon: 'fas fa-pen-fancy', title: 'Content Marketer or Copywriter' },
    { icon: 'fas fa-laptop-code', title: 'Web Designer or SEO Expert' }
  ];

  // Process steps data
  const processSteps = [
    {
      step: 1,
      title: 'Sign up',
      icon: 'fas fa-user-plus',
      content: 'Once you have signed up for your lifetime license to Markzy, you will get instant access to the app.'
    },
    {
      step: 2,
      title: 'Level up',
      icon: 'fas fa-graduation-cap',
      content: 'You will get a video explaining how to onboard your clients along with a Client Consent Form Template.'
    },
    {
      step: 3,
      title: 'Ramp up',
      icon: 'fas fa-bolt',
      content: 'Then, you will be able to use any of the 62+ tools to get the marketing party started for you and your clients!'
    },
    {
      step: 4,
      title: 'Feet up!',
      icon: 'fas fa-couch',
      content: 'Now you have condensed 10 hours of work into 10 minutes, you can relax and spend quality time doing what you love.'
    }
  ];

  // FAQ data
  const faqItems = [
    {
      question: "What's the difference between the license tiers?",
      answer: "The main differences are in the number of clients you can use it for, the level of support provided, and additional features like white-labeling in the premium tier."
    },
    {
      question: "Do I need my own OpenAI account?",
      answer: "Yes, Markzy uses your own OpenAI account which costs approximately $1-3 per month with regular use. This ensures your data privacy and gives you full control."
    },
    {
      question: "Can I upgrade or downgrade my plan later?",
      answer: "Yes, you can upgrade your plan at any time. Downgrades will be applied at the end of your current billing cycle."
    },
    {
      question: "Is there a free trial available?",
      answer: "We don't offer a free trial, but we do have a 14-day money-back guarantee if you're not satisfied with the service."
    },
    {
      question: "How does the client limit work?",
      answer: "You can create up to the specified number of client profiles per year. This resets on your subscription anniversary."
    }
  ];
  
  return (
    <div className="h-full w-full flex overflow-hidden bg-gray-50">
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Commercial Page Content */}
        <div className="py-4 px-6 overflow-y-auto">
          {/* Header */}
          <header className="w-full bg-white rounded-xl border border-gray-200 p-4 mb-4 shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-md transition-all hover:shadow-lg">
                <i className="fas fa-crown text-white text-xl"></i>
              </div>
              <div>
                <h1 className="font-bold text-xl text-gray-800">Commercial License</h1>
                <p className="text-sm text-gray-500">Use Markzy with your client projects</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => router.push('/knowledge-base#faq')}
                className="px-3 py-1.5 rounded-full text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors flex items-center gap-1.5"
              >
                <i className="fas fa-question-circle"></i>
                <span>FAQ</span>
              </button>
              <button 
                onClick={() => router.push('/help-center')}
                className="px-3 py-1.5 rounded-full text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <i className="fas fa-headset"></i>
                <span>Contact Support</span>
              </button>
            </div>
          </header>

          {/* Hero Section */}
          <section className="w-full bg-white rounded-xl border border-gray-200 p-4 mb-4 shadow-md">
            <div className="flex flex-col items-center text-center py-4">
              <h2 className="font-bold text-2xl text-gray-800 mb-2">Supercharge Your Service Business</h2>
              <p className="text-gray-600 max-w-2xl mb-4">
                Unlock the full potential of Markzy for your client work with our Commercial License. Create better content faster and grow your business with professional-grade AI marketing tools.
              </p>
              <div className="flex items-center gap-3 mt-2">
                <button 
                  onClick={() => router.push('/all-tools')}
                  className="px-4 py-2 rounded-full text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-md"
                >
                  <span>Get Started</span>
                  <i className="fas fa-arrow-right"></i>
                </button>
                {/* Schedule a Demo button - temporarily commented out */}
                {/* <button className="px-4 py-2 rounded-full text-sm border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-1.5">
                  <i className="fas fa-calendar"></i>
                  <span>Schedule a Demo</span>
                </button> */}
              </div>
            </div>
          </section>

          {/* Service Categories */}
          <section className="w-full bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 p-6 mb-4 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
                <i className="fas fa-users text-white"></i>
              </div>
              <h3 className="font-bold text-xl text-gray-800">Perfect For Service Providers</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {serviceCards.map((card, index) => (
                <div key={index} className="p-4 bg-white border border-gray-100 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-4 group">
                  <div className={`w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center shadow-md group-hover:bg-blue-700 transition-all duration-300`}>
                    <i className={`${card.icon} text-white text-2xl`}></i>
                  </div>
                  <span className="font-semibold text-gray-800 text-lg group-hover:text-blue-600 transition-colors duration-300">{card.title}</span>
                </div>
              ))}
            </div>
          </section>

          {/* How It Works */}
          <section className="w-full bg-white rounded-xl border border-gray-200 p-4 mb-4 shadow-md">
            <h3 className="font-semibold text-lg text-gray-800 mb-3">How It Works</h3>
            <p className="text-gray-600 mb-4">
              Markzy Commercial License allows you to use our powerful AI tools for client work. Simply purchase the license tier that matches your needs, and you're ready to go!
            </p>
            
            {/* Process Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
              {processSteps.map((step, index) => (
                <div key={index} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                      {step.step}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <i className={`${step.icon} text-blue-600`}></i>
                      <span className="font-medium text-gray-800">{step.title}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{step.content}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Support */}
          <section className="w-full bg-white rounded-xl border border-gray-200 p-4 mb-4 shadow-md">
            <h3 className="font-semibold text-lg text-gray-800 mb-2">Premium Support Included</h3>
            <div className="flex items-center gap-3 text-gray-600">
              <div className="flex items-center gap-1.5">
                <i className="fas fa-check-circle text-green-500"></i>
                <span>Priority Email Support</span>
              </div>
              <div className="flex items-center gap-1.5">
                <i className="fas fa-check-circle text-green-500"></i>
                <span>Video Tutorials</span>
              </div>
              <div className="flex items-center gap-1.5">
                <i className="fas fa-check-circle text-green-500"></i>
                <span>Dedicated Account Manager (Premium)</span>
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section className="w-full bg-gradient-to-tr from-blue-600 to-blue-800 rounded-xl p-6 mb-4 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl opacity-20 -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-700 rounded-full filter blur-3xl opacity-20 -ml-32 -mb-32"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md">
                  <i className="fas fa-crown text-blue-600"></i>
                </div>
                <h3 className="font-bold text-xl text-white">Commercial License Plans</h3>
              </div>
              
              {/* Plan Toggle */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex p-1.5 bg-blue-700/50 backdrop-blur-sm rounded-full shadow-inner">
                  <button 
                    onClick={() => setActivePlan('basic')}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activePlan === 'basic' 
                      ? 'bg-white text-blue-700 shadow-md' 
                      : 'text-white hover:bg-blue-700/70'}`}
                  >
                    Basic
                  </button>
                  <button 
                    onClick={() => setActivePlan('pro')}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activePlan === 'pro' 
                      ? 'bg-white text-blue-700 shadow-md' 
                      : 'text-white hover:bg-blue-700/70'}`}
                  >
                    Pro
                  </button>
                  <button 
                    onClick={() => setActivePlan('premium')}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activePlan === 'premium' 
                      ? 'bg-white text-blue-700 shadow-md' 
                      : 'text-white hover:bg-blue-700/70'}`}
                  >
                    Premium
                  </button>
                </div>
              </div>
              
              {/* Pricing Cards */}
              <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-xl">
                {activePlan === 'basic' && (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold text-xl text-gray-800">Basic License</h4>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-blue-600">$399</span>
                        <span className="text-gray-500 text-sm">/year</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3">Perfect for freelancers or solo service providers who need to use Markzy for up to 5 clients.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <i className="fas fa-check text-green-500"></i>
                        <span>Use for up to 5 clients</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <i className="fas fa-check text-green-500"></i>
                        <span>Standard support</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <i className="fas fa-check text-green-500"></i>
                        <span>Access to all tools</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <i className="fas fa-check text-green-500"></i>
                        <span>Commercial use rights</span>
                      </div>
                    </div>
                    <button className="w-full py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2">
                      <i className="fas fa-check-circle"></i>
                      Subscribe to Basic
                    </button>
                  </div>
                )}
                
                {activePlan === 'pro' && (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold text-xl text-gray-800">Pro License</h4>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-blue-600">$699</span>
                        <span className="text-gray-500 text-sm">/year</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3">Ideal for agencies and growing service businesses who need to use Markzy for up to 15 clients.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <i className="fas fa-check text-green-500"></i>
                        <span>Use for up to 15 clients</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <i className="fas fa-check text-green-500"></i>
                        <span>Priority support</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <i className="fas fa-check text-green-500"></i>
                        <span>Access to all tools</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <i className="fas fa-check text-green-500"></i>
                        <span>Commercial use rights</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <i className="fas fa-check text-green-500"></i>
                        <span>Client templates</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <i className="fas fa-check text-green-500"></i>
                        <span>Enhanced AI features</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => router.push('/upgrade-account')}
                      className="w-full py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2"
                    >
                      <i className="fas fa-check-circle"></i>
                      Subscribe to Pro
                    </button>
                  </div>
                )}
                
                {activePlan === 'premium' && (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold text-xl text-gray-800">Premium License</h4>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-blue-600">$999</span>
                        <span className="text-gray-500 text-sm">/year</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3">The ultimate solution for established agencies who need to use Markzy for unlimited clients.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <i className="fas fa-check text-green-500"></i>
                        <span>Unlimited clients</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <i className="fas fa-check text-green-500"></i>
                        <span>Dedicated account manager</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <i className="fas fa-check text-green-500"></i>
                        <span>Access to all tools</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <i className="fas fa-check text-green-500"></i>
                        <span>Commercial use rights</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <i className="fas fa-check text-green-500"></i>
                        <span>White labeling options</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <i className="fas fa-check text-green-500"></i>
                        <span>API access</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <i className="fas fa-check text-green-500"></i>
                        <span>Advanced training</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <i className="fas fa-check text-green-500"></i>
                        <span>Priority feature requests</span>
                      </div>
                    </div>
                    <button className="w-full py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2">
                      <i className="fas fa-check-circle"></i>
                      Subscribe to Premium
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="w-full bg-white rounded-xl border border-gray-200 p-4 mb-4 shadow-md">
            <h3 className="font-semibold text-lg text-gray-800 mb-3">Frequently Asked Questions</h3>
            <div className="space-y-3">
              {faqItems.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3">
                  <h4 className="font-medium text-gray-800 mb-1">{item.question}</h4>
                  <p className="text-sm text-gray-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="w-full bg-blue-50 rounded-xl border border-blue-200 p-4 mb-4 shadow-md">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-1">Ready to supercharge your service business?</h3>
                <p className="text-gray-600">Join hundreds of service providers who are growing their business with Markzy.</p>
              </div>
              <div className="flex items-center gap-3 mt-3 md:mt-0">
                <button 
                  onClick={() => router.push('/all-tools')}
                  className="px-4 py-2 rounded-full text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-md"
                >
                  <span>Get Started Now</span>
                  <i className="fas fa-arrow-right"></i>
                </button>
                {/* Schedule a Demo button - temporarily commented out */}
                {/* <button className="px-4 py-2 rounded-full text-sm border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-1.5">
                  <i className="fas fa-calendar"></i>
                  <span>Schedule a Demo</span>
                </button> */}
              </div>
            </div>
          </section>
        </div>
        </main>

        {/* Footer positioned after main content */}
        <Footer />
      </div>
    </div>
  );
}
