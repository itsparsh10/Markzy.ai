"use client";

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

export default function Workflows() {
  const [activeTab, setActiveTab] = useState('available'); // 'yours', 'available', 'request'
  
  return (
    <div className="h-full w-full flex overflow-hidden bg-gray-50">
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Modern Header */}
        <header className="w-full bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-md transition-all hover:shadow-lg hover:bg-blue-700">
              <i className="fas fa-sitemap text-white text-lg"></i>
            </div>
            <div>
              <span className="font-semibold text-gray-800 text-xl">Marketing Workflows</span>
              <div className="text-xs text-blue-600 font-medium">Automate your marketing tasks</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5">
              <i className="fas fa-robot"></i>
              <span>Automation</span>
            </span>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm">
              <i className="fas fa-plus text-xs"></i>
              <span className="font-medium">New Workflow</span>
            </button>
          </div>
        </header>
        
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button 
              onClick={() => setActiveTab('yours')} 
              className={`px-4 py-2 font-medium text-sm mr-4 ${activeTab === 'yours' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
            >
              Your Workflows
            </button>
            <button 
              onClick={() => setActiveTab('available')} 
              className={`px-4 py-2 font-medium text-sm mr-4 ${activeTab === 'available' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
            >
              Available Workflows
            </button>
            <button 
              onClick={() => setActiveTab('request')} 
              className={`px-4 py-2 font-medium text-sm ${activeTab === 'request' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
            >
              Request a Workflow
            </button>
          </div>
          
          {/* Your Workflows Tab */}
          {activeTab === 'yours' && (
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Workflows</h2>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center mb-6">
                <div className="mb-4">
                  <span role="img" aria-label="crickets" className="text-2xl">🦗🦗</span>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Oh look, crickets!</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  But fear not, as soon as you add a workflow from the list below, you'll be able to see and edit it here.
                </p>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-full transition-colors shadow-sm">
                  Not sure where to start? Use the Marketing Routine Tool
                </button>
              </div>
            </div>
          )}
          
          {/* Available Workflows Tab */}
          {activeTab === 'available' && (
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Available Workflows</h2>
              
              <div className="space-y-4">
                {/* Create a Blog Post */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Create a Blog Post</h3>
                    <p className="text-gray-600 text-sm">
                      Want to create a buzzin' blog post? This workflow is designed to get you from tumbleweed to finished article, so you can get ideas, outline your post, and get all the marketing assets you need to maximize your organic traffic.
                    </p>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow-sm whitespace-nowrap flex-shrink-0 transition-colors">
                    + Workflow
                  </button>
                </div>
                
                {/* Create a Welcome Sequence */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Create a Welcome Sequence</h3>
                    <p className="text-gray-600 text-sm">
                      Want to get a welcome sequence up and running for your new subscribers? This workflow will guide you through creating and setting up your brand's welcome sequence.
                    </p>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow-sm whitespace-nowrap flex-shrink-0 transition-colors">
                    + Workflow
                  </button>
                </div>
                
                {/* Create a Lead Magnet */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Create a Lead Magnet</h3>
                    <p className="text-gray-600 text-sm">
                      Need a lead magnet, but not sure where to start? This workflow will help you go from idea overwhelm to shiny new subscribers in record time, so you can start building relationships with potential new customers who want to pick up what you're putting down.
                    </p>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow-sm whitespace-nowrap flex-shrink-0 transition-colors">
                    + Workflow
                  </button>
                </div>
                
                {/* Build a Sales Funnel */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Build a Sales Funnel</h3>
                    <p className="text-gray-600 text-sm">
                      Wanna build a funnel, fast? This workflow will walk you through the key steps for creating and launching a sales funnel.
                    </p>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow-sm whitespace-nowrap flex-shrink-0 transition-colors">
                    + Workflow
                  </button>
                </div>
                
                {/* Create Product Descriptions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Create Product Descriptions</h3>
                    <p className="text-gray-600 text-sm">
                      Feeling drained by descriptions? This workflow will help you craft unique product descriptions for your various online storefronts so you can kick the copywriting blues and get back to creating epic products.
                    </p>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow-sm whitespace-nowrap flex-shrink-0 transition-colors">
                    + Workflow
                  </button>
                </div>
                
                {/* Set up Your Abandoned Cart Email Sequence */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Set up Your Abandoned Cart Email Sequence</h3>
                    <p className="text-gray-600 text-sm">
                      Concerned about your conversion rate? It's time to set up an abandoned cart sequence so you can remind your customers to come back and complete their purchase!
                    </p>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow-sm whitespace-nowrap flex-shrink-0 transition-colors">
                    + Workflow
                  </button>
                </div>
                
                {/* Repurpose Content */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Repurpose Content</h3>
                    <p className="text-gray-600 text-sm">
                      Hop off the content hamster wheel, and repurpose all that good stuff you've already created! Use the content repurposing workflow to help you turn your gems into bracelets, rings, and necklaces (and other metaphors).
                    </p>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow-sm whitespace-nowrap flex-shrink-0 transition-colors">
                    + Workflow
                  </button>
                </div>
                
                {/* Create an Email for Your List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Create an Email for Your List</h3>
                    <p className="text-gray-600 text-sm">
                      Need to send a newsletter? Unsure of what to email your subscribers? Use this workflow to get epic emails for your mailing list, so you can step out of analysis paralysis and start sending emails!
                    </p>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow-sm whitespace-nowrap flex-shrink-0 transition-colors">
                    + Workflow
                  </button>
                </div>
                
                {/* Research Your Ideal Customer */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Research Your Ideal Customer</h3>
                    <p className="text-gray-600 text-sm">
                      Ever wished you could read your customers' minds? Well, with this workflow, you can - in a less invasive and creepy way, obvs. Go through these steps to get customer insights if you don't have 100+ hours to spend on manual research.
                    </p>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow-sm whitespace-nowrap flex-shrink-0 transition-colors">
                    + Workflow
                  </button>
                </div>
                
                {/* Create a Customer Journey Map */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Create a Customer Journey Map</h3>
                    <p className="text-gray-600 text-sm">
                      Want to improve your content and conversion rates? Use this workflow and create a customer journey map so you can make sure your marketing is saying what your customers need to hear at each stage of the customer journey.
                    </p>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow-sm whitespace-nowrap flex-shrink-0 transition-colors">
                    + Workflow
                  </button>
                </div>
                
                {/* Create a Content Plan */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Create a Content Plan</h3>
                    <p className="text-gray-600 text-sm">
                      Turn on the content lightbulb and get a whole lot of ideas with this workflow, designed to help you create a content plan for your marketing channels.
                    </p>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow-sm whitespace-nowrap flex-shrink-0 transition-colors">
                    + Workflow
                  </button>
                </div>
                
                {/* Create Social Media Content */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Create Social Media Content</h3>
                    <p className="text-gray-600 text-sm">
                      Stuck on social captions? Say no more - this workflow is gonna help you with social post ideas and content concepts, as well as drafting your captions so you can start spending more time being social and less time thinking about being social.
                    </p>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow-sm whitespace-nowrap flex-shrink-0 transition-colors">
                    + Workflow
                  </button>
                </div>
                
                {/* Create Affiliate Resources */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Create Affiliate Resources</h3>
                    <p className="text-gray-600 text-sm">
                      Want to provide your awesome affiliates with swipe copy and assets for promoting your products? This workflow will walk you through building out an affiliate pack that will give them all the content and context they need.
                    </p>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow-sm whitespace-nowrap flex-shrink-0 transition-colors">
                    + Workflow
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Request a Workflow Tab */}
          {activeTab === 'request' && (
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Request a Workflow</h2>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="mb-8">
                  <div className="flex items-center mb-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm mr-2">1</span>
                    <h3 className="text-lg font-medium text-gray-800">What workflow would you like to request?</h3>
                  </div>
                  <p className="text-gray-600 text-sm ml-8 mb-4">
                    Please note that we review requests and add them to our development roadmap based on how many Markzy customers are likely to find it helpful.
                  </p>
                  <div className="ml-8">
                    <textarea 
                      className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      rows={4} 
                      placeholder="Type your answer here..."
                    ></textarea>
                    <p className="text-xs text-gray-500 mt-1">Shift + Enter to make a line break</p>
                  </div>
                </div>
                
                <div className="ml-8">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-full transition-colors shadow-sm">
                    Submit
                  </button>
                  <p className="text-xs text-gray-500 mt-1">press Cmd ⌘ + Enter ↵</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
