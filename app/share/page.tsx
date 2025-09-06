"use client";

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Link from 'next/link';

export default function ShareTheMagic() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [customMessage, setCustomMessage] = useState('');

  const shareText = "🚀 Just discovered Markzy - the ultimate AI-powered marketing platform that's revolutionizing content creation! From social media posts to email campaigns, blog content to ad copy, Markzy's AI tools are making my marketing efforts 10x more effective and saving me hours every day. This is a game-changer for anyone in digital marketing! ✨ #Markzy #AIMarketing #ContentCreation #DigitalMarketing #MarketingAutomation";

  const shareLinks = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://markzy.ai')}&title=${encodeURIComponent('Markzy - The Ultimate AI Marketing Platform')}&summary=${encodeURIComponent(shareText)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent('https://markzy.ai')}&hashtags=Markzy,AIMarketing,ContentCreation,MarketingAutomation`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://markzy.ai')}&quote=${encodeURIComponent(shareText)}`,
    instagram: `https://www.instagram.com/?url=${encodeURIComponent('https://markzy.ai')}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' \n\nJoin me on Markzy: https://markzy.ai')}`,
    email: `mailto:?subject=${encodeURIComponent('You need to see this: Markzy AI Marketing Platform!')}&body=${encodeURIComponent(shareText + '\n\nJoin me on Markzy and transform your marketing: https://markzy.ai')}`
  };

  const platforms = [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: 'fab fa-linkedin',
      color: 'bg-blue-600 hover:bg-blue-700',
      description: 'Share with your professional network'
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      icon: 'fab fa-twitter',
      color: 'bg-black hover:bg-gray-800',
      description: 'Share with your followers'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: 'fab fa-facebook',
      color: 'bg-blue-500 hover:bg-blue-600',
      description: 'Share with your friends'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: 'fab fa-instagram',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      description: 'Share in your stories or posts'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: 'fab fa-whatsapp',
      color: 'bg-green-500 hover:bg-green-600',
      description: 'Share with your contacts'
    },
    {
      id: 'email',
      name: 'Email',
      icon: 'fas fa-envelope',
      color: 'bg-gray-600 hover:bg-gray-700',
      description: 'Share via email'
    }
  ];

  const handleShare = (platform: string) => {
    const url = shareLinks[platform as keyof typeof shareLinks];
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Text copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50/30">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-slate-200/50 px-8 py-6">
          <div className="w-full">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center">
                <i className="fas fa-share-alt text-slate-600 text-xl"></i>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Share Markzy</h1>
                <p className="text-slate-600">Help others discover the power of AI-driven marketing with Markzy</p>
              </div>
            </div>
          </div>
        </header>

        <div className="w-full p-8">
          {/* Markzy Success Stories */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-slate-200/50 p-8 mb-8 shadow-lg">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-lg">
                <i className="fas fa-star text-white text-2xl"></i>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Markzy Success Stories</h2>
                <p className="text-slate-600 text-lg">Real results from real Markzy users</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/80 p-6 rounded-2xl border border-blue-200/50 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <i className="fas fa-chart-line text-white"></i>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-800">Sarah Johnson</p>
                    <p className="text-sm text-blue-600">Digital Marketing Manager</p>
                  </div>
                </div>
                <p className="text-slate-700 mb-4">"Markzy increased my content output by 400% while maintaining quality. The AI suggestions are incredibly accurate!"</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-blue-600">400%</span>
                  <span className="text-sm text-slate-600">increase in content output</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/80 p-6 rounded-2xl border border-emerald-200/50 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                    <i className="fas fa-dollar-sign text-white"></i>
                  </div>
                  <div>
                    <p className="font-semibold text-emerald-800">Mike Chen</p>
                    <p className="text-sm text-emerald-600">E-commerce Owner</p>
                  </div>
                </div>
                <p className="text-slate-700 mb-4">"Markzy's AI-generated product descriptions boosted my conversion rates by 250%. ROI was immediate!"</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-emerald-600">250%</span>
                  <span className="text-sm text-slate-600">conversion rate increase</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100/80 p-6 rounded-2xl border border-purple-200/50 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <i className="fas fa-clock text-white"></i>
                  </div>
                  <div>
                    <p className="font-semibold text-purple-800">Lisa Rodriguez</p>
                    <p className="text-sm text-purple-600">Social Media Strategist</p>
                  </div>
                </div>
                <p className="text-slate-700 mb-4">"Markzy saves me 20+ hours per week on content creation. I can focus on strategy instead of writing!"</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-purple-600">20+</span>
                  <span className="text-sm text-slate-600">hours saved weekly</span>
                </div>
              </div>
            </div>
          </div>

          {/* Share Message Preview */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-slate-200/50 p-8 mb-8 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <i className="fas fa-quote-left text-white text-xl"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Your Markzy Share Message</h2>
                <p className="text-slate-600">Ready-to-share content promoting Markzy</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-slate-100/80 rounded-2xl p-6 mb-6 border border-slate-200/50 shadow-sm">
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{shareText}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => copyToClipboard(shareText)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <i className="fas fa-copy"></i>
                Copy Message
              </button>
              <button
                onClick={() => setCustomMessage('')}
                className="px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <i className="fas fa-undo"></i>
                Reset
              </button>
              <button
                onClick={() => copyToClipboard('https://markzy.ai')}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <i className="fas fa-link"></i>
                Copy Markzy Link
              </button>
            </div>
          </div>

          {/* Custom Message */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-slate-200/50 p-8 mb-8 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                <i className="fas fa-edit text-white text-xl"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Customize Your Markzy Message</h2>
                <p className="text-slate-600">Personalize how you share Markzy with your network</p>
              </div>
            </div>
            <textarea
              value={customMessage || shareText}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={6}
              className="w-full px-4 py-4 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-slate-700 resize-none shadow-sm"
              placeholder="Customize your Markzy share message..."
            />
            <div className="flex items-start gap-3 mt-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fas fa-lightbulb text-white text-sm"></i>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium mb-2">Pro tip for maximum reach:</p>
                <ul className="text-sm text-slate-500 space-y-1">
                  <li>• Include #Markzy #AIMarketing #ContentCreation hashtags</li>
                  <li>• Mention specific results you've achieved with Markzy</li>
                  <li>• Tag relevant colleagues who could benefit from Markzy</li>
                  <li>• Share on multiple platforms for broader exposure</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Social Media Platforms */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-slate-200/50 p-8 mb-8 shadow-lg">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl flex items-center justify-center shadow-lg">
                <i className="fas fa-share-alt text-white text-2xl"></i>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Share Markzy on Social Media</h2>
                <p className="text-slate-600 text-lg">Spread the word about Markzy across all platforms</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {platforms.map((platform) => (
                <div
                  key={platform.id}
                  className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1"
                  onClick={() => handleShare(platform.id)}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-14 h-14 ${platform.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <i className={`${platform.icon} text-white text-xl`}></i>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{platform.name}</h3>
                      <p className="text-sm text-slate-600">{platform.description}</p>
                    </div>
                  </div>
                  <button
                    className={`w-full py-3 ${platform.color} text-white rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg font-medium`}
                  >
                    <i className="fas fa-share"></i>
                    Share Markzy on {platform.name}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Pre-written Markzy Messages */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-slate-200/50 p-8 mb-8 shadow-lg">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg">
                <i className="fas fa-comments text-white text-2xl"></i>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Ready-to-Share Markzy Messages</h2>
                <p className="text-slate-600 text-lg">Pre-written messages highlighting different aspects of Markzy</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/80 border border-emerald-200/50 rounded-2xl p-6 shadow-md">
                <h3 className="font-bold text-emerald-800 mb-3 text-lg flex items-center gap-2">
                  <i className="fas fa-rocket text-emerald-600"></i>
                  Productivity Focus
                </h3>
                <p className="text-slate-700 mb-4 leading-relaxed">
                  "Markzy has completely transformed my content workflow! What used to take me hours now takes minutes. The AI-powered tools are incredibly smart and save me 20+ hours per week. Perfect for busy marketers! 🚀 #Markzy #Productivity #AIMarketing"
                </p>
                <button
                  onClick={() => copyToClipboard("Markzy has completely transformed my content workflow! What used to take me hours now takes minutes. The AI-powered tools are incredibly smart and save me 20+ hours per week. Perfect for busy marketers! 🚀 #Markzy #Productivity #AIMarketing https://markzy.ai")}
                  className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                >
                  <i className="fas fa-copy mr-2"></i>
                  Copy Productivity Message
                </button>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/80 border border-blue-200/50 rounded-2xl p-6 shadow-md">
                <h3 className="font-bold text-blue-800 mb-3 text-lg flex items-center gap-2">
                  <i className="fas fa-chart-line text-blue-600"></i>
                  Results Focus
                </h3>
                <p className="text-slate-700 mb-4 leading-relaxed">
                  "Since using Markzy, my content engagement has skyrocketed by 300%! The AI suggestions are incredibly accurate and help create content that truly resonates. Every marketer needs this tool! 📈 #Markzy #Results #ContentMarketing"
                </p>
                <button
                  onClick={() => copyToClipboard("Since using Markzy, my content engagement has skyrocketed by 300%! The AI suggestions are incredibly accurate and help create content that truly resonates. Every marketer needs this tool! 📈 #Markzy #Results #ContentMarketing https://markzy.ai")}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                >
                  <i className="fas fa-copy mr-2"></i>
                  Copy Results Message
                </button>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100/80 border border-purple-200/50 rounded-2xl p-6 shadow-md">
                <h3 className="font-bold text-purple-800 mb-3 text-lg flex items-center gap-2">
                  <i className="fas fa-magic text-purple-600"></i>
                  Innovation Focus
                </h3>
                <p className="text-slate-700 mb-4 leading-relaxed">
                  "Markzy is the future of marketing! The AI technology is mind-blowing - it understands my brand voice perfectly and creates content that sounds exactly like me. This is innovation at its finest! ✨ #Markzy #Innovation #AITechnology"
                </p>
                <button
                  onClick={() => copyToClipboard("Markzy is the future of marketing! The AI technology is mind-blowing - it understands my brand voice perfectly and creates content that sounds exactly like me. This is innovation at its finest! ✨ #Markzy #Innovation #AITechnology https://markzy.ai")}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                >
                  <i className="fas fa-copy mr-2"></i>
                  Copy Innovation Message
                </button>
              </div>
              
              <div className="bg-gradient-to-br from-rose-50 to-rose-100/80 border border-rose-200/50 rounded-2xl p-6 shadow-md">
                <h3 className="font-bold text-rose-800 mb-3 text-lg flex items-center gap-2">
                  <i className="fas fa-heart text-rose-600"></i>
                  Community Focus
                </h3>
                <p className="text-slate-700 mb-4 leading-relaxed">
                  "I love how Markzy makes high-quality marketing accessible to everyone! Whether you're a startup or enterprise, the platform scales with you. Join the Markzy community and transform your marketing! 💖 #Markzy #Community #MarketingForAll"
                </p>
                <button
                  onClick={() => copyToClipboard("I love how Markzy makes high-quality marketing accessible to everyone! Whether you're a startup or enterprise, the platform scales with you. Join the Markzy community and transform your marketing! 💖 #Markzy #Community #MarketingForAll https://markzy.ai")}
                  className="w-full px-4 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl hover:from-rose-700 hover:to-pink-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                >
                  <i className="fas fa-copy mr-2"></i>
                  Copy Community Message
                </button>
              </div>
            </div>
          </div>

          {/* Quick Share Options */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-slate-200/50 p-8 mb-8 shadow-lg">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-lg">
                <i className="fas fa-bolt text-white text-2xl"></i>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Quick Markzy Shares</h2>
                <p className="text-slate-600 text-lg">One-click sharing options for different scenarios</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/80 border border-emerald-200/50 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
                    <i className="fas fa-user-friends text-white"></i>
                  </div>
                  <h3 className="font-bold text-emerald-800 text-lg">Share Your Journey</h3>
                </div>
                <p className="text-slate-700 mb-4 leading-relaxed">
                  "My Markzy journey has been incredible! From struggling with content creation to producing high-quality marketing materials effortlessly. Game-changer! 🚀"
                </p>
                <button
                  onClick={() => copyToClipboard("My Markzy journey has been incredible! From struggling with content creation to producing high-quality marketing materials effortlessly. Game-changer! 🚀 #Markzy #MarketingJourney https://markzy.ai")}
                  className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                >
                  <i className="fas fa-copy mr-2"></i>
                  Copy Journey Message
                </button>
              </div>
              
              <div className="bg-gradient-to-br from-amber-50 to-amber-100/80 border border-amber-200/50 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                    <i className="fas fa-trophy text-white"></i>
                  </div>
                  <h3 className="font-bold text-amber-800 text-lg">Share Achievements</h3>
                </div>
                <p className="text-slate-700 mb-4 leading-relaxed">
                  "Thanks to Markzy, I just hit my highest engagement rates ever! The AI-powered content is converting like crazy. Every marketer needs this! 📈"
                </p>
                <button
                  onClick={() => copyToClipboard("Thanks to Markzy, I just hit my highest engagement rates ever! The AI-powered content is converting like crazy. Every marketer needs this! 📈 #Markzy #MarketingWins https://markzy.ai")}
                  className="w-full px-4 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                >
                  <i className="fas fa-copy mr-2"></i>
                  Copy Achievement Message
                </button>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/80 border border-indigo-200/50 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                    <i className="fas fa-lightbulb text-white"></i>
                  </div>
                  <h3 className="font-bold text-indigo-800 text-lg">Share Insights</h3>
                </div>
                <p className="text-slate-700 mb-4 leading-relaxed">
                  "Markzy's AI doesn't just create content - it understands strategy! The insights and suggestions have elevated my entire marketing approach. Mind-blown! 🧠"
                </p>
                <button
                  onClick={() => copyToClipboard("Markzy's AI doesn't just create content - it understands strategy! The insights and suggestions have elevated my entire marketing approach. Mind-blown! 🧠 #Markzy #AIStrategy https://markzy.ai")}
                  className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                >
                  <i className="fas fa-copy mr-2"></i>
                  Copy Insights Message
                </button>
              </div>
            </div>
          </div>

          {/* Why Share Markzy Section */}
          <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-3xl p-8 shadow-lg border border-indigo-200/50">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl flex items-center justify-center shadow-lg">
                <i className="fas fa-star text-white text-2xl"></i>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Why Share Markzy?</h2>
                <p className="text-slate-600 text-lg">The impact of sharing Markzy with your network</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <i className="fas fa-rocket text-white text-2xl"></i>
                </div>
                <h3 className="font-bold text-slate-800 mb-3 text-lg">Boost Productivity</h3>
                <p className="text-slate-600 leading-relaxed">Help others save 20+ hours per week with Markzy's AI-powered content creation tools</p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <i className="fas fa-chart-line text-white text-2xl"></i>
                </div>
                <h3 className="font-bold text-slate-800 mb-3 text-lg">Drive Results</h3>
                <p className="text-slate-600 leading-relaxed">Share the platform that's proven to increase engagement rates by 300% and conversion rates by 250%</p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <i className="fas fa-heart text-white text-2xl"></i>
                </div>
                <h3 className="font-bold text-slate-800 mb-3 text-lg">Support Community</h3>
                <p className="text-slate-600 leading-relaxed">Help fellow marketers discover the magic of Markzy and build a stronger marketing community</p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <i className="fas fa-magic text-white text-2xl"></i>
                </div>
                <h3 className="font-bold text-slate-800 mb-3 text-lg">Spread Innovation</h3>
                <p className="text-slate-600 leading-relaxed">Be part of the AI marketing revolution by introducing others to Markzy's cutting-edge technology</p>
              </div>
            </div>
            
            {/* Call to Action */}
            <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-indigo-200/50 shadow-md">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Ready to Share Markzy?</h3>
              <p className="text-slate-600 mb-6 text-lg">Choose your favorite platform above and start spreading the Markzy magic today!</p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => copyToClipboard('https://markzy.ai')}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl flex items-center gap-3"
                >
                  <i className="fas fa-link"></i>
                  Copy Markzy Link
                </button>
                <Link 
                  href="/all-tools"
                  className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl flex items-center gap-3"
                >
                  <i className="fas fa-tools"></i>
                  Explore Markzy Tools
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 