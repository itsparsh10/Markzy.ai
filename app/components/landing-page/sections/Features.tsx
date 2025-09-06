'use client';
import React from 'react';

const features = [
  {
    icon: 'fas fa-magic',
    title: 'AI-Powered Content',
    description: 'Generate high-converting marketing content in seconds using advanced AI technology.',
    color: 'blue'
  },
  {
    icon: 'fas fa-rocket',
    title: '100+ Marketing Tools',
    description: 'Everything you need from social media posts to email campaigns, all in one platform.',
    color: 'purple'
  },
  {
    icon: 'fas fa-chart-line',
    title: 'Boost Conversions',
    description: 'Increase your marketing performance with data-driven, proven templates.',
    color: 'green'
  },
  {
    icon: 'fas fa-clock',
    title: 'Save 10+ Hours/Week',
    description: 'Automate your content creation and focus on growing your business.',
    color: 'orange'
  },
  {
    icon: 'fas fa-users',
    title: 'Team Collaboration',
    description: 'Work together with your team on campaigns with seamless collaboration tools.',
    color: 'pink'
  },
  {
    icon: 'fas fa-shield-alt',
    title: 'Enterprise Security',
    description: 'Bank-level security to keep your marketing data safe and secure.',
    color: 'indigo'
  }
];

const colorClasses = {
  blue: 'from-blue-500 to-blue-600',
  purple: 'from-purple-500 to-purple-600',
  green: 'from-green-500 to-green-600',
  orange: 'from-orange-500 to-orange-600',
  pink: 'from-pink-500 to-pink-600',
  indigo: 'from-indigo-500 to-indigo-600',
};

export default function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="audiowide-regular text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need to
            <span 
              className="audiowide-regular pb-1 bg-clip-text text-transparent block"
              style={{
                background: 'linear-gradient(to right, #1d1f89, #46adb6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Supercharge Your Marketing
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful AI tools designed to transform your marketing workflow and deliver exceptional results
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-400 transition-all duration-300"
            >
              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-r ${colorClasses[feature.color as keyof typeof colorClasses]} rounded-2xl flex items-center justify-center mb-6`}>
                <i className={`${feature.icon} text-2xl text-white`}></i>
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
