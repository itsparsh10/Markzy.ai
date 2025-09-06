// Export all services from a single entry point

// Core API components
export { default as api } from './api.js';
export { tokenManager } from './tokenManager.js';
export { APIError, errorHandler } from './errorHandler.js';
export { apiCache, CACHE_STRATEGIES } from './cache.js';
export { apiLogger, performanceMonitor } from './logger.js';
export { BaseService } from './baseService.js';

// Configuration
export { API_CONFIG, ENDPOINTS, REQUEST_TYPES, COMMON_HEADERS } from './config.js';

// Service instances
export { authService } from './auth.js';
export { userService } from './user.js';
export { productService } from './products.js';
export { aiToolsService } from './aiTools.js';

// Testing and development utilities
export { apiTestSuite, quickTests, testAPI } from './apiTest.js';
export { devUtils, debug, cache, perf, errors, network, simulate, system } from './devUtils.js';

// Utility functions
export const clearAllCaches = () => {
  apiCache.clear();
  apiLogger.clear();
  console.log('🧹 All caches cleared');
};

export const getSystemHealth = () => {
  return {
    timestamp: new Date().toISOString(),
    cache: apiCache.getStats(),
    logger: apiLogger.getStats(),
    performance: performanceMonitor.getEndpointPerformance(),
    token: tokenManager.getTokenInfo(),
    errors: performanceMonitor.getErrorPatterns(),
  };
};

export const exportSystemState = () => {
  return {
    timestamp: new Date().toISOString(),
    health: getSystemHealth(),
    logs: apiLogger.export(),
    cacheData: apiCache.cache ? Object.fromEntries(apiCache.cache.entries()) : {},
  };
};

// Quick diagnostic function for console use
export const diagnose = async () => {
  console.group('🔍 API System Diagnosis');
  
  const health = getSystemHealth();
  console.log('📊 System Health:', health);
  
  const testResults = await quickTests.all();
  console.log('🧪 Test Results:', testResults.summary);
  
  console.groupEnd();
  
  return { health, testResults };
};
