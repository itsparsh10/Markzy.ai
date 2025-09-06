'use client'

import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js'
import History from './History/History';

export default function EtsyDigitalDescription({ onBackClick }: { onBackClick: () => void }) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate')

  return (
    <div className="flex flex-col h-full">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-4 rounded-t-lg flex justify-between items-center">
        <div className="flex items-center">
          <button onClick={onBackClick} className="mr-4 text-white hover:text-blue-100">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-white">Etsy Description for Digital Products</h1>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('generate')}
            className={`px-3 py-1 rounded-md text-sm ${
              activeTab === 'generate'
                ? 'bg-white text-blue-600 font-medium'
                : 'bg-blue-500 text-white hover:bg-blue-400'
            }`}
          >
            Generate
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-3 py-1 rounded-md text-sm ${
              activeTab === 'templates'
                ? 'bg-white text-blue-600 font-medium'
                : 'bg-blue-500 text-white hover:bg-blue-400'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1 rounded-md text-sm ${
              activeTab === 'history'
                ? 'bg-white text-blue-600 font-medium'
                : 'bg-blue-500 text-white hover:bg-blue-400'
            }`}
          >
            History
          </button>
        </div>
      </div>

      {activeTab === 'generate' && (
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-blue-50 to-white">
          {/* Form section */}
          <div className="bg-blue-50 p-4 border-b border-blue-100">
            <div className="flex space-x-4 mb-4">
              <div className="w-1/2">
                <label htmlFor="productType" className="block text-sm font-medium text-blue-800 mb-1">
                  Product Type
                </label>
                <select
                  id="productType"
                  className="w-full p-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option>Select Product Type</option>
                  <option>Digital Download</option>
                  <option>Printable</option>
                  <option>Template</option>
                  <option>Digital Art</option>
                </select>
              </div>
              <div className="w-1/2">
                <label htmlFor="product" className="block text-sm font-medium text-blue-800 mb-1">
                  Product
                </label>
                <select
                  id="product"
                  className="w-full p-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option>Select Product</option>
                  <option>Product 1</option>
                  <option>Product 2</option>
                  <option>Product 3</option>
                </select>
              </div>
            </div>
            <div className="flex justify-center">
              <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full text-sm shadow-md">
                Save Selection
              </button>
            </div>
          </div>

          {/* Content section */}
          <div className="p-4 space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto">
            <div className="bg-white border border-blue-100 rounded-lg p-4 mb-2 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-medium text-blue-800">Listing Title</h2>
                <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded-full text-sm">
                  Create
                </button>
              </div>
              <p className="text-gray-600 text-sm">Generate an SEO-optimized title for your digital product</p>
            </div>

            <div className="bg-white border border-blue-100 rounded-lg p-4 mb-2 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-medium text-blue-800">Tags</h2>
                <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded-full text-sm">
                  Create
                </button>
              </div>
              <p className="text-gray-600 text-sm">Generate relevant tags to improve your listing visibility</p>
            </div>

            <div className="bg-white border border-blue-100 rounded-lg p-4 mb-2 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-medium text-blue-800">Keywords</h2>
                <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded-full text-sm">
                  Create
                </button>
              </div>
              <p className="text-gray-600 text-sm">Generate relevant keywords for your digital product</p>
            </div>

            <div className="bg-white border border-blue-100 rounded-lg p-4 mb-2 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-medium text-blue-800">First Paragraph</h2>
                <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded-full text-sm">
                  Create
                </button>
              </div>
              <p className="text-gray-600 text-sm">Generate an attention-grabbing first paragraph for your description</p>
            </div>

            <div className="bg-white border border-blue-100 rounded-lg p-4 mb-2 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-medium text-blue-800">Second Paragraph</h2>
                <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded-full text-sm">
                  Create
                </button>
              </div>
              <p className="text-gray-600 text-sm">Generate a detailed second paragraph about features and benefits</p>
            </div>

            <div className="bg-white border border-blue-100 rounded-lg p-4 mb-2 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-medium text-blue-800">Third Paragraph</h2>
                <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded-full text-sm">
                  Create
                </button>
              </div>
              <p className="text-gray-600 text-sm">Generate a closing paragraph with call-to-action</p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-2 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-medium text-gray-800">Etsy Product Policy Paragraph</h2>
                <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded-full text-sm">
                  Create
                </button>
              </div>
              <p className="text-gray-500 text-sm">Generate your content by clicking "Create"</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="flex-1 overflow-y-auto p-4 bg-white">
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <h2 className="font-medium text-blue-800 mb-2">Etsy Description Templates</h2>
            <p className="text-sm text-gray-600">
              Browse through our library of pre-designed Etsy description templates
            </p>
          </div>
          {/* Template items would go here */}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="py-4">
          <History toolName="Etsy Digital Description" />
        </div>
      )}

      {/* Footer */}
      <div className="bg-white border-t border-blue-100 p-4 flex justify-between items-center sticky bottom-0">
        <button
          onClick={onBackClick}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md flex items-center"
        >
          <ArrowLeft size={16} className="mr-1" /> Back
        </button>
        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md">
          Save Description
        </button>
      </div>
    </div>
  )
}
