"use client";

import Sidebar from '../components/Sidebar';
import { useState, useEffect } from 'react';
import AIToolCategories from './categories';
import Link from 'next/link';

export default function KnowledgeBase() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [loading, setLoading] = useState(false); // Changed from true to false
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const faqData = [
    {
      question: "Is AI Tools beginner-friendly?",
      answer: "Yes! It's built for entrepreneurs and creators with zero marketing background."
    },
    {
      question: "What kind of content can I create?",
      answer: "Blog posts, social media captions, email sequences, sales pages, ads, product descriptions, and more."
    },
    {
      question: "How do I upgrade my plan?",
      answer: "Go to your dashboard → Click \"Upgrade Account\" → Choose your preferred plan (Monthly or Lifetime) → Confirm payment."
    },
    {
      question: "Do I need ChatGPT to use this?",
      answer: "Nope! AI Tools is powered independently with built-in prompts and logic – no external tools required."
    },
    {
      question: "Can I create content for more than one brand?",
      answer: "Yes. Depending on your plan, you can add and switch between multiple brand profiles."
    },
    {
      question: "Does it work for physical & digital products?",
      answer: "Yes! Separate tools exist for digital and physical product content, including descriptions and funnels."
    },
    {
      question: "Can I repurpose existing content (like transcripts)?",
      answer: "Absolutely. There are dedicated tools for turning videos, webinars, and transcripts into blogs, social posts, and emails."
    },
    {
      question: "Is the content copyright-free?",
      answer: "Yes. All AI-generated content is yours to use, modify, and publish commercially."
    },
    {
      question: "Can I get help if I'm stuck?",
      answer: "Yes. There's a built-in knowledge base and regular live support sessions for members."
    },
    {
      question: "Is there a refund policy?",
      answer: "You get a 7-day free trial. After that, refunds aren't typically offered, as access is instant and content is downloadable."
    }
  ];

  const recentArticles = [
    {
      title: "Complete Guide to AI-Powered Content Marketing",
      icon: "fas fa-robot",
      color: "blue",
      content: "Discover how artificial intelligence is revolutionizing content marketing. Learn to leverage AI tools for content creation, optimization, and distribution. This comprehensive guide covers everything from AI writing assistants to automated social media scheduling and performance analytics.",
      readTime: "12 min read",
      category: "AI Marketing",
      tags: ["AI", "Content Marketing", "Automation", "Strategy"]
    },
    {
      title: "Email Marketing Best Practices 2025",
      icon: "fas fa-envelope", 
      color: "green",
      content: "Master the latest email marketing techniques for 2025. From personalization strategies to automation workflows, this guide shows you how to increase open rates, click-through rates, and conversions. Learn about segmentation, A/B testing, and compliance with new email regulations.",
      readTime: "8 min read",
      category: "Email Marketing",
      tags: ["Email", "Marketing", "Automation", "Personalization"]
    },
    {
      title: "SEO Strategies for Small Businesses",
      icon: "fas fa-search",
      color: "purple", 
      content: "Boost your website's search engine rankings with these proven SEO strategies designed specifically for small businesses. Learn about keyword research, on-page optimization, local SEO, and content marketing techniques that will help you compete with larger competitors.",
      readTime: "10 min read",
      category: "SEO",
      tags: ["SEO", "Small Business", "Keywords", "Local SEO"]
    },
    {
      title: "Social Media Content That Converts",
      icon: "fas fa-bullhorn",
      color: "pink",
      content: "Create social media content that drives real business results. Learn the psychology behind viral content, platform-specific strategies, and how to build a content calendar that consistently engages your audience and drives conversions.",
      readTime: "7 min read",
      category: "Social Media",
      tags: ["Social Media", "Content", "Engagement", "Conversion"]
    },
    {
      title: "Building High-Converting Sales Funnels",
      icon: "fas fa-funnel-dollar",
      color: "amber",
      content: "Design and optimize sales funnels that turn visitors into customers. This guide covers funnel psychology, landing page optimization, email sequences, and conversion rate optimization techniques that top marketers use.",
      readTime: "15 min read",
      category: "Sales Funnels",
      tags: ["Sales Funnel", "Conversion", "Landing Pages", "CRO"]
    },
    {
      title: "Brand Building in the Digital Age",
      icon: "fas fa-crown",
      color: "indigo",
      content: "Build a powerful brand that resonates with your target audience. Learn about brand positioning, voice development, visual identity, and how to create consistent brand experiences across all touchpoints.",
      readTime: "9 min read",
      category: "Branding",
      tags: ["Branding", "Brand Building", "Identity", "Positioning"]
    },
    {
      title: "Customer Journey Mapping & Optimization",
      icon: "fas fa-route",
      color: "cyan",
      content: "Map and optimize every touchpoint in your customer's journey. Learn to identify pain points, improve user experience, and create seamless paths from awareness to advocacy.",
      readTime: "11 min read",
      category: "Customer Experience",
      tags: ["Customer Journey", "UX", "Optimization", "Experience"]
    },
    {
      title: "Affiliate Marketing Mastery Guide",
      icon: "fas fa-handshake",
      color: "orange",
      content: "Build and scale a profitable affiliate marketing program. Learn to recruit top affiliates, create compelling promotional materials, and optimize commission structures for maximum performance.",
      readTime: "13 min read",
      category: "Affiliate Marketing",
      tags: ["Affiliate Marketing", "Partnerships", "Commission", "Growth"]
    },
    {
      title: "E-commerce Product Page Optimization",
      icon: "fas fa-shopping-cart",
      color: "emerald",
      content: "Optimize your product pages for maximum conversions. Learn about product photography, compelling descriptions, trust signals, and checkout optimization techniques that increase sales.",
      readTime: "8 min read",
      category: "E-commerce",
      tags: ["E-commerce", "Product Pages", "Conversion", "Online Store"]
    },
    {
      title: "Content Repurposing Strategies",
      icon: "fas fa-recycle",
      color: "teal",
      content: "Maximize your content ROI by repurposing existing assets. Learn to transform one piece of content into multiple formats across different platforms, saving time while increasing reach.",
      readTime: "6 min read",
      category: "Content Strategy",
      tags: ["Content Repurposing", "Efficiency", "Multi-platform", "ROI"]
    }
  ];

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

  // Search functionality
  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const lowerQuery = query.toLowerCase();
    const results: any[] = [];

    // Search through categories
    categories.forEach((category, index) => {
      if (
        category.name.toLowerCase().includes(lowerQuery) ||
        category.purpose.toLowerCase().includes(lowerQuery) ||
        category.tools.toLowerCase().includes(lowerQuery) ||
        category.howTo.toLowerCase().includes(lowerQuery)
      ) {
        results.push({
          type: 'category',
          data: category,
          index,
          matchType: 'category'
        });
      }
    });

    // Search through FAQ
    faqData.forEach((faq, index) => {
      if (
        faq.question.toLowerCase().includes(lowerQuery) ||
        faq.answer.toLowerCase().includes(lowerQuery)
      ) {
        results.push({
          type: 'faq',
          data: faq,
          index,
          matchType: 'faq'
        });
      }
    });

    // Search through recent articles
    recentArticles.forEach((article, index) => {
      if (
        article.title.toLowerCase().includes(lowerQuery) ||
        article.content.toLowerCase().includes(lowerQuery)
      ) {
        results.push({
          type: 'article',
          data: article,
          index,
          matchType: 'article'
        });
      }
    });

    setSearchResults(results);
    setIsSearching(false);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    performSearch(query);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const toggleArticle = (index: number) => {
    setSelectedArticle(selectedArticle === index ? null : index);
  };

  // No API fetching needed
  useEffect(() => {
    // Set loading to false after a short delay to simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle hash navigation to FAQ section
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash === '#faq') {
        const faqElement = document.getElementById('faq');
        if (faqElement) {
          setTimeout(() => {
            faqElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
      }
    }
  }, []);

  return (
    <div className="h-full w-full flex overflow-hidden bg-gray-50">
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
              <i className="fas fa-book-open text-white text-lg"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Knowledge Base</h1>
              <p className="text-sm text-gray-500">Your marketing resource center</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search knowledge base..." 
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-80 px-4 py-2.5 pl-10 pr-10 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">Resources</span>
            </div>
          </div>
        </header>
        
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {/* Search Results */}
          {searchQuery && (
            <div className="mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    Search Results for "{searchQuery}"
                  </h3>
                  <span className="text-sm text-gray-500">
                    {isSearching ? 'Searching...' : `${searchResults.length} results found`}
                  </span>
                </div>
                
                {isSearching ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Searching...</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-4">
                    {searchResults.map((result, index) => (
                      <div key={`${result.type}-${result.index}`} className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm ${
                            result.type === 'category' ? 'bg-blue-500' :
                            result.type === 'faq' ? 'bg-green-500' :
                            'bg-purple-500'
                          }`}>
                            {result.type === 'category' && <i className="fas fa-toolbox"></i>}
                            {result.type === 'faq' && <i className="fas fa-question"></i>}
                            {result.type === 'article' && <i className="fas fa-file-alt"></i>}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                result.type === 'category' ? 'bg-blue-100 text-blue-700' :
                                result.type === 'faq' ? 'bg-green-100 text-green-700' :
                                'bg-purple-100 text-purple-700'
                              }`}>
                                {result.type === 'category' ? 'Category' :
                                 result.type === 'faq' ? 'FAQ' : 'Article'}
                              </span>
                              {result.type === 'category' && (
                                <span className="text-sm text-gray-500">{result.data.emoji} {result.data.name}</span>
                              )}
                            </div>
                            <h4 className="font-semibold text-gray-800 mb-2">
                              {result.type === 'category' ? result.data.name :
                               result.type === 'faq' ? result.data.question :
                               result.data.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {result.type === 'category' ? result.data.purpose :
                               result.type === 'faq' ? result.data.answer :
                               result.data.content.substring(0, 150)}...
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <i className="fas fa-search text-4xl text-gray-300 mb-4"></i>
                    <h4 className="text-lg font-semibold text-gray-600 mb-2">No results found</h4>
                    <p className="text-gray-500">Try adjusting your search terms or browse our categories below.</p>
                  </div>
                )}
              </div>
            </div>
          )}

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
                <i className="fas fa-lightbulb text-4xl text-yellow-300 drop-shadow-lg"></i>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium border border-white/20">
                    🚀 Premium Resource
                  </span>
                  <span className="px-3 py-1 bg-green-500/20 backdrop-blur-sm rounded-full text-xs font-medium border border-green-300/20">
                    ✨ AI-Powered
                  </span>
                </div>
                <h2 className="text-4xl font-bold mb-4 leading-tight">Marketing Knowledge Base</h2>
                <p className="text-blue-100 text-xl mb-6 leading-relaxed">Access comprehensive marketing guides, templates, and best practices to grow your business with proven strategies.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                      <i className="fas fa-check text-white text-sm"></i>
                    </div>
                    <span className="font-medium">Expert-curated content</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                      <i className="fas fa-sync text-white text-sm"></i>
                    </div>
                    <span className="font-medium">Updated regularly</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center">
                      <i className="fas fa-chart-line text-white text-sm"></i>
                    </div>
                    <span className="font-medium">Actionable insights</span>
                  </div>
                </div>
                

              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute top-4 right-4 w-16 h-16 bg-yellow-400/20 rounded-full animate-pulse"></div>
            <div className="absolute bottom-4 right-8 w-12 h-12 bg-cyan-400/20 rounded-full animate-pulse delay-1000"></div>
          </div>
          

          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Recent Articles Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <i className="fas fa-newspaper text-white text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">Latest Marketing Guides</h3>
                      <p className="text-gray-500">Expert insights and actionable strategies</p>
                    </div>
                  </div>
                  <Link href="/knowledge-base/articles" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    View All
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recentArticles.slice(0, 6).map((article, index) => (
                    <div 
                      key={index} 
                      className="group cursor-pointer border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all duration-300"
                      onClick={() => toggleArticle(index)}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${
                          article.color === 'blue' ? 'from-blue-500 to-blue-600' :
                          article.color === 'green' ? 'from-green-500 to-green-600' :
                          article.color === 'purple' ? 'from-purple-500 to-purple-600' :
                          article.color === 'pink' ? 'from-pink-500 to-pink-600' :
                          article.color === 'amber' ? 'from-amber-500 to-amber-600' :
                          article.color === 'indigo' ? 'from-indigo-500 to-indigo-600' :
                          article.color === 'cyan' ? 'from-cyan-500 to-cyan-600' :
                          article.color === 'orange' ? 'from-orange-500 to-orange-600' :
                          article.color === 'emerald' ? 'from-emerald-500 to-emerald-600' :
                          'from-teal-500 to-teal-600'
                        }`}>
                          <i className={`${article.icon} text-sm`}></i>
                        </div>
                        <div className="flex-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            article.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                            article.color === 'green' ? 'bg-green-100 text-green-700' :
                            article.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                            article.color === 'pink' ? 'bg-pink-100 text-pink-700' :
                            article.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                            article.color === 'indigo' ? 'bg-indigo-100 text-indigo-700' :
                            article.color === 'cyan' ? 'bg-cyan-100 text-cyan-700' :
                            article.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                            article.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-teal-100 text-teal-700'
                          }`}>
                            {article.category}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">{article.readTime}</span>
                      </div>
                      <h4 className="font-bold text-gray-800 text-base mb-2 group-hover:text-blue-600 transition-colors">
                        {article.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {article.content.substring(0, 120)}...
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {article.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span key={tagIndex} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Video Tutorials Section
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <i className="fas fa-play text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Video Tutorials</h3>
                    <p className="text-gray-500">Step-by-step visual guides</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      title: "Getting Started with AI Tools",
                      duration: "8:30",
                      thumbnail: "🚀",
                      description: "Complete walkthrough of your AI marketing toolkit"
                    },
                    {
                      title: "Creating Your First Sales Funnel",
                      duration: "12:45",
                      thumbnail: "💰",
                      description: "Build a high-converting sales funnel from scratch"
                    },
                    {
                      title: "Email Marketing Automation Setup",
                      duration: "15:20",
                      thumbnail: "📧",
                      description: "Set up automated email sequences that sell"
                    },
                    {
                      title: "Social Media Content Calendar",
                      duration: "10:15",
                      thumbnail: "📱",
                      description: "Plan and schedule content across all platforms"
                    }
                  ].map((video, index) => (
                    <div key={index} className="group cursor-pointer bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center text-2xl">
                            {video.thumbnail}
                          </div>
                          <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <i className="fas fa-play text-white text-lg"></i>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-1">{video.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{video.description}</p>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-md font-medium">
                              {video.duration}
                            </span>
                            <span className="text-xs text-gray-500">Premium Content</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div> */}
            </div>

            {/* Sidebar Content */}
            <div className="space-y-6">
              {/* Quick Start Guide */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                    <i className="fas fa-rocket text-white text-lg"></i>
                  </div>
                  <h3 className="text-xl font-bold text-blue-900">Quick Start</h3>
                </div>
                <div className="space-y-3">
                  {[
                    "Set up your brand profile",
                    "Choose your first AI tool",
                    "Generate your content",
                    "Optimize and publish"
                  ].map((step, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <span className="text-blue-800 font-medium">{step}</span>
                    </div>
                  ))}
                </div>
                <Link href="/start-here" className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center block">
                  Start Your Journey
                </Link>
              </div>

              {/* Popular Categories */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Popular Categories</h3>
                <div className="space-y-3">
                  {[
                    { name: "Email Marketing", count: 24, color: "green" },
                    { name: "Social Media", count: 31, color: "pink" },
                    { name: "Sales Funnels", count: 18, color: "amber" },
                    { name: "Content Creation", count: 27, color: "purple" },
                    { name: "SEO & Analytics", count: 15, color: "blue" }
                  ].map((cat, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          cat.color === 'green' ? 'bg-green-500' :
                          cat.color === 'pink' ? 'bg-pink-500' :
                          cat.color === 'amber' ? 'bg-amber-500' :
                          cat.color === 'purple' ? 'bg-purple-500' :
                          'bg-blue-500'
                        }`}></div>
                        <span className="font-medium text-gray-700">{cat.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">{cat.count} articles</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Latest Updates */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Latest Updates</h3>
                <div className="space-y-4">
                  {[
                    {
                      date: "2 days ago",
                      title: "New AI Writing Templates",
                      description: "Added 15 new content templates for better conversions"
                    },
                    {
                      date: "1 week ago", 
                      title: "Email Automation Guide",
                      description: "Complete guide to setting up email sequences"
                    },
                    {
                      date: "2 weeks ago",
                      title: "Social Media Calendar",
                      description: "New tools for content planning and scheduling"
                    }
                  ].map((update, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <div className="text-xs text-gray-500 mb-1">{update.date}</div>
                      <h4 className="font-semibold text-gray-800 mb-1">{update.title}</h4>
                      <p className="text-sm text-gray-600">{update.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Case Studies Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                <i className="fas fa-chart-line text-white text-xl"></i>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Success Stories</h3>
                <p className="text-gray-500">Real results from our AI tools</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  company: "E-commerce Startup",
                  result: "300% increase in email open rates",
                  description: "Used our email marketing templates to build automated sequences",
                  metric: "From 8% to 24% open rate",
                  color: "green"
                },
                {
                  company: "SaaS Company",
                  result: "50% faster content creation",
                  description: "Streamlined blog and social media content production",
                  metric: "20 hours saved per week",
                  color: "blue"
                },
                {
                  company: "Digital Agency",
                  result: "10x client campaign performance",
                  description: "Used AI tools to optimize client marketing campaigns",
                  metric: "Average 250% ROI improvement",
                  color: "purple"
                }
              ].map((study, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all">
                  <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                    study.color === 'green' ? 'bg-green-100 text-green-700' :
                    study.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {study.company}
                  </div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">{study.result}</h4>
                  <p className="text-gray-600 mb-3">{study.description}</p>
                  <div className={`text-sm font-semibold ${
                    study.color === 'green' ? 'text-green-600' :
                    study.color === 'blue' ? 'text-blue-600' :
                    'text-purple-600'
                  }`}>
                    {study.metric}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* AI Tools Overview Section - This will be part of the new 3-column layout */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <i className="fas fa-robot text-white text-xl"></i>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">About AI Tools</h3>
                <p className="text-gray-500">Your All-in-One AI Marketing Assistant</p>
              </div>
            </div>
            
            <div className="prose max-w-none mb-6">
              <p className="text-gray-700">
                In a world where content is king, AI Tools is your marketing wizard behind the curtain.
                Built for entrepreneurs, coaches, and small business owners, AI Tools is an AI-powered platform designed to eliminate writer's block, 
                accelerate content production, and help you craft high-converting marketing material – all in one place.
              </p>
              <p className="text-gray-700">
                Whether you need blog posts, sales pages, social captions, email campaigns, or product descriptions, 
                AI Tools empowers you with 100+ pre-trained tools organized across every stage of your marketing funnel.
                This isn't just a copy generator - it's a full-blown marketing operating system infused with strategy, 
                psychology, and templates that help you grow faster, smarter, and with less stress.
              </p>
            </div>
            
            {/* Tool Categories title remains */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600"></p>
              <Link href="/knowledge-base/tools-details" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <i className="fas fa-list-ul"></i>
                <span>View All Tool Details</span>
              </Link>
            </div>
            
            {/* Full Detailed List of All Categories */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <AIToolCategories />
            </div>
          </div>
          
          {/* Recent Articles */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Recent Articles</h3>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">View all</button>
            </div>
            
            <div className="space-y-4">
              {loading ? (
                // Loading skeleton for articles
                <>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl animate-pulse">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl animate-pulse">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl animate-pulse">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  </div>
                </>
              ) : (
                recentArticles.map((article: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                    <div 
                      onClick={() => toggleArticle(index)}
                      className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className={`w-10 h-10 bg-${article.color}-100 rounded-lg flex items-center justify-center`}>
                        <i className={`${article.icon} text-${article.color}-600`}></i>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{article.title}</h4>
                        <p className="text-sm text-gray-500">Click to read full article</p>
                      </div>
                      <i className={`fas fa-chevron-down text-gray-400 transition-transform duration-200 ${
                        selectedArticle === index ? 'rotate-180' : ''
                      }`}></i>
                    </div>
                    {selectedArticle === index && (
                      <div className="px-6 py-4 bg-white border-t border-gray-200">
                        <p className="text-gray-600 text-sm leading-relaxed">{article.content}</p>

                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* FAQ Section */}
          <div id="faq" className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                <i className="fas fa-question-circle text-white text-xl"></i>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Frequently Asked Questions</h3>
                <p className="text-gray-500">Everything you need to know about our platform</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {faqData.map((faq, index) => (
                <div key={index} className="group">
                  <div className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 ${
                    openFaq === index 
                      ? 'border-blue-200 bg-blue-50 shadow-lg' 
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                  }`}>
                    <button
                      onClick={() => toggleFaq(index)}
                      className={`w-full px-6 py-5 text-left transition-all duration-300 flex items-center justify-between ${
                        openFaq === index 
                          ? 'bg-blue-50' 
                          : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          openFaq === index 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                        }`}>
                          <i className={`fas fa-${openFaq === index ? 'minus' : 'plus'} text-xs`}></i>
                        </div>
                        <span className="font-semibold text-gray-800 text-base">{faq.question}</span>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                        openFaq === index 
                          ? 'bg-blue-500 text-white rotate-180' 
                          : 'bg-gray-100 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600'
                      }`}>
                        <i className="fas fa-chevron-down text-xs"></i>
                      </div>
                    </button>
                    {openFaq === index && (
                      <div className="px-6 py-6 bg-white border-t border-blue-200">
                        <div className="flex items-start gap-4">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div className="flex-1">
                            <p className="text-gray-700 text-base leading-relaxed">{faq.answer}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
