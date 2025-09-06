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
          name: 'Blog Content from Transcripts',
          purpose: 'Transform recorded content into full-length blog articles.',
          usage: 'Upload transcript → choose blog type → generate outline and draft.',
          best: 'Repurposing long-form content into written SEO assets.'
        },
        {
          name: 'Blog Generator',
          purpose: 'Generate blog titles, outlines, and full articles based on your topic.',
          usage: 'Enter a topic and outline → generate headlines and full posts.',
          best: 'Creating consistent blog content when short on time.'
        },
        {
          name: 'Blog Posts',
          purpose: 'Get blog ideas based on the customer journey stages.',
          usage: 'Input your product → select funnel stage → receive blog titles and outlines.',
          best: 'Planning a blog strategy aligned with your sales funnel.'
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
      title: 'Affiliate Tools',
      overview: 'Equip affiliates and partners with assets to promote your products effectively.',
      tools: [
        {
          name: 'Affiliate Email Swipes',
          purpose: 'Generate pre-written promotional emails for your affiliates.',
          usage: 'Add product and launch details → receive email templates.',
          best: 'Supporting affiliates during product launches or campaigns.'
        },
        {
          name: 'Affiliate Messaging Information',
          purpose: 'Provide key talking points and audience-specific messages.',
          usage: 'Describe product and audience → generate multiple message angles.',
          best: 'Enabling affiliates to communicate value propositions effectively.'
        },
        {
          name: 'Affiliate Product Details',
          purpose: 'Create comprehensive product summaries and selling points.',
          usage: 'Input product information → generate detailed feature lists.',
          best: 'Onboarding new affiliates with complete product knowledge.'
        },
        {
          name: 'Affiliate Promo ideas',
          purpose: 'Suggest creative promotion tactics affiliates can use to drive sales.',
          usage: 'Add product and target audience → receive unique content ideas and angles.',
          best: ' When you want to support affiliates beyond just copy-paste templates.'
        },
        {
          name: 'Affiliate Social Swipes',
          purpose: 'Create social media posts and captions for affiliate promotion.',
          usage: 'Provide product details → generate platform-specific content.',
          best: 'Scaling affiliate social media presence across platforms.'
        }
      ]
    },
    {
  "title": "Brand Tools",
  "overview": "Use these tools to define and communicate your brand identity. From bios to mission statements and consistent language, these tools help unify how your brand shows up online.",
  "tools": [
    {
      "name": "Brand Bios",
      "purpose": "Create consistent brand bios for social media, press kits, and your website.",
      "usage": "Add brand tone, name, and values → generate short bios in various formats.",
      "best": "Social profiles, “About Us” sections, and online directories."
    },
    {
      "name": "Brand Keyword Research",
      "purpose": "Identify strategic keywords to describe your brand and what you offer.",
      "usage": "Input industry, product category, and audience → get keyword clusters by intent and relevance.",
      "best": "Building a content strategy or optimizing website copy."
    },
    {
      "name": "Brand Social",
      "purpose": "Generate nine ready-to-post captions about your brand and its story.",
      "usage": "Input product name, offer, and mission → get engaging brand-centered content.",
      "best": "Launch announcements or regular storytelling on social media."
    },
    {
      "name": "Mission, Vision & Values",
      "purpose": "Craft compelling statements that reflect your brand's goals, beliefs, and purpose.",
      "usage": "Describe your “why,” impact goals, and core values → generate formatted outputs.",
      "best": "Website pages, pitch decks, internal branding."
    },
    {
      "name": "Word Bank",
      "purpose": "Create a consistent language guide for your brand.",
      "usage": "Input keywords, tone, and key messaging → receive a glossary of preferred words/phrases.",
      "best": "Ensuring tone consistency across all written content."
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
          purpose: 'Share brand story and mission via email.',
          usage: 'Input brand background → generate 1–3 storytelling emails.',
          best: 'Welcome sequences.'
        },
        {
          name: 'Email Freestyle',
          purpose: 'Create any custom email from scratch.',
          usage: 'Type your idea → receive structure and content.',
          best: 'Flexible email creation.'
        },
        {
          name: 'Onboarding Emails',
          purpose: 'Help new buyers get started with your product.',
          usage: 'Add product features and user goals → receive welcome series.',
          best: 'Post-purchase sequences.'
        },
        {
          name: 'Opt-In Email Ideas',
          purpose: 'Educate and warm up new subscribers.',
          usage: 'Add lead magnet topic → get email ideas.',
          best: 'Email marketing for new leads.'
        },
        {
          name: 'Post-Purchase Email',
          purpose: 'Send purchase confirmation and access steps.',
          usage: 'Add offer + delivery details → get email.',
          best: 'Digital or physical fulfillment.'
        },
        {
          name: 'Sales Emails',
          purpose: 'Write a product promotion or launch sequence.',
          usage: 'Add offer + urgency → receive multi-email flow.',
          best: 'Campaign-based email marketing.'
        },
        {
          name: 'Subject Line Generator',
          purpose: 'Generate attention-grabbing subject lines.',
          usage: 'Add email topic → get subject variations.',
          best: 'Improve open rates.'
        },
        {
          name: 'Value Emails',
          purpose: 'Educate, nurture, and build trust via content-rich emails.',
          usage: 'Add topic + tone → receive draft.',
          best: 'Non-promotional nurture content.'
        },
        {
          name: 'Webinar Emails',
          purpose: 'Promote and remind subscribers about a webinar.',
          usage: 'Add webinar date + topic → generate invite, reminder, replay emails.',
          best: 'Webinar funnel automation.'
        },
        {
          name: 'Welcome Sequence',
          purpose: 'Introduce new subscribers to your brand and content.',
          usage: 'Add goals + brand info → receive multi-part welcome series.',
          best: 'Email list onboarding.'
        }
      ]
    },
    {
      title: 'Brand Tools',
      overview: 'Establish and maintain your brand identity across all touchpoints.',
      tools: [
        {
          name: 'Brand Bios',
          purpose: 'Create compelling brand biographies for various platforms.',
          usage: 'Input brand information → generate bios for different contexts.',
          best: 'Establishing consistent brand presence across social platforms.'
        },
        {
          name: 'Brand Keyword Research',
          purpose: 'Identify keywords that align with your brand positioning.',
          usage: 'Enter brand focus and industry → receive keyword suggestions.',
          best: 'Optimizing content for brand-relevant search terms.'
        },
        {
          name: 'Brand Social',
          purpose: 'Generate social media content that reflects your brand voice.',
          usage: 'Define brand personality → create platform-specific content.',
          best: 'Maintaining brand consistency across social media channels.'
        }
      ]
    },
    {
      title: 'Social Media Tools',
      overview: 'Comprehensive social media content creation and strategy tools.',
      tools: [
        {
          name: 'Carousel Content Freestyle',
          purpose: 'Create engaging carousel posts for social media platforms.',
          usage: 'Input topic and key points → generate slide-by-slide content.',
          best: 'Creating educational and engaging multi-slide posts.'
        },
        {
          name: 'Carousel Ideas',
          purpose: 'Generate creative concepts for carousel social media posts.',
          usage: 'Enter industry or topic → receive carousel post concepts.',
          best: 'Brainstorming engaging social media content formats.'
        },
        {
          name: 'Carousel Ideas for Products',
          purpose: 'Create product-focused carousel posts highlighting features.',
          usage: 'Input product details → generate product showcase carousels.',
          best: 'Showcasing products through engaging visual storytelling.'
        }
      ]
    },
    {
      title: 'E-commerce Tools',
      overview: 'Optimize product listings and e-commerce content for better conversions.',
      tools: [
        {
          name: 'Amazon Description',
          purpose: 'Create optimized product descriptions for Amazon listings.',
          usage: 'Input product details → generate SEO-optimized descriptions.',
          best: 'Improving Amazon product visibility and conversion rates.'
        },
        {
          name: 'Bump Copy',
          purpose: 'Generate compelling upsell and cross-sell copy for e-commerce.',
          usage: 'Describe main product and related items → create bump offers.',
          best: 'Increasing average order value through strategic upselling.'
        }
      ]
    },
    {
      title: 'Content Strategy Tools',
      overview: 'Develop comprehensive content strategies and editorial planning.',
      tools: [
        {
          name: 'Buyer Persona',
          purpose: 'Create detailed customer personas for targeted marketing.',
          usage: 'Input market research and customer data → generate personas.',
          best: 'Understanding target audience for more effective marketing.'
        }
      ]
    },
    {
      title: 'Educational Tools',
      overview: 'Create educational and training content for courses and programs.',
      tools: [
        {
          name: 'AI Training Form',
          purpose: 'Create structured training materials and educational content.',
          usage: 'Define learning objectives → generate training modules.',
          best: 'Developing comprehensive educational programs and courses.'
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
    {
      title: 'Customer Tools',
      overview: 'Know exactly who you\'re selling to. These tools help define your ideal customer, discover their problems, and map out their journey to becoming your buyer.',
      tools: [
        {
          name: 'Buyer Persona',
          purpose: 'Build a complete profile of your ideal customer.',
          usage: 'Input product details and target market → get detailed persona with goals, challenges, and desires.',
          best: 'Writing sales pages or ad targeting.'
        },
        {
          name: 'Customer Jobs',
          purpose: 'Understand the underlying goals your customers are trying to achieve.',
          usage: 'Enter the solution your product offers → receive "job" statements.',
          best: 'Clarifying product positioning.'
        },
        {
          name: 'Customer Overview',
          purpose: 'Summarize your typical customer.',
          usage: 'Describe your audience and product → receive a clear persona snapshot.',
          best: 'Sharing with teams or freelancers.'
        },
        {
          name: 'Ideal Customer Problems',
          purpose: 'Identify pain points your product solves.',
          usage: 'Input product details → get common objections and frustrations.',
          best: 'Writing ad headlines or email hooks.'
        },
        {
          name: 'Customer Journey',
          purpose: 'Map how your customer goes from discovery to purchase.',
          usage: 'Input product → receive stage-by-stage breakdown.',
          best: 'Content mapping or funnel building.'
        },
        {
          name: 'Customer Research',
          purpose: 'Reveal audience behavior and needs through insight-based prompts.',
          usage: 'Add offer or product → get psychographic profiles and decision triggers.',
          best: 'Market research before building offers.'
        },
        {
          name: 'Customer Segment Sales Page',
          purpose: 'Write a sales page tailored to one customer group.',
          usage: 'Choose segment and product → get sales copy for that audience.',
          best: 'Personalized landing pages for targeted ads.'
        },
        {
          name: 'Testimonials to Benefits',
          purpose: 'Convert reviews into powerful benefit-driven content.',
          usage: 'Paste real testimonials → extract features, objections, and outcomes.',
          best: 'Building trust on sales pages or in ads.'
        },
        {
          name: 'Group & Community Content Ideas',
          purpose: 'Get content ideas for private groups or memberships.',
          usage: 'Add product or community goal → receive themed post prompts.',
          best: 'Driving engagement in online communities.'
        },
        {
          name: 'Product Customer Journey',
          purpose: 'Visualize the customer experience for one specific product.',
          usage: 'Add product name and goals → receive full journey stages.',
          best: 'Planning funnel emails or onboarding sequences.'
        },
        {
          name: 'General Group & Community Posts',
          purpose: 'Create standard posts for online groups (welcome, rules, etc.).',
          usage: 'Choose tone and group type → get copy templates.',
          best: 'Launching or managing active communities.'
        },
        {
          name: 'Product Group & Community Posts',
          purpose: 'Generate community posts for a specific product-based group.',
          usage: 'Add product → receive value-based and check-in posts.',
          best: 'Memberships, courses, or coaching programs.'
        }
      ]
    },
    {
      title: 'Digital Shop Tools',
      overview: 'Create product descriptions, sales pages, and customer emails specifically for selling digital products like templates, courses, or downloads.',
      tools: [
        {
          name: 'Digital Product Description',
          purpose: 'Write a short, benefits-focused product blurb.',
          usage: 'Input features and results → receive product copy for sales platforms.',
          best: 'Shopify or Gumroad product listings.'
        },
        {
          name: 'Digital Product Sales Page',
          purpose: 'Create a full-length product landing page.',
          usage: 'Add product info → generate a persuasive page with sections, CTAs, and testimonials.',
          best: 'Standalone pages for launching digital products.'
        },
        {
          name: 'Etsy Description for Digital Products',
          purpose: 'Write optimized product copy for Etsy.',
          usage: 'Add title, product use, and features → receive Etsy-compliant copy and tags.',
          best: 'Fast Etsy product uploads.'
        },
        {
          name: 'Funnel Content from a Page URL',
          purpose: 'Repurpose an existing URL into funnel assets.',
          usage: 'Paste in a blog or product page → receive related emails, social captions, and more.',
          best: 'Expanding reach using already written pages.'
        },
        {
          name: 'Post-Purchase Email',
          purpose: 'Deliver product access and thank-you message after purchase.',
          usage: 'Input product name, delivery method, and tone → get formatted email.',
          best: 'Onboarding digital product buyers instantly.'
        }
      ]
    },
    {
      title: 'Funnel Tools',
      overview: 'Build high-converting funnels by generating content for sales pages, checkout flows, upsells, and follow-up emails.',
      tools: [
        {
          name: 'Bump',
          purpose: 'Create bump offer headlines and descriptions to increase order value.',
          usage: 'Enter product and bonus → receive optimized copy.',
          best: 'Add-ons at checkout for digital products.'
        },
        {
          name: 'Checkout Page',
          purpose: 'Write persuasive checkout content.',
          usage: 'Add product + CTA → generate summary, headline, and urgency copy.',
          best: 'Payment page optimization.'
        },
        {
          name: 'Facebook Ads',
          purpose: 'Generate ads for different funnel stages.',
          usage: 'Input offer → get top/middle/bottom funnel ad versions.',
          best: 'Paid traffic with messaging tailored to buyer stage.'
        },
        {
          name: 'Post-Purchase Email',
          purpose: 'Follow up with new customers after a sale.',
          usage: 'Add product + next steps → generate confirmation email.',
          best: 'Customer experience and onboarding.'
        },
        {
          name: 'Sales Page',
          purpose: 'Create long-form sales page copy.',
          usage: 'Input offer + transformation → receive persuasive structure with benefits.',
          best: 'Launches, evergreen sales pages.'
        },
        {
          name: 'Tripwire Sales Page',
          purpose: 'Build a low-ticket offer page for email subscribers.',
          usage: 'Add product and deadline → generate conversion-optimized content.',
          best: 'First purchase funnels.'
        },
        {
          name: 'Upsell Sales Page',
          purpose: 'Sell an add-on product post-purchase.',
          usage: 'Input upsell offer → get CTA, urgency, and benefits copy.',
          best: 'Increasing average order value.'
        }
      ]
    },
    {
      title: 'Ecommerce Tools',
      overview: 'Sell physical products with optimized listings, descriptions, abandoned cart sequences, and marketplace content.',
      tools: [
        {
          name: 'Abandoned Cart Sequence',
          purpose: 'Recover lost sales through follow-up emails.',
          usage: 'Add product + tone → get 3-part sequence.',
          best: 'Automated cart recovery.'
        },
        {
          name: 'Amazon Description',
          purpose: 'Write keyword-optimized Amazon listings.',
          usage: 'Enter product specs → receive structured listing with benefits.',
          best: 'Amazon product page optimization.'
        },
        {
          name: 'Ecommerce Social Media Posts',
          purpose: 'Promote products on social platforms.',
          usage: 'Add product → get promotional captions.',
          best: 'Organic traffic to store.'
        },
        {
          name: 'Etsy Description for Ecommerce',
          purpose: 'Write SEO-friendly Etsy product descriptions.',
          usage: 'Add features and tags → receive listing content.',
          best: 'Etsy shop setup.'
        },
        {
          name: 'Marketplace Description',
          purpose: 'Write listings for other online marketplaces.',
          usage: 'Input product → get tailored listing copy.',
          best: 'Wholesale, Faire, or third-party resellers.'
        },
        {
          name: 'Product Description',
          purpose: 'Write compelling website product descriptions.',
          usage: 'Enter product + features → get SEO-optimized copy.',
          best: 'Shopify, WooCommerce, Squarespace.'
        },
        {
          name: 'Product Keyword Research',
          purpose: 'Discover search-friendly keywords for products.',
          usage: 'Input product → receive keyword variations.',
          best: 'Planning blog, SEO, and tags.'
        },
        {
          name: 'Wholesale Information',
          purpose: 'Create outlines for wholesale buyers.',
          usage: 'Add product info + pricing model → generate brief for retailers.',
          best: 'B2B and wholesale pitching.'
        }
      ]
    },
    {
      title: 'Guest Tools',
      overview: 'Pitch yourself as a guest for podcasts, summits, or events with emails, speaker ideas, and outreach copy.',
      tools: [
        {
          name: 'Event Promotion Emails',
          purpose: 'Promote your guest appearance to your audience.',
          usage: 'Add event name + details → generate announcement emails.',
          best: 'Affiliate bundles, online summits.'
        },
        {
          name: 'Podcast Pitch Prep',
          purpose: 'Create a personalized podcast pitch.',
          usage: 'Add podcast theme + your story → receive pitch draft.',
          best: 'Guest podcast outreach.'
        },
        {
          name: 'Speaker Topic Ideas',
          purpose: 'Generate session ideas for event submissions.',
          usage: 'Add expertise + audience → get relevant titles.',
          best: 'Call-for-speakers and proposal planning.'
        }
      ]
    },
    {
      title: 'Product Tools',
      overview: 'Product Tools help you present, position, and describe your product in a way that highlights benefits and connects with your ideal customer. From naming ideas to benefit statements, these tools make your product easier to understand and sell.',
      tools: [
        {
          name: 'Product Description',
          purpose: 'Write a benefits-focused description for your product.',
          usage: 'Add product name, features, and target audience → get a compelling paragraph.',
          best: 'Ecommerce platforms, sales pages, or pitch decks.'
        },
        {
          name: 'Product Benefits',
          purpose: 'Transform product features into emotional and practical benefits.',
          usage: 'Input key features or specs → receive benefit-driven copy lines.',
          best: 'Landing pages, ads, and persuasive bullet points.'
        },
        {
          name: 'Product Positioning',
          purpose: 'Clarify where your product fits in the market and who it’s for.',
          usage: 'Add product purpose, problem solved, and unique value → get clear positioning statements.',
          best: 'Brand messaging, investor decks, or elevator pitches.'
        },
        {
          name: 'Product Name Ideas',
          purpose: 'Brainstorm brandable and relevant product names.',
          usage: 'Enter product type, benefits, and target market → receive name suggestions.',
          best: 'Naming digital products, offers, courses, or physical goods.'
        },
        {
          name: 'Product Ideas',
          purpose: 'Generate new product or service ideas aligned with your brand.',
          usage: 'Describe your niche or audience → receive idea suggestions.',
          best: 'Early ideation stages or adding offers to your funnel.'
        }
      ]
    },
    {
      title: 'Social Media Tools',
      overview: 'These tools help you create engaging, scroll-stopping content for Instagram, Facebook, LinkedIn, and other platforms. Whether it’s captions, carousels, or Reels, these tools simplify your social strategy.',
      tools: [
        {
          name: 'Instagram Captions',
          purpose: 'Generate posts with scroll-stopping intros and strong CTAs.',
          usage: 'Enter content theme and brand tone → receive 3–5 caption options.',
          best: 'Weekly social media planning and daily posting.'
        },
        {
          name: 'Reels Scripts',
          purpose: 'Create script ideas for short-form video content.',
          usage: 'Add your product or message → get script hooks and CTA lines.',
          best: 'Planning Instagram Reels or TikToks that convert.'
        },
        {
          name: 'Carousel Content Builder',
          purpose: 'Structure ideas for multi-slide social carousels.',
          usage: 'Enter topic and number of slides → get outline + slide-by-slide copy.',
          best: 'Informational or storytelling-style content on Instagram or LinkedIn.'
        },
        {
          name: 'Story-Based Social Posts',
          purpose: 'Generate social posts from personal or business stories.',
          usage: 'Add story details → get 3–5 emotionally driven captions.',
          best: 'Build brand connection through storytelling.'
        },
        {
          name: 'Social Promo Posts',
          purpose: 'Announce product launches, offers, or blog posts on social media.',
          usage: 'Enter campaign details and tone → receive ready-to-use posts.',
          best: 'Use during launches, promos, or collaborations.'
        }
      ]
    },
    {
      title: 'SEO Tools',
      overview: 'SEO Tools help you get discovered online through better search engine optimization. These tools generate keywords, titles, meta descriptions, and optimize your content structure for better ranking.',
      tools: [
        {
          name: 'Keyword Cluster Generator',
          purpose: 'Generate strategic keyword clusters for a product or content pillar.',
          usage: 'Enter product or theme → get grouped keyword ideas by intent and category.',
          best: 'Planning blog strategy or building keyword-targeted content.'
        },
        {
          name: 'Meta Title & Description Writer',
          purpose: 'Create SEO-optimized metadata for any webpage.',
          usage: 'Add URL or product description → receive meta title and description.',
          best: 'Optimize blogs, landing pages, YouTube videos, or Shopify products.'
        },
        {
          name: 'Content Optimizer',
          purpose: 'Improve readability, structure, and SEO relevance of existing content.',
          usage: 'Paste your draft or blog post → get enhancement suggestions.',
          best: 'Rewriting blog posts for higher organic traffic.'
        },
        {
          name: 'Blog Outline for SEO',
          purpose: 'Generate structured blog outlines using SEO logic.',
          usage: 'Enter keyword and topic → get H1, H2s, and CTA placement.',
          best: 'Drafting new articles for search engines.'
        }
      ]
    },
    {
      title: 'Sales Page Tools',
      overview: 'These tools help you craft complete sales pages that convert, with compelling headlines, feature breakdowns, and persuasive calls-to-action.',
      tools: [
        {
          name: 'Sales Page Builder',
          purpose: 'Generate a complete, long-form sales page for a product or service.',
          usage: 'Input product details, transformation, objections → receive structured sections with headlines and body.',
          best: 'Product launches, webinars, coaching services.'
        },
        {
          name: 'Tripwire Page',
          purpose: 'Create a low-ticket offer page (tripwire) to convert leads.',
          usage: 'Add product price, urgency, and offer stack → get fast-converting copy.',
          best: 'Post-lead magnet upsell offers.'
        },
        {
          name: 'Checkout Page Copy',
          purpose: 'Write persuasive text for checkout pages.',
          usage: 'Add product title, bonuses, and objections → get mini headlines, testimonials, and risk-reversal copy.',
          best: 'Platforms like ThriveCart, SamCart, or WooCommerce.'
        },
        {
          name: 'Upsell Page',
          purpose: 'Promote an additional product right after a purchase.',
          usage: 'Enter primary offer and upsell details → get page copy focused on increasing AOV.',
          best: 'One-click upsells after checkout.'
        },
        {
          name: 'Bump Offer Copy',
          purpose: 'Write microcopy for small add-on products at checkout.',
          usage: 'Input bonus offer → get attention-grabbing text.',
          best: 'Adding small-ticket digital items to increase cart value.'
        }
      ]
    },
    {
      title: 'Website Tools',
      overview: 'Website Tools are designed to help you write, improve, and optimize pages across your site, including homepages, about pages, contact forms, and more. They improve both copy clarity and conversion.',
      tools: [
        {
          name: 'Homepage Copy',
          purpose: 'Generate persuasive homepage content that highlights your core offer.',
          usage: 'Add brand name, mission, and primary offer → receive section-by-section homepage copy.',
          best: 'For new websites, landing page redesigns, or personal brand pages.'
        },
        {
          name: 'About Page Copy',
          purpose: 'Write a compelling brand or founder story.',
          usage: 'Add backstory, impact, and brand tone → get an emotionally resonant page.',
          best: 'Personal brands or businesses trying to build trust.'
        },
        {
          name: 'Contact Page Copy',
          purpose: 'Help users take action to get in touch.',
          usage: 'Add preferred contact method, tone, and service details → receive clear, action-oriented text.',
          best: 'For service providers, consultants, or agencies.'
        },
        {
          name: 'Website Copy Improver',
          purpose: 'Revise existing web copy for clarity, tone, and conversion.',
          usage: 'Paste current web text → get rewritten, more compelling copy.',
          best: 'Website refresh or rebranding.'
        }
      ]
    },
    {
      title: 'Transcript Tools',
      overview: 'These tools help you convert long-form transcripts—like podcasts, interviews, or coaching calls—into structured, valuable content such as blogs, emails, or social media posts.',
      tools: [
        {
          name: 'Transcript to Blog',
          purpose: 'Turn raw transcripts into blog articles.',
          usage: 'Paste transcript → choose blog length and tone → generate content.',
          best: 'Repurposing podcasts or webinars.'
        },
        {
          name: 'Transcript to Email',
          purpose: 'Repurpose transcripts into email content.',
          usage: 'Add transcript and email audience → receive informative or story-driven email.',
          best: 'Creating weekly emails from podcast recordings.'
        },
        {
          name: 'Transcript to Social Post',
          purpose: 'Create engaging social posts from transcript insights.',
          usage: 'Paste a relevant section → choose platform → get caption options.',
          best: 'Reposting takeaways from live content or interviews.'
        }
      ]
    },
    {
      title: 'Lead Generation Tools',
      overview: 'Use these tools to attract, nurture, and convert leads. They help you write opt-in pages, lead magnets, and nurture email sequences that turn interest into action.',
      tools: [
        {
          name: 'Lead Magnet Title Generator',
          purpose: 'Create attention-grabbing titles for freebies.',
          usage: 'Input lead magnet type (e.g., checklist, guide) → get 5–10 headline variations.',
          best: 'Promoting PDFs, webinars, or downloads.'
        },
        {
          name: 'Opt-in Page Copy',
          purpose: 'Write compelling squeeze pages that drive email signups.',
          usage: 'Add offer + value → get complete short-form opt-in page copy.',
          best: 'Growing your email list.'
        },
        {
          name: 'Welcome Sequence',
          purpose: 'Nurture new subscribers with a sequence of emails.',
          usage: 'Add business type + offer → get 3–5 email sequence.',
          best: 'New subscribers from lead magnets.'
        },
        {
          name: 'Nurture Email Series',
          purpose: 'Build relationship with leads before selling.',
          usage: 'Input your product → get 3–7 value-driven emails.',
          best: 'During pre-launch or cold-to-warm journeys.'
        }
      ]
    },
    {
      title: 'Story Tools',
      overview: 'Storytelling is key to emotional connection. These tools help you craft compelling narratives for your brand, customer success, or product journey.',
      tools: [
        {
          name: 'Your Business Origin Story',
          purpose: 'Share how your business started in a story format.',
          usage: 'Add personal journey → receive compelling brand story.',
          best: 'Website About page or social content.'
        },
        {
          name: 'Customer Transformation Story',
          purpose: 'Tell the before-after journey of a client/customer.',
          usage: 'Add customer background and results → get a hero’s journey-style story.',
          best: 'For testimonials, sales pages, or case studies.'
        },
        {
          name: 'Story Framework Generator',
          purpose: 'Create content using proven storytelling structures (e.g., AIDA, PAS).',
          usage: 'Enter topic or product → get structured post or script.',
          best: 'Blog posts, video scripts, or long-form ads.'
        }
      ]
    },
    {
      title: 'Workflow Tools',
      overview: 'Create structured, step-by-step workflows and routines for your business. These tools help with planning and maintaining consistency in operations or content.',
      tools: [
        {
          name: 'Weekly Content Workflow',
          purpose: 'Map your weekly publishing tasks.',
          usage: 'Add platforms used and team size → get a checklist with deadlines.',
          best: 'Solopreneurs or small teams building systems.'
        },
        {
          name: 'Product Launch Workflow',
          purpose: 'Plan the stages of a product launch.',
          usage: 'Input launch date and assets → receive pre-launch to post-launch roadmap.',
          best: 'Launching digital products or events.'
        },
        {
          name: 'Social Media Routine',
          purpose: 'Create a recurring system for social media posting.',
          usage: 'Choose platforms + post frequency → receive batch workflow.',
          best: 'For consistency on Instagram, LinkedIn, etc.'
        }
      ]
    },
    {
      title: 'Commercial Tools',
      overview: 'Use these tools to create content for commercial assets like advertising, investor decks, business proposals, and press kits.',
      tools: [
        {
          name: 'Business Overview',
          purpose: 'Write a short company description for pitches or investor decks.',
          usage: 'Input your niche, mission, and service → get 2–3 paragraph overviews.',
          best: 'LinkedIn bios, slide decks, or media kits.'
        },
        {
          name: 'Elevator Pitch',
          purpose: 'Generate a clear, concise pitch you can use anywhere.',
          usage: 'Add your product, audience, and benefit → receive a 30-second pitch.',
          best: 'For investor meetings, networking, or homepage intros.'
        },
        {
          name: 'Commercial Slogan Generator',
          purpose: 'Create catchy slogans or taglines.',
          usage: 'Input brand tone and USP → get multiple options.',
          best: 'Website headers, packaging, or advertising.'
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
    <div className="h-full w-full flex overflow-hidden bg-gray-50">
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
