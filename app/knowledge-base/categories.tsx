"use client";

import { useState } from 'react';

export default function AIToolCategories() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const categories = [
    {
      emoji: "✍️",
      number: "1",
      name: "Blog Magic",
      color: "blue",
      icon: "pen-fancy",
      purpose: "Generate blog titles, outlines, and full articles.",
      tools: "Blog Generator, Blog Posts, Blog Promo, Blog from Transcript",
      howTo: "Input a topic and target audience → AI suggests ideas → Generate post → Edit and publish."
    },
    {
      emoji: "💌",
      number: "2",
      name: "Email Magic",
      color: "green",
      icon: "envelope",
      purpose: "Create welcome sequences, nurture emails, and launch campaigns.",
      tools: "Welcome Sequence, Story-Based Emails, Email Freestyle, Opt-in & Sales Emails",
      howTo: "Choose campaign type → Add product details → Generate copy → Copy to email service."
    },
    {
      emoji: "🎯",
      number: "3",
      name: "Sales Page Magic",
      color: "amber",
      icon: "bullhorn",
      purpose: "Build compelling, conversion-optimized sales pages.",
      tools: "Sales Page, Tripwire, Upsell Page, Service Page",
      howTo: "Fill in your product details → AI outputs a full sales page structure with CTAs, pain points, and testimonials."
    },
    {
      emoji: "🎨",
      number: "4",
      name: "Social Magic",
      color: "pink",
      icon: "hashtag",
      purpose: "Create social media captions, carousels, and Reels scripts.",
      tools: "30-Day Social Plan, Story-Based Posts, Reels Scripts, Carousel Builder",
      howTo: "Pick a format → Add product/topic → AI generates captions and layout suggestions."
    },
    {
      emoji: "🧩",
      number: "5",
      name: "Brand Magic",
      color: "purple",
      icon: "fingerprint",
      purpose: "Shape your brand voice, tone, and positioning.",
      tools: "Mission/Vision, Brand Bio, Word Bank, Keyword Research",
      howTo: "Input brand name and purpose → Generate tone guides and messaging for team and marketing."
    },
    {
      emoji: "👥",
      number: "6",
      name: "Customer Magic",
      color: "indigo",
      icon: "users",
      purpose: "Define buyer personas and customer journeys.",
      tools: "Buyer Persona, Customer Journey, Ideal Problems, Testimonials to Benefits",
      howTo: "Select your product → Get automated audience insights and funnel steps."
    },
    {
      emoji: "🛍",
      number: "7",
      name: "Digital Shop & Ecommerce Magic",
      color: "cyan",
      icon: "shopping-bag",
      purpose: "Write ecommerce product pages, marketplace listings, and post-purchase content.",
      tools: "Shopify Descriptions, Etsy Listings, Abandoned Cart Emails",
      howTo: "Fill in product details → Choose platform → Generate listings and promotional assets."
    },
    {
      emoji: "🧵",
      number: "8",
      name: "Funnel Magic",
      color: "orange",
      icon: "funnel-dollar",
      purpose: "Build out your funnel, from ads to checkout to upsells.",
      tools: "Sales Pages, Checkout Pages, Ad Creatives, Post-Purchase Emails",
      howTo: "Select funnel stage → Add product info → Receive copy aligned with funnel psychology."
    },
    {
      emoji: "📢",
      number: "9",
      name: "Affiliate Magic",
      color: "yellow",
      icon: "handshake",
      purpose: "Help your affiliates promote your products.",
      tools: "Affiliate Emails, Promo Ideas, Messaging Templates",
      howTo: "Input offer → Generate plug-and-play promo content for affiliates to share."
    },
    {
      emoji: "💡",
      number: "10",
      name: "Freestyle + Transcript Magic",
      color: "lime",
      icon: "lightbulb",
      purpose: "Customize content or repurpose transcripts.",
      tools: "Freestyle Generator, Content from Transcripts, Rewrite Tools",
      howTo: "Upload transcripts or input custom prompt → Get tailored marketing assets from your raw content."
    }
  ];

  const toggleCategory = (index: number) => {
    setActiveCategory(activeCategory === index ? null : index);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
        <i className="fas fa-toolbox text-blue-600 mr-3"></i>
        AI Tool Categories & How to Use Them
      </h2>
      
      <div className="space-y-4">
        {categories.map((category, index) => (
          <div key={index} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
            <div 
              className={`bg-gradient-to-r from-${category.color}-50 to-${category.color}-100 border-b border-gray-200 px-6 py-4 cursor-pointer`}
              onClick={() => toggleCategory(index)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-${category.color}-100 text-${category.color}-600 flex items-center justify-center shadow-sm`}>
                    <i className={`fas fa-${category.icon} text-lg`}></i>
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg">
                    {category.emoji} {category.number}. {category.name}
                  </h3>
                </div>
                <div className={`transition-transform duration-300 ${activeCategory === index ? 'rotate-180' : ''}`}>
                  <i className="fas fa-chevron-down text-gray-500"></i>
                </div>
              </div>
            </div>
            
            {activeCategory === index && (
              <div className="p-6 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col">
                    <h4 className="text-sm uppercase text-gray-500 mb-2 font-medium">Purpose</h4>
                    <p className="text-gray-700">{category.purpose}</p>
                  </div>
                  
                  <div className="flex flex-col">
                    <h4 className="text-sm uppercase text-gray-500 mb-2 font-medium">Tools Include</h4>
                    <p className="text-gray-700">{category.tools}</p>
                  </div>
                  
                  <div className="flex flex-col">
                    <h4 className="text-sm uppercase text-gray-500 mb-2 font-medium">How to Use</h4>
                    <p className="text-gray-700">{category.howTo}</p>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <button className={`px-4 py-2 bg-${category.color}-500 hover:bg-${category.color}-600 text-white rounded-lg transition-colors text-sm flex items-center gap-2`}>
                    <i className="fas fa-external-link-alt"></i>
                    <span>Explore {category.name} Tools</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white">
            <i className="fas fa-magic text-xl"></i>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Ready to explore all AI Tools?</h3>
            <p className="text-gray-700 mb-4">
              Unlock the full power of our AI marketing suite with 100+ specialized tools designed to boost your marketing efforts.
            </p>
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2">
              <i className="fas fa-rocket"></i>
              <span>Get Started with AI Tools</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
