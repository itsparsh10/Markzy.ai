'use client';
import React, { useState } from 'react';
import Button from '../ui/Button';
import Link from 'next/link';

const pricingPlans = [
  {
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Perfect for getting started with AI marketing',
    features: [
      '5 AI-generated contents per month',
      '3 marketing tools access',
      'Basic templates',
      'Community support',
      'Export to PDF/Word'
    ],
    notIncluded: [
      'Priority support',
      'Advanced tools',
      'Team collaboration',
      'Custom branding'
    ],
    buttonText: 'Start Free',
    buttonVariant: 'outline' as const,
    popular: false
  },
  {
    name: 'Pro',
    price: 19.99,
    period: 'month',
    description: 'Everything you need to scale your marketing',
    features: [
      'Unlimited AI-generated content',
      'All 100+ marketing tools',
      'Premium templates',
      'Priority email support',
      'Advanced analytics',
      'Team collaboration (5 members)',
      'Custom branding',
      'API access'
    ],
    notIncluded: [],
    buttonText: 'Start 14-Day FREE Trial',
    buttonVariant: 'primary' as const,
    popular: true
  },
  {
    name: 'Enterprise',
    price: 199,
    period: 'month',
    description: 'Advanced features for growing teams',
    features: [
      'Everything in Pro',
      'Unlimited team members',
      'White-label solutions',
      'Dedicated account manager',
      '24/7 phone support',
      'Custom integrations',
      'Advanced reporting',
      'SLA guarantee'
    ],
    notIncluded: [],
    buttonText: 'Contact Sales',
    buttonVariant: 'secondary' as const,
    popular: false
  }
];

