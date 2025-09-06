import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

export default function EcommerceProductDescription({ onBackClick }: { onBackClick: () => void }) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');

  return (
    <div className="w-full h-full bg-white overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center px-6 py-3 text-white bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 relative">
          <div className="absolute inset-0 bg-blue-600 opacity-10 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>
          <div className="mr-4 p-2.5 rounded-full bg-white/20 backdrop-blur-md shadow-inner border border-white/30 z-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M20.91 8.84 8.56 2.23a1.93 1.93 0 0 0-1.81 0L3.1 4.13a2.12 2.12 0 0 0-.05 3.69l12.22 6.93a2 2 0 0 0 1.94 0L21 12.51a2.12 2.12 0 0 0-.09-3.67Z"></path>
              <path d="m3.09 8.84 12.35-6.61a1.93 1.93 0 0 1 1.81 0l3.65 1.9a2.12 2.12 0 0 1 .1 3.69L8.73 14.75a2 2 0 0 1-1.94 0L3 12.51a2.12 2.12 0 0 1 .09-3.67Z"></path>
              <line x1="12" y1="22" x2="12" y2="13"></line>
              <path d="M20 13.5v3.37a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13.5"></path>
            </svg>
          </div>
          <div className="z-10">
            <h2 className="text-xl font-semibold">Ecommerce Product Description</h2>
            <p className="text-sm text-blue-50">Create detailed descriptions that convert browsers to buyers</p>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex justify-between items-center px-4 py-2 border-b border-blue-100 bg-white sticky top-0 z-20 shadow-sm">
          <div className="flex space-x-1 relative">
            <button 
              onClick={() => setActiveTab('generate')}
              className={`px-4 py-2 text-base font-medium rounded-md transition-all ${
                activeTab === 'generate' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50/50'
              }`}
            >
              Generate
            </button>
            <button 
              onClick={() => setActiveTab('templates')}
              className={`px-4 py-2 text-base font-medium rounded-md transition-all ${
                activeTab === 'templates' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50/50'
              }`}
            >
              Templates
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 text-base font-medium rounded-md transition-all ${
                activeTab === 'history' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50/50'
              }`}
            >
              History
            </button>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="overflow-y-auto bg-gradient-to-b from-blue-50/50 to-white p-3" style={{ maxHeight: 'calc(100vh - 180px)' }}>
          <div className="max-w-4xl mx-auto">
            {activeTab === 'generate' && (
              <div className="space-y-3 mt-2 pb-20">
                {/* Product Input */}
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <h3 className="text-lg font-medium text-blue-800 mb-2">Product Basics</h3>
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      className="w-full p-2.5 bg-white border border-blue-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-base" 
                      placeholder="Product Name"
                    />
                    <select className="w-full p-2.5 bg-white border border-blue-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-base">
                      <option>Select Product Category</option>
                      <option>Electronics</option>
                      <option>Clothing & Apparel</option>
                      <option>Home & Kitchen</option>
                      <option>Beauty & Personal Care</option>
                      <option>Health & Wellness</option>
                      <option>Sports & Outdoors</option>
                      <option>Toys & Games</option>
                      <option>Books & Media</option>
                      <option>Other</option>
                    </select>
                    <input 
                      type="text" 
                      className="w-full p-2.5 bg-white border border-blue-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-base" 
                      placeholder="Product Price (optional)"
                    />
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <h3 className="text-lg font-medium text-blue-800 mb-2">Key Features</h3>
                  <textarea 
                    className="w-full p-2.5 bg-white border border-blue-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-base h-20"
                    placeholder="List key features and specifications of your product (one per line)"
                  ></textarea>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <h3 className="text-lg font-medium text-blue-800 mb-2">Customer Benefits</h3>
                  <textarea 
                    className="w-full p-2.5 bg-white border border-blue-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-base h-20"
                    placeholder="What problems does your product solve? How does it improve your customer's life?"
                  ></textarea>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <h3 className="text-lg font-medium text-blue-800 mb-2">Target Audience</h3>
                  <textarea 
                    className="w-full p-2.5 bg-white border border-blue-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-base h-20"
                    placeholder="Who is this product designed for? Describe your ideal customer."
                  ></textarea>
                </div>
                
                {/* Description Types */}
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-blue-800">Short Product Description</h3>
                    <button className="px-4 py-1.5 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors">
                      Create
                    </button>
                  </div>
                  <p className="text-sm text-blue-700 mt-2">Generate a concise 1-2 paragraph product description (150-200 words)</p>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-blue-800">Detailed Product Description</h3>
                    <button className="px-4 py-1.5 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors">
                      Create
                    </button>
                  </div>
                  <p className="text-sm text-blue-700 mt-2">Generate a comprehensive product description with multiple sections (300-500 words)</p>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-blue-800">Technical Specifications</h3>
                    <button className="px-4 py-1.5 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors">
                      Create
                    </button>
                  </div>
                  <p className="text-sm text-blue-700 mt-2">Generate a formatted list of technical specifications in bullet points</p>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-blue-800">Feature-Benefit Analysis</h3>
                    <button className="px-4 py-1.5 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors">
                      Create
                    </button>
                  </div>
                  <p className="text-sm text-blue-700 mt-2">Generate paired features and benefits to highlight value to customers</p>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-blue-800">SEO-Optimized Description</h3>
                    <button className="px-4 py-1.5 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors">
                      Create
                    </button>
                  </div>
                  <p className="text-sm text-blue-700 mt-2">Generate a description with relevant keywords for better search visibility</p>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-blue-800">Product FAQs</h3>
                    <button className="px-4 py-1.5 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors">
                      Create
                    </button>
                  </div>
                  <p className="text-sm text-blue-700 mt-2">Generate frequently asked questions and answers about your product</p>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-blue-800">Product Use Cases</h3>
                    <button className="px-4 py-1.5 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors">
                      Create
                    </button>
                  </div>
                  <p className="text-sm text-blue-700 mt-2">Generate scenarios and examples of how customers can use your product</p>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-blue-800">Product Comparison</h3>
                    <button className="px-4 py-1.5 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors">
                      Create
                    </button>
                  </div>
                  <p className="text-sm text-blue-700 mt-2">Generate content highlighting advantages over similar products (without naming competitors)</p>
                </div>
              </div>
            )}
            
            {activeTab === 'templates' && (
              <div className="p-4">
                <h3 className="text-lg font-medium text-blue-800 mb-4">Your Saved Templates</h3>
                <p className="text-blue-600">You don't have any saved templates yet.</p>
              </div>
            )}
            
            {activeTab === 'history' && (
              <div className="py-4">
                <History toolName="Ecommerce Product Description" />
              </div>
            )}
          </div>
        </div>
        
        {/* Footer with Action Button */}
        <div className="p-3 border-t border-blue-100 bg-white flex justify-between items-center sticky bottom-0 left-0 right-0 z-10">
          <button 
            onClick={onBackClick}
            className="px-4 py-2 flex items-center gap-2 text-blue-600 hover:bg-blue-50 rounded-full transition-all text-base"
          >
            <ArrowLeft size={18} />
            <span>Back to Tools</span>
          </button>
          
          <button 
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full shadow-md hover:shadow-lg transition-all text-base font-medium"
          >
            Save Descriptions
          </button>
        </div>
      </div>
    </div>
  );
}
