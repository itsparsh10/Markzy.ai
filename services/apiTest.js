// import { socialMediaPlanService } from './socialMediaPlan.js';
// import { authService } from './auth.js';
// import { api, apiLogger, performanceMonitor, apiCache } from './index.js';

// // Comprehensive API Testing Utilities
// export const apiTestSuite = {
  
//   // Test social media plan generation
//   async testSocialMediaPlan() {
//     console.group('🧪 Testing Social Media Plan API');
    
//     try {
//       const testData = {
//         productName: 'Fitness App',
//         productCategory: 'Health & Fitness',
//         targetAudience: 'Fitness enthusiasts aged 25-40',
//         platformFocus: ['Instagram', 'TikTok'],
//         contentGoals: ['engagement', 'awareness'],
//         brandVoice: 'motivational',
//       };

//       console.log('📤 Sending request with data:', testData);
//       const startTime = Date.now();
      
//       const result = await socialMediaPlanService.generate30DayPlan(testData);
      
//       const duration = Date.now() - startTime;
//       console.log(`✅ Request completed in ${duration}ms`);
//       console.log('📥 Response format:', typeof result);
//       console.log('📥 Response structure:', Object.keys(result));
      
//       if (result.plan) {
//         console.log(`📊 Plan contains ${Array.isArray(result.plan) ? result.plan.length : 'unknown'} items`);
        
//         if (Array.isArray(result.plan) && result.plan.length > 0) {
//           console.log('📋 First plan item:', result.plan[0]);
//         }
//       }
      
//       return { success: true, result, duration };
      
//     } catch (error) {
//       console.error('❌ Social Media Plan test failed:', error);
//       return { success: false, error: error.message, status: error.status };
//     } finally {
//       console.groupEnd();
//     }
//   },

//   // Test authentication flow
//   async testAuth() {
//     console.group('🧪 Testing Authentication');
    
//     try {
//       // Test token info
//       const tokenInfo = authService.getTokenInfo();
//       console.log('🔑 Current token info:', tokenInfo);
      
//       // Test authentication status
//       const isAuth = authService.isAuthenticated();
//       console.log('🔒 Is authenticated:', isAuth);
      
//       return { success: true, tokenInfo, isAuthenticated: isAuth };
      
//     } catch (error) {
//       console.error('❌ Auth test failed:', error);
//       return { success: false, error: error.message };
//     } finally {
//       console.groupEnd();
//     }
//   },

//   // Test API caching
//   async testCaching() {
//     console.group('🧪 Testing API Caching');
    
//     try {
//       // Clear cache first
//       apiCache.clear();
      
//       // Make a GET request (should cache)
//       console.log('🔄 Making first request (should cache)...');
//       const start1 = Date.now();
//       await api.get('/test-endpoint-for-cache');
//       const duration1 = Date.now() - start1;
      
//       // Make same request again (should use cache)
//       console.log('🔄 Making second request (should use cache)...');
//       const start2 = Date.now();
//       await api.get('/test-endpoint-for-cache');
//       const duration2 = Date.now() - start2;
      
//       const cacheStats = apiCache.getStats();
//       console.log('📊 Cache stats:', cacheStats);
//       console.log(`⏱️ First request: ${duration1}ms, Second request: ${duration2}ms`);
      
//       return { 
//         success: true, 
//         cacheStats, 
//         timing: { first: duration1, second: duration2 } 
//       };
      
//     } catch (error) {
//       console.warn('⚠️ Cache test failed (expected if endpoint doesn\'t exist):', error.message);
//       return { success: false, error: error.message, expected: true };
//     } finally {
//       console.groupEnd();
//     }
//   },

//   // Test error handling
//   async testErrorHandling() {
//     console.group('🧪 Testing Error Handling');
    
//     try {
//       // Test with invalid endpoint
//       await api.get('/invalid-endpoint-test');
      
//     } catch (error) {
//       console.log('✅ Error handling working correctly');
//       console.log('📋 Error details:', {
//         name: error.name,
//         message: error.message,
//         status: error.status,
//         endpoint: error.endpoint,
//       });
      
//       return { success: true, errorHandled: true, errorDetails: error };
//     } finally {
//       console.groupEnd();
//     }
    
//     return { success: false, message: 'Error handling not working - should have thrown error' };
//   },

//   // Test network performance
//   async testPerformance() {
//     console.group('🧪 Testing Network Performance');
    
//     try {
//       const requests = [];
//       const testCount = 3;
      
//       for (let i = 0; i < testCount; i++) {
//         const start = Date.now();
        
//         try {
//           await socialMediaPlanService.generate30DayPlan({
//             productName: `Test Product ${i + 1}`,
//             targetAudience: 'Test audience',
//             platformFocus: ['Instagram'],
//           });
          
//           requests.push({
//             id: i + 1,
//             duration: Date.now() - start,
//             success: true,
//           });
          
//         } catch (error) {
//           requests.push({
//             id: i + 1,
//             duration: Date.now() - start,
//             success: false,
//             error: error.message,
//           });
//         }
//       }
      