export default function Pricing() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: "How does Markzy's AI content generation work?",
      answer: "Markzy uses advanced GPT-4 and Claude AI models trained on millions of high-converting marketing campaigns. Our AI analyzes your brand voice, target audience, and campaign goals to generate personalized content that matches your style and drives results. The system learns from successful campaigns to continuously improve output quality.",
      icon: "fas fa-robot"
    },
    {
      question: "What marketing tools are included in Markzy?",
      answer: "Markzy includes 100+ AI-powered tools covering all marketing channels: email campaigns, social media content, blog posts, ad copy, sales letters, product descriptions, SEO content, video scripts, press releases, and more. Each tool is optimized for specific platforms like Facebook, Instagram, LinkedIn, Google Ads, and TikTok.",
      icon: "fas fa-tools"
    },
    {
      question: "Can I upgrade or downgrade my plan anytime?",
      answer: "Yes! You can change your plan instantly with no penalties. Upgrades take effect immediately with prorated billing. Downgrades apply at your next billing cycle. All your content history and projects remain accessible regardless of plan changes, ensuring seamless workflow continuity.",
      icon: "fas fa-sync-alt"
    },
    {
      question: "What's included in the 14-day free trial?",
      answer: "Complete access to ALL premium features, unlimited content generation, team collaboration tools, advanced templates, priority support, and export capabilities. No credit card required to start. No feature restrictions or watermarks. Generate up to 50,000 words of content during your trial period.",
      icon: "fas fa-gift"
    },
    {
      question: "How secure is my marketing data with Markzy?",
      answer: "We use bank-level encryption (AES-256), SOC 2 compliance, and GDPR-compliant data handling. All content is encrypted in transit and at rest. We never share your data with third parties or use it to train AI models. Regular security audits ensure your marketing strategies and content remain completely confidential.",
      icon: "fas fa-shield-alt"
    },
    {
      question: "Does Markzy support team collaboration?",
      answer: "Yes! Add unlimited team members, assign role-based permissions, share projects and templates, collaborate on campaigns in real-time, track team productivity, and maintain brand consistency across all content. Perfect for agencies, marketing teams, and businesses with multiple stakeholders.",
      icon: "fas fa-users"
    },
    {
      question: "How high-quality is the AI-generated content?",
      answer: "Our AI generates publication-ready content that matches professional copywriter quality. Built-in plagiarism detection, grammar checking, and tone analysis ensure every piece meets high standards. Content is optimized for conversions, SEO, and platform-specific requirements. 94% of users report improved engagement rates.",
      icon: "fas fa-star"
    },
    {
      question: "What support and training do you provide?",
      answer: "24/7 live chat support, comprehensive video tutorials, weekly webinars, dedicated success manager for Enterprise plans, extensive knowledge base, community forum, and onboarding assistance. We ensure you maximize ROI from day one with personalized training and ongoing support.",
      icon: "fas fa-headset"
    }
  ];
  const [isAnnual, setIsAnnual] = useState(false);

  const getPrice = (price: number) => {
    if (price === 0) return 0;
    return isAnnual ? Math.round(price * 0.8) : price;
  };

  return (
    <section 
      id="pricing" 
      className="py-20 px-4 sm:px-6 lg:px-8"
      style={{
        background: 'linear-gradient(135deg, rgba(29, 31, 137, 0.05) 0%, rgba(70, 173, 182, 0.05) 100%)'
      }}
    >
        {/* Free Trial Highlight */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-6 py-3 rounded-full" style={{
            background: 'linear-gradient(135deg, rgba(29, 31, 137, 0.1) 0%, rgba(70, 173, 182, 0.1) 100%)',
            border: '1px solid rgba(70, 173, 182, 0.3)'
          }}>
            <i className="fas fa-gift text-lg mr-3" style={{color: '#46adb6'}}></i>
            <span className="font-semibold" style={{color: '#1d1f89'}}>
              🎉 Limited Time: Access ALL Premium Features FREE for 14 Days 
            </span>
          </div>
        </div>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="audiowide-regular text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent
            <span 
              className="audiowide-regular pb-1 bg-clip-text text-transparent block"
              style={{
                background: 'linear-gradient(to right, #1d1f89, #46adb6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Pricing
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            Try all our premium tools absolutely free for 14 days. Get full access to every paid feature - no restrictions, no credit card required.
          </p>
          
          

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white rounded-full p-1 shadow-sm">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                !isAnnual
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isAnnual
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Annual
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-sm border-2 transition-all duration-300 hover:shadow-lg ${
                plan.popular
                  ? 'ring-4 transform scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              style={plan.popular ? {
                borderColor: '#46adb6',
                '--tw-ring-color': 'rgba(70, 173, 182, 0.2)'
              } as React.CSSProperties : {}}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div 
                    className="text-white px-6 py-2 rounded-full text-sm font-medium"
                    style={{
                      background: 'linear-gradient(45deg, #1d1f89 0%, #46adb6 100%)'
                    }}
                  >
                    ⭐ Most Popular
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-gray-900">
                      ${getPrice(plan.price)}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-600 text-lg">
                        /{plan.period}
                      </span>
                    )}
                    {isAnnual && plan.price > 0 && (
                      <div className="text-sm text-green-600 font-medium mt-1">
                        Save ${(plan.price * 12) - (getPrice(plan.price) * 12)} per year
                      </div>
                    )}
                    {plan.popular && (
                      <div className="text-sm font-medium mt-2 px-3 py-1 rounded-full inline-block" style={{
                        background: 'linear-gradient(135deg, rgba(29, 31, 137, 0.1) 0%, rgba(70, 173, 182, 0.1) 100%)',
                        color: '#1d1f89'
                      }}>
                        ✨ FREE for 14 days - Full access!
                      </div>
                    )}
                  </div>

                  <Link href={plan.name === 'Enterprise' ? '/contact' : '/register'}>
                    <Button 
                      variant={plan.buttonVariant} 
                      size="lg" 
                      className="w-full"
                    >
                      {plan.buttonText}
                    </Button>
                  </Link>
                </div>

                {/* Features List */}
                <div className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <i className="fas fa-check-circle text-green-500"></i>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.notIncluded.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3 opacity-50">
                      <i className="fas fa-times-circle text-gray-400"></i>
                      <span className="text-gray-500 text-sm line-through">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="text-center mb-16">
            <h3 
              className="audiowide-regular text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
              style={{
                background: 'linear-gradient(to right, #1d1f89, #46adb6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Frequently Asked Questions
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to know about Markzy's AI-powered marketing platform, pricing, and features.
            </p>
          </div>

          {/* Enhanced FAQ Accordion - 2 Column Grid */}
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:border-blue-400 h-fit">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'linear-gradient(45deg, #1d1f89 0%, #46adb6 100%)' }}
                      >
                        <i className={`${faq.icon} text-white text-sm`}></i>
                      </div>
                      <h4 className="font-bold text-base text-gray-900 pr-4 leading-tight">{faq.question}</h4>
                    </div>
                    <div className="flex-shrink-0">
                      <i className={`fas ${openFAQ === index ? 'fa-minus' : 'fa-plus'} text-gray-500 transition-transform duration-300 ${openFAQ === index ? 'rotate-180' : ''} text-sm`}></i>
                    </div>
                  </button>
                  
                  <div className={`transition-all duration-300 ease-in-out ${openFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                    <div className="px-6 pb-5">
                      <div className="pl-13">
                        <p className="text-gray-600 leading-relaxed text-sm">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
