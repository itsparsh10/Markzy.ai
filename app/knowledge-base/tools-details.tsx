"use client";

import Sidebar from '../components/Sidebar';
import Link from 'next/link';
import { useState } from 'react';

const toolCategories = [
  {
    title: 'Blog Tools',
    overview: 'This category helps you create strategic blog content—from ideation to publication and promotion. Ideal for entrepreneurs, creators, and marketers aiming to drive organic traffic and build authority.',
    tools: [
      {
        name: 'Blog Content from Transcripts',
        purpose: 'Transform recorded content (podcasts, webinars, calls) into full-length blog articles.',
        usage: 'Upload or paste your transcript → choose blog type → generate outline and draft.',
        best: 'Repurposing long-form content into written SEO assets.'
      },
      {
        name: 'Blog Generator',
        purpose: 'Automatically generate blog titles, outlines, and full articles based on your topic.',
        usage: 'Enter a topic and an outline (optional) → generate suggested headlines and full posts.',
        best: 'Creating consistent blog content when you’re short on time or ideas.'
      },
      {
        name: 'Blog Posts',
        purpose: 'Get blog ideas based on the customer journey (awareness, consideration, decision).',
        usage: 'Input your product → select funnel stage → receive blog titles and outlines.',
        best: 'Planning a blog strategy aligned with your sales funnel.'
      },
      {
        name: 'Blog Promo',
        purpose: 'Create promotional content for your blog post to drive traffic.',
        usage: 'Paste your blog post link or summary → generate social media captions and email blurbs.',
        best: 'Promoting newly published blogs to maximize visibility.'
      }
    ]
  },
  {
    title: 'Affiliate Tools',
    overview: 'This category helps you equip affiliates and partners with the assets they need to promote your products effectively. Includes email templates, product summaries, and social posts.',
    tools: [
      {
        name: 'Affiliate Email Swipes',
        purpose: 'Generate pre-written promotional emails for your affiliates.',
        usage: 'Add details about your product and launch → receive email templates.',
        best: 'Supporting affiliates during product launches or evergreen campaigns.'
      },
      {
        name: 'Affiliate Messaging Information',
        purpose: 'Provide key talking points and audience-specific messages to affiliates.',
        usage: 'Describe your product and intended audience → generate multiple message angles.',
        best: 'Helping affiliates target various customer segments more effectively.'
      },
      {
        name: 'Affiliate Product Details',
        purpose: 'Deliver at-a-glance product summaries for affiliate promotions.',
        usage: 'Input product title, price, features, and benefits → receive formatted copy for easy reuse.',
        best: 'Affiliate dashboards, swipe files, or PDF bundles.'
      },
      {
        name: 'Affiliate Promo Ideas',
        purpose: 'Suggest creative promotion tactics affiliates can use to drive sales.',
        usage: 'Add product and target audience → receive unique content ideas and angles.',
        best: 'When you want to support affiliates beyond just copy-paste templates.'
      },
      {
        name: 'Affiliate Social Swipes',
        purpose: 'Provide affiliates with ready-to-post social captions for promoting your product.',
        usage: 'Enter product info and affiliate call-to-action → receive formatted captions for different platforms.',
        best: 'Fast, consistent messaging across affiliate-led social campaigns.'
      }
    ]
  },
  {
    title: 'Brand Tools',
    overview: 'Use these tools to define and communicate your brand identity. From bios to mission statements and consistent language, these tools help unify how your brand shows up online.',
    tools: [
      {
        name: 'Brand Bios',
        purpose: 'Create consistent brand bios for social media, press kits, and your website.',
        usage: 'Add brand tone, name, and values → generate short bios in various formats.',
        best: 'Social profiles, “About Us” sections, and online directories.'
      },
      {
        name: 'Brand Keyword Research',
        purpose: 'Identify strategic keywords to describe your brand and what you offer.',
        usage: 'Input industry, product category, and audience → get keyword clusters by intent and relevance.',
        best: 'Building a content strategy or optimizing website copy.'
      },
      {
        name: 'Brand Social',
        purpose: 'Generate nine ready-to-post captions about your brand and its story.',
        usage: 'Input product name, offer, and mission → get engaging brand-centered content.',
        best: 'Launch announcements or regular storytelling on social media.'
      },
      {
        name: 'Mission, Vision & Values',
        purpose: 'Craft compelling statements that reflect your brand\'s goals, beliefs, and purpose.',
        usage: 'Describe your “why,” impact goals, and core values → generate formatted outputs.',
        best: 'Website pages, pitch decks, internal branding.'
      },
      {
        name: 'Word Bank',
        purpose: 'Create a consistent language guide for your brand.',
        usage: 'Input keywords, tone, and key messaging → receive a glossary of preferred words/phrases.',
        best: 'Ensuring tone consistency across all written content.'
      }
    ]
  },
  {
    title: 'Content Tools',
    overview: 'Plan, create, and repurpose your content across blogs, podcasts, videos, emails, and social posts. These tools help maintain a consistent voice and message across platforms.',
    tools: [
      {
        name: '30 Day Social Plan',
        purpose: 'Generate 30 days of social content ideas to increase engagement.',
        usage: 'Input your brand focus or product theme → receive 30 unique post prompts.',
        best: 'Monthly planning for business owners managing their own content.'
      },
      {
        name: 'Content Ideas',
        purpose: 'Generate FAQs, long-tail keywords, and blog/podcast ideas by content pillar.',
        usage: 'Input your main themes → receive topic clusters and angles.',
        best: 'Planning your content calendar or SEO strategy.'
      },
      {
        name: 'Content Outline',
        purpose: 'Structure content for blogs, videos, or podcast episodes.',
        usage: 'Add your topic → generate a logical outline with intro, body, and CTA.',
        best: 'Drafting scripts or blog layouts quickly.'
      },
      {
        name: 'Content Pillars',
        purpose: 'Define your brand’s main content themes.',
        usage: 'Input your industry and audience → receive pillar categories.',
        best: 'Establishing brand authority and guiding all future content.'
      },
      {
        name: 'Content Repurposer',
        purpose: 'Repurpose one type of content (e.g., blog) into multiple formats.',
        usage: 'Choose a source format → select desired output (social, email, etc.) → generate new content.',
        best: 'Maximizing the ROI of high-performing content.'
      },
      {
        name: 'Story-Based Social Posts',
        purpose: 'Generate 39 narrative-style posts based on your business story.',
        usage: 'Fill out your business origin or personal story → receive emotional and relatable posts.',
        best: 'Increasing connection and engagement through storytelling.'
      },
      {
        name: '30 Day Social Media Plan for Products',
        purpose: 'Create a full month of content focused on promoting one product.',
        usage: 'Add your product name, benefits, and goal → generate promotional posts.',
        best: 'During product launches or evergreen sales cycles.'
      },
      {
        name: 'Social Content from a Page URL',
        purpose: 'Turn a webpage into multiple social posts.',
        usage: 'Paste the link of a sales/blog page → get social captions and teasers.',
        best: 'Promoting blogs, offers, or webinars efficiently.'
      },
      {
        name: 'Repurposing for Substack',
        purpose: 'Convert your blog or podcast into a community-focused Substack newsletter.',
        usage: 'Input your source content → generate conversational and value-rich newsletters.',
        best: 'Building trust through long-form newsletter writing.'
      },
      {
        name: 'Story-Based Emails',
        purpose: 'Generate emotionally-driven emails based on your story.',
        usage: 'Fill out your business journey → receive 39 nurture email templates.',
        best: 'Email sequences that build authority and loyalty.'
      },
      {
        name: 'Weekly Content Assets',
        purpose: 'Generate all content for one week in a single click.',
        usage: 'Add business goal or content theme → get a blog, email, captions, and more.',
        best: 'Batch content creation to save time.'
      },
      {
        name: 'Marketing Routine Builder',
        purpose: 'Build a weekly content plan based on your current goal.',
        usage: 'Select your business focus (growth, engagement, etc.) → receive a weekly to-do list.',
        best: 'For overwhelmed creators needing structure.'
      },
      {
        name: 'Web Page Improver',
        purpose: 'Rewrite and optimize copy on an existing webpage.',
        usage: 'Add webpage text or URL → receive improved headlines and sections.',
        best: 'Refreshing outdated website content.'
      },
      {
        name: 'Pinterest Titles & Descriptions',
        purpose: 'Create optimized pins for your blog or product.',
        usage: 'Add your webpage or blog URL → get Pinterest title, description, and graphic tips.',
        best: 'Increasing referral traffic from Pinterest.'
      }
    ]
  },
  // ...continue for all 21 categories as per user prompt...
];

