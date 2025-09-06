'use client';
import React, { useState } from 'react';

const aiTools = [
  {
    category: 'Content Creation',
    icon: 'fas fa-pen-fancy',
    color: 'purple',
    tools: [
      { name: 'Blog Generator', description: 'SEO-optimized blog content and outlines' },
      { name: 'Content Repurposer', description: 'Turn one content into multiple formats' },
      { name: 'Story-Based Posts', description: 'Emotional storytelling content' },
      { name: 'Content Pillars', description: 'Define your brand\'s main content themes' },
      { name: 'Content Ideas', description: 'Generate FAQs and topic clusters by pillar' },
      { name: 'Content Outline', description: 'Structure blogs, videos, and podcast episodes' },
      { name: 'Blog from Transcripts', description: 'Transform recorded content into articles' },
      { name: 'Weekly Content Assets', description: 'Generate all content for one week instantly' }
    ]
  },
  {
    category: 'Social Media',
    icon: 'fas fa-share-alt',
    color: 'blue',
    tools: [
      { name: 'Instagram Captions', description: 'Engaging posts with compelling CTAs' },
      { name: 'Carousel Content', description: 'Multi-slide educational posts' },
      { name: 'Reels Scripts', description: 'Short-form video content scripts' },
      { name: '30-Day Social Plan', description: 'Complete monthly content strategy' },
      { name: 'TikTok Scripts', description: 'Viral short-form video content' },
      { name: 'LinkedIn Posts', description: 'Professional networking content' },
      { name: 'Twitter Threads', description: 'Engaging multi-tweet narratives' },
      { name: 'Pinterest Descriptions', description: 'SEO-optimized pin descriptions' }
    ]
  },
  {
    category: 'Email Marketing',
    icon: 'fas fa-envelope',
    color: 'green',
    tools: [
      { name: 'Welcome Sequence', description: 'New subscriber onboarding emails' },
      { name: 'Sales Emails', description: 'High-converting promotional sequences' },
      { name: 'Abandoned Cart', description: 'Recover lost sales automatically' },
      { name: 'Subject Line Generator', description: 'Boost open rates with compelling subjects' },
      { name: 'Newsletter Templates', description: 'Weekly and monthly newsletter content' },
      { name: 'Product Launch Emails', description: 'Build anticipation and drive sales' },
      { name: 'Re-engagement Campaigns', description: 'Win back inactive subscribers' },
      { name: 'Seasonal Promotions', description: 'Holiday and event-based campaigns' }
    ]
  },
  {
    category: 'Business Strategy',
    icon: 'fas fa-chart-line',
    color: 'orange',
    tools: [
      { name: 'Buyer Persona', description: 'Detailed ideal customer profiles' },
      { name: 'Customer Journey', description: 'Map discovery to purchase stages' },
      { name: 'Brand Messaging', description: 'Consistent voice across platforms' },
      { name: 'Marketing Plans', description: '30-day strategic campaigns' },
      { name: 'Competitive Analysis', description: 'Market positioning and differentiation' },
      { name: 'SWOT Analysis', description: 'Strategic business assessment' },
      { name: 'Value Proposition', description: 'Clear unique selling points' },
      { name: 'Growth Strategies', description: 'Scalable business expansion plans' }
    ]
  },
  {
    category: 'E-commerce',
    icon: 'fas fa-shopping-cart',
    color: 'red',
    tools: [
      { name: 'Product Descriptions', description: 'Compelling product copy that converts' },
      { name: 'Amazon Listings', description: 'Keyword-optimized marketplace content' },
      { name: 'Sales Pages', description: 'Long-form persuasive landing pages' },
      { name: 'Upsell Copy', description: 'Increase average order value' },
      { name: 'Category Descriptions', description: 'Collection and category page copy' },
      { name: 'Review Responses', description: 'Professional customer service replies' },
      { name: 'Flash Sale Copy', description: 'Urgency-driven promotional content' },
      { name: 'Bundle Descriptions', description: 'Product package presentation copy' }
    ]
  },
  {
    category: 'SEO & Website',
    icon: 'fas fa-search',
    color: 'teal',
    tools: [
      { name: 'Keyword Research', description: 'Strategic keyword clusters by intent' },
      { name: 'Meta Descriptions', description: 'SEO-optimized page metadata' },
      { name: 'Homepage Copy', description: 'Conversion-focused website content' },
      { name: 'About Page Copy', description: 'Compelling brand story pages' },
      { name: 'FAQ Generation', description: 'Comprehensive customer support content' },
      { name: 'Schema Markup', description: 'Structured data for better rankings' },
      { name: 'Local SEO Content', description: 'Location-based optimization copy' },
      { name: 'Technical SEO Audit', description: 'Website performance recommendations' }
    ]
  },
  {
    category: 'Video & Audio',
    icon: 'fas fa-video',
    color: 'pink',
    tools: [
      { name: 'YouTube Scripts', description: 'Engaging video content outlines' },
      { name: 'Podcast Outlines', description: 'Structured episode frameworks' },
      { name: 'Video Descriptions', description: 'SEO-optimized video metadata' },
      { name: 'Webinar Scripts', description: 'Educational presentation content' },
      { name: 'Tutorial Scripts', description: 'Step-by-step instructional content' },
      { name: 'Interview Questions', description: 'Thought-provoking conversation starters' },
      { name: 'Voice-Over Scripts', description: 'Professional narration content' },
      { name: 'Audio Ad Scripts', description: 'Radio and podcast advertising copy' }
    ]
  },
  {
    category: 'Advertising',
    icon: 'fas fa-bullhorn',
    color: 'indigo',
    tools: [
      { name: 'Google Ads Copy', description: 'High-converting search advertisements' },
      { name: 'Facebook Ad Scripts', description: 'Social media advertising content' },
      { name: 'Landing Page Copy', description: 'Conversion-optimized page content' },
      { name: 'PPC Headlines', description: 'Attention-grabbing ad headlines' },
      { name: 'Display Ad Copy', description: 'Banner and visual ad content' },
      { name: 'Retargeting Ads', description: 'Re-engagement advertising messages' },
      { name: 'A/B Test Variants', description: 'Multiple ad copy versions for testing' },
      { name: 'Campaign Strategies', description: 'Comprehensive advertising plans' }
    ]
  },
  {
    category: 'Sales & CRM',
    icon: 'fas fa-handshake',
    color: 'cyan',
    tools: [
      { name: 'Sales Scripts', description: 'Persuasive phone and video call scripts' },
      { name: 'Proposal Templates', description: 'Professional business proposals' },
      { name: 'Follow-up Sequences', description: 'Persistent lead nurturing campaigns' },
      { name: 'Objection Handlers', description: 'Responses to common sales objections' },
      { name: 'Cold Outreach', description: 'First contact email and message templates' },
      { name: 'Contract Templates', description: 'Legal agreement frameworks' },
      { name: 'Quote Generators', description: 'Professional pricing presentations' },
      { name: 'Thank You Messages', description: 'Post-purchase relationship building' }
    ]
  },
  {
    category: 'Analytics & Reports',
    icon: 'fas fa-chart-pie',
    color: 'emerald',
    tools: [
      { name: 'Performance Reports', description: 'Comprehensive marketing analytics' },
      { name: 'ROI Calculators', description: 'Return on investment tracking tools' },
      { name: 'Campaign Analysis', description: 'Detailed marketing campaign breakdowns' },
      { name: 'Conversion Tracking', description: 'Goal achievement measurement tools' },
      { name: 'Traffic Reports', description: 'Website visitor behavior analysis' },
      { name: 'Social Media Metrics', description: 'Platform performance tracking' },
      { name: 'Email Analytics', description: 'Email marketing performance reports' },
      { name: 'Competitor Insights', description: 'Market position analysis tools' }
    ]
  }
];

