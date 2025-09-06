// Centralized Error Handling
export class APIError extends Error {
  constructor(message, status = 0, data = null, endpoint = '') {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
    this.endpoint = endpoint;
    this.timestamp = new Date().toISOString();
  }

  // Check if error is retryable
  isRetryable() {
    return this.status === 0 || this.status >= 500 || this.status === 429;
  }

  // Get user-friendly message
  getUserMessage() {
    switch (this.status) {
      case 400:
        return this.data?.message || 'Please check your input and try again.';
      case 401:
        return 'Please log in to continue.';
      case 403:
        return 'You don\'t have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Server error. Please try again later.';
      case 0:
        return 'Network connection failed. Please check your internet connection.';
      default:
        return this.message || 'An unexpected error occurred.';
    }
  }
}

export const errorHandler = {
  // Process and normalize errors
  handle: (error, endpoint = '') => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      const message = data?.message || data?.error || data?.detail || `HTTP ${status} Error`;
      
      return new APIError(message, status, data, endpoint);
    } else if (error.request) {
      // Network error - no response received
      return new APIError('Network connection failed', 0, null, endpoint);
    } else {
      // Other error (programming, etc.)
      return new APIError(error.message || 'Unknown error occurred', 0, null, endpoint);
    }
  },

  // Check if error should trigger retry
  isRetryable: (error) => {
    if (error instanceof APIError) {
      return error.isRetryable();
    }
    return !error.response || error.response.status >= 500 || error.response.status === 429;
  },

  // Log error for debugging
  log: (error, context = '') => {
    const errorInfo = {
      timestamp: new Date().toISOString(),
      context,
      message: error.message,
      status: error.status || error.response?.status,
      endpoint: error.endpoint || error.config?.url,
      stack: error.stack,
    };

    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 API Error ${context ? `(${context})` : ''}`);
      console.error('Error Details:', errorInfo);
      console.groupEnd();
    }

    return errorInfo;
  },
};
