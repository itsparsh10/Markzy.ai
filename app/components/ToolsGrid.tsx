// ToolsGrid.tsx
'use client';
import React, { useState, useEffect, lazy } from 'react';
import { useRouter } from 'next/navigation';
import ToolCard from './ToolCard';
import { createSlug, findToolBySlugFromList, getSlugFromToolId, Tool } from '../utils/toolUtils';

// Define Tool interface is now imported from utils
// All components using lazy loading for consistency
const AbandonedCartSequence = lazy(() => import('./AbandonedCartSequence'));
const AffiliateEmailSwipes = lazy(() => import('./AffiliateEmailSwipes'));
const AffiliateMessagingInformation = lazy(() => import('./AffiliateMessagingInformation'));
const AffiliateProductDetails = lazy(() => import('./AffiliateProductDetails'));
const AffiliatePromoIdeas = lazy(() => import('./AffiliatePromoIdeas'));
const AffiliateSocialSwipes = lazy(() => import('./AffiliateSocialSwipes'));
const AmazonDescription = lazy(() => import('./AmazonDescription'));
const BlogContentFromTranscripts = lazy(() => import('./BlogContentFromTranscripts'));
const BlogGenerator = lazy(() => import('./BlogGenerator'));
const BlogPosts = lazy(() => import('./BlogPosts'));
const BlogPromo = lazy(() => import('./BlogPromo'));
const BrandBios = lazy(() => import('./BrandBios'));
const BrandEmails = lazy(() => import('./BrandEmails'));
const BrandKeywordResearch = lazy(() => import('./BrandKeywordResearch'));
const BrandSocial = lazy(() => import('./BrandSocial'));
const BumpCopy = lazy(() => import('./BumpCopy'));
const BuyerPersona = lazy(() => import('./BuyerPersona'));
const CarouselContentFreestyle = lazy(() => import('./CarouselContentFreestyle'));
const CarouselIdeas = lazy(() => import('./CarouselIdeas'));
const CheckoutPage = lazy(() => import('./CheckoutPage'));
const ContentIdeas = lazy(() => import('./ContentIdeas'));
const ContentOutline = lazy(() => import('./ContentOutline'));
const ContentPillars = lazy(() => import('./ContentPillars'));
const ContentRepurposer = lazy(() => import('./ContentRepurposer'));
const CustomerJobs = lazy(() => import('./CustomerJobs'));
const CustomerJourney = lazy(() => import('./CustomerJourney'));
const CustomerOverview = lazy(() => import('./CustomerOverview'));
const CustomerResearch = lazy(() => import('./CustomerResearch'));
const CustomerSegmentSalesPage = lazy(() => import('./CustomerSegmentSalesPage'));
const DigitalProductDescription = lazy(() => import('./DigitalProductDescription'));
const DigitalProductSalesPage = lazy(() => import('./DigitalProductSalesPage'));
const DraftTrainingMaterials = lazy(() => import('./DraftTrainingMaterials'));
const EcommerceSocialMediaPosts = lazy(() => import('./EcommerceSocialMediaPosts'));
const EmailNewsletter = lazy(() => import('./EmailNewsletter'));
const EmailsLeadMagnets = lazy(() => import('./EmailsLeadMagnets'));
const EtsyEcommerceDescription = lazy(() => import('./EtsyEcommerceDescription'));
const EventPromotionEmails = lazy(() => import('./EventPromotionEmails'));
const FacebookAds = lazy(() => import('./FacebookAds'));
const Freestyle = lazy(() => import('./Freestyle'));
const FreestyleSEO = lazy(() => import('./FreestyleSEO'));
const FunnelContentFromURL = lazy(() => import('./FunnelContentFromURL'));
const GeneralGroupCommunityPosts = lazy(() => import('./GeneralGroupCommunityPosts'));
const GroupCommunityContentIdeas = lazy(() => import('./GroupCommunityContentIdeas'));
const IdealCustomerProblems = lazy(() => import('./IdealCustomerProblems'));
const MarketingRoutineBuilder = lazy(() => import('./MarketingRoutineBuilder'));
const MarketplaceDescription = lazy(() => import('./MarketplaceDescription'));
const MissionVisionValues = lazy(() => import('./MissionVisionValues'));
const OnboardingEmails = lazy(() => import('./OnboardingEmails'));
const OptInDeliveryEmail = lazy(() => import('./OptInDeliveryEmail'));
const OptInEmailIdeas = lazy(() => import('./OptInEmailIdeas'));
const OptInIdeas = lazy(() => import('./OptInIdeas'));
const OptInPageCopy = lazy(() => import('./OptInPageCopy'));
const OptInThankYouPage = lazy(() => import('./OptInThankYouPage'));
const PinterestTitlesDescriptions = lazy(() => import('./PinterestTitlesDescriptions'));
const PodcastPitchPrep = lazy(() => import('./PodcastPitchPrep'));
const PostPurchaseEmail = lazy(() => import('./PostPurchaseEmail'));
const ProductCustomerJourney = lazy(() => import('./ProductCustomerJourney'));
const ProductDescription = lazy(() => import('./ProductDescription'));
const ProductFreestyle = lazy(() => import('./ProductFreestyle'));
const ProductGroupCommunityPosts = lazy(() => import('./ProductGroupCommunityPosts'));
const ProductIdeas = lazy(() => import('./ProductIdeas'));
const ProductKeywordResearch = lazy(() => import('./ProductKeywordResearch'));
const ProductNameIdeas = lazy(() => import('./ProductNameIdeas'));
const ProductPinterestTitles = lazy(() => import('./ProductPinterestTitles'));
const ProductSummary = lazy(() => import('./ProductSummary'));
const RepurposeWebinarTranscripts = lazy(() => import('./RepurposeWebinarTranscripts'));
const RepurposePodcastTranscripts = lazy(() => import('./RepurposePodcastTranscripts'));
const RepurposingForSubstack = lazy(() => import('./RepurposingForSubstack'));
const SalesEmails = lazy(() => import('./SalesEmails'));
const SalesPage = lazy(() => import('./SalesPage'));
const SellYourContent = lazy(() => import('./SellYourContent'));
const SEOMagic = lazy(() => import('./SEOMagic'));
const SEOTitleDescriptionProduct = lazy(() => import('./SEOTitleDescriptionProduct'));
const ServiceSalesPage = lazy(() => import('./ServiceSalesPage'));
const SingleClickSalesPage = lazy(() => import('./SingleClickSalesPage'));
const SocialContentFromURL = lazy(() => import('./SocialContentFromURL'));
const SocialContentFromTranscripts = lazy(() => import('./SocialContentFromTranscripts'));
const SocialMediaFreestyle = lazy(() => import('./SocialMediaFreestyle'));
const SocialMediaPlan = lazy(() => import('./SocialMediaPlan'));
const SocialPlan = lazy(() => import('./SocialPlan'));
const SocialPosts = lazy(() => import('./SocialPosts'));
const SpeakerTopicIdeas = lazy(() => import('./SpeakerTopicIdeas'));
const StoryBasedEmails = lazy(() => import('./StoryBasedEmails'));
const StoryBasedSocialPosts = lazy(() => import('./StoryBasedSocialPosts'));
const SubjectLineGenerator = lazy(() => import('./SubjectLineGenerator'));
const SummariseRewrite = lazy(() => import('./SummariseRewrite'));
const TestimonialsToBenefits = lazy(() => import('./TestimonialsToBenefits'));
const TranscriptFreestyle = lazy(() => import('./TranscriptFreestyle'));
const VideoScriptsFromTranscripts = lazy(() => import('./VideoScriptsFromTranscripts'));
const VideoScriptsTikTokReels = lazy(() => import('./VideoScriptsTikTokReels'));
const VisualiseTranscriptContent = lazy(() => import('./VisualiseTranscriptContent'));
const WebinarEmails = lazy(() => import('./WebinarEmails'));
const WebPageImprover = lazy(() => import('./WebPageImprover'));
const WebsiteAboutPage = lazy(() => import('./WebsiteAboutPage'));
const WebsiteCategory = lazy(() => import('./WebsiteCategory'));
const WebsiteContact = lazy(() => import('./WebsiteContact'));
const WebsiteFAQs = lazy(() => import('./WebsiteFAQs'));
const WebsiteHomePage = lazy(() => import('./WebsiteHomePage'));
const WebsitePillarPage = lazy(() => import('./WebsitePillarPage'));
const WebsiteSpeakingMediaPage = lazy(() => import('./WebsiteSpeakingMediaPage'));
const WeeklyContentAssets = lazy(() => import('./WeeklyContentAssets'));
const WelcomeSequence = lazy(() => import('./WelcomeSequence'));
const WholesaleInformation = lazy(() => import('./WholesaleInformation'));
const WordBank = lazy(() => import('./WordBank'));