//       const successfulRequests = requests.filter(r => r.success);
//       const avgDuration = successfulRequests.length > 0 
//         ? successfulRequests.reduce((sum, r) => sum + r.duration, 0) / successfulRequests.length 
//         : 0;
      
//       console.log('📊 Performance results:', {
//         totalRequests: testCount,
//         successful: successfulRequests.length,
//         failed: testCount - successfulRequests.length,
//         averageDuration: Math.round(avgDuration),
//         requests,
//       });
      
//       return { 
//         success: true, 
//         stats: { 
//           total: testCount,
//           successful: successfulRequests.length,
//           avgDuration: Math.round(avgDuration),
//           requests 
//         }
//       };
      
//     } catch (error) {
//       console.error('❌ Performance test failed:', error);
//       return { success: false, error: error.message };
//     } finally {
//       console.groupEnd();
//     }
//   },

//   // Get system diagnostics
//   async getSystemDiagnostics() {
//     console.group('🔍 System Diagnostics');
    
//     try {
//       const diagnostics = {
//         timestamp: new Date().toISOString(),
//         cache: apiCache.getStats(),
//         logger: apiLogger.getStats(),
//         performance: performanceMonitor.getEndpointPerformance(),
//         slowRequests: performanceMonitor.getSlowRequests(2000),
//         errorPatterns: performanceMonitor.getErrorPatterns(),
//         token: authService.getTokenInfo(),
//         environment: {
//           userAgent: navigator.userAgent,
//           url: window.location.href,
//           online: navigator.onLine,
//         },
//       };
      
//       console.log('📊 System diagnostics:', diagnostics);
//       return diagnostics;
      
//     } catch (error) {
//       console.error('❌ Diagnostics failed:', error);
//       return { error: error.message };
//     } finally {
//       console.groupEnd();
//     }
//   },

//   // Run all tests
//   async runAllTests() {
//     console.group('🧪 Running Complete API Test Suite');
    
//     const results = {
//       timestamp: new Date().toISOString(),
//       tests: {},
//     };
    
//     try {
//       // Run individual tests
//       results.tests.auth = await this.testAuth();
//       results.tests.socialMediaPlan = await this.testSocialMediaPlan();
//       results.tests.caching = await this.testCaching();
//       results.tests.errorHandling = await this.testErrorHandling();
//       results.tests.performance = await this.testPerformance();
      
//       // Get system diagnostics
//       results.diagnostics = await this.getSystemDiagnostics();
      
//       // Calculate summary
//       const testNames = Object.keys(results.tests);
//       const successfulTests = testNames.filter(name => results.tests[name].success);
      
//       results.summary = {
//         total: testNames.length,
//         successful: successfulTests.length,
//         failed: testNames.length - successfulTests.length,
//         successRate: Math.round((successfulTests.length / testNames.length) * 100),
//       };
      
//       console.log('📊 Test Suite Summary:', results.summary);
      
//       if (results.summary.successRate === 100) {
//         console.log('🎉 All tests passed!');
//       } else {
//         console.warn(`⚠️ ${results.summary.failed} tests failed`);
//       }
      
//       return results;
      
//     } catch (error) {
//       console.error('❌ Test suite execution failed:', error);
//       results.error = error.message;
//       return results;
//     } finally {
//       console.groupEnd();
//     }
//   },
// };

// // Simple test functions for quick testing
// export const quickTests = {
//   // Quick social media plan test
//   socialMedia: () => apiTestSuite.testSocialMediaPlan(),
  
//   // Quick auth test
//   auth: () => apiTestSuite.testAuth(),
  
//   // Quick diagnostics
//   diagnostics: () => apiTestSuite.getSystemDiagnostics(),
  
//   // Run all tests
//   all: () => apiTestSuite.runAllTests(),
// };

// // Backward compatibility - original test function
// export const testAPI = async () => {
//   const testData = {
//     business_type: "Online Education",
//     industry: "Technology / Web Development",
//     target_audience: "Indian students aged 16–25, mostly college students or recent graduates, interested in learning coding, freelancing, or building a career in tech. They spend time on Instagram, YouTube, and search for job-ready skills.",
//     primary_platforms: "Instagram, YouTube, LinkedIn",
//     posting_schedule: "5 posts per week",
//     content_goals: "Increase brand awareness, generate course signups, boost engagement through interactive and educational content",
//     brand_personality_voice: "Friendly, encouraging, slightly humorous, and youth-focused while maintaining professional credibility",
//     preferred_content_types: "Educational posts, behind-the-scenes, success stories, quick coding tips, interactive quizzes",
//     content_themes_topics: "Web development trends, project walkthroughs, job interview tips, student journeys, freelancing insights",
//     engagement_strategy: "Use Q&A stickers, weekly polls (e.g., HTML vs CSS), student challenge contests, and feature user-submitted projects"
//   };

//   try {
//     console.log('🚀 Testing API with token...');
//     const result = await socialMediaPlanService.generate30DayPlan(testData);
//     console.log('✅ API Success:', result);
//     return result;
//   } catch (error) {
//     console.error('❌ API Error:', error);
//     console.error('Error details:', error.response?.data);
//     return null;
//   }
// };

// // Export main test function for browser console
// export { apiTestSuite as default };
