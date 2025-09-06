import axios from 'axios';
import { tokenManager } from './tokenManager.js';
import { API_CONFIG, COMMON_HEADERS } from './config.js';
import { errorHandler, APIError } from './errorHandler.js';
import { apiCache, shouldCache, CACHE_STRATEGIES } from './cache.js';

// Base API configuration
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: COMMON_HEADERS,
});

// Helper function to delay execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Request interceptor with enhanced features
api.interceptors.request.use(
  async (config) => {
    // Add request ID for tracking
    config.requestId = Math.random().toString(36).substr(2, 9);
    config.metadata = { startTime: Date.now() };

    // Add authentication token
    try {
      await tokenManager.refreshTokenIfNeeded();
      const token = tokenManager.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Token refresh failed:', error.message);
    }

    // Check cache for GET requests
    if (config.method === 'get' && shouldCache(config.method?.toUpperCase(), config.url)) {
      const cacheKey = apiCache.generateKey(config.url, config.method?.toUpperCase());
      const cachedData = apiCache.get(cacheKey);
      
      if (cachedData && config.cacheStrategy !== CACHE_STRATEGIES.NETWORK_FIRST) {
        // Return cached data by throwing a special error that will be caught
        const cachedResponse = {
          data: cachedData,
          status: 200,
          statusText: 'OK (Cached)',
          headers: {},
          config,
          fromCache: true,
        };
        config.cachedResponse = cachedResponse;
      }
    }

    // Initialize retry count
    config.retryCount = 0;

    console.log(`🚀 [${config.requestId}] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with enhanced error handling and caching
api.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const duration = Date.now() - response.config.metadata.startTime;
    const requestId = response.config.requestId;
    
    console.log(`✅ [${requestId}] ${response.status} ${response.config.url} (${duration}ms)`);

    // Cache successful GET responses
    if (response.config.method === 'get' && 
        shouldCache(response.config.method?.toUpperCase(), response.config.url) &&
        response.status === 200) {
      
      const cacheKey = apiCache.generateKey(
        response.config.url, 
        response.config.method?.toUpperCase()
      );
      apiCache.set(cacheKey, response.data);
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const requestId = originalRequest?.requestId || 'unknown';

    // Handle cached response (not really an error)
    if (originalRequest?.cachedResponse) {
      return originalRequest.cachedResponse;
    }

    // Handle 401 (Unauthorized) with token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        console.log(`🔄 [${requestId}] Attempting token refresh...`);
        await tokenManager.refreshTokenIfNeeded();
        const newToken = tokenManager.getToken();
        
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error(`❌ [${requestId}] Token refresh failed:`, refreshError.message);
        tokenManager.clearTokens();
        // Could emit event for app to handle login redirect
        return Promise.reject(errorHandler.handle(error, originalRequest.url));
      }
    }

    // Handle retryable errors
    if (errorHandler.isRetryable(error) && 
        originalRequest.retryCount < API_CONFIG.RETRY_ATTEMPTS) {
      
      originalRequest.retryCount++;
      const delayMs = API_CONFIG.RETRY_DELAY * originalRequest.retryCount;
      
      console.log(`🔄 [${requestId}] Retry ${originalRequest.retryCount}/${API_CONFIG.RETRY_ATTEMPTS} in ${delayMs}ms`);
      
      await delay(delayMs);
      return api(originalRequest);
    }

    // Log error and create APIError
    const apiError = errorHandler.handle(error, originalRequest?.url);
    errorHandler.log(apiError, `Request ${requestId}`);
    
    return Promise.reject(apiError);
  }
);

// Enhanced API methods with caching support The enhancedApi object wraps standard HTTP methods (get, post, put, delete, patch) and adds caching logic for GET requests.
const enhancedApi = {
  // GET with caching
  get: async (url, config = {}) => {
    return api.get(url, {
      cacheStrategy: CACHE_STRATEGIES.CACHE_FIRST,
      ...config,
    });
  },

  // POST (no caching)
  post: async (url, data, config = {}) => {
    // Clear related cache entries on POST
    if (shouldCache('GET', url)) {
      const cacheKey = apiCache.generateKey(url, 'GET');
      apiCache.delete(cacheKey);
    }
    return api.post(url, data, config);
  },

  // PUT (no caching)
  put: async (url, data, config = {}) => {
    return api.put(url, data, config);
  },

  // DELETE (no caching)
  delete: async (url, config = {}) => {
    // Clear related cache entries on DELETE
    if (shouldCache('GET', url)) {
      const cacheKey = apiCache.generateKey(url, 'GET');
      apiCache.delete(cacheKey);
    }
    return api.delete(url, config);
  },

  // PATCH (no caching)
  patch: async (url, data, config = {}) => {
    return api.patch(url, data, config);
  },

  // Manual cache control
  cache: {
    clear: () => apiCache.clear(),
    delete: (key) => apiCache.delete(key),
    get: (key) => apiCache.get(key),
    set: (key, data, ttl) => apiCache.set(key, data, ttl),
    stats: () => apiCache.getStats(),
    cleanup: () => apiCache.cleanup(),
  },

  // Request with custom options
  request: (config) => api.request(config),
};

export default enhancedApi;