// Tool data array for demonstration - ADD 'category' AND 'isFavorite' (for demo purposes)

export const toolsData: Tool[] = [
  {
    "id": 1,
    "title": "30 Day Social Media Plan for Products",
    "description": "Promote your products or launch with a 30-day social plan designed to highlight a specific product in your business.",
    "icon": "fa-calendar-alt",
    "iconColor": "text-blue-600",
    "bgColor": "bg-blue-100",
    "estimatedTime": "4 min",
    "category": ["Content", "product", "social"],
    "isFavorite": false
  },
  {
    "id": 2,
    "title": "30 Day Social Plan",
    "description": "Get 30 days of content ideas/suggestions to help you take more of your ideal audience on social media.",
    "icon": "fa-share-alt",
    "iconColor": "text-blue-600",
    "bgColor": "bg-blue-100",
    "estimatedTime": "4 min",
    "category": ["Content"],
    "isFavorite": false
  },
  {
    "id": 3,
    "title": "Abandoned Cart Sequence",
    "description": "Complete your purchases with this three-part abandoned cart sequence, which you can trigger to send when people leave items in their shopping carts.",
    "icon": "fa-shopping-cart",
    "iconColor": "text-purple-600",
    "bgColor": "bg-purple-100",
    "estimatedTime": "4 min",
    "category": ["ecommerce"],
    "isFavorite": true
  },
  {
    "id": 4,
    "title": "Affiliate Email Swipes",
    "description": "These email swipes make a great starting point to help affiliates promote your product in emails to their lists.",
    "icon": "fa-envelope",
    "iconColor": "text-pink-600",
    "bgColor": "bg-pink-100",
    "estimatedTime": "5 min",
    "category": ["Affiliate", "email"],
    "isFavorite": false
  },
  {
    "id": 5,
    "title": "Affiliate Messaging Information",
    "description": "Provide your affiliates with a variety of different angles and ideas as they promote your product to different segments of their audience.",
    "icon": "fa-comment",
    "iconColor": "text-yellow-600",
    "bgColor": "bg-yellow-100",
    "estimatedTime": "5 min",
    "category": ["Affiliate"],
    "isFavorite": false
  },
  {
    "id": 6,
    "title": "Affiliate Product Details",
    "description": "Put words around your affiliates that can copy and paste into their product description and share it with their audience.",
    "icon": "fa-tag",
    "iconColor": "text-blue-600",
    "bgColor": "bg-blue-100",
    "estimatedTime": "5 min",
    "category": ["Affiliate"],
    "isFavorite": false
  },
  {
    "id": 7,
    "title": "Affiliate Promo Ideas",
    "description": "Want to give your affiliates ideas to promote your sale/product? Use this to help you create some easy-to-follow promo ideas.",
    "icon": "fa-lightbulb",
    "iconColor": "text-yellow-500",
    "bgColor": "bg-yellow-100",
    "estimatedTime": "5 min",
    "category": ["Affiliate"],
    "isFavorite": true
  },
  {
    "id": 8,
    "title": "Affiliate Social Swipes",
    "description": "Create a variety of social media posts your affiliates can use to promote your products.",
    "icon": "fa-share-alt",
    "iconColor": "text-indigo-600",
    "bgColor": "bg-indigo-100",
    "estimatedTime": "4 min",
    "category": ["Affiliate"],
    "isFavorite": false
  },
  {
    "id": 9,
    "title": "Amazon Description",
    "description": "Get a product description for list your product on Amazon, including features and benefits, plus long-tail keyword ideas.",
    "icon": "fa-shopping-bag",
    "iconColor": "text-orange-600",
    "bgColor": "bg-orange-100",
    "estimatedTime": "5 min",
    "category": ["ecommerce"],
    "isFavorite": false
  },
  {
    "id": 10,
    "title": "Blog Content from Transcripts",
    "description": "Turn your transcripts into fresh content ideas, outlines, chatGPT blog posts, and case studies.",
    "icon": "fa-file-alt",
    "iconColor": "text-green-600",
    "bgColor": "bg-green-100",
    "estimatedTime": "5 min",
    "category": ["Blog", "video"],
    "isFavorite": false
  },
  {
    "id": 11,
    "title": "Blog Generator",
    "description": "Simply add a topic and an outline, and hit 'Create' to get a blog post written for you as a drafted blog post for your chosen topic.",
    "icon": "fa-edit",
    "iconColor": "text-red-600",
    "bgColor": "bg-red-100",
    "estimatedTime": "6 min",
    "category": ["Blog"],
    "isFavorite": false
  },
  {
    "id": 12,
    "title": "Blog Posts",
    "description": "Get blog titles and outlines for each stage of the customer journey for your product and start getting more evergreen traffic to your sales page.",
    "icon": "fa-pen-fancy",
    "iconColor": "text-purple-600",
    "bgColor": "bg-purple-100",
    "estimatedTime": "5 min",
    "category": ["Blog"],
    "isFavorite": false
  },
  {
    "id": 13,
    "title": "Blog Promo",
    "description": "Start getting traffic over to your brand's new blog and capture a lead generation funnel with increasing clicks to your website.",
    "icon": "fa-bullhorn",
    "iconColor": "text-pink-600",
    "bgColor": "bg-pink-100",
    "estimatedTime": "4 min",
    "category": ["Blog"],
    "isFavorite": false
  },
  {
    "id": 14,
    "title": "Brand Bios",
    "description": "Create a variety of brand bios to showcase on your socials, your press kit, and your website.",
    "icon": "fa-id-card",
    "iconColor": "text-purple-600",
    "bgColor": "bg-purple-100",
    "estimatedTime": "3 min",
    "category": ["brand"],
    "isFavorite": false
  },
  {
    "id": 15,
    "title": "Brand Emails",
    "description": "Emails that share your brand's story and journey, which can be used as one-off emails or as part of your welcome sequence.",
    "icon": "fa-envelope",
    "iconColor": "text-blue-600",
    "bgColor": "bg-blue-100",
    "estimatedTime": "5 min",
    "category": ["email", "brand"],
    "isFavorite": false
  },
  {
    "id": 16,
    "title": "Brand Keyword Research",
    "description": "Get a variety of different keywords your brand should be using, including industry, category, product, customer, and intent keywords.",
    "icon": "fa-search",
    "iconColor": "text-blue-600",
    "bgColor": "bg-blue-100",
    "estimatedTime": "5 min",
    "category": ["brand"],
    "isFavorite": false
  },
  {
    "id": 17,
    "title": "Brand Social",
    "description": "Write captions that can be used on your Instagram grid or other social posts to share your brand's story and engage users.",
    "icon": "fa-comment",
    "iconColor": "text-blue-600",
    "bgColor": "bg-blue-100",
    "estimatedTime": "4 min",
    "category": ["brand", "social"],
    "isFavorite": false
  },
  {
    "id": 18,
    "title": "Bump",
    "description": "Create an eye-catching headline and short text that offers value in your checkout page to increase the average order value of your funnel.",
    "icon": "fa-arrow-up",
    "iconColor": "text-green-600",
    "bgColor": "bg-green-100",
    "estimatedTime": "3 min",
    "category": ["funnel"],
    "isFavorite": false
  },
  {
    "id": 19,
    "title": "Buyer Persona",
    "description": "Get a product-specific buyer persona that helps you understand the unique challenges of your potential customers.",
    "icon": "fa-user",
    "iconColor": "text-indigo-600",
    "bgColor": "bg-indigo-100",
    "estimatedTime": "5 min",
    "category": ["funnel", "customerx", "product"],
    "isFavorite": false
  },
  {
    "id": 20,
    "title": "Carousel Content Freestyle",
    "description": "Create your own format of carousel content, and get visual ideas for the design of your slides.",
    "icon": "fa-images",
    "iconColor": "text-orange-600",
    "bgColor": "bg-orange-100",
    "estimatedTime": "4 min",
    "category": ["Content", "social", "freestyle"],
    "isFavorite": false
  },
  {
    "id": 21,
    "title": "Carousel Ideas",
    "description": "Get a variety of ideas for carousel content that will add inspiration for content that aligns with your brand's content pillars.",
    "icon": "fa-layer-group",
    "iconColor": "text-yellow-600",
    "bgColor": "bg-yellow-100",
    "estimatedTime": "3 min",
    "category": ["social"],
    "isFavorite": false
  },
  {
    "id": 22,
    "title": "Checklist Page",
    "description": "Create a single-page product summary, and let us assure the checkout page of your product.",
    "icon": "fa-check-square",
    "iconColor": "text-green-600",
    "bgColor": "bg-green-100",
    "estimatedTime": "4 min",
    "category": ["funnel"],
    "isFavorite": false
  },
  {
    "id": 23,
    "title": "Content Ideas",
    "description": "A list of topic ideas, FAQs, and objections that would be ideal for your content pillars.",
    "icon": "fa-lightbulb",
    "iconColor": "text-yellow-600",
    "bgColor": "bg-yellow-100",
    "estimatedTime": "4 min",
    "category": ["Content"],
    "isFavorite": false
  },
  {
    "id": 24,
    "title": "Content Outline",
    "description": "Complete content outline for blog posts or podcast and outline topics for each of your content pillars.",
    "icon": "fa-list",
    "iconColor": "text-red-600",
    "bgColor": "bg-red-100",
    "estimatedTime": "5 min",
    "category": ["Content"],
    "isFavorite": false
  },
  {
    "id": 25,
    "title": "Content Pillars",
    "description": "Discover the best ideas you talk about a lot in your marketing so people know what your business is about.",
    "icon": "fa-columns",
    "iconColor": "text-gray-600",
    "bgColor": "bg-gray-100",
    "estimatedTime": "5 min",
    "category": ["Content"],
    "isFavorite": true
  },
  {
    "id": 26,
    "title": "Content Repurposer",
    "description": "Transform your existing content into new formats for wider reach",
    "icon": "fa-sync-alt",
    "iconColor": "text-blue-600",
    "bgColor": "bg-blue-100",
    "estimatedTime": "5 min",
    "category": ["Content"],
    "isFavorite": true
  },
  {
    "id": 27,
    "title": "Customer Jobs",
    "description": "Understand what your customers are trying to do + why, and what jobs to do to solve customer problems.",
    "icon": "fa-briefcase",
    "iconColor": "text-blue-600",
    "bgColor": "bg-blue-100",
    "estimatedTime": "4 min",
    "category": ["customerx"],
    "isFavorite": false
  },
  {
    "id": 28,
    "title": "Customer Journey",
    "description": "Understand how people find and buy your products, and then streamline your marketing messages to meet customers where they are.",
    "icon": "fa-map-signs",
    "iconColor": "text-red-600",
    "bgColor": "bg-red-100",
    "estimatedTime": "5 min",
    "category": ["customerx"],
    "isFavorite": false
  },
  {
    "id": 29,
    "title": "Customer Overview",
    "description": "Create a short summary of a typical customer in your business, to keep you focused on who your product helps.",
    "icon": "fa-user-circle",
    "iconColor": "text-purple-600",
    "bgColor": "bg-purple-100",
    "estimatedTime": "4 min",
    "category": ["customerx"],
    "isFavorite": false
  },
  {
    "id": 30,
    "title": "Customer Research",
    "description": "Find out who your customers really are and what they need, and position your product to help them.",
    "icon": "fa-search",
    "iconColor": "text-amber-600",
    "bgColor": "bg-amber-100",
    "estimatedTime": "5 min",
    "category": ["customerx"],
    "isFavorite": false
  },
  {
    "id": 31,
    "title": "Customer Segment Sales Page",
    "description": "Create a dedicated sales page or landing page for one of your products or services that speaks to a specific customer segment.",
    "icon": "fa-users",
    "iconColor": "text-blue-600",
    "bgColor": "bg-blue-100",
    "estimatedTime": "6 min",
    "category": ["customerx", "salespage"],
    "isFavorite": false
  },
  {
    "id": 32,
    "title": "Digital Product Description",
    "description": "A short-form description for your digital product to use on Shopify or other ecommerce platforms.",
    "icon": "fa-file-alt",
    "iconColor": "text-green-600",
    "bgColor": "bg-green-100",
    "estimatedTime": "4 min",
    "category": ["digitalshop"],
    "isFavorite": true
  },
  {
    "id": 33,
    "title": "Digital Product Sales Page",
    "description": "A hybrid between an ecommerce product description and a sales page, this is perfect for telling your potential customers about your digital product.",
    "icon": "fa-shopping-cart",
    "iconColor": "text-purple-600",
    "bgColor": "bg-purple-100",
    "estimatedTime": "6 min",
    "category": ["digitalshop", "salespage"],
    "isFavorite": false
  },
  {
    "id": 34,
    "title": "Draft Training Materials",
    "description": "Encourage action and implementation with these repurposing resources for your courses and workshops.",
    "icon": "fa-graduation-cap",
    "iconColor": "text-indigo-600",
    "bgColor": "bg-indigo-100",
    "estimatedTime": "6 min",
    "category": ["video"],
    "isFavorite": false
  },
  {
    "id": 35,
    "title": "Ecommerce Social Media Posts",
    "description": "Generate engaging social media content specifically designed to promote and sell products across various platforms.",
    "icon": "fa-shopping-bag",
    "iconColor": "text-indigo-600",
    "bgColor": "bg-indigo-100",
    "estimatedTime": "4 min",
    "category": ["ecommerce"],
    "isFavorite": false
  },
  {
    "id": 36,
    "title": "Emails & Lead Magnets (Transcripts)",
    "description": "Create emails, sequences, and lead magnets with this suite of tools for repurposing transcripts to support your email marketing.",
    "icon": "fa-envelope",
    "iconColor": "text-blue-600",
    "bgColor": "bg-blue-100",
    "estimatedTime": "5 min",
    "category": ["email"],
    "isFavorite": false
  },
  {
    "id": 37,
    "title": "Email Newsletter",
    "description": "Send your customers regular updates and information about your products or services.",
    "icon": "fa-envelope-open-text",
    "iconColor": "text-cyan-600",
    "bgColor": "bg-cyan-100",
    "estimatedTime": "5 min",
    "category": ["email"],
    "isFavorite": false
  },
  {
    "id": 38,
    "title": "Etsy Ecommerce Description For Digital Product",
    "description": "Generate compelling product descriptions for your Etsy digital products.",
    "icon": "fa-file-alt",
    "iconColor": "text-teal-600",
    "bgColor": "bg-teal-100",
    "estimatedTime": "5 min",
    "category": ["digitalshop", "ecommerce"],
    "isFavorite": false
  },
  {
    "id": 41,
    "title": "Event Promotion Emails",
    "description": "Taking part in an event, summit, or bundle? Create your own emails for your audience using this handy tool to encourage your subscribers to register for it.",
    "icon": "fa-calendar-check",
    "iconColor": "text-pink-600",
    "bgColor": "bg-pink-100",
    "estimatedTime": "5 min",
    "category": ["email", "guest"],
    "isFavorite": false
  },
  {
    "id": 45,
    "title": "Facebook Ads",
    "description": "Create top-of-funnel, middle-of-funnel, and bottom-of-funnel adverts for your product so you can start getting more traffic via paid social ads.",
    "icon": "fa-facebook",
    "iconColor": "text-blue-600",
    "bgColor": "bg-blue-100",
    "estimatedTime": "5 min",
    "category": ["funnel", "social"],
    "isFavorite": false
  },
  {
    "id": 46,
    "title": "Freestyle",
    "description": "Want to get AI to simplify a task for you, but ChatGPT isn't cutting the mustard? Choose your brand from the dropdown below, and then type your request into the box below to get what you need!",
    "icon": "fa-magic",
    "iconColor": "text-purple-600",
    "bgColor": "bg-purple-100",
    "estimatedTime": "2 min",
    "category": ["freestyle"],
    "isFavorite": false
  },
  {
    "id": 47,
    "title": "Freestyle SEO",
    "description": "Create an SEO title and description for your web page - simply describe what's on the web page and add the keyword phrase you're focusing on.",
    "icon": "fa-search",
    "iconColor": "text-gray-600",
    "bgColor": "bg-gray-100",
    "estimatedTime": "3 min",
    "category": ["seo", "freestyle"],
    "isFavorite": false
  },
  {
    "id": 48,
    "title": "Funnel Content from a Page URL",
    "description": "Add a web page URL, and get lead magnet ideas, webinar content, social content, and more.",
    "icon": "fa-funnel-dollar",
    "iconColor": "text-amber-600",
    "bgColor": "bg-amber-100",
    "estimatedTime": "4 min",
    "category": ["funnel", "digitalshop", "product"],
    "isFavorite": false
  },
  {
    "id": 49,
    "title": "General Group & Community Posts",
    "description": "Create your general group or community posts including welcome guidelines, and different engagement posts.",
    "icon": "fa-comments",
    "iconColor": "text-pink-600",
    "bgColor": "bg-pink-100",
    "estimatedTime": "4 min",
    "category": ["customerx", "social"],
    "isFavorite": false
  },
  {
    "id": 50,
    "title": "Group & Community Content Ideas",
    "description": "Get a variety of topical content ideas for encouraging engagement and conversation in your group or community.",
    "icon": "fa-users",
    "iconColor": "text-indigo-600",
    "bgColor": "bg-indigo-100",
    "estimatedTime": "5 min",
    "category": ["customerx", "social"],
    "isFavorite": false
  },
  {
    "id": 51,
    "title": "Ideal Customer Problems",
    "description": "The idea what problems your customers might be facing when it comes to your product? Let's explore them!",
    "icon": "fa-question-circle",
    "iconColor": "text-amber-600",
    "bgColor": "bg-amber-100",
    "estimatedTime": "5 min",
    "category": ["customerx"],
    "isFavorite": false
  },
  {
    "id": 52,
    "title": "Marketing Routine Builder",
    "description": "Not sure where to start each week with your marketing? Use this tool to help you create a focused to-do list that aligns with your current business goal!",
    "icon": "fa-tasks",
    "iconColor": "text-orange-600",
    "bgColor": "bg-orange-100",
    "estimatedTime": "5 min",
    "category": ["Content"],
    "isFavorite": false
  },
  {
    "id": 53,
    "title": "Marketplace Description",
    "description": "Create a unique product description for any other marketplaces your products are listed on, or to use as part of your wholesale pack.",
    "icon": "fa-store",
    "iconColor": "text-green-600",
    "bgColor": "bg-green-100",
    "estimatedTime": "4 min",
    "category": ["ecommerce"],
    "isFavorite": false
  },
  {
    "id": 54,
    "title": "Mission, Vision & Values",
    "description": "Not sure how to define your purpose and brand values? This tool will help you put your vision into words.",
    "icon": "fa-compass",
    "iconColor": "text-blue-600",
    "bgColor": "bg-blue-100",
    "estimatedTime": "6 min",
    "category": ["brand"],
    "isFavorite": false
  },
  {
    "id": 55,
    "title": "Onboarding Emails",
    "description": "Help your customers get started after they've purchased something from you with this series of emails designed to highlight helpful features and resources.",
    "icon": "fa-smile",
    "iconColor": "text-amber-600",
    "bgColor": "bg-amber-100",
    "estimatedTime": "5 min",
    "category": ["email", "product"],
    "isFavorite": false
  },
  {
    "id": 56,
    "title": "Opt-In Delivery Email",
    "description": "Send your new subscriber an email to deliver your lead magnet to them, including access information and encouragement to get stuck into the resource.",
    "icon": "fa-paper-plane",
    "iconColor": "text-gray-600",
    "bgColor": "bg-gray-100",
    "estimatedTime": "3 min",
    "category": ["email", "lead"],
    "isFavorite": false
  },
  {
    "id": 57,
    "title": "Opt-In Email Ideas",
    "description": "Stuck for how to take your email subscribers from leads to customers? Use this tool to get some ideas for email content you can send to your new audience!",
    "icon": "fa-lightbulb",
    "iconColor": "text-yellow-600",
    "bgColor": "bg-yellow-100",
    "estimatedTime": "4 min",
    "category": ["email", "lead"],
    "isFavorite": false
  },
  {
    "id": 58,
    "title": "Opt-In Ideas",
    "description": "Get a variety of ideas for different lead magnets that will help you provide strategic value to your audience and increase your email list with potential customers.",
    "icon": "fa-list-alt",
    "iconColor": "text-green-600",
    "bgColor": "bg-green-100",
    "estimatedTime": "5 min",
    "category": ["lead"],
    "isFavorite": false
  },
  {
    "id": 59,
    "title": "Opt-In Page Copy",
    "description": "Create an opt-in page for your lead magnet, and give your page visitors a compelling, clear understanding of the value of your freebie.",
    "icon": "fa-file-alt",
    "iconColor": "text-gray-600",
    "bgColor": "bg-gray-100",
    "estimatedTime": "5 min",
    "category": ["website", "lead"],
    "isFavorite": false
  },
  {
    "id": 60,
    "title": "Opt-In Thank You Page",
    "description": "Create a thank you page for your lead magnet that gives your new subscribers a confirmation and next steps for accessing their resource.",
    "icon": "fa-hand-sparkles",
    "iconColor": "text-amber-600",
    "bgColor": "bg-amber-100",
    "estimatedTime": "4 min",
    "category": ["website", "lead"],
    "isFavorite": false
  },
  {
    "id": 61,
    "title": "Pinterest Titles & Descriptions",
    "description": "Add a web page, and create Pinterest titles, descriptions, and graphic suggestions to help improve your traffic & visibility on Pinterest.",
    "icon": "fa-pinterest",
    "iconColor": "text-red-600",
    "bgColor": "bg-red-100",
    "estimatedTime": "4 min",
    "category": ["Content", "social", "seo"],
    "isFavorite": false
  },
  {
    "id": 62,
    "title": "Podcast Pitch Prep",
    "description": "Want to be a guest on other people's podcasts? Use this tool to help you get started creating a personalized pitch to the podcast host.",
    "icon": "fa-microphone",
    "iconColor": "text-purple-600",
    "bgColor": "bg-purple-100",
    "estimatedTime": "5 min",
    "category": ["guest"],
    "isFavorite": false
  },
  {
    "id": 63,
    "title": "Post-Purchase Email",
    "description": "Draft a post-purchase email to send your customers the details of their purchase, and let them know what their next steps should be to access it.",
    "icon": "fa-envelope-open-text",
    "iconColor": "text-blue-600",
    "bgColor": "bg-blue-100",
    "estimatedTime": "4 min",
    "category": ["funnel", "digitalshop", "email"],
    "isFavorite": false
  },
  {
    "id": 64,
    "title": "Product Customer Journey",
    "description": "Create a customer journey for a specific product in your business.",
    "icon": "fa-route",
    "iconColor": "text-indigo-600",
    "bgColor": "bg-indigo-100",
    "estimatedTime": "6 min",
    "category": ["customerx", "product"],
    "isFavorite": false
  },
  {
    "id": 65,
    "title": "Product Description",
    "description": "Use this tool to create a product description suitable for using on your website (e.g. Shopify, Squarespace, Wordpress).",
    "icon": "fa-tag",
    "iconColor": "text-orange-600",
    "bgColor": "bg-orange-100",
    "estimatedTime": "4 min",
    "category": ["ecommerce", "product"],
    "isFavorite": false
  },
  {
    "id": 66,
    "title": "Product Freestyle",
    "description": "Want to create something specific to one of your products? Look no further! This tool will help you create anything you need to promote and sell your product - be it an email, a social post, an affiliate asset, or even an idea for how to improve it!",
    "icon": "fa-gift",
    "iconColor": "text-red-600",
    "bgColor": "bg-red-100",
    "estimatedTime": "3 min",
    "category": ["product", "freestyle"],
    "isFavorite": false
  },
  {
    "id": 67,
    "title": "Product Group & Community Posts",
    "description": "Got a product with a community component? Use this tool to create your community engagement posts.",
    "icon": "fa-users",
    "iconColor": "text-pink-600",
    "bgColor": "bg-pink-100",
    "estimatedTime": "5 min",
    "category": ["customerx", "product", "social"],
    "isFavorite": false
  },
  {
    "id": 68,
    "title": "Product Ideas",
    "description": "Want to get some fresh new ideas for things you can sell in your business? This tool will help you come up with ideas based on your skills and experience.",
    "icon": "fa-lightbulb",
    "iconColor": "text-yellow-600",
    "bgColor": "bg-yellow-100",
    "estimatedTime": "5 min",
    "category": ["product"],
    "isFavorite": false
  },
  {
    "id": 69,
    "title": "Product Keyword Research",
    "description": "Get different ideas for phrases to help you with keyword research for your products or service, including angles for product, customer, and user intent.",
    "icon": "fa-search",
    "iconColor": "text-gray-600",
    "bgColor": "bg-gray-100",
    "estimatedTime": "5 min",
    "category": ["ecommerce", "product"],
    "isFavorite": false
  },
  {
    "id": 70,
    "title": "Product Name Ideas",
    "description": "Want to find a catchier or more compelling name for your product? Use this tool to help you explore new name ideas!",
    "icon": "fa-tag",
    "iconColor": "text-orange-600",
    "bgColor": "bg-orange-100",
    "estimatedTime": "4 min",
    "category": ["product"],
    "isFavorite": false
  },
  {
    "id": 71,
    "title": "Product Pinterest Titles & Descriptions",
    "description": "Create Pinterest titles, descriptions, and graphic suggestions to help improve your product's traffic & visibility on Pinterest.",
    "icon": "fa-pinterest-p",
    "iconColor": "text-red-600",
    "bgColor": "bg-red-100",
    "estimatedTime": "4 min",
    "category": ["Content", "product", "social", "seo"],
    "isFavorite": false
  },
  {
    "id": 72,
    "title": "Product Summary",
    "description": "Not sure how to describe what you're selling succinctly? Use this tool to help you craft quick descriptions, features, and benefits.",
    "icon": "fa-clipboard-list",
    "iconColor": "text-teal-600",
    "bgColor": "bg-teal-100",
    "estimatedTime": "4 min",
    "category": ["product"],
    "isFavorite": false
  },
  {
    "id": 73,
    "title": "Repurpose a Webinar, Demo or Sales Video (Transcripts)",
    "description": "Have an automated transcript from a webinar, demo, or sales video, and turn it into a variety of assets for your funnel.",
    "icon": "fa-film",
    "iconColor": "text-green-600",
    "bgColor": "bg-green-100",
    "estimatedTime": "5 min",
    "category": ["video"],
    "isFavorite": false
  },
  {
    "id": 74,
    "title": "Repurpose for Podcasting (Transcripts)",
    "description": "Get excerpts for repurposing your transcript into a variety of podcast titles and scripts tailored for different formats and durations.",
    "icon": "fa-microphone",
    "iconColor": "text-purple-600",
    "bgColor": "bg-purple-100",
    "estimatedTime": "5 min",
    "category": ["video"],
    "isFavorite": false
  },
  {
    "id": 75,
    "title": "Repurposing for Substack",
    "description": "Repurpose a piece of your content for your Substack audience, adding extra community-focused elements to your writing.",
    "icon": "fa-recycle",
    "iconColor": "text-green-600",
    "bgColor": "bg-green-100",
    "estimatedTime": "5 min",
    "category": ["Content"],
    "isFavorite": false
  },
  {
    "id": 76,
    "title": "Sales Emails",
    "description": "Create a sales sequence for the promotion or launch of a product or offer in your business, pick and choose which ones you need, or use all of them!",
    "icon": "fa-dollar-sign",
    "iconColor": "text-amber-600",
    "bgColor": "bg-amber-100",
    "estimatedTime": "6 min",
    "category": ["email", "salespage"],
    "isFavorite": false
  },
  {
    "id": 77,
    "title": "Sales Page",
    "description": "Generate a sales page walking the reader through the problems, solution, offer, features, and benefits, including call to action buttons and FAQs.",
    "icon": "fa-file-invoice-dollar",
    "iconColor": "text-green-600",
    "bgColor": "bg-green-100",
    "estimatedTime": "7 min",
    "category": ["funnel", "salespage"],
    "isFavorite": false
  },
  {
    "id": 78,
    "title": "Sell Your Content (Transcripts)",
    "description": "Transform your transcripts into valuable monetized content",
    "icon": "fa-money-bill-wave",
    "iconColor": "text-yellow-600",
    "bgColor": "bg-yellow-100",
    "estimatedTime": "6 min",
    "category": ["video"],
    "isFavorite": false
  },
  {
    "id": 79,
    "title": "SEO Magic",
    "description": "Analyse your brand's web pages and get keyword ideas, SEO title and description suggestions, and a list of actionable ideas for improving your web page for search visibility.",
    "icon": "fa-chart-line",
    "iconColor": "text-blue-600",
    "bgColor": "bg-blue-100",
    "estimatedTime": "5 min",
    "category": ["seo", "website"],
    "isFavorite": false
  },
  {
    "id": 80,
    "title": "SEO Title & Description for Product Pages",
    "description": "Create an SEO title and description for your product, and start getting more organic traffic and search engine visibility!",
    "icon": "fa-search",
    "iconColor": "text-gray-600",
    "bgColor": "bg-gray-100",
    "estimatedTime": "4 min",
    "category": ["seo"],
    "isFavorite": false
  },
  {
    "id": 82,
    "title": "Service Sales Page",
    "description": "Create a dedicated landing page for one of your services or packages so you can make the most of your organic visibility and speak to your clients' needs directly.",
    "icon": "fa-concierge-bell",
    "iconColor": "text-amber-600",
    "bgColor": "bg-amber-100",
    "estimatedTime": "6 min",
    "category": ["salespage"],
    "isFavorite": false
  },
  {
    "id": 83,
    "title": "Single Click Sales Page",
    "description": "Want a sales page in a jiffy? This tool will create a draft sales page in a click—no messing around with multiple sections, just create and go.",
    "icon": "fa-bolt",
    "iconColor": "text-blue-600",
    "bgColor": "bg-blue-100",
    "estimatedTime": "3 min",
    "category": ["salespage"],
    "isFavorite": false
  },
  {
    "id": 84,
    "title": "Social Content from a Page URL",
    "description": "Add a web page URL, and turn it into a variety of social media posts that will engage and educate your audience.",
    "icon": "fa-share-alt",
    "iconColor": "text-blue-600",
    "bgColor": "bg-blue-100",
    "estimatedTime": "4 min",
    "category": ["Content", "social"],
    "isFavorite": false
  },
  {
    "id": 85,
    "title": "Social Content from Transcripts",
    "description": "Create conversation-worthy captions from your transcripts, suitable for content across different social media channels.",
    "icon": "fa-comments",
    "iconColor": "text-indigo-600",
    "bgColor": "bg-indigo-100",
    "estimatedTime": "5 min",
    "category": ["social", "video"],
    "isFavorite": false
  },
  {
    "id": 86,
    "title": "Social Media Freestyle",
    "description": "Say goodbye to being stuck when it comes to social media copywriting, and use the freestyle tool to draft captions from your ideas.",
    "icon": "fa-hashtag",
    "iconColor": "text-blue-600",
    "bgColor": "bg-blue-100",
    "estimatedTime": "3 min",
    "category": ["social", "freestyle"],
    "isFavorite": false
  },
  {
    "id": 87,
    "title": "Social Posts",
    "description": "Create social media posts for Facebook, Instagram, Twitter, LinkedIn, and Pinterest to share your product with existing and new audiences.",
    "icon": "fa-thumbs-up",
    "iconColor": "text-purple-600",
    "bgColor": "bg-purple-100",
    "estimatedTime": "4 min",
    "category": ["social"],
    "isFavorite": false
  },
  {
    "id": 88,
    "title": "Speaker Topic Ideas",
    "description": "If you're applying to speak at an event or summit, this tool will give you some ideas for your session so it's as relevant to the event as possible.",
    "icon": "fa-bullhorn",
    "iconColor": "text-cyan-600",
    "bgColor": "bg-cyan-100",
    "estimatedTime": "5 min",
    "category": ["guest"],
    "isFavorite": false
  },
  {
    "id": 89,
    "title": "Story-Based Emails",
    "description": "Once you've filled in the Story Magic questions, use this tool to get 39 different story-based emails for your nurture and evergreen email sequences.",
    "icon": "fa-envelope",
    "iconColor": "text-pink-600",
    "bgColor": "bg-pink-100",
    "estimatedTime": "6 min",
    "category": ["Content", "email"],
    "isFavorite": false
  },
  {
    "id": 90,
    "title": "Story-Based Social Posts",
    "description": "Get 39 different story-based social media posts for your brand - fill in your Business Story first!",
    "icon": "fa-book",
    "iconColor": "text-gray-600",
    "bgColor": "bg-gray-100",
    "estimatedTime": "5 min",
    "category": ["Content", "social"],
    "isFavorite": false
  },
  {
    "id": 91,
    "title": "Subject Line Generator",
    "description": "Stuck for what to use for your email subject lines? Use this generator to help you with ideas!",
    "icon": "fa-heading",
    "iconColor": "text-red-600",
    "bgColor": "bg-red-100",
    "estimatedTime": "2 min",
    "category": ["email"],
    "isFavorite": false
  },
  {
    "id": 92,
    "title": "Summarise & Rewrite (Transcripts)",
    "description": "Tools to help you summarise content, extract main topics, highlight key quotes, identify essential keywords, and rewrite transcripts.",
    "icon": "fa-file-alt",
    "iconColor": "text-gray-600",
    "bgColor": "bg-gray-100",
    "estimatedTime": "5 min",
    "category": ["video"],
    "isFavorite": false
  },
  {
    "id": 93,
    "title": "Testimonials to Benefits",
    "description": "Use your customers' testimonials and feedback to reverse-engineer features and benefits! Just add your testimonials to the box provided.",
    "icon": "fa-star",
    "iconColor": "text-amber-600",
    "bgColor": "bg-amber-100",
    "estimatedTime": "4 min",
    "category": ["funnel", "customerx", "product"],
    "isFavorite": false
  },
  {
    "id": 94,
    "title": "Transcript Freestyle",
    "description": "Want something specific out of your transcript? Use the Freestyle tool to zoom in on your transcript goals.",
    "icon": "fa-file-alt",
    "iconColor": "text-blue-600",
    "bgColor": "bg-blue-100",
    "estimatedTime": "3 min",
    "category": ["video", "freestyle"],
    "isFavorite": false
  },
  {
    "id": 95,
    "title": "Video Scripts from Transcripts",
    "description": "Get transcript-based video inspiration for short-form videos through to webinar scripts, YouTube videos, and sales videos.",
    "icon": "fa-video",
    "iconColor": "text-indigo-600",
    "bgColor": "bg-indigo-100",
    "estimatedTime": "6 min",
    "category": ["video"],
    "isFavorite": false
  },
  {
    "id": 96,
    "title": "Video Scripts & Ideas for TikTok and Reels",
    "description": "Create short-form video scripts for your content ideas, perfect for creating videos for TikTok and Instagram Reels.",
    "icon": "fa-film",
    "iconColor": "text-gray-600",
    "bgColor": "bg-gray-100",
    "estimatedTime": "4 min",
    "category": ["social", "video"],
    "isFavorite": false
  },
  {
    "id": 97,
    "title": "Visualise Your Transcript Content",
    "description": "Present complex information clearly and efficiently with tools that suggest different ways of visualising your content.",
    "icon": "fa-chart-pie",
    "iconColor": "text-cyan-600",
    "bgColor": "bg-cyan-100",
    "estimatedTime": "5 min",
    "category": ["video"],
    "isFavorite": false
  },
  {
    "id": 98,
    "title": "Webinar Emails",
    "description": "Promote an upcoming webinar to your list, and draft the necessary emails for webinar details, reminders, and replay delivery.",
    "icon": "fa-laptop",
    "iconColor": "text-blue-600",
    "bgColor": "bg-blue-100",
    "estimatedTime": "5 min",
    "category": ["email"],
    "isFavorite": false
  },
  {
    "id": 99,
    "title": "Web Page Improver",
    "description": "Got an existing web page you'd like to refresh? This Content Improver tool has practical suggestions for your headings, as well as rewriting sections of your web page.",
    "icon": "fa-window-maximize",
    "iconColor": "text-gray-600",
    "bgColor": "bg-gray-100",
    "estimatedTime": "6 min",
    "category": ["Content", "seo", "website"],
    "isFavorite": false
  },
  {
    "id": 100,
    "title": "Website About Page",
    "description": "Tell your business story and share your professional journey to share your values and build trust with visitors.",
    "icon": "fa-file-alt",
    "iconColor": "text-blue-600",
    "bgColor": "bg-blue-100",
    "estimatedTime": "6 min",
    "category": ["website"],
    "isFavorite": false
  },
  {
    "id": 101,
    "title": "Website Category Page",
    "description": "Whether it's a blog category or a product category, use this page to get the content you need to make the most of your collections and categories.",
    "icon": "fa-layer-group",
    "iconColor": "text-gray-600",
    "bgColor": "bg-gray-100",
    "estimatedTime": "5 min",
    "category": ["website"],
    "isFavorite": false
  },
  {
    "id": 102,
    "title": "Website Contact Page",
    "description": "Give your website's contact page a brand-aligned refresh and make sure all the details your audience (and search engines!) need are on there.",
    "icon": "fa-envelope",
    "iconColor": "text-indigo-600",
    "bgColor": "bg-indigo-100",
    "estimatedTime": "4 min",
    "category": ["website"],
    "isFavorite": false
  },
  {
    "id": 103,
    "title": "Website FAQs",
    "description": "Use this tool to create a variety of FAQs covering common customer enquiries and support requests by adding the question and generating an answer in your brand's tone of voice.",
    "icon": "fa-question-circle",
    "iconColor": "text-blue-600",
    "bgColor": "bg-blue-100",
    "estimatedTime": "4 min",
    "category": ["website"],
    "isFavorite": false
  },
  {
    "id": 104,
    "title": "Website Home Page",
    "description": "The highlight reel of your brand is the digital doorway to your virtual HQ, signposting visitors to what they need.",
    "icon": "fa-home",
    "iconColor": "text-amber-600",
    "bgColor": "bg-amber-100",
    "estimatedTime": "7 min",
    "category": ["website"],
    "isFavorite": false
  },
  {
    "id": 105,
    "title": "Website Pillar Page",
    "description": "Create comprehensive pillar pages that serve as authoritative resources for your main topics",
    "icon": "fas fa-file-alt",
    "iconColor": "text-purple-600",
    "bgColor": "bg-purple-100",
    "estimatedTime": "8 min",
    "category": ["website"],
    "isFavorite": false
  },
  {
    "id": 106,
    "title": "Website Speaking & Media Page",
    "description": "Generate professional speaking and media pages to showcase expertise and attract opportunities",
    "icon": "fas fa-microphone",
    "iconColor": "text-blue-600",
    "bgColor": "bg-blue-100",
    "estimatedTime": "6 min",
    "category": ["website"],
    "isFavorite": false
  },
  {
    "id": 107,
    "title": "Weekly Content Assets",
    "description": "Take your week's outline & get your assets for a week of marketing in a click.",
    "icon": "fa-calendar-week",
    "iconColor": "text-green-600",
    "bgColor": "bg-green-100",
    "estimatedTime": "3 min",
    "category": ["Content"],
    "isFavorite": false
  },
  {
    "id": 108,
    "title": "Welcome Sequence",
    "description": "Create a welcome sequence using a mix of the emails on this page - or all of them. If you want to really welcome your subscribers in style!",
    "icon": "fa-handshake",
    "iconColor": "text-pink-600",
    "bgColor": "bg-pink-100",
    "estimatedTime": "6 min",
    "category": ["email"],
    "isFavorite": false
  },
  {
    "id": 109,
    "title": "Wholesale Information",
    "description": "Get a product outline suited for any of your wholesale customers and clients with space for you to add your pricing and minimum order quantities.",
    "icon": "fa-boxes",
    "iconColor": "text-amber-600",
    "bgColor": "bg-amber-100",
    "estimatedTime": "5 min",
    "category": ["ecommerce"],
    "isFavorite": false
  },
  {
    "id": 110,
    "title": "Word Bank",
    "description": "Add consistency to your copy, and create a 'one-stop' reference for coming up with names that resonate with your audience.",
    "icon": "fa-language",
    "iconColor": "text-green-600",
    "bgColor": "bg-green-100",
    "estimatedTime": "4 min",
    "category": ["brand"],
    "isFavorite": false
  }
];

