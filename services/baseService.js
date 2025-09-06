import api from './api.js';
import { ENDPOINTS } from './config.js';
import { APIError } from './errorHandler.js';

// Base service class with common functionality
export class BaseService {
  constructor(baseEndpoint = '') {
    this.baseEndpoint = baseEndpoint;
    this.api = api;
  }

  // Helper to build full URL
  buildUrl(endpoint) {
    return this.baseEndpoint ? `${this.baseEndpoint}${endpoint}` : endpoint;
  }

  // Generic GET request with error handling
  async get(endpoint, config = {}) {
    try {
      const url = this.buildUrl(endpoint);
      const response = await this.api.get(url, config);
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error, 'GET', endpoint);
    }
  }

  // Generic POST request with error handling
  async post(endpoint, data = null, config = {}) {
    try {
      const url = this.buildUrl(endpoint);
      const response = await this.api.post(url, data, config);
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error, 'POST', endpoint);
    }
  }

  // Generic PUT request with error handling
  async put(endpoint, data = null, config = {}) {
    try {
      const url = this.buildUrl(endpoint);
      const response = await this.api.put(url, data, config);
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error, 'PUT', endpoint);
    }
  }

  // Generic DELETE request with error handling
  async delete(endpoint, config = {}) {
    try {
      const url = this.buildUrl(endpoint);
      const response = await this.api.delete(url, config);
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error, 'DELETE', endpoint);
    }
  }

  // Generic PATCH request with error handling
  async patch(endpoint, data = null, config = {}) {
    try {
      const url = this.buildUrl(endpoint);
      const response = await this.api.patch(url, data, config);
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error, 'PATCH', endpoint);
    }
  }

  // Response handler - can be overridden by child classes
  handleResponse(response) {
    // Return data directly, but preserve metadata
    const result = response.data;
    
    // Add metadata for debugging in development
    if (process.env.NODE_ENV === 'development') {
      result._metadata = {
        status: response.status,
        statusText: response.statusText,
        fromCache: response.fromCache || false,
        headers: response.headers,
      };
    }
    
    return result;
  }

  // Error handler - can be overridden by child classes
  handleError(error, method, endpoint) {
    // If it's already an APIError, just re-throw
    if (error instanceof APIError) {
      throw error;
    }

    // Create new APIError with context
    const apiError = new APIError(
      error.message || 'Request failed',
      error.status || error.response?.status || 0,
      error.data || error.response?.data,
      `${method} ${endpoint}`
    );

    throw apiError;
  }

  // Validate required fields in data
  validateRequired(data, requiredFields) {
    const missing = requiredFields.filter(field => 
      data[field] === undefined || data[field] === null || data[field] === ''
    );

    if (missing.length > 0) {
      throw new APIError(
        `Missing required fields: ${missing.join(', ')}`,
        400,
        { missingFields: missing }
      );
    }
  }

  // Transform data before sending (override in child classes)
  transformRequest(data) {
    return data;
  }

  // Transform response data (override in child classes)
  transformResponse(data) {
    return data;
  }

  // Helper for paginated requests
  async getPaginated(endpoint, params = {}) {
    const { page = 1, limit = 20, ...otherParams } = params;
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...otherParams,
    });

    const url = `${this.buildUrl(endpoint)}?${queryParams}`;
    return this.get(url);
  }

  // Helper for search requests
  async search(endpoint, query, params = {}) {
    const searchParams = new URLSearchParams({
      q: query,
      ...params,
    });

    const url = `${this.buildUrl(endpoint)}?${searchParams}`;
    return this.get(url);
  }
}