const colorClasses = {
  blue: {
    bg: 'from-blue-500 to-blue-600',
    text: 'text-blue-600',
    bgLight: 'bg-blue-50',
    border: 'border-blue-200'
  },
  green: {
    bg: 'from-green-500 to-green-600',
    text: 'text-green-600',
    bgLight: 'bg-green-50',
    border: 'border-green-200'
  },
  purple: {
    bg: 'from-purple-500 to-purple-600',
    text: 'text-purple-600',
    bgLight: 'bg-purple-50',
    border: 'border-purple-200'
  },
  orange: {
    bg: 'from-orange-500 to-orange-600',
    text: 'text-orange-600',
    bgLight: 'bg-orange-50',
    border: 'border-orange-200'
  },
  red: {
    bg: 'from-red-500 to-red-600',
    text: 'text-red-600',
    bgLight: 'bg-red-50',
    border: 'border-red-200'
  },
  teal: {
    bg: 'from-teal-500 to-teal-600',
    text: 'text-teal-600',
    bgLight: 'bg-teal-50',
    border: 'border-teal-200'
  },
  pink: {
    bg: 'from-pink-500 to-pink-600',
    text: 'text-pink-600',
    bgLight: 'bg-pink-50',
    border: 'border-pink-200'
  },
  indigo: {
    bg: 'from-indigo-500 to-indigo-600',
    text: 'text-indigo-600',
    bgLight: 'bg-indigo-50',
    border: 'border-indigo-200'
  },
  cyan: {
    bg: 'from-cyan-500 to-cyan-600',
    text: 'text-cyan-600',
    bgLight: 'bg-cyan-50',
    border: 'border-cyan-200'
  },
  emerald: {
    bg: 'from-emerald-500 to-emerald-600',
    text: 'text-emerald-600',
    bgLight: 'bg-emerald-50',
    border: 'border-emerald-200'
  }
};

