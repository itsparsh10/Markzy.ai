import { api, apiCache, apiLogger, performanceMonitor } from './index.js';

// Development utilities for debugging and monitoring
export const devUtils = {
  
  // Debug helper for API calls
  debug: {
    // Enable/disable detailed logging
    enableVerboseLogging() {
      window.__API_DEBUG__ = true;
      console.log('🔍 Verbose API logging enabled');
    },

    disableVerboseLogging() {
      window.__API_DEBUG__ = false;
      console.log('🔇 Verbose API logging disabled');
    },

    // Log all current API state
    logCurrentState() {
      console.group('🔍 Current API State');
      console.log('Cache Stats:', apiCache.getStats());
      console.log('Logger Stats:', apiLogger.getStats());
      console.log('Performance Stats:', performanceMonitor.getEndpointPerformance());
      console.groupEnd();
    },

    // Dump all logs to console
    dumpLogs() {
      const logs = apiLogger.getLogs();
      console.group('📋 All API Logs');
      logs.forEach(log => {
        const emoji = log.status === 'error' ? '❌' : log.status === 'success' ? '✅' : '⏳';
        console.log(`${emoji} [${log.id}] ${log.method} ${log.url} - ${log.statusCode || 'pending'} (${log.duration || '...'}ms)`);
      });
      console.groupEnd();
      return logs;
    },
  },

  // Cache management utilities
  cache: {
    // View cache contents
    inspect() {
      const stats = apiCache.getStats();
      console.group('💾 Cache Inspection');
      console.log('Stats:', stats);
      
      if (apiCache.cache) {
        console.log('Cached Keys:');
        for (const [key] of apiCache.cache.entries()) {
          console.log(`  - ${key}`);
        }
      }
      console.groupEnd();
      return stats;
    },

    // Clear specific cache entries
    clearPattern(pattern) {
      let cleared = 0;
      for (const [key] of apiCache.cache.entries()) {
        if (key.includes(pattern)) {
          apiCache.delete(key);
          cleared++;
        }
      }
      console.log(`🧹 Cleared ${cleared} cache entries matching "${pattern}"`);
      return cleared;
    },

    // Set custom cache entry
    set(key, data, ttl) {
      apiCache.set(key, data, ttl);
      console.log(`💾 Custom cache entry set: ${key}`);
    },

    // Export cache for backup
    export() {
      const cacheData = {};
      for (const [key, value] of apiCache.cache.entries()) {
        cacheData[key] = value;
      }
      console.log('📦 Cache exported:', cacheData);
      return cacheData;
    },
  },

  // Performance monitoring
  performance: {
    // Get slow endpoints
    getSlowEndpoints(threshold = 3000) {
      const slow = performanceMonitor.getSlowRequests(threshold);
      console.group(`🐌 Slow Endpoints (>${threshold}ms)`);
      slow.forEach(req => {
        console.log(`${req.method} ${req.url}: ${req.duration}ms`);
      });
      console.groupEnd();
      return slow;
    },

    // Get endpoint statistics
    getEndpointStats() {
      const stats = performanceMonitor.getEndpointPerformance();
      console.group('📊 Endpoint Performance Stats');
      stats.forEach(stat => {
        console.log(`${stat.endpoint}: ${stat.avgDuration}ms avg (${stat.calls} calls)`);
      });
      console.groupEnd();
      return stats;
    },

    // Monitor specific endpoint
    monitorEndpoint(endpoint) {
      console.log(`👀 Monitoring endpoint: ${endpoint}`);
      const originalRequest = api.request;
      
      api.request = function(config) {
        if (config.url?.includes(endpoint)) {
          const start = Date.now();
          return originalRequest.call(this, config).then(response => {
            const duration = Date.now() - start;
            console.log(`📊 ${endpoint} took ${duration}ms`);
            return response;
          });
        }
        return originalRequest.call(this, config);
      };
    },
  },

  // Error tracking utilities
  errors: {
    // Get error patterns
    getPatterns() {
      const patterns = performanceMonitor.getErrorPatterns();
      console.group('🚨 Error Patterns');
      patterns.forEach(pattern => {
        console.log(`${pattern.pattern}: ${pattern.count} occurrences`);
      });
      console.groupEnd();
      return patterns;
    },

    // Get recent errors
    getRecent(count = 10) {
      const errors = apiLogger.getLogs({ status: 'error' }).slice(-count);
      console.group(`🚨 Recent Errors (${count})`);
      errors.forEach(error => {
        console.log(`${error.method} ${error.url}: ${error.error?.message}`);
      });
      console.groupEnd();
      return errors;
    },

    // Track error rate
    getErrorRate() {
      const stats = apiLogger.getStats();
      console.log(`📊 Error Rate: ${stats.errorRate} (${stats.errors}/${stats.completed})`);
      return {
        rate: stats.errorRate,
        errors: stats.errors,
        total: stats.completed,
      };
    },
  },

  // Network utilities
  network: {
    // Test connectivity
    async testConnectivity() {
      console.log('🌐 Testing network connectivity...');
      
      try {
        const start = Date.now();
        await fetch('/favicon.ico', { method: 'HEAD' });
        const duration = Date.now() - start;
        
        console.log(`✅ Network OK (${duration}ms)`);
        return { connected: true, latency: duration };
      } catch (error) {
        console.log('❌ Network issue:', error.message);
        return { connected: false, error: error.message };
      }
    },

    // Simulate network conditions
    simulateSlowNetwork(delay = 2000) {
      console.log(`🐌 Simulating slow network (${delay}ms delay)`);
      
      const originalRequest = api.request;
      api.request = function(config) {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(originalRequest.call(this, config));
          }, delay);
        });
      };
      
      // Return function to restore normal speed
      return () => {
        api.request = originalRequest;
        console.log('⚡ Network speed restored');
      };
    },

    // Check online status
    checkOnlineStatus() {
      const online = navigator.onLine;
      console.log(`🌐 Online status: ${online ? 'Online' : 'Offline'}`);
      return online;
    },
  },

  // Request simulation utilities
  simulate: {
    // Generate fake API responses for testing
    mockResponse(endpoint, mockData, delay = 0) {
      console.log(`🎭 Mocking endpoint: ${endpoint}`);
      
      const originalRequest = api.request;
      api.request = function(config) {
        if (config.url?.includes(endpoint)) {
          return new Promise(resolve => {
            setTimeout(() => {
              resolve({
                data: mockData,
                status: 200,
                statusText: 'OK (Mocked)',
                headers: {},
                config,
                fromMock: true,
              });
            }, delay);
          });
        }
        return originalRequest.call(this, config);
      };
      
      // Return function to restore original behavior
      return () => {
        api.request = originalRequest;
        console.log(`🎭 Mock removed for: ${endpoint}`);
      };
    },

    // Simulate server errors
    simulateError(endpoint, errorStatus = 500, errorMessage = 'Simulated Error') {
      console.log(`💥 Simulating error for: ${endpoint} (${errorStatus})`);
      
      const originalRequest = api.request;
      api.request = function(config) {
        if (config.url?.includes(endpoint)) {
          return Promise.reject({
            response: {
              status: errorStatus,
              statusText: errorMessage,
              data: { message: errorMessage },
            },
            config,
            fromSimulation: true,
          });
        }
        return originalRequest.call(this, config);
      };
      
      // Return function to restore original behavior
      return () => {
        api.request = originalRequest;
        console.log(`💥 Error simulation removed for: ${endpoint}`);
      };
    },
  },

  // System utilities
  system: {
    // Get comprehensive system health
    async getHealth() {
      console.group('🏥 System Health Check');
      
      const health = {
        timestamp: new Date().toISOString(),
        network: await devUtils.network.testConnectivity(),
        cache: apiCache.getStats(),
        performance: performanceMonitor.getEndpointPerformance().slice(0, 5),
        errors: performanceMonitor.getErrorPatterns().slice(0, 3),
        memory: {
          cacheSize: apiCache.cache?.size || 0,
          logCount: apiLogger.requests?.size || 0,
        },
        browser: {
          userAgent: navigator.userAgent,
          online: navigator.onLine,
          cookieEnabled: navigator.cookieEnabled,
        },
      };
      
      console.log('Health Report:', health);
      console.groupEnd();
      
      return health;
    },

    // Reset entire system state
    reset() {
      console.log('🔄 Resetting API system...');
      apiCache.clear();
      apiLogger.clear();
      console.log('✅ System reset complete');
    },

    // Export system state
    export() {
      return {
        timestamp: new Date().toISOString(),
        cache: devUtils.cache.export(),
        logs: apiLogger.export(),
        health: devUtils.system.getHealth(),
      };
    },
  },
};

// Quick access shortcuts for console
export const debug = devUtils.debug;
export const cache = devUtils.cache;
export const perf = devUtils.performance;
export const errors = devUtils.errors;
export const network = devUtils.network;
export const simulate = devUtils.simulate;
export const system = devUtils.system;

// Auto-attach to window for easy console access in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.apiDev = devUtils;
  window.apiDebug = debug;
  window.apiCache = cache;
  window.apiPerf = perf;
  
  console.log('🛠️ API Dev Utils attached to window (window.apiDev)');
}
