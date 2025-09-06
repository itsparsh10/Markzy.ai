'use client'

import { useState } from 'react'
import { ArrowLeft, FileText, Clock, X, Wand2, Layers, History as HistoryIcon, Tag, List, Text, BookOpen, Package, ShieldCheck, ShoppingBag } from 'lucide-react'
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js'
import History from './History/History';

export default function EtsyEcommerceDescriptionPhysical({ onBackClick }: { onBackClick: () => void }) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate')
  const [productName, setProductName] = useState('')
  const [materials, setMaterials] = useState('')
  const [dimensions, setDimensions] = useState('')
  const [careInstructions, setCareInstructions] = useState('')

  const templateTypes = [
    { title: "Listing Title", description: "Generate an SEO-optimized title for your physical product.", icon: Tag, category: 'Title' },
    { title: "Product Tags", description: "Generate relevant tags to improve listing visibility.", icon: List, category: 'Tags' },
    { title: "Introductory Paragraph", description: "Generate an engaging opening paragraph for your description.", icon: Text, category: 'Description' },
    { title: "About the Product", description: "Generate details about the product's features and benefits.", icon: BookOpen, category: 'Description' },
    { title: "Practical Details", description: "Generate information about materials, dimensions, etc.", icon: Package, category: 'Details' },
    { title: "Product Policy Summary", description: "Generate a summary of your shop policies.", icon: ShieldCheck, category: 'Policies' },
  ];

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Glassmorphic Header with blue gradient */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <ShoppingBag className="text-blue-100 text-3xl" />
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Etsy Description for Physical Products</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create compelling product descriptions for your Etsy physical products</p>
            </div>
            <div className="flex items-center gap-3 z-10">
              <span className="text-xs bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/30 flex items-center font-semibold text-white/90">
                <Clock className="mr-1" size={14} /> 5 min
              </span>
              <button 
                className="rounded-full transition-all duration-200 border-2 border-white bg-gradient-to-br from-blue-600 to-blue-400 text-white hover:from-blue-700 hover:to-blue-500 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-200 z-20"
                style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                aria-label="Close"
                onClick={onBackClick}
              >
                <X size={20} />
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
                    <Wand2 size={14} />
                    Generate
                  </span>
                  {activeTab === 'generate' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>}
                </button>
                <button 
                  onClick={() => setActiveTab('templates')}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${activeTab === 'templates' ? 'text-blue-700 bg-blue-50/70' : 'text-blue-500 hover:text-blue-600'}`}
                >
                  <span className="flex items-center gap-2">
                    <Layers size={14} />
                    Templates
                  </span>
                  {activeTab === 'templates' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>}
                </button>
                <button 
                  onClick={() => setActiveTab('history')}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${activeTab === 'history' ? 'text-blue-700 bg-blue-50/70' : 'text-blue-500 hover:text-blue-600'}`}
                >
                  <span className="flex items-center gap-2">
                    <HistoryIcon size={14} />
                    History
                  </span>
                  {activeTab === 'history' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>}
                </button>
              </div>
              <button className="px-3 py-1.5 text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all flex items-center gap-1 border border-blue-100">
                <FileText size={14} /> Save as Template
              </button>
            </div>
            
            {/* Tab Content */}
            <div className="p-4 pt-3">
              {activeTab === 'generate' && (
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                  {/* Input Fields */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-blue-900" htmlFor="productName">Physical Product Name</label>
                    <input 
                      id="productName" 
                      name="productName"
                      className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all" 
                      placeholder="e.g., Handmade Ceramic Mug"
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-blue-900" htmlFor="materials">Materials Used</label>
                    <input 
                      id="materials" 
                      name="materials"
                      className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all" 
                      placeholder="e.g., Ceramic, Glaze, Lead-free"
                      type="text"
                      value={materials}
                      onChange={(e) => setMaterials(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-blue-900" htmlFor="dimensions">Dimensions</label>
                    <input 
                      id="dimensions" 
                      name="dimensions"
                      className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all" 
                      placeholder="e.g., 3.5 inches tall, 3 inch diameter"
                      type="text"
                      value={dimensions}
                      onChange={(e) => setDimensions(e.target.value)}
                    />
                  </div>

                   <div className="space-y-2">
                    <label className="block text-xs font-semibold text-blue-900" htmlFor="careInstructions">Care Instructions</label>
                    <textarea 
                      id="careInstructions" 
                      name="careInstructions"
                      className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all resize-none h-20" 
                      placeholder="e.g., Hand wash recommended, Microwave safe"
                      value={careInstructions}
                      onChange={(e) => setCareInstructions(e.target.value)}
                    ></textarea>
                  </div>


                </div>
              )}
              
              {activeTab === 'templates' && (
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {templateTypes.map((template) => (
                    <div key={template.title} className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
                            <template.icon className="text-blue-600" size={20} />
                          </div>
                          <div>
                            <h4 className="font-medium text-blue-900">{template.title}</h4>
                            <p className="text-xs text-blue-600">{template.description}</p>
                          </div>
                        </div>
                        <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">
                          Create
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {activeTab === 'history' && (
                <div className="py-4">
                  <History toolName="Etsy Ecommerce Description Physical" />
                </div>
              )}
            </div>
            
            {/* Action buttons */}
            <div className="mt-auto flex justify-between items-center px-4 py-3 border-t border-blue-100">
              <button 
                className="group flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-all px-3 py-1.5 rounded-lg hover:bg-blue-50/50" 
                onClick={onBackClick}
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                <span>Back to All Tools</span>
              </button>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 text-sm text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-all shadow-sm hover:shadow">
                  Save Draft
                </button>
                <button className="px-5 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg">
                  <span>Create Description</span>
                  <ArrowLeft size={14} className="rotate-180 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 