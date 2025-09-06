// API Configuration Management
const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://aitools.codencreative.com/api',
  TIMEOUT: 30000, // 30 seconds for AI generation
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
};

// Centralized API Endpoints
const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY: '/auth/verify',
  },
  SOCIAL_MEDIA: {
    GENERATE_PLAN: '/socialplan/plan/generate-groq/',
    GENERATE_30DAY_PLAN: '/socialplan/30day-plan/generate-groq/',
    SAVE_PLAN: '/socialplan/save',
    GET_PLANS: '/socialplan/list',
    DELETE_PLAN: '/socialplan/delete',
  },
  AI_TOOLS: {
    GENERATE: '/ai/generate',
    ANALYZE: '/ai/analyze',
    OPTIMIZE: '/ai/optimize',
  },
  ABANDONED_CART: {
    GENERATE_SEQUENCE: '/abandonedcart/sequence/generate-groq/',
  },
  AFFILIATE_EMAIL_SWIPES: {
    GENERATE_SWIPE: '/affiliate/swipe/generate-groq/',
  },
  AFFILIATE_MESSAGING: {
    GENERATE_INFO: '/affiliatemsg/info/generate-groq/',
  },
  AFFILIATE_PRODUCT_DETAILS: {
    GENERATE_DETAILS: '/affiliatedetails/details/generate-groq/',
  },
  AFFILIATE_PROMO_IDEAS: {
    GENERATE_IDEAS: '/affiliatepromo/generate-groq/',
  },
  AFFILIATE_SOCIAL_SWIPES: {
    GENERATE_SWIPES: '/affiliatepromo/social-swipes/generate-groq/',
  },
  AMAZON_DESCRIPTION: {
    GENERATE_DESCRIPTION: '/affiliatepromo/amazon-description/generate-groq/',
  },
  BLOG_FROM_TRANSCRIPT: {
    GENERATE_CONTENT: '/affiliatepromo/blog-from-transcript/generate-groq/',
  },
  BLOG_GENERATOR: {
    GENERATE_BLOG: '/affiliatepromo/blog-generator/generate-groq/',
  },
  BLOG_POSTS: {
    GENERATE_POSTS: '/affiliatepromo/blog-posts/generate-groq/',
  },
  BLOG_PROMO: {
    GENERATE_PROMO: '/blogpromo/generate-groq/',
  },
  BRAND_BIOS: {
    GENERATE_BIOS: '/brandbios/generate-groq/',
  },
  BRAND_EMAILS: {
    GENERATE_EMAILS: '/brandemails/generate-groq/',
  },
  BRAND_KEYWORDS: {
    GENERATE_KEYWORDS: '/brandkeywords/generate-groq/',
  },
  BRAND_SOCIAL: {
    GENERATE_CONTENT: '/brandsocial/generate-groq/',
  },
  BUMP_COPY: {
    GENERATE_COPY: '/bumpcopy/generate-groq/',
  },
  BUYER_PERSONA: {
    GENERATE_PERSONA: '/buyerpersona/generate-groq/',
  },
  CAROUSEL_FREESTYLE: {
    GENERATE_CAROUSEL: '/carouselfreestyle/generate-groq/',
  },
  CAROUSEL_IDEAS: {
    GENERATE_IDEAS: '/carouselideas/generate-groq/',
  },
  CHECKOUT_PAGE: {
    GENERATE_PAGE: '/checkoutpage/generate-groq/',
  },
  CONTENT_IDEAS: {
    GENERATE_IDEAS: '/contentideas/generate-groq/',
  },
  CONTENT_OUTLINE: {
    GENERATE_OUTLINE: '/contentoutline/generate-groq/',
  },
  CONTENT_PILLARS: {
    GENERATE_PILLARS: '/contentpillars/generate-groq/',
  },
  CONTENT_REPURPOSER: {
    GENERATE_REPURPOSED: '/contentrepurposer/generate-groq/',
  },
  CUSTOMER_JOBS: {
    GENERATE_JOBS: '/customerjobs/generate-groq/',
  },
  CUSTOMER_JOURNEY: {
    GENERATE_JOURNEY: '/customerjourney/generate-groq/',
  },
  CUSTOMER_OVERVIEW: {
    GENERATE_OVERVIEW: '/customeroverview/generate-groq/',
  },
  CUSTOMER_PROBLEMS: {
    GENERATE_PROBLEMS: '/customerproblems/generate-groq/',
  },
  CUSTOMER_RESEARCH: {
    GENERATE_RESEARCH: '/customerresearch/generate-groq/',
  },
  CUSTOMER_SEGMENT_SALES: {
    GENERATE_SALES_PAGE: '/customersegmentsales/generate-groq/',
  },
  DIGITAL_PRODUCT_DESCRIPTION: {
    GENERATE_DESCRIPTION: '/digitalproductdescription/generate-groq/',
  },
  DIGITAL_PRODUCT_SALES_PAGE: {
    GENERATE_SALES_PAGE: '/digitalproductsalespage/generate-groq/',
  },
  ECOMMERCE_POSTS: {
    GENERATE_POSTS: '/ecommerceposts/generate-groq/',
  },
  EMAIL_NEWSLETTER: {
    GENERATE_NEWSLETTER: '/emailnewsletter/generate-groq/',
  },
  EMAILS_LEAD_MAGNETS: {
    GENERATE_CONTENT: '/emailsleadmagnets/generate-groq/',
  },
  ETSY_ECOMMERCE_DESCRIPTION: {
    GENERATE_DESCRIPTION: '/etsyecommercedescription/generate-groq/',
  },
  EVENT_PROMOTION_EMAILS: {
    GENERATE_EMAILS: '/eventpromotionemails/generate-groq/',
  },
  FACEBOOK_ADS: {
    GENERATE_ADS: '/facebookads/generate-groq/',
  },
  FREESTYLE_CONTENT: {
    GENERATE_CONTENT: '/freestylecontent/generate-groq/',
  },
  FREESTYLE_SEO: {
    GENERATE_SEO: '/freestyleseo/generate-groq/',
  },
  FUNNEL_CONTENT: {
    GENERATE_CONTENT: '/funnelcontent/generate-groq/',
  },
  GENERAL_GROUP_COMMUNITY_POSTS: {
    GENERATE_POSTS: '/communityposts/generate-groq/',
  },
  GROUP_COMMUNITY_CONTENT_IDEAS: {
    GENERATE_IDEAS: '/communitycontentideas/generate-groq/',
  },
  MARKETING_ROUTINE: {
    GENERATE_ROUTINE: '/marketingroutine/generate-groq/',
  },
  MARKETPLACE_DESCRIPTION: {
    GENERATE_DESCRIPTION: '/marketplacedescription/groq/',
  },
  MISSION_VISION_VALUES: {
    GENERATE_STATEMENTS: '/missionvisionvalues/groq/',
  },
  ONBOARDING_EMAILS: {
    GENERATE_EMAILS: '/onboardingemails/groq/',
  },
  OPTIN_DELIVERY_EMAIL: {
    GENERATE_EMAIL: '/optindeliveryemail/groq/',
  },
  OPTIN_EMAIL_IDEAS: {
    GENERATE_IDEAS: '/optinemailideas/groq/',
  },
  OPTIN_IDEAS: {
    GENERATE_IDEAS: '/optinideas/groq/',
  },
  OPTIN_PAGE_COPY: {
    GENERATE_COPY: '/optinpagecopy/groq/',
  },
  OPTIN_THANK_YOU_PAGE: {
    GENERATE_PAGE: '/optinthankyoupage/groq/',
  },
  PINTEREST_TITLES_DESCRIPTIONS: {
    GENERATE_PINS: '/pinteresttitles/groq/',
  },
  PODCAST_PITCH_PREP: {
    GENERATE_PITCH: '/podcastpitchprep/groq/',
  },
  POST_PURCHASE_EMAIL: {
    GENERATE_EMAIL: '/postpurchaseemail/groq/',
  },
  PRODUCT_COMMUNITY_POSTS: {
    GENERATE_POSTS: '/productcommunityposts/groq/',
  },
  PRODUCT_CUSTOMER_JOURNEY: {
    GENERATE_JOURNEY: '/productcustomerjourney/groq/',
  },
  PRODUCT_DESCRIPTION: {
    GENERATE_DESCRIPTION: '/productdescription/groq/',
  },
  PRODUCT_FREESTYLE: {
    GENERATE_CONTENT: '/productfreestyle/groq/',
  },
  PRODUCT_IDEAS: {
    GENERATE_IDEAS: '/productideas/groq/',
  },
  PRODUCT_KEYWORD_RESEARCH: {
    GENERATE_KEYWORDS: '/productkeywordresearch/groq/',
  },
  PRODUCT_NAME_IDEAS: {
    GENERATE_IDEAS: '/productnameideas/groq/',
  },
  PRODUCT_SUMMARY_GENERATOR: {
    GENERATE_SUMMARY: '/productsummarygenerator/groq/',
  },
  PRODUCTS: {
    LIST: '/products',
    CREATE: '/products',
    UPDATE: '/products',
    DELETE: '/products',
  },
  REPURPOSE_PODCAST: {
    GENERATE_ASSETS: '/repurposepodcast/groq/',
  },
  REPURPOSE_SUBSTACK: {
    GENERATE_CONTENT: '/repurposesubstack/groq/',
  },
  REPURPOSE_VIDEO: {
    GENERATE_ASSETS: '/repurposevideo/groq/',
  },
  SALES_EMAILS: {
    GENERATE_SEQUENCE: '/salesemails/groq/',
  },
  SALES_PAGE: {
    GENERATE_PAGE: '/salespage/groq/',
  },
  SELL_TRANSCRIPT_CONTENT: {
    GENERATE_CONTENT: '/selltranscriptcontent/groq/',
  },
  SEO_MAGIC: {
    GENERATE_OPTIMIZATION: '/seomagic/groq/',
  },
  SEO_PRODUCT_PAGE_DESC: {
    GENERATE_DESCRIPTION: '/seoproductpagedesc/groq/',
  },
  SERVICE_SALES_PAGE: {
    GENERATE_PAGE: '/servicesalespage/groq/',
  },
  SINGLE_CLICK_SALES_PAGE: {
    GENERATE_PAGE: '/singleclicksalespage/groq/',
  },
  SOCIAL_CONTENT_FROM_TRANSCRIPTS: {
    GENERATE_CONTENT: '/socialcontenttranscript/groq/',
  },
  SOCIAL_CONTENT_FROM_URL: {
    GENERATE_CONTENT: '/socialcontenturl/groq/',
  },
  SOCIAL_MEDIA_FREESTYLE: {
    GENERATE_CONTENT: '/socialmediafreestyle/groq/',
  },
  SOCIAL_POSTS: {
    GENERATE_POSTS: '/socialposts/groq/',
  },
  SPEAKER_TOPIC_IDEAS: {
    GENERATE_TOPICS: '/speakertopicideas/groq/',
  },
  STORY_BASED_EMAILS: {
    GENERATE_EMAILS: '/storybasedemails/groq/',
  },
  STORY_BASED_SOCIAL_POSTS: {
    GENERATE_POSTS: '/storybasedsocialposts/groq/',
  },
  SUBJECT_LINE_GENERATOR: {
    GENERATE_SUBJECT_LINES: '/subjectlinegenerator/groq/',
  },
  TRANSCRIPT_REWRITE: {
    GENERATE_CONTENT: '/transcriptrewrite/groq/',
  },
  TESTIMONIALS_TO_BENEFITS: {
    GENERATE_ANALYSIS: '/testimonialstobenefits/groq/',
  },
  TRANSCRIPT_FREESTYLE: {
    GENERATE_CONTENT: '/transcriptfreestyle/groq/',
  },
  VIDEO_SCRIPTS_FROM_TRANSCRIPTS: {
    GENERATE_SCRIPT: '/videoscriptsfromtranscripts/groq/',
  },

  VIDEO_SCRIPTS_IDEAS: {
    GENERATE_SCRIPTS: '/videoscriptsideas/groq/',
  },

  TRANSCRIPT_VISUALIZATION: {
    GENERATE_VISUALIZATION: '/transcriptvisualization/groq/',
  },

  WEBINAR_EMAIL: {
    GENERATE_EMAILS: '/webinaremail/groq/',
  },

  WEBPAGE_IMPROVER: {
    GENERATE_IMPROVEMENTS: '/webpageimprover/groq/',
  },

  WEBSITE_ABOUT_PAGE: {
    GENERATE_ABOUT_PAGE: '/websiteaboutpage/groq/',
  },

  WEBSITE_CATEGORY: {
    GENERATE_CATEGORY: '/websitecategory/groq/',
  },

  WEBSITE_CONTACT: {
    GENERATE_CONTACT: '/websitecontact/groq/',
  },

  WEBSITE_FAQS: {
    GENERATE_FAQS: '/websitefaqs/groq/',
  },

  WEBSITE_HOME_PAGE: {
    GENERATE_HOME_PAGE: '/websitehomepage/groq/',
  },

  WEBSITE_PILLAR_PAGE: {
    GENERATE_PILLAR_PAGE: '/websitepillarpage/websitepillarpage/groq/',
  },

  WEBSITE_SPEAKING_MEDIA_PAGE: {
    GENERATE_SPEAKING_MEDIA_PAGE: '/speakingmediapage/speakingmediapage/groq/',
  },

  WELCOME_SEQUENCE: {
    GENERATE_SEQUENCE: '/welcomesequence/welcomesequence/groq/',
  },

  WHOLESALE_INFORMATION: {
    GENERATE_INFORMATION: '/wholesaleinformation/wholesaleinformation/groq/',
  },

  WORD_BANK: {
    GENERATE_WORD_BANK: '/wordbank/wordbank/groq/',
  },

  TRAINING_MATERIALS: {
    GENERATE_MATERIALS: '/trainingmaterials/generate-groq/',
  },
  USER: {
    PROFILE: '/user/profile',
    SETTINGS: '/user/settings',
    PREFERENCES: '/user/preferences',
  },


  //this api come at 1st of the last row and inplement for to show the himanshu
  WEEKLY_CONTENT_ASSETS: {
    GENERATE_ASSETS: '/weeklycontentassets/weeklycontentassets/groq/',
  },

  
  // PINTEREST_TITLE_GENERATOR: {
  //   GENERATE_TITLES: '/pinteresttitlegenerator/groq/',
  // }
};

// Request/Response Types
const REQUEST_TYPES = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
};

// Common Headers
const COMMON_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Update MongoDB configuration to use environment variables
const MONGODB_CONFIG = {
  URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/',
  OPTIONS: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  }
};

module.exports = {
  API_CONFIG,
  ENDPOINTS,
  REQUEST_TYPES,
  COMMON_HEADERS,
  MONGODB_CONFIG
};
