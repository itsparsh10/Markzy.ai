// Handles in-memory caching for API responses to improve performance and reduce unnecessary network requests.
//It stores results of GET requests, so repeated requests for the same data can be served instantly from memory, reducing network calls and speeding up your app.
import { API_CONFIG } from './config.js';

// Simple in-memory cache for API responses
class APICache {
  constructor(defaultTTL = API_CONFIG.CACHE_TTL) {
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  // Generate cache key from URL and data
  generateKey(url, method = 'GET', data = null) {
    const key = `${method}:${url}`;
    if (data && method !== 'GET') {
      return `${key}:${JSON.stringify(data)}`;
    }
    return key;
  }

  // Check if item exists and is not expired
  has(key) {
    const item = this.cache.get(key);
    if (!item) return false;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  // Get cached item
  get(key) {
    if (this.has(key)) {
      const item = this.cache.get(key);
      console.log(`📦 Cache HIT: ${key}`);
      return item.data;
    }
    console.log(`📭 Cache MISS: ${key}`);
    return null;
  }

  // Set cache item
  set(key, data, ttl = this.defaultTTL) {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { data, expiry });
    console.log(`💾 Cache SET: ${key} (TTL: ${ttl}ms)`);
  }

  // Delete cache item
  delete(key) {
    const deleted = this.cache.delete(key);
    if (deleted) {
      console.log(`🗑️ Cache DELETE: ${key}`);
    }
    return deleted;
  }

  // Clear all cache
  clear() {
    this.cache.clear();
    console.log('🧹 Cache CLEARED');
  }

  // Clear expired items
  cleanup() {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      console.log(`🧹 Cache cleanup: ${cleaned} expired items removed`);
    }
  }

  // Get cache stats
  getStats() {
    const now = Date.now();
    let total = 0;
    let expired = 0;
    
    for (const [key, item] of this.cache.entries()) {
      total++;
      if (now > item.expiry) {
        expired++;
      }
    }
    
    return {
      total,
      expired,
      active: total - expired,
      size: this.cache.size,
    };
  }
}

// Export singleton instance
export const apiCache = new APICache();

// Cache strategies
export const CACHE_STRATEGIES = {
  NO_CACHE: 'no-cache',
  CACHE_FIRST: 'cache-first',//Performs a GET request.
  NETWORK_FIRST: 'network-first',
  CACHE_ONLY: 'cache-only',
  NETWORK_ONLY: 'network-only',
};

// Helper to determine if request should be cached
export const shouldCache = (method, url) => {
  // Only cache GET requests by default
  if (method !== 'GET') return false;
  
  // Don't cache auth endpoints
  if (url.includes('/auth/')) return false;
  
  // Don't cache real-time data
  if (url.includes('/notifications') || url.includes('/status')) return false;
  
  return true;
};
