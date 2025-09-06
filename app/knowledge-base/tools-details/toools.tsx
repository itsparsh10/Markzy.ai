"use client";

import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Link from 'next/link';

export default function ToolsDetailsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const toolCategories = [
    {
      title: 'Blog Tools',
      overview: 'Create strategic blog content from ideation to publication and promotion.',
      tools: [
        {
          name: 'Blog Generator',
          purpose: 'Generate blog titles, outlines, and full articles based on your topic.',
          usage: 'Enter a topic and outline → generate headlines and full posts.',
          best: 'Creating consistent blog content when short on time.'
        },
        {
          name: 'Blog Promo',
          purpose: 'Create promotional content for your blog post to drive traffic.',
          usage: 'Paste blog link or summary → generate social media captions.',
          best: 'Promoting newly published blogs to maximize visibility.'
        }
      ]
    },
    {
      title: 'Email Tools',
      overview: 'Comprehensive email marketing from welcome sequences to cart abandonment.',
      tools: [
        {
          name: 'Abandoned Cart Sequence',
          purpose: 'Create email sequences to recover abandoned shopping carts.',
          usage: 'Input product details → generate follow-up email series.',
          best: 'Recovering lost sales and improving conversion rates.'
        },
        {
          name: 'Brand Emails',
          purpose: 'Generate brand-consistent email templates.',
          usage: 'Define brand voice → create customized email templates.',
          best: 'Maintaining consistent brand communication.'
        }
      ]
    },
    {
      title: 'Social Media Tools',
      overview: 'Comprehensive social media content creation and strategy tools.',
      tools: [
        {
          name: 'Carousel Content',
          purpose: 'Create engaging carousel posts for social media platforms.',
          usage: 'Input topic and key points → generate slide-by-slide content.',
          best: 'Creating educational and engaging multi-slide posts.'
        }
      ]
    }
  ];

  const filteredCategories = toolCategories.filter(category => 
    category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.overview.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.tools.some(tool => 
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.purpose.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-gray-50">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/knowledge-base" className="text-blue-600 hover:underline flex items-center gap-2">
              <i className="fas fa-arrow-left"></i>
              <span>Back to Knowledge Base</span>
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-2xl font-bold text-gray-800">All AI Tool Categories</h1>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-4">Search Tools</h2>
                <input
                  type="text"
                  placeholder="Search categories, tools, or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-6">
              {filteredCategories.map((category, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border">
                  <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{category.title}</h3>
                    <p className="text-gray-600">{category.overview}</p>
                    <span className="inline-block mt-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {category.tools.length} tools
                    </span>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      {category.tools.map((tool, toolIndex) => (
                        <div key={toolIndex} className="bg-gray-50 rounded-lg p-4 border">
                          <h4 className="font-semibold text-gray-800 mb-3">{tool.name}</h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Purpose:</span>
                              <p className="text-gray-600 mt-1">{tool.purpose}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Usage:</span>
                              <p className="text-gray-600 mt-1">{tool.usage}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Best for:</span>
                              <p className="text-gray-600 mt-1">{tool.best}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredCategories.length === 0 && (
              <div className="text-center py-12">
                <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
                <h3 className="text-lg font-medium text-gray-800 mb-2">No tools found</h3>
                <p className="text-gray-600">Try adjusting your search terms.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
