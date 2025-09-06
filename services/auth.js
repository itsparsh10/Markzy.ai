import { BaseService } from './baseService.js';
import { ENDPOINTS } from './config.js';
import { tokenManager } from './tokenManager.js';
import { APIError } from './errorHandler.js';

// Enhanced Authentication Service
class AuthService extends BaseService {
  constructor() {
    super(); // No base endpoint
  }

  // Validate credentials
  validateCredentials(credentials) {
    const { email, password } = credentials;
    
    if (!email) {
      throw new APIError('Email is required', 400);
    }
    
    if (!email.includes('@')) {
      throw new APIError('Invalid email format', 400);
    }
    
    if (!password) {
      throw new APIError('Password is required', 400);
    }
    
    if (password.length < 6) {
      throw new APIError('Password must be at least 6 characters', 400);
    }
  }

  // Validate registration data
  validateRegistration(userData) {
    const { email, password, confirmPassword, firstName, lastName } = userData;
    
    this.validateCredentials({ email, password });
    
    if (confirmPassword && password !== confirmPassword) {
      throw new APIError('Passwords do not match', 400);
    }
    
    if (!firstName || firstName.trim().length < 2) {
      throw new APIError('First name must be at least 2 characters', 400);
    }
    
    if (!lastName || lastName.trim().length < 2) {
      throw new APIError('Last name must be at least 2 characters', 400);
    }
  }

  // Transform user data for registration
  transformRegistrationData(userData) {
    return {
      email: userData.email.toLowerCase().trim(),
      password: userData.password,
      first_name: userData.firstName?.trim(),
      last_name: userData.lastName?.trim(),
      username: userData.username || userData.email.toLowerCase().trim(),
      ...userData,
    };
  }

  // User login
  async login(credentials) {
    this.validateCredentials(credentials);
    
    const loginData = {
      email: credentials.email.toLowerCase().trim(),
      password: credentials.password,
    };

    const response = await this.post(ENDPOINTS.AUTH.LOGIN, loginData);
    
    // Store tokens after successful login
    if (response.access) {
      tokenManager.setTokens(response.access, response.refresh);
    }
    
    return {
      user: response.user,
      access: response.access,
      refresh: response.refresh,
      loginTime: new Date().toISOString(),
    };
  }

  // User registration
  async register(userData) {
    this.validateRegistration(userData);
    const transformedData = this.transformRegistrationData(userData);
    
    const response = await this.post(ENDPOINTS.AUTH.REGISTER || '/auth/register/', transformedData);
    
    // Store tokens after successful registration
    if (response.access) {
      tokenManager.setTokens(response.access, response.refresh);
    }
    
    return {
      user: response.user,
      access: response.access,
      refresh: response.refresh,
      registrationTime: new Date().toISOString(),
    };
  }

  // Logout
  async logout() {
    try {
      // Attempt to notify server about logout
      await this.post(ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // Log error but don't fail logout
      console.warn('Server logout failed:', error.message);
    } finally {
      // Always clear tokens on logout
      tokenManager.clearTokens();
    }
    
    return { success: true, logoutTime: new Date().toISOString() };
  }

  // Refresh token
  async refreshToken() {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new APIError('No refresh token available', 401);
    }
    
    const response = await this.post(ENDPOINTS.AUTH.REFRESH, { 
      refresh: refreshToken 
    });
    
    // Update access token
    if (response.access) {
      tokenManager.setTokens(response.access, refreshToken);
    }
    
    return response;
  }

  // Password reset request
  async requestPasswordReset(email) {
    if (!email || !email.includes('@')) {
      throw new APIError('Valid email is required', 400);
    }
    
    return this.post('/auth/password-reset/', { 
      email: email.toLowerCase().trim() 
    });
  }

  // Confirm password reset
  async confirmPasswordReset(resetData) {
    const { token, password, confirmPassword } = resetData;
    
    if (!token) {
      throw new APIError('Reset token is required', 400);
    }
    
    if (!password || password.length < 6) {
      throw new APIError('Password must be at least 6 characters', 400);
    }
    
    if (confirmPassword && password !== confirmPassword) {
      throw new APIError('Passwords do not match', 400);
    }
    
    return this.post('/auth/password-reset-confirm/', {
      token,
      password,
    });
  }

  // Verify email
  async verifyEmail(verificationData) {
    return this.post(ENDPOINTS.AUTH.VERIFY || '/auth/verify-email/', verificationData);
  }

  // Change password
  async changePassword(passwordData) {
    const { currentPassword, newPassword, confirmPassword } = passwordData;
    
    if (!currentPassword) {
      throw new APIError('Current password is required', 400);
    }
    
    if (!newPassword || newPassword.length < 6) {
      throw new APIError('New password must be at least 6 characters', 400);
    }
    
    if (confirmPassword && newPassword !== confirmPassword) {
      throw new APIError('New passwords do not match', 400);
    }
    
    return this.post('/auth/change-password/', {
      old_password: currentPassword,
      new_password: newPassword,
    });
  }

  // Get user profile
  async getProfile() {
    return this.get('/auth/user/');
  }

  // Update user profile
  async updateProfile(profileData) {
    return this.patch('/auth/user/', profileData);
  }

  // Check if user is authenticated
  isAuthenticated() {
    return tokenManager.hasValidToken();
  }

  // Set token manually (for testing or external auth)
  setToken(accessToken, refreshToken = null) {
    tokenManager.setTokens(accessToken, refreshToken);
  }

  // Get current token
  getToken() {
    return tokenManager.getToken();
  }

  // Get token info
  getTokenInfo() {
    return tokenManager.getTokenInfo();
  }

  // Check token expiry
  isTokenExpired() {
    return tokenManager.isTokenExpired();
  }

  // Add token change listener
  onTokenChange(callback) {
    return tokenManager.addListener(callback);
  }
}

// Export service instance
export const authService = new AuthService();
