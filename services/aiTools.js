import api from './api.js';
import { ENDPOINTS } from './config.js';

/**
 * AI Tools Service - Centralized API service for all AI-powered content generation tools
 * 
 * This file contains utility functions to reduce code duplication and improve maintainability:
 * 
 * UTILITY FUNCTIONS:
 * - validateRequiredFields: Validates that all required fields are present
 * - handleApiCall: Handles API calls with consistent error handling and logging
 * - sanitizeData: Removes empty/null/undefined values from data objects
 * - validateDataTypes: Validates data types for specific fields
 * - createApiCallWithRetry: Implements retry logic with exponential backoff
 * - enhancedApiCall: Advanced API call wrapper with multiple features
 * 
 * USAGE EXAMPLES:
 * 
 * Basic usage (current pattern):
 * validateRequiredFields(data, ['field1', 'field2'], 'functionName');
 * return handleApiCall(endpoint, data, 'functionName');
 * 
 * Enhanced usage with additional features:
 * return enhancedApiCall(endpoint, data, 'functionName', {
 *   validateTypes: true,
 *   fieldTypes: { field1: 'string', field2: 'number' },
 *   sanitize: true,
 *   retry: true,
 *   maxRetries: 3
 * });
 * 
 * All functions include comprehensive logging and error handling.
 */

// Utility functions for common operations
const validateRequiredFields = (data, requiredFields, functionName) => {
  const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
    console.error(`[${functionName}] Missing required fields: ${missingFields.join(', ')}`);
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
  console.log(`[${functionName}] Validation passed, all required fields present`);
};

const handleApiCall = async (endpoint, data, functionName) => {
  try {
    console.log(`[${functionName}] Calling API with data:`, data);
    console.log(`[${functionName}] Endpoint:`, endpoint);
    
    const response = await api.post(endpoint, data);
    console.log(`[${functionName}] API response:`, response.data);
      return response.data;
    } catch (error) {
    console.error(`[${functionName}] API call error:`, error.response?.data || error.message);
    console.error(`[${functionName}] Error details:`, JSON.stringify(error.response?.data || {}));
      throw error;
    }
};

// Additional utility functions for enhanced functionality
// const sanitizeData = (data) => {
//   // Remove empty strings, null, undefined values
//   const sanitized = {};
//   Object.keys(data).forEach(key => {
//     if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
//       sanitized[key] = data[key];
//     }
//   });
//   return sanitized;
// };

// const validateDataTypes = (data, fieldTypes, functionName) => {
//   const typeErrors = [];
//   Object.keys(fieldTypes).forEach(field => {
//     if (data[field] !== undefined && typeof data[field] !== fieldTypes[field]) {
//       typeErrors.push(`${field} should be ${fieldTypes[field]}, got ${typeof data[field]}`);
//     }
//   });
  
//   if (typeErrors.length > 0) {
//     console.error(`[${functionName}] Type validation errors:`, typeErrors);
//     throw new Error(`Type validation errors: ${typeErrors.join(', ')}`);
//   }
// };