export default function AIToolsShowcase() {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <section 
      id="tools" 
      className="py-20 px-4 sm:px-6 lg:px-8"
      style={{
        background: 'linear-gradient(135deg, rgba(29, 31, 137, 0.05) 0%, rgba(70, 173, 182, 0.05) 100%)'
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="audiowide-regular text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            100+ AI Tools at
            <span 
              className="audiowide-regular pb-1 bg-clip-text text-transparent block"
              style={{
                background: 'linear-gradient(to right, #1d1f89, #46adb6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Your Fingertips
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From social media posts to comprehensive marketing strategies, we&apos;ve got every tool you need across {aiTools.length} specialized categories
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Category Tabs - Scrollable */}
          <div className="lg:col-span-1">
            <div className="h-96 lg:h-[600px] overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 smooth-scroll">
              {aiTools.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setActiveCategory(index)}
                  className={`w-full text-left p-6 rounded-xl transition-all duration-300 border-2 ${
                    activeCategory === index
                      ? `${colorClasses[category.color as keyof typeof colorClasses].bgLight} ${colorClasses[category.color as keyof typeof colorClasses].border} shadow-md`
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses[category.color as keyof typeof colorClasses].bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <i className={`${category.icon} text-white text-xl`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold text-lg truncate ${
                        activeCategory === index 
                          ? colorClasses[category.color as keyof typeof colorClasses].text 
                          : 'text-gray-800'
                      }`}>
                        {category.category}
                      </h3>
                      {/* <p className="text-sm text-gray-600">
                        {category.tools.length} tools available
                      </p> */}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            {/* Scroll Indicator */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500 flex items-center justify-center">
                <i className="fas fa-mouse mr-2"></i>
                Scroll to explore all {aiTools.length} categories
              </p>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="lg:col-span-2">
            <div className="h-96 lg:h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 smooth-scroll">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
                {aiTools[activeCategory].tools.map((tool, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md tool-card-hover border border-gray-100 hover:border-gray-200 group"
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-10 h-10 ${colorClasses[aiTools[activeCategory].color as keyof typeof colorClasses].bgLight} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                        <i className={`fas fa-wand-magic-sparkles ${colorClasses[aiTools[activeCategory].color as keyof typeof colorClasses].text} text-sm`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {tool.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA - Now inside scrollable area */}
              <div className="mt-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100 sticky bottom-0">
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 mb-2">Ready to explore all tools?</h4>
                  <p className="text-gray-600 text-sm mb-4">Get instant access to our complete toolkit</p>
                  <a 
                    href="/login"
                    className="inline-flex items-center px-6 py-2 text-white rounded-lg transition-all duration-200 font-medium"
                    style={{
                      background: 'linear-gradient(45deg, #1d1f89 0%, #46adb6 100%)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    View All 100+ Tools
                    <i className="fas fa-arrow-right ml-2"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
