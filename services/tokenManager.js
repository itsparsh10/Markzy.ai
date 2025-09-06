// Enhanced Token management with automatic refresh
class TokenManager {
  constructor() {
    // Set the provided Bearer token directly
    this.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzUyNTE5MzgzLCJpYXQiOjE3NTI1MTU3ODMsImp0aSI6IjlmYWRhYjhhZDA0YTRkZmRiNTFlMWFmMTNkOTE4ZjQyIiwidXNlcl9pZCI6Nn0.Q3S-0x46ZdEAqWMFTRqyvV2eXY7zc9jB1XrnKnsRf_g'
    this.refreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjYwMjE4MywiaWF0IjoxNzUyNTE1NzgzLCJqdGkiOiI3ZGQxMTc2NjY1MjI0NDQyOWRkNWZmOWMxODVjODUyMSIsInVzZXJfaWQiOjZ9.ANQKOWaREjNEdIQyk9rmXiVe_Cwg0HayGz1mpwjW2Xo';
    this.tokenExpiry = null;
    this.refreshPromise = null; // Prevent multiple refresh attempts
    this.listeners = new Set(); // Token change listeners
    
    // API credentials for token refresh
    this.apiCredentials = {
      username: "swagger_test",
      password: "testpass123"
    };
    this.tokenEndpoint = "https://aitools.codencreative.com/api/token/";
    
    // Initialize token expiry
    this.initializeTokenExpiry();
  }

  initializeTokenExpiry() {
    if (this.token) {
      try {
        const payload = JSON.parse(atob(this.token.split('.')[1]));
        this.tokenExpiry = payload.exp * 1000; // Convert to milliseconds
      } catch (e) {
        // If decode fails, set expiry to 1 hour from now
        this.tokenExpiry = Date.now() + (60 * 60 * 1000);
      }
    }
  }

  setTokens(accessToken, refreshToken = null, expiresIn = null) {
    this.token = accessToken;
    if (refreshToken) {
      this.refreshToken = refreshToken;
    }
    
    // Calculate expiry time
    if (expiresIn) {
      this.tokenExpiry = Date.now() + (expiresIn * 1000);
    } else {
      // Try to decode JWT expiry
      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        this.tokenExpiry = payload.exp * 1000; // Convert to milliseconds
      } catch (e) {
        // If decode fails, set expiry to 1 hour from now
        this.tokenExpiry = Date.now() + (60 * 60 * 1000);
      }
    }

    this.notifyListeners('token_updated', { token: accessToken });
  }

  getToken() {
    return this.token;
  }

  getRefreshToken() {
    return this.refreshToken;
  }

  clearTokens() {
    this.token = null;
    this.refreshToken = null;
    this.tokenExpiry = null;
    this.refreshPromise = null;
    this.notifyListeners('token_cleared');
  }

  hasValidToken() {
    return this.token !== null && !this.isTokenExpired();
  }

  isTokenExpired() {
    if (!this.tokenExpiry) return false;
    // Consider token expired 5 minutes before actual expiry
    return Date.now() >= (this.tokenExpiry - 5 * 60 * 1000);
  }

  shouldRefreshToken() {
    if (!this.refreshToken) return false;
    // Refresh if token expires in next 10 minutes
    return this.tokenExpiry && (Date.now() >= (this.tokenExpiry - 10 * 60 * 1000));
  }

  async refreshTokenIfNeeded() {
    if (!this.shouldRefreshToken()) {
      return this.token;
    }

    // If refresh is already in progress, wait for it
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.performTokenRefresh();
    
    try {
      const result = await this.refreshPromise;
      this.refreshPromise = null;
      return result;
    } catch (error) {
      this.refreshPromise = null;
      throw error;
    }
  }

  async performTokenRefresh() {
    try {
      console.log('Attempting to refresh token...');
      
      const response = await fetch(this.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.apiCredentials)
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.access) {
        throw new Error('No access token received from refresh endpoint');
      }

      // Update tokens with new ones
      this.setTokens(data.access, data.refresh);
      
      console.log('Token refreshed successfully');
      this.notifyListeners('token_refreshed', { token: data.access });
      
      return data.access;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearTokens();
      this.notifyListeners('token_refresh_failed', { error: error.message });
      throw error;
    }
  }

  // Get a valid token, refreshing if necessary
  async getValidToken() {
    if (this.shouldRefreshToken()) {
      return await this.refreshTokenIfNeeded();
    }
    return this.token;
  }

  // Event listeners for token changes
  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners(event, data = {}) {
    this.listeners.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('Token listener error:', error);
      }
    });
  }

  // Get token info for debugging
  getTokenInfo() {
    if (!this.token) return null;

    try {
      const payload = JSON.parse(atob(this.token.split('.')[1]));
      return {
        userId: payload.user_id,
        exp: payload.exp,
        iat: payload.iat,
        expiresAt: new Date(payload.exp * 1000).toISOString(),
        isExpired: this.isTokenExpired(),
        shouldRefresh: this.shouldRefreshToken(),
        timeUntilExpiry: this.tokenExpiry ? Math.max(0, this.tokenExpiry - Date.now()) : null
      };
    } catch (e) {
      return { error: 'Invalid token format' };
    }
  }
}

// Export a singleton instance
export const tokenManager = new TokenManager();

// USAGE EXAMPLES:
//
// 1. Basic usage with API calls (automatic refresh):
//    import api from './services/api.js';
//    
//    // The API service automatically handles token refresh
//    const response = await api.get('/affiliate/swipe/generate-groq/');
//
// 2. Manual token management:
//    import { tokenManager } from './services/tokenManager.js';
//    
//    // Get a valid token (refreshes if needed)
//    const token = await tokenManager.getValidToken();
//    
//    // Check token status
//    const tokenInfo = tokenManager.getTokenInfo();
//    console.log('Token expires at:', tokenInfo.expiresAt);
//    
//    // Listen for token events
//    const unsubscribe = tokenManager.addListener((event, data) => {
//      if (event === 'token_refreshed') {
//        console.log('Token was automatically refreshed');
//      }
//    });
//
// 3. Direct API call with Bearer token:
//    const token = await tokenManager.getValidToken();
//    const response = await fetch('https://aitools.codencreative.com/api/affiliate/swipe/generate-groq/', {
//      method: 'POST',
//      headers: {
//        'Authorization': `Bearer ${token}`,
//        'Content-Type': 'application/json'
//      },
//      body: JSON.stringify({ /* your data */ })
//    });