const createApiCallWithRetry = async (endpoint, data, functionName, maxRetries = 3) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[${functionName}] Attempt ${attempt}/${maxRetries}`);
      return await handleApiCall(endpoint, data, functionName);
    } catch (error) {
      lastError = error;
      console.warn(`[${functionName}] Attempt ${attempt} failed:`, error.message);
      
      if (attempt < maxRetries) {
        // Wait before retrying (exponential backoff)
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
};

// Enhanced API call wrapper with additional features
const enhancedApiCall = async (endpoint, data, functionName, options = {}) => {
  const {
    validateTypes = false,
    fieldTypes = {},
    sanitize = true,
    retry = false,
    maxRetries = 3
  } = options;

  // Sanitize data if requested
  const processedData = sanitize ? sanitizeData(data) : data;
  
  // Validate field types if requested
  if (validateTypes && Object.keys(fieldTypes).length > 0) {
    validateDataTypes(processedData, fieldTypes, functionName);
  }
  
  // Use retry logic if requested
  if (retry) {
    return createApiCallWithRetry(endpoint, processedData, functionName, maxRetries);
  }
  
  return handleApiCall(endpoint, processedData, functionName);
};

// General AI Tools Services
export const aiToolsService = {
  
  // Abandoned Cart Sequence Generation
  generateAbandonedCartSequence: async (sequenceData) => {
    validateRequiredFields(sequenceData, ['business_type', 'product_service_name', 'target_audience', 'brand_personality_tone', 'email_1_timing', 'email_2_timing', 'email_3_timing'], 'generateAbandonedCartSequence');
    
    return handleApiCall(ENDPOINTS.ABANDONED_CART.GENERATE_SEQUENCE, sequenceData, 'generateAbandonedCartSequence');
  },

  // Affiliate Messaging Information Generation
  generateAffiliateMessagingInfo: async (messageData) => {
    validateRequiredFields(messageData, ['product_service_name', 'product_category', 'product_description', 'target_audience', 'main_benefits_outcomes'], 'generateAffiliateMessagingInfo');
    
    return handleApiCall(ENDPOINTS.AFFILIATE_MESSAGING.GENERATE_INFO, messageData, 'generateAffiliateMessagingInfo');
  },

  // Social Plan Generation
  generateSocialPlan: async (planData) => {
    validateRequiredFields(planData, ['business_type', 'industry', 'target_audience', 'primary_platforms', 'posting_schedule', 'content_goals', 'brand_personality_voice', 'preferred_content_types', 'content_themes_topics', 'engagement_strategy'], 'generateSocialPlan');
    
    return handleApiCall(ENDPOINTS.SOCIAL_MEDIA.GENERATE_30DAY_PLAN, planData, 'generateSocialPlan');
  },

  // Affiliate Email Swipes Generation
  generateAffiliateEmailSwipe: async (swipeData) => {
    validateRequiredFields(swipeData, ['product_name', 'brand_name', 'product_description', 'target_audience', 'key_benefits', 'unique_selling_points', 'email_type', 'affiliate_link', 'tone_of_voice', 'call_to_action'], 'generateAffiliateEmailSwipe');
    
    return handleApiCall(ENDPOINTS.AFFILIATE_EMAIL_SWIPES.GENERATE_SWIPE, swipeData, 'generateAffiliateEmailSwipe');
  },

  // Affiliate Product Details Generation
  generateAffiliateProductDetails: async (detailsData) => {
    validateRequiredFields(detailsData, ['product_name', 'brand_name', 'product_category', 'commission_rate', 'product_description', 'target_audience', 'key_features', 'benefits_value_proposition', 'pricing_information', 'special_offers', 'technical_specifications', 'support_information'], 'generateAffiliateProductDetails');
    
    return handleApiCall(ENDPOINTS.AFFILIATE_PRODUCT_DETAILS.GENERATE_DETAILS, detailsData, 'generateAffiliateProductDetails');
  },

  // Affiliate Social Swipes Generation
  generateAffiliateSocialSwipes: async (swipesData) => {
    validateRequiredFields(swipesData, ['product_name', 'brand_name', 'product_description', 'target_platform', 'campaign_objective', 'target_audience', 'key_benefits_features', 'post_tone', 'call_to_action', 'hashtag_strategy', 'social_proof', 'visual_content_suggestions'], 'generateAffiliateSocialSwipes');
    
    return handleApiCall(ENDPOINTS.AFFILIATE_SOCIAL_SWIPES.GENERATE_SWIPES, swipesData, 'generateAffiliateSocialSwipes');
  },

  // Affiliate Promo Ideas Generation
  generateAffiliatePromoIdeas: async (ideasData) => {
    validateRequiredFields(ideasData, ['product_name', 'product_type', 'product_description', 'target_audience', 'key_benefits_value_points', 'unique_selling_points', 'promotion_type', 'campaign_duration', 'special_offers_incentives', 'content_formats', 'affiliate_commission', 'brand_guidelines_requirements'], 'generateAffiliatePromoIdeas');
    
    return handleApiCall(ENDPOINTS.AFFILIATE_PROMO_IDEAS.GENERATE_IDEAS, ideasData, 'generateAffiliatePromoIdeas');
  },

  // Amazon Description Generation
  generateAmazonDescription: async (descriptionData) => {
    validateRequiredFields(descriptionData, ['product_name', 'product_category', 'product_description', 'key_features', 'main_benefits', 'unique_selling_points', 'target_audience', 'product_use_cases', 'specifications', 'keywords_for_seo'], 'generateAmazonDescription');
    
    return handleApiCall(ENDPOINTS.AMAZON_DESCRIPTION.GENERATE_DESCRIPTION, descriptionData, 'generateAmazonDescription');
  },

  // Blog Content from Transcript Generation
  generateBlogFromTranscript: async (blogData) => {
    validateRequiredFields(blogData, ['transcript', 'content_type', 'desired_blog_length', 'target_audience', 'content_purpose', 'key_topics_to_highlight', 'blog_tone', 'brand_voice', 'seo_keywords', 'call_to_action'], 'generateBlogFromTranscript');
    
    return handleApiCall(ENDPOINTS.BLOG_FROM_TRANSCRIPT.GENERATE_CONTENT, blogData, 'generateBlogFromTranscript');
  },

  // Blog Generator
  generateBlogPost: async (blogData) => {
    validateRequiredFields(blogData, ['blog_topic', 'blog_type', 'blog_length', 'target_audience', 'blog_tone', 'key_points_to_cover', 'seo_keywords', 'brand_voice', 'call_to_action'], 'generateBlogPost');
    
    return handleApiCall(ENDPOINTS.BLOG_GENERATOR.GENERATE_BLOG, blogData, 'generateBlogPost');
  },

  // Blog Posts Strategy Generation
  generateBlogPosts: async (postsData) => {
    validateRequiredFields(postsData, ['product_service', 'business_type', 'focus_stage', 'target_audience', 'content_goals', 'brand_voice', 'content_frequency'], 'generateBlogPosts');
    
    return handleApiCall(ENDPOINTS.BLOG_POSTS.GENERATE_POSTS, postsData, 'generateBlogPosts');
  },

  // Blog Promo Generation
  generateBlogPromo: async (promoData) => {
    validateRequiredFields(promoData, ['blog_post_title', 'blog_post_summary', 'target_audience', 'main_takeaways', 'call_to_action', 'tone_of_voice', 'content_length', 'preferred_channels'], 'generateBlogPromo');
    
    return handleApiCall(ENDPOINTS.BLOG_PROMO.GENERATE_PROMO, promoData, 'generateBlogPromo');
  },

  // Brand Bios Generation
  generateBrandBios: async (biosData) => {
    validateRequiredFields(biosData, ['brand_name', 'brand_mission', 'founding_story', 'key_values', 'unique_selling_points', 'target_audience', 'achievements', 'brand_personality', 'bio_tone', 'bio_length'], 'generateBrandBios');
    
    return handleApiCall(ENDPOINTS.BRAND_BIOS.GENERATE_BIOS, biosData, 'generateBrandBios');
  },

  // Brand Emails Generation
  generateBrandEmails: async (emailsData) => {
    validateRequiredFields(emailsData, ['brand_name', 'email_purpose', 'brand_story', 'mission_statement', 'brand_values', 'company_history', 'tone_of_voice', 'email_length'], 'generateBrandEmails');
    
    return handleApiCall(ENDPOINTS.BRAND_EMAILS.GENERATE_EMAILS, emailsData, 'generateBrandEmails');
  },

  // Brand Keywords Generation
  generateBrandKeywords: async (keywordsData) => {
    validateRequiredFields(keywordsData, ['brand_name', 'business_type', 'industry', 'keyword_focus', 'target_audience', 'products_services', 'brand_values', 'main_competitors', 'content_goals'], 'generateBrandKeywords');
    
    return handleApiCall(ENDPOINTS.BRAND_KEYWORDS.GENERATE_KEYWORDS, keywordsData, 'generateBrandKeywords');
  },

  // Brand Social Content Generation
  generateBrandSocial: async (socialData) => {
    validateRequiredFields(socialData, ['brand_name', 'business_type', 'brand_story', 'brand_values', 'brand_personality', 'content_tone', 'unique_selling_point', 'target_audience', 'content_pillars', 'social_media_goals'], 'generateBrandSocial');
    
    return handleApiCall(ENDPOINTS.BRAND_SOCIAL.GENERATE_CONTENT, socialData, 'generateBrandSocial');
  },

  // Bump Copy Generation
  generateBumpCopy: async (bumpData) => {
    validateRequiredFields(bumpData, ['main_product_service', 'main_product_price', 'target_audience', 'bump_offer_product_service', 'bump_offer_price', 'offer_type', 'bump_offer_value', 'main_benefit_hook', 'urgency_element', 'guarantee_element'], 'generateBumpCopy');
    
    return handleApiCall(ENDPOINTS.BUMP_COPY.GENERATE_COPY, bumpData, 'generateBumpCopy');
  },

  // Buyer Persona Generation
  generateBuyerPersona: async (personaData) => {
    validateRequiredFields(personaData, ['persona_name', 'product_service', 'demographics', 'psychographics', 'goals_motivations', 'pain_points', 'buying_behavior', 'preferred_channels', 'common_objections', 'influences'], 'generateBuyerPersona');
    
    return handleApiCall(ENDPOINTS.BUYER_PERSONA.GENERATE_PERSONA, personaData, 'generateBuyerPersona');
  },
  // Carousel Content Freestyle Generation
  generateCarouselFreestyle: async (carouselData) => {
    validateRequiredFields(carouselData, ['carousel_goal', 'carousel_type', 'content_style', 'brand_voice', 'visual_style', 'call_to_action', 'platform', 'number_of_slides', 'main_topic', 'target_audience'], 'generateCarouselFreestyle');
    
    return handleApiCall(ENDPOINTS.CAROUSEL_FREESTYLE.GENERATE_CAROUSEL, carouselData, 'generateCarouselFreestyle');
  },
  // Carousel Ideas Generation
  generateCarouselIdeas: async (carouselData) => {
    validateRequiredFields(carouselData, ['carousel_topic', 'industry', 'target_audience', 'content_pillars', 'brand_tone', 'number_of_slides', 'visual_style_preferences', 'call_to_action', 'content_goals'], 'generateCarouselIdeas');
    
    return handleApiCall(ENDPOINTS.CAROUSEL_IDEAS.GENERATE_IDEAS, carouselData, 'generateCarouselIdeas');
  },

  // Checkout Page Generation
  generateCheckoutPage: async (checkoutData) => {
    validateRequiredFields(checkoutData, ['product_service_name', 'product_type', 'price', 'page_style', 'product_description', 'main_benefits', 'urgency_scarcity', 'guarantees', 'testimonials', 'trust_signals'], 'generateCheckoutPage');
    
    return handleApiCall(ENDPOINTS.CHECKOUT_PAGE.GENERATE_PAGE, checkoutData, 'generateCheckoutPage');
  },

  // Content Ideas Generation
  generateContentIdeas: async (contentData) => {
    validateRequiredFields(contentData, ['content_topic', 'industry', 'content_goal', 'preferred_format', 'target_audience', 'brand_values', 'audience_problems', 'unique_angle', 'content_frequency', 'competitor_analysis'], 'generateContentIdeas');
    
    return handleApiCall(ENDPOINTS.CONTENT_IDEAS.GENERATE_IDEAS, contentData, 'generateContentIdeas');
  },
  
  // Example: Generate content
  generateContent: async (contentData) => {
    const response = await api.post('/content/generate/', contentData);
    return response.data;
  },

  // Example: Analyze text
  analyzeText: async (textData) => {
    const response = await api.post('/analysis/text/', textData);
    return response.data;
  },

  // Example: Get tool history
  getToolHistory: async (toolType) => {
    const response = await api.get(`/tools/history/${toolType}/`);
    return response.data;
  },

  // Example: Save generated content
  saveContent: async (contentData) => {
    const response = await api.post('/content/save/', contentData);
    return response.data;
  },

  // Example: Export content
  exportContent: async (contentId, format) => {
    const response = await api.get(`/content/export/${contentId}/`, {
      params: { format },
      responseType: 'blob' // For file downloads
    });
  return response.data;
  },

  // Content Outline Generation
  generateContentOutline: async (outlineData) => {
    validateRequiredFields(outlineData, ['content_title', 'content_type', 'expected_length', 'main_objective', 'target_audience', 'tone_of_voice', 'content_structure', 'key_points', 'keywords', 'call_to_action'], 'generateContentOutline');
    
    return handleApiCall(ENDPOINTS.CONTENT_OUTLINE.GENERATE_OUTLINE, outlineData, 'generateContentOutline');
  },

  // Content Pillars Generation
  generateContentPillars: async (pillarsData) => {
    validateRequiredFields(pillarsData, ['business_name', 'industry', 'business_description', 'target_audience', 'brand_values', 'areas_of_expertise', 'content_goals', 'audience_problems', 'unique_value_proposition', 'main_competitors'], 'generateContentPillars');
    
    return handleApiCall(ENDPOINTS.CONTENT_PILLARS.GENERATE_PILLARS, pillarsData, 'generateContentPillars');
  },

  // Content Repurposer Generation
  generateContentRepurposed: async (repurposeData) => {
    validateRequiredFields(repurposeData, ['original_content_type', 'original_platform', 'original_content', 'target_platforms', 'content_goal', 'preferred_content_length', 'key_messages', 'target_audience', 'tone_of_voice', 'call_to_action'], 'generateContentRepurposed');
    
    return handleApiCall(ENDPOINTS.CONTENT_REPURPOSER.GENERATE_REPURPOSED, repurposeData, 'generateContentRepurposed');
  },

  // Customer Jobs Generation
  generateCustomerJobs: async (jobsData) => {
    validateRequiredFields(jobsData, ['industry', 'product_service_type', 'product_service_description', 'target_customer', 'customer_goals', 'customer_challenges', 'jobs_context', 'functional_jobs', 'emotional_jobs', 'social_jobs'], 'generateCustomerJobs');
    
    return handleApiCall(ENDPOINTS.CUSTOMER_JOBS.GENERATE_JOBS, jobsData, 'generateCustomerJobs');
  },

  // Customer Journey Generation
  generateCustomerJourney: async (journeyData) => {
    validateRequiredFields(journeyData, ['industry', 'product_service_type', 'product_service_description'], 'generateCustomerJourney');
    
    return handleApiCall(ENDPOINTS.CUSTOMER_JOURNEY.GENERATE_JOURNEY, journeyData, 'generateCustomerJourney');
  },

  // Customer Overview Generation
  generateCustomerOverview: async (overviewData) => {
    validateRequiredFields(overviewData, ['industry', 'business_size', 'primary_product_service_category'], 'generateCustomerOverview');
    
    return handleApiCall(ENDPOINTS.CUSTOMER_OVERVIEW.GENERATE_OVERVIEW, overviewData, 'generateCustomerOverview');
  },

  // Customer Research Generation
  generateCustomerResearch: async (researchData) => {
    validateRequiredFields(researchData, ['research_topic', 'target_audience', 'research_questions'], 'generateCustomerResearch');
    
    return handleApiCall(ENDPOINTS.CUSTOMER_RESEARCH.GENERATE_RESEARCH, researchData, 'generateCustomerResearch');
  },

  // Customer Segment Sales Page Generation
  generateCustomerSegmentSalesPage: async (salesData) => {
    validateRequiredFields(salesData, ['product_service', 'customer_segment', 'key_features_benefits', 'segment_demographics', 'segment_pain_points', 'segment_goals', 'unique_value_proposition', 'social_proof', 'objections', 'call_to_action'], 'generateCustomerSegmentSalesPage');
    
    return handleApiCall(ENDPOINTS.CUSTOMER_SEGMENT_SALES.GENERATE_SALES_PAGE, salesData, 'generateCustomerSegmentSalesPage');
  },

  // Digital Product Description Generation
  generateDigitalProductDescription: async (descriptionData) => {
    validateRequiredFields(descriptionData, ['product_name', 'product_type', 'product_overview', 'key_features', 'delivery_method', 'price_point', 'target_customer', 'main_benefits', 'unique_value_proposition'], 'generateDigitalProductDescription');
    
    return handleApiCall(ENDPOINTS.DIGITAL_PRODUCT_DESCRIPTION.GENERATE_DESCRIPTION, descriptionData, 'generateDigitalProductDescription');
  },

  // Digital Product Sales Page Generation
  generateDigitalProductSalesPage: async (salesData) => {
    validateRequiredFields(salesData, ['product_name', 'product_type', 'product_description'], 'generateDigitalProductSalesPage');
    
    return handleApiCall(ENDPOINTS.DIGITAL_PRODUCT_SALES_PAGE.GENERATE_SALES_PAGE, salesData, 'generateDigitalProductSalesPage');
  },

  // Training Materials Generation
  generateTrainingMaterials: async (trainingData) => {
    validateRequiredFields(trainingData, ['training_topic', 'target_audience', 'learning_objectives'], 'generateTrainingMaterials');
    
    return handleApiCall(ENDPOINTS.TRAINING_MATERIALS.GENERATE_MATERIALS, trainingData, 'generateTrainingMaterials');
  },

  // Ecommerce Social Media Posts Generation
  generateEcommercePosts: async (postData) => {
    validateRequiredFields(postData, ['product_name', 'product_type', 'product_description', 'target_audience', 'key_features_benefits', 'content_tone', 'platform', 'post_type'], 'generateEcommercePosts');
    
    return handleApiCall(ENDPOINTS.ECOMMERCE_POSTS.GENERATE_POSTS, postData, 'generateEcommercePosts');
  },

  // Emails & Lead Magnets Generation
  generateEmailsLeadMagnets: async (contentData) => {
    validateRequiredFields(contentData, ['transcript_content', 'content_type', 'target_audience', 'industry_niche', 'tone_style', 'call_to_action', 'key_takeaways', 'email_subject_lines', 'lead_magnet_type'], 'generateEmailsLeadMagnets');
    
    return handleApiCall(ENDPOINTS.EMAILS_LEAD_MAGNETS.GENERATE_CONTENT, contentData, 'generateEmailsLeadMagnets');
  },

  // Email Newsletter Generation
  generateEmailNewsletter: async (newsletterData) => {
    validateRequiredFields(newsletterData, ['newsletter_name', 'company_brand_name', 'industry', 'newsletter_frequency', 'target_audience', 'newsletter_goal', 'content_type_focus', 'main_topics', 'tone_of_voice', 'primary_call_to_action'], 'generateEmailNewsletter');
    
    return handleApiCall(ENDPOINTS.EMAIL_NEWSLETTER.GENERATE_NEWSLETTER, newsletterData, 'generateEmailNewsletter');
  },

  // Etsy Ecommerce Description Generation
  generateEtsyDescription: async (descriptionData) => {
    validateRequiredFields(descriptionData, ['product_name', 'product_type', 'digital_format', 'product_category', 'target_audience', 'product_features', 'product_benefits', 'usage_instructions', 'seo_keywords', 'tone_of_voice'], 'generateEtsyDescription');
    
    return handleApiCall(ENDPOINTS.ETSY_ECOMMERCE_DESCRIPTION.GENERATE_DESCRIPTION, descriptionData, 'generateEtsyDescription');
  },

  // Event Promotion Emails Generation
  generateEventPromotionEmails: async (emailData) => {
    validateRequiredFields(emailData, ['event_name', 'event_type', 'event_date', 'location_platform', 'target_audience', 'key_benefits_features', 'organizer_host', 'registration_fee', 'email_type', 'urgency_factor', 'tone_of_voice'], 'generateEventPromotionEmails');
    
    return handleApiCall(ENDPOINTS.EVENT_PROMOTION_EMAILS.GENERATE_EMAILS, emailData, 'generateEventPromotionEmails');
  },

  // Facebook Ads Generation
  generateFacebookAds: async (adsData) => {
    validateRequiredFields(adsData, ['campaign_objective', 'ad_format', 'target_audience', 'product_service', 'key_benefits_value_proposition', 'call_to_action'], 'generateFacebookAds');
    
    return handleApiCall(ENDPOINTS.FACEBOOK_ADS.GENERATE_ADS, adsData, 'generateFacebookAds');
  },

  // Freestyle Content Generation
  generateFreestyleContent: async (contentData) => {
    validateRequiredFields(contentData, ['content_title', 'content_type', 'tone_style', 'target_audience', 'content_purpose', 'key_points', 'content_length'], 'generateFreestyleContent');
    
    return handleApiCall(ENDPOINTS.FREESTYLE_CONTENT.GENERATE_CONTENT, contentData, 'generateFreestyleContent');
  },

  // Funnel Content Generation
  generateFunnelContent: async (funnelData) => {
    validateRequiredFields(funnelData, ['page_url', 'funnel_stage', 'content_type', 'target_audience', 'content_goal', 'tone_style', 'primary_call_to_action', 'key_messages'], 'generateFunnelContent');
    
    return handleApiCall(ENDPOINTS.FUNNEL_CONTENT.GENERATE_CONTENT, funnelData, 'generateFunnelContent');
  },

  // Group Community Content Ideas Generation
  generateGroupCommunityContentIdeas: async (ideasData) => {
    validateRequiredFields(ideasData, ['community_name', 'community_type', 'community_purpose', 'target_audience', 'engagement_goals', 'community_size', 'content_themes_topics', 'posting_frequency'], 'generateGroupCommunityContentIdeas');
    
    return handleApiCall(ENDPOINTS.GROUP_COMMUNITY_CONTENT_IDEAS.GENERATE_IDEAS, ideasData, 'generateGroupCommunityContentIdeas');
  },

  // Freestyle SEO Generation
  generateFreestyleSEO: async (seoData) => {
    validateRequiredFields(seoData, ['page_type', 'page_description', 'primary_keyword', 'target_audience', 'business_type', 'content_focus'], 'generateFreestyleSEO');
    
    return handleApiCall(ENDPOINTS.FREESTYLE_SEO.GENERATE_SEO, seoData, 'generateFreestyleSEO');
  },

  // Customer Problems Generation
  generateCustomerProblems: async (problemsData) => {
    validateRequiredFields(problemsData, ['product_service', 'industry', 'target_customer', 'customer_goals', 'current_situation', 'known_pain_points', 'problem_urgency'], 'generateCustomerProblems');
    
    return handleApiCall(ENDPOINTS.CUSTOMER_PROBLEMS.GENERATE_PROBLEMS, problemsData, 'generateCustomerProblems');
  },

  // Marketing Routine Generation
  generateMarketingRoutine: async (routineData) => {
    validateRequiredFields(routineData, ['primary_business_goal', 'business_type', 'target_audience', 'time_available', 'marketing_experience', 'current_marketing_channels', 'biggest_marketing_challenge'], 'generateMarketingRoutine');
    
    return handleApiCall(ENDPOINTS.MARKETING_ROUTINE.GENERATE_ROUTINE, routineData, 'generateMarketingRoutine');
  },

  // Marketplace Description Generation
  generateMarketplaceDescription: async (descriptionData) => {
    validateRequiredFields(descriptionData, ['product_name', 'product_category', 'target_marketplace', 'product_type', 'key_features', 'benefits_value', 'target_customer', 'unique_selling_point'], 'generateMarketplaceDescription');
    
    return handleApiCall(ENDPOINTS.MARKETPLACE_DESCRIPTION.GENERATE_DESCRIPTION, descriptionData, 'generateMarketplaceDescription');
  },

  // Mission Vision Values Generation
  generateMissionVisionValues: async (valuesData) => {
    validateRequiredFields(valuesData, ['business_name', 'industry', 'target_audience', 'business_purpose', 'social_impact', 'core_values', 'future_goals', 'unique_strengths', 'brand_personality'], 'generateMissionVisionValues');
    
    return handleApiCall(ENDPOINTS.MISSION_VISION_VALUES.GENERATE_STATEMENTS, valuesData, 'generateMissionVisionValues');
  },

  // Onboarding Emails Generation
  generateOnboardingEmails: async (emailData) => {
    validateRequiredFields(emailData, ['product_service_name', 'product_type', 'key_features_benefits', 'onboarding_goals', 'customer_type', 'onboarding_timeframe', 'support_resources', 'success_metrics', 'next_steps_cta'], 'generateOnboardingEmails');
    
    return handleApiCall(ENDPOINTS.ONBOARDING_EMAILS.GENERATE_EMAILS, emailData, 'generateOnboardingEmails');
  },

  // Opt-In Delivery Email Generation
  generateOptInDeliveryEmail: async (emailData) => {
    validateRequiredFields(emailData, ['lead_magnet_title', 'lead_magnet_type', 'delivery_method', 'brand_name', 'target_audience', 'tone_style', 'value_proposition', 'next_steps', 'include_welcome_message', 'include_usage_tips', 'additional_resources'], 'generateOptInDeliveryEmail');
    
    return handleApiCall(ENDPOINTS.OPTIN_DELIVERY_EMAIL.GENERATE_EMAIL, emailData, 'generateOptInDeliveryEmail');
  },

  // Opt-In Email Ideas Generation
  generateOptInEmailIdeas: async (ideasData) => {
    validateRequiredFields(ideasData, ['business_type', 'industry', 'target_audience', 'email_frequency', 'tone_style', 'current_business_goals', 'email_objectives', 'content_topics', 'include_promotional_ideas', 'include_educational_content', 'brand_values'], 'generateOptInEmailIdeas');
    
    return handleApiCall(ENDPOINTS.OPTIN_EMAIL_IDEAS.GENERATE_IDEAS, ideasData, 'generateOptInEmailIdeas');
  },

  // Opt-In Ideas Generation
  generateOptInIdeas: async (ideasData) => {
    validateRequiredFields(ideasData, ['business_type', 'industry', 'target_audience', 'business_goals', 'current_challenges', 'content_format', 'delivery_method', 'content_depth', 'lead_magnet_type', 'unique_value_proposition'], 'generateOptInIdeas');
    
    return handleApiCall(ENDPOINTS.OPTIN_IDEAS.GENERATE_IDEAS, ideasData, 'generateOptInIdeas');
  },

  // Opt-In Page Copy Generation
  generateOptInPageCopy: async (copyData) => {
    validateRequiredFields(copyData, ['lead_magnet_title', 'lead_magnet_type', 'target_audience', 'main_benefit', 'pain_point_addressed', 'key_features', 'brand_tone', 'urgency_factor', 'page_goal', 'cta_text', 'social_proof'], 'generateOptInPageCopy');
    
    return handleApiCall(ENDPOINTS.OPTIN_PAGE_COPY.GENERATE_COPY, copyData, 'generateOptInPageCopy');
  },

  // Opt-In Thank You Page Generation
  generateOptInThankYouPage: async (pageData) => {
    validateRequiredFields(pageData, ['lead_magnet_title', 'lead_magnet_type', 'delivery_method', 'brand_name', 'how_to_access_instructions', 'next_steps', 'tone_of_voice', 'page_style'], 'generateOptInThankYouPage');
    
    return handleApiCall(ENDPOINTS.OPTIN_THANK_YOU_PAGE.GENERATE_PAGE, pageData, 'generateOptInThankYouPage');
  },

  // Pinterest Titles & Descriptions Generation
  generatePinterestTitlesDescriptions: async (pinterestData) => {
    validateRequiredFields(pinterestData, ['primary_keyword', 'secondary_keywords', 'target_audience', 'pin_style', 'tone_of_voice', 'brand_name', 'call_to_action', 'web_page_url', 'content_type', 'number_of_pins'], 'generatePinterestTitlesDescriptions');
    
    return handleApiCall(ENDPOINTS.PINTEREST_TITLES_DESCRIPTIONS.GENERATE_PINS, pinterestData, 'generatePinterestTitlesDescriptions');
  },

  // Podcast Pitch Prep Generation
  generatePodcastPitchPrep: async (pitchData) => {
    validateRequiredFields(pitchData, ['podcast_name', 'host_name', 'podcast_niche', 'audience_size', 'expertise_background', 'proposed_topic', 'unique_value', 'personal_story', 'available_dates', 'call_to_action'], 'generatePodcastPitchPrep');
    
    return handleApiCall(ENDPOINTS.PODCAST_PITCH_PREP.GENERATE_PITCH, pitchData, 'generatePodcastPitchPrep');
  },

  // Post Purchase Email Generation
  generatePostPurchaseEmail: async (emailData) => {
    validateRequiredFields(emailData, ['product_service_name', 'product_type', 'customer_name', 'email_tone', 'purchase_details', 'access_instructions', 'next_steps', 'support_contact', 'include_onboarding', 'additional_resources'], 'generatePostPurchaseEmail');
    
    return handleApiCall(ENDPOINTS.POST_PURCHASE_EMAIL.GENERATE_EMAIL, emailData, 'generatePostPurchaseEmail');
  },

  // Product Customer Journey Generation
  generateProductCustomerJourney: async (journeyData) => {
    validateRequiredFields(journeyData, ['product_name', 'product_category', 'product_description', 'target_customer', 'price_range', 'customer_goals', 'customer_pain_points', 'awareness_stage', 'consideration_stage', 'decision_stage', 'post_purchase_experience'], 'generateProductCustomerJourney');
    
    return handleApiCall(ENDPOINTS.PRODUCT_CUSTOMER_JOURNEY.GENERATE_JOURNEY, journeyData, 'generateProductCustomerJourney');
  },

  // Product Description Generation
  generateProductDescription: async (descriptionData) => {
    validateRequiredFields(descriptionData, ['product_name', 'product_type', 'platform_website', 'description_length', 'target_audience', 'key_features', 'main_benefits', 'unique_selling_points', 'use_cases', 'tone_of_voice', 'specifications'], 'generateProductDescription');
    
    return handleApiCall(ENDPOINTS.PRODUCT_DESCRIPTION.GENERATE_DESCRIPTION, descriptionData, 'generateProductDescription');
  },

  // Product Freestyle Generation
  generateProductFreestyle: async (freestyleData) => {
    validateRequiredFields(freestyleData, ['product_name', 'product_type', 'product_description', 'request_type', 'content_format', 'specific_request', 'target_audience', 'brand_tone', 'desired_outcome', 'additional_context'], 'generateProductFreestyle');
    
    return handleApiCall(ENDPOINTS.PRODUCT_FREESTYLE.GENERATE_CONTENT, freestyleData, 'generateProductFreestyle');
  },

  // Product Community Posts Generation
  generateProductCommunityPosts: async (postsData) => {
    validateRequiredFields(postsData, ['product_name', 'product_type', 'product_description', 'community_type', 'community_size', 'post_type', 'post_frequency', 'audience_demographics', 'engagement_goals', 'content_themes', 'call_to_action'], 'generateProductCommunityPosts');
    
    return handleApiCall(ENDPOINTS.PRODUCT_COMMUNITY_POSTS.GENERATE_POSTS, postsData, 'generateProductCommunityPosts');
  },

  // Product Ideas Generation
  generateProductIdeas: async (ideasData) => {
    validateRequiredFields(ideasData, ['skills_experience', 'industry_niche', 'preferred_business_model', 'target_audience', 'problems_to_solve', 'market_trends', 'personal_interests', 'investment_level', 'time_commitment', 'unique_strengths', 'competitor_research'], 'generateProductIdeas');
    
    return handleApiCall(ENDPOINTS.PRODUCT_IDEAS.GENERATE_IDEAS, ideasData, 'generateProductIdeas');
  },

  // Product Keyword Research Generation
  generateProductKeywordResearch: async (keywordData) => {
    validateRequiredFields(keywordData, ['product_name', 'product_category', 'product_description', 'key_features_benefits', 'primary_keywords', 'target_audience', 'search_intent', 'keyword_difficulty_preference', 'content_goals'], 'generateProductKeywordResearch');
    
    return handleApiCall(ENDPOINTS.PRODUCT_KEYWORD_RESEARCH.GENERATE_KEYWORDS, keywordData, 'generateProductKeywordResearch');
  },

  // Product Name Ideas Generation
  generateProductNameIdeas: async (ideasData) => {
    validateRequiredFields(ideasData, ['product_type','name_style_preference','product_description','target_audience','brand_personality_tone','key_features_benefits','keywords_to_include','competitor_names','words_to_avoid'], 'generateProductNameIdeas');
    
    return handleApiCall(ENDPOINTS.PRODUCT_NAME_IDEAS.GENERATE_IDEAS, ideasData, 'generateProductNameIdeas');
  },

  // Product Summary Generation
  generateProductSummary: async (summaryData) => {
    validateRequiredFields(summaryData, ['product_name','product_type','key_features','key_benefits','target_audience','use_cases','unique_value_proposition','summary_length','platform_use_case','tone_style'], 'generateProductSummary');
    
    return handleApiCall(ENDPOINTS.PRODUCT_SUMMARY_GENERATOR.GENERATE_SUMMARY, summaryData, 'generateProductSummary');
  },

  // Repurpose Video Generation
  generateRepurposeVideo: async (videoData) => {
    validateRequiredFields(videoData, ['content_type','video_duration','video_title_topic','transcript_text','key_topics_covered','main_takeaways_insights','target_audience','call_to_action','repurposing_goals'], 'generateRepurposeVideo');
    
    return handleApiCall(ENDPOINTS.REPURPOSE_VIDEO.GENERATE_ASSETS, videoData, 'generateRepurposeVideo');
  },

  // Repurpose Podcast Generation
  generateRepurposePodcast: async (podcastData) => {
    validateRequiredFields(podcastData, ['podcast_format','episode_duration','episode_title_topic','podcast_transcript','key_topics_themes','guest_information','main_insights_value_points','quotable_content_soundbites','target_audience','repurpose_goals'], 'generateRepurposePodcast');
    
    return handleApiCall(ENDPOINTS.REPURPOSE_PODCAST.GENERATE_ASSETS, podcastData, 'generateRepurposePodcast');
  },

  // Sales Emails Generation
  generateSalesEmails: async (emailData) => {
    validateRequiredFields(emailData, ['product_service_type','campaign_type','product_service_description','target_audience','main_benefits_value_proposition','customer_pain_points_challenges','email_types_to_include','call_to_action','promotion_offer_details'], 'generateSalesEmails');
    
    // Convert sequence_length to number if it exists, otherwise set default
    const processedData = {
      ...emailData,
      sequence_length: emailData.sequence_length ? parseInt(emailData.sequence_length) : 5
    };
    
    return handleApiCall(ENDPOINTS.SALES_EMAILS.GENERATE_SEQUENCE, processedData, 'generateSalesEmails');
  },

  // Sales Page Generation
  generateSalesPage: async (pageData) => {
    validateRequiredFields(pageData, ['product_service_type','sales_page_style','product_service_description','target_audience','main_problem_pain_point','solution_key_benefits','unique_value_proposition','social_proof_testimonials','pricing_offer_details','guarantee_risk_reversal'], 'generateSalesPage');
    
    return handleApiCall(ENDPOINTS.SALES_PAGE.GENERATE_PAGE, pageData, 'generateSalesPage');
  },

  // Repurpose Substack Generation
  generateRepurposeSubstack: async (substackData) => {
    validateRequiredFields(substackData, ['content_type','target_length','original_content','substack_audience','content_goal','substack_tone','community_elements','engagement_strategy'], 'generateRepurposeSubstack');
    
    return handleApiCall(ENDPOINTS.REPURPOSE_SUBSTACK.GENERATE_CONTENT, substackData, 'generateRepurposeSubstack');
  },

  // Weekly Content Assets Generation
  generateWeeklyContentAssets: async (assetsData) => {
    validateRequiredFields(assetsData, ['business_name','industry','primary_content_type','target_audience','brand_tone_voice','content_goals','weekly_themes_topics','primary_platforms','content_mix'], 'generateWeeklyContentAssets');
    
    return handleApiCall(ENDPOINTS.WEEKLY_CONTENT_ASSETS.GENERATE_ASSETS, assetsData, 'generateWeeklyContentAssets');
  },

  // Sell Transcript Content Generation
  generateSellTranscriptContent: async (contentData) => {
    validateRequiredFields(contentData, [
      'transcript_type',
      'content_purpose', 
      'transcript_content',
      'target_audience',
      'monetization_goals',
      'platforms_to_sell_on',
      'content_format',
      'content_length',
      'content_tone',
      'additional_context'
    ], 'generateSellTranscriptContent');
    
    return handleApiCall(ENDPOINTS.SELL_TRANSCRIPT_CONTENT.GENERATE_CONTENT, contentData, 'generateSellTranscriptContent');
  },

  // SEO Magic Generation
  generateSEOMagic: async (seoData) => {
    validateRequiredFields(seoData, [
      'content_type',
      'content_length',
      'original_content',
      'target_keywords',
      'seo_goals',
      'competitive_difficulty',
      'target_audience',
      'content_tone',
      'additional_context'
    ], 'generateSEOMagic');
    
    return handleApiCall(ENDPOINTS.SEO_MAGIC.GENERATE_OPTIMIZATION, seoData, 'generateSEOMagic');
  },

  // SEO Product Page Description Generation
  generateSEOProductPageDesc: async (productData) => {
    validateRequiredFields(productData, [
      'product_name',
      'product_category',
      'product_description'
    ], 'generateSEOProductPageDesc');
    
    return handleApiCall(ENDPOINTS.SEO_PRODUCT_PAGE_DESC.GENERATE_DESCRIPTION, productData, 'generateSEOProductPageDesc');
  },

  // Service Sales Page Generation
  generateServiceSalesPage: async (salesData) => {
    validateRequiredFields(salesData, [
      'service_type',
      'service_name',
      'service_description',
      'target_client_profile',
      'service_delivery_method',
      'pricing_model',
      'service_outcomes_results',
      'service_process',
      'competitive_advantage',
      'client_testimonials'
    ], 'generateServiceSalesPage');
    
    return handleApiCall(ENDPOINTS.SERVICE_SALES_PAGE.GENERATE_PAGE, salesData, 'generateServiceSalesPage');
  },

  // Single Click Sales Page Generation
  generateSingleClickSalesPage: async (salesData) => {
    validateRequiredFields(salesData, [
      'product_name',
      'product_type',
      'product_description',
      'target_audience',
      'main_benefit',
      'key_features',
      'pricing',
      'call_to_action'
    ], 'generateSingleClickSalesPage');
    
    return handleApiCall(ENDPOINTS.SINGLE_CLICK_SALES_PAGE.GENERATE_PAGE, salesData, 'generateSingleClickSalesPage');
  },

  // Social Content from Transcripts Generation
  generateSocialContentFromTranscripts: async (contentData) => {
    validateRequiredFields(contentData, [
      'transcript_type',
      'content_format',
      'transcript_content',
      'target_platforms',
      'content_goals',
      'target_audience',
      'brand_tone',
      'content_length',
      'call_to_action',
      'hashtag_strategy'
    ], 'generateSocialContentFromTranscripts');
    
    return handleApiCall(ENDPOINTS.SOCIAL_CONTENT_FROM_TRANSCRIPTS.GENERATE_CONTENT, contentData, 'generateSocialContentFromTranscripts');
  },

  // Social Media Freestyle Generation
  generateSocialMediaFreestyle: async (freestyleData) => {
    validateRequiredFields(freestyleData, [
      'target_platform',
      'content_type',
      'topic_subject',
      'content_idea_request',
      'target_audience',
      'brand_voice_tone',
      'post_goal',
      'content_length',
      'include_call_to_action',
      'hashtag_preference',
      'visual_elements',
      'special_requests'
    ], 'generateSocialMediaFreestyle');
    
    return handleApiCall(ENDPOINTS.SOCIAL_MEDIA_FREESTYLE.GENERATE_CONTENT, freestyleData, 'generateSocialMediaFreestyle');
  },

  // Social Content from URL Generation
  generateSocialContentFromURL: async (urlData) => {
    validateRequiredFields(urlData, [
      'website_url',
      'content_type',
      'target_platforms',
      'target_audience',
      'content_tone',
      'content_focus',
      'number_of_posts',
      'include_hashtags',
      'call_to_action',
      'additional_notes'
    ], 'generateSocialContentFromURL');
    
    return handleApiCall(ENDPOINTS.SOCIAL_CONTENT_FROM_URL.GENERATE_CONTENT, urlData, 'generateSocialContentFromURL');
  },

  // Social Posts Generation
  generateSocialPosts: async (postsData) => {
    validateRequiredFields(postsData, [
      'primary_platform',
      'content_tone',
      'post_goals',
      'brand_personality',
      'call_to_action',
      'product_service_description',
      'target_audience',
      'key_benefits_features'
    ], 'generateSocialPosts');
    
    return handleApiCall(ENDPOINTS.SOCIAL_POSTS.GENERATE_POSTS, postsData, 'generateSocialPosts');
  },

  // Speaker Topic Ideas Generation
  generateSpeakerTopicIdeas: async (topicData) => {
    validateRequiredFields(topicData, [
      'areas_of_expertise',
      'speaking_experience',
      'unique_perspective',
      'event_type',
      'session_duration',
      'target_audience',
      'session_format',
      'key_messages'
    ], 'generateSpeakerTopicIdeas');
    
    return handleApiCall(ENDPOINTS.SPEAKER_TOPIC_IDEAS.GENERATE_TOPICS, topicData, 'generateSpeakerTopicIdeas');
  },

  // Story-Based Emails Generation
  generateStoryBasedEmails: async (emailData) => {
    validateRequiredFields(emailData, [
      'business_type',
      'email_sequence_type',
      'target_audience',
      'brand_story',
      'founding_story',
      'challenge_story',
      'email_tone',
      'primary_email_goal',
      'success_story'
    ], 'generateStoryBasedEmails');
    
    return handleApiCall(ENDPOINTS.STORY_BASED_EMAILS.GENERATE_EMAILS, emailData, 'generateStoryBasedEmails');
  },

  // Story-Based Social Posts Generation
  generateStoryBasedSocialPosts: async (postsData) => {
    validateRequiredFields(postsData, [
      'business_type',
      'primary_social_platforms',
      'target_audience',
      'brand_story',
      'personal_journey_story',
      'challenge_story',
      'success_story',
      'customer_success_story',
      'post_tone',
      'primary_post_goal'
    ], 'generateStoryBasedSocialPosts');
    
    return handleApiCall(ENDPOINTS.STORY_BASED_SOCIAL_POSTS.GENERATE_POSTS, postsData, 'generateStoryBasedSocialPosts');
  },

  // Subject Line Generator
  generateSubjectLines: async (subjectLineData) => {
    validateRequiredFields(subjectLineData, [
      'email_type',
      'email_goal',
      'email_content_summary',
      'target_audience',
      'email_context',
      'tone_mood',
      'urgency_level',
      'keywords_to_include'
    ], 'generateSubjectLines');
    
    return handleApiCall(ENDPOINTS.SUBJECT_LINE_GENERATOR.GENERATE_SUBJECT_LINES, subjectLineData, 'generateSubjectLines');
  },

  // Transcript Rewrite & Summarize
  generateTranscriptRewrite: async (transcriptData) => {
    validateRequiredFields(transcriptData, [
      'transcript_type',
      'output_format',
      'transcript_content',
      'summary_length',
      'rewrite_style',
      'target_audience',
      'key_topics',
      'additional_instructions'
    ], 'generateTranscriptRewrite');
    
    return handleApiCall(ENDPOINTS.TRANSCRIPT_REWRITE.GENERATE_CONTENT, transcriptData, 'generateTranscriptRewrite');
  },

  // Testimonials to Benefits
  generateTestimonialsToBenefits: async (testimonialsData) => {
    validateRequiredFields(testimonialsData, [
      'product_name',
      'product_type',
      'target_audience',
      'testimonials',
      'current_known_benefits',
      'additional_information'
    ], 'generateTestimonialsToBenefits');
    
    return handleApiCall(ENDPOINTS.TESTIMONIALS_TO_BENEFITS.GENERATE_ANALYSIS, testimonialsData, 'generateTestimonialsToBenefits');
  },

  // Transcript Freestyle
  generateTranscriptFreestyle: async (transcriptData) => {
    validateRequiredFields(transcriptData, [
      'transcript_type',
      'transcript_content',
      'output_goal',
      'target_format',
      'target_audience',
      'specific_request',
      'additional_requirements'
    ], 'generateTranscriptFreestyle');
    
    return handleApiCall(ENDPOINTS.TRANSCRIPT_FREESTYLE.GENERATE_CONTENT, transcriptData, 'generateTranscriptFreestyle');
  },

  // Video Scripts from Transcripts
  generateVideoScriptsFromTranscripts: async (scriptData) => {
    validateRequiredFields(scriptData, [
      'transcript_type',
      'desired_video_format',
      'transcript_content',
      'target_duration',
      'target_audience',
      'video_style',
      'key_messages',
      'call_to_action',
      'platform_optimization'
    ], 'generateVideoScriptsFromTranscripts');
    
    return handleApiCall(ENDPOINTS.VIDEO_SCRIPTS_FROM_TRANSCRIPTS.GENERATE_SCRIPT, scriptData, 'generateVideoScriptsFromTranscripts');
  },

  // Video Scripts Ideas Generation
  generateVideoScriptsIdeas: async (scriptsData) => {
    validateRequiredFields(scriptsData, [
      'content_topic',
      'platform',
      'content_style',
      'video_length',
      'target_audience',
      'opening_hook',
      'main_message',
      'call_to_action',
      'trending_elements'
    ], 'generateVideoScriptsIdeas');
    
    return handleApiCall(ENDPOINTS.VIDEO_SCRIPTS_IDEAS.GENERATE_SCRIPTS, scriptsData, 'generateVideoScriptsIdeas');
  },

  // Transcript Visualization Generation
  generateTranscriptVisualization: async (visualizationData) => {
    validateRequiredFields(visualizationData, [
      'transcript_content',
      'content_type',
      'visualization_type',
      'target_audience',
      'content_purpose',
      'complexity_level',
      'key_messages',
      'design_preferences',
      'output_format',
      'additional_requirements'
    ], 'generateTranscriptVisualization');
    
    return handleApiCall(ENDPOINTS.TRANSCRIPT_VISUALIZATION.GENERATE_VISUALIZATION, visualizationData, 'generateTranscriptVisualization');
  },

  // Webinar Email Generation
  generateWebinarEmails: async (emailData) => {
    validateRequiredFields(emailData, [
      'webinar_title',
      'webinar_date',
      'webinar_time',
      'duration',
      'webinar_topic_description',
      'presenter_name',
      'presenter_credentials',
      'target_audience',
      'key_takeaways',
      'email_sequence_type',
      'webinar_platform',
      'registration_link',
      'brand_tone',
      'additional_information'
    ], 'generateWebinarEmails');
    
    return handleApiCall(ENDPOINTS.WEBINAR_EMAIL.GENERATE_EMAILS, emailData, 'generateWebinarEmails');
  },

  // Web Page Improver Generation
  generateWebPageImprovements: async (improvementData) => {
    validateRequiredFields(improvementData, [
      'website_url',
      'page_type',
      'current_page_goals'
    ], 'generateWebPageImprovements');
    
    return handleApiCall(ENDPOINTS.WEBPAGE_IMPROVER.GENERATE_IMPROVEMENTS, improvementData, 'generateWebPageImprovements');
  },

  // Website About Page Generation
  generateWebsiteAboutPage: async (aboutPageData) => {
    validateRequiredFields(aboutPageData, [
      'company_name',
      'founding_year',
      'company_mission'
    ], 'generateWebsiteAboutPage');
    
    return handleApiCall(ENDPOINTS.WEBSITE_ABOUT_PAGE.GENERATE_ABOUT_PAGE, aboutPageData, 'generateWebsiteAboutPage');
  },

  // Website Category Generation
  generateWebsiteCategory: async (categoryData) => {
    validateRequiredFields(categoryData, [
      'business_type',
      'industry',
      'target_audience',
      'primary_business_goals',
      'functional_requirements'
    ], 'generateWebsiteCategory');
    
    return handleApiCall(ENDPOINTS.WEBSITE_CATEGORY.GENERATE_CATEGORY, categoryData, 'generateWebsiteCategory');
  },

  // Website Contact Generation
  generateWebsiteContact: async (contactData) => {
    validateRequiredFields(contactData, [
      'contact_type',
      'expected_response_time',
      'business_name',
      'contact_objective',
      'required_form_fields'
    ], 'generateWebsiteContact');
    
    return handleApiCall(ENDPOINTS.WEBSITE_CONTACT.GENERATE_CONTACT, contactData, 'generateWebsiteContact');
  },

  // Website FAQs Generation
  generateWebsiteFAQs: async (faqsData) => {
    validateRequiredFields(faqsData, [
      'business_type',
      'industry',
      'target_audience',
      'common_customer_questions',
      'product_service_features',
      'support_policy_topics'
    ], 'generateWebsiteFAQs');
    
    return handleApiCall(ENDPOINTS.WEBSITE_FAQS.GENERATE_FAQS, faqsData, 'generateWebsiteFAQs');
  },

  // Website Home Page Generation
  generateWebsiteHomePage: async (homePageData) => {
    validateRequiredFields(homePageData, [
      'business_name',
      'business_type',
      'value_proposition',
      'target_audience',
      'main_products_services',
      'unique_advantages'
    ], 'generateWebsiteHomePage');
    
    return handleApiCall(ENDPOINTS.WEBSITE_HOME_PAGE.GENERATE_HOME_PAGE, homePageData, 'generateWebsiteHomePage');
  },

  // Website Pillar Page Generation
  generateWebsitePillarPage: async (pillarPageData) => {
    validateRequiredFields(pillarPageData, [
      'business_name',
      'industry',
      'main_topic',
      'target_audience',
      'target_keywords',
      'content_goals',
      'topic_depth',
      'content_length'
    ], 'generateWebsitePillarPage');
    
    return handleApiCall(ENDPOINTS.WEBSITE_PILLAR_PAGE.GENERATE_PILLAR_PAGE, pillarPageData, 'generateWebsitePillarPage');
  },

  // Website Speaking Media Page Generation
  generateWebsiteSpeakingMediaPage: async (speakingMediaData) => {
    validateRequiredFields(speakingMediaData, [
      'speaker_name',
      'area_of_expertise',
      'industry_focus',
      'speaking_topics',
      'target_audience',
      'key_achievements',
      'speaking_style',
      'geographic_scope'
    ], 'generateWebsiteSpeakingMediaPage');
    
    return handleApiCall(ENDPOINTS.WEBSITE_SPEAKING_MEDIA_PAGE.GENERATE_SPEAKING_MEDIA_PAGE, speakingMediaData, 'generateWebsiteSpeakingMediaPage');
  },

  // Welcome Sequence Generation
  generateWelcomeSequence: async (sequenceData) => {
    validateRequiredFields(sequenceData, [
      'business_name',
      'industry',
      'sequence_type',
      'target_audience',
      'sequence_length',
      'delivery_method',
      'main_goal',
      'key_messages',
      'primary_call_to_action'
    ], 'generateWelcomeSequence');
    
    return handleApiCall(ENDPOINTS.WELCOME_SEQUENCE.GENERATE_SEQUENCE, sequenceData, 'generateWelcomeSequence');
  },

  // Wholesale Information Generation
  generateWholesaleInformation: async (wholesaleData) => {
    validateRequiredFields(wholesaleData, [
      'business_name',
      'product_name',
      'product_description',
      'minimum_order_quantity',
      'unit_price',
      'wholesale_price',
      'bulk_discounts',
      'shipping_terms',
      'payment_terms'
    ], 'generateWholesaleInformation');
    
    return handleApiCall(ENDPOINTS.WHOLESALE_INFORMATION.GENERATE_INFORMATION, wholesaleData, 'generateWholesaleInformation');
  },

  // Word Bank Generation
  generateWordBank: async (wordBankData) => {
    validateRequiredFields(wordBankData, [
      'brand_name',
      'industry',
      'brand_personality',
      'tone_of_voice',
      'key_messages',
      'preferred_action_words',
      'words_to_avoid',
      'emotional_triggers'
    ], 'generateWordBank');
    
    return handleApiCall(ENDPOINTS.WORD_BANK.GENERATE_WORD_BANK, wordBankData, 'generateWordBank');
  },

  // General Group Community Posts Generation
  generateGeneralGroupCommunityPosts: async (postsData) => {
    validateRequiredFields(postsData, [
      'group_type',
      'community_name',
      'community_purpose',
      'target_audience',
      'engagement_goals',
      'post_frequency',
      'content_themes'
    ], 'generateGeneralGroupCommunityPosts');
    
    return handleApiCall(ENDPOINTS.GENERAL_GROUP_COMMUNITY_POSTS.GENERATE_POSTS, postsData, 'generateGeneralGroupCommunityPosts');
  },

  // Pinterest Title Generator
  // generatePinterestTitles: async (titleData) => {
  //   validateRequiredFields(titleData, ['product_name','product_category','key_benefits_features','title_length_preference','seasonality','target_audience','keywords_for_pinterest_seo','price_range','call_to_action_style'], 'generatePinterestTitles');
    
  //   return handleApiCall(ENDPOINTS.PINTEREST_TITLE_GENERATOR.GENERATE_TITLES, titleData, 'generatePinterestTitles');
  // }
  
};