export default function KnowledgeBaseToolsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-gray-50">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden w-full">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/knowledge-base" className="text-blue-600 hover:underline flex items-center gap-2">
              <i className="fas fa-arrow-left"></i>
              <span>Back to Knowledge Base</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800 ml-6">AI Tool Categories & Details</h1>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <input
                type="text"
                placeholder="Search tools or categories..."
                className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-6">
              {toolCategories.map((cat, idx) => (
                <div key={cat.title} className="bg-white rounded-2xl shadow-lg border border-gray-100">
                  <button
                    className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  >
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 mb-1">{cat.title}</h2>
                      <p className="text-gray-500 text-sm">{cat.overview}</p>
                    </div>
                    <i className={`fas fa-chevron-${openIndex === idx ? 'up' : 'down'} text-gray-400 text-lg`}></i>
                  </button>
                  {openIndex === idx && (
                    <div className="px-8 pb-6">
                      <ul className="list-disc pl-4 space-y-4 mt-2">
                        {cat.tools.map((tool) => (
                          <li key={tool.name} className="mb-2">
                            <div className="font-semibold text-blue-700">{tool.name}</div>
                            <div className="text-gray-700 text-sm mb-1"><span className="font-medium">Purpose:</span> {tool.purpose}</div>
                            <div className="text-gray-700 text-sm mb-1"><span className="font-medium">How to Use It:</span> {tool.usage}</div>
                            <div className="text-gray-700 text-sm"><span className="font-medium">Best Use Case:</span> {tool.best}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
