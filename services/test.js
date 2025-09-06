// Test script to verify API services
// Run this in browser console to test the services

// Token is now managed via tokenManager - no localStorage needed

// Test data for social media plan generation
const testData = {
  business_type: "Online Education",
  industry: "Technology / Web Development", 
  target_audience: "Indian students aged 16–25, mostly college students or recent graduates, interested in learning coding, freelancing, or building a career in tech. They spend time on Instagram, YouTube, and search for job-ready skills.",
  primary_platforms: "Instagram, YouTube, LinkedIn",
  posting_schedule: "5 posts per week",
  content_goals: "Increase brand awareness, generate course signups, boost engagement through interactive and educational content",
  brand_personality_voice: "Friendly, encouraging, slightly humorous, and youth-focused while maintaining professional credibility",
  preferred_content_types: "Educational posts, behind-the-scenes, success stories, quick coding tips, interactive quizzes",
  content_themes_topics: "Web development trends, project walkthroughs, job interview tips, student journeys, freelancing insights",
  engagement_strategy: "Use Q&A stickers, weekly polls (e.g., HTML vs CSS), student challenge contests, and feature user-submitted projects"
};

// Function to test the API
async function testSocialMediaPlanAPI() {
  try {
    // Import the service (adjust path as needed)
    const { socialMediaPlanService } = await import('/services/socialMediaPlan.js');
    
    console.log('Testing Social Media Plan API...');
    const result = await socialMediaPlanService.generate30DayPlan(testData);
    console.log('✅ API Success:', result);
    return result;
  } catch (error) {
    console.error('❌ API Error:', error);
    return null;
  }
}

// Run the test
// testSocialMediaPlanAPI();