// Define the props interface for ToolCard to match what's expected
interface ToolCardProps {
  toolId: string;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  category: string;
  timeToComplete: string;
  onClick: (toolId: string) => void;
}

// Update the props for ToolsGrid
interface ToolsGridProps {
  onToolSelected?: (toolId: number | null) => void;
  searchTerm?: string;
  activeCategory: string;
  showFavorites?: boolean;
}

export default function ToolsGrid({ onToolSelected, searchTerm = "", activeCategory, showFavorites = false }: ToolsGridProps) {
  const [selectedTool, setSelectedTool] = useState<number | null>(null);
  const router = useRouter();

  // Handle browser back button and trackpad gestures with proper history management
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // If we have a selected tool, go back to grid instead of navigating away
      if (selectedTool !== null) {
        event.preventDefault();
        setSelectedTool(null);
        if (onToolSelected) {
          onToolSelected(null);
        }
        // Push the all-tools state back to prevent further navigation
        window.history.pushState({ page: 'all-tools' }, '', '/all-tools');
      }
    };
    
    // Add the event listener
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [selectedTool, onToolSelected]);

  // Update history when tool is selected
  useEffect(() => {
    if (selectedTool !== null) {
      const toolSlug = getSlugFromToolId(selectedTool, toolsData);
      // Push a new state when a tool is selected with SEO-friendly slug
      window.history.pushState({ page: 'tool', toolId: selectedTool, toolSlug }, '', `/all-tools/${toolSlug}`);
    } else {
      // Ensure we're on the all-tools page when no tool is selected
      window.history.replaceState({ page: 'all-tools' }, '', '/all-tools');
    }
  }, [selectedTool]);

  const handleToolClick = (toolId: string) => {
    setSelectedTool(parseInt(toolId));
  };
  
  // Handle back to grid with optional event parameter
  const handleBackToGrid = (e?: React.MouseEvent) => {
    setSelectedTool(null);
    if (onToolSelected) {
      onToolSelected(null);
    }
    // Ensure we stay on all-tools page
    window.history.replaceState({ page: 'all-tools' }, '', '/all-tools');
  };
  
  // No-args version for components expecting () => void
  const handleBackToGridNoArgs = () => {
    setSelectedTool(null);
    if (onToolSelected) {
      onToolSelected(null);
    }
    // Ensure we stay on all-tools page
    window.history.replaceState({ page: 'all-tools' }, '', '/all-tools');
  };

  // Get the active tool data
  const activeTool = toolsData.find(tool => tool.id === selectedTool);
  
  // Filtered tools based on search term, category, and favorites
  const filteredTools = toolsData.filter(tool => {
    const matchesSearchTerm = !searchTerm || 
      tool.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      tool.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = activeCategory === 'all' || tool.category.includes(activeCategory);

    const matchesFavorites = !showFavorites || tool.isFavorite;

    return matchesSearchTerm && matchesCategory && matchesFavorites;
  });

  // State for active tab (kept from original for completeness, though not used in filtering logic here)
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');

  // Render tool component based on ID
  const renderToolComponent = () => {
    if (!selectedTool) return null;
    const componentMap: Record<number, React.ComponentType<any>> = {
      1: SocialMediaPlan,
      2: SocialPlan,
      3: AbandonedCartSequence,
      4: AffiliateEmailSwipes,
      5: AffiliateMessagingInformation,
      6: AffiliateProductDetails,
      7: AffiliatePromoIdeas,
      8: AffiliateSocialSwipes,
      9: AmazonDescription,
      10: BlogContentFromTranscripts,
      11: BlogGenerator,
      12: BlogPosts,
      13: BlogPromo,
      14: BrandBios,
      15: BrandEmails,
      16: BrandKeywordResearch,
      17: BrandSocial,
      18: BumpCopy,
      19: BuyerPersona,
      20: CarouselContentFreestyle,
      21: CarouselIdeas,
      22: CheckoutPage,
      23: ContentIdeas,
      24: ContentOutline,
      25: ContentPillars,
      26: ContentRepurposer,
      27: CustomerJobs,
      28: CustomerJourney,
      29: CustomerOverview,
      30: CustomerResearch,
      31: CustomerSegmentSalesPage,
      32: DigitalProductDescription,
      33: DigitalProductSalesPage,
      34: DraftTrainingMaterials,
      35: EcommerceSocialMediaPosts,
      36: EmailsLeadMagnets,
      37: EmailNewsletter,
      38: EtsyEcommerceDescription,
      41: EventPromotionEmails,
      45: FacebookAds,
      46: Freestyle,
      47: FreestyleSEO,
      48: FunnelContentFromURL,
      49: GeneralGroupCommunityPosts,
      50: GroupCommunityContentIdeas,
      51: IdealCustomerProblems,
      52: MarketingRoutineBuilder,
      53: MarketplaceDescription,
      54: MissionVisionValues,
      55: OnboardingEmails,
      56: OptInDeliveryEmail,
      57: OptInEmailIdeas,
      58: OptInIdeas,
      59: OptInPageCopy,
      60: OptInThankYouPage,
      61: PinterestTitlesDescriptions,
      62: PodcastPitchPrep,
      63: PostPurchaseEmail,
      64: ProductCustomerJourney,
      65: ProductDescription,
      66: ProductFreestyle,
      67: ProductGroupCommunityPosts,
      68: ProductIdeas,
      69: ProductKeywordResearch,
      70: ProductNameIdeas,
      71: ProductPinterestTitles,
      72: ProductSummary,
      73: RepurposeWebinarTranscripts,
      74: RepurposePodcastTranscripts,
      75: RepurposingForSubstack,
      76: SalesEmails,
      77: SalesPage,
      78: SellYourContent,
      79: SEOMagic,
      80: SEOTitleDescriptionProduct,
      82: ServiceSalesPage,
      83: SingleClickSalesPage,
      84: SocialContentFromURL,
      85: SocialContentFromTranscripts,
      86: SocialMediaFreestyle,
      87: SocialPosts,
      88: SpeakerTopicIdeas,
      89: StoryBasedEmails,
      90: StoryBasedSocialPosts,
      91: SubjectLineGenerator,
      92: SummariseRewrite,
      93: TestimonialsToBenefits,
      94: TranscriptFreestyle,
      95: VideoScriptsFromTranscripts,
      96: VideoScriptsTikTokReels,
      97: VisualiseTranscriptContent,
      98: WebinarEmails,
      99: WebPageImprover,
      100: WebsiteAboutPage,
      101: WebsiteCategory,
      102: WebsiteContact,
      103: WebsiteFAQs,
      104: WebsiteHomePage,
      105: WebsitePillarPage,
      106: WebsiteSpeakingMediaPage,
      107: WeeklyContentAssets,
      108: WelcomeSequence,
      109: WholesaleInformation,
      110: WordBank,
    };
    const Component = componentMap[selectedTool];
    return Component ? (
      <Component onBackClick={handleBackToGridNoArgs} />
    ) : (
      <div className="flex items-center justify-center h-64">
        <p>Component not found for tool {selectedTool}</p>
      </div>
    );
  };

  return (
    <div className="h-full w-full p-4">
      {selectedTool === null ? (
        // Show the grid of tool cards when no tool is selected
        <div className="w-full h-full max-h-[calc(100vh-180px)] max-w-[1700px] mx-auto  overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-6">
          {filteredTools.map((tool) => ( // Use filteredTools here
            <ToolCard
              key={tool.id}
              toolId={tool.id.toString()}
              title={tool.title}
              description={tool.description}
              icon={tool.icon}
              iconColor={tool.iconColor}
              category={tool.category.join(', ')} // Join array into comma-separated string
              timeToComplete={tool.estimatedTime}
              onClick={handleToolClick}
            />
          ))}
        </div>
      ) : (
        // Tool detail view
        <div className="h-full w-full">
          {renderToolComponent()}
        </div>
      )}
    </div>
  );
}